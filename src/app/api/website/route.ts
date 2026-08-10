import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/db/prisma';
import { defaultWebsiteContent, normalizeWebsiteContent, type WebsiteContent } from '@/src/lib/website-content';
import { requireAnyPermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS, WEBSITE_PERMISSIONS, WEBSITE_SECTION_PERMISSIONS } from '@/src/config/permissions';

function sectionPermission(request: NextRequest) {
  const section = request.nextUrl.searchParams.get('section') || 'overview';
  return WEBSITE_SECTION_PERMISSIONS[section as keyof typeof WEBSITE_SECTION_PERMISSIONS];
}

function replacePublicPage(current: WebsiteContent, incoming: WebsiteContent, slug: string) {
  const updatedPage = incoming.pages.find((page) => page.slug === slug && !page.custom);
  if (!updatedPage) return current.pages;
  return current.pages.map((page) => page.slug === slug && !page.custom ? updatedPage : page);
}

function mergeAuthorizedSection(current: WebsiteContent, incoming: WebsiteContent, section: string): WebsiteContent {
  if (section === 'overview') return { ...current, theme: incoming.theme, menu: incoming.menu, footerText: incoming.footerText };
  if (section === 'custom-pages') return { ...current, pages: [...current.pages.filter((page) => !page.custom), ...incoming.pages.filter((page) => page.custom)] };
  if (section === 'banners') return { ...current, banners: incoming.banners };
  if (section === 'home') return {
    ...current,
    notices: incoming.notices,
    aboutTitle: incoming.aboutTitle,
    aboutText: incoming.aboutText,
    principalName: incoming.principalName,
    principalMessage: incoming.principalMessage,
    principalImage: incoming.principalImage,
    academics: incoming.academics,
    gallery: incoming.gallery,
    homeTeacherIds: incoming.homeTeacherIds,
    meetingDates: incoming.meetingDates,
    calendarWeeklyOffDays: incoming.calendarWeeklyOffDays,
    emergencyContacts: incoming.emergencyContacts,
    campaignLinks: incoming.campaignLinks,
    admissionText: incoming.admissionText,
    contactText: incoming.contactText,
  };
  const pageSlug = section;
  const merged = { ...current, pages: replacePublicPage(current, incoming, pageSlug) };
  if (section === 'downloads') return { ...merged, downloads: incoming.downloads };
  if (section === 'contact') return {
    ...merged,
    contactAddress: incoming.contactAddress,
    contactPhone: incoming.contactPhone,
    contactEmail: incoming.contactEmail,
    contactText: incoming.contactText,
  };
  return merged;
}

export async function GET(request: NextRequest) {
  try {
    const admin = request.nextUrl.searchParams.get('admin') === '1';
    const session = admin ? await requireAnyPermission([...WEBSITE_PERMISSIONS, PERMISSIONS.SCHOOL_SETTINGS_MANAGE]) : null;
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
    const section = request.nextUrl.searchParams.get('section') || 'overview';
    const permission = sectionPermission(request);
    if (!permission) return NextResponse.json({ error: 'Unknown website section.' }, { status: 400 });
    const session = await requireAnyPermission([permission, PERMISSIONS.SCHOOL_SETTINGS_MANAGE]);
    if (!session.schoolId) return NextResponse.json({ error: 'School not found.' }, { status: 404 });
    const incoming = normalizeWebsiteContent(await request.json());
    const existing = await prisma.websiteSettings.findUnique({ where: { schoolId: session.schoolId } });
    const current = normalizeWebsiteContent(existing?.content);
    const body = mergeAuthorizedSection(current, incoming, section);
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
