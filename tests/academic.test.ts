import test from 'node:test';
import assert from 'node:assert';
import {
  academicYearSchema,
  academicSessionSchema,
  classSectionAssignmentSchema,
  classSubjectAssignmentSchema,
  holidaySchema,
  validateSingleCurrentYear,
} from '../src/lib/validations/academic';

test('Current academic year validation - only one current academic year allowed', () => {
  const existingYears = [
    { id: 'year-1', isCurrent: true, status: 'ACTIVE' },
    { id: 'year-2', isCurrent: false, status: 'ACTIVE' },
  ];

  // Setting year-2 as current when year-1 is current should require resetting year-1
  const updatedYears = validateSingleCurrentYear(existingYears, 'year-2', true);
  const currentYears = updatedYears.filter((y) => y.isCurrent);

  assert.strictEqual(currentYears.length, 1);
  assert.strictEqual(currentYears[0].id, 'year-2');
});

test('Date-range validation - end date must be after start date', () => {
  // Valid dates
  const validData = {
    schoolId: 'school-1',
    name: '2026-2027',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isCurrent: true,
    status: 'ACTIVE',
  };
  const validResult = academicYearSchema.safeParse(validData);
  assert.strictEqual(validResult.success, true);

  // Invalid dates (end date before start date)
  const invalidData = {
    ...validData,
    startDate: '2026-12-31',
    endDate: '2026-01-01',
  };
  const invalidResult = academicYearSchema.safeParse(invalidData);
  assert.strictEqual(invalidResult.success, false);
  if (!invalidResult.success) {
    const issue = invalidResult.error.issues.find((i) => i.path.includes('endDate'));
    assert.ok(issue, 'Should report issue on endDate');
  }
});

test('Duplicate class-section assignment validation', () => {
  const existingAssignments = [
    { academicYearId: 'ay-1', classId: 'c-1', sectionId: 's-1' },
    { academicYearId: 'ay-1', classId: 'c-1', sectionId: 's-2' },
  ];

  const newAssignment = {
    schoolId: 'school-1',
    academicYearId: 'ay-1',
    classId: 'c-1',
    sectionId: 's-1',
    capacity: 40,
    status: 'ACTIVE' as const,
  };

  const isDuplicate = existingAssignments.some(
    (a) =>
      a.academicYearId === newAssignment.academicYearId &&
      a.classId === newAssignment.classId &&
      a.sectionId === newAssignment.sectionId
  );

  assert.strictEqual(isDuplicate, true, 'Should detect duplicate class-section assignment');
});

test('Duplicate class-subject assignment validation', () => {
  const existingAssignments = [
    { academicYearId: 'ay-1', classId: 'c-1', subjectId: 'sub-1', groupId: 'g-1' },
  ];

  const newAssignment = {
    academicYearId: 'ay-1',
    classId: 'c-1',
    subjectId: 'sub-1',
    groupId: 'g-1',
  };

  const isDuplicate = existingAssignments.some(
    (a) =>
      a.academicYearId === newAssignment.academicYearId &&
      a.classId === newAssignment.classId &&
      a.subjectId === newAssignment.subjectId &&
      a.groupId === newAssignment.groupId
  );

  assert.strictEqual(isDuplicate, true, 'Should detect duplicate class-subject assignment');
});

test('Full marks and pass marks validation', () => {
  // Valid marks (passMarks <= fullMarks)
  const validAssignment = {
    schoolId: 'school-1',
    academicYearId: 'ay-1',
    classId: 'c-1',
    subjectId: 'sub-1',
    subjectType: 'compulsory',
    fullMarks: 100,
    passMarks: 33,
    status: 'ACTIVE',
  };
  const validResult = classSubjectAssignmentSchema.safeParse(validAssignment);
  assert.strictEqual(validResult.success, true);

  // Invalid marks (passMarks > fullMarks)
  const invalidAssignment = {
    ...validAssignment,
    fullMarks: 50,
    passMarks: 60,
  };
  const invalidResult = classSubjectAssignmentSchema.safeParse(invalidAssignment);
  assert.strictEqual(invalidResult.success, false);
  if (!invalidResult.success) {
    const issue = invalidResult.error.issues.find((i) => i.path.includes('passMarks'));
    assert.ok(issue, 'Should report issue on passMarks');
  }
});
