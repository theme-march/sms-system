import { GraduationCap, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import prisma from '@/src/lib/db/prisma';
import { getCurrentSession } from '@/src/lib/auth/session';
import { DatabaseEmptyState } from '@/src/components/ui/DatabaseEmptyState';
import { formatCurrency } from '@/src/lib/utils';
import { PortalFees } from '@/src/components/fees/PortalFees';

export default async function GuardianPortalDashboard() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect('/login');
  const guardian = await prisma.guardian.findFirst({
    where: { userId: session.id, schoolId: session.schoolId, status: 'ACTIVE', portalAccessEnabled: true },
    include: { school: { select: { name: true } }, students: { where: { status: 'ACTIVE' }, include: { student: { include: { class: true, section: true } } } } },
  });
  if (!guardian) return <div className="mx-auto max-w-3xl space-y-5 pt-10"><div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs font-semibold text-teal-900"><ShieldCheck className="h-4 w-4 text-teal-600" />Guardian portal access is isolated to linked students.</div><DatabaseEmptyState title={`Welcome, ${session.name}`} description="This login is not linked to a guardian profile. Ask the School Admin to link it from Guardians Directory." /></div>;
  const wards = await Promise.all(guardian.students.map(async ({ student }) => {
    const [attendanceTotal, present, fees] = await Promise.all([
      prisma.attendance.count({ where: { studentId: student.id } }),
      prisma.attendance.count({ where: { studentId: student.id, status: 'PRESENT' } }),
      prisma.feeInvoice.aggregate({ where: { schoolId: guardian.schoolId, studentId: student.id }, _sum: { amount: true, discount: true, paidAmount: true } }),
    ]);
    const due = Math.max(0, Number(fees._sum.amount || 0) - Number(fees._sum.discount || 0) - Number(fees._sum.paidAmount || 0));
    return { student, attendance: attendanceTotal ? (present / attendanceTotal) * 100 : null, due };
  }));
  return <div className="space-y-6"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h1 className="text-xl font-bold text-slate-900">Welcome, {guardian.name}</h1><p className="mt-1 text-xs text-slate-500">{guardian.relationship} · {guardian.phone} · {guardian.school.name}</p></section>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 flex items-center gap-2 text-sm font-bold"><GraduationCap className="h-4 w-4 text-teal-600" />Linked students</h2>{!wards.length ? <DatabaseEmptyState title="No linked students" description="Student-guardian relationships created by the School Admin will appear here." /> : <div className="grid gap-4 md:grid-cols-2">{wards.map(({ student, attendance, due }) => <article key={student.id} className="rounded-xl border border-slate-200 p-4"><h3 className="font-bold">{student.nameEn}</h3><p className="mt-1 text-xs text-slate-500">{student.studentCode} · {student.class?.name || 'No class'} · {student.section?.name || 'No section'} · Roll {student.rollNumber ?? '—'}</p><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div className="rounded-lg bg-slate-50 p-3"><p className="text-slate-400">Attendance</p><p className="mt-1 font-bold">{attendance === null ? 'No records' : `${attendance.toFixed(1)}%`}</p></div><div className="rounded-lg bg-slate-50 p-3"><p className="text-slate-400">Outstanding</p><p className="mt-1 font-bold">{formatCurrency(due)}</p></div></div></article>)}</div>}</section>
    {wards.map(({ student }) => <PortalFees key={`fees-${student.id}`} studentId={student.id} studentName={student.nameEn} />)}
  </div>;
}
