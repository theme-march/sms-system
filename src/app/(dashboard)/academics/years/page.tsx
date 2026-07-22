'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { AcademicYearsManager } from '@/src/components/academics/AcademicYearsManager';

export default function AcademicYearsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Years"
        subtitle="Define, configure, and manage institutional academic years and current year designations"
        breadcrumbs={[{ label: 'Academics', href: '/dashboard/academics' }, { label: 'Academic Years' }]}
      />
      <AcademicNavigationTabs activeTab="years" />
      <AcademicYearsManager />
    </div>
  );
}
