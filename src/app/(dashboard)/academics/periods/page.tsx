'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { PeriodsManager } from '@/src/components/academics/PeriodsManager';

export default function PeriodsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Periods & Timetable Slots"
        subtitle="Configure daily time slots, lesson durations, display order, and recess breaks"
        breadcrumbs={[{ label: 'Academics', href: '/dashboard/academics' }, { label: 'Periods' }]}
      />
      <AcademicNavigationTabs activeTab="periods" />
      <PeriodsManager />
    </div>
  );
}
