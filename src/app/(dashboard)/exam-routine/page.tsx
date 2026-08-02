import { FileText } from 'lucide-react';
import { redirect } from 'next/navigation';
import prisma from '@/src/lib/db/prisma';
import { getCurrentSession } from '@/src/lib/auth/session';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { DatabaseEmptyState } from '@/src/components/ui/DatabaseEmptyState';

export default async function ExamRoutinePage() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect('/login');
  const [school, routines] = await Promise.all([
    prisma.school.findUnique({ where: { id: session.schoolId }, select: { name: true } }),
    prisma.examRoutine.findMany({ where: { schoolId: session.schoolId }, orderBy: [{ examDate: 'asc' }, { startTime: 'asc' }], take: 200 }),
  ]);
  const ids = { exams: [...new Set(routines.map(item => item.examId))], classes: [...new Set(routines.map(item => item.classId))], subjects: [...new Set(routines.map(item => item.subjectId))] };
  const [exams, classes, subjects] = await Promise.all([
    prisma.exam.findMany({ where: { id: { in: ids.exams }, schoolId: session.schoolId }, select: { id: true, name: true } }),
    prisma.class.findMany({ where: { id: { in: ids.classes }, schoolId: session.schoolId }, select: { id: true, name: true } }),
    prisma.subject.findMany({ where: { id: { in: ids.subjects }, schoolId: session.schoolId }, select: { id: true, nameEn: true } }),
  ]);
  const examMap = new Map(exams.map(item => [item.id, item.name])); const classMap = new Map(classes.map(item => [item.id, item.name])); const subjectMap = new Map(subjects.map(item => [item.id, item.nameEn]));
  return <div className="space-y-6"><PageHeader title="Exam Routines" subtitle={`${school?.name || 'School'} examination schedules from MySQL`} breadcrumbs={[{ label: 'Exam Routines' }]} />
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 flex items-center gap-2 text-sm font-bold"><FileText className="h-4 w-4 text-teal-600" />Exam schedule</h2>{!routines.length ? <DatabaseEmptyState title="No exam routine" description="Published and draft exam schedules will appear here." /> : <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Exam</th><th className="p-3">Date</th><th className="p-3">Time</th><th className="p-3">Class</th><th className="p-3">Subject</th><th className="p-3">Marks</th><th className="p-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{routines.map(item => <tr key={item.id}><td className="p-3 font-semibold">{examMap.get(item.examId) || '—'}</td><td className="p-3">{item.examDate.toLocaleDateString('en-GB')}</td><td className="p-3">{item.startTime}–{item.endTime}</td><td className="p-3">{classMap.get(item.classId) || '—'}</td><td className="p-3">{subjectMap.get(item.subjectId) || '—'}</td><td className="p-3">{Number(item.totalMarks)}</td><td className="p-3">{item.status}</td></tr>)}</tbody></table></div>}</section>
  </div>;
}
