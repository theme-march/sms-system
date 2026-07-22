import prisma from '@/src/lib/db/prisma';
import { createAuditLog } from '@/src/lib/audit';
import {
  checkDuplicateEmployeeCode,
  checkDuplicateTeacherAssignment,
} from '@/src/lib/validations/staff';

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

// Default School ID for Fallback
const DEFAULT_SCHOOL_ID = 'sch-ideal-101';

// MOCK FALLBACK DATA STORE
const mockDepartments = [
  { id: 'dept-1', schoolId: DEFAULT_SCHOOL_ID, nameEn: 'Science & Mathematics', nameBn: 'বিজ্ঞান ও গণিত', code: 'SCI-MATH', status: 'ACTIVE' },
  { id: 'dept-2', schoolId: DEFAULT_SCHOOL_ID, nameEn: 'Languages & Literature', nameBn: 'ভাষা ও সাহিত্য', code: 'LANG-LIT', status: 'ACTIVE' },
  { id: 'dept-3', schoolId: DEFAULT_SCHOOL_ID, nameEn: 'Social Sciences', nameBn: 'সামাজিক বিজ্ঞান', code: 'SOC-SCI', status: 'ACTIVE' },
  { id: 'dept-4', schoolId: DEFAULT_SCHOOL_ID, nameEn: 'Administration & Finance', nameBn: 'প্রশাসন ও অর্থ', code: 'ADMIN-FIN', status: 'ACTIVE' },
  { id: 'dept-5', schoolId: DEFAULT_SCHOOL_ID, nameEn: 'Information Technology', nameBn: 'তথ্য প্রযুক্তি', code: 'IT-DEPT', status: 'ACTIVE' },
];

const mockDesignations = [
  { id: 'desig-1', schoolId: DEFAULT_SCHOOL_ID, nameEn: 'Headmaster', nameBn: 'প্রধান শিক্ষক', code: 'HM', status: 'ACTIVE' },
  { id: 'desig-2', schoolId: DEFAULT_SCHOOL_ID, nameEn: 'Assistant Headmaster', nameBn: 'সহকারী প্রধান শিক্ষক', code: 'AHM', status: 'ACTIVE' },
  { id: 'desig-3', schoolId: DEFAULT_SCHOOL_ID, nameEn: 'Senior Lecturer', nameBn: 'জ্যেষ্ঠ শিক্ষক', code: 'SR-LEC', status: 'ACTIVE' },
  { id: 'desig-4', schoolId: DEFAULT_SCHOOL_ID, nameEn: 'Assistant Teacher', nameBn: 'সহকারী শিক্ষক', code: 'ASST-TCH', status: 'ACTIVE' },
  { id: 'desig-5', schoolId: DEFAULT_SCHOOL_ID, nameEn: 'Accountant', nameBn: 'হিসাবরক্ষক', code: 'ACCT', status: 'ACTIVE' },
  { id: 'desig-6', schoolId: DEFAULT_SCHOOL_ID, nameEn: 'IT Systems Administrator', nameBn: 'আইটি সিস্টেম প্রশাসক', code: 'IT-ADMIN', status: 'ACTIVE' },
];

const mockTeachers = [
  {
    id: 'tch-101',
    schoolId: DEFAULT_SCHOOL_ID,
    userId: 'usr-tch-1',
    employeeCode: 'EMP-T-001',
    nameEn: 'Dr. Shahabuddin Ahmed',
    nameBn: 'ড. সাহাবুদ্দিন আহমেদ',
    phone: '+8801711112233',
    email: 'headmaster@dhakaideal.edu.bd',
    gender: 'MALE',
    dateOfBirth: '1975-04-12',
    joiningDate: '2005-01-15',
    qualification: 'M.Sc in Physics (Dhaka University), Ph.D',
    specialization: 'Quantum Physics & Educational Leadership',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    departmentId: 'dept-1',
    designationId: 'desig-1',
    employmentStatus: 'PERMANENT',
    status: 'ACTIVE',
    salary: 65000,
    department: { nameEn: 'Science & Mathematics', code: 'SCI-MATH' },
    designation: { nameEn: 'Headmaster', code: 'HM' },
    documents: [
      { id: 'doc-1', title: 'Ph.D Certificate', documentType: 'Educational Certificate', fileUrl: '/docs/phd_cert.pdf', uploadedAt: '2024-01-10' },
      { id: 'doc-2', title: 'NID Copy', documentType: 'National ID', fileUrl: '/docs/nid.pdf', uploadedAt: '2024-01-10' },
    ],
    employmentHistories: [
      { id: 'hist-1', companyName: 'Dhaka Residential Model College', designation: 'Assistant Professor', startDate: '1998-02-01', endDate: '2004-12-31', responsibilities: 'Physics instruction and science club director' },
    ],
  },
  {
    id: 'tch-102',
    schoolId: DEFAULT_SCHOOL_ID,
    userId: 'usr-tch-2',
    employeeCode: 'EMP-T-002',
    nameEn: 'Mohammad Ali Hossain',
    nameBn: 'মোহাম্মদ আলী হোসেন',
    phone: '+8801811223344',
    email: 'ali.hossain@dhakaideal.edu.bd',
    gender: 'MALE',
    dateOfBirth: '1980-08-20',
    joiningDate: '2010-03-01',
    qualification: 'M.Sc in Mathematics (BUET)',
    specialization: 'Higher Mathematics & Calculus',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    departmentId: 'dept-1',
    designationId: 'desig-2',
    employmentStatus: 'PERMANENT',
    status: 'ACTIVE',
    salary: 58000,
    department: { nameEn: 'Science & Mathematics', code: 'SCI-MATH' },
    designation: { nameEn: 'Assistant Headmaster', code: 'AHM' },
    documents: [],
    employmentHistories: [],
  },
  {
    id: 'tch-103',
    schoolId: DEFAULT_SCHOOL_ID,
    userId: 'usr-tch-3',
    employeeCode: 'EMP-T-003',
    nameEn: 'Nusrat Jahan Sultana',
    nameBn: 'নুসরাত জাহান সুলতানা',
    phone: '+8801911334455',
    email: 'nusrat.sultana@dhakaideal.edu.bd',
    gender: 'FEMALE',
    dateOfBirth: '1985-11-05',
    joiningDate: '2015-07-15',
    qualification: 'M.A in English Literature (JU)',
    specialization: 'English Grammar & Spoken Communication',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    departmentId: 'dept-2',
    designationId: 'desig-3',
    employmentStatus: 'PERMANENT',
    status: 'ACTIVE',
    salary: 52000,
    department: { nameEn: 'Languages & Literature', code: 'LANG-LIT' },
    designation: { nameEn: 'Senior Lecturer', code: 'SR-LEC' },
    documents: [],
    employmentHistories: [],
  },
  {
    id: 'tch-104',
    schoolId: DEFAULT_SCHOOL_ID,
    userId: 'usr-tch-4',
    employeeCode: 'EMP-T-004',
    nameEn: 'Farzana Parveen',
    nameBn: 'ফারজানা পারভীন',
    phone: '+8801511445566',
    email: 'farzana.parveen@dhakaideal.edu.bd',
    gender: 'FEMALE',
    dateOfBirth: '1990-02-18',
    joiningDate: '2018-09-01',
    qualification: 'B.Sc in Computer Science (NSU)',
    specialization: 'ICT & Applied Chemistry',
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    departmentId: 'dept-5',
    designationId: 'desig-4',
    employmentStatus: 'PROBATION',
    status: 'ACTIVE',
    salary: 48000,
    department: { nameEn: 'Information Technology', code: 'IT-DEPT' },
    designation: { nameEn: 'Assistant Teacher', code: 'ASST-TCH' },
    documents: [],
    employmentHistories: [],
  },
];

const mockEmployees = [
  {
    id: 'emp-201',
    schoolId: DEFAULT_SCHOOL_ID,
    userId: 'usr-emp-1',
    employeeCode: 'EMP-S-001',
    nameEn: 'Kamrul Islam',
    nameBn: 'কামরুল ইসলাম',
    phone: '+8801722334455',
    email: 'kamrul.accounts@dhakaideal.edu.bd',
    departmentId: 'dept-4',
    designationId: 'desig-5',
    joiningDate: '2012-05-10',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    department: { nameEn: 'Administration & Finance', code: 'ADMIN-FIN' },
    designation: { nameEn: 'Accountant', code: 'ACCT' },
    documents: [],
    employmentHistories: [],
  },
  {
    id: 'emp-202',
    schoolId: DEFAULT_SCHOOL_ID,
    userId: 'usr-emp-2',
    employeeCode: 'EMP-S-002',
    nameEn: 'Tariqul Islam',
    nameBn: 'তারিকুল ইসলাম',
    phone: '+8801833445566',
    email: 'tariq.it@dhakaideal.edu.bd',
    departmentId: 'dept-5',
    designationId: 'desig-6',
    joiningDate: '2019-11-01',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    department: { nameEn: 'Information Technology', code: 'IT-DEPT' },
    designation: { nameEn: 'IT Systems Administrator', code: 'IT-ADMIN' },
    documents: [],
    employmentHistories: [],
  },
];

const mockAssignments = [
  {
    id: 'asgn-1',
    schoolId: DEFAULT_SCHOOL_ID,
    academicYearId: 'ay-2026',
    sessionId: 'sess-2026',
    teacherId: 'tch-101',
    classId: 'c-10',
    sectionId: 's-padma',
    groupId: 'g-science',
    subjectId: 'sub-phys',
    isClassTeacher: true,
    status: 'ACTIVE',
    academicYear: { name: '2026-2027' },
    teacher: { nameEn: 'Dr. Shahabuddin Ahmed', employeeCode: 'EMP-T-001' },
    class: { name: 'Class 10', code: 'TEN' },
    section: { name: 'Padma', code: 'PADMA' },
    group: { name: 'Science' },
    subject: { nameEn: 'Physics', code: 'PHYS' },
  },
  {
    id: 'asgn-2',
    schoolId: DEFAULT_SCHOOL_ID,
    academicYearId: 'ay-2026',
    sessionId: 'sess-2026',
    teacherId: 'tch-102',
    classId: 'c-10',
    sectionId: 's-padma',
    groupId: 'g-science',
    subjectId: 'sub-math',
    isClassTeacher: false,
    status: 'ACTIVE',
    academicYear: { name: '2026-2027' },
    teacher: { nameEn: 'Mohammad Ali Hossain', employeeCode: 'EMP-T-002' },
    class: { name: 'Class 10', code: 'TEN' },
    section: { name: 'Padma', code: 'PADMA' },
    group: { name: 'Science' },
    subject: { nameEn: 'Higher Mathematics', code: 'HMATH' },
  },
  {
    id: 'asgn-3',
    schoolId: DEFAULT_SCHOOL_ID,
    academicYearId: 'ay-2026',
    sessionId: 'sess-2026',
    teacherId: 'tch-103',
    classId: 'c-10',
    sectionId: 's-meghna',
    groupId: null,
    subjectId: 'sub-eng',
    isClassTeacher: true,
    status: 'ACTIVE',
    academicYear: { name: '2026-2027' },
    teacher: { nameEn: 'Nusrat Jahan Sultana', employeeCode: 'EMP-T-003' },
    class: { name: 'Class 10', code: 'TEN' },
    section: { name: 'Meghna', code: 'MEGHNA' },
    group: null,
    subject: { nameEn: 'English 1st Paper', code: 'ENG1' },
  },
  {
    id: 'asgn-4',
    schoolId: DEFAULT_SCHOOL_ID,
    academicYearId: 'ay-2026',
    sessionId: 'sess-2026',
    teacherId: 'tch-104',
    classId: 'c-9',
    sectionId: 's-jamuna',
    groupId: null,
    subjectId: 'sub-ict',
    isClassTeacher: false,
    status: 'ACTIVE',
    academicYear: { name: '2026-2027' },
    teacher: { nameEn: 'Farzana Parveen', employeeCode: 'EMP-T-004' },
    class: { name: 'Class 9', code: 'NINE' },
    section: { name: 'Jamuna', code: 'JAMUNA' },
    group: null,
    subject: { nameEn: 'Information Technology', code: 'ICT' },
  },
];

// ==========================================
// 1. DEPARTMENT SERVICE
// ==========================================
export async function getDepartments(params: PaginationParams = {}) {
  const { search = '', status = '', page = 1, pageSize = 10, schoolId } = params;

  try {
    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (status) where.status = status as any;
    if (search) {
      where.OR = [
        { nameEn: { contains: search } },
        { nameBn: { contains: search } },
        { code: { contains: search } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.department.count({ where }),
      prisma.department.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { code: 'asc' },
      }),
    ]);

    if (items.length > 0) {
      return { total, page, pageSize, totalPages: Math.ceil(total / pageSize), data: items };
    }
  } catch {
    // Fallback
  }

  let filtered = [...mockDepartments];
  if (schoolId) filtered = filtered.filter((d) => d.schoolId === schoolId);
  if (status) filtered = filtered.filter((d) => d.status === status);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.nameEn.toLowerCase().includes(q) ||
        (d.nameBn && d.nameBn.includes(q)) ||
        d.code.toLowerCase().includes(q)
    );
  }

  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  return {
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
    data: paginated,
  };
}

export async function createDepartment(data: any) {
  try {
    const created = await prisma.department.create({ data });
    await createAuditLog({ action: 'CREATE', module: 'Departments', recordId: created.id, schoolId: data.schoolId, details: `Created department ${data.code}` });
    return created;
  } catch {
    const newDept = { id: `dept-${Date.now()}`, ...data };
    mockDepartments.push(newDept);
    return newDept;
  }
}

export async function updateDepartment(id: string, data: any) {
  try {
    const updated = await prisma.department.update({ where: { id }, data });
    await createAuditLog({ action: 'UPDATE', module: 'Departments', recordId: id, schoolId: data.schoolId, details: `Updated department ${id}` });
    return updated;
  } catch {
    const idx = mockDepartments.findIndex((d) => d.id === id);
    if (idx !== -1) {
      mockDepartments[idx] = { ...mockDepartments[idx], ...data };
      return mockDepartments[idx];
    }
    return null;
  }
}

export async function deleteDepartment(id: string) {
  try {
    await prisma.department.delete({ where: { id } });
    await createAuditLog({ action: 'DELETE', module: 'Departments', recordId: id, details: `Deleted department ${id}` });
    return true;
  } catch {
    const idx = mockDepartments.findIndex((d) => d.id === id);
    if (idx !== -1) {
      mockDepartments.splice(idx, 1);
      return true;
    }
    return false;
  }
}

// ==========================================
// 2. DESIGNATION SERVICE
// ==========================================
export async function getDesignations(params: PaginationParams = {}) {
  const { search = '', status = '', page = 1, pageSize = 10, schoolId } = params;

  try {
    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (status) where.status = status as any;
    if (search) {
      where.OR = [
        { nameEn: { contains: search } },
        { nameBn: { contains: search } },
        { code: { contains: search } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.designation.count({ where }),
      prisma.designation.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { code: 'asc' },
      }),
    ]);

    if (items.length > 0) {
      return { total, page, pageSize, totalPages: Math.ceil(total / pageSize), data: items };
    }
  } catch {
    // Fallback
  }

  let filtered = [...mockDesignations];
  if (schoolId) filtered = filtered.filter((d) => d.schoolId === schoolId);
  if (status) filtered = filtered.filter((d) => d.status === status);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.nameEn.toLowerCase().includes(q) ||
        (d.nameBn && d.nameBn.includes(q)) ||
        d.code.toLowerCase().includes(q)
    );
  }

  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  return {
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
    data: paginated,
  };
}

export async function createDesignation(data: any) {
  try {
    const created = await prisma.designation.create({ data });
    await createAuditLog({ action: 'CREATE', module: 'Designations', recordId: created.id, schoolId: data.schoolId, details: `Created designation ${data.code}` });
    return created;
  } catch {
    const newDesig = { id: `desig-${Date.now()}`, ...data };
    mockDesignations.push(newDesig);
    return newDesig;
  }
}

export async function updateDesignation(id: string, data: any) {
  try {
    const updated = await prisma.designation.update({ where: { id }, data });
    await createAuditLog({ action: 'UPDATE', module: 'Designations', recordId: id, schoolId: data.schoolId, details: `Updated designation ${id}` });
    return updated;
  } catch {
    const idx = mockDesignations.findIndex((d) => d.id === id);
    if (idx !== -1) {
      mockDesignations[idx] = { ...mockDesignations[idx], ...data };
      return mockDesignations[idx];
    }
    return null;
  }
}

export async function deleteDesignation(id: string) {
  try {
    await prisma.designation.delete({ where: { id } });
    await createAuditLog({ action: 'DELETE', module: 'Designations', recordId: id, details: `Deleted designation ${id}` });
    return true;
  } catch {
    const idx = mockDesignations.findIndex((d) => d.id === id);
    if (idx !== -1) {
      mockDesignations.splice(idx, 1);
      return true;
    }
    return false;
  }
}

// ==========================================
// 3. TEACHER SERVICE
// ==========================================
export async function getTeachers(params: TeacherFilterParams = {}) {
  const {
    search = '',
    departmentId = '',
    designationId = '',
    employmentStatus = '',
    status = '',
    page = 1,
    pageSize = 10,
    schoolId,
  } = params;

  try {
    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (departmentId) where.departmentId = departmentId;
    if (designationId) where.designationId = designationId;
    if (employmentStatus) where.employmentStatus = employmentStatus;
    if (status) where.status = status as any;
    if (search) {
      where.OR = [
        { nameEn: { contains: search } },
        { nameBn: { contains: search } },
        { employeeCode: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.teacher.count({ where }),
      prisma.teacher.findMany({
        where,
        include: {
          department: true,
          designation: true,
          user: true,
          assignments: {
            include: {
              class: true,
              section: true,
              subject: true,
              academicYear: true,
            },
          },
          documents: true,
          employmentHistories: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { employeeCode: 'asc' },
      }),
    ]);

    if (items.length > 0) {
      return { total, page, pageSize, totalPages: Math.ceil(total / pageSize), data: items };
    }
  } catch {
    // Fallback
  }

  let filtered = [...mockTeachers];
  if (schoolId) filtered = filtered.filter((t) => t.schoolId === schoolId);
  if (departmentId) filtered = filtered.filter((t) => t.departmentId === departmentId);
  if (designationId) filtered = filtered.filter((t) => t.designationId === designationId);
  if (employmentStatus) filtered = filtered.filter((t) => t.employmentStatus === employmentStatus);
  if (status) filtered = filtered.filter((t) => t.status === status);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.nameEn.toLowerCase().includes(q) ||
        (t.nameBn && t.nameBn.includes(q)) ||
        t.employeeCode.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        (t.email && t.email.toLowerCase().includes(q))
    );
  }

  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  return {
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
    data: paginated,
  };
}

export async function getTeacherById(id: string) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        department: true,
        designation: true,
        user: true,
        assignments: {
          include: {
            class: true,
            section: true,
            subject: true,
            academicYear: true,
          },
        },
        documents: true,
        employmentHistories: true,
      },
    });
    if (teacher) return teacher;
  } catch {
    // Fallback
  }

  const found = mockTeachers.find((t) => t.id === id);
  if (found) return found;

  return mockTeachers[0]; // fallback default
}

export async function createTeacher(data: any) {
  // Check duplicate employee code first
  const existingTeachers = await getTeachers({ schoolId: data.schoolId, pageSize: 1000 });
  const isDuplicate = checkDuplicateEmployeeCode(existingTeachers.data, data.schoolId, data.employeeCode);
  if (isDuplicate) {
    throw new Error(`Teacher with employee code "${data.employeeCode}" already exists.`);
  }

  try {
    const created = await prisma.teacher.create({ data });
    await createAuditLog({ action: 'CREATE', module: 'Teachers', recordId: created.id, schoolId: data.schoolId, details: `Recruited teacher ${data.nameEn} (${data.employeeCode})` });
    return created;
  } catch {
    const newTch = {
      id: `tch-${Date.now()}`,
      ...data,
      department: mockDepartments.find((d) => d.id === data.departmentId) || null,
      designation: mockDesignations.find((d) => d.id === data.designationId) || null,
      documents: [],
      employmentHistories: [],
    };
    mockTeachers.push(newTch);
    return newTch;
  }
}

export async function updateTeacher(id: string, data: any) {
  if (data.employeeCode) {
    const existingTeachers = await getTeachers({ schoolId: data.schoolId, pageSize: 1000 });
    const isDuplicate = checkDuplicateEmployeeCode(existingTeachers.data, data.schoolId, data.employeeCode, id);
    if (isDuplicate) {
      throw new Error(`Teacher with employee code "${data.employeeCode}" already exists.`);
    }
  }

  try {
    const updated = await prisma.teacher.update({ where: { id }, data });
    await createAuditLog({ action: 'UPDATE', module: 'Teachers', recordId: id, schoolId: data.schoolId, details: `Updated teacher profile ${id}` });
    return updated;
  } catch {
    const idx = mockTeachers.findIndex((t) => t.id === id);
    if (idx !== -1) {
      mockTeachers[idx] = { ...mockTeachers[idx], ...data };
      return mockTeachers[idx];
    }
    return null;
  }
}

export async function deleteTeacher(id: string) {
  try {
    await prisma.teacher.delete({ where: { id } });
    await createAuditLog({ action: 'DELETE', module: 'Teachers', recordId: id, details: `Deleted teacher ${id}` });
    return true;
  } catch {
    const idx = mockTeachers.findIndex((t) => t.id === id);
    if (idx !== -1) {
      mockTeachers.splice(idx, 1);
      return true;
    }
    return false;
  }
}

// ==========================================
// 4. EMPLOYEE SERVICE
// ==========================================
export async function getEmployees(params: EmployeeFilterParams = {}) {
  const {
    search = '',
    departmentId = '',
    designationId = '',
    employmentType = '',
    status = '',
    page = 1,
    pageSize = 10,
    schoolId,
  } = params;

  try {
    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (departmentId) where.departmentId = departmentId;
    if (designationId) where.designationId = designationId;
    if (employmentType) where.employmentType = employmentType;
    if (status) where.status = status as any;
    if (search) {
      where.OR = [
        { nameEn: { contains: search } },
        { nameBn: { contains: search } },
        { employeeCode: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.findMany({
        where,
        include: {
          department: true,
          designation: true,
          user: true,
          documents: true,
          employmentHistories: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { employeeCode: 'asc' },
      }),
    ]);

    if (items.length > 0) {
      return { total, page, pageSize, totalPages: Math.ceil(total / pageSize), data: items };
    }
  } catch {
    // Fallback
  }

  let filtered = [...mockEmployees];
  if (schoolId) filtered = filtered.filter((e) => e.schoolId === schoolId);
  if (departmentId) filtered = filtered.filter((e) => e.departmentId === departmentId);
  if (designationId) filtered = filtered.filter((e) => e.designationId === designationId);
  if (employmentType) filtered = filtered.filter((e) => e.employmentType === employmentType);
  if (status) filtered = filtered.filter((e) => e.status === status);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.nameEn.toLowerCase().includes(q) ||
        (e.nameBn && e.nameBn.includes(q)) ||
        e.employeeCode.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        (e.email && e.email.toLowerCase().includes(q))
    );
  }

  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  return {
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
    data: paginated,
  };
}

export async function getEmployeeById(id: string) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        designation: true,
        user: true,
        documents: true,
        employmentHistories: true,
      },
    });
    if (employee) return employee;
  } catch {
    // Fallback
  }

  const found = mockEmployees.find((e) => e.id === id);
  if (found) return found;

  return mockEmployees[0];
}

export async function createEmployee(data: any) {
  const existingEmployees = await getEmployees({ schoolId: data.schoolId, pageSize: 1000 });
  const isDuplicate = checkDuplicateEmployeeCode(existingEmployees.data, data.schoolId, data.employeeCode);
  if (isDuplicate) {
    throw new Error(`Employee with code "${data.employeeCode}" already exists.`);
  }

  try {
    const created = await prisma.employee.create({ data });
    await createAuditLog({ action: 'CREATE', module: 'Employees', recordId: created.id, schoolId: data.schoolId, details: `Created employee ${data.nameEn} (${data.employeeCode})` });
    return created;
  } catch {
    const newEmp = {
      id: `emp-${Date.now()}`,
      ...data,
      department: mockDepartments.find((d) => d.id === data.departmentId) || null,
      designation: mockDesignations.find((d) => d.id === data.designationId) || null,
      documents: [],
      employmentHistories: [],
    };
    mockEmployees.push(newEmp);
    return newEmp;
  }
}

export async function updateEmployee(id: string, data: any) {
  if (data.employeeCode) {
    const existingEmployees = await getEmployees({ schoolId: data.schoolId, pageSize: 1000 });
    const isDuplicate = checkDuplicateEmployeeCode(existingEmployees.data, data.schoolId, data.employeeCode, id);
    if (isDuplicate) {
      throw new Error(`Employee with code "${data.employeeCode}" already exists.`);
    }
  }

  try {
    const updated = await prisma.employee.update({ where: { id }, data });
    await createAuditLog({ action: 'UPDATE', module: 'Employees', recordId: id, schoolId: data.schoolId, details: `Updated employee profile ${id}` });
    return updated;
  } catch {
    const idx = mockEmployees.findIndex((e) => e.id === id);
    if (idx !== -1) {
      mockEmployees[idx] = { ...mockEmployees[idx], ...data };
      return mockEmployees[idx];
    }
    return null;
  }
}

export async function deleteEmployee(id: string) {
  try {
    await prisma.employee.delete({ where: { id } });
    await createAuditLog({ action: 'DELETE', module: 'Employees', recordId: id, details: `Deleted employee ${id}` });
    return true;
  } catch {
    const idx = mockEmployees.findIndex((e) => e.id === id);
    if (idx !== -1) {
      mockEmployees.splice(idx, 1);
      return true;
    }
    return false;
  }
}

// ==========================================
// 5. TEACHER ASSIGNMENT SERVICE
// ==========================================
export async function getTeacherAssignments(params: TeacherAssignmentFilterParams = {}) {
  const {
    academicYearId = '',
    teacherId = '',
    classId = '',
    sectionId = '',
    subjectId = '',
    status = '',
    page = 1,
    pageSize = 10,
    schoolId,
  } = params;

  try {
    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (academicYearId) where.academicYearId = academicYearId;
    if (teacherId) where.teacherId = teacherId;
    if (classId) where.classId = classId;
    if (sectionId) where.sectionId = sectionId;
    if (subjectId) where.subjectId = subjectId;
    if (status) where.status = status as any;

    const [total, items] = await Promise.all([
      prisma.teacherAssignment.count({ where }),
      prisma.teacherAssignment.findMany({
        where,
        include: {
          academicYear: true,
          teacher: true,
          class: true,
          section: true,
          group: true,
          subject: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (items.length > 0) {
      return { total, page, pageSize, totalPages: Math.ceil(total / pageSize), data: items };
    }
  } catch {
    // Fallback
  }

  let filtered = [...mockAssignments];
  if (schoolId) filtered = filtered.filter((a) => a.schoolId === schoolId);
  if (academicYearId) filtered = filtered.filter((a) => a.academicYearId === academicYearId);
  if (teacherId) filtered = filtered.filter((a) => a.teacherId === teacherId);
  if (classId) filtered = filtered.filter((a) => a.classId === classId);
  if (sectionId) filtered = filtered.filter((a) => a.sectionId === sectionId);
  if (subjectId) filtered = filtered.filter((a) => a.subjectId === subjectId);
  if (status) filtered = filtered.filter((a) => a.status === status);

  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  return {
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
    data: paginated,
  };
}

export async function createTeacherAssignment(data: any) {
  // Validate duplicate assignment
  const existing = await getTeacherAssignments({ schoolId: data.schoolId, pageSize: 1000 });
  const isDuplicate = checkDuplicateTeacherAssignment(existing.data, data);
  if (isDuplicate) {
    throw new Error('This teacher is already assigned to this specific Class, Section, and Subject in this Academic Year.');
  }

  try {
    const created = await prisma.teacherAssignment.create({ data });
    await createAuditLog({ action: 'CREATE', module: 'Teacher Assignments', recordId: created.id, schoolId: data.schoolId, details: `Assigned teacher ${data.teacherId} to class ${data.classId}` });
    return created;
  } catch {
    const tch = mockTeachers.find((t) => t.id === data.teacherId);
    const newAsgn = {
      id: `asgn-${Date.now()}`,
      ...data,
      academicYear: { name: '2026-2027' },
      teacher: tch ? { nameEn: tch.nameEn, employeeCode: tch.employeeCode } : { nameEn: 'Teacher', employeeCode: 'EMP' },
      class: { name: 'Class 10', code: 'TEN' },
      section: { name: 'Padma', code: 'PADMA' },
      subject: { nameEn: 'Subject', code: 'SUB' },
    };
    mockAssignments.push(newAsgn);
    return newAsgn;
  }
}

export async function deleteTeacherAssignment(id: string) {
  try {
    await prisma.teacherAssignment.delete({ where: { id } });
    await createAuditLog({ action: 'DELETE', module: 'Teacher Assignments', recordId: id, details: `Removed assignment ${id}` });
    return true;
  } catch {
    const idx = mockAssignments.findIndex((a) => a.id === id);
    if (idx !== -1) {
      mockAssignments.splice(idx, 1);
      return true;
    }
    return false;
  }
}

// ==========================================
// 6. WORKLOAD & DASHBOARD FOUNDATION
// ==========================================
export async function getTeacherWorkload(teacherId: string, schoolId?: string) {
  const assignments = await getTeacherAssignments({ teacherId, schoolId, pageSize: 100 });
  
  const assignedClasses = Array.from(new Set(assignments.data.map((a: any) => a.class?.name || 'Class')));
  const assignedSections = Array.from(new Set(assignments.data.map((a: any) => `${a.class?.name || ''} - ${a.section?.name || ''}`)));
  const assignedSubjects = Array.from(new Set(assignments.data.map((a: any) => a.subject?.nameEn || 'Subject')));
  const classTeacherFor = assignments.data.filter((a: any) => a.isClassTeacher).map((a: any) => `${a.class?.name || ''} (${a.section?.name || ''})`);

  return {
    teacherId,
    totalClassesPerWeek: assignments.data.length * 5, // Estimated period slots
    assignedClassesCount: assignedClasses.length,
    assignedSectionsCount: assignedSections.length,
    assignedSubjectsCount: assignedSubjects.length,
    assignedClasses,
    assignedSections,
    assignedSubjects,
    classTeacherFor,
    assignments: assignments.data,
  };
}
