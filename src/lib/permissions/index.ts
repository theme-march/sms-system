import { PermissionCode } from '@/src/config/permissions';

export interface UserSessionData {
  id: string;
  email: string;
  name: string;
  schoolId: string | null;
  roles: string[];
  permissions: string[];
}

export function hasPermission(
  userPermissions: string[],
  requiredPermission: PermissionCode
): boolean {
  if (userPermissions.includes('ALL') || userPermissions.includes('dashboard.view') && requiredPermission === 'dashboard.view') {
    return true;
  }
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: PermissionCode[]
): boolean {
  return requiredPermissions.some((perm) => hasPermission(userPermissions, perm));
}
