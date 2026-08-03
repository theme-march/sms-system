import { PERMISSIONS, type PermissionCode } from "@/src/config/permissions";

export type NavigationItem = {
  label: string;
  href: string;
  permission: PermissionCode;
};

export type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    title: "Core Management",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
      {
        label: "School Settings",
        href: "/dashboard/settings",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "User Directory",
        href: "/dashboard/users",
        permission: PERMISSIONS.USERS_VIEW,
      },
      {
        label: "Roles & RBAC",
        href: "/dashboard/roles",
        permission: PERMISSIONS.ROLES_VIEW,
      },
    ],
  },
  {
    title: "Website Settings",
    items: [
      {
        label: "Website Overview",
        href: "/dashboard/website-settings",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Custom Pages",
        href: "/dashboard/website-settings/custom-pages",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Banner Slider",
        href: "/dashboard/website-settings/banners",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Home Page",
        href: "/dashboard/website-settings/home",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "About Page",
        href: "/dashboard/website-settings/about",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Academics Page",
        href: "/dashboard/website-settings/academic-activities",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Programs Page",
        href: "/dashboard/website-settings/programs",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Gallery Page",
        href: "/dashboard/website-settings/gallery",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Events Page",
        href: "/dashboard/website-settings/events",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Admission Page",
        href: "/dashboard/website-settings/admission-information",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Teachers Page",
        href: "/dashboard/website-settings/our-teachers",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Facilities Page",
        href: "/dashboard/website-settings/facilities",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Achievements Page",
        href: "/dashboard/website-settings/achievements",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Downloads Page",
        href: "/dashboard/website-settings/downloads",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
      {
        label: "Contact Page",
        href: "/dashboard/website-settings/contact",
        permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
      },
    ],
  },
  {
    title: "Academic & Administration",
    items: [
      {
        label: "Academic Management",
        href: "/dashboard/academics",
        permission: PERMISSIONS.ACADEMIC_VIEW,
      },
      {
        label: "Student Directory",
        href: "/dashboard/students",
        permission: PERMISSIONS.STUDENTS_VIEW,
      },
      {
        label: "Guardians Directory",
        href: "/dashboard/guardians",
        permission: PERMISSIONS.GUARDIANS_VIEW,
      },
      {
        label: "Online Admissions",
        href: "/dashboard/admissions",
        permission: PERMISSIONS.ADMISSIONS_VIEW,
      },
      {
        label: "Departments",
        href: "/dashboard/departments",
        permission: PERMISSIONS.DEPARTMENTS_VIEW,
      },
      {
        label: "Designations",
        href: "/dashboard/designations",
        permission: PERMISSIONS.DESIGNATIONS_VIEW,
      },
      {
        label: "Teachers Roster",
        href: "/dashboard/teachers",
        permission: PERMISSIONS.TEACHERS_VIEW,
      },
      {
        label: "Employees Directory",
        href: "/dashboard/employees",
        permission: PERMISSIONS.EMPLOYEES_VIEW,
      },
      {
        label: "Teacher Assignments",
        href: "/dashboard/teacher-assignments",
        permission: PERMISSIONS.TEACHER_ASSIGNMENTS_VIEW,
      },
      {
        label: "Teacher Portal",
        href: "/dashboard/teacher",
        permission: PERMISSIONS.TEACHER_PORTAL_VIEW,
      },
      {
        label: "Student Portal",
        href: "/dashboard/student",
        permission: PERMISSIONS.STUDENT_PORTAL_VIEW,
      },
      {
        label: "Parent Portal",
        href: "/dashboard/guardian",
        permission: PERMISSIONS.GUARDIAN_PORTAL_VIEW,
      },
    ],
  },
  {
    title: "Operations & Evaluation",
    items: [
      {
        label: "Attendance Tracker",
        href: "/dashboard/attendance",
        permission: PERMISSIONS.ATTENDANCE_VIEW,
      },
      {
        label: "Class Routines",
        href: "/dashboard/routines",
        permission: PERMISSIONS.ROUTINES_VIEW,
      },
      {
        label: "Exams & Results",
        href: "/dashboard/exams",
        permission: PERMISSIONS.EXAMS_VIEW,
      },
      {
        label: "Homework Assignments",
        href: "/dashboard/homework",
        permission: PERMISSIONS.HOMEWORK_VIEW,
      },
      {
        label: "Leave Management",
        href: "/dashboard/hr/leave",
        permission: PERMISSIONS.LEAVE_VIEW,
      },
    ],
  },
  {
    title: "Finance & Accounts",
    items: [
      {
        label: "Fee Structures & Invoices",
        href: "/dashboard/fees",
        permission: PERMISSIONS.FEES_VIEW,
      },
      {
        label: "Payroll Management",
        href: "/dashboard/payroll",
        permission: PERMISSIONS.PAYROLL_VIEW,
      },
      {
        label: "Reports & Analytics",
        href: "/dashboard/reports",
        permission: PERMISSIONS.REPORTS_VIEW,
      },
      {
        label: "System Audit Logs",
        href: "/dashboard/audit",
        permission: PERMISSIONS.AUDIT_VIEW,
      },
    ],
  },
  {
    title: "Self Service",
    items: [
      {
        label: "My Leave & Salary",
        href: "/dashboard/staff/leave",
        permission: PERMISSIONS.EMPLOYEE_PORTAL_VIEW,
      },
    ],
  },
];

const ROUTE_RULES: Array<{ prefixes: string[]; permission: PermissionCode }> = [
  { prefixes: ["/settings"], permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE },
  {
    prefixes: ["/website-settings"],
    permission: PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
  },
  { prefixes: ["/users"], permission: PERMISSIONS.USERS_VIEW },
  { prefixes: ["/roles"], permission: PERMISSIONS.ROLES_VIEW },
  { prefixes: ["/academics"], permission: PERMISSIONS.ACADEMIC_VIEW },
  { prefixes: ["/students"], permission: PERMISSIONS.STUDENTS_VIEW },
  { prefixes: ["/guardians"], permission: PERMISSIONS.GUARDIANS_VIEW },
  { prefixes: ["/admissions"], permission: PERMISSIONS.ADMISSIONS_VIEW },
  { prefixes: ["/departments"], permission: PERMISSIONS.DEPARTMENTS_VIEW },
  { prefixes: ["/designations"], permission: PERMISSIONS.DESIGNATIONS_VIEW },
  { prefixes: ["/teachers"], permission: PERMISSIONS.TEACHERS_VIEW },
  { prefixes: ["/employees"], permission: PERMISSIONS.EMPLOYEES_VIEW },
  {
    prefixes: ["/teacher-assignments"],
    permission: PERMISSIONS.TEACHER_ASSIGNMENTS_VIEW,
  },
  { prefixes: ["/teacher"], permission: PERMISSIONS.TEACHER_PORTAL_VIEW },
  { prefixes: ["/student"], permission: PERMISSIONS.STUDENT_PORTAL_VIEW },
  { prefixes: ["/guardian"], permission: PERMISSIONS.GUARDIAN_PORTAL_VIEW },
  { prefixes: ["/attendance"], permission: PERMISSIONS.ATTENDANCE_VIEW },
  {
    prefixes: ["/routines", "/exam-routine"],
    permission: PERMISSIONS.ROUTINES_VIEW,
  },
  { prefixes: ["/exams"], permission: PERMISSIONS.EXAMS_VIEW },
  { prefixes: ["/homework"], permission: PERMISSIONS.HOMEWORK_VIEW },
  { prefixes: ["/hr/leave"], permission: PERMISSIONS.LEAVE_VIEW },
  { prefixes: ["/fees"], permission: PERMISSIONS.FEES_VIEW },
  {
    prefixes: ["/payroll", "/hr/payroll"],
    permission: PERMISSIONS.PAYROLL_VIEW,
  },
  {
    prefixes: ["/reports", "/hr/reports"],
    permission: PERMISSIONS.REPORTS_VIEW,
  },
  { prefixes: ["/audit"], permission: PERMISSIONS.AUDIT_VIEW },
  { prefixes: ["/staff"], permission: PERMISSIONS.EMPLOYEE_PORTAL_VIEW },
  { prefixes: ["/dashboard"], permission: PERMISSIONS.DASHBOARD_VIEW },
];

export function normalizeDashboardPath(pathname: string) {
  if (pathname.startsWith("/dashboard/"))
    return pathname.slice("/dashboard".length);
  return pathname;
}

export function requiredPermissionForPath(
  pathname: string,
): PermissionCode | null {
  const normalized = normalizeDashboardPath(pathname);
  if (normalized === "/unauthorized") return null;
  for (const rule of ROUTE_RULES) {
    if (
      rule.prefixes.some(
        (prefix) =>
          normalized === prefix || normalized.startsWith(`${prefix}/`),
      )
    ) {
      return rule.permission;
    }
  }
  return PERMISSIONS.DASHBOARD_VIEW;
}

export function canAccessPermission(
  permissions: string[],
  roles: string[],
  permission: PermissionCode,
) {
  return (
    roles.includes("Super Admin") ||
    permissions.includes("ALL") ||
    permissions.includes(permission)
  );
}

export function defaultLandingPage(permissions: string[], roles: string[]) {
  if (
    roles.includes("Super Admin") ||
    permissions.includes(PERMISSIONS.DASHBOARD_VIEW)
  )
    return "/dashboard";
  if (permissions.includes(PERMISSIONS.TEACHER_PORTAL_VIEW)) return "/teacher";
  if (permissions.includes(PERMISSIONS.STUDENT_PORTAL_VIEW)) return "/student";
  if (permissions.includes(PERMISSIONS.GUARDIAN_PORTAL_VIEW))
    return "/guardian";
  if (permissions.includes(PERMISSIONS.EMPLOYEE_PORTAL_VIEW))
    return "/staff/leave";
  return "/unauthorized";
}
