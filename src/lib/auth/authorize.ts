import { getCurrentSession } from '@/src/lib/auth/session';
import type { PermissionCode } from '@/src/config/permissions';

export async function requirePermission(permission: PermissionCode) {
  const session = await getCurrentSession();
  if (!session) throw new Error('UNAUTHORIZED');
  const isSuperAdmin = session.roles.includes('Super Admin');
  if (!isSuperAdmin && !session.permissions.includes(permission)) {
    throw new Error('FORBIDDEN');
  }
  if (!session.schoolId) throw new Error('SCHOOL_CONTEXT_REQUIRED');
  return { ...session, schoolId: session.schoolId };
}

export function authorizationStatus(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (message === 'UNAUTHORIZED') return 401;
  if (message === 'FORBIDDEN') return 403;
  if (message === 'SCHOOL_CONTEXT_REQUIRED') return 400;
  return 500;
}
