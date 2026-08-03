import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/db/prisma';
import { defaultWebsiteContent, normalizeWebsiteContent } from '@/src/lib/website-content';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';

export async function GET(request: NextRequest) {
  try {
    const admin = request.nextUrl.searchParams.get('admin') === '1';
    const session = admin ? await requirePermission(PERMISSIONS.SCHOOL_SETTINGS_MANAGE) : null;
    const school = session?.schoolId
      ? await prisma.school.findUnique({ where: { id: session.schoolId }, include: { websiteSettings: true } })
      : await prisma.school.findFirst({ where: { deletedAt: null }, include: { websiteSettings: true }, orderBy: { createdAt: 'asc' } });
    if (!school) return NextResponse.json({ school: null, content: defaultWebsiteContent });
    return NextResponse.json({
      school: { name: school.name, eiin: school.eiin, address: school.address, phone: school.phone, email: school.email, principalName: school.principalName },
      content: normalizeWebsiteContent(school.websiteSettings?.content),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to load website content.' }, { status: authorizationStatus(error) });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.SCHOOL_SETTINGS_MANAGE);
    if (!session.schoolId) return NextResponse.json({ error: 'School not found.' }, { status: 404 });
    const body = normalizeWebsiteContent(await request.json());
    const saved = await prisma.websiteSettings.upsert({
      where: { schoolId: session.schoolId },
      update: { content: body },
      create: { schoolId: session.schoolId, content: body },
    });
    try {
      await prisma.auditLog.create({ data: { schoolId: session.schoolId, userId: session.id, action: 'UPDATE', module: 'WEBSITE', recordId: saved.id, details: 'Public website content updated' } });
    } catch (auditError) {
      console.error('Website settings saved but audit log failed:', auditError);
    }
    return NextResponse.json({ content: normalizeWebsiteContent(saved.content) });
  } catch (error) {
    console.error('Website settings save failed:', error);
    const message = error instanceof Error ? error.message : 'Unable to save website content.';
    return NextResponse.json({ error: message }, { status: authorizationStatus(error) });
  }
}
