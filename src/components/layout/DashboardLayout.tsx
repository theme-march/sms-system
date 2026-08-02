'use client';

import React, { createContext, useContext, useState } from 'react';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { Header } from '@/src/components/layout/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  userRole: string;
  permissions: string[];
  roles: string[];
  schoolName: string;
  schoolEiin: string;
  currency: string;
  schoolId: string;
}

const SchoolContext = createContext({ schoolId: '' });
export const useSchoolContext = () => useContext(SchoolContext);

export function DashboardLayout({ children, userName, userRole, permissions, roles, schoolName, schoolEiin, currency, schoolId }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <SchoolContext.Provider value={{ schoolId }}><div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Left Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        permissions={permissions}
        roles={roles}
        schoolName={schoolName}
        schoolEiin={schoolEiin}
        currency={currency}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 min-h-screen flex-col pt-16 lg:pl-64">
        <Header
          onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
          userName={userName}
          userRole={userRole}
          permissions={permissions}
          roles={roles}
        />

        <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer Info Bar */}
        <footer className="h-10 bg-slate-100 border-t border-slate-200 px-6 lg:px-8 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0 mt-auto">
          <div>System Health: Operational</div>
          <div className="hidden sm:block">{schoolName}</div>
          <div className="text-teal-600">SMS v2.5.0</div>
        </footer>
      </div>
    </div></SchoolContext.Provider>
  );
}
