'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { Header } from '@/src/components/layout/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased overflow-x-hidden">
      {/* Left Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* Footer Info Bar */}
        <footer className="h-10 bg-slate-100 border-t border-slate-200 px-6 lg:px-8 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0 mt-auto">
          <div>System Health: Operational</div>
          <div className="hidden sm:block">Asia/Dhaka • Academic Session 2026</div>
          <div className="text-teal-600">Ideal SMS v2.5.0</div>
        </footer>
      </div>
    </div>
  );
}
