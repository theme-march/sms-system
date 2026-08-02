'use server';

import prisma from '@/src/lib/db/prisma';
import { createAuditLog } from '@/src/lib/audit';

export interface StudentAttendanceRecord { id: string; sessionId?: string; schoolId: string; studentId: string; studentName?: string; rollNumber?: string; classId?: string; className?: string; sectionId?: string; sectionName?: string; subjectId?: string; subjectName?: string; date: string; status: 'present' | 'absent' | 'late' | 'leave' | 'holiday'; remarks?: string; createdAt?: string }
export interface TeacherAttendanceRecord { id: string; schoolId: string; teacherId: string; teacherName?: string; employeeCode?: string; date: string; status: 'present' | 'absent' | 'late' | 'leave' | 'holiday'; inTime?: string; outTime?: string; remarks?: string; createdAt?: string }
export interface EmployeeAttendanceRecord { id: string; schoolId: string; employeeId: string; employeeName?: string; employeeCode?: string; departmentName?: string; date: string; status: 'present' | 'absent' | 'late' | 'leave' | 'holiday'; inTime?: string; outTime?: string; remarks?: string; createdAt?: string }
export interface AttendanceCorrectionRecord { id: string; schoolId: string; attendanceType: 'STUDENT' | 'TEACHER' | 'EMPLOYEE'; targetId: string; targetName?: string; date: string; currentStatus: string; requestedStatus: string; reason: string; requestedById: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; approvedById?: string; approvedAt?: string; createdAt: string }
export interface AttendanceNotificationRecord { id: string; schoolId: string; studentId: string; studentName?: string; guardianId?: string; guardianName?: string; guardianPhone?: string; attendanceDate: string; channel: 'SMS' | 'PORTAL' | 'EMAIL'; deliveryStatus: 'SENT' | 'DELIVERED' | 'FAILED'; message: string; createdAt: string }

const dayRange = (value: string | Date) => { const start = new Date(value); start.setHours(0, 0, 0, 0); const end = new Date(start); end.setDate(end.getDate() + 1); return { gte: start, lt: end }; };
const studentRecord = (row: any): StudentAttendanceRecord => ({ id: row.id, sessionId: row.sessionId || undefined, schoolId: row.schoolId, studentId: row.studentId, classId: row.classId || undefined, sectionId: row.sectionId || undefined, subjectId: row.subjectId || undefined, date: row.date.toISOString().slice(0, 10), status: row.status, remarks: row.remarks || undefined, createdAt: row.createdAt.toISOString() });

export async function getAttendanceStats(schoolId?: string) {
  const today = dayRange(new Date());
  const [totalStudents, presentToday] = await prisma.$transaction([
    prisma.student.count({ where: { ...(schoolId && { schoolId }), status: 'ACTIVE' } }),
    prisma.studentAttendanceRecord.count({ where: { ...(schoolId && { schoolId }), date: today, status: 'present' } }),
  ]);
  return { totalStudents, presentToday, rate: `${totalStudents ? ((presentToday / totalStudents) * 100).toFixed(1) : '0.0'}%` };
}

export async function recordBulkStudentAttendance(payload: { schoolId: string; academicYearId: string; classId: string; sectionId: string; subjectId?: string; sessionType?: 'DAILY' | 'SUBJECT_WISE'; date: string; takenById: string; records: Array<{ studentId: string; studentName?: string; rollNumber?: string; status: StudentAttendanceRecord['status']; remarks?: string }> }) {
  if (!payload.records.length) throw new Error('No attendance rows supplied.');
  const date = new Date(payload.date); date.setHours(0, 0, 0, 0);
  const studentIds = payload.records.map((row) => row.studentId);
  if (new Set(studentIds).size !== studentIds.length) throw new Error('Duplicate students found in the submitted attendance.');
  const existing = await prisma.studentAttendanceRecord.findMany({ where: { schoolId: payload.schoolId, studentId: { in: studentIds }, date: dayRange(date), subjectId: payload.subjectId || null }, select: { studentId: true } });
  if (existing.length) throw new Error(`Attendance already exists for student ${existing[0].studentId} on ${payload.date}.`);

  const result = await prisma.$transaction(async (tx) => {
    const session = await tx.attendanceSession.create({ data: { schoolId: payload.schoolId, academicYearId: payload.academicYearId, classId: payload.classId, sectionId: payload.sectionId, subjectId: payload.subjectId, sessionType: payload.sessionType || 'DAILY', date, takenById: payload.takenById, status: 'SUBMITTED' } });
    await tx.studentAttendanceRecord.createMany({ data: payload.records.map((row) => ({ sessionId: session.id, schoolId: payload.schoolId, studentId: row.studentId, classId: payload.classId, sectionId: payload.sectionId, subjectId: payload.subjectId, date, status: row.status, remarks: row.remarks })) });
    let notificationsSent = 0;
    for (const row of payload.records.filter((item) => item.status === 'absent')) {
      const link = await tx.studentGuardian.findFirst({ where: { studentId: row.studentId, guardian: { schoolId: payload.schoolId } }, include: { guardian: true } });
      if (!link) continue;
      await tx.attendanceNotification.create({ data: { schoolId: payload.schoolId, studentId: row.studentId, guardianId: link.guardianId, attendanceDate: date, channel: 'PORTAL', deliveryStatus: 'DELIVERED', message: `${row.studentName || 'Student'} was marked absent on ${payload.date}.` } });
      notificationsSent++;
    }
    return { sessionId: session.id, savedCount: payload.records.length, notificationsSent };
  });
  await createAuditLog({ schoolId: payload.schoolId, userId: payload.takenById, action: 'CREATE', module: 'ATTENDANCE', details: `Submitted attendance for ${result.savedCount} students on ${payload.date}` });
  return result;
}

export async function getStudentAttendance(params: { schoolId?: string; studentId?: string; classId?: string; sectionId?: string; date?: string; startDate?: string; endDate?: string; status?: string }) {
  const where: any = { ...(params.schoolId && { schoolId: params.schoolId }), ...(params.studentId && { studentId: params.studentId }), ...(params.classId && { classId: params.classId }), ...(params.sectionId && { sectionId: params.sectionId }), ...(params.status && { status: params.status }) };
  if (params.date) where.date = dayRange(params.date); else if (params.startDate || params.endDate) where.date = { ...(params.startDate && { gte: new Date(params.startDate) }), ...(params.endDate && { lte: new Date(`${params.endDate}T23:59:59.999`) }) };
  return (await prisma.studentAttendanceRecord.findMany({ where, orderBy: { date: 'desc' } })).map(studentRecord);
}

export async function getStudentAttendanceSummary(studentId: string, month: number, year: number) {
  const start = new Date(year, month - 1, 1); const end = new Date(year, month, 1);
  const rows = await prisma.studentAttendanceRecord.findMany({ where: { studentId, date: { gte: start, lt: end } }, select: { status: true } });
  const count = (status: string) => rows.filter((row) => row.status === status).length;
  const present = count('present'), absent = count('absent'), late = count('late'), leave = count('leave'), holiday = count('holiday');
  return { studentId, month, year, totalWorkingDays: rows.length, present, absent, late, leave, holiday, attendancePercentage: `${rows.length ? (((present + late) / rows.length) * 100).toFixed(1) : '0.0'}%` };
}

export async function recordTeacherAttendance(payload: Omit<TeacherAttendanceRecord, 'id'>) {
  const date = new Date(payload.date); date.setHours(0, 0, 0, 0);
  if (await prisma.teacherAttendance.findFirst({ where: { schoolId: payload.schoolId, teacherId: payload.teacherId, date: dayRange(date) } })) throw new Error('Teacher attendance already recorded.');
  const row = await prisma.teacherAttendance.create({ data: { schoolId: payload.schoolId, teacherId: payload.teacherId, date, status: payload.status, inTime: payload.inTime, outTime: payload.outTime, remarks: payload.remarks } });
  return { ...payload, id: row.id, date: row.date.toISOString().slice(0, 10), createdAt: row.createdAt.toISOString() };
}

export async function getTeacherAttendance(params: { teacherId?: string; date?: string; month?: number; year?: number }) {
  const where: any = { ...(params.teacherId && { teacherId: params.teacherId }) };
  if (params.date) where.date = dayRange(params.date); else if (params.month && params.year) where.date = { gte: new Date(params.year, params.month - 1, 1), lt: new Date(params.year, params.month, 1) };
  return (await prisma.teacherAttendance.findMany({ where, orderBy: { date: 'desc' } })).map((row) => ({ id: row.id, schoolId: row.schoolId, teacherId: row.teacherId, date: row.date.toISOString().slice(0, 10), status: row.status as TeacherAttendanceRecord['status'], inTime: row.inTime || undefined, outTime: row.outTime || undefined, remarks: row.remarks || undefined, createdAt: row.createdAt.toISOString() }));
}

export async function recordEmployeeAttendance(payload: Omit<EmployeeAttendanceRecord, 'id'>) {
  const date = new Date(payload.date); date.setHours(0, 0, 0, 0);
  if (await prisma.employeeAttendance.findFirst({ where: { schoolId: payload.schoolId, employeeId: payload.employeeId, date: dayRange(date) } })) throw new Error('Employee attendance already recorded.');
  const row = await prisma.employeeAttendance.create({ data: { schoolId: payload.schoolId, employeeId: payload.employeeId, date, status: payload.status, inTime: payload.inTime, outTime: payload.outTime, remarks: payload.remarks } });
  return { ...payload, id: row.id, date: row.date.toISOString().slice(0, 10), createdAt: row.createdAt.toISOString() };
}

export async function getEmployeeAttendance(params: { employeeId?: string; date?: string }) {
  const where: any = { ...(params.employeeId && { employeeId: params.employeeId }), ...(params.date && { date: dayRange(params.date) }) };
  return (await prisma.employeeAttendance.findMany({ where, orderBy: { date: 'desc' } })).map((row) => ({ id: row.id, schoolId: row.schoolId, employeeId: row.employeeId, date: row.date.toISOString().slice(0, 10), status: row.status as EmployeeAttendanceRecord['status'], inTime: row.inTime || undefined, outTime: row.outTime || undefined, remarks: row.remarks || undefined, createdAt: row.createdAt.toISOString() }));
}

export async function requestAttendanceCorrection(payload: Omit<AttendanceCorrectionRecord, 'id' | 'status' | 'createdAt'>) {
  const row = await prisma.attendanceCorrection.create({ data: { schoolId: payload.schoolId, attendanceType: payload.attendanceType, targetId: payload.targetId, date: new Date(payload.date), currentStatus: payload.currentStatus, requestedStatus: payload.requestedStatus, reason: payload.reason, requestedById: payload.requestedById, status: 'PENDING' } });
  return { ...payload, id: row.id, status: 'PENDING' as const, date: row.date.toISOString().slice(0, 10), createdAt: row.createdAt.toISOString() };
}

export async function getAttendanceCorrections(status?: string) {
  return (await prisma.attendanceCorrection.findMany({ where: status ? { status } : undefined, orderBy: { createdAt: 'desc' } })).map((row) => ({ id: row.id, schoolId: row.schoolId, attendanceType: row.attendanceType as AttendanceCorrectionRecord['attendanceType'], targetId: row.targetId, date: row.date.toISOString().slice(0, 10), currentStatus: row.currentStatus, requestedStatus: row.requestedStatus, reason: row.reason, requestedById: row.requestedById, status: row.status as AttendanceCorrectionRecord['status'], approvedById: row.approvedById || undefined, approvedAt: row.approvedAt?.toISOString(), createdAt: row.createdAt.toISOString() }));
}

export async function approveAttendanceCorrection(id: string, approvedById: string) {
  return prisma.$transaction(async (tx) => {
    const correction = await tx.attendanceCorrection.findUnique({ where: { id } });
    if (!correction || correction.status !== 'PENDING') throw new Error('Pending correction request not found');
    const date = dayRange(correction.date);
    if (correction.attendanceType === 'STUDENT') await tx.studentAttendanceRecord.updateMany({ where: { studentId: correction.targetId, date }, data: { status: correction.requestedStatus } });
    else if (correction.attendanceType === 'TEACHER') await tx.teacherAttendance.updateMany({ where: { teacherId: correction.targetId, date }, data: { status: correction.requestedStatus } });
    else await tx.employeeAttendance.updateMany({ where: { employeeId: correction.targetId, date }, data: { status: correction.requestedStatus } });
    return tx.attendanceCorrection.update({ where: { id }, data: { status: 'APPROVED', approvedById, approvedAt: new Date() } });
  });
}

export async function getAttendanceNotifications(studentId?: string) {
  return (await prisma.attendanceNotification.findMany({ where: studentId ? { studentId } : undefined, orderBy: { createdAt: 'desc' } })).map((row) => ({ id: row.id, schoolId: row.schoolId, studentId: row.studentId, guardianId: row.guardianId || undefined, attendanceDate: row.attendanceDate.toISOString().slice(0, 10), channel: row.channel as AttendanceNotificationRecord['channel'], deliveryStatus: row.deliveryStatus as AttendanceNotificationRecord['deliveryStatus'], message: row.message, createdAt: row.createdAt.toISOString() }));
}
