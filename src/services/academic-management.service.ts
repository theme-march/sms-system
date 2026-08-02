"use server";
import prisma from '@/src/lib/db/prisma';
import { validateSingleCurrentYear } from '@/src/lib/validations/academic';


export interface PaginatedParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  schoolId?: string;
  subjectType?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==========================================
// 1. ACADEMIC YEARS
// ==========================================
export interface AcademicYearRecord {
  id: string;
  schoolId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
}


export async function getAcademicYears(params: PaginatedParams): Promise<PaginatedResult<AcademicYearRecord>> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();
  const status = params.status;

  try {
    const where: any = { deletedAt: null, ...(params.schoolId ? { schoolId: params.schoolId } : {}) };
    if (search) where.name = { contains: search };
    if (status) where.status = status;

    const total = await prisma.academicYear.count({ where });
    const records = await prisma.academicYear.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { startDate: 'desc' },
    });

    if (records.length > 0) {
      return {
        data: records.map((r) => ({
          id: r.id,
          schoolId: r.schoolId,
          name: r.name,
          startDate: new Date(r.startDate).toISOString().split('T')[0],
          endDate: new Date(r.endDate).toISOString().split('T')[0],
          isCurrent: r.isCurrent,
          status: r.status as 'ACTIVE' | 'INACTIVE',
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }
  } catch (err) {
    console.error('Error fetching academic years:', err);
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }

  // No records found — return empty result set
  return {
    data: [],
    total: 0,
    page,
    pageSize,
    totalPages: 0,
  };
}

export async function createAcademicYear(payload: Omit<AcademicYearRecord, 'id'>) {
  try {
    if (payload.isCurrent) {
      await prisma.academicYear.updateMany({
        where: { schoolId: payload.schoolId },
        data: { isCurrent: false },
      });
    }

    const created = await prisma.academicYear.create({
      data: {
        schoolId: payload.schoolId,
        name: payload.name,
        startDate: new Date(payload.startDate),
        endDate: new Date(payload.endDate),
        isCurrent: payload.isCurrent,
        status: payload.status as any,
      },
    });

    return {
      id: created.id,
      schoolId: created.schoolId,
      name: created.name,
      startDate: new Date(created.startDate).toISOString().split('T')[0],
      endDate: new Date(created.endDate).toISOString().split('T')[0],
      isCurrent: created.isCurrent,
      status: created.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (err) {
    console.error('Failed to create academic year via Prisma, error:', err);
    throw err;
  }
}

export async function updateAcademicYear(id: string, payload: Partial<AcademicYearRecord>) {
  try {
    if (payload.isCurrent && payload.schoolId) {
      await prisma.academicYear.updateMany({
        where: { schoolId: payload.schoolId, id: { not: id } },
        data: { isCurrent: false },
      });
    }

    const updated = await prisma.academicYear.update({
      where: { id },
      data: {
        ...(payload.name && { name: payload.name }),
        ...(payload.startDate && { startDate: new Date(payload.startDate) }),
        ...(payload.endDate && { endDate: new Date(payload.endDate) }),
        ...(payload.isCurrent !== undefined && { isCurrent: payload.isCurrent }),
        ...(payload.status && { status: payload.status as any }),
      },
    });

    return {
      id: updated.id,
      schoolId: updated.schoolId,
      name: updated.name,
      startDate: new Date(updated.startDate).toISOString().split('T')[0],
      endDate: new Date(updated.endDate).toISOString().split('T')[0],
      isCurrent: updated.isCurrent,
      status: updated.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (err) {
    console.error('Failed to update academic year via Prisma, error:', err);
    throw err;
  }
}

export async function toggleAcademicYearStatus(id: string) {
  try {
    const record = await prisma.academicYear.findUnique({ where: { id } });
    if (record) {
      const updated = await prisma.academicYear.update({
        where: { id },
        data: { status: record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' },
      });
      return updated;
    }
    // If no record found, throw
    throw new Error('Academic year not found');
  } catch (err) {
    console.error('Failed to toggle academic year status via Prisma, error:', err);
    throw err;
  }
}

export async function deleteAcademicYear(id: string) {
  // Safe delete check: verify if historical data relies on this year
  try {
    const hasSessions = await prisma.academicSession.count({ where: { academicYearId: id, deletedAt: null } });
    if (hasSessions > 0) {
      throw new Error('Cannot delete historical academic year currently associated with active sessions or assignments.');
    }
    await prisma.academicYear.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });
    return true;
  } catch (err: any) {
    if (err?.message?.includes('associated with active sessions')) throw err;
    throw err;
  }
}

// ==========================================
// 2. ACADEMIC SESSIONS
// ==========================================
export interface AcademicSessionRecord {
  id: string;
  schoolId: string;
  academicYearId: string;
  academicYearName?: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}


export async function getAcademicSessions(params: PaginatedParams & { academicYearId?: string }) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();
  const status = params.status;
  const yearId = params.academicYearId;

  try {
    const where: any = { deletedAt: null };
    if (search) where.name = { contains: search };
    if (status) where.status = status;
    if (yearId) where.academicYearId = yearId;

    const total = await prisma.academicSession.count({ where });
    const records = await prisma.academicSession.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { academicYear: true },
      orderBy: { startDate: 'asc' },
    });

    if (records.length > 0) {
      return {
        data: records.map((r) => ({
          id: r.id,
          schoolId: r.schoolId,
          academicYearId: r.academicYearId,
          academicYearName: r.academicYear?.name || 'Academic Year',
          name: r.name,
          startDate: new Date(r.startDate).toISOString().split('T')[0],
          endDate: new Date(r.endDate).toISOString().split('T')[0],
          status: r.status as 'ACTIVE' | 'INACTIVE',
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }
  } catch (err) {
    console.error('Error fetching academic sessions:', err);
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  return { data: [], total: 0, page, pageSize, totalPages: 0 };
}

export async function createAcademicSession(payload: Omit<AcademicSessionRecord, 'id'>) {
  try {
    const created = await prisma.academicSession.create({
      data: {
        schoolId: payload.schoolId,
        academicYearId: payload.academicYearId,
        name: payload.name,
        startDate: new Date(payload.startDate),
        endDate: new Date(payload.endDate),
        status: payload.status as any,
      },
      include: { academicYear: true },
    });

    return {
      id: created.id,
      schoolId: created.schoolId,
      academicYearId: created.academicYearId,
      academicYearName: created.academicYear?.name || 'Academic Year',
      name: created.name,
      startDate: new Date(created.startDate).toISOString().split('T')[0],
      endDate: new Date(created.endDate).toISOString().split('T')[0],
      status: created.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (err) {
    throw err;
  }
}

export async function updateAcademicSession(id: string, payload: Partial<AcademicSessionRecord>) {
  try {
    const updated = await prisma.academicSession.update({
      where: { id },
      data: {
        ...(payload.name && { name: payload.name }),
        ...(payload.academicYearId && { academicYearId: payload.academicYearId }),
        ...(payload.startDate && { startDate: new Date(payload.startDate) }),
        ...(payload.endDate && { endDate: new Date(payload.endDate) }),
        ...(payload.status && { status: payload.status as any }),
      },
      include: { academicYear: true },
    });

    return {
      id: updated.id,
      schoolId: updated.schoolId,
      academicYearId: updated.academicYearId,
      academicYearName: updated.academicYear?.name || 'Academic Year',
      name: updated.name,
      startDate: new Date(updated.startDate).toISOString().split('T')[0],
      endDate: new Date(updated.endDate).toISOString().split('T')[0],
      status: updated.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (err) {
    throw err;
  }
}

export async function toggleAcademicSessionStatus(id: string) {
  const existing = await prisma.academicSession.findUnique({ where: { id } });
  if (!existing) throw new Error('Session not found');
  return prisma.academicSession.update({
    where: { id },
    data: { status: existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' },
  });
}

export async function deleteAcademicSession(id: string) {
  await prisma.academicSession.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'INACTIVE' },
  });
  return true;
}

// ==========================================
// 3. CLASSES
// ==========================================
export interface ClassRecord {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  numericLevel: number;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export async function getClassesList(params: PaginatedParams): Promise<PaginatedResult<ClassRecord>> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();
  const status = params.status;

  try {
    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
      ];
    }
    if (status) where.status = status;

    const total = await prisma.class.count({ where });
    const records = await prisma.class.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { displayOrder: 'asc' },
    });

    if (records.length > 0) {
      return {
        data: records.map((r) => ({
          id: r.id,
          schoolId: r.schoolId,
          name: r.name,
          code: r.code,
          numericLevel: r.numericLevel,
          displayOrder: r.displayOrder,
          status: r.status as 'ACTIVE' | 'INACTIVE',
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }
  } catch (err) {
    console.error('Error fetching classes list:', err);
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  // No records found — return empty result set
  return { data: [], total: 0, page, pageSize, totalPages: 0 };
}

export async function createClass(payload: Omit<ClassRecord, 'id'>) {
  try {
    const created = await prisma.class.create({
      data: {
        schoolId: payload.schoolId,
        name: payload.name,
        code: payload.code,
        numericLevel: payload.numericLevel,
        displayOrder: payload.displayOrder,
        status: payload.status as any,
      },
    });
    return {
      id: created.id,
      schoolId: created.schoolId,
      name: created.name,
      code: created.code,
      numericLevel: created.numericLevel,
      displayOrder: created.displayOrder,
      status: created.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (err) {
    console.error('Failed to create class via Prisma:', err);
    throw err;
  }
}

export async function updateClass(id: string, payload: Partial<ClassRecord>) {
  try {
    const updated = await prisma.class.update({
      where: { id },
      data: payload as any,
    });
    return {
      id: updated.id,
      schoolId: updated.schoolId,
      name: updated.name,
      code: updated.code,
      numericLevel: updated.numericLevel,
      displayOrder: updated.displayOrder,
      status: updated.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (err) {
    console.error('Failed to update class via Prisma:', err);
    throw err;
  }
}

export async function toggleClassStatus(id: string) {
  try {
    const record = await prisma.class.findUnique({ where: { id } });
    if (!record) throw new Error('Class not found');
    const updated = await prisma.class.update({ where: { id }, data: { status: record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } });
    return updated;
  } catch (err) {
    console.error('Failed to toggle class status via Prisma:', err);
    throw err;
  }
}

export async function deleteClass(id: string) {
  try {
    await prisma.class.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
    return true;
  } catch (err) {
    console.error('Failed to delete class via Prisma:', err);
    throw err;
  }
}

// ==========================================
// 4. SECTIONS
// ==========================================
export interface SectionRecord {
  id: string;
  schoolId?: string;
  classId?: string;
  name: string;
  code: string;
  displayOrder: number;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export async function getSectionsList(params: PaginatedParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();
  const status = params.status;

  try {
    const where: any = { deletedAt: null, ...(params.schoolId ? { schoolId: params.schoolId } : {}) };
    if (search) {
      where.OR = [{ name: { contains: search } }, { code: { contains: search } }];
    }
    if (status) where.status = status;

    const total = await prisma.section.count({ where });
    const records = await prisma.section.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { displayOrder: 'asc' },
    });

    if (records.length > 0) {
      return {
        data: records.map((r) => ({
          id: r.id,
          schoolId: r.schoolId || '',
          classId: r.classId || undefined,
          name: r.name,
          code: r.code,
          displayOrder: r.displayOrder,
          capacity: r.capacity,
          status: r.status as 'ACTIVE' | 'INACTIVE',
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }
  } catch (err) {
    console.error('Error fetching sections:', err);
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  return { data: [], total: 0, page, pageSize, totalPages: 0 };
}

export async function createSection(payload: Omit<SectionRecord, 'id'>) {
  try {
    const created = await prisma.section.create({
      data: {
        schoolId: payload.schoolId,
        name: payload.name,
        code: payload.code,
        displayOrder: payload.displayOrder,
        capacity: payload.capacity,
        status: payload.status as any,
      },
    });
    return {
      id: created.id,
      schoolId: created.schoolId || '',
      name: created.name,
      code: created.code,
      displayOrder: created.displayOrder,
      capacity: created.capacity,
      status: created.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (err) { throw err; }
}

export async function updateSection(id: string, payload: Partial<SectionRecord>) {
  try {
    const updated = await prisma.section.update({
      where: { id },
      data: payload as any,
    });
    return {
      id: updated.id,
      schoolId: updated.schoolId || '',
      name: updated.name,
      code: updated.code,
      displayOrder: updated.displayOrder,
      capacity: updated.capacity,
      status: updated.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (err) { throw err; }
}

export async function toggleSectionStatus(id: string) {
  const existing = await prisma.section.findUnique({ where: { id } });
  if (!existing) throw new Error('Section not found');
  return prisma.section.update({ where: { id }, data: { status: existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } });
}

export async function deleteSection(id: string) {
  await prisma.section.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
  return true;
}

// ==========================================
// 5. GROUPS
// ==========================================
export interface GroupRecord {
  id: string;
  schoolId: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export async function getGroupsList(params: PaginatedParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();
  const status = params.status;

  try {
    const where: any = { deletedAt: null, ...(params.schoolId ? { schoolId: params.schoolId } : {}) };
    if (search) where.name = { contains: search };
    if (status) where.status = status;

    const total = await prisma.group.count({ where });
    const records = await prisma.group.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: 'asc' },
    });

    if (records.length > 0) {
      return {
        data: records.map((r) => ({
          id: r.id,
          schoolId: r.schoolId,
          name: r.name,
          description: r.description || undefined,
          status: r.status as 'ACTIVE' | 'INACTIVE',
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }
  } catch (err) {
    console.error('Error fetching groups:', err);
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  return { data: [], total: 0, page, pageSize, totalPages: 0 };
}

export async function createGroup(payload: Omit<GroupRecord, 'id'>) {
  try {
    const created = await prisma.group.create({
      data: {
        schoolId: payload.schoolId,
        name: payload.name,
        description: payload.description,
        status: payload.status as any,
      },
    });
    return {
      id: created.id,
      schoolId: created.schoolId,
      name: created.name,
      description: created.description || undefined,
      status: created.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (err) { throw err; }
}

export async function updateGroup(id: string, payload: Partial<GroupRecord>) {
  try {
    const updated = await prisma.group.update({
      where: { id },
      data: payload as any,
    });
    return {
      id: updated.id,
      schoolId: updated.schoolId,
      name: updated.name,
      description: updated.description || undefined,
      status: updated.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (err) { throw err; }
}

export async function toggleGroupStatus(id: string) {
  const existing = await prisma.group.findUnique({ where: { id } });
  if (!existing) throw new Error('Group not found');
  return prisma.group.update({ where: { id }, data: { status: existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } });
}

export async function deleteGroup(id: string) {
  await prisma.group.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
  return true;
}

// ==========================================
// 6. SUBJECTS
// ==========================================
export interface SubjectRecord {
  id: string;
  schoolId: string;
  nameEn: string;
  nameBn?: string;
  code: string;
  subjectType: 'compulsory' | 'optional' | 'additional' | 'practical';
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export async function getSubjectsList(params: PaginatedParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();
  const status = params.status;

  try {
    const where: any = { deletedAt: null, ...(params.schoolId ? { schoolId: params.schoolId } : {}) };
    if (search) {
      where.OR = [
        { nameEn: { contains: search } },
        { nameBn: { contains: search } },
        { code: { contains: search } },
      ];
    }
    if (status) where.status = status;
    if (params.subjectType) where.subjectType = params.subjectType;

    const total = await prisma.subject.count({ where });
    const records = await prisma.subject.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { code: 'asc' },
    });

    if (records.length > 0) {
      return {
        data: records.map((r) => ({
          id: r.id,
          schoolId: r.schoolId,
          nameEn: r.nameEn,
          nameBn: r.nameBn || undefined,
          code: r.code,
          subjectType: r.subjectType as any,
          description: r.description || undefined,
          status: r.status as 'ACTIVE' | 'INACTIVE',
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }
  } catch (err) {
    console.error('Error fetching subjects:', err);
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  return { data: [], total: 0, page, pageSize, totalPages: 0 };
}

export async function createSubject(payload: Omit<SubjectRecord, 'id'>) {
  try {
    const normalizedCode = payload.code.trim().toUpperCase();
    const duplicate = await prisma.subject.findFirst({
      where: { schoolId: payload.schoolId, code: normalizedCode, deletedAt: null },
      select: { id: true },
    });
    if (duplicate) throw new Error(`Subject code "${normalizedCode}" already exists.`);
    const created = await prisma.subject.create({
      data: {
        schoolId: payload.schoolId,
        nameEn: payload.nameEn,
        nameBn: payload.nameBn,
        code: normalizedCode,
        subjectType: payload.subjectType,
        description: payload.description,
        status: payload.status as any,
      },
    });
    return {
      id: created.id,
      schoolId: created.schoolId,
      nameEn: created.nameEn,
      nameBn: created.nameBn || undefined,
      code: created.code,
      subjectType: created.subjectType as any,
      description: created.description || undefined,
      status: created.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (err) { throw err; }
}

export async function updateSubject(id: string, payload: Partial<SubjectRecord>) {
  try {
    const updated = await prisma.subject.update({
      where: { id },
      data: payload as any,
    });
    return {
      id: updated.id,
      schoolId: updated.schoolId,
      nameEn: updated.nameEn,
      nameBn: updated.nameBn || undefined,
      code: updated.code,
      subjectType: updated.subjectType as any,
      description: updated.description || undefined,
      status: updated.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (err) { throw err; }
}

export async function toggleSubjectStatus(id: string) {
  const existing = await prisma.subject.findUnique({ where: { id } });
  if (!existing) throw new Error('Subject not found');
  return prisma.subject.update({ where: { id }, data: { status: existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } });
}

export async function deleteSubject(id: string) {
  await prisma.subject.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
  return true;
}

// ==========================================
// 7. CLASS-SECTION ASSIGNMENTS
// ==========================================
export interface ClassSectionRecord {
  id: string;
  schoolId: string;
  academicYearId: string;
  academicYearName?: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export async function getClassSectionsList(params: PaginatedParams & { academicYearId?: string; classId?: string }) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const where: any = {
    deletedAt: null,
    ...(params.schoolId ? { schoolId: params.schoolId } : {}),
    ...(params.academicYearId ? { academicYearId: params.academicYearId } : {}),
    ...(params.classId ? { classId: params.classId } : {}),
    ...(params.status ? { status: params.status } : {}),
  };
  if (params.search) where.OR = [
    { class: { name: { contains: params.search } } },
    { section: { name: { contains: params.search } } },
  ];
  const [total, rows] = await prisma.$transaction([
    prisma.classSection.count({ where }),
    prisma.classSection.findMany({ where, include: { academicYear: true, class: true, section: true }, skip: (page - 1) * pageSize, take: pageSize, orderBy: [{ class: { displayOrder: 'asc' } }, { section: { displayOrder: 'asc' } }] }),
  ]);
  const data: ClassSectionRecord[] = rows.map((row) => ({ id: row.id, schoolId: row.schoolId, academicYearId: row.academicYearId, academicYearName: row.academicYear.name, classId: row.classId, className: row.class.name, sectionId: row.sectionId, sectionName: row.section.name, capacity: row.capacity, status: row.status as ClassSectionRecord['status'] }));
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function createClassSection(payload: Omit<ClassSectionRecord, 'id'>) {
  return prisma.classSection.create({ data: { schoolId: payload.schoolId, academicYearId: payload.academicYearId, classId: payload.classId, sectionId: payload.sectionId, capacity: payload.capacity, status: payload.status as any } });
}

export async function updateClassSection(id: string, payload: Partial<ClassSectionRecord>) {
  return prisma.classSection.update({ where: { id }, data: { ...(payload.academicYearId && { academicYearId: payload.academicYearId }), ...(payload.classId && { classId: payload.classId }), ...(payload.sectionId && { sectionId: payload.sectionId }), ...(payload.capacity !== undefined && { capacity: payload.capacity }), ...(payload.status && { status: payload.status as any }) } });
}

export async function toggleClassSectionStatus(id: string) {
  const existing = await prisma.classSection.findUnique({ where: { id } });
  if (!existing) throw new Error('Assignment not found');
  return prisma.classSection.update({ where: { id }, data: { status: existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } });
}

export async function deleteClassSection(id: string) {
  await prisma.classSection.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
  return true;
}

// ==========================================
// 8. CLASS-GROUP ASSIGNMENTS
// ==========================================
export interface ClassGroupRecord {
  id: string;
  schoolId: string;
  academicYearId: string;
  academicYearName?: string;
  classId: string;
  className?: string;
  groupId: string;
  groupName?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export async function getClassGroupsList(params: PaginatedParams & { academicYearId?: string; classId?: string }) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const where: any = { deletedAt: null, ...(params.schoolId ? { schoolId: params.schoolId } : {}), ...(params.academicYearId ? { academicYearId: params.academicYearId } : {}), ...(params.classId ? { classId: params.classId } : {}), ...(params.status ? { status: params.status } : {}) };
  if (params.search) where.OR = [{ class: { name: { contains: params.search } } }, { group: { name: { contains: params.search } } }];
  const [total, rows] = await prisma.$transaction([prisma.classGroup.count({ where }), prisma.classGroup.findMany({ where, include: { academicYear: true, class: true, group: true }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } })]);
  const data: ClassGroupRecord[] = rows.map((row) => ({ id: row.id, schoolId: row.schoolId, academicYearId: row.academicYearId, academicYearName: row.academicYear.name, classId: row.classId, className: row.class.name, groupId: row.groupId, groupName: row.group.name, status: row.status as ClassGroupRecord['status'] }));
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function createClassGroup(payload: Omit<ClassGroupRecord, 'id'>) {
  return prisma.classGroup.create({ data: { schoolId: payload.schoolId, academicYearId: payload.academicYearId, classId: payload.classId, groupId: payload.groupId, status: payload.status as any } });
}

export async function updateClassGroup(id: string, payload: Partial<ClassGroupRecord>) {
  return prisma.classGroup.update({ where: { id }, data: { ...(payload.academicYearId && { academicYearId: payload.academicYearId }), ...(payload.classId && { classId: payload.classId }), ...(payload.groupId && { groupId: payload.groupId }), ...(payload.status && { status: payload.status as any }) } });
}

export async function toggleClassGroupStatus(id: string) {
  const existing = await prisma.classGroup.findUnique({ where: { id } });
  if (!existing) throw new Error('Assignment not found');
  return prisma.classGroup.update({ where: { id }, data: { status: existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } });
}

export async function deleteClassGroup(id: string) {
  await prisma.classGroup.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
  return true;
}

// ==========================================
// 9. CLASS-SUBJECT ASSIGNMENTS
// ==========================================
export interface ClassSubjectRecord {
  id: string;
  schoolId: string;
  academicYearId?: string;
  academicYearName?: string;
  classId: string;
  className?: string;
  groupId?: string;
  groupName?: string;
  subjectId: string;
  subjectName?: string;
  subjectType: 'compulsory' | 'optional' | 'additional' | 'practical';
  fullMarks: number;
  passMarks: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export async function getClassSubjectsList(params: PaginatedParams & { classId?: string; subjectId?: string }) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const where: any = { deletedAt: null, ...(params.schoolId ? { schoolId: params.schoolId } : {}), ...(params.classId ? { classId: params.classId } : {}), ...(params.subjectId ? { subjectId: params.subjectId } : {}), ...(params.status ? { status: params.status } : {}) };
  if (params.search) where.OR = [{ class: { name: { contains: params.search } } }, { subject: { nameEn: { contains: params.search } } }];
  const [total, rows] = await prisma.$transaction([prisma.classSubject.count({ where }), prisma.classSubject.findMany({ where, include: { academicYear: true, class: true, group: true, subject: true }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } })]);
  const data: ClassSubjectRecord[] = rows.map((row) => ({ id: row.id, schoolId: row.schoolId, academicYearId: row.academicYearId || undefined, academicYearName: row.academicYear?.name, classId: row.classId, className: row.class.name, groupId: row.groupId || undefined, groupName: row.group?.name, subjectId: row.subjectId, subjectName: row.subject.nameEn, subjectType: row.subjectType as ClassSubjectRecord['subjectType'], fullMarks: row.fullMarks, passMarks: row.passMarks, status: row.status as ClassSubjectRecord['status'] }));
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function createClassSubject(payload: Omit<ClassSubjectRecord, 'id'>) {
  return prisma.classSubject.create({ data: { schoolId: payload.schoolId, academicYearId: payload.academicYearId || null, classId: payload.classId, groupId: payload.groupId || null, subjectId: payload.subjectId, subjectType: payload.subjectType, fullMarks: payload.fullMarks, passMarks: payload.passMarks, status: payload.status as any } });
}

export async function updateClassSubject(id: string, payload: Partial<ClassSubjectRecord>) {
  return prisma.classSubject.update({ where: { id }, data: { ...(payload.academicYearId !== undefined && { academicYearId: payload.academicYearId || null }), ...(payload.classId && { classId: payload.classId }), ...(payload.groupId !== undefined && { groupId: payload.groupId || null }), ...(payload.subjectId && { subjectId: payload.subjectId }), ...(payload.subjectType && { subjectType: payload.subjectType }), ...(payload.fullMarks !== undefined && { fullMarks: payload.fullMarks }), ...(payload.passMarks !== undefined && { passMarks: payload.passMarks }), ...(payload.status && { status: payload.status as any }) } });
}

export async function toggleClassSubjectStatus(id: string) {
  const existing = await prisma.classSubject.findUnique({ where: { id } });
  if (!existing) throw new Error('Assignment not found');
  return prisma.classSubject.update({ where: { id }, data: { status: existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } });
}

export async function deleteClassSubject(id: string) {
  await prisma.classSubject.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
  return true;
}

// ==========================================
// 10. ROOMS
// ==========================================
export interface RoomRecord {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  capacity: number;
  roomType?: string;
  location?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export async function getRoomsList(params: PaginatedParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const where: any = { deletedAt: null, ...(params.schoolId ? { schoolId: params.schoolId } : {}), ...(params.status ? { status: params.status } : {}) };
  if (params.search) where.OR = [{ name: { contains: params.search } }, { code: { contains: params.search } }, { location: { contains: params.search } }];
  const [total, rows] = await prisma.$transaction([prisma.room.count({ where }), prisma.room.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { name: 'asc' } })]);
  const data: RoomRecord[] = rows.map((row) => ({ id: row.id, schoolId: row.schoolId, name: row.name, code: row.code, capacity: row.capacity, location: row.location || undefined, status: row.status as RoomRecord['status'] }));
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function createRoom(payload: Omit<RoomRecord, 'id'>) {
  return prisma.room.create({ data: { schoolId: payload.schoolId, name: payload.name, code: payload.code, capacity: payload.capacity, location: payload.location, status: payload.status as any } });
}

export async function updateRoom(id: string, payload: Partial<RoomRecord>) {
  return prisma.room.update({ where: { id }, data: { name: payload.name, code: payload.code, capacity: payload.capacity, location: payload.location, status: payload.status as any } });
}

export async function toggleRoomStatus(id: string) {
  const existing = await prisma.room.findUnique({ where: { id } });
  if (!existing) throw new Error('Room not found');
  return prisma.room.update({ where: { id }, data: { status: existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } });
}

export async function deleteRoom(id: string) {
  await prisma.room.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
  return true;
}

// ==========================================
// 11. PERIODS
// ==========================================
export interface PeriodRecord {
  id: string;
  schoolId: string;
  name: string;
  startTime: string;
  endTime: string;
  displayOrder: number;
  isBreak: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export async function getPeriodsList(params: PaginatedParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const where: any = { deletedAt: null, ...(params.schoolId ? { schoolId: params.schoolId } : {}), ...(params.status ? { status: params.status } : {}), ...(params.search ? { name: { contains: params.search } } : {}) };
  const [total, rows] = await prisma.$transaction([prisma.period.count({ where }), prisma.period.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { displayOrder: 'asc' } })]);
  const data: PeriodRecord[] = rows.map((row) => ({ id: row.id, schoolId: row.schoolId, name: row.name, startTime: row.startTime, endTime: row.endTime, displayOrder: row.displayOrder, isBreak: row.isBreak, status: row.status as PeriodRecord['status'] }));
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function createPeriod(payload: Omit<PeriodRecord, 'id'>) {
  return prisma.period.create({ data: { schoolId: payload.schoolId, name: payload.name, startTime: payload.startTime, endTime: payload.endTime, displayOrder: payload.displayOrder, isBreak: payload.isBreak, status: payload.status as any } });
}

export async function updatePeriod(id: string, payload: Partial<PeriodRecord>) {
  return prisma.period.update({ where: { id }, data: { name: payload.name, startTime: payload.startTime, endTime: payload.endTime, displayOrder: payload.displayOrder, isBreak: payload.isBreak, status: payload.status as any } });
}

export async function togglePeriodStatus(id: string) {
  const existing = await prisma.period.findUnique({ where: { id } });
  if (!existing) throw new Error('Period not found');
  return prisma.period.update({ where: { id }, data: { status: existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } });
}

export async function deletePeriod(id: string) {
  await prisma.period.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
  return true;
}

// ==========================================
// 12. HOLIDAYS
// ==========================================
export interface HolidayRecord {
  id: string;
  schoolId: string;
  academicYearId?: string;
  academicYearName?: string;
  name: string;
  startDate: string;
  endDate: string;
  type?: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export async function getHolidaysList(params: PaginatedParams & { academicYearId?: string }) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const where: any = { deletedAt: null, ...(params.schoolId ? { schoolId: params.schoolId } : {}), ...(params.academicYearId ? { academicYearId: params.academicYearId } : {}), ...(params.status ? { status: params.status } : {}) };
  if (params.search) where.OR = [{ name: { contains: params.search } }, { description: { contains: params.search } }];
  const [total, rows] = await prisma.$transaction([prisma.holiday.count({ where }), prisma.holiday.findMany({ where, include: { academicYear: true }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { startDate: 'desc' } })]);
  const data: HolidayRecord[] = rows.map((row) => ({ id: row.id, schoolId: row.schoolId, academicYearId: row.academicYearId || undefined, academicYearName: row.academicYear?.name, name: row.name, startDate: row.startDate.toISOString().slice(0, 10), endDate: row.endDate.toISOString().slice(0, 10), description: row.description || undefined, status: row.status as HolidayRecord['status'] }));
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function createHoliday(payload: Omit<HolidayRecord, 'id'>) {
  return prisma.holiday.create({ data: { schoolId: payload.schoolId, academicYearId: payload.academicYearId || null, name: payload.name, startDate: new Date(payload.startDate), endDate: new Date(payload.endDate), description: payload.description, status: payload.status as any } });
}

export async function updateHoliday(id: string, payload: Partial<HolidayRecord>) {
  return prisma.holiday.update({ where: { id }, data: { academicYearId: payload.academicYearId, name: payload.name, startDate: payload.startDate ? new Date(payload.startDate) : undefined, endDate: payload.endDate ? new Date(payload.endDate) : undefined, description: payload.description, status: payload.status as any } });
}

export async function toggleHolidayStatus(id: string) {
  const existing = await prisma.holiday.findUnique({ where: { id } });
  if (!existing) throw new Error('Holiday not found');
  return prisma.holiday.update({ where: { id }, data: { status: existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } });
}

export async function deleteHoliday(id: string) {
  await prisma.holiday.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
  return true;
}

// End of academic-management.service
