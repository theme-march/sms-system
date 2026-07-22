'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserPlus, FileSpreadsheet, Download, Printer, Eye, Search, Filter } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { getStudents } from '@/src/services/student.service';
import { exportToExcel } from '@/src/lib/export';
import { generatePDF } from '@/src/lib/pdf';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getStudents({
        search,
        classId: classFilter,
        status: statusFilter,
      });
      setStudents(res.data);
      setLoading(false);
    }
    loadData();
  }, [search, classFilter, statusFilter]);

  const handleExportExcel = () => {
    const exportData = students.map((s) => ({
      AdmissionNo: s.admissionNumber || s.studentId,
      StudentCode: s.studentCode || s.id,
      NameEN: s.nameEn || s.user?.name,
      NameBN: s.nameBn || '-',
      Class: s.class?.name || 'Class 10',
      Section: s.section?.name || 'Padma',
      Roll: s.rollNumber || '-',
      Phone: s.phone || s.user?.phone || '-',
      Status: s.status || 'ACTIVE',
    }));
    exportToExcel('Student_Directory_2026', 'Students', exportData);
  };

  const handleExportPDF = () => {
    const cols = [
      { header: 'Admission #', dataKey: 'admNo' },
      { header: 'Student Code', dataKey: 'code' },
      { header: 'Name', dataKey: 'name' },
      { header: 'Class & Section', dataKey: 'cls' },
      { header: 'Roll', dataKey: 'roll' },
      { header: 'Phone', dataKey: 'phone' },
    ];
    const pdfData = students.map((s) => ({
      admNo: s.admissionNumber || s.studentId || '-',
      code: s.studentCode || s.id,
      name: s.nameEn || s.user?.name,
      cls: `${s.class?.name || 'Class 10'} (${s.section?.name || 'Padma'})`,
      roll: `#${s.rollNumber || '-'}`,
      phone: s.phone || s.user?.phone || '-',
    }));
    generatePDF('Student Directory 2026', 'Dhaka Ideal Model High School & College', cols, pdfData);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <PageHeader
        title="Student Directory & Enrollment Records"
        subtitle="Enrolled student database, class assignments, roll numbers, guardian contacts & status tracking"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print PDF
            </button>
            <Link
              href="/dashboard/admissions"
              className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Online Admissions
            </Link>
          </div>
        }
      />

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name (EN/BN), admission #, student code, roll, phone..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
          >
            <option value="">All Classes</option>
            <option value="cls-10">Class 10</option>
            <option value="cls-9">Class 9</option>
            <option value="cls-8">Class 8</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="GRADUATED">Graduated</option>
            <option value="TRANSFERRED">Transferred</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Admission # & Code</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Class & Section</th>
                <th className="p-3">Roll #</th>
                <th className="p-3">Primary Guardian</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Loading student directory...
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-teal-700">{s.admissionNumber || s.studentId}</p>
                      <p className="text-[10px] text-slate-400">Code: {s.studentCode || s.id}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{s.nameEn || s.user?.name}</p>
                      <p className="text-[10px] text-slate-400">{s.nameBn || s.user?.email || s.phone}</p>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {s.class?.name || 'Class 10'} — {s.section?.name || 'Padma'}
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{s.rollNumber || 1}
                      </span>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-800">
                        {s.guardians?.[0]?.guardian?.name || s.fatherName || 'Kamal Hossain'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {s.guardians?.[0]?.guardian?.phone || s.emergencyPhone || '+8801711223344'}
                      </p>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={s.status || 'ACTIVE'} />
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/dashboard/students/${s.id}`}
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
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No students found matching filters.
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
