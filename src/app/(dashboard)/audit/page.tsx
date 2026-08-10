import { ClipboardList } from 'lucide-react';
import { redirect } from 'next/navigation';
import prisma from '@/src/lib/db/prisma';
import { getCurrentSession } from '@/src/lib/auth/session';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { DatabaseEmptyState } from '@/src/components/ui/DatabaseEmptyState';
import { ServerTablePagination } from '@/src/components/tables/ServerTablePagination';

type AuditSearchParams = Promise<{ page?: string; pageSize?: string }>;

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function AuditLogsPage({ searchParams }: { searchParams: AuditSearchParams }) {
  const session = await getCurrentSession();
  if (!session?.schoolId) redirect('/login');

  const params = await searchParams;
  const requestedPage = positiveInteger(params.page, 1);
  const requestedPageSize = positiveInteger(params.pageSize, 10);
  const pageSize = [10, 25, 50, 100].includes(requestedPageSize) ? requestedPageSize : 10;
  const where = { schoolId: session.schoolId };
  const total = await prisma.auditLog.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const logs = await prisma.auditLog.findMany({
    where,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return <div className="space-y-6">
    <PageHeader title="System Audit Trail" subtitle="Database-recorded security and administrative activity" breadcrumbs={[{ label: 'Audit Logs' }]} />
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold"><ClipboardList className="h-4 w-4 text-teal-600" />Latest activity</h2>
      {!logs.length ? <DatabaseEmptyState title="No audit activity" description="Audit records will appear here after users perform tracked operations." /> :
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Date</th><th className="p-3">User</th><th className="p-3">Action</th><th className="p-3">Module</th><th className="p-3">Details</th><th className="p-3">IP</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{logs.map(log => <tr key={log.id}><td className="p-3 whitespace-nowrap">{log.createdAt.toLocaleString('en-GB')}</td><td className="p-3 font-semibold">{log.user ? `${log.user.name} (${log.user.email})` : 'System'}</td><td className="p-3">{log.action}</td><td className="p-3">{log.module}</td><td className="max-w-xl break-words p-3">{log.details || '—'}</td><td className="p-3 font-mono">{log.ipAddress || '—'}</td></tr>)}</tbody>
          </table>
        </div>
        <ServerTablePagination basePath="/dashboard/audit" page={page} pageSize={pageSize} total={total} />
      </div>}
    </section>
  </div>;
}
