import React from 'react';
import '@/src/index.css';

export const metadata = {
  title: 'School Management System',
  description: 'Enterprise School Management System with BDT billing, EIIN registration, and RBAC.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body suppressHydrationWarning className="h-full min-h-screen text-slate-800 font-sans antialiased bg-slate-50 selection:bg-teal-100 selection:text-teal-900">
        {children}
      </body>
    </html>
  );
}
