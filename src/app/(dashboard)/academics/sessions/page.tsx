'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { AcademicSessionsManager } from '@/src/components/academics/AcademicSessionsManager';

export default function AcademicSessionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Sessions & Terms"
        subtitle="Manage term sessions, semesters, and session durations"
        breadcrumbs={[{ label: 'Academics', href: '/dashboard/academics' }, { label: 'Sessions' }]}
      />
      <AcademicNavigationTabs activeTab="sessions" />
      <AcademicSessionsManager />
    </div>
  );
}
