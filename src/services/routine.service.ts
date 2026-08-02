'use server';

import prisma from '@/src/lib/db/prisma';
import { createAuditLog } from '@/src/lib/audit';
import { checkClassSectionConflict, checkDuplicatePeriod, checkRoomConflict, checkTeacherConflict, checkTimeOrder } from '@/src/lib/validations/routine';

export interface ClassRoutineRecord {
  id: string; schoolId: string; academicYearId: string; sessionId?: string; classId: string; className?: string;
  sectionId: string; sectionName?: string; groupId?: string; groupName?: string; subjectId: string; subjectName?: string;
  subjectCode?: string; teacherId: string; teacherName?: string; roomId?: string; roomName?: string; weekday: string;
  periodId: string; periodName?: string; startTime: string; endTime: string; effectiveFrom: string; effectiveTo?: string;
  versionNumber: number; status: 'DRAFT' | 'PUBLISHED' | 'INACTIVE'; createdAt?: string;
}

export interface RoutineVersionRecord {
  id: string; schoolId: string; academicYearId: string; classId: string; sectionId: string; versionNumber: number;
  changeSummary?: string; routineSnapshot: string; createdBy?: string; createdAt: string;
}

function toRecord(row: any): ClassRoutineRecord {
  return { id: row.id, schoolId: row.schoolId, academicYearId: row.academicYearId, sessionId: row.sessionId || undefined,
    classId: row.classId, sectionId: row.sectionId, groupId: row.groupId || undefined, subjectId: row.subjectId,
    teacherId: row.teacherId, roomId: row.roomId || undefined, weekday: row.weekday, periodId: row.periodId,
    startTime: row.startTime, endTime: row.endTime, effectiveFrom: row.effectiveFrom.toISOString().slice(0, 10),
    effectiveTo: row.effectiveTo?.toISOString().slice(0, 10), versionNumber: row.versionNumber,
    status: row.status as ClassRoutineRecord['status'], createdAt: row.createdAt?.toISOString() };
}

export async function getClassRoutines(params: { schoolId?: string; academicYearId?: string; classId?: string; sectionId?: string; teacherId?: string; roomId?: string; status?: string; weekday?: string; search?: string }) {
  const where: any = { ...(params.schoolId && { schoolId: params.schoolId }), ...(params.academicYearId && { academicYearId: params.academicYearId }), ...(params.classId && { classId: params.classId }), ...(params.sectionId && { sectionId: params.sectionId }), ...(params.teacherId && { teacherId: params.teacherId }), ...(params.roomId && { roomId: params.roomId }), ...(params.status && { status: params.status }), ...(params.weekday && { weekday: params.weekday }) };
  return (await prisma.classRoutine.findMany({ where, orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }] })).map(toRecord);
}

async function validateRoutine(candidate: ClassRoutineRecord, currentId?: string) {
  if (!checkTimeOrder(candidate.startTime, candidate.endTime)) throw new Error('Invalid time range: End time must be after start time.');
  const records = (await prisma.classRoutine.findMany({ where: { schoolId: candidate.schoolId, academicYearId: candidate.academicYearId } })).map(toRecord);
  if (checkTeacherConflict(records, { teacherId: candidate.teacherId, weekday: candidate.weekday, startTime: candidate.startTime, endTime: candidate.endTime, currentId })) throw new Error('Teacher time conflict.');
  if (checkClassSectionConflict(records, { classId: candidate.classId, sectionId: candidate.sectionId, weekday: candidate.weekday, startTime: candidate.startTime, endTime: candidate.endTime, currentId })) throw new Error('Class section time conflict.');
  if (candidate.roomId && checkRoomConflict(records, { roomId: candidate.roomId, weekday: candidate.weekday, startTime: candidate.startTime, endTime: candidate.endTime, currentId })) throw new Error('Room time conflict.');
  if (checkDuplicatePeriod(records, { classId: candidate.classId, sectionId: candidate.sectionId, weekday: candidate.weekday, periodId: candidate.periodId, currentId })) throw new Error('Duplicate period.');
}

export async function createClassRoutine(payload: Omit<ClassRoutineRecord, 'id' | 'versionNumber'> & { userId?: string }) {
  const candidate = { ...payload, id: '', versionNumber: 1 } as ClassRoutineRecord;
  await validateRoutine(candidate);
  const created = await prisma.classRoutine.create({ data: { schoolId: payload.schoolId, academicYearId: payload.academicYearId, sessionId: payload.sessionId, classId: payload.classId, sectionId: payload.sectionId, groupId: payload.groupId, subjectId: payload.subjectId, teacherId: payload.teacherId, roomId: payload.roomId, weekday: payload.weekday, periodId: payload.periodId, startTime: payload.startTime, endTime: payload.endTime, effectiveFrom: new Date(payload.effectiveFrom), effectiveTo: payload.effectiveTo ? new Date(payload.effectiveTo) : null, versionNumber: 1, status: payload.status || 'PUBLISHED' } });
  await createAuditLog({ schoolId: payload.schoolId, userId: payload.userId, action: 'CREATE', module: 'ROUTINE', details: `Created class routine ${created.id}` });
  return toRecord(created);
}

export async function updateClassRoutine(id: string, payload: Partial<ClassRoutineRecord> & { userId?: string }) {
  const current = await prisma.classRoutine.findUnique({ where: { id } });
  if (!current) throw new Error('Class routine record not found');
  const merged = { ...toRecord(current), ...payload } as ClassRoutineRecord;
  await validateRoutine(merged, id);
  const updated = await prisma.classRoutine.update({ where: { id }, data: { weekday: payload.weekday, startTime: payload.startTime, endTime: payload.endTime, subjectId: payload.subjectId, teacherId: payload.teacherId, roomId: payload.roomId, status: payload.status, periodId: payload.periodId, effectiveFrom: payload.effectiveFrom ? new Date(payload.effectiveFrom) : undefined, effectiveTo: payload.effectiveTo ? new Date(payload.effectiveTo) : undefined } });
  await createAuditLog({ schoolId: current.schoolId, userId: payload.userId, action: 'UPDATE', module: 'ROUTINE', details: `Updated class routine ${id}` });
  return toRecord(updated);
}

export async function deleteClassRoutine(id: string, userId?: string) {
  const existing = await prisma.classRoutine.findUnique({ where: { id } });
  if (!existing) throw new Error('Class routine record not found');
  await prisma.classRoutine.delete({ where: { id } });
  await createAuditLog({ schoolId: existing.schoolId, userId, action: 'DELETE', module: 'ROUTINE', details: `Deleted class routine ${id}` });
  return true;
}

export async function getRoutineVersions(classId: string, sectionId: string) {
  return (await prisma.routineVersion.findMany({ where: { classId, sectionId }, orderBy: { versionNumber: 'desc' } })).map((row) => ({ ...row, createdBy: row.createdBy || undefined, changeSummary: row.changeSummary || undefined, createdAt: row.createdAt.toISOString() }));
}

export async function createRoutineVersion(classId: string, sectionId: string, changeSummary: string, createdBy?: string) {
  const currentRoutines = await prisma.classRoutine.findMany({ where: { classId, sectionId }, orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }] });
  if (!currentRoutines.length) throw new Error('Cannot version an empty routine.');
  const latest = await prisma.routineVersion.aggregate({ where: { classId, sectionId }, _max: { versionNumber: true } });
  const created = await prisma.routineVersion.create({ data: { schoolId: currentRoutines[0].schoolId, academicYearId: currentRoutines[0].academicYearId, classId, sectionId, versionNumber: (latest._max.versionNumber || 0) + 1, changeSummary, routineSnapshot: JSON.stringify(currentRoutines), createdBy } });
  return { ...created, createdBy: created.createdBy || undefined, changeSummary: created.changeSummary || undefined, createdAt: created.createdAt.toISOString() };
}
