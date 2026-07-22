import { z } from 'zod';
import { isTimeOverlapping, checkTimeOrder } from './routine';

export const examRoutineSchema = z.object({
  schoolId: z.string().min(1, 'School ID is required'),
  academicYearId: z.string().min(1, 'Academic Year is required'),
  examId: z.string().min(1, 'Exam is required'),
  classId: z.string().min(1, 'Class is required'),
  sectionId: z.string().optional().nullable(),
  subjectId: z.string().min(1, 'Subject is required'),
  examDate: z.string().min(1, 'Exam date is required'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM required'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM required'),
  durationMinutes: z.number().int().positive('Duration must be positive'),
  roomId: z.string().optional().nullable(),
  totalMarks: z.number().positive('Total marks must be positive'),
  passMarks: z.number().nonnegative('Pass marks cannot be negative'),
  instructions: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED']).default('DRAFT'),
});

export function checkExamClassSectionConflict(
  existingExams: any[],
  params: {
    classId: string;
    sectionId?: string | null;
    examDate: string;
    startTime: string;
    endTime: string;
    currentId?: string;
  }
): boolean {
  return existingExams.some((e) => {
    if (params.currentId && e.id === params.currentId) return false;
    if (e.status === 'CANCELLED') return false;

    const sameDate =
      new Date(e.examDate).toISOString().split('T')[0] ===
      new Date(params.examDate).toISOString().split('T')[0];
    if (!sameDate) return false;

    const sameClass = e.classId === params.classId;
    if (!sameClass) return false;

    // If sectionId is specified on both or optional
    const sameSection =
      !params.sectionId || !e.sectionId || params.sectionId === e.sectionId;

    if (sameSection) {
      return isTimeOverlapping(params.startTime, params.endTime, e.startTime, e.endTime);
    }
    return false;
  });
}

export function checkDuplicateSubjectExam(
  existingExams: any[],
  params: {
    examId: string;
    classId: string;
    sectionId?: string | null;
    subjectId: string;
    currentId?: string;
  }
): boolean {
  return existingExams.some((e) => {
    if (params.currentId && e.id === params.currentId) return false;
    if (e.status === 'CANCELLED') return false;

    return (
      e.examId === params.examId &&
      e.classId === params.classId &&
      (!params.sectionId || !e.sectionId || params.sectionId === e.sectionId) &&
      e.subjectId === params.subjectId
    );
  });
}

export function checkInvalidExamDate(examDateStr: string): boolean {
  const dateObj = new Date(examDateStr);
  return isNaN(dateObj.getTime());
}

export function filterPublishedExamsForUser(
  exams: any[],
  userRole: string
): any[] {
  if (userRole === 'STUDENT' || userRole === 'GUARDIAN') {
    return exams.filter((e) => e.status === 'PUBLISHED');
  }
  return exams;
}
