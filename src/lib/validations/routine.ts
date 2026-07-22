import { z } from 'zod';

export const WEEKDAYS = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const classRoutineSchema = z.object({
  schoolId: z.string().min(1, 'School ID is required'),
  academicYearId: z.string().min(1, 'Academic Year is required'),
  sessionId: z.string().optional(),
  classId: z.string().min(1, 'Class is required'),
  sectionId: z.string().min(1, 'Section is required'),
  groupId: z.string().optional().nullable(),
  subjectId: z.string().min(1, 'Subject is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  roomId: z.string().optional().nullable(),
  weekday: z.enum(WEEKDAYS),
  periodId: z.string().min(1, 'Period is required'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM required'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM required'),
  effectiveFrom: z.string().or(z.date()),
  effectiveTo: z.string().or(z.date()).optional().nullable(),
  versionNumber: z.number().int().default(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'INACTIVE']).default('PUBLISHED'),
});

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

export function isTimeOverlapping(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);

  return s1 < e2 && s2 < e1;
}

export function checkTimeOrder(startTime: string, endTime: string): boolean {
  return timeToMinutes(endTime) > timeToMinutes(startTime);
}

export function checkTeacherConflict(
  existingRoutines: any[],
  params: {
    teacherId: string;
    weekday: string;
    startTime: string;
    endTime: string;
    currentId?: string;
  }
): boolean {
  return existingRoutines.some((r) => {
    if (params.currentId && r.id === params.currentId) return false;
    if (r.status === 'INACTIVE') return false;
    if (r.teacherId === params.teacherId && r.weekday === params.weekday) {
      return isTimeOverlapping(params.startTime, params.endTime, r.startTime, r.endTime);
    }
    return false;
  });
}

export function checkClassSectionConflict(
  existingRoutines: any[],
  params: {
    classId: string;
    sectionId: string;
    weekday: string;
    startTime: string;
    endTime: string;
    currentId?: string;
  }
): boolean {
  return existingRoutines.some((r) => {
    if (params.currentId && r.id === params.currentId) return false;
    if (r.status === 'INACTIVE') return false;
    if (
      r.classId === params.classId &&
      r.sectionId === params.sectionId &&
      r.weekday === params.weekday
    ) {
      return isTimeOverlapping(params.startTime, params.endTime, r.startTime, r.endTime);
    }
    return false;
  });
}

export function checkRoomConflict(
  existingRoutines: any[],
  params: {
    roomId?: string | null;
    weekday: string;
    startTime: string;
    endTime: string;
    currentId?: string;
  }
): boolean {
  if (!params.roomId) return false;
  return existingRoutines.some((r) => {
    if (params.currentId && r.id === params.currentId) return false;
    if (r.status === 'INACTIVE') return false;
    if (r.roomId && r.roomId === params.roomId && r.weekday === params.weekday) {
      return isTimeOverlapping(params.startTime, params.endTime, r.startTime, r.endTime);
    }
    return false;
  });
}

export function checkDuplicatePeriod(
  existingRoutines: any[],
  params: {
    classId: string;
    sectionId: string;
    weekday: string;
    periodId: string;
    currentId?: string;
  }
): boolean {
  return existingRoutines.some((r) => {
    if (params.currentId && r.id === params.currentId) return false;
    if (r.status === 'INACTIVE') return false;
    return (
      r.classId === params.classId &&
      r.sectionId === params.sectionId &&
      r.weekday === params.weekday &&
      r.periodId === params.periodId
    );
  });
}

export function checkSubjectAssignedToClass(
  classSubjects: any[],
  classId: string,
  subjectId: string
): boolean {
  if (!classSubjects || classSubjects.length === 0) return true; // Permissive fallback if subject pool empty
  return classSubjects.some((cs) => cs.classId === classId && cs.subjectId === subjectId);
}

export function checkTeacherSubjectAuthorization(
  teacherAssignments: any[],
  teacherId: string,
  classId: string,
  subjectId: string
): boolean {
  if (!teacherAssignments || teacherAssignments.length === 0) return true; // Permissive if no mapping configured
  return teacherAssignments.some(
    (ta) =>
      ta.teacherId === teacherId &&
      ta.classId === classId &&
      ta.subjectId === subjectId &&
      ta.status !== 'INACTIVE'
  );
}
