"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  CalendarCheck2,
  FileSpreadsheet,
  FileText,
  Receipt,
  DollarSign,
  ClipboardList,
  BarChart3,
  Settings,
  ShieldCheck,
  UserCog,
  Building2,
  Clock,
  X,
  School,
  CalendarDays,
  Globe,
  ChevronDown,
  BriefcaseBusiness,
  WalletCards,
} from "lucide-react";
import {
  NAVIGATION_GROUPS,
  canAccessPermission,
} from "@/src/config/access-control";

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  permissions: string[];
  roles: string[];
  schoolName: string;
  schoolEiin: string;
  currency: string;
}

const icons = {
  Dashboard: LayoutDashboard,
  "My Dashboard": LayoutDashboard,
  "My Profile": UserCheck,
  "Attendance Details": CalendarCheck2,
  "My Syllabus": BookOpen,
  "My Class Routine": Clock,
  "My Exam Routine": CalendarDays,
  "My Admit Cards": FileText,
  "Payment Details": Receipt,
  "School Settings": Settings,
  "Website Settings": Globe,
  "Website Overview": Globe,
  "Custom Pages": FileText,
  "Banner Slider": FileSpreadsheet,
  "Home Page": School,
  "About Page": Building2,
  "Academics Page": BookOpen,
  "Programs Page": GraduationCap,
  "Gallery Page": FileSpreadsheet,
  "Events Page": CalendarDays,
  "Admission Page": UserCheck,
  "Teachers Page": Users,
  "Facilities Page": Building2,
  "Achievements Page": BarChart3,
  "Downloads Page": FileSpreadsheet,
  "Contact Page": Users,
  "User Directory": UserCog,
  "Roles & RBAC": ShieldCheck,
  "Academic Management": School,
  "Student Directory": GraduationCap,
  "Guardians Directory": Users,
  "Online Admissions": UserCheck,
  Departments: Building2,
  Designations: ShieldCheck,
  "Teachers Roster": Users,
  "Employees Directory": UserCog,
  "Teacher Assignments": BookOpen,
  "Teacher Portal": UserCheck,
  "Student Portal": GraduationCap,
  "Parent Portal": Users,
  "Attendance Tracker": CalendarCheck2,
  "Class Routines": Clock,
  "Exams & Results": FileSpreadsheet,
  "Homework Assignments": BookOpen,
  "Leave Management": CalendarDays,
  "Fee Structures & Invoices": Receipt,
  "Payroll Management": DollarSign,
  "Reports & Analytics": BarChart3,
  "System Audit Logs": ClipboardList,
  "My Leave & Salary": CalendarDays,
  "My Salary & Payslips": DollarSign,
} as const;

const groupIcons = {
  "Core Management": Settings,
  "Website Settings": Globe,
  "Academic & Administration": GraduationCap,
  "Operations & Evaluation": ClipboardList,
  "Finance & Accounts": WalletCards,
  "Self Service": BriefcaseBusiness,
} as const;

export function Sidebar({
  isMobileOpen,
  onCloseMobile,
  permissions,
  roles,
  schoolName,
  schoolEiin,
  currency,
}: SidebarProps) {
  const pathname = usePathname();
  const managementRoles = [
    "Super Admin",
    "School Admin",
    "Academic Admin",
    "Admission Officer",
    "Accountant",
    "HR Manager",
  ];
  const isTeacherOnly =
    roles.includes("Teacher") &&
    !roles.some((role) => managementRoles.includes(role));
  const teacherNavigationItems = new Set([
    "Attendance Tracker",
    "Class Routines",
    "Exams & Results",
    "Homework Assignments",
    "Leave Management",
    "My Leave & Salary",
    "My Salary & Payslips",
  ]);
  const teacherPortalItem = NAVIGATION_GROUPS.flatMap(
    (group) => group.items,
  ).find((item) => item.label === "Teacher Portal");
  const isStudentOnly =
    roles.includes("Student") &&
    !roles.some((role) => managementRoles.includes(role));
  const studentPortalItem = NAVIGATION_GROUPS.flatMap(
    (group) => group.items,
  ).find((item) => item.label === "Student Portal");
  const isGuardianOnly =
    roles.includes("Parent/Guardian") &&
    !roles.some((role) => managementRoles.includes(role));
  const guardianPortalItem = NAVIGATION_GROUPS.flatMap(
    (group) => group.items,
  ).find((item) => item.label === "Parent Portal");
  const navGroups = NAVIGATION_GROUPS.map((group) => ({
    ...group,
    items: [
      ...(isTeacherOnly &&
      group.title === "Core Management" &&
      teacherPortalItem
        ? [{ ...teacherPortalItem, label: "My Dashboard", href: "/teacher" }]
        : []),
      ...(isStudentOnly &&
      group.title === "Core Management" &&
      studentPortalItem
        ? [
            { ...studentPortalItem, label: "My Dashboard", href: "/student" },
            {
              ...studentPortalItem,
              label: "My Profile",
              href: "/student/profile",
            },
            {
              ...studentPortalItem,
              label: "My Syllabus",
              href: "/student/syllabus",
            },
            {
              ...studentPortalItem,
              label: "My Class Routine",
              href: "/student/class-routine",
            },
            {
              ...studentPortalItem,
              label: "My Exam Routine",
              href: "/student/exam-routine",
            },
            {
              ...studentPortalItem,
              label: "My Admit Cards",
              href: "/student/admit-cards",
            },
            {
              ...studentPortalItem,
              label: "Payment Details",
              href: "/student/payments",
            },
          ]
        : []),
      ...(isGuardianOnly &&
      group.title === "Core Management" &&
      guardianPortalItem
        ? [
            { ...guardianPortalItem, label: "My Dashboard", href: "/guardian" },
            {
              ...guardianPortalItem,
              label: "My Profile",
              href: "/guardian/profile",
            },
            {
              ...guardianPortalItem,
              label: "Attendance Details",
              href: "/guardian/attendance",
            },
          ]
        : []),
      ...group.items
        .filter((item) =>
          canAccessPermission(permissions, roles, item.permission),
        )
        .filter(
          (item) =>
            !(
              isTeacherOnly &&
              !teacherNavigationItems.has(item.label)
            ),
        )
        .filter(
          (item) =>
            !(
              isStudentOnly &&
              ["Dashboard", "Student Portal"].includes(item.label)
            ),
        )
        .filter(
          (item) =>
            !(
              isGuardianOnly &&
              !["My Dashboard", "My Profile", "Attendance Details"].includes(item.label)
            ),
        ),
    ],
  })).filter((group) => group.items.length > 0);

  const activeNavHref = navGroups
    .flatMap((group) => group.items)
    .filter((item) => {
      const itemPath = item.href.split("?")[0];
      return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
    })
    .sort(
      (first, second) =>
        second.href.split("?")[0].length - first.href.split("?")[0].length,
    )[0]?.href;
  const activeGroupTitle = navGroups.find((group) =>
    group.items.some((item) => item.href === activeNavHref),
  )?.title;
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    () => new Set(navGroups.map((group) => group.title)),
  );
  const allGroupsExpanded = navGroups.every((group) => expandedGroups.has(group.title));

  React.useEffect(() => {
    if (!activeGroupTitle) return;
    setExpandedGroups((current) => {
      if (current.has(activeGroupTitle)) return current;
      return new Set([...current, activeGroupTitle]);
    });
  }, [activeGroupTitle]);

  const toggleGroup = (title: string) => {
    setExpandedGroups((current) => {
      const next = new Set(current);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  const sidebarContent = (
    <div className="dashboard-sidebar flex h-full min-h-0 flex-col border-r border-slate-200/80 bg-white">
      {/* Brand Header */}
      <div className="dashboard-brand p-5 border-b border-teal-800 bg-teal-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-white text-teal-700 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            SMS
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white truncate leading-none">
              {schoolName}
            </h2>
            <p className="text-[10px] font-semibold text-teal-100 uppercase tracking-wider mt-1">
              Management Console
            </p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-teal-100 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Navigation</span>
          <button
            type="button"
            onClick={() => setExpandedGroups(allGroupsExpanded
              ? new Set(activeGroupTitle ? [activeGroupTitle] : [])
              : new Set(navGroups.map((group) => group.title)))}
            className="rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            {allGroupsExpanded ? "Collapse" : "Expand all"}
          </button>
        </div>
        <div className="space-y-2">
        {navGroups.map((group) => {
          const expanded = expandedGroups.has(group.title);
          const groupActive = group.title === activeGroupTitle;
          const GroupIcon = groupIcons[group.title as keyof typeof groupIcons] || Settings;
          return (
          <section key={group.title} className={`overflow-hidden rounded-xl border transition ${groupActive ? "border-teal-200 bg-teal-50/30" : "border-slate-100 bg-white"}`}>
            <button
              type="button"
              onClick={() => toggleGroup(group.title)}
              aria-expanded={expanded}
              className={`flex w-full items-center gap-2.5 px-3 py-3 text-left transition ${expanded ? "border-b border-slate-100" : "hover:bg-slate-50"}`}
            >
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${groupActive ? "bg-teal-600 text-white" : "bg-slate-50 text-slate-500"}`}>
                <GroupIcon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-[11px] font-extrabold uppercase tracking-wide ${groupActive ? "text-teal-700" : "text-slate-600"}`}>{group.title}</span>
                <span className="mt-0.5 block text-[9px] font-semibold text-slate-400">{group.items.length} menu {group.items.length === 1 ? "item" : "items"}</span>
              </span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${expanded ? "rotate-0" : "-rotate-90"}`} />
            </button>
            {expanded && <div className="space-y-1 p-2">
              {group.items.map((item) => {
                const isActive = item.href === activeNavHref;
                const Icon =
                  icons[item.label as keyof typeof icons] || LayoutDashboard;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-teal-50 text-teal-700 font-semibold shadow-2xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isActive ? "bg-teal-600" : "bg-slate-300"
                      }`}
                    />
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? "text-teal-600" : "text-slate-400"}`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>}
          </section>
          );
        })}
        </div>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
          <span>{schoolEiin ? `EIIN: ${schoolEiin}` : "School Portal"}</span>
          <span className="text-teal-600 font-bold">{currency}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden h-dvh w-64 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 transform transition-transform">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
