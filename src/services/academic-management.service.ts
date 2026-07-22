"use server";
import prisma from '@/src/lib/db/prisma';
import { validateSingleCurrentYear } from '@/src/lib/validations/academic';

export interface PaginatedParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  schoolId?: string;
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

let academicYearsStore: AcademicYearRecord[] = [
  {
    id: 'ay-2026',
    schoolId: 'school-1',
    name: 'Academic Year 2026',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isCurrent: true,
    status: 'ACTIVE',
  },
  {
    id: 'ay-2025',
    schoolId: 'school-1',
    name: 'Academic Year 2025',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    isCurrent: false,
    status: 'ACTIVE',
  },
  {
    id: 'ay-2027',
    schoolId: 'school-1',
    name: 'Academic Year 2027 (Upcoming)',
    startDate: '2027-01-01',
    endDate: '2027-12-31',
    isCurrent: false,
    status: 'INACTIVE',
  },
];

export async function getAcademicYears(params: PaginatedParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();
  const status = params.status;

  try {
    const where: any = { deletedAt: null };
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
  } catch {
    // Fallback store
  }

  let filtered = academicYearsStore.filter((r) => {
    if (search && !r.name.toLowerCase().includes(search)) return false;
    if (status && r.status !== status) return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
}

export async function createAcademicYear(payload: Omit<AcademicYearRecord, 'id'>) {
  if (payload.isCurrent) {
    academicYearsStore = academicYearsStore.map((y) => ({ ...y, isCurrent: false }));
  }

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
  } catch {
    const newRecord: AcademicYearRecord = {
      id: `ay-${Date.now()}`,
      ...payload,
    };
    academicYearsStore.unshift(newRecord);
    return newRecord;
  }
}

export async function updateAcademicYear(id: string, payload: Partial<AcademicYearRecord>) {
  if (payload.isCurrent) {
    academicYearsStore = academicYearsStore.map((y) => ({
      ...y,
      isCurrent: y.id === id ? true : false,
    }));
  }

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
  } catch {
    const idx = academicYearsStore.findIndex((y) => y.id === id);
    if (idx !== -1) {
      academicYearsStore[idx] = { ...academicYearsStore[idx], ...payload };
      return academicYearsStore[idx];
    }
    throw new Error('Academic year not found');
  }
}

export async function toggleAcademicYearStatus(id: string) {
  const existing = academicYearsStore.find((y) => y.id === id);
  const nextStatus = existing?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

  try {
    const record = await prisma.academicYear.findUnique({ where: { id } });
    if (record) {
      const updated = await prisma.academicYear.update({
        where: { id },
        data: { status: record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' },
      });
      return updated;
    }
  } catch {
    // fallback
  }

  if (existing) {
    existing.status = nextStatus;
    return existing;
  }
  throw new Error('Academic year not found');
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
    academicYearsStore = academicYearsStore.filter((y) => y.id !== id);
    return true;
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

let academicSessionsStore: AcademicSessionRecord[] = [
  {
    id: 'as-1',
    schoolId: 'school-1',
    academicYearId: 'ay-2026',
    academicYearName: 'Academic Year 2026',
    name: 'First Term (Jan - Apr 2026)',
    startDate: '2026-01-01',
    endDate: '2026-04-30',
    status: 'ACTIVE',
  },
  {
    id: 'as-2',
    schoolId: 'school-1',
    academicYearId: 'ay-2026',
    academicYearName: 'Academic Year 2026',
    name: 'Mid-Term (May - Aug 2026)',
    startDate: '2026-05-01',
    endDate: '2026-08-31',
    status: 'ACTIVE',
  },
  {
    id: 'as-3',
    schoolId: 'school-1',
    academicYearId: 'ay-2026',
    academicYearName: 'Academic Year 2026',
    name: 'Final Term (Sep - Dec 2026)',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    status: 'ACTIVE',
  },
];

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
  } catch {
    // fallback
  }

  let filtered = academicSessionsStore.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search)) return false;
    if (status && s.status !== status) return false;
    if (yearId && s.academicYearId !== yearId) return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
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
  } catch {
    const year = academicYearsStore.find((y) => y.id === payload.academicYearId);
    const newRecord: AcademicSessionRecord = {
      id: `as-${Date.now()}`,
      ...payload,
      academicYearName: year?.name || 'Academic Year 2026',
    };
    academicSessionsStore.unshift(newRecord);
    return newRecord;
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
  } catch {
    const idx = academicSessionsStore.findIndex((s) => s.id === id);
    if (idx !== -1) {
      academicSessionsStore[idx] = { ...academicSessionsStore[idx], ...payload };
      return academicSessionsStore[idx];
    }
    throw new Error('Session not found');
  }
}

export async function toggleAcademicSessionStatus(id: string) {
  const existing = academicSessionsStore.find((s) => s.id === id);
  if (existing) {
    existing.status = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return existing;
  }
  throw new Error('Session not found');
}

export async function deleteAcademicSession(id: string) {
  academicSessionsStore = academicSessionsStore.filter((s) => s.id !== id);
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

let classesStore: ClassRecord[] = [
  { id: 'c-6', schoolId: 'school-1', name: 'Class 6', code: 'CLASS-06', numericLevel: 6, displayOrder: 1, status: 'ACTIVE' },
  { id: 'c-7', schoolId: 'school-1', name: 'Class 7', code: 'CLASS-07', numericLevel: 7, displayOrder: 2, status: 'ACTIVE' },
  { id: 'c-8', schoolId: 'school-1', name: 'Class 8', code: 'CLASS-08', numericLevel: 8, displayOrder: 3, status: 'ACTIVE' },
  { id: 'c-9', schoolId: 'school-1', name: 'Class 9', code: 'CLASS-09', numericLevel: 9, displayOrder: 4, status: 'ACTIVE' },
  { id: 'c-10', schoolId: 'school-1', name: 'Class 10 (S.S.C Candidate)', code: 'CLASS-10', numericLevel: 10, displayOrder: 5, status: 'ACTIVE' },
];

export async function getClassesList(params: PaginatedParams) {
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
  } catch {
    // fallback
  }

  let filtered = classesStore.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search) && !c.code.toLowerCase().includes(search)) return false;
    if (status && c.status !== status) return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
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
  } catch {
    const newRecord: ClassRecord = { id: `c-${Date.now()}`, ...payload };
    classesStore.push(newRecord);
    return newRecord;
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
  } catch {
    const idx = classesStore.findIndex((c) => c.id === id);
    if (idx !== -1) {
      classesStore[idx] = { ...classesStore[idx], ...payload };
      return classesStore[idx];
    }
    throw new Error('Class not found');
  }
}

export async function toggleClassStatus(id: string) {
  const existing = classesStore.find((c) => c.id === id);
  if (existing) {
    existing.status = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return existing;
  }
  throw new Error('Class not found');
}

export async function deleteClass(id: string) {
  classesStore = classesStore.filter((c) => c.id !== id);
  return true;
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

let sectionsStore: SectionRecord[] = [
  { id: 's-padma', schoolId: 'school-1', name: 'Padma', code: 'SEC-PADMA', displayOrder: 1, capacity: 40, status: 'ACTIVE' },
  { id: 's-meghna', schoolId: 'school-1', name: 'Meghna', code: 'SEC-MEGHNA', displayOrder: 2, capacity: 40, status: 'ACTIVE' },
  { id: 's-jamuna', schoolId: 'school-1', name: 'Jamuna', code: 'SEC-JAMUNA', displayOrder: 3, capacity: 45, status: 'ACTIVE' },
  { id: 's-karnafuli', schoolId: 'school-1', name: 'Karnafuli', code: 'SEC-KARNAFULI', displayOrder: 4, capacity: 45, status: 'ACTIVE' },
];

export async function getSectionsList(params: PaginatedParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();
  const status = params.status;

  try {
    const where: any = { deletedAt: null };
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
          schoolId: r.schoolId || 'school-1',
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
  } catch {
    // fallback
  }

  let filtered = sectionsStore.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search) && !s.code.toLowerCase().includes(search)) return false;
    if (status && s.status !== status) return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
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
      schoolId: created.schoolId || 'school-1',
      name: created.name,
      code: created.code,
      displayOrder: created.displayOrder,
      capacity: created.capacity,
      status: created.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch {
    const newRecord: SectionRecord = { id: `s-${Date.now()}`, ...payload };
    sectionsStore.push(newRecord);
    return newRecord;
  }
}

export async function updateSection(id: string, payload: Partial<SectionRecord>) {
  try {
    const updated = await prisma.section.update({
      where: { id },
      data: payload as any,
    });
    return {
      id: updated.id,
      schoolId: updated.schoolId || 'school-1',
      name: updated.name,
      code: updated.code,
      displayOrder: updated.displayOrder,
      capacity: updated.capacity,
      status: updated.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch {
    const idx = sectionsStore.findIndex((s) => s.id === id);
    if (idx !== -1) {
      sectionsStore[idx] = { ...sectionsStore[idx], ...payload };
      return sectionsStore[idx];
    }
    throw new Error('Section not found');
  }
}

export async function toggleSectionStatus(id: string) {
  const existing = sectionsStore.find((s) => s.id === id);
  if (existing) {
    existing.status = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return existing;
  }
  throw new Error('Section not found');
}

export async function deleteSection(id: string) {
  sectionsStore = sectionsStore.filter((s) => s.id !== id);
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

let groupsStore: GroupRecord[] = [
  { id: 'g-sci', schoolId: 'school-1', name: 'Science', description: 'Physics, Chemistry, Higher Math, Biology stream', status: 'ACTIVE' },
  { id: 'g-com', schoolId: 'school-1', name: 'Commerce (Business Studies)', description: 'Accounting, Finance, Business Ent. stream', status: 'ACTIVE' },
  { id: 'g-hum', schoolId: 'school-1', name: 'Humanities (Arts)', description: 'Civics, History, Geography, Economics stream', status: 'ACTIVE' },
  { id: 'g-gen', schoolId: 'school-1', name: 'General Academic', description: 'Core middle school group for Classes 6-8', status: 'ACTIVE' },
];

export async function getGroupsList(params: PaginatedParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();
  const status = params.status;

  try {
    const where: any = { deletedAt: null };
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
  } catch {
    // fallback
  }

  let filtered = groupsStore.filter((g) => {
    if (search && !g.name.toLowerCase().includes(search)) return false;
    if (status && g.status !== status) return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
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
  } catch {
    const newRecord: GroupRecord = { id: `g-${Date.now()}`, ...payload };
    groupsStore.push(newRecord);
    return newRecord;
  }
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
  } catch {
    const idx = groupsStore.findIndex((g) => g.id === id);
    if (idx !== -1) {
      groupsStore[idx] = { ...groupsStore[idx], ...payload };
      return groupsStore[idx];
    }
    throw new Error('Group not found');
  }
}

export async function toggleGroupStatus(id: string) {
  const existing = groupsStore.find((g) => g.id === id);
  if (existing) {
    existing.status = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return existing;
  }
  throw new Error('Group not found');
}

export async function deleteGroup(id: string) {
  groupsStore = groupsStore.filter((g) => g.id !== id);
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

let subjectsStore: SubjectRecord[] = [
  { id: 'sub-1', schoolId: 'school-1', nameEn: 'Bangla 1st Paper', nameBn: 'বাংলা প্রথম পত্র', code: 'BAN-101', subjectType: 'compulsory', description: 'National Curriculum Bangla Literature', status: 'ACTIVE' },
  { id: 'sub-2', schoolId: 'school-1', nameEn: 'English 1st Paper', nameBn: 'ইংরেজি প্রথম পত্র', code: 'ENG-101', subjectType: 'compulsory', description: 'English Language and Grammar', status: 'ACTIVE' },
  { id: 'sub-3', schoolId: 'school-1', nameEn: 'General Mathematics', nameBn: 'সাধারণ গণিত', code: 'MATH-101', subjectType: 'compulsory', description: 'Core Mathematics & Geometry', status: 'ACTIVE' },
  { id: 'sub-4', schoolId: 'school-1', nameEn: 'Higher Mathematics', nameBn: 'উচ্চতর গণিত', code: 'HMATH-201', subjectType: 'optional', description: 'Advanced Algebra and Calculus', status: 'ACTIVE' },
  { id: 'sub-5', schoolId: 'school-1', nameEn: 'Physics', nameBn: 'পদার্থবিজ্ঞান', code: 'PHY-301', subjectType: 'practical', description: 'Physics Theory & Practical Lab', status: 'ACTIVE' },
  { id: 'sub-6', schoolId: 'school-1', nameEn: 'Chemistry', nameBn: 'রসায়ন', code: 'CHE-301', subjectType: 'practical', description: 'Chemistry Theory & Lab', status: 'ACTIVE' },
  { id: 'sub-7', schoolId: 'school-1', nameEn: 'ICT', nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', code: 'ICT-101', subjectType: 'compulsory', description: 'Computer Science Basics', status: 'ACTIVE' },
];

export async function getSubjectsList(params: PaginatedParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();
  const status = params.status;

  try {
    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { nameEn: { contains: search } },
        { nameBn: { contains: search } },
        { code: { contains: search } },
      ];
    }
    if (status) where.status = status;

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
  } catch {
    // fallback
  }

  let filtered = subjectsStore.filter((sub) => {
    if (
      search &&
      !sub.nameEn.toLowerCase().includes(search) &&
      !sub.code.toLowerCase().includes(search) &&
      !(sub.nameBn && sub.nameBn.includes(search))
    )
      return false;
    if (status && sub.status !== status) return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function createSubject(payload: Omit<SubjectRecord, 'id'>) {
  try {
    const created = await prisma.subject.create({
      data: {
        schoolId: payload.schoolId,
        nameEn: payload.nameEn,
        nameBn: payload.nameBn,
        code: payload.code,
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
  } catch {
    const newRecord: SubjectRecord = { id: `sub-${Date.now()}`, ...payload };
    subjectsStore.push(newRecord);
    return newRecord;
  }
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
  } catch {
    const idx = subjectsStore.findIndex((s) => s.id === id);
    if (idx !== -1) {
      subjectsStore[idx] = { ...subjectsStore[idx], ...payload };
      return subjectsStore[idx];
    }
    throw new Error('Subject not found');
  }
}

export async function toggleSubjectStatus(id: string) {
  const existing = subjectsStore.find((s) => s.id === id);
  if (existing) {
    existing.status = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return existing;
  }
  throw new Error('Subject not found');
}

export async function deleteSubject(id: string) {
  subjectsStore = subjectsStore.filter((s) => s.id !== id);
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

let classSectionsStore: ClassSectionRecord[] = [
  { id: 'cs-1', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', classId: 'c-6', className: 'Class 6', sectionId: 's-padma', sectionName: 'Padma', capacity: 40, status: 'ACTIVE' },
  { id: 'cs-2', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', classId: 'c-6', className: 'Class 6', sectionId: 's-meghna', sectionName: 'Meghna', capacity: 40, status: 'ACTIVE' },
  { id: 'cs-3', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', classId: 'c-9', className: 'Class 9', sectionId: 's-jamuna', sectionName: 'Jamuna', capacity: 45, status: 'ACTIVE' },
  { id: 'cs-4', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', classId: 'c-10', className: 'Class 10 (S.S.C Candidate)', sectionId: 's-karnafuli', sectionName: 'Karnafuli', capacity: 45, status: 'ACTIVE' },
];

export async function getClassSectionsList(params: PaginatedParams & { academicYearId?: string; classId?: string }) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();

  let filtered = classSectionsStore.filter((cs) => {
    if (params.academicYearId && cs.academicYearId !== params.academicYearId) return false;
    if (params.classId && cs.classId !== params.classId) return false;
    if (params.status && cs.status !== params.status) return false;
    if (
      search &&
      !cs.className?.toLowerCase().includes(search) &&
      !cs.sectionName?.toLowerCase().includes(search)
    )
      return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function createClassSection(payload: Omit<ClassSectionRecord, 'id'>) {
  // Prevent duplicate class-section assignment
  const isDuplicate = classSectionsStore.some(
    (cs) =>
      cs.academicYearId === payload.academicYearId &&
      cs.classId === payload.classId &&
      cs.sectionId === payload.sectionId
  );
  if (isDuplicate) {
    throw new Error('Duplicate assignment: This section is already assigned to this class for the selected academic year.');
  }

  const year = academicYearsStore.find((y) => y.id === payload.academicYearId);
  const cls = classesStore.find((c) => c.id === payload.classId);
  const sec = sectionsStore.find((s) => s.id === payload.sectionId);

  const newRecord: ClassSectionRecord = {
    id: `cs-${Date.now()}`,
    ...payload,
    academicYearName: year?.name || 'Academic Year 2026',
    className: cls?.name || 'Class',
    sectionName: sec?.name || 'Section',
  };
  classSectionsStore.unshift(newRecord);
  return newRecord;
}

export async function updateClassSection(id: string, payload: Partial<ClassSectionRecord>) {
  const idx = classSectionsStore.findIndex((cs) => cs.id === id);
  if (idx !== -1) {
    classSectionsStore[idx] = { ...classSectionsStore[idx], ...payload };
    return classSectionsStore[idx];
  }
  throw new Error('Class section assignment not found');
}

export async function toggleClassSectionStatus(id: string) {
  const existing = classSectionsStore.find((cs) => cs.id === id);
  if (existing) {
    existing.status = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return existing;
  }
  throw new Error('Assignment not found');
}

export async function deleteClassSection(id: string) {
  classSectionsStore = classSectionsStore.filter((cs) => cs.id !== id);
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

let classGroupsStore: ClassGroupRecord[] = [
  { id: 'cg-1', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', classId: 'c-9', className: 'Class 9', groupId: 'g-sci', groupName: 'Science', status: 'ACTIVE' },
  { id: 'cg-2', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', classId: 'c-9', className: 'Class 9', groupId: 'g-com', groupName: 'Commerce (Business Studies)', status: 'ACTIVE' },
  { id: 'cg-3', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', classId: 'c-10', className: 'Class 10 (S.S.C Candidate)', groupId: 'g-sci', groupName: 'Science', status: 'ACTIVE' },
  { id: 'cg-4', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', classId: 'c-10', className: 'Class 10 (S.S.C Candidate)', groupId: 'g-hum', groupName: 'Humanities (Arts)', status: 'ACTIVE' },
];

export async function getClassGroupsList(params: PaginatedParams & { academicYearId?: string; classId?: string }) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();

  let filtered = classGroupsStore.filter((cg) => {
    if (params.academicYearId && cg.academicYearId !== params.academicYearId) return false;
    if (params.classId && cg.classId !== params.classId) return false;
    if (params.status && cg.status !== params.status) return false;
    if (
      search &&
      !cg.className?.toLowerCase().includes(search) &&
      !cg.groupName?.toLowerCase().includes(search)
    )
      return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function createClassGroup(payload: Omit<ClassGroupRecord, 'id'>) {
  const year = academicYearsStore.find((y) => y.id === payload.academicYearId);
  const cls = classesStore.find((c) => c.id === payload.classId);
  const grp = groupsStore.find((g) => g.id === payload.groupId);

  const newRecord: ClassGroupRecord = {
    id: `cg-${Date.now()}`,
    ...payload,
    academicYearName: year?.name || 'Academic Year 2026',
    className: cls?.name || 'Class',
    groupName: grp?.name || 'Group',
  };
  classGroupsStore.unshift(newRecord);
  return newRecord;
}

export async function updateClassGroup(id: string, payload: Partial<ClassGroupRecord>) {
  const idx = classGroupsStore.findIndex((cg) => cg.id === id);
  if (idx !== -1) {
    classGroupsStore[idx] = { ...classGroupsStore[idx], ...payload };
    return classGroupsStore[idx];
  }
  throw new Error('Class group assignment not found');
}

export async function toggleClassGroupStatus(id: string) {
  const existing = classGroupsStore.find((cg) => cg.id === id);
  if (existing) {
    existing.status = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return existing;
  }
  throw new Error('Assignment not found');
}

export async function deleteClassGroup(id: string) {
  classGroupsStore = classGroupsStore.filter((cg) => cg.id !== id);
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

let classSubjectsStore: ClassSubjectRecord[] = [
  { id: 'csub-1', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', classId: 'c-6', className: 'Class 6', subjectId: 'sub-1', subjectName: 'Bangla 1st Paper', subjectType: 'compulsory', fullMarks: 100, passMarks: 33, status: 'ACTIVE' },
  { id: 'csub-2', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', classId: 'c-6', className: 'Class 6', subjectId: 'sub-2', subjectName: 'English 1st Paper', subjectType: 'compulsory', fullMarks: 100, passMarks: 33, status: 'ACTIVE' },
  { id: 'csub-3', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', classId: 'c-9', className: 'Class 9', groupId: 'g-sci', groupName: 'Science', subjectId: 'sub-5', subjectName: 'Physics', subjectType: 'practical', fullMarks: 100, passMarks: 33, status: 'ACTIVE' },
  { id: 'csub-4', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', classId: 'c-10', className: 'Class 10', groupId: 'g-sci', groupName: 'Science', subjectId: 'sub-4', subjectName: 'Higher Mathematics', subjectType: 'optional', fullMarks: 100, passMarks: 33, status: 'ACTIVE' },
];

export async function getClassSubjectsList(params: PaginatedParams & { classId?: string; subjectId?: string }) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();

  let filtered = classSubjectsStore.filter((cs) => {
    if (params.classId && cs.classId !== params.classId) return false;
    if (params.subjectId && cs.subjectId !== params.subjectId) return false;
    if (params.status && cs.status !== params.status) return false;
    if (
      search &&
      !cs.className?.toLowerCase().includes(search) &&
      !cs.subjectName?.toLowerCase().includes(search)
    )
      return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function createClassSubject(payload: Omit<ClassSubjectRecord, 'id'>) {
  // Prevent duplicate class-subject assignment
  const isDuplicate = classSubjectsStore.some(
    (cs) =>
      cs.academicYearId === payload.academicYearId &&
      cs.classId === payload.classId &&
      cs.subjectId === payload.subjectId &&
      (cs.groupId || '') === (payload.groupId || '')
  );

  if (isDuplicate) {
    throw new Error('Duplicate assignment: This subject is already assigned to this class and group.');
  }

  const cls = classesStore.find((c) => c.id === payload.classId);
  const sub = subjectsStore.find((s) => s.id === payload.subjectId);
  const grp = groupsStore.find((g) => g.id === payload.groupId);

  const newRecord: ClassSubjectRecord = {
    id: `csub-${Date.now()}`,
    ...payload,
    className: cls?.name || 'Class',
    subjectName: sub?.nameEn || 'Subject',
    groupName: grp?.name,
  };
  classSubjectsStore.unshift(newRecord);
  return newRecord;
}

export async function updateClassSubject(id: string, payload: Partial<ClassSubjectRecord>) {
  const idx = classSubjectsStore.findIndex((cs) => cs.id === id);
  if (idx !== -1) {
    classSubjectsStore[idx] = { ...classSubjectsStore[idx], ...payload };
    return classSubjectsStore[idx];
  }
  throw new Error('Class subject assignment not found');
}

export async function toggleClassSubjectStatus(id: string) {
  const existing = classSubjectsStore.find((cs) => cs.id === id);
  if (existing) {
    existing.status = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return existing;
  }
  throw new Error('Assignment not found');
}

export async function deleteClassSubject(id: string) {
  classSubjectsStore = classSubjectsStore.filter((cs) => cs.id !== id);
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

let roomsStore: RoomRecord[] = [
  { id: 'r-101', schoolId: 'school-1', name: 'Classroom 101', code: 'RM-101', capacity: 45, location: 'Academic Building - 1st Floor', status: 'ACTIVE' },
  { id: 'r-102', schoolId: 'school-1', name: 'Classroom 102', code: 'RM-102', capacity: 45, location: 'Academic Building - 1st Floor', status: 'ACTIVE' },
  { id: 'r-201', schoolId: 'school-1', name: 'Science Laboratory', code: 'LAB-SCI', capacity: 40, location: 'Science Building - 2nd Floor', status: 'ACTIVE' },
  { id: 'r-301', schoolId: 'school-1', name: 'Computer Lab (ICT)', code: 'LAB-ICT', capacity: 35, location: 'Administrative Block - 3rd Floor', status: 'ACTIVE' },
];

export async function getRoomsList(params: PaginatedParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();

  let filtered = roomsStore.filter((r) => {
    if (params.status && r.status !== params.status) return false;
    if (
      search &&
      !r.name.toLowerCase().includes(search) &&
      !r.code.toLowerCase().includes(search) &&
      !(r.location && r.location.toLowerCase().includes(search))
    )
      return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function createRoom(payload: Omit<RoomRecord, 'id'>) {
  const newRecord: RoomRecord = { id: `r-${Date.now()}`, ...payload };
  roomsStore.push(newRecord);
  return newRecord;
}

export async function updateRoom(id: string, payload: Partial<RoomRecord>) {
  const idx = roomsStore.findIndex((r) => r.id === id);
  if (idx !== -1) {
    roomsStore[idx] = { ...roomsStore[idx], ...payload };
    return roomsStore[idx];
  }
  throw new Error('Room not found');
}

export async function toggleRoomStatus(id: string) {
  const existing = roomsStore.find((r) => r.id === id);
  if (existing) {
    existing.status = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return existing;
  }
  throw new Error('Room not found');
}

export async function deleteRoom(id: string) {
  roomsStore = roomsStore.filter((r) => r.id !== id);
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

let periodsStore: PeriodRecord[] = [
  { id: 'p-1', schoolId: 'school-1', name: '1st Period', startTime: '08:30', endTime: '09:15', displayOrder: 1, isBreak: false, status: 'ACTIVE' },
  { id: 'p-2', schoolId: 'school-1', name: '2nd Period', startTime: '09:15', endTime: '10:00', displayOrder: 2, isBreak: false, status: 'ACTIVE' },
  { id: 'p-3', schoolId: 'school-1', name: '3rd Period', startTime: '10:00', endTime: '10:45', displayOrder: 3, isBreak: false, status: 'ACTIVE' },
  { id: 'p-brk', schoolId: 'school-1', name: 'Tiffin Break', startTime: '10:45', endTime: '11:15', displayOrder: 4, isBreak: true, status: 'ACTIVE' },
  { id: 'p-4', schoolId: 'school-1', name: '4th Period', startTime: '11:15', endTime: '12:00', displayOrder: 5, isBreak: false, status: 'ACTIVE' },
  { id: 'p-5', schoolId: 'school-1', name: '5th Period', startTime: '12:00', endTime: '12:45', displayOrder: 6, isBreak: false, status: 'ACTIVE' },
  { id: 'p-6', schoolId: 'school-1', name: '6th Period', startTime: '12:45', endTime: '01:30', displayOrder: 7, isBreak: false, status: 'ACTIVE' },
];

export async function getPeriodsList(params: PaginatedParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();

  let filtered = periodsStore.filter((p) => {
    if (params.status && p.status !== params.status) return false;
    if (search && !p.name.toLowerCase().includes(search)) return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function createPeriod(payload: Omit<PeriodRecord, 'id'>) {
  const newRecord: PeriodRecord = { id: `p-${Date.now()}`, ...payload };
  periodsStore.push(newRecord);
  return newRecord;
}

export async function updatePeriod(id: string, payload: Partial<PeriodRecord>) {
  const idx = periodsStore.findIndex((p) => p.id === id);
  if (idx !== -1) {
    periodsStore[idx] = { ...periodsStore[idx], ...payload };
    return periodsStore[idx];
  }
  throw new Error('Period not found');
}

export async function togglePeriodStatus(id: string) {
  const existing = periodsStore.find((p) => p.id === id);
  if (existing) {
    existing.status = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return existing;
  }
  throw new Error('Period not found');
}

export async function deletePeriod(id: string) {
  periodsStore = periodsStore.filter((p) => p.id !== id);
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

let holidaysStore: HolidayRecord[] = [
  { id: 'h-1', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', name: 'International Mother Language Day', startDate: '2026-02-21', endDate: '2026-02-21', description: 'National Holiday honoring language martyrs', status: 'ACTIVE' },
  { id: 'h-2', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', name: 'Independence Day', startDate: '2026-03-26', endDate: '2026-03-26', description: 'National Independence Day of Bangladesh', status: 'ACTIVE' },
  { id: 'h-3', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', name: 'Bengali New Year (Pohela Boishakh)', startDate: '2026-04-14', endDate: '2026-04-14', description: 'Traditional Bengali New Year Festival', status: 'ACTIVE' },
  { id: 'h-4', schoolId: 'school-1', academicYearId: 'ay-2026', academicYearName: 'Academic Year 2026', name: 'Eid-ul-Fitr Vacation', startDate: '2026-03-18', endDate: '2026-03-23', description: 'Official Eid vacation for students and staff', status: 'ACTIVE' },
];

export async function getHolidaysList(params: PaginatedParams & { academicYearId?: string }) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const search = (params.search || '').toLowerCase();

  let filtered = holidaysStore.filter((h) => {
    if (params.academicYearId && h.academicYearId !== params.academicYearId) return false;
    if (params.status && h.status !== params.status) return false;
    if (
      search &&
      !h.name.toLowerCase().includes(search) &&
      !(h.description && h.description.toLowerCase().includes(search))
    )
      return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function createHoliday(payload: Omit<HolidayRecord, 'id'>) {
  const year = academicYearsStore.find((y) => y.id === payload.academicYearId);
  const newRecord: HolidayRecord = {
    id: `h-${Date.now()}`,
    ...payload,
    academicYearName: year?.name || 'Academic Year 2026',
  };
  holidaysStore.unshift(newRecord);
  return newRecord;
}

export async function updateHoliday(id: string, payload: Partial<HolidayRecord>) {
  const idx = holidaysStore.findIndex((h) => h.id === id);
  if (idx !== -1) {
    holidaysStore[idx] = { ...holidaysStore[idx], ...payload };
    return holidaysStore[idx];
  }
  throw new Error('Holiday not found');
}

export async function toggleHolidayStatus(id: string) {
  const existing = holidaysStore.find((h) => h.id === id);
  if (existing) {
    existing.status = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return existing;
  }
  throw new Error('Holiday not found');
}

export async function deleteHoliday(id: string) {
  holidaysStore = holidaysStore.filter((h) => h.id !== id);
  return true;
}
