import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarCheck2,
  CalendarClock,
  Clock3,
  FileText,
  GraduationCap,
  Receipt,
  ShieldCheck,
  Trophy,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
import prisma from "@/src/lib/db/prisma";
import { getCurrentSession } from "@/src/lib/auth/session";
import { formatCurrency } from "@/src/lib/utils";
import { PortalFees } from "@/src/components/fees/PortalFees";

const DHAKA_ZONE = "Asia/Dhaka";
const displayDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: DHAKA_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

export default async function StudentPortalDashboard() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect("/login");

  const student = await prisma.student.findFirst({
    where: { userId: session.id, schoolId: session.schoolId, status: "ACTIVE" },
    include: {
      school: { select: { name: true } },
      class: { select: { name: true } },
      section: { select: { name: true } },
      guardians: {
        where: { status: "ACTIVE" },
        include: { guardian: true },
        orderBy: { isPrimary: "desc" },
      },
      enrollments: {
        where: { enrollmentStatus: "ACTIVE" },
        include: {
          academicYear: { select: { name: true, isCurrent: true } },
          academicSession: { select: { name: true } },
          class: { select: { name: true } },
          section: { select: { name: true } },
          group: { select: { name: true } },
        },
        orderBy: [{ academicYear: { isCurrent: "desc" } }, { createdAt: "desc" }],
        take: 1,
      },
    },
  });

  if (!student) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 pt-10">
        <div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs font-semibold text-teal-900">
          <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600" />
          Student portal access is active and isolated to one linked student record.
        </div>
        <section className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
          <UserRoundCheck className="mx-auto h-12 w-12 text-amber-500" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Welcome, {session.name}</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
            This login is not linked to a student profile. Ask the School Admin to link the user account from Student Directory.
          </p>
        </section>
      </div>
    );
  }

  const now = new Date();
  const todayText = new Intl.DateTimeFormat("en-CA", {
    timeZone: DHAKA_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const todayStart = new Date(`${todayText}T00:00:00+06:00`);
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: DHAKA_ZONE,
    weekday: "long",
  }).format(now).toUpperCase();
  const enrollment = student.enrollments[0];
  const classId = enrollment?.classId ?? student.classId;
  const sectionId = enrollment?.sectionId ?? student.sectionId;

  const [attendanceRecords, feeTotals, homeworks, examRoutines, routines, results, notifications] =
    await Promise.all([
      prisma.studentAttendanceRecord.findMany({
        where: { schoolId: student.schoolId, studentId: student.id },
        orderBy: { date: "desc" },
        take: 90,
      }),
      prisma.feeInvoice.aggregate({
        where: { studentId: student.id, schoolId: student.schoolId },
        _sum: { amount: true, discount: true, paidAmount: true },
      }),
      classId && sectionId
        ? prisma.homework.findMany({
            where: { classId, sectionId, dueDate: { gte: todayStart } },
            include: { subject: true, teacher: { select: { nameEn: true } } },
            orderBy: { dueDate: "asc" },
            take: 5,
          })
        : Promise.resolve([]),
      classId
        ? prisma.examRoutine.findMany({
            where: {
              schoolId: student.schoolId,
              classId,
              examDate: { gte: todayStart },
              status: "PUBLISHED",
              ...(sectionId ? { OR: [{ sectionId }, { sectionId: null }] } : {}),
            },
            orderBy: [{ examDate: "asc" }, { startTime: "asc" }],
            take: 5,
          })
        : Promise.resolve([]),
      classId && sectionId
        ? prisma.routine.findMany({
            where: { classId, sectionId, dayOfWeek: weekday },
            include: { subject: true, teacher: { select: { nameEn: true } } },
            orderBy: { startTime: "asc" },
          })
        : Promise.resolve([]),
      prisma.studentResult.findMany({
        where: { schoolId: student.schoolId, studentId: student.id },
        orderBy: { calculatedAt: "desc" },
        take: 5,
      }),
      prisma.notification.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const examIds = [...new Set([...examRoutines.map((item) => item.examId), ...results.map((item) => item.examId)])];
  const subjectIds = [...new Set(examRoutines.map((item) => item.subjectId))];
  const [exams, examSubjects, publications] = await Promise.all([
    prisma.exam.findMany({ where: { id: { in: examIds }, schoolId: student.schoolId }, select: { id: true, name: true, year: true } }),
    prisma.subject.findMany({ where: { id: { in: subjectIds } }, select: { id: true, nameEn: true } }),
    prisma.resultPublication.findMany({ where: { schoolId: student.schoolId, examId: { in: results.map((item) => item.examId) }, status: "PUBLISHED" } }),
  ]);
  const examMap = new Map(exams.map((item) => [item.id, item]));
  const subjectMap = new Map(examSubjects.map((item) => [item.id, item.nameEn]));
  const publishedResults = results.filter((result) =>
    publications.some((publication) => publication.examId === result.examId && (!publication.classId || publication.classId === result.classId)),
  );
  const presentCount = attendanceRecords.filter((item) => ["present", "late"].includes(item.status.toLowerCase())).length;
  const attendanceRate = attendanceRecords.length ? (presentCount / attendanceRecords.length) * 100 : 0;
  const invoiced = Number(feeTotals._sum.amount ?? 0) - Number(feeTotals._sum.discount ?? 0);
  const paid = Number(feeTotals._sum.paidAmount ?? 0);
  const due = Math.max(0, invoiced - paid);
  const className = enrollment?.class.name ?? student.class?.name ?? "Not assigned";
  const sectionName = enrollment?.section.name ?? student.section?.name ?? "Not assigned";
  const rollNumber = enrollment?.rollNumber ?? student.rollNumber;
  const primaryGuardian = student.guardians[0];
  const initials = student.nameEn.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="dashboard-hero overflow-hidden rounded-2xl text-white shadow-sm">
        <div className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="dashboard-hero-panel flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border text-xl font-black">{initials || "S"}</div>
            <div>
              <p className="dashboard-hero-muted text-[10px] font-bold uppercase tracking-[0.2em]">Personal Student Dashboard</p>
              <h1 className="mt-1 text-xl font-black sm:text-2xl">Welcome, {student.nameEn}</h1>
              <p className="dashboard-hero-muted mt-1 text-xs">{className} · {sectionName} · Roll {rollNumber ?? "Not assigned"} · {student.studentCode}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/student/profile" className="dashboard-hero-panel rounded-lg border px-4 py-2.5 text-xs font-bold">My Profile</Link>
            <div className="dashboard-hero-panel rounded-lg border px-4 py-2.5 text-xs"><span className="dashboard-hero-muted block text-[9px] uppercase">Academic year</span><strong>{enrollment?.academicYear.name ?? "Not assigned"}</strong></div>
          </div>
        </div>
        <div className="grid border-t border-white/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          <HeroDetail label="Admission No." value={student.admissionNumber} />
          <HeroDetail label="Session" value={enrollment?.academicSession?.name || "Regular"} />
          <HeroDetail label="Group" value={enrollment?.group?.name || "No group"} />
          <HeroDetail label="Guardian" value={primaryGuardian?.guardian.name || student.fatherName || "Not provided"} />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={CalendarCheck2} label="Attendance" value={attendanceRecords.length ? `${attendanceRate.toFixed(1)}%` : "No records"} detail={`${presentCount} present · ${attendanceRecords.length - presentCount} absent/other`} />
        <Metric icon={Receipt} label="Outstanding fees" value={formatCurrency(due)} detail={`${formatCurrency(paid)} paid`} />
        <Metric icon={BookOpen} label="Upcoming homework" value={String(homeworks.length)} detail="Assigned to your class" />
        <Metric icon={Trophy} label="Latest GPA" value={publishedResults[0] ? Number(publishedResults[0].gpa).toFixed(2) : "Not published"} detail={publishedResults[0] ? `${examMap.get(publishedResults[0].examId)?.name || "Exam"} · Grade ${publishedResults[0].letterGrade}` : "No published result"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs xl:col-span-2">
          <SectionTitle icon={Clock3} title="Today's class routine" detail="Your class schedule for today" />
          {!routines.length ? <Empty text="No classes are scheduled today." /> : <div className="mt-4 grid gap-3 md:grid-cols-2">{routines.map((routine, index) => <article key={routine.id} className="flex gap-3 rounded-xl border border-slate-200 p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-xs font-black text-teal-700">{index + 1}</span><div><p className="font-bold text-slate-900">{routine.subject.nameEn}</p><p className="mt-1 text-xs text-slate-500">{routine.teacher.nameEn}{routine.roomNo ? ` · ${routine.roomNo}` : ""}</p><p className="mt-2 text-[11px] font-bold text-teal-700">{routine.startTime}–{routine.endTime}</p></div></article>)}</div>}
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <SectionTitle icon={ArrowRight} title="Quick access" detail="Student services" />
          <div className="mt-4 space-y-2">
            <QuickLink href="/student/profile" icon={UserRound} title="My profile" />
            <QuickLink href="/student/syllabus" icon={BookOpen} title="My syllabus" />
            <QuickLink href="#homework" icon={BookOpen} title="Homework" />
            <QuickLink href="/student/class-routine" icon={Clock3} title="Class routine" />
            <QuickLink href="/student/exam-routine" icon={CalendarClock} title="Exam routine" />
            <QuickLink href="/student/admit-cards" icon={FileText} title="Admit cards" />
            <QuickLink href="#results" icon={Trophy} title="Results" />
            <QuickLink href="/student/payments" icon={Receipt} title="Fees & receipts" />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="homework" className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs scroll-mt-6">
          <SectionTitle icon={BookOpen} title="Upcoming homework" detail="Work assigned to your class and section" />
          {!homeworks.length ? <Empty text="No upcoming homework." /> : <div className="mt-3 divide-y divide-slate-100">{homeworks.map((item) => <div key={item.id} className="flex items-start justify-between gap-3 py-3"><div><p className="text-sm font-bold text-slate-900">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.subject.nameEn} · {item.teacher.nameEn}</p><p className="mt-1 line-clamp-2 text-[11px] text-slate-400">{item.description}</p></div><span className="shrink-0 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold text-amber-700">Due {displayDate(item.dueDate)}</span></div>)}</div>}
        </section>
        <section id="exams" className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs scroll-mt-6">
          <SectionTitle icon={CalendarClock} title="Upcoming examinations" detail="Published exam schedule for your class" />
          {!examRoutines.length ? <Empty text="No upcoming examination schedule." /> : <div className="mt-3 divide-y divide-slate-100">{examRoutines.map((item) => <div key={item.id} className="flex items-start justify-between gap-3 py-3"><div><p className="text-sm font-bold text-slate-900">{subjectMap.get(item.subjectId) || "Subject"}</p><p className="mt-1 text-xs text-slate-500">{examMap.get(item.examId)?.name || "Examination"} · {item.startTime}–{item.endTime}</p></div><span className="shrink-0 rounded-lg bg-teal-50 px-2.5 py-1.5 text-[10px] font-bold text-teal-700">{displayDate(item.examDate)}</span></div>)}</div>}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="results" className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs scroll-mt-6">
          <SectionTitle icon={GraduationCap} title="Published results" detail="Only your own published academic results" />
          {!publishedResults.length ? <Empty text="No result has been published yet." /> : <div className="mt-3 divide-y divide-slate-100">{publishedResults.map((item) => <div key={item.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3"><div><p className="text-sm font-bold text-slate-900">{examMap.get(item.examId)?.name || "Examination"}</p><p className="mt-1 text-[11px] text-slate-500">Total {Number(item.totalMarks)} · Position {item.classPosition || "—"}</p></div><div className="text-center"><p className="font-black text-teal-700">{Number(item.gpa).toFixed(2)}</p><p className="text-[9px] uppercase text-slate-400">GPA</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.isPassed ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{item.letterGrade}</span></div>)}</div>}
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <SectionTitle icon={Bell} title="Notices & updates" detail="Messages sent to your account" />
          {!notifications.length ? <Empty text="No new notice." /> : <div className="mt-3 divide-y divide-slate-100">{notifications.map((item) => <div key={item.id} className="py-3"><p className="text-sm font-bold text-slate-900">{item.title}</p><p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.message}</p><p className="mt-1 text-[10px] text-slate-400">{displayDate(item.createdAt)}</p></div>)}</div>}
        </section>
      </div>

      <section id="fees" className="scroll-mt-6"><PortalFees studentId={student.id} /></section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof BookOpen; label: string; value: string; detail: string }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 truncate text-xl font-black text-slate-900">{value}</p></div><span className="rounded-lg bg-teal-50 p-2 text-teal-700"><Icon className="h-4 w-4" /></span></div><p className="mt-2 text-[11px] text-slate-500">{detail}</p></section>;
}
function HeroDetail({ label, value }: { label: string; value: string }) { return <div className="border-white/10 px-5 py-4 sm:border-r"><p className="dashboard-hero-muted text-[9px] font-bold uppercase tracking-wider">{label}</p><p className="mt-0.5 truncate text-xs font-semibold text-white">{value}</p></div>; }
function SectionTitle({ icon: Icon, title, detail }: { icon: typeof BookOpen; title: string; detail: string }) { return <div><h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Icon className="h-4 w-4 text-teal-600" />{title}</h2><p className="mt-1 text-xs text-slate-500">{detail}</p></div>; }
function Empty({ text }: { text: string }) { return <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-7 text-center text-xs text-slate-500">{text}</p>; }
function QuickLink({ href, icon: Icon, title }: { href: string; icon: typeof BookOpen; title: string }) { return <Link href={href} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-teal-200 hover:bg-teal-50/50"><Icon className="h-4 w-4 text-teal-700" /><span className="flex-1 text-xs font-bold text-slate-800">{title}</span><ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-teal-600" /></Link>; }
