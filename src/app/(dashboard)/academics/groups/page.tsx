'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { GroupsManager } from '@/src/components/academics/GroupsManager';

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Groups & Streams"
        subtitle="Manage academic study groups (Science, Commerce, Humanities, General)"
        breadcrumbs={[{ label: 'Academics', href: '/dashboard/academics' }, { label: 'Groups' }]}
      />
      <AcademicNavigationTabs activeTab="groups" />
      <GroupsManager />
    </div>
  );
}
