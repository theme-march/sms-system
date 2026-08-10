import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarCheck2,
  CalendarClock,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  FileSpreadsheet,
  GraduationCap,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import prisma from "@/src/lib/db/prisma";
import { getCurrentSession } from "@/src/lib/auth/session";
import { DatabaseEmptyState } from "@/src/components/ui/DatabaseEmptyState";

const DHAKA_TIME_ZONE = "Asia/Dhaka";

function dhakaDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DHAKA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return { year: value("year"), month: value("month"), day: value("day") };
}

function dhakaBoundary(year: string, month: string, day: string) {
  return new Date(`${year}-${month}-${day}T00:00:00+06:00`);
}

function displayDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: DHAKA_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function money(value: unknown, currency: string) {
  const amount = Number(value || 0);
  return `${currency} ${amount.toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
}

export default async function TeacherPortalDashboard() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect("/login");

  const teacher = await prisma.teacher.findFirst({
    where: { userId: session.id, schoolId: session.schoolId, status: "ACTIVE" },
    include: {
      school: { select: { name: true, settings: { select: { currency: true } } } },
      department: true,
      designation: true,
      assignments: {
        where: { status: "ACTIVE" },
        include: {
          academicYear: true,
          class: true,
          section: true,
          subject: true,
        },
        orderBy: [{ isClassTeacher: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!teacher) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 pt-10">
        <div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs font-semibold text-teal-900">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          Your account is protected and can only show a linked teacher profile.
        </div>
        <DatabaseEmptyState
          title={`Welcome, ${session.name}`}
          description="This login is not linked to a teacher profile yet. Ask the School Admin to link this user account from Teachers Roster."
        />
      </div>
    );
  }

  const now = new Date();
  const { year, month, day } = dhakaDateParts(now);
  const todayStart = dhakaBoundary(year, month, day);
  const tomorrow = new Date(todayStart);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const monthStart = dhakaBoundary(year, month, "01");
  const nextMonth = new Date(monthStart);
  nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: DHAKA_TIME_ZONE,
    weekday: "long",
  })
    .format(now)
    .toUpperCase();

  const enrollmentScopes = teacher.assignments.map((assignment) => ({
    academicYearId: assignment.academicYearId,
    classId: assignment.classId,
    sectionId: assignment.sectionId,
  }));

  const [routines, homeworks, attendance, leaveApplications, latestPayroll, enrollments] =
    await Promise.all([
      prisma.routine.findMany({
        where: { teacherId: teacher.id, dayOfWeek: weekday },
        include: { class: true, section: true, subject: true },
        orderBy: { startTime: "asc" },
      }),
      prisma.homework.findMany({
        where: { teacherId: teacher.id, dueDate: { gte: todayStart } },
        include: { class: true, section: true, subject: true },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),
      prisma.teacherAttendance.findMany({
        where: {
          schoolId: teacher.schoolId,
          teacherId: teacher.id,
          date: { gte: monthStart, lt: nextMonth },
        },
        orderBy: { date: "desc" },
      }),
      prisma.leaveApplication.findMany({
        where: { schoolId: teacher.schoolId, userId: session.id },
        orderBy: { appliedAt: "desc" },
        take: 3,
      }),
      prisma.payroll.findFirst({
        where: { schoolId: teacher.schoolId, userId: session.id },
        orderBy: { createdAt: "desc" },
      }),
      enrollmentScopes.length
        ? prisma.studentEnrollment.findMany({
            where: { schoolId: teacher.schoolId, enrollmentStatus: "ACTIVE", OR: enrollmentScopes },
            select: { studentId: true },
          })
        : Promise.resolve([]),
    ]);

  const payrollPeriod = latestPayroll
    ? await prisma.payrollPeriod.findUnique({ where: { id: latestPayroll.payrollPeriodId } })
    : null;
  const todayAttendance = attendance.find(
    (record) => record.date >= todayStart && record.date < tomorrow,
  );
  const classCount = new Set(teacher.assignments.map((item) => item.classId)).size;
  const subjectCount = new Set(teacher.assignments.map((item) => item.subjectId)).size;
  const studentCount = new Set(enrollments.map((item) => item.studentId)).size;
  const presentDays = attendance.filter((item) =>
    ["present", "late"].includes(item.status.toLowerCase()),
  ).length;
  const pendingLeaveCount = leaveApplications.filter(
    (item) => item.status.toUpperCase() === "PENDING",
  ).length;
  const attendanceRate = attendance.length
    ? Math.round((presentDays / attendance.length) * 100)
    : 0;
  const initials = teacher.nameEn
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <section className="dashboard-hero overflow-hidden rounded-2xl text-white shadow-sm">
        <div className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="dashboard-hero-panel flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border text-xl font-black">
              {initials || "T"}
            </div>
            <div>
              <p className="dashboard-hero-muted text-[10px] font-bold uppercase tracking-[0.2em]">
                Personal Teacher Dashboard
              </p>
              <h1 className="mt-1 text-xl font-black sm:text-2xl">Welcome, {teacher.nameEn}</h1>
              <p className="dashboard-hero-muted mt-1 text-xs">
                {teacher.designation?.nameEn || "Teacher"} · {teacher.department?.nameEn || "Academic Department"} · {teacher.school.name}
              </p>
            </div>
          </div>
          <div className="dashboard-hero-panel rounded-xl border px-4 py-3 text-xs">
            <p className="font-bold text-white">Employee ID: {teacher.employeeCode}</p>
            <p className="dashboard-hero-muted mt-1">Today: {displayDate(now)}</p>
          </div>
        </div>
        <div className="grid border-t border-white/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          <ProfileDetail icon={BriefcaseBusiness} label="Specialization" value={teacher.specialization || "Not specified"} />
          <ProfileDetail icon={Phone} label="Phone" value={teacher.phone} />
          <ProfileDetail icon={Mail} label="Email" value={teacher.email || "Not provided"} />
          <ProfileDetail icon={UserCheck} label="Today's attendance" value={todayAttendance?.status || "Not recorded"} />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={BookOpen} label="Assigned classes" value={classCount} detail={`${subjectCount} subjects`} />
        <Metric icon={Users} label="My students" value={studentCount} detail="Across active assignments" />
        <Metric icon={CalendarClock} label="Classes today" value={routines.length} detail={weekday.charAt(0) + weekday.slice(1).toLowerCase()} />
        <Metric icon={CalendarCheck2} label="Monthly attendance" value={`${attendanceRate}%`} detail={`${presentDays} of ${attendance.length} recorded days`} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Clock3 className="h-4 w-4 text-teal-600" /> Today's class schedule
            </h2>
            <p className="mt-1 text-xs text-slate-500">Only classes assigned to you are shown here.</p>
          </div>
          <Link href="/dashboard/routines" className="text-xs font-bold text-teal-700 hover:text-teal-800">
            Full routine
          </Link>
        </div>
        {!routines.length ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-xs text-slate-500">
            No classes are scheduled for you today.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {routines.map((routine, index) => (
              <article key={routine.id} className="flex gap-3 rounded-xl border border-slate-200 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-xs font-black text-teal-700">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">{routine.subject.nameEn}</p>
                  <p className="mt-1 text-xs text-slate-600">{routine.class.name} · {routine.section.name}</p>
                  <p className="mt-2 text-[11px] font-semibold text-teal-700">
                    {routine.startTime}–{routine.endTime}{routine.roomNo ? ` · ${routine.roomNo}` : ""}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <BookOpen className="h-4 w-4 text-teal-600" /> My active assignments
              </h2>
              <p className="mt-1 text-xs text-slate-500">Classes and subjects assigned by the Academic Admin.</p>
            </div>
            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700">{teacher.assignments.length} active</span>
          </div>
          {!teacher.assignments.length ? (
            <DatabaseEmptyState title="No active assignment" description="Assignments added by the Academic Admin will appear here." />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {teacher.assignments.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-teal-200 hover:bg-teal-50/30">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-900">{item.class.name} · {item.section.name}</p>
                      <p className="mt-1 text-sm font-semibold text-teal-700">{item.subject.nameEn}</p>
                    </div>
                    {item.isClassTeacher && <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700">CLASS TEACHER</span>}
                  </div>
                  <p className="mt-3 text-[11px] text-slate-500">Academic year: {item.academicYear.name}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <ArrowRight className="h-4 w-4 text-teal-600" /> Quick actions
          </h2>
          <div className="mt-4 space-y-2">
            <QuickAction href="/dashboard/attendance" icon={ClipboardCheck} title="Take attendance" description="Record attendance for your class" />
            <QuickAction href="/dashboard/exams" icon={FileSpreadsheet} title="Enter exam marks" description="Open your assigned mark sheets" />
            <QuickAction href="/dashboard/homework" icon={BookOpen} title="Create homework" description="Assign work to your students" />
            <QuickAction href="/dashboard/routines" icon={CalendarClock} title="View my routine" description="See the complete weekly schedule" />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><GraduationCap className="h-4 w-4 text-teal-600" /> Upcoming homework</h2>
              <p className="mt-1 text-xs text-slate-500">Homework you created with a future due date.</p>
            </div>
            <Link href="/dashboard/homework" className="text-xs font-bold text-teal-700">Manage homework</Link>
          </div>
          {!homeworks.length ? (
            <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-xs text-slate-500">No upcoming homework.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {homeworks.map((homework) => (
                <div key={homework.id} className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{homework.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{homework.class.name} · {homework.section.name} · {homework.subject.nameEn}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700">Due {displayDate(homework.dueDate)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><CalendarCheck2 className="h-4 w-4 text-teal-600" /> Leave summary</h2>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div><p className="text-2xl font-black text-slate-900">{pendingLeaveCount}</p><p className="text-[10px] font-bold uppercase text-slate-400">Pending requests</p></div>
              <Link href="/dashboard/staff/leave" className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-teal-700 shadow-sm">View details</Link>
            </div>
            {leaveApplications[0] && <p className="mt-3 text-[11px] text-slate-500">Latest: {displayDate(leaveApplications[0].startDate)} · <span className="font-bold">{leaveApplications[0].status}</span></p>}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><CircleDollarSign className="h-4 w-4 text-teal-600" /> Latest payroll</h2>
            {latestPayroll ? (
              <div className="mt-4">
                <p className="text-xl font-black text-slate-900">{money(latestPayroll.netSalary, teacher.school.settings?.currency || "BDT")}</p>
                <p className="mt-1 text-[11px] text-slate-500">{payrollPeriod ? `${payrollPeriod.payrollMonth}/${payrollPeriod.payrollYear}` : "Latest period"} · <span className="font-bold">{latestPayroll.status}</span></p>
              </div>
            ) : <p className="mt-4 text-xs text-slate-500">No payroll record is available yet.</p>}
          </section>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof BookOpen; label: string; value: number | string; detail: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-2xl font-black text-slate-900">{value}</p></div><span className="rounded-lg bg-teal-50 p-2 text-teal-700"><Icon className="h-4 w-4" /></span></div>
      <p className="mt-2 text-[11px] text-slate-500">{detail}</p>
    </div>
  );
}

function ProfileDetail({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: string }) {
  return <div className="flex items-center gap-3 border-white/10 px-5 py-4 sm:border-r"><Icon className="dashboard-hero-muted h-4 w-4 shrink-0" /><div className="min-w-0"><p className="dashboard-hero-muted text-[9px] font-bold uppercase tracking-wider">{label}</p><p className="mt-0.5 truncate text-xs font-semibold capitalize text-white">{value}</p></div></div>;
}

function QuickAction({ href, icon: Icon, title, description }: { href: string; icon: typeof BookOpen; title: string; description: string }) {
  return <Link href={href} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-all hover:border-teal-200 hover:bg-teal-50/50"><span className="rounded-lg bg-slate-50 p-2 text-teal-700 group-hover:bg-white"><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-bold text-slate-900">{title}</span><span className="mt-0.5 block truncate text-[10px] text-slate-500">{description}</span></span><ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-teal-600" /></Link>;
}
