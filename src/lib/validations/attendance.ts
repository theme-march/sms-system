import { z } from 'zod';

export const ATTENDANCE_STATUSES = ['present', 'absent', 'late', 'leave', 'holiday'] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const studentAttendanceRecordSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  status: z.enum(ATTENDANCE_STATUSES),
  remarks: z.string().optional().nullable(),
});

export const bulkStudentAttendanceSchema = z.object({
  schoolId: z.string().min(1, 'School ID is required'),
  academicYearId: z.string().min(1, 'Academic Year is required'),
  classId: z.string().min(1, 'Class is required'),
  sectionId: z.string().min(1, 'Section is required'),
  subjectId: z.string().optional().nullable(), // Null for daily attendance, set for subject-wise
  sessionType: z.enum(['DAILY', 'SUBJECT_WISE']).default('DAILY'),
  date: z.string().min(1, 'Date is required'),
  takenById: z.string().min(1, 'Teacher/User ID is required'),
  records: z.array(studentAttendanceRecordSchema).min(1, 'At least one student record required'),
});

export function checkDuplicateStudentAttendance(
  existingAttendance: any[],
  params: {
    studentId: string;
    date: string;
    sessionId?: string | null;
    subjectId?: string | null;
  }
): boolean {
  const dateStr = new Date(params.date).toISOString().split('T')[0];
  return existingAttendance.some((a) => {
    const aDate = new Date(a.date).toISOString().split('T')[0];
    if (a.studentId === params.studentId && aDate === dateStr) {
      if (params.sessionId && a.sessionId === params.sessionId) return true;
      if (params.subjectId && a.subjectId === params.subjectId) return true;
      if (!params.sessionId && !params.subjectId && !a.sessionId && !a.subjectId) return true;
    }
    return false;
  });
}

export function checkDuplicateStaffAttendance(
  existingAttendance: any[],
  params: {
    targetId: string; // teacherId or employeeId
    date: string;
    type: 'TEACHER' | 'EMPLOYEE';
  }
): boolean {
  const dateStr = new Date(params.date).toISOString().split('T')[0];
  return existingAttendance.some((a) => {
    const aDate = new Date(a.date).toISOString().split('T')[0];
    const key = params.type === 'TEACHER' ? a.teacherId : a.employeeId;
    return key === params.targetId && aDate === dateStr;
  });
}
