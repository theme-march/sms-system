'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { HolidaysManager } from '@/src/components/academics/HolidaysManager';

export default function HolidaysPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Holidays Calendar"
        subtitle="Manage national, religious, and institutional holiday schedules"
        breadcrumbs={[{ label: 'Academics', href: '/dashboard/academics' }, { label: 'Holidays' }]}
      />
      <AcademicNavigationTabs activeTab="holidays" />
      <HolidaysManager />
    </div>
  );
}
