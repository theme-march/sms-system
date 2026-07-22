'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { AcademicNavigationTabs } from '@/src/components/academics/AcademicNavigationTabs';
import { ClassSectionsManager } from '@/src/components/academics/ClassSectionsManager';

export default function ClassSectionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Class-Section Mappings"
        subtitle="Assign and configure sections for each active class"
        breadcrumbs={[{ label: 'Academics', href: '/dashboard/academics' }, { label: 'Class-Section' }]}
      />
      <AcademicNavigationTabs activeTab="class-sections" />
      <ClassSectionsManager />
    </div>
  );
}
