import prisma from '@/src/lib/db/prisma';
import { createAuditLog } from '@/src/lib/audit';
import {
  checkExamClassSectionConflict,
  checkDuplicateSubjectExam,
  checkInvalidExamDate,
  filterPublishedExamsForUser,
} from '@/src/lib/validations/exam-routine';
import { checkTimeOrder } from '@/src/lib/validations/routine';

export interface ExamRoutineRecord {
  id: string;
  schoolId: string;
  academicYearId: string;
  examId: string;
  examName?: string;
  classId: string;
  className?: string;
  sectionId?: string;
  sectionName?: string;
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  examDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  roomId?: string;
  roomName?: string;
  totalMarks: number;
  passMarks: number;
  instructions?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  createdAt?: string;
}

let examRoutinesStore: ExamRoutineRecord[] = [
  {
    id: 'er-1',
    schoolId: 'school-1',
    academicYearId: 'ay-2026',
    examId: 'ex-1',
    examName: 'First Term Final Examination 2026',
    classId: 'c-6',
    className: 'Class 6',
    sectionId: 's-padma',
    sectionName: 'Padma',
    subjectId: 'sub-1',
    subjectName: 'Bangla 1st Paper',
    subjectCode: 'BAN-101',
    examDate: '2026-04-10',
    startTime: '10:00',
    endTime: '13:00',
    durationMinutes: 180,
    roomId: 'r-101',
    roomName: 'Classroom 101',
    totalMarks: 100,
    passMarks: 33,
    instructions: 'Bring your official admit card and blue/black pens only.',
    status: 'PUBLISHED',
  },
  {
    id: 'er-2',
    schoolId: 'school-1',
    academicYearId: 'ay-2026',
    examId: 'ex-1',
    examName: 'First Term Final Examination 2026',
    classId: 'c-6',
    className: 'Class 6',
    sectionId: 's-padma',
    sectionName: 'Padma',
    subjectId: 'sub-2',
    subjectName: 'English 1st Paper',
    subjectCode: 'ENG-101',
    examDate: '2026-04-12',
    startTime: '10:00',
    endTime: '13:00',
    durationMinutes: 180,
    roomId: 'r-101',
    roomName: 'Classroom 101',
    totalMarks: 100,
    passMarks: 33,
    instructions: 'No calculators or digital watches allowed in examination hall.',
    status: 'PUBLISHED',
  },
  {
    id: 'er-3',
    schoolId: 'school-1',
    academicYearId: 'ay-2026',
    examId: 'ex-1',
    examName: 'First Term Final Examination 2026',
    classId: 'c-9',
    className: 'Class 9',
    subjectId: 'sub-3',
    subjectName: 'General Mathematics',
    subjectCode: 'MATH-101',
    examDate: '2026-04-15',
    startTime: '10:00',
    endTime: '13:00',
    durationMinutes: 180,
    roomId: 'r-201',
    roomName: 'Science Lab',
    totalMarks: 100,
    passMarks: 33,
    instructions: 'Scientific non-programmable calculators permitted.',
    status: 'DRAFT',
  },
];

export async function getExamRoutines(params: {
  schoolId?: string;
  academicYearId?: string;
  examId?: string;
  classId?: string;
  sectionId?: string;
  status?: string;
  userRole?: string;
  search?: string;
}) {
  try {
    const where: any = {};
    if (params.schoolId) where.schoolId = params.schoolId;
    if (params.academicYearId) where.academicYearId = params.academicYearId;
    if (params.examId) where.examId = params.examId;
    if (params.classId) where.classId = params.classId;
    if (params.sectionId) where.sectionId = params.sectionId;

    // Enforce published-only visibility for students/guardians
    if (params.userRole === 'STUDENT' || params.userRole === 'GUARDIAN') {
      where.status = 'PUBLISHED';
    } else if (params.status) {
      where.status = params.status;
    }

    const dbRecords = await prisma.examRoutine.findMany({
      where,
      orderBy: [{ examDate: 'asc' }, { startTime: 'asc' }],
    });

    if (dbRecords.length > 0) {
      const records = dbRecords.map((r) => ({
        id: r.id,
        schoolId: r.schoolId,
        academicYearId: r.academicYearId,
        examId: r.examId,
        classId: r.classId,
        sectionId: r.sectionId || undefined,
        subjectId: r.subjectId,
        examDate: new Date(r.examDate).toISOString().split('T')[0],
        startTime: r.startTime,
        endTime: r.endTime,
        durationMinutes: r.durationMinutes,
        roomId: r.roomId || undefined,
        totalMarks: Number(r.totalMarks),
        passMarks: Number(r.passMarks),
        instructions: r.instructions || undefined,
        status: r.status as 'DRAFT' | 'PUBLISHED' | 'CANCELLED',
      }));

      return filterPublishedExamsForUser(records, params.userRole || 'ADMIN');
    }
  } catch {
    // fallback
  }

  let filtered = examRoutinesStore.filter((r) => {
    if (params.schoolId && r.schoolId !== params.schoolId) return false;
    if (params.academicYearId && r.academicYearId !== params.academicYearId) return false;
    if (params.examId && r.examId !== params.examId) return false;
    if (params.classId && r.classId !== params.classId) return false;
    if (params.sectionId && r.sectionId !== params.sectionId) return false;
    if (params.status && r.status !== params.status) return false;
    if (params.search) {
      const q = params.search.toLowerCase();
      const match =
        r.subjectName?.toLowerCase().includes(q) ||
        r.className?.toLowerCase().includes(q) ||
        r.examName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return filterPublishedExamsForUser(filtered, params.userRole || 'ADMIN');
}

export async function createExamRoutine(
  payload: Omit<ExamRoutineRecord, 'id'> & { userId?: string }
) {
  // Rule 1: Validate date
  if (checkInvalidExamDate(payload.examDate)) {
    throw new Error('Invalid exam date provided.');
  }

  // Rule 2: Validate time range
  if (!checkTimeOrder(payload.startTime, payload.endTime)) {
    throw new Error('Invalid exam time range: End time must be after start time.');
  }

  // Rule 3: Check duplicate exam for subject
  if (
    checkDuplicateSubjectExam(examRoutinesStore, {
      examId: payload.examId,
      classId: payload.classId,
      sectionId: payload.sectionId,
      subjectId: payload.subjectId,
    })
  ) {
    throw new Error(
      'Duplicate exam schedule: An exam for this subject is already scheduled in this exam term.'
    );
  }

  // Rule 4: Check exam time conflict for class/section
  if (
    checkExamClassSectionConflict(examRoutinesStore, {
      classId: payload.classId,
      sectionId: payload.sectionId,
      examDate: payload.examDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
    })
  ) {
    throw new Error(
      `Exam time conflict: Another exam is already scheduled for this class at overlapping time on ${payload.examDate}.`
    );
  }

  const newExam: ExamRoutineRecord = {
    id: `er-${Date.now()}`,
    ...payload,
    status: payload.status || 'DRAFT',
  };

  try {
    const dbCreated = await prisma.examRoutine.create({
      data: {
        schoolId: payload.schoolId,
        academicYearId: payload.academicYearId,
        examId: payload.examId,
        classId: payload.classId,
        sectionId: payload.sectionId,
        subjectId: payload.subjectId,
        examDate: new Date(payload.examDate),
        startTime: payload.startTime,
        endTime: payload.endTime,
        durationMinutes: payload.durationMinutes,
        roomId: payload.roomId,
        totalMarks: payload.totalMarks,
        passMarks: payload.passMarks,
        instructions: payload.instructions,
        status: payload.status || 'DRAFT',
      },
    });
    newExam.id = dbCreated.id;
  } catch {
    // In-memory fallback
  }

  examRoutinesStore.unshift(newExam);

  await createAuditLog({
    schoolId: payload.schoolId,
    userId: payload.userId || 'system',
    action: 'CREATE',
    module: 'EXAM_ROUTINE',
    details: `Created exam routine for examId ${payload.examId}, subjectId ${payload.subjectId} on ${payload.examDate}`,
  });

  return newExam;
}

export async function updateExamRoutine(
  id: string,
  payload: Partial<ExamRoutineRecord> & { userId?: string }
) {
  const existing = examRoutinesStore.find((r) => r.id === id);
  if (!existing) throw new Error('Exam routine record not found');

  const merged = { ...existing, ...payload };

  if (checkInvalidExamDate(merged.examDate)) {
    throw new Error('Invalid exam date provided.');
  }

  if (!checkTimeOrder(merged.startTime, merged.endTime)) {
    throw new Error('Invalid exam time range: End time must be after start time.');
  }

  if (
    checkDuplicateSubjectExam(examRoutinesStore, {
      examId: merged.examId,
      classId: merged.classId,
      sectionId: merged.sectionId,
      subjectId: merged.subjectId,
      currentId: id,
    })
  ) {
    throw new Error(
      'Duplicate exam schedule: An exam for this subject is already scheduled in this exam term.'
    );
  }

  if (
    checkExamClassSectionConflict(examRoutinesStore, {
      classId: merged.classId,
      sectionId: merged.sectionId,
      examDate: merged.examDate,
      startTime: merged.startTime,
      endTime: merged.endTime,
      currentId: id,
    })
  ) {
    throw new Error(
      `Exam time conflict: Another exam is already scheduled for this class at overlapping time on ${merged.examDate}.`
    );
  }

  const idx = examRoutinesStore.findIndex((r) => r.id === id);
  examRoutinesStore[idx] = merged;

  try {
    await prisma.examRoutine.update({
      where: { id },
      data: {
        ...(payload.examDate && { examDate: new Date(payload.examDate) }),
        ...(payload.startTime && { startTime: payload.startTime }),
        ...(payload.endTime && { endTime: payload.endTime }),
        ...(payload.durationMinutes && { durationMinutes: payload.durationMinutes }),
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
    module: 'EXAM_ROUTINE',
    details: `Updated exam routine ${id}`,
  });

  return merged;
}

export async function publishExamRoutine(
  examId: string,
  classId?: string,
  userId?: string
) {
  let count = 0;
  examRoutinesStore = examRoutinesStore.map((e) => {
    if (e.examId === examId && (!classId || e.classId === classId)) {
      count++;
      return { ...e, status: 'PUBLISHED' };
    }
    return e;
  });

  try {
    await prisma.examRoutine.updateMany({
      where: {
        examId,
        ...(classId && { classId }),
      },
      data: { status: 'PUBLISHED' },
    });
  } catch {
    // In-memory fallback
  }

  await createAuditLog({
    schoolId: 'school-1',
    userId: userId || 'system',
    action: 'TOGGLE_STATUS',
    module: 'EXAM_ROUTINE',
    details: `Published ${count} exam routines for exam ${examId}`,
  });

  return { publishedCount: count };
}

export async function deleteExamRoutine(id: string, userId?: string) {
  const existing = examRoutinesStore.find((r) => r.id === id);
  examRoutinesStore = examRoutinesStore.filter((r) => r.id !== id);

  try {
    await prisma.examRoutine.delete({ where: { id } });
  } catch {
    // In-memory fallback
  }

  if (existing) {
    await createAuditLog({
      schoolId: existing.schoolId,
      userId: userId || 'system',
      action: 'DELETE',
      module: 'EXAM_ROUTINE',
      details: `Deleted exam routine ${id}`,
    });
  }
  return true;
}
