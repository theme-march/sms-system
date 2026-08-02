import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { createAuditLog } from '@/src/lib/audit';
import { toClientData } from '@/src/lib/serialize';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requirePermission(PERMISSIONS.LEGACY_MIGRATE);
    const { id } = await context.params;
    const body = await request.json();
    if (body.confirm !== true) {
      return NextResponse.json({ error: 'Explicit confirmation is required' }, { status: 400 });
    }
    if (!body.academicYearId || !body.billingYear || !body.billingMonth || !body.dueDate) {
      return NextResponse.json(
        { error: 'academicYearId, billingYear, billingMonth, and dueDate are required' },
        { status: 400 },
      );
    }

    const invoice = await prisma.$transaction(async (tx) => {
      const legacy = await tx.legacyInstallment.findFirst({
        where: { id, schoolId: session.schoolId },
        include: { payments: true },
      });
      if (!legacy) throw new Error('LEGACY_NOT_FOUND');
      if (legacy.migrationStatus !== 'ISOLATED') throw new Error('LEGACY_ALREADY_MIGRATED');
      if (!legacy.studentId) throw new Error('LEGACY_STUDENT_NOT_LINKED');

      const [student, year, feeType] = await Promise.all([
        tx.student.findFirst({ where: { id: legacy.studentId, schoolId: session.schoolId }, select: { id: true } }),
        tx.academicYear.findFirst({ where: { id: body.academicYearId, schoolId: session.schoolId }, select: { id: true } }),
        body.feeTypeId
          ? tx.feeType.findFirst({ where: { id: body.feeTypeId, schoolId: session.schoolId }, select: { id: true } })
          : Promise.resolve(null),
      ]);
      if (!student) throw new Error('LEGACY_STUDENT_NOT_FOUND');
      if (!year) throw new Error('ACADEMIC_YEAR_NOT_FOUND');
      if (body.feeTypeId && !feeType) throw new Error('FEE_TYPE_NOT_FOUND');

      const paidAmount = legacy.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
      const totalAmount = Number(legacy.amount);
      const dueAmount = Math.max(0, totalAmount - paidAmount);
      const created = await tx.studentInvoice.create({
        data: {
          schoolId: session.schoolId,
          studentId: student.id,
          academicYearId: year.id,
          feeTypeId: feeType?.id,
          invoiceNumber: `LEGACY-${legacy.id}-${Date.now()}`,
          billingYear: Number(body.billingYear),
          billingMonth: Number(body.billingMonth),
          issueDate: new Date(),
          dueDate: new Date(body.dueDate),
          subtotal: totalAmount,
          totalAmount,
          paidAmount,
          dueAmount,
          paymentStatus: dueAmount === 0 ? 'paid' : paidAmount > 0 ? 'partially_paid' : 'unpaid',
        },
      });
      await tx.legacyInstallment.update({
        where: { id: legacy.id },
        data: {
          migrationStatus: 'MIGRATED',
          migratedInvoiceId: created.id,
          authorizedById: session.id,
          migratedAt: new Date(),
        },
      });
      return created;
    });

    await createAuditLog({
      schoolId: session.schoolId,
      userId: session.id,
      action: 'UPDATE',
      module: 'Legacy Installments',
      recordId: id,
      details: `Authorized migration to invoice ${invoice.invoiceNumber}`,
    });
    return NextResponse.json(toClientData(invoice), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Legacy migration failed';
    const known = ['LEGACY_NOT_FOUND', 'LEGACY_ALREADY_MIGRATED', 'LEGACY_STUDENT_NOT_LINKED', 'LEGACY_STUDENT_NOT_FOUND', 'ACADEMIC_YEAR_NOT_FOUND', 'FEE_TYPE_NOT_FOUND'];
    return NextResponse.json({ error: message }, { status: known.includes(message) ? 400 : authorizationStatus(error) });
  }
}
