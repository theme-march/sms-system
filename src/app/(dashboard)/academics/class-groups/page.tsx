'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { ClassGroupsManager } from '@/src/components/academics/ClassGroupsManager';

export default function ClassGroupsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Class-Group Mappings"
        subtitle="Assign academic groups and streams to relevant secondary and higher secondary classes"
        breadcrumbs={[{ label: 'Academics', href: '/dashboard/academics' }, { label: 'Class-Group' }]}
      />
      <AcademicNavigationTabs activeTab="class-groups" />
      <ClassGroupsManager />
    </div>
  );
}
