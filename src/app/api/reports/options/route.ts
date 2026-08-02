import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';

export async function GET(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.REPORTS_VIEW);
    const schoolId = session.schoolId;
    const academicYearId = request.nextUrl.searchParams.get('academicYearId') || undefined;
    const sessionId = request.nextUrl.searchParams.get('sessionId') || undefined;
    const classId = request.nextUrl.searchParams.get('classId') || undefined;
    const sectionId = request.nextUrl.searchParams.get('sectionId') || undefined;
    const groupId = request.nextUrl.searchParams.get('groupId') || undefined;
    const subjectId = request.nextUrl.searchParams.get('subjectId') || undefined;
    const enrollmentFilter = {
      ...(academicYearId ? { academicYearId } : {}),
      ...(sessionId ? { sessionId } : {}),
      ...(classId ? { classId } : {}),
      ...(sectionId ? { sectionId } : {}),
      ...(groupId ? { groupId } : {}),
      enrollmentStatus: 'ACTIVE',
    };
    const [academicYears, sessions, classes, sections, groups, subjects, students, teachers] = await Promise.all([
      prisma.academicYear.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null }, select: { id: true, name: true, isCurrent: true }, orderBy: { startDate: 'desc' } }),
      prisma.academicSession.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null, ...(academicYearId ? { academicYearId } : {}) }, select: { id: true, name: true, academicYearId: true }, orderBy: { startDate: 'desc' } }),
      prisma.class.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null, ...((academicYearId || sessionId) ? { studentEnrollments: { some: { schoolId, ...enrollmentFilter } } } : {}) }, select: { id: true, name: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.section.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null, ...(classId ? { classId } : {}), ...((academicYearId || sessionId) ? { studentEnrollments: { some: { schoolId, ...enrollmentFilter } } } : {}) }, select: { id: true, name: true, classId: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.group.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null, ...((academicYearId || sessionId || classId) ? { studentEnrollments: { some: { schoolId, ...enrollmentFilter } } } : {}) }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
      prisma.subject.findMany({ where: { schoolId, status: 'ACTIVE', deletedAt: null, ...(classId ? { classSubjects: { some: { classId, status: 'ACTIVE', deletedAt: null, ...(academicYearId ? { OR: [{ academicYearId }, { academicYearId: null }] } : {}) } } } : {}) }, select: { id: true, nameEn: true }, orderBy: { nameEn: 'asc' } }),
      prisma.student.findMany({ where: { schoolId, status: 'ACTIVE', ...((academicYearId || sessionId || classId || sectionId || groupId) ? { enrollments: { some: { schoolId, ...enrollmentFilter } } } : {}) }, select: { id: true, nameEn: true, admissionNumber: true }, orderBy: { nameEn: 'asc' }, take: 2000 }),
      prisma.teacher.findMany({ where: { schoolId, status: 'ACTIVE', ...((academicYearId || sessionId || classId || sectionId || groupId || subjectId) ? { assignments: { some: { schoolId, status: 'ACTIVE', ...(academicYearId ? { academicYearId } : {}), ...(sessionId ? { sessionId } : {}), ...(classId ? { classId } : {}), ...(sectionId ? { sectionId } : {}), ...(groupId ? { groupId } : {}), ...(subjectId ? { subjectId } : {}) } } } : {}) }, select: { id: true, nameEn: true, employeeCode: true }, orderBy: { nameEn: 'asc' }, take: 1000 }),
    ]);
    const currentYear = academicYears.find((item) => item.isCurrent) || academicYears[0];
    const defaultSession = sessions.find((item) => item.academicYearId === currentYear?.id) || sessions[0];
    return NextResponse.json({
      academicYears: academicYears.map(({ id, name }) => ({ id, name })), sessions, classes, sections, groups,
      subjects: subjects.map((item) => ({ id: item.id, name: item.nameEn })),
      students: students.map((item) => ({ id: item.id, name: `${item.nameEn} (${item.admissionNumber})` })),
      teachers: teachers.map((item) => ({ id: item.id, name: `${item.nameEn} (${item.employeeCode})` })),
      defaults: { academicYearId: currentYear?.id || '', sessionId: defaultSession?.id || '' },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Options failed' }, { status: authorizationStatus(error) });
  }
}
