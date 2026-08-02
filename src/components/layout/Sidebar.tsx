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
  CalendarDays,
} from 'lucide-react';
import { NAVIGATION_GROUPS, canAccessPermission } from '@/src/config/access-control';

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
  'School Settings': Settings,
  'User Directory': UserCog,
  'Roles & RBAC': ShieldCheck,
  'Academic Management': School,
  'Student Directory': GraduationCap,
  'Guardians Directory': Users,
  'Online Admissions': UserCheck,
  Departments: Building2,
  Designations: ShieldCheck,
  'Teachers Roster': Users,
  'Employees Directory': UserCog,
  'Teacher Assignments': BookOpen,
  'Teacher Portal': UserCheck,
  'Student Portal': GraduationCap,
  'Parent Portal': Users,
  'Attendance Tracker': CalendarCheck2,
  'Class Routines': Clock,
  'Exams & Results': FileSpreadsheet,
  'Homework Assignments': BookOpen,
  'Leave Management': CalendarDays,
  'Fee Structures & Invoices': Receipt,
  'Payroll Management': DollarSign,
  'Reports & Analytics': BarChart3,
  'System Audit Logs': ClipboardList,
  'My Leave & Salary': CalendarDays,
} as const;

export function Sidebar({ isMobileOpen, onCloseMobile, permissions, roles, schoolName, schoolEiin, currency }: SidebarProps) {
  const pathname = usePathname();
  const navGroups = NAVIGATION_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => canAccessPermission(permissions, roles, item.permission)),
  })).filter((group) => group.items.length > 0);

  const sidebarContent = (
    <div className="flex h-full min-h-0 flex-col border-r border-slate-200/80 bg-white">
      {/* Brand Header */}
      <div className="p-5 border-b border-teal-800 bg-teal-700 flex items-center justify-between shrink-0">
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
      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-4 scrollbar-thin">
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
                const Icon = icons[item.label as keyof typeof icons] || LayoutDashboard;

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
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
          <span>{schoolEiin ? `EIIN: ${schoolEiin}` : 'School Portal'}</span>
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
