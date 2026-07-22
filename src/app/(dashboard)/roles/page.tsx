'use client';

import React from 'react';
import { Shield, Check, Lock } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { SYSTEM_ROLES, PERMISSIONS } from '@/src/config/permissions';

export default function RolesAndPermissionsPage() {
  const rolesList = Object.values(SYSTEM_ROLES);
  const permissionsList = [
    { code: 'dashboard.view', name: 'Dashboard View' },
    { code: 'users.manage', name: 'User Directory Manage' },
    { code: 'school.settings.manage', name: 'School Settings Manage' },
    { code: 'academic.manage', name: 'Academic Classes & Subjects' },
    { code: 'students.manage', name: 'Student Records' },
    { code: 'teachers.manage', name: 'Teacher & Staff Management' },
    { code: 'attendance.manage', name: 'Daily Attendance Roll Call' },
    { code: 'exams.manage', name: 'Exams & Marks Entry' },
    { code: 'fees.manage', name: 'Fee Collection & Invoices (BDT)' },
    { code: 'payroll.approve', name: 'Payroll Approval' },
    { code: 'reports.export', name: 'PDF & Excel Export' },
    { code: 'audit.view', name: 'System Audit Logs' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions Matrix (RBAC)"
        subtitle="Granular access control settings across Super Admin, Teachers, Accountants, and Staff"
        breadcrumbs={[{ label: 'Roles' }]}
      />

      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <th className="px-4 py-3 min-w-[200px]">Permission Name</th>
              {rolesList.slice(0, 5).map((role) => (
                <th key={role} className="px-3 py-3 text-center min-w-[120px]">
                  <span className="inline-flex items-center gap-1">
                    <Shield className="w-3 h-3 text-teal-600" />
                    {role}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {permissionsList.map((perm) => (
              <tr key={perm.code} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {perm.name}
                  <span className="block text-[10px] text-slate-400 font-normal">{perm.code}</span>
                </td>
                {rolesList.slice(0, 5).map((role) => {
                  const isAllowed =
                    role === 'Super Admin' ||
                    (role === 'School Admin' && perm.code !== 'audit.view') ||
                    (role === 'Teacher' && ['dashboard.view', 'attendance.manage', 'exams.manage'].includes(perm.code)) ||
                    (role === 'Accountant' && ['dashboard.view', 'fees.manage', 'payroll.approve'].includes(perm.code));

                  return (
                    <td key={role} className="px-3 py-3 text-center">
                      {isAllowed ? (
                        <span className="inline-flex p-1 bg-emerald-50 text-emerald-600 rounded-full">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex p-1 bg-slate-100 text-slate-300 rounded-full">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
