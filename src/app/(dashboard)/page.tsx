import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Users,
  DollarSign,
  CalendarCheck2,
  UserPlus,
  Receipt,
  FileSpreadsheet,
  Settings,
  ArrowUpRight,
  School,
} from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { getStudents } from '@/src/services/student.service';
import { getAttendanceStats } from '@/src/services/attendance.service';
import { getFeeOverview } from '@/src/services/fee.service';
import { formatCurrency } from '@/src/lib/utils';

export default async function DashboardPage() {
  const studentsRes = await getStudents({ pageSize: 5 });
  const attendance = await getAttendanceStats();
  const fee = await getFeeOverview();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Dhaka Ideal Model High School & College | Academic Session 2026"
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admissions"
              className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Admission</span>
            </Link>
            <Link
              href="/dashboard/fees"
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5 text-teal-600" />
              <span>Collect Fee</span>
            </Link>
          </div>
        }
      />

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={attendance.totalStudents}
          icon={GraduationCap}
          change="+12% YoY"
          trend="up"
          description="Enrolled in Academic Session 2026"
        />
        <StatCard
          title="Total Teachers"
          value={48}
          icon={Users}
          change="Full Faculty"
          trend="neutral"
          description="Headmaster & Assistant Teachers"
        />
        <StatCard
          title="Fee Collections (BDT)"
          value={formatCurrency(fee.collectedAmount)}
          icon={DollarSign}
          change="+18.4%"
          trend="up"
          description="Total tuition & admission fees"
        />
        <StatCard
          title="Today's Attendance"
          value={attendance.rate}
          icon={CalendarCheck2}
          change="High"
          trend="up"
          description={`${attendance.presentToday} students present today`}
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Student Admissions Table (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Highlight Event Banner */}
          <div className="bg-teal-800 text-white p-6 rounded-xl shadow-md border-l-4 border-teal-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-300 bg-teal-900/60 px-2.5 py-1 rounded">
                Upcoming Academic Event
              </span>
              <h3 className="text-base font-bold text-white mt-2">
                Annual Examinations 2026 & Result Publication
              </h3>
              <p className="text-xs text-teal-100 mt-1">
                Admit cards distribution begins November 15, 2026. Verify student fee clearances.
              </p>
            </div>
            <Link
              href="/dashboard/exams"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs font-bold rounded-lg transition-colors whitespace-nowrap self-start sm:self-center shrink-0"
            >
              View Routine
            </Link>
          </div>

          {/* Recent Student Admissions Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Recent Student Admissions</h2>
                <p className="text-xs text-slate-500">Newly registered students for Session 2026</p>
              </div>
              <Link
                href="/dashboard/students"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[11px] text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                    <th className="px-3.5 py-3">Student ID</th>
                    <th className="px-3.5 py-3">Name</th>
                    <th className="px-3.5 py-3">Class / Section</th>
                    <th className="px-3.5 py-3">Roll</th>
                    <th className="px-3.5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsRes.data.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3.5 py-3 font-bold text-teal-700">{st.studentId}</td>
                      <td className="px-3.5 py-3 font-semibold text-slate-900">{st.user.name}</td>
                      <td className="px-3.5 py-3 text-slate-600">
                        {st.class.name} - {st.section.name}
                      </td>
                      <td className="px-3.5 py-3 font-semibold text-slate-800">#{st.rollNumber}</td>
                      <td className="px-3.5 py-3">
                        <StatusBadge status={st.user.status || 'ACTIVE'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar Widget Column */}
        <div className="space-y-6">
          {/* School Attendance & Fee Overview Widget */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              School Metrics Breakdown
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Student Attendance Rate</span>
                  <span className="text-teal-600 font-bold">{attendance.rate}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full w-[94%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Fee Collection Clearance</span>
                  <span className="text-indigo-600 font-bold">78%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[78%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Faculty Presence</span>
                  <span className="text-emerald-600 font-bold">100%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[100%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Management Tools
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/dashboard/attendance"
                className="p-3 rounded-lg bg-slate-50 hover:bg-teal-50/50 border border-slate-200/60 transition-all text-left group"
              >
                <CalendarCheck2 className="w-4 h-4 text-teal-600 mb-1" />
                <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700">Roll Call</p>
                <p className="text-[10px] text-slate-400">Mark daily attendance</p>
              </Link>

              <Link
                href="/dashboard/exams"
                className="p-3 rounded-lg bg-slate-50 hover:bg-teal-50/50 border border-slate-200/60 transition-all text-left group"
              >
                <FileSpreadsheet className="w-4 h-4 text-teal-600 mb-1" />
                <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700">Enter Marks</p>
                <p className="text-[10px] text-slate-400">Exam result sheets</p>
              </Link>

              <Link
                href="/dashboard/payroll"
                className="p-3 rounded-lg bg-slate-50 hover:bg-teal-50/50 border border-slate-200/60 transition-all text-left group"
              >
                <DollarSign className="w-4 h-4 text-teal-600 mb-1" />
                <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700">Pay Slips</p>
                <p className="text-[10px] text-slate-400">Generate monthly payroll</p>
              </Link>

              <Link
                href="/dashboard/settings"
                className="p-3 rounded-lg bg-slate-50 hover:bg-teal-50/50 border border-slate-200/60 transition-all text-left group"
              >
                <Settings className="w-4 h-4 text-teal-600 mb-1" />
                <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700">Settings</p>
                <p className="text-[10px] text-slate-400">EIIN & School Profile</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
