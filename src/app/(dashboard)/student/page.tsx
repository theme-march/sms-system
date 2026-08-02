import { Calendar, FileText, Receipt, BookOpen, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import prisma from '@/src/lib/db/prisma';
import { getCurrentSession } from '@/src/lib/auth/session';
import { formatCurrency } from '@/src/lib/utils';
import { PortalFees } from '@/src/components/fees/PortalFees';

export default async function StudentPortalDashboard() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const student = await prisma.student.findFirst({
    where: { userId: session.id, schoolId: session.schoolId ?? undefined, status: 'ACTIVE' },
    include: {
      class: { select: { name: true } },
      section: { select: { name: true } },
      enrollments: {
        include: {
          academicYear: { select: { name: true } },
          class: { select: { name: true } },
          section: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!student) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 pt-10">
        <div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs font-semibold text-teal-900">
          <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600" />
          Student portal access is active and isolated to your own academic record.
        </div>
        <section className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
          <UserRoundCheck className="mx-auto h-12 w-12 text-amber-500" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Welcome, {session.name}</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
            Login was successful, but this user account is not linked to a student profile yet. Ask the School Admin to link this login from the Student Directory.
          </p>
        </section>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const enrollment = student.enrollments[0];
  const classId = enrollment?.classId ?? student.classId;
  const sectionId = enrollment?.sectionId ?? student.sectionId;

  const [attendanceTotal, presentTotal, feeTotals, homeworkCount, upcomingRoutine] = await Promise.all([
    prisma.attendance.count({ where: { studentId: student.id } }),
    prisma.attendance.count({ where: { studentId: student.id, status: 'PRESENT' } }),
    prisma.feeInvoice.aggregate({
      where: { studentId: student.id, schoolId: student.schoolId },
      _sum: { amount: true, discount: true, paidAmount: true },
    }),
    classId && sectionId
      ? prisma.homework.count({ where: { classId, sectionId, dueDate: { gte: today } } })
      : Promise.resolve(0),
    classId
      ? prisma.examRoutine.findFirst({
          where: {
            schoolId: student.schoolId,
            classId,
            examDate: { gte: today },
            status: 'PUBLISHED',
            ...(sectionId ? { OR: [{ sectionId }, { sectionId: null }] } : {}),
          },
          orderBy: { examDate: 'asc' },
        })
      : Promise.resolve(null),
  ]);

  const upcomingExam = upcomingRoutine
    ? await prisma.exam.findFirst({ where: { id: upcomingRoutine.examId, schoolId: student.schoolId }, select: { name: true } })
    : null;
  const attendanceRate = attendanceTotal > 0 ? (presentTotal / attendanceTotal) * 100 : 0;
  const invoiced = Number(feeTotals._sum.amount ?? 0) - Number(feeTotals._sum.discount ?? 0);
  const paid = Number(feeTotals._sum.paidAmount ?? 0);
  const due = Math.max(0, invoiced - paid);
  const className = enrollment?.class.name ?? student.class?.name ?? 'Not assigned';
  const sectionName = enrollment?.section.name ?? student.section?.name ?? 'Not assigned';
  const rollNumber = enrollment?.rollNumber ?? student.rollNumber;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs font-semibold text-teal-900">
        <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-teal-600" />Student portal is isolated to your own academic record.</span>
        <span className="rounded-md bg-teal-200 px-2 py-0.5 text-[10px] font-bold uppercase text-teal-800">Student</span>
      </div>

      <section className="flex flex-col justify-between gap-5 rounded-2xl bg-teal-700 p-6 text-white shadow-md sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-black text-teal-700">{student.nameEn.charAt(0)}</div>
          <div>
            <h1 className="text-xl font-bold">Welcome back, {student.nameEn}!</h1>
            <p className="mt-1 text-xs text-teal-100">Class {className} · Section {sectionName} · Roll {rollNumber ?? 'Not assigned'} · {student.studentCode}</p>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/10 p-4 text-xs">
          <p className="text-[10px] font-bold uppercase text-teal-100">Academic year</p>
          <p className="mt-1 text-sm font-bold">{enrollment?.academicYear.name ?? 'Not assigned'}</p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={Calendar} label="Attendance" value={attendanceTotal ? `${attendanceRate.toFixed(1)}%` : 'No records'} detail={`${presentTotal} present · ${attendanceTotal - presentTotal} absent/other`} />
        <Metric icon={Receipt} label="Outstanding fees" value={formatCurrency(due)} detail={`${formatCurrency(paid)} collected`} />
        <Metric icon={BookOpen} label="Assigned homework" value={String(homeworkCount)} detail="Current and upcoming work" />
        <Metric icon={FileText} label="Upcoming exam" value={upcomingExam?.name ?? 'No upcoming exam'} detail={upcomingRoutine ? upcomingRoutine.examDate.toLocaleDateString('en-GB') : 'No published routine'} />
      </div>
      <PortalFees studentId={student.id} />
    </div>
  );
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof Calendar; label: string; value: string; detail: string }) {
  return (
    <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase text-slate-400">{label}</span><Icon className="h-4 w-4 text-teal-600" /></div>
      <p className="truncate text-xl font-black text-slate-900">{value}</p>
      <p className="text-[11px] font-medium text-slate-500">{detail}</p>
    </section>
  );
}
