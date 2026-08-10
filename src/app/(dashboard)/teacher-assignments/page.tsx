import { BookOpen } from 'lucide-react';
import { redirect } from 'next/navigation';
import prisma from '@/src/lib/db/prisma';
import { getCurrentSession } from '@/src/lib/auth/session';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { DatabaseEmptyState } from '@/src/components/ui/DatabaseEmptyState';
import { AssignmentsTable } from './AssignmentsTable';

export default async function TeacherAssignmentsPage() {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect('/login');
  const assignments = await prisma.teacherAssignment.findMany({
    where: { schoolId: session.schoolId },
    include: { teacher: true, academicYear: true, academicSession: true, class: true, section: true, group: true, subject: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  const rows = assignments.map((item) => ({
    id: item.id,
    teacher: item.teacher.nameEn,
    academicYear: item.academicYear.name,
    className: item.class.name,
    section: item.section.name,
    group: item.group?.name || '—',
    subject: item.subject.nameEn,
    responsibility: item.isClassTeacher ? 'Class teacher' : 'Subject teacher',
    status: item.status,
  }));

  return <div className="space-y-6">
    <PageHeader title="Teacher Assignments" subtitle="Teacher workload assignments stored in MySQL" breadcrumbs={[{ label: 'Teacher Assignments' }]} />
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold"><BookOpen className="h-4 w-4 text-teal-600" />Assignment ledger</h2>
      {!rows.length ? <DatabaseEmptyState title="No teacher assignments" description="Assign teachers to academic years, classes, sections and subjects to populate this page." /> : <AssignmentsTable assignments={rows} />}
    </section>
  </div>;
}
