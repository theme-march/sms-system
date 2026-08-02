import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/src/lib/db/prisma';
import { getCurrentSession } from '@/src/lib/auth/session';
import { toClientData } from '@/src/lib/serialize';
import { createAuditLog } from '@/src/lib/audit';

const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.coerce.number().positive().max(10_000_000),
  paymentMethod: z.enum(['BKASH', 'NAGAD', 'CARD', 'BANK_TRANSFER']),
  transactionId: z.string().trim().min(4).max(120),
});

async function allowedStudentIds(userId: string, schoolId: string) {
  const student = await prisma.student.findFirst({ where: { userId, schoolId, status: 'ACTIVE' }, select: { id: true } });
  if (student) return [student.id];
  const guardian = await prisma.guardian.findFirst({ where: { userId, schoolId, status: 'ACTIVE', portalAccessEnabled: true }, select: { students: { where: { status: 'ACTIVE' }, select: { studentId: true } } } });
  return guardian?.students.map((item) => item.studentId) || [];
}

function status(total: number, paid: number, dueDate: Date) {
  if (paid >= total) return 'PAID' as const;
  if (paid > 0) return 'PARTIAL' as const;
  return dueDate < new Date() ? 'OVERDUE' as const : 'PENDING' as const;
}

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session?.schoolId) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const ids = await allowedStudentIds(session.id, session.schoolId);
  const requested = request.nextUrl.searchParams.get('studentId') || '';
  const studentId = requested || ids[0];
  if (!studentId || !ids.includes(studentId)) return NextResponse.json({ error: 'Student fee access is not permitted.' }, { status: 403 });
  const invoices = await prisma.feeInvoice.findMany({ where: { schoolId: session.schoolId, studentId }, include: { feeStructure: { select: { name: true, frequency: true } }, payments: { orderBy: { paidAt: 'desc' } } }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(toClientData(invoices.map((item) => { const total = Number(item.amount) - Number(item.discount); const paid = Number(item.paidAmount); return { ...item, amount: Number(item.amount), discount: Number(item.discount), paidAmount: paid, dueAmount: Math.max(0, total - paid), dueDate: item.dueDate.toISOString().slice(0, 10), createdAt: item.createdAt.toISOString(), payments: item.payments.map((payment) => ({ ...payment, amount: Number(payment.amount), paidAt: payment.paidAt.toISOString() })) }; })));
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session?.schoolId) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const parsed = paymentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid payment information.' }, { status: 400 });
  const invoice = await prisma.feeInvoice.findFirst({ where: { id: parsed.data.invoiceId, schoolId: session.schoolId } });
  if (!invoice) return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
  const ids = await allowedStudentIds(session.id, session.schoolId);
  if (!ids.includes(invoice.studentId)) return NextResponse.json({ error: 'You cannot pay this invoice.' }, { status: 403 });
  const total = Number(invoice.amount) - Number(invoice.discount);
  const due = total - Number(invoice.paidAmount);
  if (invoice.status === 'CANCELLED' || due <= 0) return NextResponse.json({ error: 'This invoice has no payable balance.' }, { status: 409 });
  if (parsed.data.amount > due) return NextResponse.json({ error: `Payment cannot exceed ${due.toFixed(2)}.` }, { status: 400 });
  const duplicate = await prisma.payment.findFirst({ where: { transactionId: parsed.data.transactionId, paymentMethod: parsed.data.paymentMethod } });
  if (duplicate) return NextResponse.json({ error: 'This transaction reference has already been used.' }, { status: 409 });
  const paidAmount = Number(invoice.paidAmount) + parsed.data.amount;
  const receiptNumber = `REC-ONLINE-${Date.now().toString().slice(-9)}`;
  const payment = await prisma.$transaction(async (tx) => {
    const record = await tx.payment.create({ data: { invoiceId: invoice.id, receiptNumber, amount: parsed.data.amount, paymentMethod: parsed.data.paymentMethod, transactionId: parsed.data.transactionId, notes: `Self-service payment by ${session.name}` } });
    await tx.feeInvoice.update({ where: { id: invoice.id }, data: { paidAmount, status: status(total, paidAmount, invoice.dueDate) } });
    return record;
  });
  await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'CREATE', module: 'Portal Fees', recordId: payment.id, details: `Self-service payment ${receiptNumber} for ${invoice.invoiceNumber}` });
  return NextResponse.json(toClientData({ receiptNumber, remainingDue: Math.max(0, total - paidAmount) }), { status: 201 });
}
