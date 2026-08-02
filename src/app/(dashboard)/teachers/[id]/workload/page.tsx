'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  BookOpen,
  Calendar,
  Users,
  ChevronLeft,
  Loader2,
  Clock,
  Award,
  CheckCircle,
} from 'lucide-react';
import { getTeacherWorkload, getTeacherById } from '@/src/services/staff.service';

export default function TeacherWorkloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [workload, setWorkload] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);

  const fetchWorkload = async () => {
    setLoading(true);
    try {
      const [tchData, wlData] = await Promise.all([
        getTeacherById(id),
        getTeacherWorkload(id),
      ]);
      setTeacher(tchData);
      setWorkload(wlData);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkload();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
        <span>Loading workload allocation...</span>
      </div>
    );
  }

  const name = teacher?.nameEn || teacher?.user?.name || 'Teacher';
  const desigName = teacher?.designation?.nameEn || teacher?.designation || 'Faculty Member';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/teachers/${id}`}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Teacher Profile</span>
        </Link>
      </div>

      <PageHeader
        title={`Class Workload & Subject Allocations: ${name}`}
        subtitle={`Teaching schedule, subject responsibilities, and class teacher duties for ${desigName}`}
        breadcrumbs={[
          { label: 'Teachers', href: '/dashboard/teachers' },
          { label: name, href: `/dashboard/teachers/${id}` },
          { label: 'Workload' },
        ]}
      />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Weekly Periods</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{workload?.totalClassesPerWeek || 0}</p>
          <p className="text-[10px] text-teal-700 font-semibold">Estimated weekly period load</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Assigned Classes</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{workload?.assignedClassesCount || 0}</p>
          <p className="text-[10px] text-slate-500 font-medium">Distinct academic levels</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Assigned Subjects</span>
            <BookOpen className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{workload?.assignedSubjectsCount || 0}</p>
          <p className="text-[10px] text-slate-500 font-medium">Core courses taught</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Class Teacher For</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{workload?.classTeacherFor?.length || 0}</p>
          <p className="text-[10px] text-amber-700 font-semibold">Primary Section Mentor</p>
        </div>
      </div>

      {/* Class Teacher Duties Section */}
      {workload?.classTeacherFor && workload.classTeacherFor.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-xs text-amber-900 shadow-2xs">
          <Award className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">Designated Class Teacher Responsibility</p>
            <p className="text-amber-800">
              {name} serves as primary Class Teacher for:{' '}
              <span className="font-bold">{workload.classTeacherFor.join(', ')}</span>. Responsible for section attendance, student counseling, and parent communications.
            </p>
          </div>
        </div>
      )}

      {/* Assignments Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Assigned Teaching Slots ({workload?.assignments?.length || 0})</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">{workload?.assignments?.[0]?.academicYear?.name || 'No academic year assigned'}</span>
        </div>

        {!workload?.assignments || workload.assignments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No class assignments found for this teacher.</p>
            <p className="text-xs">Assign classes and subjects from the Teacher Assignments module.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Academic Year</th>
                  <th className="px-4 py-3">Class & Section</th>
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Class Teacher?</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workload.assignments.map((asgn: any) => (
                  <tr key={asgn.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {asgn.academicYear?.name || '2026-2027'}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {asgn.class?.name || 'Class'} - Section {asgn.section?.name || 'A'}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {asgn.group?.name || 'General / N/A'}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-teal-700">
                      {asgn.subject?.nameEn || 'Subject'}
                    </td>
                    <td className="px-4 py-3.5">
                      {asgn.isClassTeacher ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200">
                          <CheckCircle className="w-3 h-3 text-amber-600" />
                          Class Teacher
                        </span>
                      ) : (
                        <span className="text-slate-400">Subject Teacher</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={asgn.status || 'ACTIVE'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
