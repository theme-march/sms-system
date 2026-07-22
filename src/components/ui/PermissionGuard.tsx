import React from 'react';
import { PermissionCode } from '@/src/config/permissions';
import { hasPermission } from '@/src/lib/permissions';

interface PermissionGuardProps {
  userPermissions: string[];
  permission: PermissionCode;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  userPermissions,
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  if (hasPermission(userPermissions, permission)) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}
