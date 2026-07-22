'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { RoomsManager } from '@/src/components/academics/RoomsManager';

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Classrooms & Laboratories"
        subtitle="Manage campus facilities, room codes, seating capacities, and room types"
        breadcrumbs={[{ label: 'Academics', href: '/dashboard/academics' }, { label: 'Rooms & Labs' }]}
      />
      <AcademicNavigationTabs activeTab="rooms" />
      <RoomsManager />
    </div>
  );
}
