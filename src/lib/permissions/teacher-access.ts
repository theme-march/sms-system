export interface TeacherAssignmentContext {
  id?: string;
  schoolId: string;
  academicYearId?: string;
  teacherId: string;
  classId: string;
  sectionId: string;
  subjectId?: string;
  status?: string;
}

export interface UserRoleContext {
  userId: string;
  schoolId: string;
  role: string; // 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUARDIAN'
  teacherId?: string;
}

export interface AccessCheckParams {
  user: UserRoleContext;
  targetSchoolId: string;
  classId: string;
  sectionId: string;
  subjectId?: string;
  academicYearId?: string;
  assignments: TeacherAssignmentContext[];
}

/**
 * Validates whether a user can perform an action in a school domain.
 * Enforces school-scope isolation and teacher-assignment restrictions.
 */
export function canTeacherAccessResource(params: AccessCheckParams): {
  allowed: boolean;
  reason?: string;
} {
  const { user, targetSchoolId, classId, sectionId, subjectId, academicYearId, assignments } = params;

  // 1. Enforce School-Scope Isolation
  if (user.schoolId !== targetSchoolId) {
    return {
      allowed: false,
      reason: 'Cross-school access denied. School scope isolation active.',
    };
  }

  // 2. Admins and Super Admins bypass teacher-assignment restriction
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
    return { allowed: true };
  }

  // 3. For Teachers, check assigned teacher status
  if (user.role === 'TEACHER') {
    if (!user.teacherId) {
      return {
        allowed: false,
        reason: 'User is not linked to an active teacher record.',
      };
    }

    const hasAssignment = assignments.some((assignment) => {
      // Must match teacher
      if (assignment.teacherId !== user.teacherId) return false;
      // Must match school
      if (assignment.schoolId !== targetSchoolId) return false;
      // Must match class and section
      if (assignment.classId !== classId || assignment.sectionId !== sectionId) return false;
      // If subject is specified, must match subject
      if (subjectId && assignment.subjectId && assignment.subjectId !== subjectId) return false;
      // If academicYearId is specified, must match academic year
      if (academicYearId && assignment.academicYearId && assignment.academicYearId !== academicYearId) return false;
      // Status must be active if present
      if (assignment.status && assignment.status !== 'ACTIVE') return false;

      return true;
    });

    if (!hasAssignment) {
      return {
        allowed: false,
        reason: 'Access denied. Only assigned teachers may access this class/subject resource.',
      };
    }

    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'Unauthorized role.',
  };
}
