import { Prisma } from '@prisma/client';
import prisma from '@/src/lib/db/prisma';

export const IMPORT_TYPES = [
  'students', 'guardians', 'teachers', 'employees', 'subjects',
  'attendance', 'marks', 'fee-records', 'legacy-installments',
] as const;
export type ImportType = (typeof IMPORT_TYPES)[number];

export const IMPORT_TEMPLATES: Record<ImportType, string[]> = {
  students: ['admissionNumber', 'studentCode', 'nameEn', 'gender', 'dateOfBirth', 'phone', 'email', 'classId', 'sectionId', 'rollNumber'],
  guardians: ['name', 'relationship', 'phone', 'email', 'occupation', 'nationalId', 'address'],
  teachers: ['employeeCode', 'nameEn', 'phone', 'email', 'gender', 'joiningDate', 'qualification', 'departmentId', 'designationId', 'salary'],
  employees: ['employeeCode', 'nameEn', 'phone', 'email', 'joiningDate', 'employmentType', 'departmentId', 'designationId'],
  subjects: ['nameEn', 'nameBn', 'code', 'subjectType', 'description'],
  attendance: ['studentId', 'classId', 'sectionId', 'subjectId', 'date', 'status', 'remarks'],
  marks: ['examId', 'studentId', 'subjectId', 'marksObtained', 'maxMarks', 'grade', 'comments'],
  'fee-records': ['studentId', 'academicYearId', 'feeTypeId', 'invoiceNumber', 'billingYear', 'billingMonth', 'issueDate', 'dueDate', 'totalAmount', 'paidAmount', 'paymentStatus'],
  'legacy-installments': ['legacyStudentRef', 'studentId', 'academicYearLabel', 'installmentName', 'amount', 'dueDate', 'status', 'paymentAmount', 'paymentDate', 'paymentMethod', 'paymentReference'],
};

type RowError = { row: number; field: string; message: string; value?: unknown };
export type ValidatedRow = { row: number; data: Record<string, any>; errors: RowError[] };

const required: Record<ImportType, string[]> = {
  students: ['admissionNumber', 'studentCode', 'nameEn', 'dateOfBirth'],
  guardians: ['name', 'phone'],
  teachers: ['employeeCode', 'nameEn', 'phone', 'joiningDate'],
  employees: ['employeeCode', 'nameEn', 'phone', 'joiningDate'],
  subjects: ['nameEn', 'code'],
  attendance: ['studentId', 'date', 'status'],
  marks: ['examId', 'studentId', 'subjectId', 'marksObtained'],
  'fee-records': ['studentId', 'academicYearId', 'invoiceNumber', 'billingYear', 'billingMonth', 'issueDate', 'dueDate', 'totalAmount'],
  'legacy-installments': ['legacyStudentRef', 'installmentName', 'amount'],
};
const numericFields = new Set(['rollNumber', 'salary', 'marksObtained', 'maxMarks', 'billingYear', 'billingMonth', 'totalAmount', 'paidAmount', 'amount', 'paymentAmount']);
const dateFields = new Set(['dateOfBirth', 'joiningDate', 'date', 'issueDate', 'dueDate', 'paymentDate']);

export function mapColumns(rows: Record<string, any>[], mapping: Record<string, string> = {}) {
  return rows.map((row) => Object.fromEntries(
    Object.entries(row).map(([key, value]) => [mapping[key] || key.trim(), value]),
  ));
}

export function validateImportRows(type: ImportType, input: Record<string, any>[]): ValidatedRow[] {
  if (!IMPORT_TYPES.includes(type)) throw new Error('Unsupported import type');
  return input.map((raw, index) => {
    const data = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]));
    const errors: RowError[] = [];
    for (const field of required[type]) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        errors.push({ row: index + 2, field, message: `${field} is required`, value: data[field] });
      }
    }
    for (const [field, value] of Object.entries(data)) {
      if (value === '' || value === undefined || value === null) continue;
      if (numericFields.has(field) && !Number.isFinite(Number(value))) {
        errors.push({ row: index + 2, field, message: `${field} must be numeric`, value });
      }
      if (dateFields.has(field) && Number.isNaN(new Date(String(value)).getTime())) {
        errors.push({ row: index + 2, field, message: `${field} must be a valid date`, value });
      }
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
      errors.push({ row: index + 2, field: 'email', message: 'Invalid email address', value: data.email });
    }
    if (data.gender && !['MALE', 'FEMALE', 'OTHER'].includes(String(data.gender).toUpperCase())) {
      errors.push({ row: index + 2, field: 'gender', message: 'Gender must be MALE, FEMALE, or OTHER', value: data.gender });
    }
    if (type === 'attendance' && data.status && !['present', 'absent', 'late', 'leave', 'holiday'].includes(String(data.status).toLowerCase())) {
      errors.push({ row: index + 2, field: 'status', message: 'Invalid attendance status', value: data.status });
    }
    return { row: index + 2, data, errors };
  });
}

const optional = (value: unknown) => value === '' || value === undefined || value === null ? undefined : value;
const asDate = (value: unknown) => value ? new Date(String(value)) : undefined;
const asNumber = (value: unknown, fallback = 0) => value === '' || value === undefined || value === null ? fallback : Number(value);

async function createRow(tx: any, type: ImportType, schoolId: string, row: Record<string, any>, legacyImportId?: string, sourceRow = 0) {
  if (type === 'students') return tx.student.create({ data: {
    schoolId, admissionNumber: row.admissionNumber, studentCode: row.studentCode, nameEn: row.nameEn,
    nameBn: optional(row.nameBn), gender: String(row.gender || 'MALE').toUpperCase(), dateOfBirth: asDate(row.dateOfBirth)!,
    phone: optional(row.phone), email: optional(row.email), classId: optional(row.classId), sectionId: optional(row.sectionId),
    rollNumber: optional(row.rollNumber) === undefined ? undefined : asNumber(row.rollNumber),
  } });
  if (type === 'guardians') return tx.guardian.create({ data: {
    schoolId, name: row.name, relationship: row.relationship || 'PARENT', phone: row.phone,
    email: optional(row.email), occupation: optional(row.occupation), nationalId: optional(row.nationalId), address: optional(row.address),
  } });
  if (type === 'teachers') return tx.teacher.create({ data: {
    schoolId, employeeCode: row.employeeCode, nameEn: row.nameEn, phone: row.phone, email: optional(row.email),
    gender: String(row.gender || 'MALE').toUpperCase(), joiningDate: asDate(row.joiningDate)!,
    qualification: optional(row.qualification), departmentId: optional(row.departmentId), designationId: optional(row.designationId),
    salary: asNumber(row.salary),
  } });
  if (type === 'employees') return tx.employee.create({ data: {
    schoolId, employeeCode: row.employeeCode, nameEn: row.nameEn, phone: row.phone, email: optional(row.email),
    joiningDate: asDate(row.joiningDate)!, employmentType: row.employmentType || 'FULL_TIME',
    departmentId: optional(row.departmentId), designationId: optional(row.designationId),
  } });
  if (type === 'subjects') return tx.subject.create({ data: {
    schoolId, nameEn: row.nameEn, nameBn: optional(row.nameBn), code: row.code,
    subjectType: row.subjectType || 'compulsory', description: optional(row.description),
  } });
  if (type === 'attendance') return tx.studentAttendanceRecord.create({ data: {
    schoolId, studentId: row.studentId, classId: optional(row.classId), sectionId: optional(row.sectionId),
    subjectId: optional(row.subjectId), date: asDate(row.date)!, status: String(row.status).toLowerCase(), remarks: optional(row.remarks),
  } });
  if (type === 'marks') return tx.mark.upsert({
    where: { examId_studentId_subjectId: { examId: row.examId, studentId: row.studentId, subjectId: row.subjectId } },
    update: { marksObtained: asNumber(row.marksObtained), maxMarks: asNumber(row.maxMarks, 100), grade: optional(row.grade), comments: optional(row.comments) },
    create: { examId: row.examId, studentId: row.studentId, subjectId: row.subjectId, marksObtained: asNumber(row.marksObtained), maxMarks: asNumber(row.maxMarks, 100), grade: optional(row.grade), comments: optional(row.comments) },
  });
  if (type === 'fee-records') {
    const total = asNumber(row.totalAmount);
    const paid = asNumber(row.paidAmount);
    return tx.studentInvoice.create({ data: {
      schoolId, studentId: row.studentId, academicYearId: row.academicYearId, feeTypeId: optional(row.feeTypeId),
      invoiceNumber: row.invoiceNumber, billingYear: asNumber(row.billingYear), billingMonth: asNumber(row.billingMonth),
      issueDate: asDate(row.issueDate)!, dueDate: asDate(row.dueDate)!, subtotal: total, totalAmount: total,
      paidAmount: paid, dueAmount: Math.max(0, total - paid), paymentStatus: row.paymentStatus || (paid >= total ? 'paid' : paid > 0 ? 'partially_paid' : 'unpaid'),
    } });
  }
  const installment = await tx.legacyInstallment.create({ data: {
    legacyImportId: legacyImportId!, schoolId, studentId: optional(row.studentId),
    legacyStudentRef: row.legacyStudentRef, academicYearLabel: optional(row.academicYearLabel),
    installmentName: row.installmentName, amount: asNumber(row.amount), dueDate: asDate(row.dueDate),
    status: row.status || 'UNPAID', sourceRow, migrationStatus: 'ISOLATED',
  } });
  if (asNumber(row.paymentAmount) > 0) {
    await tx.legacyInstallmentPayment.create({ data: {
      legacyInstallmentId: installment.id, amount: asNumber(row.paymentAmount),
      paymentDate: asDate(row.paymentDate) || new Date(), paymentMethod: row.paymentMethod || 'UNKNOWN',
      reference: optional(row.paymentReference), sourceRow,
    } });
  }
  return installment;
}

export async function processImport(historyId: string, schoolId: string, userId: string) {
  const history = await prisma.importHistory.findFirst({ where: { id: historyId, schoolId, userId } });
  if (!history || history.status !== 'VALIDATED') throw new Error('Validated import not found');
  const payload = (history.payload as any)?.rows as ValidatedRow[] | undefined;
  if (!payload) throw new Error('Import preview payload is missing');
  const valid = payload.filter((row) => row.errors.length === 0);
  const successes: any[] = [];
  const failures: RowError[] = [];
  let legacyImportId: string | undefined;
  if (history.importType === 'legacy-installments') {
    const legacy = await prisma.legacyInstallmentImport.create({
      data: { importHistoryId: history.id, schoolId, importedById: userId, sourceName: history.fileName, recordCount: valid.length },
    });
    legacyImportId = legacy.id;
  }
  await prisma.importHistory.update({ where: { id: history.id }, data: { status: 'PROCESSING' } });
  const chunkSize = 100;
  for (let index = 0; index < valid.length; index += chunkSize) {
    const chunk = valid.slice(index, index + chunkSize);
    try {
      const result = await prisma.$transaction((tx) =>
        Promise.all(chunk.map((item) => createRow(tx, history.importType as ImportType, schoolId, item.data, legacyImportId, item.row))),
      );
      result.forEach((created: any, offset: number) => successes.push({ row: chunk[offset].row, id: created.id }));
    } catch {
      for (const item of chunk) {
        try {
          const created = await prisma.$transaction((tx) => createRow(tx, history.importType as ImportType, schoolId, item.data, legacyImportId, item.row));
          successes.push({ row: item.row, id: created.id });
        } catch (error) {
          failures.push({ row: item.row, field: '_row', message: error instanceof Error ? error.message : 'Database import failed' });
        }
      }
    }
  }
  const invalidErrors = payload.flatMap((row) => row.errors);
  await prisma.importHistory.update({
    where: { id: history.id },
    data: {
      status: failures.length ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED',
      processedRows: valid.length, successRows: successes.length, failedRows: failures.length,
      successReport: successes as Prisma.InputJsonValue,
      errorReport: [...invalidErrors, ...failures] as Prisma.InputJsonValue,
      payload: Prisma.DbNull, completedAt: new Date(),
    },
  });
  return { historyId, totalRows: payload.length, imported: successes.length, failed: failures.length, invalid: invalidErrors.length, successes, errors: [...invalidErrors, ...failures] };
}
