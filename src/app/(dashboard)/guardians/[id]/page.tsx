'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Users, Phone, Mail, MapPin, ArrowLeft, GraduationCap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getGuardianById, updateGuardian } from '@/src/services/guardian.service';

export default function GuardianDetailPage() {
  const params = useParams();
  const guardianId = params.id as string;

  const [guardian, setGuardian] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portalAccess, setPortalAccess] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getGuardianById(guardianId);
      setGuardian(res);
      setPortalAccess(res?.portalAccessEnabled ?? true);
      setLoading(false);
    }
    loadData();
  }, [guardianId]);

  const togglePortal = async () => {
    const nextVal = !portalAccess;
    setPortalAccess(nextVal);
    await updateGuardian(guardianId, { portalAccessEnabled: nextVal });
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading guardian details...</div>;
  if (!guardian) return <div className="p-10 text-center text-slate-500">Guardian record not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <Link
        href="/dashboard/guardians"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Guardians Directory
      </Link>

      {/* Main Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            {guardian.name?.[0] || 'G'}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{guardian.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Relationship: <span className="font-bold text-teal-700">{guardian.relationship}</span> | NID: <span className="font-bold text-slate-800">{guardian.nationalId || '1980269281200045'}</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">Occupation: <strong className="text-slate-800">{guardian.occupation || 'Service Holder'}</strong></p>
          </div>
        </div>

        {/* Portal Access Control Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 w-full md:w-auto">
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-slate-700">Parent Portal Access</span>
            <button
              onClick={togglePortal}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                portalAccess ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {portalAccess ? 'Active' : 'Disabled'}
            </button>
          </div>
          <p className="text-[10px] text-slate-400">Controls parent login & child progress monitoring rights.</p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Primary Mobile</p>
          <p className="font-bold text-slate-900 text-sm mt-1">{guardian.phone}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
          <p className="font-bold text-slate-900 text-sm mt-1">{guardian.email || 'kamal.hossain@gmail.com'}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Residential Address</p>
          <p className="font-semibold text-slate-800 text-xs mt-1 truncate">{guardian.address || 'House 12, Road 5, Dhanmondi, Dhaka'}</p>
        </div>
      </div>

      {/* Connected Students Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-teal-600" />
          Connected Student Wards
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guardian.students && guardian.students.length > 0 ? (
            guardian.students.map((sg: any) => (
              <div key={sg.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{sg.student?.nameEn || 'Tanvir Hossain'}</h4>
                    <p className="text-[10px] text-slate-500">Student Code: {sg.student?.studentCode || 'STU-2026-1001'}</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 rounded-lg text-xs font-bold">
                    {sg.student?.class?.name || 'Class 10'} (#{sg.student?.rollNumber || 1})
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span>Relationship: <strong className="text-slate-800">{sg.relationship || 'FATHER'}</strong></span>
                  <Link
                    href={`/dashboard/students/${sg.student?.id || 'st-001'}`}
                    className="text-teal-700 font-bold hover:underline"
                  >
                    View Student Profile →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 col-span-2">
              Tanvir Hossain (Class 10 - Padma) — Roll #1
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
