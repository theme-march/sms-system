import test from 'node:test';
import assert from 'node:assert';
import {
  calculateSubjectGrade,
  calculateSubjectMark,
  calculateOverallResult,
  validateMarkEditPermission,
  validateResultUnpublishRequest,
  checkAdmitCardFeeEligibility,
  MarkInput,
} from '../src/lib/exam-calculations';

test('1. Grade calculation - correct letter grade and grade point mapping', () => {
  assert.deepStrictEqual(calculateSubjectGrade(85, 100), { letterGrade: 'A+', gradePoint: 5.0 });
  assert.deepStrictEqual(calculateSubjectGrade(72, 100), { letterGrade: 'A', gradePoint: 4.0 });
  assert.deepStrictEqual(calculateSubjectGrade(65, 100), { letterGrade: 'A-', gradePoint: 3.5 });
  assert.deepStrictEqual(calculateSubjectGrade(55, 100), { letterGrade: 'B', gradePoint: 3.0 });
  assert.deepStrictEqual(calculateSubjectGrade(45, 100), { letterGrade: 'C', gradePoint: 2.0 });
  assert.deepStrictEqual(calculateSubjectGrade(35, 100), { letterGrade: 'D', gradePoint: 1.0 });
  assert.deepStrictEqual(calculateSubjectGrade(30, 100), { letterGrade: 'F', gradePoint: 0.0 });
});

test('2. GPA calculation - all passed student with optional subject bonus', () => {
  const marks: MarkInput[] = [
    { subjectId: 'bangla', fullMarks: 100, passMarks: 33, written: 40, mcq: 35, isOptional: false }, // 75 -> A (4.0)
    { subjectId: 'english', fullMarks: 100, passMarks: 33, written: 50, mcq: 30, isOptional: false }, // 80 -> A+ (5.0)
    { subjectId: 'math', fullMarks: 100, passMarks: 33, written: 55, mcq: 30, isOptional: false }, // 85 -> A+ (5.0)
    { subjectId: 'higher_math', fullMarks: 100, passMarks: 33, written: 55, mcq: 30, isOptional: true }, // 85 -> A+ (5.0, bonus = 3.0)
  ];

  const result = calculateOverallResult(marks);

  assert.strictEqual(result.isPassed, true);
  assert.strictEqual(result.failedSubjectCount, 0);
  assert.strictEqual(result.totalMarks, 325);
  // (4.0 + 5.0 + 5.0 + bonus 3.0) / 3 mandatory = 17 / 3 = 5.666 Capped at 5.00
  assert.strictEqual(result.gpa, 5.0);
  assert.strictEqual(result.letterGrade, 'A+');
});

test('3. Absent student logic - subject marked as absent yields 0 marks and F grade', () => {
  const markInput: MarkInput = {
    subjectId: 'physics',
    fullMarks: 100,
    passMarks: 33,
    written: 50,
    isAbsent: true,
  };

  const calculated = calculateSubjectMark(markInput);

  assert.strictEqual(calculated.isAbsent, true);
  assert.strictEqual(calculated.obtainedMarks, 0);
  assert.strictEqual(calculated.letterGrade, 'F');
  assert.strictEqual(calculated.gradePoint, 0.0);
  assert.strictEqual(calculated.isPassed, false);
});

test('4. Failed subject count - mandatory subject fail yields overall fail and GPA 0.0', () => {
  const marks: MarkInput[] = [
    { subjectId: 'bangla', fullMarks: 100, passMarks: 33, written: 40, mcq: 35, isOptional: false }, // 75 -> Passed
    { subjectId: 'english', fullMarks: 100, passMarks: 33, written: 10, mcq: 10, isOptional: false }, // 20 -> Failed
    { subjectId: 'math', fullMarks: 100, passMarks: 33, written: 50, mcq: 30, isOptional: false }, // 80 -> Passed
  ];

  const result = calculateOverallResult(marks);

  assert.strictEqual(result.isPassed, false);
  assert.strictEqual(result.failedSubjectCount, 1);
  assert.strictEqual(result.gpa, 0.0);
  assert.strictEqual(result.letterGrade, 'F');
});

test('5. Mark locking rule - locked marks require unlock permission and valid reason', () => {
  // Try edit locked mark without permission
  const check1 = validateMarkEditPermission({
    isLocked: true,
    hasUnlockPermission: false,
  });
  assert.strictEqual(check1.allowed, false);
  assert.ok(check1.error?.includes('unlock authorization'));

  // Try edit locked mark with permission but missing reason
  const check2 = validateMarkEditPermission({
    isLocked: true,
    hasUnlockPermission: true,
    unlockReason: '',
  });
  assert.strictEqual(check2.allowed, false);
  assert.ok(check2.error?.includes('valid reason'));

  // Valid edit locked mark
  const check3 = validateMarkEditPermission({
    isLocked: true,
    hasUnlockPermission: true,
    unlockReason: 'Re-evaluating MCQ bubble sheet error',
  });
  assert.strictEqual(check3.allowed, true);
});

test('6. Result publication rule - unpublishing requires permission and reason', () => {
  const unpublishCheck = validateResultUnpublishRequest({
    status: 'PUBLISHED',
    hasUnpublishPermission: true,
    reason: 'Correcting grade calculation error in Science section B',
  });
  assert.strictEqual(unpublishCheck.allowed, true);

  const unauthorizedCheck = validateResultUnpublishRequest({
    status: 'PUBLISHED',
    hasUnpublishPermission: false,
    reason: 'Correction',
  });
  assert.strictEqual(unauthorizedCheck.allowed, false);
});

test('7. Admit card fee restriction rule - blocks generation if exam fee due', () => {
  // Fee setting active, student has 1500 BDT due
  const blocked = checkAdmitCardFeeEligibility({
    requireExamFeePayment: true,
    examFeeDueAmount: 1500,
  });
  assert.strictEqual(blocked.eligible, false);
  assert.strictEqual(blocked.dueAmount, 1500);
  assert.ok(blocked.error?.includes('1500.00'));

  // Fee setting active, student cleared fee
  const cleared = checkAdmitCardFeeEligibility({
    requireExamFeePayment: true,
    examFeeDueAmount: 0,
  });
  assert.strictEqual(cleared.eligible, true);
  assert.strictEqual(cleared.dueAmount, 0);
});
