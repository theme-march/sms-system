'use server';

import prisma from '@/src/lib/db/prisma';
import { createAuditLog } from '@/src/lib/audit';
import { checkExamClassSectionConflict, checkDuplicateSubjectExam, checkInvalidExamDate, filterPublishedExamsForUser } from '@/src/lib/validations/exam-routine';
import { checkTimeOrder } from '@/src/lib/validations/routine';

export interface ExamRoutineRecord {
  id: string; schoolId: string; academicYearId: string; examId: string; examName?: string; classId: string; className?: string;
  sectionId?: string; sectionName?: string; subjectId: string; subjectName?: string; subjectCode?: string; examDate: string;
  startTime: string; endTime: string; durationMinutes: number; roomId?: string; roomName?: string; totalMarks: number;
  passMarks: number; instructions?: string; status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED'; createdAt?: string;
}

function toRecord(row: any): ExamRoutineRecord {
  return { id: row.id, schoolId: row.schoolId, academicYearId: row.academicYearId, examId: row.examId, classId: row.classId,
    sectionId: row.sectionId || undefined, subjectId: row.subjectId, examDate: row.examDate.toISOString().slice(0, 10),
    startTime: row.startTime, endTime: row.endTime, durationMinutes: row.durationMinutes, roomId: row.roomId || undefined,
    totalMarks: Number(row.totalMarks), passMarks: Number(row.passMarks), instructions: row.instructions || undefined,
    status: row.status as ExamRoutineRecord['status'], createdAt: row.createdAt?.toISOString() };
}

export async function getExamRoutines(params: { schoolId?: string; academicYearId?: string; examId?: string; classId?: string; sectionId?: string; status?: string; userRole?: string; search?: string }) {
  const where: any = { ...(params.schoolId && { schoolId: params.schoolId }), ...(params.academicYearId && { academicYearId: params.academicYearId }), ...(params.examId && { examId: params.examId }), ...(params.classId && { classId: params.classId }), ...(params.sectionId && { sectionId: params.sectionId }) };
  where.status = params.userRole === 'STUDENT' || params.userRole === 'GUARDIAN' ? 'PUBLISHED' : params.status || undefined;
  if (!where.status) delete where.status;
  const rows = (await prisma.examRoutine.findMany({ where, orderBy: [{ examDate: 'asc' }, { startTime: 'asc' }] })).map(toRecord);
  return filterPublishedExamsForUser(rows, params.userRole || 'ADMIN');
}

async function validateExam(candidate: ExamRoutineRecord, currentId?: string) {
  if (checkInvalidExamDate(candidate.examDate)) throw new Error('Invalid exam date provided.');
  if (!checkTimeOrder(candidate.startTime, candidate.endTime)) throw new Error('Invalid exam time range.');
  const records = (await prisma.examRoutine.findMany({ where: { schoolId: candidate.schoolId, academicYearId: candidate.academicYearId } })).map(toRecord);
  if (checkDuplicateSubjectExam(records, { examId: candidate.examId, classId: candidate.classId, sectionId: candidate.sectionId, subjectId: candidate.subjectId, currentId })) throw new Error('Duplicate exam schedule.');
  if (checkExamClassSectionConflict(records, { classId: candidate.classId, sectionId: candidate.sectionId, examDate: candidate.examDate, startTime: candidate.startTime, endTime: candidate.endTime, currentId })) throw new Error('Exam time conflict.');
}

export async function createExamRoutine(payload: Omit<ExamRoutineRecord, 'id'> & { userId?: string }) {
  const candidate = { ...payload, id: '' } as ExamRoutineRecord;
  await validateExam(candidate);
  const created = await prisma.examRoutine.create({ data: { schoolId: payload.schoolId, academicYearId: payload.academicYearId, examId: payload.examId, classId: payload.classId, sectionId: payload.sectionId, subjectId: payload.subjectId, examDate: new Date(payload.examDate), startTime: payload.startTime, endTime: payload.endTime, durationMinutes: payload.durationMinutes, roomId: payload.roomId, totalMarks: payload.totalMarks, passMarks: payload.passMarks, instructions: payload.instructions, status: payload.status || 'DRAFT' } });
  await createAuditLog({ schoolId: payload.schoolId, userId: payload.userId, action: 'CREATE', module: 'EXAM_ROUTINE', details: `Created exam routine ${created.id}` });
  return toRecord(created);
}

export async function updateExamRoutine(id: string, payload: Partial<ExamRoutineRecord> & { userId?: string }) {
  const current = await prisma.examRoutine.findUnique({ where: { id } });
  if (!current) throw new Error('Exam routine record not found');
  const merged = { ...toRecord(current), ...payload } as ExamRoutineRecord;
  await validateExam(merged, id);
  const updated = await prisma.examRoutine.update({ where: { id }, data: { examDate: payload.examDate ? new Date(payload.examDate) : undefined, startTime: payload.startTime, endTime: payload.endTime, durationMinutes: payload.durationMinutes, status: payload.status, subjectId: payload.subjectId, roomId: payload.roomId, totalMarks: payload.totalMarks, passMarks: payload.passMarks, instructions: payload.instructions } });
  await createAuditLog({ schoolId: current.schoolId, userId: payload.userId, action: 'UPDATE', module: 'EXAM_ROUTINE', details: `Updated exam routine ${id}` });
  return toRecord(updated);
}

export async function publishExamRoutine(examId: string, classId?: string, userId?: string) {
  const existing = await prisma.examRoutine.findFirst({ where: { examId, ...(classId && { classId }) } });
  if (!existing) throw new Error('Exam routine not found.');
  const updated = await prisma.examRoutine.updateMany({ where: { examId, ...(classId && { classId }) }, data: { status: 'PUBLISHED' } });
  await createAuditLog({ schoolId: existing.schoolId, userId, action: 'TOGGLE_STATUS', module: 'EXAM_ROUTINE', details: `Published ${updated.count} exam routines for exam ${examId}` });
  return { publishedCount: updated.count };
}

export async function deleteExamRoutine(id: string, userId?: string) {
  const existing = await prisma.examRoutine.findUnique({ where: { id } });
  if (!existing) throw new Error('Exam routine not found.');
  await prisma.examRoutine.delete({ where: { id } });
  await createAuditLog({ schoolId: existing.schoolId, userId, action: 'DELETE', module: 'EXAM_ROUTINE', details: `Deleted exam routine ${id}` });
  return true;
}
