import { NextResponse } from 'next/server';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { createAuditLog } from '@/src/lib/audit';
import { PERMISSIONS } from '@/src/config/permissions';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requirePermission(PERMISSIONS.ROLES_MANAGE);
    if (!session.roles.includes('Super Admin')) throw new Error('FORBIDDEN');

    const { id } = await context.params;
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
    if (role.name === 'Super Admin') {
      return NextResponse.json({ error: 'Super Admin always has full access and cannot be restricted.' }, { status: 400 });
    }

    const body = await request.json();
    const requested: string[] | null = Array.isArray(body.permissionCodes)
      ? [...new Set<string>((body.permissionCodes as unknown[]).filter((code): code is string => typeof code === 'string'))]
      : null;
    if (!requested) return NextResponse.json({ error: 'permissionCodes must be an array.' }, { status: 400 });

    const permissions = await prisma.permission.findMany({ where: { code: { in: requested } } });
    if (permissions.length !== requested.length) {
      return NextResponse.json({ error: 'One or more permission codes are invalid.' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId: role.id } }),
      prisma.rolePermission.createMany({
        data: permissions.map((permission) => ({ roleId: role.id, permissionId: permission.id })),
      }),
    ]);
    await createAuditLog({
      schoolId: session.schoolId,
      userId: session.id,
      action: 'UPDATE',
      module: 'Roles & Permissions',
      recordId: role.id,
      details: JSON.stringify({ role: role.name, permissionCodes: requested }),
    });

    return NextResponse.json({ ok: true, permissions: requested });
  } catch (error) {
    return NextResponse.json({ error: 'You are not allowed to update this role.' }, { status: authorizationStatus(error) });
  }
}
