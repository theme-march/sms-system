'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  UserCheck,
  BookOpen,
  CalendarCheck2,
  FileSpreadsheet,
  Upload,
  MessageSquare,
  Users,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Lock,
} from 'lucide-react';
import { getTeacherWorkload, getTeacherById } from '@/src/services/staff.service';
import { canTeacherAccessResource } from '@/src/lib/permissions/teacher-access';

export default function TeacherPortalDashboard() {
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<any>(null);
  const [workload, setWorkload] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Active User Context (Default logged-in teacher Dr. Shahabuddin Ahmed tch-101)
  const currentTeacherId = 'tch-101';
  const currentUserRole = {
    userId: 'usr-tch-1',
    schoolId: 'sch-ideal-101',
    role: 'TEACHER',
    teacherId: currentTeacherId,
  };

  const fetchPortalData = async () => {
    setLoading(true);
    try {
      const [tchData, wlData] = await Promise.all([
        getTeacherById(currentTeacherId),
        getTeacherWorkload(currentTeacherId, 'sch-ideal-101'),
      ]);
      setTeacher(tchData);
      setWorkload(wlData);
      if (wlData.assignments && wlData.assignments.length > 0) {
        setSelectedSlot(wlData.assignments[0]);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
        <span>Loading Teacher Portal...</span>
      </div>
    );
  }

  const teacherName = teacher?.nameEn || 'Dr. Shahabuddin Ahmed';
  const desigName = teacher?.designation?.nameEn || teacher?.designation || 'Headmaster & Senior Faculty';

  // Perform access check on the currently selected slot
  const accessCheck = selectedSlot
    ? canTeacherAccessResource({
        user: currentUserRole,
        targetSchoolId: selectedSlot.schoolId || 'sch-ideal-101',
        classId: selectedSlot.classId,
        sectionId: selectedSlot.sectionId,
        subjectId: selectedSlot.subjectId,
        academicYearId: selectedSlot.academicYearId,
        assignments: workload?.assignments || [],
      })
    : { allowed: false, reason: 'No class selected.' };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-2xl font-bold text-teal-300 shadow-inner shrink-0">
            {teacherName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold">{teacherName}</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-md">
                TEACHER PORTAL
              </span>
            </div>
            <p className="text-xs text-teal-200/80 mt-0.5">{desigName} • Dhaka Ideal High School</p>
            <p className="text-[11px] text-teal-300/60 font-mono mt-1">Employee Code: {teacher?.employeeCode || 'EMP-T-001'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10 text-xs">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="font-bold text-amber-300">Class Teacher Responsibilities</p>
            <p className="text-[11px] text-slate-200">
              {workload?.classTeacherFor?.length > 0
                ? `Section Mentor for: ${workload.classTeacherFor.join(', ')}`
                : 'Subject Teacher'}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Classes</p>
          <p className="text-2xl font-extrabold text-slate-900">{workload?.assignedClassesCount || 0}</p>
          <p className="text-[10px] text-teal-700 font-semibold">{workload?.assignedClasses?.join(', ') || 'N/A'}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Sections</p>
          <p className="text-2xl font-extrabold text-slate-900">{workload?.assignedSectionsCount || 0}</p>
          <p className="text-[10px] text-slate-500 font-medium">Active teaching sections</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Subjects</p>
          <p className="text-2xl font-extrabold text-slate-900">{workload?.assignedSubjectsCount || 0}</p>
          <p className="text-[10px] text-slate-500 font-medium">{workload?.assignedSubjects?.join(', ') || 'N/A'}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Weekly Classes</p>
          <p className="text-2xl font-extrabold text-teal-700">{workload?.totalClassesPerWeek || 0}</p>
          <p className="text-[10px] text-teal-700 font-semibold">Scheduled periods</p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Assigned Slots Selector */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Assigned Classes ({workload?.assignments?.length || 0})</span>
            </h3>
          </div>

          {!workload?.assignments || workload.assignments.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">No active class assignments.</p>
          ) : (
            <div className="space-y-2">
              {workload.assignments.map((asgn: any) => {
                const isSelected = selectedSlot?.id === asgn.id;

                return (
                  <button
                    key={asgn.id}
                    onClick={() => setSelectedSlot(asgn)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs space-y-1 ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">
                        {asgn.class?.name || 'Class 10'} - {asgn.section?.name || 'Padma'}
                      </span>
                      {asgn.isClassTeacher && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold text-amber-800 bg-amber-100 rounded-md">
                          Class Teacher
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-teal-700">{asgn.subject?.nameEn || 'Subject'}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Academic Year: {asgn.academicYear?.name || '2026-2027'}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Assigned Class Teacher Actions & Access Control Panel */}
        <div className="lg:col-span-2 space-y-4">
          {selectedSlot ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedSlot.class?.name} ({selectedSlot.section?.name}) — {selectedSlot.subject?.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500">
                    School Scope: Dhaka Ideal High School • Academic Year: {selectedSlot.academicYear?.name || '2026-2027'}
                  </p>
                </div>

                {accessCheck.allowed ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Access Authorized
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-bold">
                    <Lock className="w-4 h-4 text-rose-600" />
                    Access Restricted
                  </span>
                )}
              </div>

              {!accessCheck.allowed ? (
                <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-rose-900 text-xs">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>Access Restricted for Unassigned Teacher</span>
                  </div>
                  <p>{accessCheck.reason}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Authorized Teacher Management Console:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <Link
                      href={`/dashboard/students?classId=${selectedSlot.classId}&sectionId=${selectedSlot.sectionId}`}
                      className="p-4 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 rounded-xl transition-all flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-700">View Assigned Students</h4>
                        <p className="text-[11px] text-slate-500">Access student roster & guardian details</p>
                      </div>
                    </Link>

                    <Link
                      href={`/dashboard/attendance?classId=${selectedSlot.classId}&sectionId=${selectedSlot.sectionId}`}
                      className="p-4 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 rounded-xl transition-all flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <CalendarCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-700">Take Class Attendance</h4>
                        <p className="text-[11px] text-slate-500">Record daily present, absent, and leave statuses</p>
                      </div>
                    </Link>

                    <Link
                      href={`/dashboard/exams?classId=${selectedSlot.classId}&subjectId=${selectedSlot.subjectId}`}
                      className="p-4 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 rounded-xl transition-all flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-700">Enter Exam Marks</h4>
                        <p className="text-[11px] text-slate-500">Input continuous evaluation & term grades</p>
                      </div>
                    </Link>

                    <Link
                      href={`/dashboard/homework?classId=${selectedSlot.classId}&subjectId=${selectedSlot.subjectId}`}
                      className="p-4 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 rounded-xl transition-all flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-700">Create Homework</h4>
                        <p className="text-[11px] text-slate-500">Publish homework assignments & deadlines</p>
                      </div>
                    </Link>

                    <div className="p-4 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 rounded-xl transition-all flex items-center gap-3 group cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-700">Upload Study Materials</h4>
                        <p className="text-[11px] text-slate-500">Share lecture notes, PDFs, and slide decks</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 rounded-xl transition-all flex items-center gap-3 group cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-700">Communicate with Guardians</h4>
                        <p className="text-[11px] text-slate-500">Send progress notices and feedback</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 bg-white rounded-xl border border-slate-200 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Select an assigned class on the left to launch console.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
