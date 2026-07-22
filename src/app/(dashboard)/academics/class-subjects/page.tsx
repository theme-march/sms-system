'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { ClassSubjectsManager } from '@/src/components/academics/ClassSubjectsManager';

export default function ClassSubjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Class-Subject Mappings & Gradebooks"
        subtitle="Configure subjects per class with compulsory/optional status, full marks, and pass marks rules"
        breadcrumbs={[{ label: 'Academics', href: '/dashboard/academics' }, { label: 'Class-Subject' }]}
      />
      <AcademicNavigationTabs activeTab="class-subjects" />
      <ClassSubjectsManager />
    </div>
  );
}
