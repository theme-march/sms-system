'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { SectionsManager } from '@/src/components/academics/SectionsManager';

export default function SectionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Section Templates"
        subtitle="Manage classroom section identifiers and default student capacities"
        breadcrumbs={[{ label: 'Academics', href: '/dashboard/academics' }, { label: 'Sections' }]}
      />
      <AcademicNavigationTabs activeTab="sections" />
      <SectionsManager />
    </div>
  );
}
