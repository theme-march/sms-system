import { BookOpen } from 'lucide-react';
import { redirect } from 'next/navigation';
import prisma from '@/src/lib/db/prisma';
import { getCurrentSession } from '@/src/lib/auth/session';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { DatabaseEmptyState } from '@/src/components/ui/DatabaseEmptyState';

export default async function TeacherAssignmentsPage() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect('/login');
  const assignments = await prisma.teacherAssignment.findMany({
    where: { schoolId: session.schoolId }, include: { teacher: true, academicYear: true, academicSession: true, class: true, section: true, group: true, subject: true },
    orderBy: { createdAt: 'desc' }, take: 200,
  });
  return <div className="space-y-6"><PageHeader title="Teacher Assignments" subtitle="Teacher workload assignments stored in MySQL" breadcrumbs={[{ label: 'Teacher Assignments' }]} />
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 flex items-center gap-2 text-sm font-bold"><BookOpen className="h-4 w-4 text-teal-600" />Assignment ledger</h2>{!assignments.length ? <DatabaseEmptyState title="No teacher assignments" description="Assign teachers to academic years, classes, sections and subjects to populate this page." /> : <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Teacher</th><th className="p-3">Academic year</th><th className="p-3">Class</th><th className="p-3">Section</th><th className="p-3">Group</th><th className="p-3">Subject</th><th className="p-3">Responsibility</th><th className="p-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{assignments.map(item => <tr key={item.id}><td className="p-3 font-semibold">{item.teacher.nameEn}</td><td className="p-3">{item.academicYear.name}</td><td className="p-3">{item.class.name}</td><td className="p-3">{item.section.name}</td><td className="p-3">{item.group?.name || '—'}</td><td className="p-3">{item.subject.nameEn}</td><td className="p-3">{item.isClassTeacher ? 'Class teacher' : 'Subject teacher'}</td><td className="p-3">{item.status}</td></tr>)}</tbody></table></div>}</section>
  </div>;
}
