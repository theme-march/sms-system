import React from 'react';
import { ClipboardList, Shield, User } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';

export default function AuditLogsPage() {
  const auditLogs = [
    {
      id: 'log-1',
      action: 'UPDATE',
      module: 'SchoolSettings',
      user: 'Super Admin (admin@school.com)',
      details: 'Updated EIIN number to 108234 and set default language to Bangla (bn)',
      ipAddress: '127.0.0.1',
      timestamp: '21/07/2026 23:40:12',
    },
    {
      id: 'log-2',
      action: 'LOGIN',
      module: 'Authentication',
      user: 'Super Admin (admin@school.com)',
      details: 'Successful portal login session created',
      ipAddress: '127.0.0.1',
      timestamp: '21/07/2026 23:35:01',
    },
    {
      id: 'log-3',
      action: 'CREATE',
      module: 'Students',
      user: 'Super Admin (admin@school.com)',
      details: 'Admitted new student STU-2026-1001 (Tanvir Hossain) to Class 10',
      ipAddress: '127.0.0.1',
      timestamp: '20/07/2026 14:22:10',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Audit Trail"
        subtitle="Immutable security logs tracking all database changes, administrative logins, and data exports"
        breadcrumbs={[{ label: 'Audit Logs' }]}
      />

      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ClipboardList className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">Security Audit Activity Log</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-500">{log.timestamp}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{log.user}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-teal-50 text-teal-700 border border-teal-200 uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{log.module}</td>
                  <td className="px-4 py-3 text-slate-700">{log.details}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
