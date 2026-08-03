import React from 'react';
import '@/src/index.css';

export const metadata = {
  title: 'School Website & Management System',
  description: 'Official school website, notices, academic information and online admission.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="h-full bg-slate-50">
      <body suppressHydrationWarning className="h-full min-h-screen text-slate-800 font-sans antialiased bg-slate-50 selection:bg-teal-100 selection:text-teal-900">
        {children}
      </body>
    </html>
  );
}
