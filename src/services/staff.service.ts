'use server';

import prisma from '@/src/lib/db/prisma';
import { createAuditLog } from '@/src/lib/audit';
import { checkDuplicateEmployeeCode, checkDuplicateTeacherAssignment } from '@/src/lib/validations/staff';
import { toClientData } from '@/src/lib/serialize';

export interface PaginationParams {
  search?: string;
  page?: number;
  pageSize?: number;
  schoolId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
export interface EmployeeFilterParams extends PaginationParams {
  departmentId?: string;
  designationId?: string;
  employmentType?: string;
}
export interface TeacherFilterParams extends PaginationParams {
  departmentId?: string;
  designationId?: string;
  employmentStatus?: string;
}
export interface TeacherAssignmentFilterParams extends PaginationParams {
  academicYearId?: string;
  teacherId?: string;
  classId?: string;
  sectionId?: string;
  subjectId?: string;
}

const pageResult = <T>(data: T[], total: number, page: number, pageSize: number) => ({
  total, page, pageSize, totalPages: Math.ceil(total / pageSize), data,
});

export async function getDepartments(params: PaginationParams = {}) {
  const { search = '', status = '', page = 1, pageSize = 10, schoolId } = params;
  const where: any = {
    ...(schoolId ? { schoolId } : {}),
    ...(status ? { status } : {}),
    ...(search ? { OR: ['nameEn', 'nameBn', 'code'].map((key) => ({ [key]: { contains: search } })) } : {}),
  };
  const [total, data] = await prisma.$transaction([
    prisma.department.count({ where }),
    prisma.department.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { code: 'asc' } }),
  ]);
  return toClientData(pageResult(data, total, page, pageSize));
}
export async function createDepartment(data: any) {
  const created = await prisma.department.create({ data });
  await createAuditLog({ action: 'CREATE', module: 'Departments', recordId: created.id, schoolId: data.schoolId, details: `Created department ${data.code}` });
  return toClientData(created);
}
export async function updateDepartment(id: string, data: any) {
  const updated = await prisma.department.update({ where: { id }, data });
  await createAuditLog({ action: 'UPDATE', module: 'Departments', recordId: id, schoolId: data.schoolId, details: `Updated department ${id}` });
  return toClientData(updated);
}
export async function deleteDepartment(id: string) {
  await prisma.department.delete({ where: { id } });
  await createAuditLog({ action: 'DELETE', module: 'Departments', recordId: id, details: `Deleted department ${id}` });
  return true;
}

export async function getDesignations(params: PaginationParams = {}) {
  const { search = '', status = '', page = 1, pageSize = 10, schoolId } = params;
  const where: any = {
    ...(schoolId ? { schoolId } : {}),
    ...(status ? { status } : {}),
    ...(search ? { OR: ['nameEn', 'nameBn', 'code'].map((key) => ({ [key]: { contains: search } })) } : {}),
  };
  const [total, data] = await prisma.$transaction([
    prisma.designation.count({ where }),
    prisma.designation.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { code: 'asc' } }),
  ]);
  return toClientData(pageResult(data, total, page, pageSize));
}
export async function createDesignation(data: any) {
  const created = await prisma.designation.create({ data });
  await createAuditLog({ action: 'CREATE', module: 'Designations', recordId: created.id, schoolId: data.schoolId, details: `Created designation ${data.code}` });
  return toClientData(created);
}
export async function updateDesignation(id: string, data: any) {
  const updated = await prisma.designation.update({ where: { id }, data });
  await createAuditLog({ action: 'UPDATE', module: 'Designations', recordId: id, schoolId: data.schoolId, details: `Updated designation ${id}` });
  return toClientData(updated);
}
export async function deleteDesignation(id: string) {
  await prisma.designation.delete({ where: { id } });
  await createAuditLog({ action: 'DELETE', module: 'Designations', recordId: id, details: `Deleted designation ${id}` });
  return true;
}

export async function getTeachers(params: TeacherFilterParams = {}) {
  const { search = '', departmentId, designationId, employmentStatus, status, page = 1, pageSize = 10, schoolId } = params;
  const where: any = {
    ...(schoolId ? { schoolId } : {}), ...(departmentId ? { departmentId } : {}),
    ...(designationId ? { designationId } : {}), ...(employmentStatus ? { employmentStatus } : {}),
    ...(status ? { status } : {}),
    ...(search ? { OR: ['nameEn', 'nameBn', 'employeeCode', 'phone', 'email'].map((key) => ({ [key]: { contains: search } })) } : {}),
  };
  const include = { department: true, designation: true, user: true, assignments: { include: { class: true, section: true, subject: true, academicYear: true } }, documents: true, employmentHistories: true };
  const [total, data] = await prisma.$transaction([
    prisma.teacher.count({ where }),
    prisma.teacher.findMany({ where, include, skip: (page - 1) * pageSize, take: pageSize, orderBy: { employeeCode: 'asc' } }),
  ]);
  return toClientData(pageResult(data, total, page, pageSize));
}
export async function getTeacherById(id: string) {
  return toClientData(await prisma.teacher.findUnique({
    where: { id },
    include: { department: true, designation: true, user: true, assignments: { include: { class: true, section: true, subject: true, academicYear: true } }, documents: true, employmentHistories: true },
  }));
}
export async function createTeacher(data: any) {
  const existing = await prisma.teacher.findMany({ where: { schoolId: data.schoolId }, select: { id: true, schoolId: true, employeeCode: true } });
  if (checkDuplicateEmployeeCode(existing, data.schoolId, data.employeeCode)) throw new Error(`Teacher with employee code "${data.employeeCode}" already exists.`);
  const created = await prisma.teacher.create({ data });
  await createAuditLog({ action: 'CREATE', module: 'Teachers', recordId: created.id, schoolId: data.schoolId, details: `Recruited teacher ${data.nameEn} (${data.employeeCode})` });
  return toClientData(created);
}
export async function updateTeacher(id: string, data: any) {
  if (data.employeeCode) {
    const existing = await prisma.teacher.findMany({ where: { schoolId: data.schoolId }, select: { id: true, schoolId: true, employeeCode: true } });
    if (checkDuplicateEmployeeCode(existing, data.schoolId, data.employeeCode, id)) throw new Error(`Teacher with employee code "${data.employeeCode}" already exists.`);
  }
  const updated = await prisma.teacher.update({ where: { id }, data });
  await createAuditLog({ action: 'UPDATE', module: 'Teachers', recordId: id, schoolId: data.schoolId, details: `Updated teacher profile ${id}` });
  return toClientData(updated);
}
export async function deleteTeacher(id: string) {
  await prisma.teacher.delete({ where: { id } });
  await createAuditLog({ action: 'DELETE', module: 'Teachers', recordId: id, details: `Deleted teacher ${id}` });
  return true;
}

export async function getEmployees(params: EmployeeFilterParams = {}) {
  const { search = '', departmentId, designationId, employmentType, status, page = 1, pageSize = 10, schoolId } = params;
  const where: any = {
    ...(schoolId ? { schoolId } : {}), ...(departmentId ? { departmentId } : {}),
    ...(designationId ? { designationId } : {}), ...(employmentType ? { employmentType } : {}),
    ...(status ? { status } : {}),
    ...(search ? { OR: ['nameEn', 'nameBn', 'employeeCode', 'phone', 'email'].map((key) => ({ [key]: { contains: search } })) } : {}),
  };
  const include = { department: true, designation: true, user: true, documents: true, employmentHistories: true };
  const [total, data] = await prisma.$transaction([
    prisma.employee.count({ where }),
    prisma.employee.findMany({ where, include, skip: (page - 1) * pageSize, take: pageSize, orderBy: { employeeCode: 'asc' } }),
  ]);
  return toClientData(pageResult(data, total, page, pageSize));
}
export async function getEmployeeById(id: string) {
  return toClientData(await prisma.employee.findUnique({ where: { id }, include: { department: true, designation: true, user: true, documents: true, employmentHistories: true } }));
}
export async function createEmployee(data: any) {
  const existing = await prisma.employee.findMany({ where: { schoolId: data.schoolId }, select: { id: true, schoolId: true, employeeCode: true } });
  if (checkDuplicateEmployeeCode(existing, data.schoolId, data.employeeCode)) throw new Error(`Employee with code "${data.employeeCode}" already exists.`);
  const created = await prisma.employee.create({ data });
  await createAuditLog({ action: 'CREATE', module: 'Employees', recordId: created.id, schoolId: data.schoolId, details: `Created employee ${data.nameEn} (${data.employeeCode})` });
  return toClientData(created);
}
export async function updateEmployee(id: string, data: any) {
  if (data.employeeCode) {
    const existing = await prisma.employee.findMany({ where: { schoolId: data.schoolId }, select: { id: true, schoolId: true, employeeCode: true } });
    if (checkDuplicateEmployeeCode(existing, data.schoolId, data.employeeCode, id)) throw new Error(`Employee with code "${data.employeeCode}" already exists.`);
  }
  const updated = await prisma.employee.update({ where: { id }, data });
  await createAuditLog({ action: 'UPDATE', module: 'Employees', recordId: id, schoolId: data.schoolId, details: `Updated employee profile ${id}` });
  return toClientData(updated);
}
export async function deleteEmployee(id: string) {
  await prisma.employee.delete({ where: { id } });
  await createAuditLog({ action: 'DELETE', module: 'Employees', recordId: id, details: `Deleted employee ${id}` });
  return true;
}

export async function addStaffDocument(target: { teacherId?: string; employeeId?: string }, data: { title: string; documentType: string; fileUrl: string }) {
  if (!target.teacherId && !target.employeeId) throw new Error('Teacher or employee is required.');
  const created = await prisma.employeeDocument.create({ data: { ...target, ...data } });
  await createAuditLog({ action: 'CREATE', module: 'Staff Documents', recordId: created.id, details: `Added ${data.documentType}` });
  return toClientData(created);
}

export async function addEmploymentHistory(target: { teacherId?: string; employeeId?: string }, data: { companyName: string; designation: string; startDate: string; endDate?: string; responsibilities?: string }) {
  if (!target.teacherId && !target.employeeId) throw new Error('Teacher or employee is required.');
  const created = await prisma.employmentHistory.create({ data: { ...target, companyName: data.companyName, designation: data.designation, startDate: new Date(data.startDate), endDate: data.endDate ? new Date(data.endDate) : null, responsibilities: data.responsibilities } });
  await createAuditLog({ action: 'CREATE', module: 'Employment History', recordId: created.id, details: `Added employment history for ${data.companyName}` });
  return toClientData(created);
}

export async function getTeacherAssignments(params: TeacherAssignmentFilterParams = {}) {
  const { academicYearId, teacherId, classId, sectionId, subjectId, status, page = 1, pageSize = 10, schoolId } = params;
  const where: any = {
    ...(schoolId ? { schoolId } : {}), ...(academicYearId ? { academicYearId } : {}),
    ...(teacherId ? { teacherId } : {}), ...(classId ? { classId } : {}),
    ...(sectionId ? { sectionId } : {}), ...(subjectId ? { subjectId } : {}), ...(status ? { status } : {}),
  };
  const include = { academicYear: true, teacher: true, class: true, section: true, group: true, subject: true };
  const [total, data] = await prisma.$transaction([
    prisma.teacherAssignment.count({ where }),
    prisma.teacherAssignment.findMany({ where, include, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
  ]);
  return toClientData(pageResult(data, total, page, pageSize));
}
export async function createTeacherAssignment(data: any) {
  const existing = await prisma.teacherAssignment.findMany({ where: { schoolId: data.schoolId } });
  if (checkDuplicateTeacherAssignment(existing, data)) throw new Error('This teacher is already assigned to this class, section, and subject in this academic year.');
  const created = await prisma.teacherAssignment.create({ data });
  await createAuditLog({ action: 'CREATE', module: 'Teacher Assignments', recordId: created.id, schoolId: data.schoolId, details: `Assigned teacher ${data.teacherId} to class ${data.classId}` });
  return toClientData(created);
}
export async function deleteTeacherAssignment(id: string) {
  await prisma.teacherAssignment.delete({ where: { id } });
  await createAuditLog({ action: 'DELETE', module: 'Teacher Assignments', recordId: id, details: `Removed assignment ${id}` });
  return true;
}
export async function getTeacherWorkload(teacherId: string, schoolId?: string) {
  const assignments = await getTeacherAssignments({ teacherId, schoolId, pageSize: 100 });
  const assignedClasses = Array.from(new Set(assignments.data.map((a) => a.class.name)));
  const assignedSections = Array.from(new Set(assignments.data.map((a) => `${a.class.name} - ${a.section.name}`)));
  const assignedSubjects = Array.from(new Set(assignments.data.map((a) => a.subject.nameEn)));
  return toClientData({
    teacherId,
    totalClassesPerWeek: assignments.data.length * 5,
    assignedClassesCount: assignedClasses.length,
    assignedSectionsCount: assignedSections.length,
    assignedSubjectsCount: assignedSubjects.length,
    assignedClasses,
    assignedSections,
    assignedSubjects,
    classTeacherFor: assignments.data.filter((a) => a.isClassTeacher).map((a) => `${a.class.name} (${a.section.name})`),
    assignments: assignments.data,
  });
}
