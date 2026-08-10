import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, MapPin, UserRound } from "lucide-react";
import prisma from "@/src/lib/db/prisma";
import { getCurrentSession } from "@/src/lib/auth/session";
import { StudentDocumentActions } from "@/src/components/student/StudentDocumentActions";

const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export default async function StudentClassRoutinePage() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect("/login");
  const student = await prisma.student.findFirst({
    where: { userId: session.id, schoolId: session.schoolId, status: "ACTIVE" },
    include: {
      class: true,
      section: true,
      school: true,
      enrollments: { where: { enrollmentStatus: "ACTIVE" }, include: { academicYear: true, class: true, section: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!student) return <Unlinked />;
  const enrollment = student.enrollments[0];
  const classId = enrollment?.classId || student.classId;
  const sectionId = enrollment?.sectionId || student.sectionId;
  const routines = classId && sectionId ? await prisma.routine.findMany({
    where: { classId, sectionId },
    include: { subject: true, teacher: { select: { nameEn: true } } },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  }) : [];
  const className = enrollment?.class.name || student.class?.name || "Not assigned";
  const sectionName = enrollment?.section.name || student.section?.name || "Not assigned";
  const ordered = [...routines].sort((a, b) => days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek) || a.startTime.localeCompare(b.startTime));
  const pdfLines = [
    student.school.name,
    `Student: ${student.nameEn} | ID: ${student.studentCode} | Roll: ${enrollment?.rollNumber || student.rollNumber || "-"}`,
    `Class: ${className} | Section: ${sectionName} | Academic year: ${enrollment?.academicYear.name || "-"}`,
    "",
    ...ordered.map((item) => `${labelDay(item.dayOfWeek)} | ${item.startTime}-${item.endTime} | ${item.subject.nameEn} | ${item.teacher.nameEn}${item.roomNo ? ` | ${item.roomNo}` : ""}`),
  ];

  return <div className="mx-auto max-w-6xl space-y-6">
    <Header title="My Class Routine" subtitle={`${className} · ${sectionName}`} actions={<StudentDocumentActions title="Class Routine" fileName={`${student.studentCode}-class-routine.pdf`} lines={pdfLines} />} />
    <StudentStrip name={student.nameEn} code={student.studentCode} roll={enrollment?.rollNumber || student.rollNumber} year={enrollment?.academicYear.name} />
    {!ordered.length ? <Empty text="No published class routine is available for your class and section." /> : <div className="space-y-4">{days.map((day) => {
      const slots = ordered.filter((item) => item.dayOfWeek === day);
      if (!slots.length) return null;
      return <section key={day} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs"><div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm font-black text-slate-800">{labelDay(day)}</div><div className="divide-y divide-slate-100">{slots.map((item, index) => <div key={item.id} className="grid gap-3 p-4 sm:grid-cols-[44px_130px_1fr_1fr_140px] sm:items-center"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-xs font-black text-teal-700">{index + 1}</span><span className="flex items-center gap-2 text-xs font-bold text-slate-700"><Clock3 className="h-4 w-4 text-teal-600" />{item.startTime}–{item.endTime}</span><div><p className="text-sm font-bold text-slate-900">{item.subject.nameEn}</p><p className="text-[10px] text-slate-400">{item.subject.code}</p></div><span className="flex items-center gap-2 text-xs text-slate-600"><UserRound className="h-4 w-4" />{item.teacher.nameEn}</span><span className="flex items-center gap-2 text-xs text-slate-600"><MapPin className="h-4 w-4" />{item.roomNo || "Room not set"}</span></div>)}</div></section>;
    })}</div>}
  </div>;
}

function labelDay(day: string) { return day.charAt(0) + day.slice(1).toLowerCase(); }
function Header({ title, subtitle, actions }: { title: string; subtitle: string; actions: React.ReactNode }) { return <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Link href="/student/profile" className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-teal-700"><ArrowLeft className="h-3.5 w-3.5" />My Profile</Link><h1 className="flex items-center gap-2 text-2xl font-black text-slate-900"><CalendarDays className="h-6 w-6 text-teal-700" />{title}</h1><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div>{actions}</div>; }
function StudentStrip({name,code,roll,year}:{name:string;code:string;roll:number|null|undefined;year?:string}) { return <section className="dashboard-hero grid gap-4 rounded-xl p-5 text-white sm:grid-cols-4"><div className="sm:col-span-2"><p className="dashboard-hero-muted text-[10px] uppercase">Student</p><p className="mt-1 font-black">{name}</p></div><div><p className="dashboard-hero-muted text-[10px] uppercase">Student ID / Roll</p><p className="mt-1 text-sm font-bold">{code} / {roll || "—"}</p></div><div><p className="dashboard-hero-muted text-[10px] uppercase">Academic year</p><p className="mt-1 text-sm font-bold">{year || "—"}</p></div></section>; }
function Empty({text}:{text:string}) { return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">{text}</div>; }
function Unlinked() { return <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">This account is not linked to a student profile.</div>; }
