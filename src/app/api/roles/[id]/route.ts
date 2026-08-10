import { NextResponse } from 'next/server';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { createAuditLog } from '@/src/lib/audit';
import { PERMISSIONS } from '@/src/config/permissions';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requirePermission(PERMISSIONS.ROLES_MANAGE);
    if (!session.roles.includes('Super Admin')) throw new Error('FORBIDDEN');
    const { id } = await context.params;
    const existing = await prisma.role.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
    if (existing.name === 'Super Admin') {
      return NextResponse.json({ error: 'Super Administrator is protected and cannot be edited.' }, { status: 409 });
    }

    const body = await request.json();
    const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    if (displayName.length < 2 || displayName.length > 60) {
      return NextResponse.json({ error: 'Role name must be between 2 and 60 characters.' }, { status: 400 });
    }
    if (description.length > 240) {
      return NextResponse.json({ error: 'Description cannot exceed 240 characters.' }, { status: 400 });
    }
    const duplicate = await prisma.role.findFirst({ where: { displayName, NOT: { id } } });
    if (duplicate) return NextResponse.json({ error: 'A role with this display name already exists.' }, { status: 409 });

    const role = await prisma.role.update({
      where: { id },
      data: { displayName, description: description || null },
    });
    await createAuditLog({
      schoolId: session.schoolId,
      userId: session.id,
      action: 'UPDATE',
      module: 'Roles & Permissions',
      recordId: role.id,
      details: JSON.stringify({ before: { displayName: existing.displayName, description: existing.description }, after: { displayName, description } }),
    });
    return NextResponse.json({ role });
  } catch (error) {
    return NextResponse.json({ error: 'You are not allowed to edit this role.' }, { status: authorizationStatus(error) });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requirePermission(PERMISSIONS.ROLES_MANAGE);
    if (!session.roles.includes('Super Admin')) throw new Error('FORBIDDEN');
    const { id } = await context.params;
    const role = await prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { userRoles: true } } },
    });
    if (!role) return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
    if (role.isSystem || role.name === 'Super Admin') {
      return NextResponse.json({ error: 'Built-in system roles cannot be deleted.' }, { status: 409 });
    }
    if (role._count.userRoles > 0) {
      return NextResponse.json({ error: `Remove this role from ${role._count.userRoles} assigned user(s) before deleting it.` }, { status: 409 });
    }

    await prisma.role.delete({ where: { id } });
    await createAuditLog({
      schoolId: session.schoolId,
      userId: session.id,
      action: 'DELETE',
      module: 'Roles & Permissions',
      recordId: role.id,
      details: JSON.stringify({ role: role.name, displayName: role.displayName }),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'You are not allowed to delete this role.' }, { status: authorizationStatus(error) });
  }
}
