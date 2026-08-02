import React from 'react';
import { DashboardLayout } from '@/src/components/layout/DashboardLayout';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/src/lib/auth/session';
import { headers } from 'next/headers';
import {
  canAccessPermission,
  defaultLandingPage,
  normalizeDashboardPath,
  requiredPermissionForPath,
} from '@/src/config/access-control';
import { getSchoolProfile } from '@/src/services/school.service';

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  const pathname = (await headers()).get('x-dashboard-path');
  const requiredPermission = pathname ? requiredPermissionForPath(pathname) : null;
  if (
    requiredPermission &&
    !canAccessPermission(session.permissions, session.roles, requiredPermission)
  ) {
    const landingPage = defaultLandingPage(session.permissions, session.roles);
    if (pathname && normalizeDashboardPath(pathname) === '/dashboard' && landingPage !== '/dashboard') {
      redirect(landingPage);
    }
    redirect('/unauthorized');
  }
  const school = await getSchoolProfile(session.schoolId ?? undefined);
  return (
    <DashboardLayout
      userName={session.name}
      userRole={session.roles.join(', ') || 'User'}
      permissions={session.permissions}
      roles={session.roles}
      schoolName={school?.name || 'School Management System'}
      schoolEiin={school?.eiin || ''}
      currency={school?.settings?.currency || 'BDT'}
      schoolId={session.schoolId || ''}
    >
      {children}
    </DashboardLayout>
  );
}
