'use client';

import React, { useState } from 'react';
import { UserPlus, Shield, Mail, Phone } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { DataTable } from '@/src/components/tables/DataTable';
import { SearchInput } from '@/src/components/tables/SearchInput';
import { StatusBadge } from '@/src/components/ui/StatusBadge';

export default function UsersPage() {
  const [search, setSearch] = useState('');

  const sampleUsers = [
    {
      id: 'usr-1',
      name: 'Super Admin',
      email: 'admin@school.com',
      phone: '+8801700000000',
      role: 'Super Admin',
      status: 'ACTIVE',
      createdAt: '15/01/2026',
    },
    {
      id: 'usr-2',
      name: 'Prof. Dr. Mohammad Rahman',
      email: 'headmaster@dhakaideal.edu.bd',
      phone: '+8801711112233',
      role: 'School Admin',
      status: 'ACTIVE',
      createdAt: '18/01/2026',
    },
    {
      id: 'usr-3',
      name: 'Nusrat Jahan Sultana',
      email: 'nusrat.sultana@dhakaideal.edu.bd',
      phone: '+8801911334455',
      role: 'Teacher',
      status: 'ACTIVE',
      createdAt: '22/01/2026',
    },
    {
      id: 'usr-4',
      name: 'Tanvir Hossain',
      email: 'tanvir@student.edu.bd',
      phone: '+8801711223344',
      role: 'Student',
      status: 'ACTIVE',
      createdAt: '01/02/2026',
    },
  ];

  const columns = [
    {
      header: 'User Name',
      cell: (row: typeof sampleUsers[0]) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-[10px] text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      cell: (row: typeof sampleUsers[0]) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
          <Shield className="w-3 h-3 text-teal-600" />
          {row.role}
        </span>
      ),
    },
    {
      header: 'Phone Number',
      accessorKey: 'phone' as const,
    },
    {
      header: 'Status',
      cell: (row: typeof sampleUsers[0]) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Joined Date',
      accessorKey: 'createdAt' as const,
    },
  ];

  const filtered = sampleUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="System accounts, administrators, teachers, and student profiles"
        breadcrumbs={[{ label: 'Users' }]}
        action={
          <button className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create System User</span>
          </button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search user by name or email..." />
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} />
    </div>
  );
}
