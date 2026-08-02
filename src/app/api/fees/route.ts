import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { createAuditLog } from '@/src/lib/audit';
import { toClientData } from '@/src/lib/serialize';

const structureSchema = z.object({
  action: z.literal('createStructure'),
  name: z.string().trim().min(2).max(120),
  amount: z.coerce.number().positive().max(10_000_000),
  frequency: z.string().trim().min(2).max(40).regex(/^[A-Za-z][A-Za-z0-9 _-]*$/, 'Frequency may contain letters, numbers, spaces, underscores and hyphens.'),
  description: z.string().trim().max(500).optional().default(''),
});
const invoiceSchema = z.object({
  action: z.literal('createInvoice'),
  studentId: z.string().min(1),
  feeStructureId: z.string().min(1),
  amount: z.coerce.number().positive().max(10_000_000),
  discount: z.coerce.number().min(0).max(10_000_000).default(0),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
const paymentSchema = z.object({
  action: z.literal('recordPayment'),
  invoiceId: z.string().min(1),
  amount: z.coerce.number().positive().max(10_000_000),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'BKASH', 'NAGAD', 'CHEQUE', 'CARD']),
  transactionId: z.string().trim().max(120).optional().default(''),
  notes: z.string().trim().max(500).optional().default(''),
});
const cancelSchema = z.object({ action: z.literal('cancelInvoice'), invoiceId: z.string().min(1) });
const updateStructureSchema = z.object({ action: z.literal('updateStructure'), id: z.string().min(1), name: z.string().trim().min(2).max(120), amount: z.coerce.number().positive().max(10_000_000), frequency: z.string().trim().min(2).max(40).regex(/^[A-Za-z][A-Za-z0-9 _-]*$/), description: z.string().trim().max(500).optional().default('') });
const deleteStructureSchema = z.object({ action: z.literal('deleteStructure'), id: z.string().min(1) });
const bulkSchema = z.object({
  action: z.literal('generateTargetedInvoices'),
  category: z.enum(['TUITION', 'EXAM', 'EVENT']),
  title: z.string().trim().min(2).max(120),
  amount: z.coerce.number().positive().max(10_000_000),
  frequency: z.string().trim().min(2).max(40),
  academicYearId: z.string().min(1),
  classId: z.string().min(1),
  groupId: z.string().optional().default(''),
  sectionId: z.string().optional().default(''),
  examId: z.string().optional().default(''),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
const requestSchema = z.discriminatedUnion('action', [structureSchema, updateStructureSchema, deleteStructureSchema, invoiceSchema, paymentSchema, cancelSchema, bulkSchema]);

function invoiceStatus(total: number, paid: number, dueDate: Date) {
  if (paid >= total) return 'PAID' as const;
  if (paid > 0) return 'PARTIAL' as const;
  if (dueDate < new Date()) return 'OVERDUE' as const;
  return 'PENDING' as const;
}

export async function GET() {
  try {
    const session = await requirePermission(PERMISSIONS.FEES_VIEW);
    const [structures, invoices, students, payments, academicYears, classes, classGroups, exams] = await Promise.all([
      prisma.feeStructure.findMany({ where: { schoolId: session.schoolId }, orderBy: { name: 'asc' } }),
      prisma.feeInvoice.findMany({
        where: { schoolId: session.schoolId },
        include: { student: { select: { nameEn: true, studentCode: true, class: { select: { name: true } }, section: { select: { name: true } } } }, feeStructure: { select: { name: true, frequency: true } }, payments: { orderBy: { paidAt: 'desc' } } },
        orderBy: { createdAt: 'desc' }, take: 500,
      }),
      prisma.student.findMany({ where: { schoolId: session.schoolId, status: 'ACTIVE' }, select: { id: true, nameEn: true, studentCode: true, class: { select: { name: true } }, section: { select: { name: true } } }, orderBy: { nameEn: 'asc' }, take: 2000 }),
      prisma.payment.findMany({ where: { invoice: { schoolId: session.schoolId } }, include: { invoice: { select: { invoiceNumber: true, student: { select: { nameEn: true, studentCode: true } } } } }, orderBy: { paidAt: 'desc' }, take: 300 }),
      prisma.academicYear.findMany({ where: { schoolId: session.schoolId, status: 'ACTIVE', deletedAt: null }, select: { id: true, name: true, isCurrent: true }, orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }] }),
      prisma.class.findMany({ where: { schoolId: session.schoolId, status: 'ACTIVE', deletedAt: null }, select: { id: true, name: true, sections: { where: { status: 'ACTIVE', deletedAt: null }, select: { id: true, name: true }, orderBy: { displayOrder: 'asc' } } }, orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }] }),
      prisma.classGroup.findMany({ where: { schoolId: session.schoolId, status: 'ACTIVE', deletedAt: null }, select: { academicYearId: true, classId: true, group: { select: { id: true, name: true } } } }),
      prisma.exam.findMany({ where: { schoolId: session.schoolId }, select: { id: true, name: true, year: true }, orderBy: { startDate: 'desc' }, take: 100 }),
    ]);
    const normalizedInvoices = invoices.map((item) => {
      const total = Number(item.amount) - Number(item.discount);
      const paid = Number(item.paidAmount);
      const computed = item.status === 'CANCELLED' ? 'CANCELLED' : invoiceStatus(total, paid, item.dueDate);
      return { ...item, amount: Number(item.amount), discount: Number(item.discount), paidAmount: paid, dueAmount: Math.max(0, total - paid), status: computed, dueDate: item.dueDate.toISOString().slice(0, 10), createdAt: item.createdAt.toISOString(), payments: item.payments.map((payment) => ({ ...payment, amount: Number(payment.amount), paidAt: payment.paidAt.toISOString() })) };
    });
    const totals = normalizedInvoices.filter((item) => item.status !== 'CANCELLED').reduce((sum, item) => ({ invoiced: sum.invoiced + item.amount - item.discount, collected: sum.collected + item.paidAmount, outstanding: sum.outstanding + item.dueAmount, overdue: sum.overdue + (item.status === 'OVERDUE' ? item.dueAmount : 0) }), { invoiced: 0, collected: 0, outstanding: 0, overdue: 0 });
    return NextResponse.json(toClientData({ canManage: session.roles.includes('Super Admin') || session.permissions.includes(PERMISSIONS.FEES_MANAGE), structures, invoices: normalizedInvoices, students, payments, totals, academicYears, classes, classGroups: classGroups.map((item) => ({ academicYearId: item.academicYearId, classId: item.classId, groupId: item.group.id, groupName: item.group.name })), exams }));
  } catch (error) {
    console.error('GET /api/fees error', error);
    return NextResponse.json({ error: 'Unable to load fees and invoices.' }, { status: authorizationStatus(error) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.FEES_MANAGE);
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid fee data.' }, { status: 400 });
    const input = parsed.data;
    if (input.action === 'createStructure') {
      const record = await prisma.feeStructure.create({ data: { schoolId: session.schoolId, name: input.name, amount: input.amount, frequency: input.frequency, description: input.description || null } });
      await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'CREATE', module: 'Fees', recordId: record.id, details: `Created fee structure ${record.name}` });
      return NextResponse.json(toClientData(record), { status: 201 });
    }
    if (input.action === 'updateStructure') {
      const owned = await prisma.feeStructure.findFirst({ where: { id: input.id, schoolId: session.schoolId }, select: { id: true } });
      if (!owned) return NextResponse.json({ error: 'Fee structure was not found.' }, { status: 404 });
      const record = await prisma.feeStructure.update({ where: { id: input.id }, data: { name: input.name, amount: input.amount, frequency: input.frequency, description: input.description || null } });
      await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'UPDATE', module: 'Fees', recordId: record.id, details: `Updated fee structure ${record.name}. Existing invoices were not changed.` });
      return NextResponse.json(toClientData(record));
    }
    if (input.action === 'deleteStructure') {
      const owned = await prisma.feeStructure.findFirst({ where: { id: input.id, schoolId: session.schoolId }, select: { id: true, name: true, _count: { select: { invoices: true } } } });
      if (!owned) return NextResponse.json({ error: 'Fee structure was not found.' }, { status: 404 });
      if (owned._count.invoices > 0) return NextResponse.json({ error: `Cannot delete this structure because ${owned._count.invoices} invoice(s) use it. Cancel unused invoices or keep the structure for financial history.` }, { status: 409 });
      await prisma.feeStructure.delete({ where: { id: owned.id } });
      await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'DELETE', module: 'Fees', recordId: owned.id, details: `Deleted unused fee structure ${owned.name}` });
      return NextResponse.json({ ok: true });
    }
    if (input.action === 'createInvoice') {
      const [student, structure] = await Promise.all([prisma.student.findFirst({ where: { id: input.studentId, schoolId: session.schoolId }, select: { id: true } }), prisma.feeStructure.findFirst({ where: { id: input.feeStructureId, schoolId: session.schoolId } })]);
      if (!student || !structure) return NextResponse.json({ error: 'Student or fee structure was not found.' }, { status: 404 });
      if (input.discount >= input.amount) return NextResponse.json({ error: 'Discount must be less than the invoice amount.' }, { status: 400 });
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;
      const record = await prisma.feeInvoice.create({ data: { schoolId: session.schoolId, studentId: input.studentId, feeStructureId: input.feeStructureId, invoiceNumber, amount: input.amount, discount: input.discount, dueDate: new Date(`${input.dueDate}T12:00:00.000Z`), status: invoiceStatus(input.amount - input.discount, 0, new Date(`${input.dueDate}T12:00:00.000Z`)) } });
      await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'CREATE', module: 'Fees', recordId: record.id, details: `Created invoice ${invoiceNumber}` });
      return NextResponse.json(toClientData(record), { status: 201 });
    }
    if (input.action === 'recordPayment') {
      const invoice = await prisma.feeInvoice.findFirst({ where: { id: input.invoiceId, schoolId: session.schoolId }, include: { student: { select: { nameEn: true } } } });
      if (!invoice || invoice.status === 'CANCELLED') return NextResponse.json({ error: 'Active invoice was not found.' }, { status: 404 });
      const total = Number(invoice.amount) - Number(invoice.discount);
      const due = total - Number(invoice.paidAmount);
      if (input.amount > due) return NextResponse.json({ error: `Payment cannot exceed the outstanding amount (${due.toFixed(2)}).` }, { status: 400 });
      const receiptNumber = `REC-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;
      const paidAmount = Number(invoice.paidAmount) + input.amount;
      const result = await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.create({ data: { invoiceId: invoice.id, receiptNumber, amount: input.amount, paymentMethod: input.paymentMethod, transactionId: input.transactionId || null, notes: input.notes || null } });
        await tx.feeInvoice.update({ where: { id: invoice.id }, data: { paidAmount, status: invoiceStatus(total, paidAmount, invoice.dueDate) } });
        return payment;
      });
      await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'CREATE', module: 'Fees', recordId: result.id, details: `Recorded ${receiptNumber} for ${invoice.invoiceNumber}` });
      return NextResponse.json(toClientData(result), { status: 201 });
    }
    if (input.action === 'generateTargetedInvoices') {
      if (input.category === 'EXAM' && !input.examId) return NextResponse.json({ error: 'Select an examination for exam fees.' }, { status: 400 });
      const enrollments = await prisma.studentEnrollment.findMany({
        where: { schoolId: session.schoolId, academicYearId: input.academicYearId, classId: input.classId, enrollmentStatus: 'ACTIVE', ...(input.sectionId ? { sectionId: input.sectionId } : {}), ...(input.groupId ? { groupId: input.groupId } : {}) },
        select: { studentId: true },
      });
      if (!enrollments.length) return NextResponse.json({ error: 'No active students match the selected class, group and section.' }, { status: 404 });
      const structureName = input.category === 'EXAM' ? `${input.title} · Exam Fee` : input.category === 'EVENT' ? `${input.title} · Event Fee` : input.title;
      let structure = await prisma.feeStructure.findFirst({ where: { schoolId: session.schoolId, name: structureName, frequency: input.frequency } });
      if (!structure) structure = await prisma.feeStructure.create({ data: { schoolId: session.schoolId, name: structureName, amount: input.amount, frequency: input.frequency, description: `${input.category} fee generated by targeted billing` } });
      const dueDate = new Date(`${input.dueDate}T12:00:00.000Z`);
      let generatedCount = 0;
      let skippedCount = 0;
      for (const enrollment of enrollments) {
        const duplicate = await prisma.feeInvoice.findFirst({ where: { schoolId: session.schoolId, studentId: enrollment.studentId, feeStructureId: structure.id, dueDate } });
        if (duplicate) { skippedCount++; continue; }
        await prisma.feeInvoice.create({ data: { schoolId: session.schoolId, studentId: enrollment.studentId, feeStructureId: structure.id, invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-7)}-${generatedCount}`, amount: input.amount, discount: 0, dueDate, status: invoiceStatus(input.amount, 0, dueDate) } });
        generatedCount++;
      }
      await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'CREATE', module: 'Fees', recordId: structure.id, details: `Generated ${generatedCount} ${input.category} invoices for targeted class/group/section; skipped ${skippedCount}` });
      return NextResponse.json({ generatedCount, skippedCount }, { status: 201 });
    }
    const invoice = await prisma.feeInvoice.findFirst({ where: { id: input.invoiceId, schoolId: session.schoolId }, select: { id: true, invoiceNumber: true, paidAmount: true } });
    if (!invoice) return NextResponse.json({ error: 'Invoice was not found.' }, { status: 404 });
    if (Number(invoice.paidAmount) > 0) return NextResponse.json({ error: 'An invoice with payments cannot be cancelled.' }, { status: 409 });
    await prisma.feeInvoice.update({ where: { id: invoice.id }, data: { status: 'CANCELLED' } });
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'UPDATE', module: 'Fees', recordId: invoice.id, details: `Cancelled invoice ${invoice.invoiceNumber}` });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('POST /api/fees error', error);
    const message = error instanceof Error && !['UNAUTHORIZED', 'FORBIDDEN', 'SCHOOL_CONTEXT_REQUIRED'].includes(error.message) ? error.message : 'Unable to save fee operation.';
    return NextResponse.json({ error: message }, { status: authorizationStatus(error) === 500 ? 500 : authorizationStatus(error) });
  }
}
