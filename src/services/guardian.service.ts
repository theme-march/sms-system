'use server';

import prisma from '@/src/lib/db/prisma';

export interface GuardianFilterParams {
  search?: string;
  phone?: string;
  nationalId?: string;
  status?: string;
  schoolId?: string;
  page?: number;
  pageSize?: number;
}

export async function getGuardians(params: GuardianFilterParams = {}) {
  const { search = '', phone = '', nationalId = '', status = '', schoolId, page = 1, pageSize = 10 } = params;

  try {
    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (status) where.status = status as any;
    if (phone) where.phone = { contains: phone };
    if (nationalId) where.nationalId = { contains: nationalId };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        { nationalId: { contains: search } },
        { occupation: { contains: search } },
        { user: { name: { contains: search } } },
      ];
    }

    const [total, guardians] = await Promise.all([
      prisma.guardian.count({ where }),
      prisma.guardian.findMany({
        where,
        include: {
          user: true,
          school: true,
          students: {
            include: {
              student: {
                include: {
                  class: true,
                  section: true,
                  user: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, page, pageSize, totalPages: Math.ceil(total / pageSize), data: guardians };
  } catch (error) {
    console.error('Failed to fetch guardians from database:', error);
    return {
      total: 0,
      page,
      pageSize,
      totalPages: 0,
      data: [],
    };
  }
}

export async function getGuardianById(id: string) {
  try {
    const guardian = await prisma.guardian.findUnique({
      where: { id },
      include: {
        school: true,
        user: true,
        students: {
          include: {
            student: {
              include: {
                class: true,
                section: true,
                user: true,
                enrollments: {
                  include: { academicYear: true, class: true, section: true },
                },
                attendances: { take: 5, orderBy: { date: 'desc' } },
                feeInvoices: { take: 5, orderBy: { createdAt: 'desc' } },
              },
            },
          },
        },
      },
    });
    if (guardian) return guardian;
  } catch (error) {
    console.error('Failed to fetch guardian by ID from database:', error);
  }

  return null;
}

export async function createGuardian(data: any) {
  try {
    return await prisma.guardian.create({ data });
  } catch (error) {
    console.error('Failed to create guardian:', error);
    throw error;
  }
}

export async function updateGuardian(id: string, data: any) {
  try {
    return await prisma.guardian.update({ where: { id }, data });
  } catch (error) {
    console.error('Failed to update guardian:', error);
    throw error;
  }
}
