'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { AcademicYearsManager } from '@/src/components/academics/AcademicYearsManager';
import { AcademicSessionsManager } from '@/src/components/academics/AcademicSessionsManager';
import { ClassesManager } from '@/src/components/academics/ClassesManager';
import { SectionsManager } from '@/src/components/academics/SectionsManager';
import { GroupsManager } from '@/src/components/academics/GroupsManager';
import { SubjectsManager } from '@/src/components/academics/SubjectsManager';
import { ClassSectionsManager } from '@/src/components/academics/ClassSectionsManager';
import { ClassGroupsManager } from '@/src/components/academics/ClassGroupsManager';
import { ClassSubjectsManager } from '@/src/components/academics/ClassSubjectsManager';
import { RoomsManager } from '@/src/components/academics/RoomsManager';
import { PeriodsManager } from '@/src/components/academics/PeriodsManager';
import { HolidaysManager } from '@/src/components/academics/HolidaysManager';

function AcademicsContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'years';

  const renderModule = () => {
    switch (activeTab) {
      case 'years':
        return <AcademicYearsManager />;
      case 'sessions':
        return <AcademicSessionsManager />;
      case 'classes':
        return <ClassesManager />;
      case 'sections':
        return <SectionsManager />;
      case 'groups':
        return <GroupsManager />;
      case 'subjects':
        return <SubjectsManager />;
      case 'class-sections':
        return <ClassSectionsManager />;
      case 'class-groups':
        return <ClassGroupsManager />;
      case 'class-subjects':
        return <ClassSubjectsManager />;
      case 'rooms':
        return <RoomsManager />;
      case 'periods':
        return <PeriodsManager />;
      case 'holidays':
        return <HolidaysManager />;
      default:
        return <AcademicYearsManager />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Management Hub"
        subtitle="Manage academic years, sessions, curriculum, class sections, subjects, classrooms, and timetable periods"
        breadcrumbs={[{ label: 'Academics Management' }]}
      />

      <AcademicNavigationTabs activeTab={activeTab} />

      <div>{renderModule()}</div>
    </div>
  );
}

export default function AcademicsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading Academic Management Hub...</span>
      </div>
    }>
      <AcademicsContent />
    </Suspense>
  );
}
