import prisma from '@/src/lib/db/prisma';

export interface EnrollmentFilterParams {
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  studentId?: string;
  schoolId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export async function checkDuplicateRollNumber(
  academicYearId: string,
  classId: string,
  sectionId: string,
  rollNumber: number
) {
  try {
    const existing = await prisma.studentEnrollment.findFirst({
      where: {
        academicYearId,
        classId,
        sectionId,
        rollNumber,
        enrollmentStatus: 'ACTIVE',
      },
    });
    return !!existing;
  } catch (error) {
    console.warn('DB check for duplicate roll failed:', error);
    return false;
  }
}

export async function checkActiveEnrollment(studentId: string, academicYearId: string) {
  try {
    const existing = await prisma.studentEnrollment.findFirst({
      where: {
        studentId,
        academicYearId,
        enrollmentStatus: 'ACTIVE',
      },
    });
    return !!existing;
  } catch (error) {
    console.warn('DB check for active enrollment failed:', error);
    return false;
  }
}

export async function getEnrollments(params: EnrollmentFilterParams = {}) {
  const { academicYearId, classId, sectionId, studentId, schoolId, status, page = 1, pageSize = 10 } = params;

  try {
    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (academicYearId) where.academicYearId = academicYearId;
    if (classId) where.classId = classId;
    if (sectionId) where.sectionId = sectionId;
    if (studentId) where.studentId = studentId;
    if (status) where.enrollmentStatus = status;

    const [total, enrollments] = await Promise.all([
      prisma.studentEnrollment.count({ where }),
      prisma.studentEnrollment.findMany({
        where,
        include: {
          student: {
            include: { user: true },
          },
          academicYear: true,
          class: true,
          section: true,
          group: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { rollNumber: 'asc' },
      }),
    ]);

    return { total, page, pageSize, totalPages: Math.ceil(total / pageSize), data: enrollments };
  } catch (error) {
    console.error('Database error when fetching enrollments:', error);
    return {
      total: 0,
      page,
      pageSize,
      totalPages: 0,
      data: [],
    };
  }
}

export async function createEnrollment(data: any) {
  const isDupRoll = await checkDuplicateRollNumber(data.academicYearId, data.classId, data.sectionId, data.rollNumber);
  if (isDupRoll) {
    throw new Error(`Roll number #${data.rollNumber} is already assigned in this academic year, class, and section.`);
  }

  const isDupActive = await checkActiveEnrollment(data.studentId, data.academicYearId);
  if (isDupActive) {
    throw new Error(`Student is already actively enrolled for this academic year.`);
  }

  try {
    return await prisma.studentEnrollment.create({
      data,
    });
  } catch (error) {
    console.error('Database error when creating enrollment:', error);
    throw error;
  }
}
