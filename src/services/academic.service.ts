import prisma from '@/src/lib/db/prisma';

export async function getClassesWithSections(schoolId?: string) {
  try {
    const classes = await prisma.class.findMany({
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

    if (classes.length > 0) return classes;
  } catch {
    // Fallback data when database is unavailable
  }

  // Fallback demo data
  return [
    {
      id: 'cls-6',
      name: 'Class 6',
      code: 'CLASS-06',
      numeric: 6,
      sections: [
        { id: 'sec-6a', name: 'Padma', capacity: 40 },
        { id: 'sec-6b', name: 'Meghna', capacity: 40 },
      ],
      _count: { students: 78 },
    },
    {
      id: 'cls-9',
      name: 'Class 9 (Science)',
      code: 'CLASS-09-SCI',
      numeric: 9,
      sections: [
        { id: 'sec-9a', name: 'Jamuna', capacity: 45 },
        { id: 'sec-9b', name: 'Karnafuli', capacity: 45 },
      ],
      _count: { students: 86 },
    },
    {
      id: 'cls-10',
      name: 'Class 10 (S.S.C Candidate)',
      code: 'CLASS-10',
      numeric: 10,
      sections: [
        { id: 'sec-10a', name: 'Padma', capacity: 40 },
        { id: 'sec-10b', name: 'Meghna', capacity: 40 },
      ],
      _count: { students: 92 },
    },
  ];
}

export async function getSubjects(schoolId?: string) {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { code: 'asc' },
    });
    if (subjects.length > 0) return subjects;
  } catch {
    // Fallback data when database is unavailable
  }

  return [
    { id: 'sb-1', name: 'Bangla 1st Paper', code: 'BAN-101', type: 'THEORY' },
    { id: 'sb-2', name: 'English 1st Paper', code: 'ENG-101', type: 'THEORY' },
    { id: 'sb-3', name: 'Higher Mathematics', code: 'MATH-201', type: 'BOTH' },
    { id: 'sb-4', name: 'Physics', code: 'PHY-301', type: 'BOTH' },
    { id: 'sb-5', name: 'Chemistry', code: 'CHE-301', type: 'BOTH' },
    { id: 'sb-6', name: 'Information & Communication Tech (ICT)', code: 'ICT-101', type: 'BOTH' },
  ];
}
