import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkTeacherConflict,
  checkClassSectionConflict,
  checkRoomConflict,
  checkDuplicatePeriod,
  checkTimeOrder,
} from '../src/lib/validations/routine';
import {
  checkExamClassSectionConflict,
  checkDuplicateSubjectExam,
} from '../src/lib/validations/exam-routine';

test('Routine Validation - Time order check', () => {
  assert.equal(checkTimeOrder('08:30', '09:15'), true);
  assert.equal(checkTimeOrder('09:15', '08:30'), false);
  assert.equal(checkTimeOrder('10:00', '10:00'), false);
});

test('Routine Validation - Teacher conflict detection', () => {
  const existingRoutines = [
    {
      id: 'r1',
      teacherId: 't1',
      weekday: 'SUNDAY',
      startTime: '08:30',
      endTime: '09:15',
      status: 'PUBLISHED',
    },
  ];

  // Overlapping time for same teacher on same day
  const hasConflict = checkTeacherConflict(existingRoutines, {
    teacherId: 't1',
    weekday: 'SUNDAY',
    startTime: '09:00',
    endTime: '09:45',
  });
  assert.equal(hasConflict, true);

  // Non-overlapping time for same teacher
  const noConflictTime = checkTeacherConflict(existingRoutines, {
    teacherId: 't1',
    weekday: 'SUNDAY',
    startTime: '09:15',
    endTime: '10:00',
  });
  assert.equal(noConflictTime, false);

  // Different weekday for same teacher
  const noConflictDay = checkTeacherConflict(existingRoutines, {
    teacherId: 't1',
    weekday: 'MONDAY',
    startTime: '08:30',
    endTime: '09:15',
  });
  assert.equal(noConflictDay, false);
});

test('Routine Validation - Class & Section conflict detection', () => {
  const existingRoutines = [
    {
      id: 'r1',
      classId: 'c6',
      sectionId: 's1',
      weekday: 'SUNDAY',
      startTime: '08:30',
      endTime: '09:15',
      status: 'PUBLISHED',
    },
  ];

  // Same class & section overlapping
  const hasConflict = checkClassSectionConflict(existingRoutines, {
    classId: 'c6',
    sectionId: 's1',
    weekday: 'SUNDAY',
    startTime: '08:45',
    endTime: '09:30',
  });
  assert.equal(hasConflict, true);

  // Different section
  const noConflictSection = checkClassSectionConflict(existingRoutines, {
    classId: 'c6',
    sectionId: 's2',
    weekday: 'SUNDAY',
    startTime: '08:45',
    endTime: '09:30',
  });
  assert.equal(noConflictSection, false);
});

test('Routine Validation - Room conflict detection', () => {
  const existingRoutines = [
    {
      id: 'r1',
      roomId: 'room101',
      weekday: 'SUNDAY',
      startTime: '08:30',
      endTime: '09:15',
      status: 'PUBLISHED',
    },
  ];

  const hasConflict = checkRoomConflict(existingRoutines, {
    roomId: 'room101',
    weekday: 'SUNDAY',
    startTime: '08:50',
    endTime: '09:30',
  });
  assert.equal(hasConflict, true);
});

test('Routine Validation - Duplicate period detection', () => {
  const existingRoutines = [
    {
      id: 'r1',
      classId: 'c6',
      sectionId: 's1',
      weekday: 'SUNDAY',
      periodId: 'p1',
      status: 'PUBLISHED',
    },
  ];

  const isDuplicate = checkDuplicatePeriod(existingRoutines, {
    classId: 'c6',
    sectionId: 's1',
    weekday: 'SUNDAY',
    periodId: 'p1',
  });
  assert.equal(isDuplicate, true);
});

test('Exam Routine Validation - Overlapping exams detection', () => {
  const existingExams = [
    {
      id: 'er1',
      examId: 'ex1',
      classId: 'c6',
      sectionId: 's1',
      subjectId: 'sub1',
      examDate: '2026-04-10',
      startTime: '10:00',
      endTime: '13:00',
      status: 'PUBLISHED',
    },
  ];

  // Overlapping time same day, same class
  const hasConflict = checkExamClassSectionConflict(existingExams, {
    classId: 'c6',
    sectionId: 's1',
    examDate: '2026-04-10',
    startTime: '11:00',
    endTime: '12:30',
  });
  assert.equal(hasConflict, true);

  // Duplicate subject exam check
  const duplicateSubject = checkDuplicateSubjectExam(existingExams, {
    examId: 'ex1',
    classId: 'c6',
    sectionId: 's1',
    subjectId: 'sub1',
  });
  assert.equal(duplicateSubject, true);
});
