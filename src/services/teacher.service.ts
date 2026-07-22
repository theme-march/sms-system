import { getTeachers as getTeachersStaff, getTeacherById as getTeacherByIdStaff } from './staff.service';

export async function getTeachers(params: any = {}) {
  const result = await getTeachersStaff(params);
  // Map employeeCode -> employeeId for backward compatibility
  const mappedData = result.data.map((t: any) => ({
    ...t,
    employeeId: t.employeeCode || t.employeeId || 'EMP-T-000',
    designation: t.designation?.nameEn || t.designation || 'Faculty Member',
    user: t.user || {
      name: t.nameEn,
      email: t.email || '',
      phone: t.phone || '',
      status: t.status || 'ACTIVE',
    },
  }));
  return mappedData;
}

export async function getTeacherById(id: string) {
  const teacher = await getTeacherByIdStaff(id);
  if (!teacher) return null;
  const t = teacher as any;
  return {
    ...t,
    employeeId: t.employeeCode || t.employeeId || 'EMP-T-000',
    designation: t.designation?.nameEn || t.designation || 'Faculty Member',
    user: t.user || {
      name: t.nameEn,
      email: t.email || '',
      phone: t.phone || '',
      status: t.status || 'ACTIVE',
    },
  };
}
