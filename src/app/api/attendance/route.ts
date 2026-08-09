import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { createAuditLog } from '@/src/lib/audit';

const MANAGEMENT_ROLES = ['Super Admin', 'School Admin', 'Academic Admin', 'Admission Officer', 'Accountant', 'HR Manager'];
type AttendanceSessionUser = Awaited<ReturnType<typeof requirePermission>>;

function isTeacherOnly(session: AttendanceSessionUser) {
  return session.roles.includes('Teacher') && !session.roles.some((role) => MANAGEMENT_ROLES.includes(role));
}

async function getTeacherAttendanceScope(session: AttendanceSessionUser) {
  if (!isTeacherOnly(session)) return null;
  return prisma.teacherAssignment.findMany({
    where: { schoolId: session.schoolId, status: 'ACTIVE', teacher: { userId: session.id, status: 'ACTIVE' } },
    select: { academicYearId: true, classId: true, sectionId: true, groupId: true, subjectId: true, isClassTeacher: true },
  });
}

function scopeAllowsSelection(
  scope: NonNullable<Awaited<ReturnType<typeof getTeacherAttendanceScope>>>,
  input: { academicYearId: string; classId: string; sectionId: string; groupId?: string; subjectId?: string; sessionType: 'DAILY' | 'SUBJECT_WISE' },
) {
  return scope.some((assignment) =>
    assignment.academicYearId === input.academicYearId &&
    assignment.classId === input.classId &&
    assignment.sectionId === input.sectionId &&
    (!input.groupId || !assignment.groupId || assignment.groupId === input.groupId) &&
    (input.sessionType === 'SUBJECT_WISE'
      ? assignment.subjectId === input.subjectId
      : assignment.isClassTeacher),
  );
}

const attendanceSchema = z.object({
  academicYearId: z.string().trim().min(1).max(191),
  classId: z.string().trim().min(1).max(191),
  sectionId: z.string().trim().min(1).max(191),
  groupId: z.string().trim().min(1).max(191).optional().or(z.literal('')),
  subjectId: z.string().trim().min(1).max(191).optional().or(z.literal('')),
  sessionType: z.enum(['DAILY', 'SUBJECT_WISE']).default('DAILY'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  records: z.array(z.object({
    studentId: z.string().trim().min(1).max(191),
    status: z.enum(['present', 'absent', 'late', 'leave']),
    remarks: z.string().trim().max(250).optional().default(''),
  })).min(1).max(500),
});

function dateRange(value: string) {
  const start = new Date(`${value}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export async function GET(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.ATTENDANCE_VIEW);
    const teacherScope = await getTeacherAttendanceScope(session);
    const classId = request.nextUrl.searchParams.get('classId') || '';
    const sectionId = request.nextUrl.searchParams.get('sectionId') || '';
    const academicYearId = request.nextUrl.searchParams.get('academicYearId') || '';
    const groupId = request.nextUrl.searchParams.get('groupId') || '';
    const subjectId = request.nextUrl.searchParams.get('subjectId') || '';
    const sessionType = request.nextUrl.searchParams.get('sessionType') === 'SUBJECT_WISE' ? 'SUBJECT_WISE' : 'DAILY';
    const date = request.nextUrl.searchParams.get('date') || new Date().toISOString().slice(0, 10);
    const { start, end } = dateRange(date);
    const requestedSelectionAllowed =
      !teacherScope ||
      !classId ||
      !sectionId ||
      !academicYearId ||
      scopeAllowsSelection(teacherScope, { academicYearId, classId, sectionId, groupId, subjectId, sessionType });

    const [academicYears, classes, classGroups, classSubjects, students, recent] = await Promise.all([
      prisma.academicYear.findMany({
        where: { schoolId: session.schoolId, status: 'ACTIVE', deletedAt: null },
        select: { id: true, name: true, isCurrent: true },
        orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
      }),
      prisma.class.findMany({
        where: { schoolId: session.schoolId, status: 'ACTIVE', deletedAt: null },
        select: { id: true, name: true, sections: { where: { status: 'ACTIVE', deletedAt: null }, select: { id: true, name: true }, orderBy: { displayOrder: 'asc' } } },
        orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      }),
      prisma.classGroup.findMany({
        where: { schoolId: session.schoolId, status: 'ACTIVE', deletedAt: null },
        select: { id: true, academicYearId: true, classId: true, group: { select: { id: true, name: true } } },
        orderBy: { group: { name: 'asc' } },
      }),
      prisma.classSubject.findMany({
        where: { schoolId: session.schoolId, status: 'ACTIVE', deletedAt: null, subject: { status: 'ACTIVE', deletedAt: null } },
        select: { id: true, academicYearId: true, classId: true, groupId: true, subject: { select: { id: true, nameEn: true, code: true } } },
        orderBy: { subject: { nameEn: 'asc' } },
      }),
      classId && sectionId && requestedSelectionAllowed ? prisma.student.findMany({
        where: {
          schoolId: session.schoolId, classId, sectionId, status: 'ACTIVE',
          ...(groupId && academicYearId ? { enrollments: { some: { academicYearId, classId, sectionId, groupId, enrollmentStatus: 'ACTIVE' } } } : {}),
        },
        select: { id: true, nameEn: true, studentCode: true, rollNumber: true },
        orderBy: [{ rollNumber: 'asc' }, { nameEn: 'asc' }],
      }) : Promise.resolve([]),
      prisma.studentAttendanceRecord.findMany({
        where: {
          schoolId: session.schoolId,
          ...(teacherScope
            ? { OR: teacherScope.map((assignment) => ({ classId: assignment.classId, sectionId: assignment.sectionId })) }
            : {}),
        },
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        take: 50,
      }),
    ]);

    const studentIds = [...new Set([...students.map((item) => item.id), ...recent.map((item) => item.studentId)])];
    const [existing, studentNames, classNames, sectionNames] = await Promise.all([
      students.length ? prisma.studentAttendanceRecord.findMany({
        where: { schoolId: session.schoolId, studentId: { in: students.map((item) => item.id) }, date: { gte: start, lt: end }, subjectId: sessionType === 'SUBJECT_WISE' && subjectId ? subjectId : null },
        select: { studentId: true, status: true, remarks: true },
      }) : Promise.resolve([]),
      prisma.student.findMany({ where: { id: { in: studentIds }, schoolId: session.schoolId }, select: { id: true, nameEn: true, rollNumber: true } }),
      prisma.class.findMany({ where: { id: { in: recent.flatMap((item) => item.classId ? [item.classId] : []) }, schoolId: session.schoolId }, select: { id: true, name: true } }),
      prisma.section.findMany({ where: { id: { in: recent.flatMap((item) => item.sectionId ? [item.sectionId] : []) }, schoolId: session.schoolId }, select: { id: true, name: true } }),
    ]);
    const existingByStudent = new Map(existing.map((item) => [item.studentId, item]));
    const studentMap = new Map(studentNames.map((item) => [item.id, item]));
    const classMap = new Map(classNames.map((item) => [item.id, item.name]));
    const sectionMap = new Map(sectionNames.map((item) => [item.id, item.name]));

    return NextResponse.json({
      academicYears: teacherScope
        ? academicYears.filter((year) => teacherScope.some((assignment) => assignment.academicYearId === year.id))
        : academicYears,
      classes: teacherScope
        ? classes
            .filter((schoolClass) => teacherScope.some((assignment) => assignment.classId === schoolClass.id))
            .map((schoolClass) => ({
              ...schoolClass,
              sections: schoolClass.sections.filter((section) => teacherScope.some((assignment) => assignment.classId === schoolClass.id && assignment.sectionId === section.id)),
            }))
        : classes,
      classGroups: classGroups.map((item) => ({ id: item.id, academicYearId: item.academicYearId, classId: item.classId, groupId: item.group.id, groupName: item.group.name })),
      classSubjects: classSubjects
        .filter((item) => !teacherScope || teacherScope.some((assignment) => (!item.academicYearId || assignment.academicYearId === item.academicYearId) && assignment.classId === item.classId && assignment.subjectId === item.subject.id && (!item.groupId || item.groupId === assignment.groupId)))
        .map((item) => ({ id: item.id, academicYearId: item.academicYearId, classId: item.classId, groupId: item.groupId, subjectId: item.subject.id, subjectName: item.subject.nameEn, subjectCode: item.subject.code })),
      attendanceScope: teacherScope,
      canManage: session.roles.includes('Super Admin') || session.permissions.includes(PERMISSIONS.ATTENDANCE_MANAGE),
      canManageAcademic: session.roles.includes('Super Admin') || session.permissions.includes(PERMISSIONS.ACADEMIC_MANAGE),
      roster: students.map((student) => ({
        studentId: student.id,
        name: student.nameEn,
        studentCode: student.studentCode,
        rollNumber: student.rollNumber,
        status: existingByStudent.get(student.id)?.status || 'present',
        remarks: existingByStudent.get(student.id)?.remarks || '',
      })),
      alreadyRecorded: existing.length > 0,
      recent: recent.map((record) => ({
        id: record.id,
        date: record.date.toISOString().slice(0, 10),
        studentName: studentMap.get(record.studentId)?.nameEn || 'Unknown student',
        rollNumber: studentMap.get(record.studentId)?.rollNumber,
        className: record.classId ? classMap.get(record.classId) || '—' : '—',
        sectionName: record.sectionId ? sectionMap.get(record.sectionId) || '—' : '—',
        status: record.status,
        remarks: record.remarks,
      })),
    });
  } catch (error) {
    console.error('GET /api/attendance error', error);
    return NextResponse.json({ error: 'Unable to load attendance.' }, { status: authorizationStatus(error) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.ATTENDANCE_MANAGE);
    const parsed = attendanceSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid attendance data.' }, { status: 400 });
    const input = parsed.data;
    if (input.sessionType === 'SUBJECT_WISE' && !input.subjectId) return NextResponse.json({ error: 'Select a subject for subject-wise attendance.' }, { status: 400 });
    const teacherScope = await getTeacherAttendanceScope(session);
    if (teacherScope && !scopeAllowsSelection(teacherScope, input)) {
      return NextResponse.json(
        { error: input.sessionType === 'SUBJECT_WISE' ? 'You can take attendance only for your assigned class, section and subject.' : 'Only the assigned class teacher can submit daily attendance.' },
        { status: 403 },
      );
    }
    const { start, end } = dateRange(input.date);
    // The legacy Attendance.date column is MySQL DATE, so use a UTC midnight
    // value to prevent Asia/Dhaka midnight from being serialized as yesterday.
    const legacyDate = new Date(`${input.date}T00:00:00.000Z`);
    if (Number.isNaN(start.getTime())) return NextResponse.json({ error: 'Invalid attendance date.' }, { status: 400 });
    const studentIds = input.records.map((item) => item.studentId);
    if (new Set(studentIds).size !== studentIds.length) return NextResponse.json({ error: 'A student appears more than once.' }, { status: 400 });

    const [academicYear, classRecord, section, classGroup, classSubject, roster] = await Promise.all([
      prisma.academicYear.findFirst({ where: { id: input.academicYearId, schoolId: session.schoolId, deletedAt: null }, select: { id: true } }),
      prisma.class.findFirst({ where: { id: input.classId, schoolId: session.schoolId, deletedAt: null }, select: { id: true, name: true } }),
      prisma.section.findFirst({ where: { id: input.sectionId, schoolId: session.schoolId, classId: input.classId, deletedAt: null }, select: { id: true, name: true } }),
      input.groupId ? prisma.classGroup.findFirst({ where: { schoolId: session.schoolId, academicYearId: input.academicYearId, classId: input.classId, groupId: input.groupId, status: 'ACTIVE', deletedAt: null }, select: { id: true, group: { select: { name: true } } } }) : Promise.resolve(null),
      input.sessionType === 'SUBJECT_WISE' && input.subjectId ? prisma.classSubject.findFirst({
        where: { schoolId: session.schoolId, classId: input.classId, subjectId: input.subjectId, status: 'ACTIVE', deletedAt: null, AND: [{ OR: [{ academicYearId: input.academicYearId }, { academicYearId: null }] }, { OR: [{ groupId: input.groupId || null }, { groupId: null }] }] },
        select: { id: true, subject: { select: { nameEn: true } } },
      }) : Promise.resolve(null),
      prisma.student.findMany({
        where: {
          schoolId: session.schoolId, classId: input.classId, sectionId: input.sectionId, status: 'ACTIVE',
          ...(input.groupId ? { enrollments: { some: { academicYearId: input.academicYearId, classId: input.classId, sectionId: input.sectionId, groupId: input.groupId, enrollmentStatus: 'ACTIVE' } } } : {}),
        },
        select: { id: true, nameEn: true },
      }),
    ]);
    if (!academicYear || !classRecord || !section) return NextResponse.json({ error: 'Invalid academic year, class, or section.' }, { status: 400 });
    if (input.groupId && !classGroup) return NextResponse.json({ error: 'The selected group is not assigned to this class and academic year.' }, { status: 400 });
    if (input.sessionType === 'SUBJECT_WISE' && !classSubject) return NextResponse.json({ error: 'The selected subject is not assigned to this class/group.' }, { status: 400 });
    const rosterIds = new Set(roster.map((item) => item.id));
    if (roster.length !== input.records.length || studentIds.some((id) => !rosterIds.has(id))) {
      return NextResponse.json({ error: 'Attendance must include every active student in the selected class and section.' }, { status: 400 });
    }

    const saved = await prisma.$transaction(async (tx) => {
      let attendanceSession = await tx.attendanceSession.findFirst({
        where: { schoolId: session.schoolId, academicYearId: input.academicYearId, classId: input.classId, sectionId: input.sectionId, subjectId: input.sessionType === 'SUBJECT_WISE' ? input.subjectId || null : null, date: { gte: start, lt: end } },
      });
      attendanceSession = attendanceSession
        ? await tx.attendanceSession.update({ where: { id: attendanceSession.id }, data: { takenById: session.id, status: 'SUBMITTED', date: start } })
        : await tx.attendanceSession.create({ data: { schoolId: session.schoolId, academicYearId: input.academicYearId, classId: input.classId, sectionId: input.sectionId, subjectId: input.sessionType === 'SUBJECT_WISE' ? input.subjectId || null : null, sessionType: input.sessionType, date: start, takenById: session.id, status: 'SUBMITTED' } });

      for (const record of input.records) {
        const existing = await tx.studentAttendanceRecord.findFirst({
          where: { schoolId: session.schoolId, studentId: record.studentId, date: { gte: start, lt: end }, subjectId: input.sessionType === 'SUBJECT_WISE' ? input.subjectId || null : null },
          select: { id: true },
        });
        const data = { sessionId: attendanceSession.id, schoolId: session.schoolId, studentId: record.studentId, classId: input.classId, sectionId: input.sectionId, subjectId: input.sessionType === 'SUBJECT_WISE' ? input.subjectId || null : null, date: start, status: record.status, remarks: record.remarks || null };
        if (existing) await tx.studentAttendanceRecord.update({ where: { id: existing.id }, data });
        else await tx.studentAttendanceRecord.create({ data });
        if (input.sessionType === 'DAILY') {
          const legacyStatus = record.status === 'present' ? 'PRESENT' : record.status === 'absent' ? 'ABSENT' : record.status === 'late' ? 'LATE' : 'EXCUSED';
          const legacyRecord = await tx.attendance.findFirst({
            where: { studentId: record.studentId, date: legacyDate },
            select: { id: true },
          });
          if (legacyRecord) {
            await tx.attendance.update({ where: { id: legacyRecord.id }, data: { status: legacyStatus, remarks: record.remarks || null } });
          } else {
            await tx.attendance.create({ data: { studentId: record.studentId, date: legacyDate, status: legacyStatus, remarks: record.remarks || null } });
          }
        }
      }
      return { sessionId: attendanceSession.id, savedCount: input.records.length };
    });
    const context = [classRecord.name, section.name, classGroup?.group.name, classSubject?.subject.nameEn].filter(Boolean).join(' - ');
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'UPDATE', module: 'Attendance', recordId: saved.sessionId, details: `Submitted ${context} attendance for ${saved.savedCount} students on ${input.date}` });
    return NextResponse.json(saved);
  } catch (error) {
    console.error('POST /api/attendance error', error);
    return NextResponse.json({ error: 'Unable to save attendance.' }, { status: authorizationStatus(error) });
  }
}
