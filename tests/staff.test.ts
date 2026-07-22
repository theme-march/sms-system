import test from 'node:test';
import assert from 'node:assert';
import {
  checkDuplicateEmployeeCode,
  checkDuplicateTeacherAssignment,
} from '../src/lib/validations/staff';
import { canTeacherAccessResource } from '../src/lib/permissions/teacher-access';

test('checkDuplicateEmployeeCode detects duplicate employee code in same school', () => {
  const existingTeachers = [
    { id: 'tch-1', schoolId: 'sch-101', employeeCode: 'EMP-T-001' },
    { id: 'tch-2', schoolId: 'sch-101', employeeCode: 'EMP-T-002' },
  ];

  // Exact match
  assert.strictEqual(
    checkDuplicateEmployeeCode(existingTeachers, 'sch-101', 'EMP-T-001'),
    true
  );

  // Case insensitive match
  assert.strictEqual(
    checkDuplicateEmployeeCode(existingTeachers, 'sch-101', 'emp-t-002'),
    true
  );

  // Different code
  assert.strictEqual(
    checkDuplicateEmployeeCode(existingTeachers, 'sch-101', 'EMP-T-003'),
    false
  );

  // Different school
  assert.strictEqual(
    checkDuplicateEmployeeCode(existingTeachers, 'sch-102', 'EMP-T-001'),
    false
  );

  // Same record during update (should ignore self)
  assert.strictEqual(
    checkDuplicateEmployeeCode(existingTeachers, 'sch-101', 'EMP-T-001', 'tch-1'),
    false
  );
});

test('checkDuplicateTeacherAssignment detects duplicate class-subject slot allocation', () => {
  const existingAssignments = [
    {
      id: 'asgn-1',
      schoolId: 'sch-101',
      academicYearId: 'ay-2026',
      classId: 'c-10',
      sectionId: 's-padma',
      subjectId: 'sub-phys',
      teacherId: 'tch-101',
    },
  ];

  // Duplicate assignment target
  const targetDuplicate = {
    schoolId: 'sch-101',
    academicYearId: 'ay-2026',
    classId: 'c-10',
    sectionId: 's-padma',
    subjectId: 'sub-phys',
    teacherId: 'tch-101',
  };

  assert.strictEqual(
    checkDuplicateTeacherAssignment(existingAssignments, targetDuplicate),
    true
  );

  // Different subject
  const targetDifferentSubject = {
    ...targetDuplicate,
    subjectId: 'sub-chem',
  };

  assert.strictEqual(
    checkDuplicateTeacherAssignment(existingAssignments, targetDifferentSubject),
    false
  );
});

test('canTeacherAccessResource enforces school-scope isolation', () => {
  const user = {
    userId: 'usr-tch-1',
    schoolId: 'sch-101',
    role: 'TEACHER',
    teacherId: 'tch-101',
  };

  const result = canTeacherAccessResource({
    user,
    targetSchoolId: 'sch-999', // Different school
    classId: 'c-10',
    sectionId: 's-padma',
    subjectId: 'sub-phys',
    assignments: [],
  });

  assert.strictEqual(result.allowed, false);
  assert.match(result.reason || '', /Cross-school access denied/);
});

test('canTeacherAccessResource restricts access for unassigned teachers', () => {
  const user = {
    userId: 'usr-tch-1',
    schoolId: 'sch-101',
    role: 'TEACHER',
    teacherId: 'tch-101',
  };

  const assignments = [
    {
      schoolId: 'sch-101',
      teacherId: 'tch-101',
      classId: 'c-10',
      sectionId: 's-padma',
      subjectId: 'sub-phys',
      status: 'ACTIVE',
    },
  ];

  // Allowed for assigned class/section/subject
  const allowedCheck = canTeacherAccessResource({
    user,
    targetSchoolId: 'sch-101',
    classId: 'c-10',
    sectionId: 's-padma',
    subjectId: 'sub-phys',
    assignments,
  });
  assert.strictEqual(allowedCheck.allowed, true);

  // Restricted for unassigned class/section
  const restrictedCheck = canTeacherAccessResource({
    user,
    targetSchoolId: 'sch-101',
    classId: 'c-9', // Unassigned class
    sectionId: 's-padma',
    subjectId: 'sub-phys',
    assignments,
  });
  assert.strictEqual(restrictedCheck.allowed, false);
  assert.match(restrictedCheck.reason || '', /Only assigned teachers may access/);
});

test('canTeacherAccessResource grants unrestricted access to Admins and Super Admins', () => {
  const adminUser = {
    userId: 'usr-admin-1',
    schoolId: 'sch-101',
    role: 'ADMIN',
  };

  const result = canTeacherAccessResource({
    user: adminUser,
    targetSchoolId: 'sch-101',
    classId: 'c-[any]',
    sectionId: 's-[any]',
    assignments: [],
  });

  assert.strictEqual(result.allowed, true);
});
