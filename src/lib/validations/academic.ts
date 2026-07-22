import { z } from 'zod';

export const statusEnum = z.enum(['ACTIVE', 'INACTIVE']);

// 1. Academic Year Schema
export const academicYearSchema = z
  .object({
    id: z.string().optional(),
    schoolId: z.string().min(1, 'School ID is required'),
    name: z.string().min(1, 'Academic year name is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    isCurrent: z.boolean().default(false),
    status: statusEnum.default('ACTIVE'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate).getTime();
      const end = new Date(data.endDate).getTime();
      return !isNaN(start) && !isNaN(end) && end > start;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

// 2. Academic Session Schema
export const academicSessionSchema = z
  .object({
    id: z.string().optional(),
    schoolId: z.string().min(1, 'School ID is required'),
    academicYearId: z.string().min(1, 'Academic year is required'),
    name: z.string().min(1, 'Session name is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    status: statusEnum.default('ACTIVE'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate).getTime();
      const end = new Date(data.endDate).getTime();
      return !isNaN(start) && !isNaN(end) && end > start;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

// 3. Class Schema
export const classSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  name: z.string().min(1, 'Class name is required'),
  code: z.string().min(1, 'Class code is required'),
  numericLevel: z.coerce.number().int().min(0, 'Numeric level must be 0 or greater'),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: statusEnum.default('ACTIVE'),
});

// 4. Section Schema
export const sectionSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().optional(),
  classId: z.string().optional(),
  name: z.string().min(1, 'Section name is required'),
  code: z.string().min(1, 'Section code is required'),
  displayOrder: z.coerce.number().int().min(0).default(0),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1').default(40),
  status: statusEnum.default('ACTIVE'),
});

// 5. Group Schema
export const groupSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  name: z.string().min(1, 'Group name is required'),
  description: z.string().optional().nullable(),
  status: statusEnum.default('ACTIVE'),
});

// 6. Subject Schema
export const subjectTypeEnum = z.enum(['compulsory', 'optional', 'additional', 'practical']);

export const subjectSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameBn: z.string().optional().nullable(),
  code: z.string().min(1, 'Subject code is required'),
  subjectType: subjectTypeEnum.default('compulsory'),
  description: z.string().optional().nullable(),
  status: statusEnum.default('ACTIVE'),
});

// 7. Class Section Assignment Schema
export const classSectionAssignmentSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
  classId: z.string().min(1, 'Class is required'),
  sectionId: z.string().min(1, 'Section is required'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1').default(40),
  status: statusEnum.default('ACTIVE'),
});

// 8. Class Group Assignment Schema
export const classGroupAssignmentSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
  classId: z.string().min(1, 'Class is required'),
  groupId: z.string().min(1, 'Group is required'),
  status: statusEnum.default('ACTIVE'),
});

// 9. Class Subject Assignment Schema
export const classSubjectAssignmentSchema = z
  .object({
    id: z.string().optional(),
    schoolId: z.string().min(1, 'School ID is required'),
    academicYearId: z.string().optional().nullable(),
    classId: z.string().min(1, 'Class is required'),
    groupId: z.string().optional().nullable(),
    subjectId: z.string().min(1, 'Subject is required'),
    subjectType: subjectTypeEnum.default('compulsory'),
    fullMarks: z.coerce.number().int().min(1, 'Full marks must be at least 1').default(100),
    passMarks: z.coerce.number().int().min(0, 'Pass marks cannot be negative').default(33),
    status: statusEnum.default('ACTIVE'),
    teacherId: z.string().optional().nullable(),
  })
  .refine((data) => data.passMarks <= data.fullMarks, {
    message: 'Pass marks cannot exceed full marks',
    path: ['passMarks'],
  });

// 10. Room Schema
export const roomSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  name: z.string().min(1, 'Room name is required'),
  code: z.string().min(1, 'Room code is required'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1').default(40),
  location: z.string().optional().nullable(),
  status: statusEnum.default('ACTIVE'),
});

// 11. Period Schema
export const periodSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  name: z.string().min(1, 'Period name is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isBreak: z.boolean().default(false),
  status: statusEnum.default('ACTIVE'),
});

// 12. Holiday Schema
export const holidaySchema = z
  .object({
    id: z.string().optional(),
    schoolId: z.string().min(1, 'School ID is required'),
    academicYearId: z.string().optional().nullable(),
    name: z.string().min(1, 'Holiday name is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    description: z.string().optional().nullable(),
    status: statusEnum.default('ACTIVE'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate).getTime();
      const end = new Date(data.endDate).getTime();
      return !isNaN(start) && !isNaN(end) && end >= start;
    },
    {
      message: 'End date must be on or after start date',
      path: ['endDate'],
    }
  );

// Aliases for component consistency
export const classSectionSchema = classSectionAssignmentSchema;
export const classGroupSchema = classGroupAssignmentSchema;
export const classSubjectSchema = classSubjectAssignmentSchema;

export function validateSingleCurrentYear<
  T extends { id: string; isCurrent: boolean; status: string }
>(years: T[], targetId: string, setAsCurrent: boolean): T[] {
  if (!setAsCurrent) {
    return years.map((y) => (y.id === targetId ? { ...y, isCurrent: false } : y));
  }
  return years.map((y) => ({
    ...y,
    isCurrent: y.id === targetId,
  }));
}
