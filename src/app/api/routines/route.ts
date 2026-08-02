import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { createAuditLog } from '@/src/lib/audit';

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
const inputSchema = z.object({
  academicYearId: z.string().trim().min(1).max(191),
  sessionId: z.string().trim().max(191).optional().or(z.literal('')),
  classId: z.string().trim().min(1).max(191),
  sectionId: z.string().trim().min(1).max(191),
  groupId: z.string().trim().max(191).optional().or(z.literal('')),
  subjectId: z.string().trim().min(1).max(191),
  teacherId: z.string().trim().min(1).max(191),
  roomId: z.string().trim().max(191).optional().or(z.literal('')),
  weekday: z.enum(WEEKDAYS),
  periodId: z.string().trim().min(1).max(191),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  effectiveTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'INACTIVE']),
});

function dayDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function overlaps(startA: string, endA: string, startB: string, endB: string) {
  return startA < endB && startB < endA;
}

async function validateInput(schoolId: string, input: z.infer<typeof inputSchema>, currentId?: string) {
  if (input.startTime >= input.endTime) throw new Error('End time must be after start time.');
  if (input.effectiveTo && input.effectiveTo < input.effectiveFrom) throw new Error('Effective-to date cannot be before effective-from date.');
  const [year, academicSession, cls, section, group, subject, teacher, room, period] = await Promise.all([
    prisma.academicYear.findFirst({ where: { id: input.academicYearId, schoolId, status: 'ACTIVE', deletedAt: null }, select: { id: true } }),
    input.sessionId ? prisma.academicSession.findFirst({ where: { id: input.sessionId, schoolId, academicYearId: input.academicYearId, status: 'ACTIVE', deletedAt: null }, select: { id: true } }) : Promise.resolve(null),
    prisma.class.findFirst({ where: { id: input.classId, schoolId, status: 'ACTIVE', deletedAt: null }, select: { id: true } }),
    prisma.section.findFirst({ where: { id: input.sectionId, schoolId, classId: input.classId, status: 'ACTIVE', deletedAt: null }, select: { id: true } }),
    input.groupId ? prisma.classGroup.findFirst({ where: { schoolId, academicYearId: input.academicYearId, classId: input.classId, groupId: input.groupId, status: 'ACTIVE', deletedAt: null }, select: { id: true } }) : Promise.resolve(null),
    prisma.classSubject.findFirst({ where: { schoolId, classId: input.classId, subjectId: input.subjectId, status: 'ACTIVE', deletedAt: null, AND: [{ OR: [{ academicYearId: input.academicYearId }, { academicYearId: null }] }, { OR: [{ groupId: input.groupId || null }, { groupId: null }] }] }, select: { id: true } }),
    prisma.teacher.findFirst({ where: { id: input.teacherId, schoolId, status: 'ACTIVE' }, select: { id: true } }),
    input.roomId ? prisma.room.findFirst({ where: { id: input.roomId, schoolId, status: 'ACTIVE', deletedAt: null }, select: { id: true } }) : Promise.resolve(null),
    prisma.period.findFirst({ where: { id: input.periodId, schoolId, status: 'ACTIVE', deletedAt: null, isBreak: false }, select: { id: true } }),
  ]);
  if (!year || !cls || !section || !subject || !teacher || !period) throw new Error('One or more selected academic options are invalid or inactive.');
  if (input.sessionId && !academicSession) throw new Error('The selected session does not belong to this academic year.');
  if (input.groupId && !group) throw new Error('The selected group is not assigned to this class.');
  if (input.roomId && !room) throw new Error('The selected room is invalid or inactive.');

  const candidates = await prisma.classRoutine.findMany({
    where: { schoolId, academicYearId: input.academicYearId, weekday: input.weekday, status: { not: 'INACTIVE' }, ...(currentId ? { id: { not: currentId } } : {}) },
    select: { classId: true, sectionId: true, teacherId: true, roomId: true, periodId: true, startTime: true, endTime: true },
  });
  for (const item of candidates) {
    if (!overlaps(input.startTime, input.endTime, item.startTime, item.endTime)) continue;
    if (item.classId === input.classId && item.sectionId === input.sectionId) throw new Error('This class and section already has a routine during that time.');
    if (item.teacherId === input.teacherId) throw new Error('The selected teacher already has a class during that time.');
    if (input.roomId && item.roomId === input.roomId) throw new Error('The selected room is already occupied during that time.');
  }
  if (candidates.some((item) => item.classId === input.classId && item.sectionId === input.sectionId && item.periodId === input.periodId)) throw new Error('This period is already assigned to the selected class and section.');
}

async function options(schoolId: string) {
  const [academicYears, sessions, classes, classGroups, classSubjects, teachers, rooms, periods] = await Promise.all([
    prisma.academicYear.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null }, select: { id: true, name: true, isCurrent: true }, orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }] }),
    prisma.academicSession.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null }, select: { id: true, name: true, academicYearId: true }, orderBy: { startDate: 'desc' } }),
    prisma.class.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null }, select: { id: true, name: true, sections: { where: { status: 'ACTIVE', deletedAt: null }, select: { id: true, name: true }, orderBy: { displayOrder: 'asc' } } }, orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }] }),
    prisma.classGroup.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null }, select: { academicYearId: true, classId: true, group: { select: { id: true, name: true } } } }),
    prisma.classSubject.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null, subject: { status: 'ACTIVE', deletedAt: null } }, select: { academicYearId: true, classId: true, groupId: true, subject: { select: { id: true, nameEn: true, code: true } } }, orderBy: { subject: { nameEn: 'asc' } } }),
    prisma.teacher.findMany({ where: { schoolId, status: 'ACTIVE' }, select: { id: true, nameEn: true, employeeCode: true }, orderBy: { nameEn: 'asc' } }),
    prisma.room.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null }, select: { id: true, name: true, code: true }, orderBy: { name: 'asc' } }),
    prisma.period.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null, isBreak: false }, select: { id: true, name: true, startTime: true, endTime: true }, orderBy: { displayOrder: 'asc' } }),
  ]);
  return {
    academicYears, sessions, classes,
    classGroups: classGroups.map((item) => ({ academicYearId: item.academicYearId, classId: item.classId, groupId: item.group.id, groupName: item.group.name })),
    classSubjects: classSubjects.map((item) => ({ academicYearId: item.academicYearId, classId: item.classId, groupId: item.groupId, subjectId: item.subject.id, subjectName: item.subject.nameEn, subjectCode: item.subject.code })),
    teachers, rooms, periods,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.ROUTINES_VIEW);
    const classId = request.nextUrl.searchParams.get('classId') || '';
    const sectionId = request.nextUrl.searchParams.get('sectionId') || '';
    const teacherId = request.nextUrl.searchParams.get('teacherId') || '';
    const weekday = request.nextUrl.searchParams.get('weekday') || '';
    const status = request.nextUrl.searchParams.get('status') || '';
    const [records, lookup] = await Promise.all([
      prisma.classRoutine.findMany({ where: { schoolId: session.schoolId, ...(classId ? { classId } : {}), ...(sectionId ? { sectionId } : {}), ...(teacherId ? { teacherId } : {}), ...(weekday ? { weekday } : {}), ...(status ? { status } : {}) }, orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }], take: 500 }),
      options(session.schoolId),
    ]);
    const classMap = new Map(lookup.classes.map((item) => [item.id, item.name]));
    const sectionMap = new Map(lookup.classes.flatMap((item) => item.sections).map((item) => [item.id, item.name]));
    const subjectMap = new Map(lookup.classSubjects.map((item) => [item.subjectId, item]));
    const teacherMap = new Map(lookup.teachers.map((item) => [item.id, item]));
    const roomMap = new Map(lookup.rooms.map((item) => [item.id, item]));
    const periodMap = new Map(lookup.periods.map((item) => [item.id, item]));
    const groupMap = new Map(lookup.classGroups.map((item) => [item.groupId, item.groupName]));
    return NextResponse.json({
      ...lookup,
      canManage: session.roles.includes('Super Admin') || session.permissions.includes(PERMISSIONS.ROUTINES_MANAGE),
      data: records.map((item) => ({ ...item, effectiveFrom: item.effectiveFrom.toISOString().slice(0, 10), effectiveTo: item.effectiveTo?.toISOString().slice(0, 10) || '', className: classMap.get(item.classId) || '—', sectionName: sectionMap.get(item.sectionId) || '—', groupName: item.groupId ? groupMap.get(item.groupId) || '—' : '', subjectName: subjectMap.get(item.subjectId)?.subjectName || '—', subjectCode: subjectMap.get(item.subjectId)?.subjectCode || '', teacherName: teacherMap.get(item.teacherId)?.nameEn || '—', teacherCode: teacherMap.get(item.teacherId)?.employeeCode || '', roomName: item.roomId ? roomMap.get(item.roomId)?.name || '—' : '—', periodName: periodMap.get(item.periodId)?.name || '—' })),
    });
  } catch (error) {
    console.error('GET /api/routines error', error);
    return NextResponse.json({ error: 'Unable to load class routines.' }, { status: authorizationStatus(error) });
  }
}

async function save(request: NextRequest, id?: string) {
  const session = await requirePermission(PERMISSIONS.ROUTINES_MANAGE);
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid routine data.' }, { status: 400 });
  await validateInput(session.schoolId, parsed.data, id);
  const data = { schoolId: session.schoolId, academicYearId: parsed.data.academicYearId, sessionId: parsed.data.sessionId || null, classId: parsed.data.classId, sectionId: parsed.data.sectionId, groupId: parsed.data.groupId || null, subjectId: parsed.data.subjectId, teacherId: parsed.data.teacherId, roomId: parsed.data.roomId || null, weekday: parsed.data.weekday, periodId: parsed.data.periodId, startTime: parsed.data.startTime, endTime: parsed.data.endTime, effectiveFrom: dayDate(parsed.data.effectiveFrom), effectiveTo: parsed.data.effectiveTo ? dayDate(parsed.data.effectiveTo) : null, status: parsed.data.status };
  const routine = id ? await prisma.classRoutine.update({ where: { id }, data: { ...data, versionNumber: { increment: 1 } } }) : await prisma.classRoutine.create({ data: { ...data, versionNumber: 1 } });
  await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: id ? 'UPDATE' : 'CREATE', module: 'Class Routines', recordId: routine.id, details: `${id ? 'Updated' : 'Created'} ${routine.weekday} ${routine.startTime}-${routine.endTime} routine slot` });
  return NextResponse.json(routine, { status: id ? 200 : 201 });
}

export async function POST(request: NextRequest) {
  try { return await save(request); }
  catch (error) { console.error('POST /api/routines error', error); const message = error instanceof Error ? error.message : 'Unable to create routine.'; return NextResponse.json({ error: message }, { status: authorizationStatus(error) === 500 ? 409 : authorizationStatus(error) }); }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id') || '';
    const session = await requirePermission(PERMISSIONS.ROUTINES_MANAGE);
    const owned = await prisma.classRoutine.findFirst({ where: { id, schoolId: session.schoolId }, select: { id: true } });
    if (!owned) return NextResponse.json({ error: 'Routine slot not found.' }, { status: 404 });
    return await save(request, id);
  } catch (error) { console.error('PUT /api/routines error', error); const message = error instanceof Error ? error.message : 'Unable to update routine.'; return NextResponse.json({ error: message }, { status: authorizationStatus(error) === 500 ? 409 : authorizationStatus(error) }); }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.ROUTINES_MANAGE);
    const id = request.nextUrl.searchParams.get('id') || '';
    const owned = await prisma.classRoutine.findFirst({ where: { id, schoolId: session.schoolId }, select: { id: true, weekday: true, startTime: true } });
    if (!owned) return NextResponse.json({ error: 'Routine slot not found.' }, { status: 404 });
    await prisma.classRoutine.delete({ where: { id } });
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'DELETE', module: 'Class Routines', recordId: id, details: `Deleted ${owned.weekday} ${owned.startTime} routine slot` });
    return NextResponse.json({ ok: true });
  } catch (error) { console.error('DELETE /api/routines error', error); return NextResponse.json({ error: 'Unable to delete routine.' }, { status: authorizationStatus(error) }); }
}
