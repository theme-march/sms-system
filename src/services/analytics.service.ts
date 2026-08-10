'use server';

import prisma from '@/src/lib/db/prisma';
import { requirePermission } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { toClientData } from '@/src/lib/serialize';

export async function getDashboardAnalytics() {
  const session = await requirePermission(PERMISSIONS.DASHBOARD_VIEW);
  const schoolId = session.schoolId;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [tuitionTypes, examTypes, payrollPeriod] = await Promise.all([
    prisma.feeType.findMany({ where: { schoolId, category: 'TUITION' }, select: { id: true } }),
    prisma.feeType.findMany({ where: { schoolId, category: 'EXAM' }, select: { id: true } }),
    prisma.payrollPeriod.findUnique({
      where: { schoolId_payrollYear_payrollMonth: { schoolId, payrollYear: now.getFullYear(), payrollMonth: now.getMonth() + 1 } },
    }),
  ]);
  const tuitionIds = tuitionTypes.map((item) => item.id);
  const examIds = examTypes.map((item) => item.id);

  const [
    totalStudents, activeStudents, totalTeachers, totalEmployees, totalGuardians,
    newAdmissions, attendanceTotal, presentToday, absentToday, tuition, examFees,
    income, expense, payroll, unpaidSalaries, upcomingExams, pendingAdmissions,
    pendingLeave, recentActivities,
  ] = await Promise.all([
    prisma.student.count({ where: { schoolId } }),
    prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
    prisma.teacher.count({ where: { schoolId, status: 'ACTIVE' } }),
    prisma.employee.count({ where: { schoolId, status: 'ACTIVE' } }),
    prisma.guardian.count({ where: { schoolId, status: 'ACTIVE' } }),
    prisma.student.count({ where: { schoolId, admissionDate: { gte: monthStart, lt: monthEnd } } }),
    prisma.studentAttendanceRecord.count({ where: { schoolId, date: { gte: today, lt: tomorrow } } }),
    prisma.studentAttendanceRecord.count({ where: { schoolId, date: { gte: today, lt: tomorrow }, status: 'present' } }),
    prisma.studentAttendanceRecord.count({ where: { schoolId, date: { gte: today, lt: tomorrow }, status: 'absent' } }),
    prisma.studentInvoice.aggregate({
      where: { schoolId, billingYear: now.getFullYear(), billingMonth: now.getMonth() + 1, feeTypeId: { in: tuitionIds } },
      _sum: { totalAmount: true, paidAmount: true, dueAmount: true },
    }),
    prisma.studentInvoice.aggregate({
      where: { schoolId, feeTypeId: { in: examIds }, paidAmount: { gt: 0 } },
      _sum: { paidAmount: true },
    }),
    prisma.financialTransaction.aggregate({
      where: { schoolId, transactionType: 'CREDIT', transactionDate: { gte: monthStart, lt: monthEnd } },
      _sum: { amount: true },
    }),
    prisma.financialTransaction.aggregate({
      where: { schoolId, transactionType: 'DEBIT', transactionDate: { gte: monthStart, lt: monthEnd } },
      _sum: { amount: true },
    }),
    payrollPeriod
      ? prisma.payroll.aggregate({ where: { schoolId, payrollPeriodId: payrollPeriod.id }, _sum: { netSalary: true, paidAmount: true } })
      : Promise.resolve({ _sum: { netSalary: null, paidAmount: null } }),
    payrollPeriod
      ? prisma.payroll.count({ where: { schoolId, payrollPeriodId: payrollPeriod.id, status: { not: 'PAID' } } })
      : Promise.resolve(0),
    prisma.exam.findMany({ where: { schoolId, endDate: { gte: today } }, orderBy: { startDate: 'asc' }, take: 5 }),
    prisma.admissionApplication.count({ where: { schoolId, status: { in: ['submitted', 'under_review', 'correction_requested', 'waiting_list'] } } }),
    prisma.leaveApplication.count({ where: { schoolId, status: 'PENDING' } }),
    prisma.auditLog.findMany({ where: { schoolId }, orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  return toClientData({
    totalStudents, activeStudents, totalTeachers, totalEmployees, totalGuardians, newAdmissions,
    attendance: {
      recorded: attendanceTotal,
      present: presentToday,
      absent: absentToday,
      rate: attendanceTotal ? Number(((presentToday / attendanceTotal) * 100).toFixed(1)) : 0,
    },
    tuitionInvoiced: Number(tuition._sum.totalAmount ?? 0),
    tuitionCollected: Number(tuition._sum.paidAmount ?? 0),
    currentMonthDues: Number(tuition._sum.dueAmount ?? 0),
    examFeeCollection: Number(examFees._sum.paidAmount ?? 0),
    monthlyIncome: Number(income._sum.amount ?? 0),
    monthlyExpense: Number(expense._sum.amount ?? 0),
    currentMonthPayroll: Number(payroll._sum.netSalary ?? 0),
    payrollPaid: Number(payroll._sum.paidAmount ?? 0),
    unpaidSalaries,
    upcomingExams,
    pendingAdmissionApplications: pendingAdmissions,
    pendingLeaveApplications: pendingLeave,
    recentActivities,
    generatedAt: now,
  });
}
