// Core Exam, Marks, GPA Calculation & Business Rule Validation Engine

export interface MarkInput {
  subjectId: string;
  isOptional?: boolean;
  fullMarks: number;
  passMarks: number;
  written?: number | null;
  mcq?: number | null;
  practical?: number | null;
  assignment?: number | null;
  attendance?: number | null;
  classTest?: number | null;
  other?: number | null;
  graceMarks?: number;
  isAbsent?: boolean;
}

export interface SubjectResultCalculated {
  subjectId: string;
  isOptional: boolean;
  fullMarks: number;
  passMarks: number;
  obtainedMarks: number;
  letterGrade: string;
  gradePoint: number;
  isPassed: boolean;
  isAbsent: boolean;
}

export interface OverallResultCalculated {
  totalMarks: number;
  totalFullMarks: number;
  average: number;
  percentage: number;
  gpa: number;
  letterGrade: string;
  failedSubjectCount: number;
  isPassed: boolean;
  subjectResults: SubjectResultCalculated[];
}

export function calculateSubjectGrade(
  obtainedMarks: number,
  fullMarks: number = 100
): { letterGrade: string; gradePoint: number } {
  const percentage = fullMarks > 0 ? (obtainedMarks / fullMarks) * 100 : 0;

  if (percentage >= 80) return { letterGrade: 'A+', gradePoint: 5.0 };
  if (percentage >= 70) return { letterGrade: 'A', gradePoint: 4.0 };
  if (percentage >= 60) return { letterGrade: 'A-', gradePoint: 3.5 };
  if (percentage >= 50) return { letterGrade: 'B', gradePoint: 3.0 };
  if (percentage >= 40) return { letterGrade: 'C', gradePoint: 2.0 };
  if (percentage >= 33) return { letterGrade: 'D', gradePoint: 1.0 };
  return { letterGrade: 'F', gradePoint: 0.0 };
}

export function calculateSubjectMark(mark: MarkInput): SubjectResultCalculated {
  if (mark.isAbsent) {
    return {
      subjectId: mark.subjectId,
      isOptional: Boolean(mark.isOptional),
      fullMarks: mark.fullMarks,
      passMarks: mark.passMarks,
      obtainedMarks: 0,
      letterGrade: 'F',
      gradePoint: 0.0,
      isPassed: false,
      isAbsent: true,
    };
  }

  const rawTotal =
    (mark.written || 0) +
    (mark.mcq || 0) +
    (mark.practical || 0) +
    (mark.assignment || 0) +
    (mark.attendance || 0) +
    (mark.classTest || 0) +
    (mark.other || 0) +
    (mark.graceMarks || 0);

  const obtainedMarks = Math.min(mark.fullMarks, Math.max(0, rawTotal));
  const isPassed = obtainedMarks >= mark.passMarks;

  const { letterGrade, gradePoint } = isPassed
    ? calculateSubjectGrade(obtainedMarks, mark.fullMarks)
    : { letterGrade: 'F', gradePoint: 0.0 };

  return {
    subjectId: mark.subjectId,
    isOptional: Boolean(mark.isOptional),
    fullMarks: mark.fullMarks,
    passMarks: mark.passMarks,
    obtainedMarks,
    letterGrade: isPassed ? letterGrade : 'F',
    gradePoint: isPassed ? gradePoint : 0.0,
    isPassed,
    isAbsent: false,
  };
}

export function calculateOverallResult(marks: MarkInput[]): OverallResultCalculated {
  const subjectResults = marks.map((m) => calculateSubjectMark(m));

  const mandatorySubjects = subjectResults.filter((s) => !s.isOptional);
  const optionalSubjects = subjectResults.filter((s) => s.isOptional);

  let totalMarks = 0;
  let totalFullMarks = 0;
  let failedSubjectCount = 0;

  for (const s of subjectResults) {
    totalMarks += s.obtainedMarks;
    totalFullMarks += s.fullMarks;
    if (!s.isOptional && (!s.isPassed || s.isAbsent)) {
      failedSubjectCount++;
    }
  }

  const isPassed = failedSubjectCount === 0;

  let gpa = 0.0;
  let letterGrade = 'F';

  if (isPassed && mandatorySubjects.length > 0) {
    let mandatoryGradePointSum = mandatorySubjects.reduce((sum, s) => sum + s.gradePoint, 0);

    // Optional subject bonus calculation (points above 2.00)
    let optionalBonus = 0;
    for (const opt of optionalSubjects) {
      if (opt.isPassed && opt.gradePoint > 2.0) {
        optionalBonus += opt.gradePoint - 2.0;
      }
    }

    const totalGradePoints = mandatoryGradePointSum + optionalBonus;
    const rawGpa = totalGradePoints / mandatorySubjects.length;
    gpa = Math.min(5.0, Math.round(rawGpa * 100) / 100);

    // Determine Overall Letter Grade from GPA
    if (gpa >= 5.0) letterGrade = 'A+';
    else if (gpa >= 4.0) letterGrade = 'A';
    else if (gpa >= 3.5) letterGrade = 'A-';
    else if (gpa >= 3.0) letterGrade = 'B';
    else if (gpa >= 2.0) letterGrade = 'C';
    else if (gpa >= 1.0) letterGrade = 'D';
    else letterGrade = 'F';
  }

  const percentage = totalFullMarks > 0 ? (totalMarks / totalFullMarks) * 100 : 0;
  const average = subjectResults.length > 0 ? totalMarks / subjectResults.length : 0;

  return {
    totalMarks: Math.round(totalMarks * 100) / 100,
    totalFullMarks,
    average: Math.round(average * 100) / 100,
    percentage: Math.round(percentage * 100) / 100,
    gpa,
    letterGrade,
    failedSubjectCount,
    isPassed,
    subjectResults,
  };
}

// Mark Locking Rules
export function validateMarkEditPermission(params: {
  isLocked: boolean;
  hasUnlockPermission: boolean;
  unlockReason?: string;
}): { allowed: boolean; error?: string } {
  if (!params.isLocked) return { allowed: true };

  if (!params.hasUnlockPermission) {
    return {
      allowed: false,
      error: 'Locked marks cannot be edited without supervisor unlock authorization.',
    };
  }

  if (!params.unlockReason || params.unlockReason.trim().length < 5) {
    return {
      allowed: false,
      error: 'A valid reason (minimum 5 characters) is required to unlock and edit marks.',
    };
  }

  return { allowed: true };
}

// Result Publication Rules
export function validateResultUnpublishRequest(params: {
  status: string;
  hasUnpublishPermission: boolean;
  reason?: string;
}): { allowed: boolean; error?: string } {
  if (params.status !== 'PUBLISHED') {
    return { allowed: false, error: 'Result is not currently published.' };
  }

  if (!params.hasUnpublishPermission) {
    return {
      allowed: false,
      error: 'You do not have authorization to unpublish examination results.',
    };
  }

  if (!params.reason || params.reason.trim().length < 5) {
    return {
      allowed: false,
      error: 'An authorized unpublish reason is required for audit logs.',
    };
  }

  return { allowed: true };
}

// Admit Card Fee Clearance Rule
export function checkAdmitCardFeeEligibility(params: {
  requireExamFeePayment: boolean;
  examFeeDueAmount: number;
}): { eligible: boolean; dueAmount: number; error?: string } {
  if (!params.requireExamFeePayment) {
    return { eligible: true, dueAmount: 0 };
  }

  if (params.examFeeDueAmount > 0) {
    return {
      eligible: false,
      dueAmount: params.examFeeDueAmount,
      error: `Admit card issue blocked. Outstanding exam fee due: BDT ৳${params.examFeeDueAmount.toFixed(
        2
      )}. Please clear invoice before generating admit card.`,
    };
  }

  return { eligible: true, dueAmount: 0 };
}
