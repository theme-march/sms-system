'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Calendar, FileText, Receipt, BookOpen, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getStudents } from '@/src/services/student.service';

export default function StudentPortalDashboard() {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    async function loadStudentData() {
      const res = await getStudents({});
      if (res.data.length > 0) {
        setStudent(res.data[0]);
      }
    }
    loadStudentData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Scope Restriction Notification */}
      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs font-semibold text-teal-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Server Access Enforcement: Student portal is strictly isolated to own academic record & class routines.</span>
        </div>
        <span className="text-[10px] bg-teal-200 text-teal-800 px-2 py-0.5 rounded-md font-bold uppercase">Role: Student</span>
      </div>

      {/* Admit Card Clearance Check Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-emerald-900">Exam Admit Card Eligibility: CLEARED</p>
            <p className="text-[11px] text-emerald-700">All term exam fees cleared for 1st Term Final Examination 2026. Admit card is available for download.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0">
          Download Admit Card
        </button>
      </div>

      {/* Student Welcome Banner */}
      <div className="bg-teal-700 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white text-teal-700 flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
            {student?.nameEn?.[0] || 'T'}
          </div>
          <div>
            <h1 className="text-xl font-bold">Welcome back, {student?.nameEn || 'Tanvir Hossain'}!</h1>
            <p className="text-xs text-teal-100 mt-1">
              Class 10 — Padma Section | Roll Number: <strong className="text-white">#1</strong> | Code: <strong className="text-white">{student?.studentCode || 'STU-2026-1001'}</strong>
            </p>
          </div>
        </div>

        <div className="bg-white/10 p-4 rounded-xl text-xs space-y-1 backdrop-blur-xs border border-white/10">
          <p className="text-teal-100 text-[10px] uppercase font-bold">Current Academic Year</p>
          <p className="font-bold text-sm">Academic Year 2026</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Attendance</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">96.4%</p>
          <p className="text-[11px] text-emerald-600 font-bold">120 Days Present | 4 Absent</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Invoices</span>
            <Receipt className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">৳0.00</p>
          <p className="text-[11px] text-slate-500 font-medium">All fees clear for Jan 2026</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Homework</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">3</p>
          <p className="text-[11px] text-amber-600 font-bold">Due by Friday</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Upcoming Exam</span>
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-base font-bold text-slate-900 truncate">1st Term Exam</p>
          <p className="text-[11px] text-teal-700 font-bold">Starts Feb 15, 2026</p>
        </div>
      </div>

      {/* Routine & Notice Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Class Routine */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            Today's Class Schedule (Class 10 - Padma)
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">Higher Mathematics</p>
                <p className="text-[10px] text-slate-500">Teacher: Mr. Rafiqul Islam | Room 302</p>
              </div>
              <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-lg font-bold text-[10px]">09:00 AM - 09:45 AM</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">Physics</p>
                <p className="text-[10px] text-slate-500">Teacher: Dr. Nazmul Hossain | Science Lab 1</p>
              </div>
              <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-lg font-bold text-[10px]">09:45 AM - 10:30 AM</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">English First Paper</p>
                <p className="text-[10px] text-slate-500">Teacher: Mrs. Nusrat Jahan | Room 302</p>
              </div>
              <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-lg font-bold text-[10px]">10:30 AM - 11:15 AM</span>
            </div>
          </div>
        </div>

        {/* Notices */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            Student Notices & Announcements
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-teal-700 uppercase">Jan 15, 2026</span>
              <p className="font-bold text-slate-900">Science Fair Project Registration Open</p>
              <p className="text-slate-600">All students of Class 9 & 10 must register their project abstracts before January 25.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Jan 10, 2026</span>
              <p className="font-bold text-slate-900">1st Term Examination Schedule</p>
              <p className="text-slate-600">Class routines and admit cards will be issued from February 1st.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
