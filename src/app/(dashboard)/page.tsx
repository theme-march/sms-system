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
import { getSchoolProfile } from '@/src/services/school.service';
import { getCurrentSession } from '@/src/lib/auth/session';
import { getDashboardAnalytics } from '@/src/services/analytics.service';
import { formatCurrency } from '@/src/lib/utils';
import { redirect } from 'next/navigation';
import { canAccessPermission } from '@/src/config/access-control';
import { PERMISSIONS } from '@/src/config/permissions';

export default async function DashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const managementRoles = [
    'Super Admin',
    'School Admin',
    'Academic Admin',
    'Admission Officer',
    'Accountant',
    'HR Manager',
  ];
  const isTeacherOnly =
    session.roles.includes('Teacher') &&
    !session.roles.some((role) => managementRoles.includes(role));

  if (isTeacherOnly) redirect('/teacher');
  const isStudentOnly =
    session.roles.includes('Student') &&
    !session.roles.some((role) => managementRoles.includes(role));
  if (isStudentOnly) redirect('/student');

  const canViewManagementDashboard =
    session.roles.includes('Super Admin') ||
    session.permissions.includes('dashboard.view');

  if (!canViewManagementDashboard) {
    if (session.roles.includes('Teacher')) redirect('/teacher');
    if (session.roles.includes('Student')) redirect('/student');
    if (session.roles.includes('Parent/Guardian')) redirect('/guardian');
    if (session.roles.includes('Employee')) redirect('/staff/leave');
    redirect('/login');
  }

  const schoolId = session?.schoolId ?? undefined;
  const [studentsRes, school, analytics] = await Promise.all([
    getStudents({ pageSize: 5, schoolId }),
    getSchoolProfile(schoolId),
    getDashboardAnalytics(),
  ]);
  const feeTotal = analytics.tuitionCollected + analytics.currentMonthDues;
  const feeClearance = feeTotal > 0 ? Math.round((analytics.tuitionCollected / feeTotal) * 100) : 0;
  const academicYear = school?.settings?.academicYear || new Date().getFullYear().toString();
  const upcomingExam = analytics.upcomingExams[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        subtitle={`${school?.name || 'School Management System'} | Academic Session ${academicYear}`}
        action={
          <div className="flex items-center gap-2">
            {canAccessPermission(session.permissions, session.roles, PERMISSIONS.ADMISSIONS_MANAGE) && (
            <Link
              href="/dashboard/admissions"
              className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Admission</span>
            </Link>
            )}
            {canAccessPermission(session.permissions, session.roles, PERMISSIONS.PAYMENTS_COLLECT) && (
            <Link
              href="/dashboard/fees"
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5 text-teal-600" />
              <span>Collect Fee</span>
            </Link>
            )}
          </div>
        }
      />

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={analytics.totalStudents}
          icon={GraduationCap}
          change="+12% YoY"
          trend="up"
          description={`Enrolled in Academic Session ${academicYear}`}
        />
        <StatCard
          title="Total Teachers"
          value={analytics.totalTeachers}
          icon={Users}
          change="Active records"
          trend="neutral"
          description="Teaching faculty in MySQL"
        />
        <StatCard
          title="Fee Collections (BDT)"
          value={formatCurrency(analytics.tuitionCollected)}
          icon={DollarSign}
          change={`${feeClearance}% cleared`}
          trend="neutral"
          description="Total tuition & admission fees"
        />
        <StatCard
          title="Today's Attendance"
          value={`${analytics.attendance.rate}%`}
          icon={CalendarCheck2}
          change="High"
          trend="up"
          description={`${analytics.attendance.present} present · ${analytics.attendance.absent} absent`}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {[
          ['Active Students', analytics.activeStudents],
          ['Employees', analytics.totalEmployees],
          ['Guardians', analytics.totalGuardians],
          ['New Admissions', analytics.newAdmissions],
          ['Pending Admissions', analytics.pendingAdmissionApplications],
          ['Tuition Invoiced', formatCurrency(analytics.tuitionInvoiced)],
          ['Current Dues', formatCurrency(analytics.currentMonthDues)],
          ['Exam Fees', formatCurrency(analytics.examFeeCollection)],
          ['Monthly Income', formatCurrency(analytics.monthlyIncome)],
          ['Monthly Expense', formatCurrency(analytics.monthlyExpense)],
          ['Monthly Payroll', formatCurrency(analytics.currentMonthPayroll)],
          ['Unpaid Salaries', analytics.unpaidSalaries],
          ['Pending Leave', analytics.pendingLeaveApplications],
          ['Upcoming Exams', analytics.upcomingExams.length],
          ['Attendance Recorded', analytics.attendance.recorded],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
            <p className="mt-1 text-lg font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Activities</h2>
            <p className="text-xs text-slate-500">Latest audited actions from MySQL</p>
          </div>
          <Link href="/dashboard/audit" className="text-xs font-semibold text-teal-600 hover:text-teal-700">View audit log</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {analytics.recentActivities.length ? analytics.recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start justify-between gap-4 py-3 text-xs">
              <div>
                <p className="font-semibold text-slate-800">{activity.action} · {activity.module}</p>
                <p className="mt-0.5 line-clamp-1 text-slate-500">{activity.details || 'No additional details'}</p>
              </div>
              <time className="shrink-0 text-slate-400">{new Date(activity.createdAt).toLocaleString()}</time>
            </div>
          )) : <p className="py-6 text-center text-xs text-slate-400">No recent activity recorded.</p>}
        </div>
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
                {upcomingExam?.name || 'No upcoming examination scheduled'}
              </h3>
              <p className="text-xs text-teal-100 mt-1">
                {upcomingExam
                  ? `${upcomingExam.term} · ${upcomingExam.startDate.toLocaleDateString()}–${upcomingExam.endDate.toLocaleDateString()}`
                  : 'Create an examination schedule from the Exams module.'}
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
                <p className="text-xs text-slate-500">Newly registered students for Session {academicYear}</p>
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
                      <td className="px-3.5 py-3 font-bold text-teal-700">{st.admissionNumber || st.studentCode || '-'}</td>
                      <td className="px-3.5 py-3 font-semibold text-slate-900">{st.user?.name || st.nameEn || '-'}</td>
                      <td className="px-3.5 py-3 text-slate-600">
                        {st.class?.name || '-'} {st.section ? `- ${st.section.name}` : ''}
                      </td>
                      <td className="px-3.5 py-3 font-semibold text-slate-800">#{st.rollNumber || '-'}</td>
                      <td className="px-3.5 py-3">
                        <StatusBadge status={st.user?.status || st.status || 'ACTIVE'} />
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
                  <span className="text-teal-600 font-bold">{analytics.attendance.rate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full" style={{ width: `${analytics.attendance.rate}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Fee Collection Clearance</span>
                  <span className="text-indigo-600 font-bold">{feeClearance}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${feeClearance}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Faculty Presence</span>
                  <span className="text-emerald-600 font-bold">{analytics.totalTeachers}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: analytics.totalTeachers ? '100%' : '0%' }} />
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
