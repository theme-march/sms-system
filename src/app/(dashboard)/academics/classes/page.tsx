'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { ClassesManager } from '@/src/components/academics/ClassesManager';

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Roster & Grades"
        subtitle="Configure school class levels, codes, numeric levels, and display ordering"
        breadcrumbs={[{ label: 'Academics', href: '/dashboard/academics' }, { label: 'Classes' }]}
      />
      <AcademicNavigationTabs activeTab="classes" />
      <ClassesManager />
    </div>
  );
}
