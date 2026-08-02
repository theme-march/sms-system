'use server';

import prisma from '@/src/lib/db/prisma';
import { toClientData } from '@/src/lib/serialize';

export interface StudentFilterParams {
  search?: string;
  admissionNumber?: string;
  studentCode?: string;
  rollNumber?: number;
  studentPhone?: string;
  guardianPhone?: string;
  classId?: string;
  sectionId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  schoolId?: string;
}

export async function getStudents(params: StudentFilterParams = {}) {
  const {
    search = '',
    admissionNumber = '',
    studentCode = '',
    rollNumber,
    studentPhone = '',
    guardianPhone = '',
    classId = '',
    sectionId = '',
    status = '',
    page = 1,
    pageSize = 10,
    schoolId,
  } = params;

  try {
    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (status) where.status = status as any;
    if (classId) where.classId = classId;
    if (sectionId) where.sectionId = sectionId;
    if (admissionNumber) where.admissionNumber = { contains: admissionNumber };
    if (studentCode) where.studentCode = { contains: studentCode };
    if (rollNumber) where.rollNumber = rollNumber;
    if (studentPhone) where.phone = { contains: studentPhone };

    if (search) {
      where.OR = [
        { nameEn: { contains: search } },
        { nameBn: { contains: search } },
        { admissionNumber: { contains: search } },
        { studentCode: { contains: search } },
        { phone: { contains: search } },
        { fatherName: { contains: search } },
        { motherName: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    if (guardianPhone) {
      where.guardians = {
        some: {
          guardian: {
            phone: { contains: guardianPhone },
          },
        },
      };
    }

    const [total, students] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.findMany({
        where,
        include: {
          user: true,
          class: true,
          section: true,
          guardians: {
            include: {
              guardian: {
                include: { user: true },
              },
            },
          },
          enrollments: {
            include: {
              academicYear: true,
              class: true,
              section: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          documents: true,
          medicalInfo: true,
          previousEducation: true,
          statusHistories: {
            orderBy: { createdAt: 'desc' },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (students.length > 0) {
      return toClientData({ total, page, pageSize, totalPages: Math.ceil(total / pageSize), data: students });
    }
  } catch (error) {
    console.warn('Database query failed or offline:', error);
  }

  // When DB query fails or no student records exist, return empty paginated result
  return {
    total: 0,
    page,
    pageSize,
    totalPages: 0,
    data: [],
  };
}

export async function getStudentById(id: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        school: true,
        user: true,
        class: true,
        section: true,
        guardians: {
          include: {
            guardian: {
              include: { user: true },
            },
          },
        },
        enrollments: {
          include: {
            academicYear: true,
            academicSession: true,
            class: true,
            section: true,
            group: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        documents: true,
        medicalInfo: true,
        previousEducation: true,
        statusHistories: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (student) return toClientData(student);
  } catch (error) {
    console.warn('Database error when fetching student by ID:', error);
  }

  // Return null when the database has no matching student.
  return null;
}

export async function createStudent(data: any) {
  try {
    return toClientData(await prisma.student.create({
      data,
    }));
  } catch (error) {
    console.warn('Error creating student in DB:', error);
    return null;
  }
}

export async function updateStudent(id: string, data: any) {
  try {
    return toClientData(await prisma.student.update({
      where: { id },
      data,
    }));
  } catch (error) {
    console.warn('Error updating student in DB:', error);
    return null;
  }
}
