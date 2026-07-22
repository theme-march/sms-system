import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkDuplicateStudentAttendance,
  checkDuplicateStaffAttendance,
} from '../src/lib/validations/attendance';

test('Attendance Validation - Duplicate student attendance detection', () => {
  const existingAttendance = [
    {
      studentId: 'st-1',
      date: '2026-04-10',
      sessionId: 'sess-100',
      status: 'present',
    },
  ];

  const isDuplicate = checkDuplicateStudentAttendance(existingAttendance, {
    studentId: 'st-1',
    date: '2026-04-10',
    sessionId: 'sess-100',
  });
  assert.equal(isDuplicate, true);

  const notDuplicate = checkDuplicateStudentAttendance(existingAttendance, {
    studentId: 'st-1',
    date: '2026-04-11',
    sessionId: 'sess-100',
  });
  assert.equal(notDuplicate, false);
});

test('Attendance Validation - Duplicate staff attendance detection', () => {
  const existingStaffAttendance = [
    {
      teacherId: 't-1',
      date: '2026-04-10',
      status: 'present',
    },
  ];

  const isDuplicateTeacher = checkDuplicateStaffAttendance(existingStaffAttendance, {
    targetId: 't-1',
    date: '2026-04-10',
    type: 'TEACHER',
  });
  assert.equal(isDuplicateTeacher, true);
});
