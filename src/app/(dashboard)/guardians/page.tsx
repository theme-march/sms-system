'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, Eye, Phone, ShieldCheck, UserCheck } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { getGuardians } from '@/src/services/guardian.service';

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getGuardians({ search });
      setGuardians(res.data);
      setLoading(false);
    }
    loadData();
  }, [search]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <PageHeader
        title="Guardians Directory"
        subtitle="Manage parents/guardians, emergency contacts, portal access, and connected student records"
      />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guardian name, phone, email, or national ID..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Guardian Name</th>
                <th className="p-3">Phone & Email</th>
                <th className="p-3">Occupation & NID</th>
                <th className="p-3">Connected Students</th>
                <th className="p-3">Portal Access</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading guardians directory...
                  </td>
                </tr>
              ) : guardians.length > 0 ? (
                guardians.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{g.name}</p>
                      <p className="text-[10px] text-slate-400">Relation: {g.relationship}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-800">{g.phone}</p>
                      <p className="text-[10px] text-slate-400">{g.email || 'N/A'}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-800">{g.occupation || 'N/A'}</p>
                      <p className="text-[10px] text-slate-400">NID: {g.nationalId || 'N/A'}</p>
                    </td>
                    <td className="p-3">
                      {g.students && g.students.length > 0 ? (
                        g.students.map((sg: any) => (
                          <div key={sg.id} className="text-xs">
                            <span className="font-bold text-teal-700">{sg.student?.nameEn || 'Unlinked student'}</span>
                            <span className="text-[10px] text-slate-400 ml-1">({sg.student?.class?.name || '—'})</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                        {g.portalAccessEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/dashboard/guardians/${g.id}`}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold rounded-lg text-xs inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No guardians found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
