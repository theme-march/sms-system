import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/db/prisma';
import { requireAnyPermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { defaultWebsiteContent, normalizeWebsiteContent } from '@/src/lib/website-content';

export async function GET() {
  try {
    const session = await requireAnyPermission([PERMISSIONS.WEBSITE_TEACHERS_MANAGE, PERMISSIONS.SCHOOL_SETTINGS_MANAGE]);
    if (!session.schoolId) return NextResponse.json([]);
    const teachers = await prisma.teacher.findMany({
      where: { schoolId: session.schoolId, status: 'ACTIVE' },
      include: { department: true, designation: true },
      orderBy: [{ joiningDate: 'asc' }, { nameEn: 'asc' }],
    });
    return NextResponse.json(teachers.map(t => ({
      id: t.id,
      employeeCode: t.employeeCode,
      name: t.nameBn || t.nameEn,
      nameEn: t.nameEn,
      photo: t.profilePhoto,
      designation: t.designation?.nameBn || t.designation?.nameEn || 'শিক্ষক',
      department: t.department?.nameBn || t.department?.nameEn || '',
      qualification: t.qualification || '',
    })));
  } catch (error) {
    return NextResponse.json({ error: 'Unable to load teachers.' }, { status: authorizationStatus(error) });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAnyPermission([PERMISSIONS.WEBSITE_TEACHERS_MANAGE, PERMISSIONS.SCHOOL_SETTINGS_MANAGE]);
    if (!session.schoolId) return NextResponse.json({ error: 'School not found.' }, { status: 404 });
    const body = await request.json();
    const requestedIds = Array.isArray(body.teacherIds) ? body.teacherIds.filter((id: unknown): id is string => typeof id === 'string') : [];
    const validTeachers = await prisma.teacher.findMany({ where: { schoolId: session.schoolId, id: { in: requestedIds }, status: 'ACTIVE' }, select: { id: true } });
    const current = await prisma.websiteSettings.findUnique({ where: { schoolId: session.schoolId } });
    const content = normalizeWebsiteContent(current?.content || defaultWebsiteContent);
    content.publicTeacherIds = validTeachers.map(t => t.id);
    await prisma.websiteSettings.upsert({ where: { schoolId: session.schoolId }, update: { content }, create: { schoolId: session.schoolId, content } });
    return NextResponse.json({ publicTeacherIds: content.publicTeacherIds });
  } catch (error) {
    console.error('Teacher website visibility save failed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save teacher selection.' }, { status: authorizationStatus(error) });
  }
}
