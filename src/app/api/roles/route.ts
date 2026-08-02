import { NextResponse } from 'next/server';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';

export async function GET() {
  try {
    const session = await requirePermission(PERMISSIONS.ROLES_VIEW);
    const [roles, permissions] = await Promise.all([
      prisma.role.findMany({
        include: { permissions: { select: { permission: { select: { code: true } } } } },
        orderBy: { displayName: 'asc' },
      }),
      prisma.permission.findMany({ orderBy: [{ module: 'asc' }, { name: 'asc' }] }),
    ]);

    return NextResponse.json({
      canManage: session.roles.includes('Super Admin'),
      roles: roles.map((role) => ({
        id: role.id,
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        isSystem: role.isSystem,
        permissions: role.permissions.map((entry) => entry.permission.code),
      })),
      permissions: permissions.map(({ id, code, name, module, description }) => ({
        id, code, name, module, description,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to load roles and permissions.' }, { status: authorizationStatus(error) });
  }
}
