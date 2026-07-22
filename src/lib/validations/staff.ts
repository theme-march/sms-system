import { z } from 'zod';

export const statusEnum = z.enum(['ACTIVE', 'INACTIVE']);
export const genderEnum = z.enum(['MALE', 'FEMALE', 'OTHER']);

// 1. Department Schema
export const departmentSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameBn: z.string().optional(),
  code: z.string().min(1, 'Department code is required'),
  status: statusEnum.default('ACTIVE'),
});

// 2. Designation Schema
export const designationSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameBn: z.string().optional(),
  code: z.string().min(1, 'Designation code is required'),
  status: statusEnum.default('ACTIVE'),
});

// 3. Teacher Schema
export const teacherSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  userId: z.string().optional().nullable(),
  employeeCode: z.string().min(1, 'Employee code is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameBn: z.string().optional().nullable(),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  gender: genderEnum.default('MALE'),
  dateOfBirth: z.string().optional().nullable(),
  joiningDate: z.string().min(1, 'Joining date is required'),
  qualification: z.string().optional().nullable(),
  specialization: z.string().optional().nullable(),
  profilePhoto: z.string().optional().nullable(),
  departmentId: z.string().optional().nullable(),
  designationId: z.string().optional().nullable(),
  employmentStatus: z.enum(['PERMANENT', 'PROBATION', 'CONTRACTUAL', 'PART_TIME', 'RESIGNED', 'TERMINATED']).default('PERMANENT'),
  status: statusEnum.default('ACTIVE'),
  salary: z.coerce.number().min(0).default(0),
});

// 4. Employee Schema
export const employeeSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  userId: z.string().optional().nullable(),
  employeeCode: z.string().min(1, 'Employee code is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameBn: z.string().optional().nullable(),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  departmentId: z.string().optional().nullable(),
  designationId: z.string().optional().nullable(),
  joiningDate: z.string().min(1, 'Joining date is required'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT']).default('FULL_TIME'),
  status: statusEnum.default('ACTIVE'),
});

// 5. Teacher Assignment Schema
export const teacherAssignmentSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
  sessionId: z.string().optional().nullable(),
  teacherId: z.string().min(1, 'Teacher is required'),
  classId: z.string().min(1, 'Class is required'),
  sectionId: z.string().min(1, 'Section is required'),
  groupId: z.string().optional().nullable(),
  subjectId: z.string().min(1, 'Subject is required'),
  isClassTeacher: z.boolean().default(false),
  status: statusEnum.default('ACTIVE'),
});

// 6. Employee Document Schema
export const employeeDocumentSchema = z.object({
  id: z.string().optional(),
  teacherId: z.string().optional().nullable(),
  employeeId: z.string().optional().nullable(),
  documentType: z.string().min(1, 'Document type is required'),
  title: z.string().min(1, 'Title is required'),
  fileUrl: z.string().min(1, 'File URL is required'),
  fileSize: z.number().optional().nullable(),
});

// 7. Employment History Schema
export const employmentHistorySchema = z.object({
  id: z.string().optional(),
  teacherId: z.string().optional().nullable(),
  employeeId: z.string().optional().nullable(),
  companyName: z.string().min(1, 'Institution / Company name is required'),
  designation: z.string().min(1, 'Designation is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  responsibilities: z.string().optional().nullable(),
});

// Duplicate Check Helpers
export function checkDuplicateEmployeeCode(
  existingRecords: Array<{ id?: string; schoolId: string; employeeCode: string }>,
  targetSchoolId: string,
  targetEmployeeCode: string,
  currentRecordId?: string
): boolean {
  return existingRecords.some(
    (record) =>
      record.schoolId === targetSchoolId &&
      record.employeeCode.trim().toLowerCase() === targetEmployeeCode.trim().toLowerCase() &&
      (!currentRecordId || record.id !== currentRecordId)
  );
}

export function checkDuplicateTeacherAssignment(
  existingAssignments: Array<{
    id?: string;
    schoolId: string;
    academicYearId: string;
    classId: string;
    sectionId: string;
    subjectId: string;
    teacherId: string;
  }>,
  target: {
    id?: string;
    schoolId: string;
    academicYearId: string;
    classId: string;
    sectionId: string;
    subjectId: string;
    teacherId: string;
  }
): boolean {
  return existingAssignments.some(
    (assignment) =>
      assignment.schoolId === target.schoolId &&
      assignment.academicYearId === target.academicYearId &&
      assignment.classId === target.classId &&
      assignment.sectionId === target.sectionId &&
      assignment.subjectId === target.subjectId &&
      assignment.teacherId === target.teacherId &&
      (!target.id || assignment.id !== target.id)
  );
}
