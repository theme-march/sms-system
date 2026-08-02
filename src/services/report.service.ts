import prisma from '@/src/lib/db/prisma';
import { requirePermission } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { toClientData } from '@/src/lib/serialize';

export const REPORT_TYPES = [
  'student', 'admission', 'enrollment', 'promotion', 'attendance', 'class-routine',
  'exam-routine', 'exam-result', 'subject-performance', 'class-performance',
  'fee-collection', 'monthly-tuition', 'exam-fee', 'outstanding-due',
  'scholarship-waiver', 'income', 'expense', 'profit-loss', 'payroll',
  'salary-payment', 'teacher-workload', 'audit-activity',
] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

const REPORT_COLUMN_KEYS: Record<ReportType, string[]> = {
  student: ['admissionNumber', 'studentCode', 'studentName', 'className', 'sectionName', 'rollNumber', 'phone', 'status', 'admissionDate'],
  admission: ['applicationNumber', 'trackingCode', 'studentName', 'className', 'groupName', 'phone', 'status', 'paymentStatus', 'createdAt'],
  enrollment: ['admissionNumber', 'studentName', 'academicYear', 'session', 'className', 'sectionName', 'groupName', 'rollNumber', 'enrollmentType', 'status'],
  promotion: ['admissionNumber', 'studentName', 'academicYear', 'session', 'className', 'sectionName', 'groupName', 'rollNumber', 'enrollmentType', 'status'],
  attendance: ['date', 'studentName', 'className', 'sectionName', 'subjectName', 'status', 'remarks'],
  'class-routine': ['weekday', 'className', 'sectionName', 'groupName', 'subjectName', 'teacherName', 'startTime', 'endTime', 'status'],
  'exam-routine': ['date', 'className', 'sectionName', 'groupName', 'subjectName', 'startTime', 'endTime', 'status'],
  'exam-result': ['exam', 'admissionNumber', 'studentName', 'className', 'sectionName', 'subjectName', 'marksObtained', 'maxMarks', 'grade'],
  'subject-performance': ['name', 'count', 'average', 'passRate'],
  'class-performance': ['name', 'count', 'average', 'passRate'],
  'fee-collection': ['receiptNumber', 'studentName', 'amount', 'date', 'remarks'],
  'monthly-tuition': ['invoiceNumber', 'studentName', 'month', 'year', 'totalAmount', 'paidAmount', 'dueAmount', 'paymentStatus', 'dueDate'],
  'exam-fee': ['invoiceNumber', 'studentName', 'month', 'year', 'totalAmount', 'paidAmount', 'dueAmount', 'paymentStatus', 'dueDate'],
  'outstanding-due': ['invoiceNumber', 'studentName', 'month', 'year', 'totalAmount', 'paidAmount', 'dueAmount', 'paymentStatus', 'dueDate'],
  'scholarship-waiver': ['type', 'studentName', 'title', 'amount', 'isPercentage', 'status'],
  income: ['transactionNumber', 'transactionType', 'category', 'amount', 'description', 'transactionDate'],
  expense: ['transactionNumber', 'transactionType', 'category', 'amount', 'description', 'transactionDate'],
  'profit-loss': ['income', 'expense', 'profitOrLoss'],
  payroll: ['userId', 'grossSalary', 'netSalary', 'paidAmount', 'dueAmount', 'status', 'createdAt'],
  'salary-payment': ['userId', 'amount', 'paymentMethod', 'transactionRef', 'paymentDate'],
  'teacher-workload': ['teacherName', 'assignments', 'classes', 'subjects'],
  'audit-activity': ['action', 'module', 'recordId', 'details', 'userId', 'createdAt'],
};

export interface ReportFilters {
  academicYearId?: string; sessionId?: string; startDate?: string; endDate?: string;
  classId?: string; sectionId?: string; groupId?: string; subjectId?: string;
  studentId?: string; teacherId?: string; month?: number; year?: number;
  paymentStatus?: string; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc';
  page?: number; pageSize?: number;
}

const labels: Record<string, string> = {
  admissionNumber: 'Admission No.', studentCode: 'Student Code', studentName: 'Student',
  className: 'Class', sectionName: 'Section', groupName: 'Group', subjectName: 'Subject',
  teacherName: 'Teacher', academicYear: 'Academic Year', session: 'Session',
  applicationNumber: 'Application No.', trackingCode: 'Tracking Code', status: 'Status',
  date: 'Date', examDate: 'Exam Date', startTime: 'Start Time', endTime: 'End Time',
  marksObtained: 'Marks', maxMarks: 'Maximum Marks', average: 'Average', count: 'Count',
  invoiceNumber: 'Invoice No.', totalAmount: 'Total', paidAmount: 'Paid', dueAmount: 'Due',
  paymentStatus: 'Payment Status', amount: 'Amount', transactionType: 'Type',
  category: 'Category', description: 'Description', transactionDate: 'Transaction Date',
  grossSalary: 'Gross Salary', netSalary: 'Net Salary', receiptNumber: 'Receipt No.',
  action: 'Action', module: 'Module', details: 'Details', createdAt: 'Created At',
};

const dateRange = (filters: ReportFilters) => ({
  ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
  ...(filters.endDate ? { lte: new Date(`${filters.endDate}T23:59:59.999`) } : {}),
});
const numberValue = (value: unknown) =>
  value && typeof value === 'object' && 'toNumber' in value
    ? (value as { toNumber(): number }).toNumber()
    : value;
const normalize = (row: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(row).map(([key, value]) => [
    key,
    value instanceof Date ? value.toISOString() : numberValue(value),
  ]));

function finish(rows: Record<string, unknown>[], filters: ReportFilters, title: string, reportType: ReportType) {
  const search = filters.search?.trim().toLowerCase();
  let output = search
    ? rows.filter((row) => Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(search)))
    : rows;
  const sortBy = filters.sortBy;
  if (sortBy && output.some((row) => sortBy in row)) {
    const direction = filters.sortOrder === 'desc' ? -1 : 1;
    output = [...output].sort((a, b) =>
      String(a[sortBy] ?? '').localeCompare(String(b[sortBy] ?? ''), undefined, { numeric: true }) * direction,
    );
  }
  const total = output.length;
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.min(500, Math.max(1, filters.pageSize || 25));
  const data = output.slice((page - 1) * pageSize, page * pageSize).map(normalize);
  const keys = Array.from(new Set([...REPORT_COLUMN_KEYS[reportType], ...data.flatMap((row) => Object.keys(row))]));
  return {
    title, columns: keys.map((key) => ({ key, label: labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()) })),
    data, total, page, pageSize, totalPages: Math.ceil(total / pageSize), filters,
  };
}

async function nameMaps(rows: Record<string, any>[]) {
  const ids = (key: string) => [...new Set(rows.map((row) => row[key]).filter(Boolean))];
  const [students, classes, sections, groups, subjects, teachers, years, sessions] = await Promise.all([
    prisma.student.findMany({ where: { id: { in: ids('studentId') } }, select: { id: true, nameEn: true, admissionNumber: true } }),
    prisma.class.findMany({ where: { id: { in: ids('classId') } }, select: { id: true, name: true } }),
    prisma.section.findMany({ where: { id: { in: ids('sectionId') } }, select: { id: true, name: true } }),
    prisma.group.findMany({ where: { id: { in: ids('groupId') } }, select: { id: true, name: true } }),
    prisma.subject.findMany({ where: { id: { in: ids('subjectId') } }, select: { id: true, nameEn: true } }),
    prisma.teacher.findMany({ where: { id: { in: ids('teacherId') } }, select: { id: true, nameEn: true } }),
    prisma.academicYear.findMany({ where: { id: { in: ids('academicYearId') } }, select: { id: true, name: true } }),
    prisma.academicSession.findMany({ where: { id: { in: ids('sessionId') } }, select: { id: true, name: true } }),
  ]);
  const map = <T extends { id: string }>(items: T[], value: (item: T) => string) => new Map(items.map((item) => [item.id, value(item)]));
  return {
    students: map(students, (item) => item.nameEn), admissions: map(students, (item) => item.admissionNumber),
    classes: map(classes, (item) => item.name), sections: map(sections, (item) => item.name),
    groups: map(groups, (item) => item.name), subjects: map(subjects, (item) => item.nameEn),
    teachers: map(teachers, (item) => item.nameEn), years: map(years, (item) => item.name),
    sessions: map(sessions, (item) => item.name),
  };
}

export async function getReport(reportType: ReportType, filters: ReportFilters = {}) {
  const session = await requirePermission(PERMISSIONS.REPORTS_VIEW);
  if (!REPORT_TYPES.includes(reportType)) throw new Error('Unsupported report type');
  const schoolId = session.schoolId;
  const date = dateRange(filters);
  const take = 50000;
  let rows: Record<string, any>[] = [];
  let title: string = reportType;

  if (reportType === 'student') {
    const useEnrollment = Boolean(filters.academicYearId || filters.sessionId || filters.groupId);
    const data = await prisma.student.findMany({
      where: {
        schoolId,
        ...(useEnrollment
          ? { enrollments: { some: {
              ...(filters.academicYearId ? { academicYearId: filters.academicYearId } : {}),
              ...(filters.sessionId ? { sessionId: filters.sessionId } : {}),
              ...(filters.classId ? { classId: filters.classId } : {}),
              ...(filters.sectionId ? { sectionId: filters.sectionId } : {}),
              ...(filters.groupId ? { groupId: filters.groupId } : {}),
              enrollmentStatus: 'ACTIVE',
            } } }
          : {
              ...(filters.classId ? { classId: filters.classId } : {}),
              ...(filters.sectionId ? { sectionId: filters.sectionId } : {}),
            }),
      },
      include: { class: true, section: true }, take,
    });
    title = 'Student Report';
    rows = data.map((item) => ({ admissionNumber: item.admissionNumber, studentCode: item.studentCode, studentName: item.nameEn, className: item.class?.name, sectionName: item.section?.name, rollNumber: item.rollNumber, phone: item.phone, status: item.status, admissionDate: item.admissionDate }));
  } else if (reportType === 'admission') {
    const data = await prisma.admissionApplication.findMany({
      where: { schoolId, ...(filters.classId ? { classId: filters.classId } : {}), ...(Object.keys(date).length ? { createdAt: date } : {}) },
      include: { class: true, group: true }, take,
    });
    title = 'Admission Report';
    rows = data.map((item) => ({ applicationNumber: item.applicationNumber, trackingCode: item.trackingCode, studentName: item.studentNameEn, className: item.class.name, groupName: item.group?.name, phone: item.phone, status: item.status, paymentStatus: item.paymentStatus, createdAt: item.createdAt }));
  } else if (reportType === 'enrollment' || reportType === 'promotion') {
    const data = await prisma.studentEnrollment.findMany({
      where: { schoolId, ...(filters.academicYearId ? { academicYearId: filters.academicYearId } : {}), ...(filters.sessionId ? { sessionId: filters.sessionId } : {}), ...(filters.classId ? { classId: filters.classId } : {}), ...(filters.sectionId ? { sectionId: filters.sectionId } : {}), ...(filters.groupId ? { groupId: filters.groupId } : {}) },
      include: { student: true, academicYear: true, academicSession: true, class: true, section: true, group: true }, take,
    });
    title = reportType === 'promotion' ? 'Promotion Report' : 'Enrollment Report';
    rows = data.map((item) => ({ admissionNumber: item.student.admissionNumber, studentName: item.student.nameEn, academicYear: item.academicYear.name, session: item.academicSession?.name, className: item.class.name, sectionName: item.section.name, groupName: item.group?.name, rollNumber: item.rollNumber, enrollmentType: item.enrollmentType, status: item.enrollmentStatus }));
  } else if (reportType === 'attendance') {
    const data = await prisma.studentAttendanceRecord.findMany({
      where: { schoolId, ...(Object.keys(date).length ? { date } : {}), ...(filters.classId ? { classId: filters.classId } : {}), ...(filters.sectionId ? { sectionId: filters.sectionId } : {}), ...(filters.subjectId ? { subjectId: filters.subjectId } : {}), ...(filters.studentId ? { studentId: filters.studentId } : {}) }, take,
    });
    const maps = await nameMaps(data);
    title = 'Attendance Report';
    rows = data.map((item) => ({ date: item.date, studentName: maps.students.get(item.studentId), className: maps.classes.get(item.classId || ''), sectionName: maps.sections.get(item.sectionId || ''), subjectName: maps.subjects.get(item.subjectId || ''), status: item.status, remarks: item.remarks }));
  } else if (reportType === 'class-routine' || reportType === 'exam-routine') {
    const data: any[] = reportType === 'class-routine'
      ? await prisma.classRoutine.findMany({ where: { schoolId, ...(filters.academicYearId ? { academicYearId: filters.academicYearId } : {}), ...(filters.sessionId ? { sessionId: filters.sessionId } : {}), ...(filters.classId ? { classId: filters.classId } : {}), ...(filters.sectionId ? { sectionId: filters.sectionId } : {}), ...(filters.subjectId ? { subjectId: filters.subjectId } : {}), ...(filters.teacherId ? { teacherId: filters.teacherId } : {}) }, take })
      : await prisma.examRoutine.findMany({ where: { schoolId, ...(filters.academicYearId ? { academicYearId: filters.academicYearId } : {}), ...(filters.classId ? { classId: filters.classId } : {}), ...(filters.sectionId ? { sectionId: filters.sectionId } : {}), ...(filters.subjectId ? { subjectId: filters.subjectId } : {}), ...(Object.keys(date).length ? { examDate: date } : {}) }, take });
    const maps = await nameMaps(data);
    title = reportType === 'class-routine' ? 'Class Routine Report' : 'Exam Routine Report';
    rows = data.map((item) => ({ date: item.examDate, weekday: item.weekday, className: maps.classes.get(item.classId), sectionName: maps.sections.get(item.sectionId), groupName: maps.groups.get(item.groupId), subjectName: maps.subjects.get(item.subjectId), teacherName: maps.teachers.get(item.teacherId), startTime: item.startTime, endTime: item.endTime, status: item.status }));
  } else if (['exam-result', 'subject-performance', 'class-performance'].includes(reportType)) {
    const data = await prisma.mark.findMany({
      where: { exam: { schoolId }, ...(filters.subjectId ? { subjectId: filters.subjectId } : {}), ...(filters.studentId ? { studentId: filters.studentId } : {}), ...(filters.classId ? { student: { classId: filters.classId } } : {}) },
      include: { exam: true, student: { include: { class: true, section: true } }, subject: true }, take,
    });
    if (reportType === 'exam-result') {
      title = 'Exam Result Report';
      rows = data.map((item) => ({ exam: item.exam.name, admissionNumber: item.student.admissionNumber, studentName: item.student.nameEn, className: item.student.class?.name, sectionName: item.student.section?.name, subjectName: item.subject.nameEn, marksObtained: item.marksObtained, maxMarks: item.maxMarks, grade: item.grade }));
    } else {
      const grouped = new Map<string, { name: string; total: number; count: number; passed: number }>();
      for (const item of data) {
        const key = reportType === 'subject-performance' ? item.subjectId : item.student.classId || 'unassigned';
        const name = reportType === 'subject-performance' ? item.subject.nameEn : item.student.class?.name || 'Unassigned';
        const group = grouped.get(key) || { name, total: 0, count: 0, passed: 0 };
        group.total += Number(item.marksObtained); group.count++; if (Number(item.marksObtained) / Number(item.maxMarks) >= 0.33) group.passed++;
        grouped.set(key, group);
      }
      title = reportType === 'subject-performance' ? 'Subject Performance Report' : 'Class Performance Report';
      rows = [...grouped.values()].map((item) => ({ name: item.name, count: item.count, average: item.count ? Number((item.total / item.count).toFixed(2)) : 0, passRate: item.count ? Number(((item.passed / item.count) * 100).toFixed(2)) : 0 }));
    }
  } else if (['fee-collection', 'monthly-tuition', 'exam-fee', 'outstanding-due'].includes(reportType)) {
    if (reportType === 'fee-collection') {
      const data = await prisma.receipt.findMany({ where: { schoolId, ...(Object.keys(date).length ? { generatedAt: date } : {}) }, take });
      const maps = await nameMaps(data);
      title = 'Fee Collection Report';
      rows = data.map((item) => ({ receiptNumber: item.receiptNumber, studentName: maps.students.get(item.studentId), amount: item.totalPaid, date: item.generatedAt, remarks: item.remarks }));
    } else {
      const categories = reportType === 'monthly-tuition' ? ['TUITION'] : reportType === 'exam-fee' ? ['EXAM'] : [];
      const types = categories.length ? await prisma.feeType.findMany({ where: { schoolId, category: { in: categories } }, select: { id: true } }) : [];
      const data = await prisma.studentInvoice.findMany({ where: { schoolId, ...(filters.academicYearId ? { academicYearId: filters.academicYearId } : {}), ...(filters.studentId ? { studentId: filters.studentId } : {}), ...(filters.month ? { billingMonth: filters.month } : {}), ...(filters.year ? { billingYear: filters.year } : {}), ...(filters.paymentStatus ? { paymentStatus: filters.paymentStatus } : {}), ...(types.length ? { feeTypeId: { in: types.map((item) => item.id) } } : {}), ...(reportType === 'outstanding-due' ? { dueAmount: { gt: 0 } } : {}) }, take });
      const maps = await nameMaps(data);
      title = reportType === 'monthly-tuition' ? 'Monthly Tuition Report' : reportType === 'exam-fee' ? 'Exam Fee Report' : 'Outstanding Due Report';
      rows = data.map((item) => ({ invoiceNumber: item.invoiceNumber, studentName: maps.students.get(item.studentId), month: item.billingMonth, year: item.billingYear, totalAmount: item.totalAmount, paidAmount: item.paidAmount, dueAmount: item.dueAmount, paymentStatus: item.paymentStatus, dueDate: item.dueDate }));
    }
  } else if (reportType === 'scholarship-waiver') {
    const [scholarships, waivers] = await Promise.all([
      prisma.scholarship.findMany({ where: { schoolId, ...(filters.studentId ? { studentId: filters.studentId } : {}) }, take }),
      prisma.feeWaiver.findMany({ where: { schoolId, ...(filters.studentId ? { studentId: filters.studentId } : {}) }, take }),
    ]);
    const maps = await nameMaps([...scholarships, ...waivers]);
    title = 'Scholarship and Waiver Report';
    rows = [
      ...scholarships.map((item) => ({ type: 'Scholarship', studentName: maps.students.get(item.studentId), title: item.title, amount: item.percentageOrAmount, isPercentage: item.isPercentage, status: item.status })),
      ...waivers.map((item) => ({ type: 'Waiver', studentName: maps.students.get(item.studentId), title: item.reason, amount: item.waiverValue, isPercentage: item.waiverType === 'PERCENTAGE', status: item.status })),
    ];
  } else if (['income', 'expense', 'profit-loss'].includes(reportType)) {
    const data = await prisma.financialTransaction.findMany({ where: { schoolId, ...(Object.keys(date).length ? { transactionDate: date } : {}), ...(reportType === 'income' ? { transactionType: 'CREDIT' } : reportType === 'expense' ? { transactionType: 'DEBIT' } : {}) }, take });
    title = reportType === 'income' ? 'Income Report' : reportType === 'expense' ? 'Expense Report' : 'Profit and Loss Report';
    if (reportType === 'profit-loss') {
      const income = data.filter((item) => item.transactionType === 'CREDIT').reduce((sum, item) => sum + Number(item.amount), 0);
      const expense = data.filter((item) => item.transactionType === 'DEBIT').reduce((sum, item) => sum + Number(item.amount), 0);
      rows = [{ income, expense, profitOrLoss: income - expense }];
    } else rows = data.map((item) => ({ transactionNumber: item.transactionNumber, transactionType: item.transactionType, category: item.category, amount: item.amount, description: item.description, transactionDate: item.transactionDate }));
  } else if (reportType === 'payroll') {
    const data = await prisma.payroll.findMany({ where: { schoolId, ...(filters.paymentStatus ? { status: filters.paymentStatus } : {}) }, take });
    title = 'Payroll Report';
    rows = data.map((item) => ({ userId: item.userId, grossSalary: item.grossSalary, netSalary: item.netSalary, paidAmount: item.paidAmount, dueAmount: Number(item.netSalary) - Number(item.paidAmount), status: item.status, createdAt: item.createdAt }));
  } else if (reportType === 'salary-payment') {
    const payrolls = await prisma.payroll.findMany({ where: { schoolId }, select: { id: true, userId: true } });
    const payrollMap = new Map(payrolls.map((item) => [item.id, item.userId]));
    const data = await prisma.salaryPayment.findMany({ where: { payrollId: { in: [...payrollMap.keys()] }, ...(Object.keys(date).length ? { paymentDate: date } : {}) }, take });
    title = 'Salary Payment Report';
    rows = data.map((item) => ({ userId: payrollMap.get(item.payrollId), amount: item.amount, paymentMethod: item.paymentMethod, transactionRef: item.transactionRef, paymentDate: item.paymentDate }));
  } else if (reportType === 'teacher-workload') {
    const data = await prisma.teacherAssignment.findMany({ where: { schoolId, ...(filters.academicYearId ? { academicYearId: filters.academicYearId } : {}), ...(filters.teacherId ? { teacherId: filters.teacherId } : {}), ...(filters.classId ? { classId: filters.classId } : {}), ...(filters.sectionId ? { sectionId: filters.sectionId } : {}), ...(filters.subjectId ? { subjectId: filters.subjectId } : {}) }, include: { teacher: true, class: true, section: true, subject: true }, take });
    const grouped = new Map<string, { teacherName: string; assignments: number; classes: Set<string>; subjects: Set<string> }>();
    for (const item of data) {
      const group = grouped.get(item.teacherId) || { teacherName: item.teacher.nameEn, assignments: 0, classes: new Set(), subjects: new Set() };
      group.assignments++; group.classes.add(item.class.name); group.subjects.add(item.subject.nameEn); grouped.set(item.teacherId, group);
    }
    title = 'Teacher Workload Report';
    rows = [...grouped.values()].map((item) => ({ teacherName: item.teacherName, assignments: item.assignments, classes: [...item.classes].join(', '), subjects: [...item.subjects].join(', ') }));
  } else {
    const data = await prisma.auditLog.findMany({ where: { schoolId, ...(Object.keys(date).length ? { createdAt: date } : {}) }, orderBy: { createdAt: 'desc' }, take });
    title = 'Audit Activity Report';
    rows = data.map((item) => ({ action: item.action, module: item.module, recordId: item.recordId, details: item.details, userId: item.userId, createdAt: item.createdAt }));
  }

  return toClientData(finish(rows, filters, title, reportType));
}
