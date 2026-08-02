import { BookOpen, ShieldCheck, UserCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import prisma from '@/src/lib/db/prisma';
import { getCurrentSession } from '@/src/lib/auth/session';
import { DatabaseEmptyState } from '@/src/components/ui/DatabaseEmptyState';

export default async function TeacherPortalDashboard() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect('/login');
  const teacher = await prisma.teacher.findFirst({
    where: { userId: session.id, schoolId: session.schoolId, status: 'ACTIVE' },
    include: {
      school: { select: { name: true } }, department: true, designation: true,
      assignments: { where: { status: 'ACTIVE' }, include: { academicYear: true, class: true, section: true, subject: true }, orderBy: { createdAt: 'desc' } },
    },
  });
  if (!teacher) return <div className="mx-auto max-w-3xl space-y-5 pt-10"><div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs font-semibold text-teal-900"><ShieldCheck className="h-4 w-4 text-teal-600" />Teacher portal access is active and isolated to your assignments.</div><DatabaseEmptyState title={`Welcome, ${session.name}`} description="This login is not linked to a teacher profile. Ask the School Admin to link it from Teachers Roster." /></div>;
  const classCount = new Set(teacher.assignments.map(item => item.classId)).size;
  const sectionCount = new Set(teacher.assignments.map(item => item.sectionId)).size;
  const subjectCount = new Set(teacher.assignments.map(item => item.subjectId)).size;
  return <div className="space-y-6"><section className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-teal-800 to-slate-900 p-6 text-white sm:flex-row sm:items-center"><div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/20 text-2xl font-bold text-teal-200">{teacher.nameEn.charAt(0)}</div><div><h1 className="text-xl font-bold">{teacher.nameEn}</h1><p className="mt-1 text-xs text-teal-100">{teacher.designation?.nameEn || 'No designation'} · {teacher.school.name}</p><p className="mt-1 text-[11px] text-teal-200">{teacher.employeeCode}</p></div></div><UserCheck className="h-7 w-7 text-teal-300" /></section>
    <div className="grid gap-4 sm:grid-cols-3"><Metric label="Assigned classes" value={classCount} /><Metric label="Assigned sections" value={sectionCount} /><Metric label="Assigned subjects" value={subjectCount} /></div>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 flex items-center gap-2 text-sm font-bold"><BookOpen className="h-4 w-4 text-teal-600" />My active assignments</h2>{!teacher.assignments.length ? <DatabaseEmptyState title="No active assignment" description="Assignments added by the Academic Admin will appear here." /> : <div className="grid gap-3 md:grid-cols-2">{teacher.assignments.map(item => <article key={item.id} className="rounded-xl border border-slate-200 p-4"><p className="font-bold text-slate-900">{item.class.name} · {item.section.name}</p><p className="mt-1 text-sm font-semibold text-teal-700">{item.subject.nameEn}</p><p className="mt-2 text-xs text-slate-500">{item.academicYear.name}{item.isClassTeacher ? ' · Class teacher' : ''}</p></article>)}</div>}</section>
  </div>;
}
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-[10px] font-bold uppercase text-slate-400">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>; }
