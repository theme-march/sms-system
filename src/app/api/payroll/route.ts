import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { createAuditLog } from '@/src/lib/audit';
import { toClientData } from '@/src/lib/serialize';
import { PayrollService } from '@/src/services/payroll.service';

const structure = z.object({ action: z.literal('createStructure'), name: z.string().trim().min(2).max(100), code: z.string().trim().min(2).max(30), description: z.string().trim().max(300).optional().default(''), basic: z.coerce.number().positive(), houseRent: z.coerce.number().min(0).default(0), medical: z.coerce.number().min(0).default(0), deduction: z.coerce.number().min(0).default(0) });
const assignment = z.object({ action: z.literal('assignStructure'), userId: z.string().min(1), salaryStructureId: z.string().min(1), effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });
const generate = z.object({ action: z.literal('generatePayroll'), year: z.coerce.number().int().min(2020).max(2100), month: z.coerce.number().int().min(1).max(12), workingDays: z.coerce.number().int().min(1).max(31) });
const approve = z.object({ action: z.literal('approvePeriod'), periodId: z.string().min(1) });
const pay = z.object({ action: z.literal('recordPayment'), payrollId: z.string().min(1), amount: z.coerce.number().positive(), method: z.enum(['CASH','BANK','CHEQUE','MOBILE_MONEY']), reference: z.string().trim().max(100).optional().default('') });
const adjust = z.object({ action: z.literal('adjustPayroll'), payrollId: z.string().min(1), type: z.enum(['ADDITION','DEDUCTION']), amount: z.coerce.number().positive(), reason: z.string().trim().min(3).max(200) });
const removeStructure = z.object({ action: z.literal('deleteStructure'), id: z.string().min(1) });
const schema = z.discriminatedUnion('action', [structure, assignment, generate, approve, pay, adjust, removeStructure]);

export async function GET() {
  try {
    const session = await requirePermission(PERMISSIONS.PAYROLL_VIEW);
    const [payrolls, periods, structures, components, assignments, teachers, employees, payments, adjustments, payslips] = await Promise.all([
      prisma.payroll.findMany({ where: { schoolId: session.schoolId }, orderBy: { createdAt: 'desc' }, take: 500 }),
      prisma.payrollPeriod.findMany({ where: { schoolId: session.schoolId }, orderBy: [{ payrollYear: 'desc' }, { payrollMonth: 'desc' }] }),
      prisma.salaryStructure.findMany({ where: { schoolId: session.schoolId }, orderBy: { name: 'asc' } }),
      prisma.salaryComponent.findMany({ where: { salaryStructureId: { in: (await prisma.salaryStructure.findMany({ where: { schoolId: session.schoolId }, select: { id: true } })).map((item) => item.id) } } }),
      prisma.employeeSalaryAssignment.findMany({ where: { schoolId: session.schoolId }, orderBy: { effectiveDate: 'desc' } }),
      prisma.teacher.findMany({ where: { schoolId: session.schoolId, status: 'ACTIVE', userId: { not: null } }, select: { userId: true, nameEn: true, employeeCode: true, designation: { select: { nameEn: true } } } }),
      prisma.employee.findMany({ where: { schoolId: session.schoolId, status: 'ACTIVE', userId: { not: null } }, select: { userId: true, nameEn: true, employeeCode: true, designation: { select: { nameEn: true } } } }),
      prisma.salaryPayment.findMany({ where: { payrollId: { in: (await prisma.payroll.findMany({ where: { schoolId: session.schoolId }, select: { id: true } })).map((item) => item.id) } }, orderBy: { paymentDate: 'desc' }, take: 500 }),
      prisma.payrollAdjustment.findMany({ where: { payrollId: { in: (await prisma.payroll.findMany({ where: { schoolId: session.schoolId }, select: { id: true } })).map((item) => item.id) } }, orderBy: { createdAt: 'desc' } }),
      prisma.payslip.findMany({ where: { payrollId: { in: (await prisma.payroll.findMany({ where: { schoolId: session.schoolId }, select: { id: true } })).map((item) => item.id) } } }),
    ]);
    const people = [...teachers.map((item) => ({ ...item, type: 'Teacher' })), ...employees.map((item) => ({ ...item, type: 'Employee' }))].filter((item, index, all) => all.findIndex((row) => row.userId === item.userId) === index);
    const peopleMap = new Map(people.map((item) => [item.userId, item]));
    const periodMap = new Map(periods.map((item) => [item.id, item]));
    const payrollData = payrolls.map((item) => ({ ...item, basicSalary: Number(item.basicSalary), totalAllowances: Number(item.totalAllowances), totalDeductions: Number(item.totalDeductions), overtime: Number(item.overtime), bonus: Number(item.bonus), tax: Number(item.tax), absenceDeduction: Number(item.absenceDeduction), grossSalary: Number(item.grossSalary), netSalary: Number(item.netSalary), paidAmount: Number(item.paidAmount), employee: peopleMap.get(item.userId) || { nameEn: 'Unlinked user', employeeCode: item.userId, type: 'Unknown' }, period: periodMap.get(item.payrollPeriodId), adjustments: adjustments.filter((row) => row.payrollId === item.id).map((row) => ({ ...row, amount: Number(row.amount) })), payslip: payslips.find((row) => row.payrollId === item.id) || null }));
    const totals = payrollData.reduce((sum, item) => ({ gross: sum.gross + item.grossSalary, net: sum.net + item.netSalary, paid: sum.paid + item.paidAmount, due: sum.due + Math.max(0, item.netSalary - item.paidAmount) }), { gross: 0, net: 0, paid: 0, due: 0 });
    return NextResponse.json(toClientData({ canGenerate: session.roles.includes('Super Admin') || session.permissions.includes(PERMISSIONS.PAYROLL_GENERATE), canApprove: session.roles.includes('Super Admin') || session.permissions.includes(PERMISSIONS.PAYROLL_APPROVE), payrolls: payrollData, periods, structures: structures.map((item) => ({ ...item, components: components.filter((row) => row.salaryStructureId === item.id).map((row) => ({ ...row, amount: Number(row.amount) })) })), assignments, people, payments: payments.map((item) => ({ ...item, amount: Number(item.amount) })), totals }));
  } catch (error) { console.error('GET /api/payroll error', error); return NextResponse.json({ error: 'Unable to load payroll.' }, { status: authorizationStatus(error) }); }
}

export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json());
    const needed = input.action === 'approvePeriod' ? PERMISSIONS.PAYROLL_APPROVE : PERMISSIONS.PAYROLL_GENERATE;
    const session = await requirePermission(needed);
    if (input.action === 'createStructure') {
      const record = await prisma.$transaction(async (tx) => {
        const created = await tx.salaryStructure.create({ data: { schoolId: session.schoolId, name: input.name, code: input.code.toUpperCase(), description: input.description || null } });
        await tx.salaryComponent.createMany({ data: [{ salaryStructureId: created.id, name: 'Basic Salary', type: 'EARNING', componentType: 'Basic Salary', amountType: 'FIXED', amount: input.basic }, ...(input.houseRent > 0 ? [{ salaryStructureId: created.id, name: 'House Rent', type: 'EARNING', componentType: 'House Rent', amountType: 'FIXED', amount: input.houseRent }] : []), ...(input.medical > 0 ? [{ salaryStructureId: created.id, name: 'Medical Allowance', type: 'EARNING', componentType: 'Medical Allowance', amountType: 'FIXED', amount: input.medical }] : []), ...(input.deduction > 0 ? [{ salaryStructureId: created.id, name: 'Standard Deduction', type: 'DEDUCTION', componentType: 'Standard Deduction', amountType: 'FIXED', amount: input.deduction }] : [])] });
        return created;
      });
      await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'CREATE', module: 'Payroll', recordId: record.id, details: `Created salary structure ${record.name}` });
      return NextResponse.json(toClientData(record), { status: 201 });
    }
    if (input.action === 'assignStructure') {
      const [person, salary] = await Promise.all([prisma.user.findFirst({ where: { id: input.userId, schoolId: session.schoolId }, select: { id: true } }), prisma.salaryStructure.findFirst({ where: { id: input.salaryStructureId, schoolId: session.schoolId, isActive: true }, select: { id: true } })]);
      if (!person || !salary) return NextResponse.json({ error: 'Employee or salary structure not found.' }, { status: 404 });
      await prisma.$transaction([prisma.employeeSalaryAssignment.updateMany({ where: { schoolId: session.schoolId, userId: input.userId, isActive: true }, data: { isActive: false } }), prisma.employeeSalaryAssignment.create({ data: { schoolId: session.schoolId, userId: input.userId, salaryStructureId: input.salaryStructureId, effectiveDate: new Date(`${input.effectiveDate}T12:00:00.000Z`) } })]);
      await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'CREATE', module: 'Payroll', details: 'Assigned salary structure to staff member' });
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    if (input.action === 'generatePayroll') {
      const start = new Date(Date.UTC(input.year, input.month - 1, 1, 12)); const end = new Date(Date.UTC(input.year, input.month, 0, 12));
      const record = await PayrollService.generatePayroll(session.schoolId, input.year, input.month, start, end, input.workingDays);
      await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'CREATE', module: 'Payroll', recordId: record.id, details: `Generated payroll ${input.month}/${input.year}` });
      return NextResponse.json(toClientData(record), { status: 201 });
    }
    if (input.action === 'approvePeriod') {
      const owned = await prisma.payrollPeriod.findFirst({ where: { id: input.periodId, schoolId: session.schoolId }, select: { id: true } }); if (!owned) return NextResponse.json({ error: 'Payroll period not found.' }, { status: 404 });
      const record = await PayrollService.approvePayroll(session.schoolId, input.periodId);
      await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'UPDATE', module: 'Payroll', recordId: record.id, details: 'Approved payroll period' }); return NextResponse.json(toClientData(record));
    }
    if (input.action === 'recordPayment') {
      const payroll = await prisma.payroll.findFirst({ where: { id: input.payrollId, schoolId: session.schoolId } }); if (!payroll || !['APPROVED','PARTIALLY_PAID'].includes(payroll.status)) return NextResponse.json({ error: 'Only approved payroll can be paid.' }, { status: 409 });
      const due = Number(payroll.netSalary) - Number(payroll.paidAmount); if (input.amount > due) return NextResponse.json({ error: `Payment cannot exceed ${due.toFixed(2)}.` }, { status: 400 });
      const newPaid = Number(payroll.paidAmount) + input.amount; const paid = newPaid >= Number(payroll.netSalary);
      await prisma.$transaction(async (tx) => { await tx.salaryPayment.create({ data: { payrollId: payroll.id, amount: input.amount, paymentMethod: input.method, transactionRef: input.reference || null, processedById: session.id } }); await tx.payroll.update({ where: { id: payroll.id }, data: { paidAmount: newPaid, status: paid ? 'PAID' : 'PARTIALLY_PAID' } }); if (paid) { await tx.payslip.upsert({ where: { payrollId: payroll.id }, create: { payrollId: payroll.id, payslipNumber: `PS-${Date.now()}-${payroll.id.slice(0,4)}` }, update: {} }); } });
      await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'CREATE', module: 'Payroll', recordId: payroll.id, details: `Recorded salary payment ${input.amount}` }); return NextResponse.json({ ok: true });
    }
    if (input.action === 'adjustPayroll') {
      const payroll = await prisma.payroll.findFirst({ where: { id: input.payrollId, schoolId: session.schoolId } }); if (!payroll || payroll.status !== 'DRAFT') return NextResponse.json({ error: 'Only draft payroll can be adjusted.' }, { status: 409 });
      const net = Number(payroll.netSalary) + (input.type === 'ADDITION' ? input.amount : -input.amount); if (net < 0) return NextResponse.json({ error: 'Deduction cannot make salary negative.' }, { status: 400 });
      await prisma.$transaction([prisma.payrollAdjustment.create({ data: { payrollId: payroll.id, type: input.type, amount: input.amount, reason: input.reason } }), prisma.payroll.update({ where: { id: payroll.id }, data: { netSalary: new Prisma.Decimal(net), bonus: input.type === 'ADDITION' ? { increment: input.amount } : undefined, totalDeductions: input.type === 'DEDUCTION' ? { increment: input.amount } : undefined } })]); return NextResponse.json({ ok: true });
    }
    const assigned = await prisma.employeeSalaryAssignment.count({ where: { salaryStructureId: input.id, isActive: true } }); if (assigned) return NextResponse.json({ error: 'Deactivate or reassign staff before deleting this structure.' }, { status: 409 });
    const owned = await prisma.salaryStructure.findFirst({ where: { id: input.id, schoolId: session.schoolId } }); if (!owned) return NextResponse.json({ error: 'Salary structure not found.' }, { status: 404 });
    await prisma.$transaction([prisma.salaryComponent.deleteMany({ where: { salaryStructureId: owned.id } }), prisma.employeeSalaryAssignment.deleteMany({ where: { salaryStructureId: owned.id } }), prisma.salaryStructure.delete({ where: { id: owned.id } })]); return NextResponse.json({ ok: true });
  } catch (error) { console.error('POST /api/payroll error', error); const message = error instanceof z.ZodError ? error.issues[0]?.message : error instanceof Error && !['UNAUTHORIZED','FORBIDDEN','SCHOOL_CONTEXT_REQUIRED'].includes(error.message) ? error.message : 'Payroll operation failed.'; return NextResponse.json({ error: message }, { status: authorizationStatus(error) === 500 ? 400 : authorizationStatus(error) }); }
}
