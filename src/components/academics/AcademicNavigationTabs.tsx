'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Clock,
  Building2,
  Layers,
  Users,
  BookOpen,
  Link2,
  Grid,
  FileCheck,
  DoorOpen,
  Timer,
  Palmtree,
} from 'lucide-react';

export const ACADEMIC_MODULES = [
  { id: 'years', label: 'Academic Years', icon: Calendar, path: '/dashboard/academics/years' },
  { id: 'sessions', label: 'Sessions', icon: Clock, path: '/dashboard/academics/sessions' },
  { id: 'classes', label: 'Classes', icon: Building2, path: '/dashboard/academics/classes' },
  { id: 'sections', label: 'Sections', icon: Layers, path: '/dashboard/academics/sections' },
  { id: 'groups', label: 'Groups', icon: Users, path: '/dashboard/academics/groups' },
  { id: 'subjects', label: 'Subjects', icon: BookOpen, path: '/dashboard/academics/subjects' },
  { id: 'class-sections', label: 'Class-Section', icon: Link2, path: '/dashboard/academics/class-sections' },
  { id: 'class-groups', label: 'Class-Group', icon: Grid, path: '/dashboard/academics/class-groups' },
  { id: 'class-subjects', label: 'Class-Subject', icon: FileCheck, path: '/dashboard/academics/class-subjects' },
  { id: 'rooms', label: 'Rooms & Labs', icon: DoorOpen, path: '/dashboard/academics/rooms' },
  { id: 'periods', label: 'Periods', icon: Timer, path: '/dashboard/academics/periods' },
  { id: 'holidays', label: 'Holidays', icon: Palmtree, path: '/dashboard/academics/holidays' },
];

export function AcademicNavigationTabs({ activeTab }: { activeTab: string }) {
  const pathname = usePathname();

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-2 shadow-2xs overflow-x-auto">
      <nav className="flex space-x-1 min-w-max" aria-label="Academic Management Modules">
        {ACADEMIC_MODULES.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeTab === mod.id || pathname.endsWith(mod.id);
          return (
            <Link
              key={mod.id}
              href={`/dashboard/academics?tab=${mod.id}`}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{mod.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
