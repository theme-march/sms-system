'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  CalendarCheck2,
  FileSpreadsheet,
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
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const navGroups = [
  {
    title: 'Core Management',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'School Settings', href: '/dashboard/settings', icon: Settings },
      { label: 'User Directory', href: '/dashboard/users', icon: UserCog },
      { label: 'Roles & RBAC', href: '/dashboard/roles', icon: ShieldCheck },
    ],
  },
  {
    title: 'Academic & Administration',
    items: [
      { label: 'Academic Management', href: '/dashboard/academics', icon: School },
      { label: 'Student Directory', href: '/dashboard/students', icon: GraduationCap },
      { label: 'Guardians Directory', href: '/dashboard/guardians', icon: Users },
      { label: 'Online Admissions', href: '/dashboard/admissions', icon: UserCheck },
      { label: 'Departments', href: '/dashboard/departments', icon: Building2 },
      { label: 'Designations', href: '/dashboard/designations', icon: ShieldCheck },
      { label: 'Teachers Roster', href: '/dashboard/teachers', icon: Users },
      { label: 'Employees Directory', href: '/dashboard/employees', icon: UserCog },
      { label: 'Teacher Assignments', href: '/dashboard/teacher-assignments', icon: BookOpen },
      { label: 'Teacher Portal', href: '/dashboard/teacher', icon: UserCheck },
      { label: 'Student Portal', href: '/dashboard/student', icon: GraduationCap },
      { label: 'Parent Portal', href: '/dashboard/guardian', icon: Users },
    ],
  },
  {
    title: 'Operations & Evaluation',
    items: [
      { label: 'Attendance Tracker', href: '/dashboard/attendance', icon: CalendarCheck2 },
      { label: 'Class Routines', href: '/dashboard/routines', icon: Clock },
      { label: 'Exams & Results', href: '/dashboard/exams', icon: FileSpreadsheet },
      { label: 'Homework Assignments', href: '/dashboard/homework', icon: BookOpen },
    ],
  },
  {
    title: 'Finance & Accounts',
    items: [
      { label: 'Fee Structures & Invoices', href: '/dashboard/fees', icon: Receipt },
      { label: 'Payroll Management', href: '/dashboard/payroll', icon: DollarSign },
      { label: 'Reports & Analytics', href: '/dashboard/reports', icon: BarChart3 },
      { label: 'System Audit Logs', href: '/dashboard/audit', icon: ClipboardList },
    ],
  },
];

export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      {/* Brand Header */}
      <div className="p-5 border-b border-teal-800 bg-teal-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-white text-teal-700 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            SMS
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white truncate leading-none">
              Ideal Academy
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
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'bg-teal-50 text-teal-700 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isActive ? 'bg-teal-600' : 'bg-slate-300'
                      }`}
                    />
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
          <span>EIIN: 108234</span>
          <span className="text-teal-600 font-bold">BDT (৳) v2.5</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block sticky top-0 h-screen w-64 shrink-0 z-30">
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
