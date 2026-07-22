'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { SubjectsManager } from '@/src/components/academics/SubjectsManager';

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum Subjects"
        subtitle="Manage subject listings, codes, and evaluation modes (Theory, Practical, Both)"
        breadcrumbs={[{ label: 'Academics', href: '/dashboard/academics' }, { label: 'Subjects' }]}
      />
      <AcademicNavigationTabs activeTab="subjects" />
      <SubjectsManager />
    </div>
  );
}
