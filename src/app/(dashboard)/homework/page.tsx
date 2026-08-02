import { BookOpen, Calendar } from 'lucide-react';
import { redirect } from 'next/navigation';
import prisma from '@/src/lib/db/prisma';
import { getCurrentSession } from '@/src/lib/auth/session';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { DatabaseEmptyState } from '@/src/components/ui/DatabaseEmptyState';

export default async function HomeworkPage() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect('/login');
  const assignments = await prisma.homework.findMany({ where: { class: { schoolId: session.schoolId } }, include: { class: true, section: true, subject: true, teacher: true }, orderBy: { dueDate: 'desc' }, take: 100 });
  return <div className="space-y-6"><PageHeader title="Homework Assignments" subtitle="Homework records stored in MySQL" breadcrumbs={[{ label: 'Homework' }]} />
    {!assignments.length ? <DatabaseEmptyState title="No homework assignments" description="Assignments posted by authorized teachers will appear here." /> : <div className="grid gap-4 md:grid-cols-2">{assignments.map(item => <article key={item.id} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-teal-700">{item.subject.nameEn}</span><span className="flex items-center gap-1 text-xs font-semibold text-rose-600"><Calendar className="h-3.5 w-3.5" />{item.dueDate.toLocaleDateString('en-GB')}</span></div><div><h2 className="font-bold text-slate-900">{item.title}</h2><p className="mt-1 text-xs text-slate-500">{item.description}</p></div><div className="flex justify-between border-t border-slate-100 pt-3 text-xs text-slate-500"><span>{item.class.name} · {item.section.name}</span><span>{item.teacher.nameEn}</span></div></article>)}</div>}
  </div>;
}
