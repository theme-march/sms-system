import Link from 'next/link';
import { ShieldX } from 'lucide-react';
import { getCurrentSession } from '@/src/lib/auth/session';
import { defaultLandingPage } from '@/src/config/access-control';

export default async function UnauthorizedPage() {
  const session = await getCurrentSession();
  const home = session ? defaultLandingPage(session.permissions, session.roles) : '/login';

  return (
    <section className="mx-auto mt-16 max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <ShieldX className="mx-auto h-12 w-12 text-rose-500" />
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Access denied</h1>
      <p className="mt-2 text-sm text-slate-500">
        Your assigned role does not include permission to open this module. Contact a Super Admin if access is required.
      </p>
      <Link href={home} className="mt-6 inline-flex rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
        Return to my dashboard
      </Link>
    </section>
  );
}
