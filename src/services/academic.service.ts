import prisma from '@/src/lib/db/prisma';

export async function getClassesWithSections(schoolId?: string) {
  return prisma.class.findMany({
      where: { ...(schoolId ? { schoolId } : {}), deletedAt: null },
      include: {
        sections: true,
        classSubjects: {
          include: {
            subject: true,
          },
        },
        _count: {
          select: { students: true },
        },
      },
      orderBy: { numericLevel: 'asc' },
    });
}

export async function getSubjects(schoolId?: string) {
  return prisma.subject.findMany({
      where: { ...(schoolId ? { schoolId } : {}), deletedAt: null },
      orderBy: { code: 'asc' },
  });
}
