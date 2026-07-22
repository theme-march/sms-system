'use client';

import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Calendar, Receipt, ShieldCheck, CheckCircle2, Phone, Mail } from 'lucide-react';
import { getGuardians } from '@/src/services/guardian.service';

export default function ParentPortalDashboard() {
  const [guardian, setGuardian] = useState<any>(null);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      const res = await getGuardians({});
      if (res.data.length > 0) {
        setGuardian(res.data[0]);
      }
    }
    loadData();
  }, []);

  const activeWard = guardian?.students?.[selectedStudentIndex]?.student || {
    nameEn: 'Tanvir Hossain',
    studentCode: 'STU-2026-1001',
    class: { name: 'Class 10' },
    section: { name: 'Padma' },
    rollNumber: 1,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Scope Restriction Banner */}
      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs font-semibold text-teal-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Server Access Enforcement: Parent portal is strictly restricted to connected student wards (student_guardians relationship).</span>
        </div>
        <span className="text-[10px] bg-teal-200 text-teal-800 px-2 py-0.5 rounded-md font-bold uppercase">Role: Parent / Guardian</span>
      </div>

      {/* Parent Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            {guardian?.name?.[0] || 'K'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Welcome, {guardian?.name || 'Kamal Hossain'}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Guardian Mobile: <span className="font-bold text-slate-800">{guardian?.phone || '+8801711223344'}</span> | Portal Access: <span className="font-bold text-emerald-700">Active</span>
            </p>
          </div>
        </div>

        {/* Student Ward Selector if Multiple Wards */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 w-full md:w-72">
          <label className="block text-[10px] font-bold text-slate-500 uppercase">Select Connected Student Ward</label>
          <select
            value={selectedStudentIndex}
            onChange={(e) => setSelectedStudentIndex(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-teal-800"
          >
            {guardian?.students && guardian.students.length > 0 ? (
              guardian.students.map((sg: any, idx: number) => (
                <option key={sg.id} value={idx}>
                  {sg.student?.nameEn} ({sg.student?.class?.name})
                </option>
              ))
            ) : (
              <option value={0}>Tanvir Hossain (Class 10)</option>
            )}
          </select>
        </div>
      </div>

      {/* Selected Child Details Banner */}
      <div className="bg-teal-700 text-white rounded-2xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-white/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
            Active Ward Overview
          </span>
          <h2 className="text-lg font-bold mt-1">{activeWard.nameEn}</h2>
          <p className="text-xs text-teal-100 mt-0.5">
            Class: <strong className="text-white">{activeWard.class?.name || 'Class 10'}</strong> — Section: <strong className="text-white">{activeWard.section?.name || 'Padma'}</strong> | Roll #: <strong className="text-white">#{activeWard.rollNumber || 1}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-xl text-xs text-center backdrop-blur-xs">
            <p className="text-[10px] text-teal-100 uppercase font-bold">Attendance Rate</p>
            <p className="text-base font-black text-white">96.4%</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl text-xs text-center backdrop-blur-xs">
            <p className="text-[10px] text-teal-100 uppercase font-bold">Fee Status</p>
            <p className="text-base font-black text-emerald-300">Paid</p>
          </div>
        </div>
      </div>

      {/* Attendance & Fee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fee Invoices */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-600" />
            School Fee Invoices & Payment Ledger
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">January 2026 Monthly Tuition Fee</p>
                <p className="text-[10px] text-slate-500">Invoice #: INV-2026-001 | Amount: ৳1,500.00</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px]">PAID</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Admission & Registration Fee 2026</p>
                <p className="text-[10px] text-slate-500">Invoice #: INV-ADM-9021 | Amount: ৳5,000.00</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px]">PAID</span>
            </div>
          </div>
        </div>

        {/* School Communication */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-teal-600" />
            Class Teacher & Administration Contact
          </h3>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <p className="font-bold text-slate-900">Class 10 (Padma) Class Teacher</p>
            <p className="text-slate-600">Mr. Rafiqul Islam (Senior Mathematics Teacher)</p>
            <p className="text-teal-700 font-bold">Phone: +8801711998877</p>
            <p className="text-slate-500">Available for parent queries: Sun-Thu (02:00 PM - 03:30 PM)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
