import prisma from '@/src/lib/db/prisma';

export interface SchoolSettingsUpdateInput {
  name: string;
  code: string;
  eiin?: string;
  principalName?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  currency?: string;
  timezone?: string;
  dateFormat?: string;
  defaultLanguage?: string;
  academicYear?: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export async function getSchoolProfile(schoolId?: string) {
  return prisma.school.findFirst({
    where: schoolId ? { id: schoolId, deletedAt: null } : { deletedAt: null },
    include: { settings: true, branding: true },
  });
}

export async function updateSchoolProfile(schoolId: string, data: SchoolSettingsUpdateInput, userId?: string) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.school.update({
      where: { id: schoolId },
      data: {
        name: data.name,
        code: data.code,
        eiin: data.eiin,
        principalName: data.principalName,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website,
        settings: {
          upsert: {
            create: {
              currency: data.currency || 'BDT',
              timezone: data.timezone || 'Asia/Dhaka',
              dateFormat: data.dateFormat || 'DD/MM/YYYY',
              defaultLanguage: data.defaultLanguage || 'bn',
              academicYear: data.academicYear || '2026',
            },
            update: {
              currency: data.currency,
              timezone: data.timezone,
              dateFormat: data.dateFormat,
              defaultLanguage: data.defaultLanguage,
              academicYear: data.academicYear,
            },
          },
        },
        branding: {
          upsert: {
            create: {
              logoUrl: data.logoUrl,
              faviconUrl: data.faviconUrl,
            },
            update: {
              logoUrl: data.logoUrl,
              faviconUrl: data.faviconUrl,
            },
          },
        },
      },
      include: {
        settings: true,
        branding: true,
      },
    });

    // Audit Log Creation
    await tx.auditLog.create({
      data: {
        schoolId,
        userId,
        action: 'UPDATE',
        module: 'SchoolSettings',
        recordId: schoolId,
        details: JSON.stringify({ updatedFields: Object.keys(data) }),
      },
    });

    return updated;
  });
}
