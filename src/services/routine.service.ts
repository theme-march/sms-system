import prisma from '@/src/lib/db/prisma';
import { createAuditLog } from '@/src/lib/audit';
import {
  checkClassSectionConflict,
  checkDuplicatePeriod,
  checkRoomConflict,
  checkTeacherConflict,
  checkTimeOrder,
} from '@/src/lib/validations/routine';

export interface ClassRoutineRecord {
  id: string;
  schoolId: string;
  academicYearId: string;
  sessionId?: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  groupId?: string;
  groupName?: string;
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  teacherId: string;
  teacherName?: string;
  roomId?: string;
  roomName?: string;
  weekday: string;
  periodId: string;
  periodName?: string;
  startTime: string;
  endTime: string;
  effectiveFrom: string;
  effectiveTo?: string;
  versionNumber: number;
  status: 'DRAFT' | 'PUBLISHED' | 'INACTIVE';
  createdAt?: string;
}

export interface RoutineVersionRecord {
  id: string;
  schoolId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  versionNumber: number;
  changeSummary?: string;
  routineSnapshot: string;
  createdBy?: string;
  createdAt: string;
}

let classRoutinesStore: ClassRoutineRecord[] = [
  {
    id: 'cr-1',
    schoolId: 'school-1',
    academicYearId: 'ay-2026',
    sessionId: 'as-1',
    classId: 'c-6',
    className: 'Class 6',
    sectionId: 's-padma',
    sectionName: 'Padma',
    subjectId: 'sub-1',
    subjectName: 'Bangla 1st Paper',
    subjectCode: 'BAN-101',
    teacherId: 't-1',
    teacherName: 'Dr. Rafiqul Islam',
    roomId: 'r-101',
    roomName: 'Classroom 101',
    weekday: 'SUNDAY',
    periodId: 'p-1',
    periodName: '1st Period',
    startTime: '08:30',
    endTime: '09:15',
    effectiveFrom: '2026-01-01',
    versionNumber: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'cr-2',
    schoolId: 'school-1',
    academicYearId: 'ay-2026',
    sessionId: 'as-1',
    classId: 'c-6',
    className: 'Class 6',
    sectionId: 's-padma',
    sectionName: 'Padma',
    subjectId: 'sub-2',
    subjectName: 'English 1st Paper',
    subjectCode: 'ENG-101',
    teacherId: 't-2',
    teacherName: 'Nusrat Jahan',
    roomId: 'r-101',
    roomName: 'Classroom 101',
    weekday: 'SUNDAY',
    periodId: 'p-2',
    periodName: '2nd Period',
    startTime: '09:15',
    endTime: '10:00',
    effectiveFrom: '2026-01-01',
    versionNumber: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'cr-3',
    schoolId: 'school-1',
    academicYearId: 'ay-2026',
    sessionId: 'as-1',
    classId: 'c-6',
    className: 'Class 6',
    sectionId: 's-padma',
    sectionName: 'Padma',
    subjectId: 'sub-3',
    subjectName: 'General Mathematics',
    subjectCode: 'MATH-101',
    teacherId: 't-3',
    teacherName: 'Mahmudul Hasan',
    roomId: 'r-101',
    roomName: 'Classroom 101',
    weekday: 'MONDAY',
    periodId: 'p-1',
    periodName: '1st Period',
    startTime: '08:30',
    endTime: '09:15',
    effectiveFrom: '2026-01-01',
    versionNumber: 1,
    status: 'PUBLISHED',
  },
];

let routineVersionsStore: RoutineVersionRecord[] = [
  {
    id: 'rv-1',
    schoolId: 'school-1',
    academicYearId: 'ay-2026',
    classId: 'c-6',
    sectionId: 's-padma',
    versionNumber: 1,
    changeSummary: 'Initial Published Routine for Term 1',
    routineSnapshot: JSON.stringify(classRoutinesStore.filter((r) => r.classId === 'c-6')),
    createdBy: 'admin@school.com',
    createdAt: '2026-01-02T10:00:00Z',
  },
];

export async function getClassRoutines(params: {
  schoolId?: string;
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  teacherId?: string;
  roomId?: string;
  status?: string;
  weekday?: string;
  search?: string;
}) {
  try {
    const where: any = {};
    if (params.schoolId) where.schoolId = params.schoolId;
    if (params.academicYearId) where.academicYearId = params.academicYearId;
    if (params.classId) where.classId = params.classId;
    if (params.sectionId) where.sectionId = params.sectionId;
    if (params.teacherId) where.teacherId = params.teacherId;
    if (params.roomId) where.roomId = params.roomId;
    if (params.status) where.status = params.status;
    if (params.weekday) where.weekday = params.weekday;

    const dbRecords = await prisma.classRoutine.findMany({
      where,
      orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }],
    });

    if (dbRecords.length > 0) {
      return dbRecords.map((r) => ({
        id: r.id,
        schoolId: r.schoolId,
        academicYearId: r.academicYearId,
        sessionId: r.sessionId || undefined,
        classId: r.classId,
        sectionId: r.sectionId,
        groupId: r.groupId || undefined,
        subjectId: r.subjectId,
        teacherId: r.teacherId,
        roomId: r.roomId || undefined,
        weekday: r.weekday,
        periodId: r.periodId,
        startTime: r.startTime,
        endTime: r.endTime,
        effectiveFrom: new Date(r.effectiveFrom).toISOString().split('T')[0],
        effectiveTo: r.effectiveTo ? new Date(r.effectiveTo).toISOString().split('T')[0] : undefined,
        versionNumber: r.versionNumber,
        status: r.status as 'DRAFT' | 'PUBLISHED' | 'INACTIVE',
      }));
    }
  } catch {
    // fallback
  }

  return classRoutinesStore.filter((r) => {
    if (params.schoolId && r.schoolId !== params.schoolId) return false;
    if (params.academicYearId && r.academicYearId !== params.academicYearId) return false;
    if (params.classId && r.classId !== params.classId) return false;
    if (params.sectionId && r.sectionId !== params.sectionId) return false;
    if (params.teacherId && r.teacherId !== params.teacherId) return false;
    if (params.roomId && r.roomId !== params.roomId) return false;
    if (params.status && r.status !== params.status) return false;
    if (params.weekday && r.weekday !== params.weekday) return false;
    if (params.search) {
      const q = params.search.toLowerCase();
      const match =
        r.subjectName?.toLowerCase().includes(q) ||
        r.teacherName?.toLowerCase().includes(q) ||
        r.className?.toLowerCase().includes(q) ||
        r.roomName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

export async function createClassRoutine(
  payload: Omit<ClassRoutineRecord, 'id' | 'versionNumber'> & { userId?: string }
) {
  // Rule 1: Validate end time after start time
  if (!checkTimeOrder(payload.startTime, payload.endTime)) {
    throw new Error('Invalid time range: End time must be after start time.');
  }

  // Rule 2: Check Teacher time conflict
  if (
    checkTeacherConflict(classRoutinesStore, {
      teacherId: payload.teacherId,
      weekday: payload.weekday,
      startTime: payload.startTime,
      endTime: payload.endTime,
    })
  ) {
    throw new Error(
      `Teacher time conflict: Selected teacher is already assigned to another class at this time on ${payload.weekday}.`
    );
  }

  // Rule 3: Check Class and section time conflict
  if (
    checkClassSectionConflict(classRoutinesStore, {
      classId: payload.classId,
      sectionId: payload.sectionId,
      weekday: payload.weekday,
      startTime: payload.startTime,
      endTime: payload.endTime,
    })
  ) {
    throw new Error(
      `Class section conflict: This class and section already has a class scheduled at this time on ${payload.weekday}.`
    );
  }

  // Rule 4: Check Room conflict
  if (
    payload.roomId &&
    checkRoomConflict(classRoutinesStore, {
      roomId: payload.roomId,
      weekday: payload.weekday,
      startTime: payload.startTime,
      endTime: payload.endTime,
    })
  ) {
    throw new Error(
      `Room conflict: Selected room is already occupied at this time on ${payload.weekday}.`
    );
  }

  // Rule 5: Check Duplicate Period
  if (
    checkDuplicatePeriod(classRoutinesStore, {
      classId: payload.classId,
      sectionId: payload.sectionId,
      weekday: payload.weekday,
      periodId: payload.periodId,
    })
  ) {
    throw new Error(
      `Duplicate period: This period slot is already assigned for this class and section on ${payload.weekday}.`
    );
  }

  const newRoutine: ClassRoutineRecord = {
    id: `cr-${Date.now()}`,
    ...payload,
    versionNumber: 1,
    status: payload.status || 'PUBLISHED',
  };

  try {
    const dbCreated = await prisma.classRoutine.create({
      data: {
        schoolId: payload.schoolId,
        academicYearId: payload.academicYearId,
        sessionId: payload.sessionId,
        classId: payload.classId,
        sectionId: payload.sectionId,
        groupId: payload.groupId,
        subjectId: payload.subjectId,
        teacherId: payload.teacherId,
        roomId: payload.roomId,
        weekday: payload.weekday,
        periodId: payload.periodId,
        startTime: payload.startTime,
        endTime: payload.endTime,
        effectiveFrom: new Date(payload.effectiveFrom),
        effectiveTo: payload.effectiveTo ? new Date(payload.effectiveTo) : null,
        versionNumber: 1,
        status: payload.status || 'PUBLISHED',
      },
    });
    newRoutine.id = dbCreated.id;
  } catch {
    // In-memory fallback
  }

  classRoutinesStore.unshift(newRoutine);

  await createAuditLog({
    schoolId: payload.schoolId,
    userId: payload.userId || 'system',
    action: 'CREATE',
    module: 'ROUTINE',
    details: `Created class routine for classId ${payload.classId}, subjectId ${payload.subjectId} on ${payload.weekday}`,
  });

  return newRoutine;
}

export async function updateClassRoutine(
  id: string,
  payload: Partial<ClassRoutineRecord> & { userId?: string }
) {
  const existing = classRoutinesStore.find((r) => r.id === id);
  if (!existing) throw new Error('Class routine record not found');

  const merged = { ...existing, ...payload };

  if (!checkTimeOrder(merged.startTime, merged.endTime)) {
    throw new Error('Invalid time range: End time must be after start time.');
  }

  if (
    checkTeacherConflict(classRoutinesStore, {
      teacherId: merged.teacherId,
      weekday: merged.weekday,
      startTime: merged.startTime,
      endTime: merged.endTime,
      currentId: id,
    })
  ) {
    throw new Error(
      `Teacher time conflict: Selected teacher is already assigned to another class at this time on ${merged.weekday}.`
    );
  }

  if (
    checkClassSectionConflict(classRoutinesStore, {
      classId: merged.classId,
      sectionId: merged.sectionId,
      weekday: merged.weekday,
      startTime: merged.startTime,
      endTime: merged.endTime,
      currentId: id,
    })
  ) {
    throw new Error(
      `Class section conflict: This class and section already has a class scheduled at this time on ${merged.weekday}.`
    );
  }

  if (
    merged.roomId &&
    checkRoomConflict(classRoutinesStore, {
      roomId: merged.roomId,
      weekday: merged.weekday,
      startTime: merged.startTime,
      endTime: merged.endTime,
      currentId: id,
    })
  ) {
    throw new Error(
      `Room conflict: Selected room is already occupied at this time on ${merged.weekday}.`
    );
  }

  if (
    checkDuplicatePeriod(classRoutinesStore, {
      classId: merged.classId,
      sectionId: merged.sectionId,
      weekday: merged.weekday,
      periodId: merged.periodId,
      currentId: id,
    })
  ) {
    throw new Error(
      `Duplicate period: This period slot is already assigned for this class and section on ${merged.weekday}.`
    );
  }

  const idx = classRoutinesStore.findIndex((r) => r.id === id);
  classRoutinesStore[idx] = merged;

  try {
    await prisma.classRoutine.update({
      where: { id },
      data: {
        ...(payload.weekday && { weekday: payload.weekday }),
        ...(payload.startTime && { startTime: payload.startTime }),
        ...(payload.endTime && { endTime: payload.endTime }),
        ...(payload.subjectId && { subjectId: payload.subjectId }),
        ...(payload.teacherId && { teacherId: payload.teacherId }),
        ...(payload.roomId !== undefined && { roomId: payload.roomId }),
        ...(payload.status && { status: payload.status }),
      },
    });
  } catch {
    // In-memory fallback
  }

  await createAuditLog({
    schoolId: merged.schoolId,
    userId: payload.userId || 'system',
    action: 'UPDATE',
    module: 'ROUTINE',
    details: `Updated class routine ${id}`,
  });

  return merged;
}

export async function deleteClassRoutine(id: string, userId?: string) {
  const existing = classRoutinesStore.find((r) => r.id === id);
  classRoutinesStore = classRoutinesStore.filter((r) => r.id !== id);

  try {
    await prisma.classRoutine.delete({ where: { id } });
  } catch {
    // In-memory fallback
  }

  if (existing) {
    await createAuditLog({
      schoolId: existing.schoolId,
      userId: userId || 'system',
      action: 'DELETE',
      module: 'ROUTINE',
      details: `Deleted class routine ${id}`,
    });
  }
  return true;
}

export async function getRoutineVersions(classId: string, sectionId: string) {
  return routineVersionsStore.filter((v) => v.classId === classId && v.sectionId === sectionId);
}

export async function createRoutineVersion(
  classId: string,
  sectionId: string,
  changeSummary: string,
  createdBy?: string
) {
  const currentRoutines = classRoutinesStore.filter(
    (r) => r.classId === classId && r.sectionId === sectionId
  );
  const existingVersions = routineVersionsStore.filter(
    (v) => v.classId === classId && v.sectionId === sectionId
  );
  const nextVer = existingVersions.length + 1;

  const newVersion: RoutineVersionRecord = {
    id: `rv-${Date.now()}`,
    schoolId: currentRoutines[0]?.schoolId || 'school-1',
    academicYearId: currentRoutines[0]?.academicYearId || 'ay-2026',
    classId,
    sectionId,
    versionNumber: nextVer,
    changeSummary,
    routineSnapshot: JSON.stringify(currentRoutines),
    createdBy,
    createdAt: new Date().toISOString(),
  };

  routineVersionsStore.unshift(newVersion);
  return newVersion;
}
