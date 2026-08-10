import { NextResponse } from 'next/server';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { createAuditLog } from '@/src/lib/audit';
import { PERMISSIONS } from '@/src/config/permissions';

export async function GET() {
  try {
    const session = await requirePermission(PERMISSIONS.ROLES_VIEW);
    const [roles, permissions] = await Promise.all([
      prisma.role.findMany({
        include: {
          permissions: { select: { permission: { select: { code: true } } } },
          _count: { select: { userRoles: true } },
        },
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
        userCount: role._count.userRoles,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
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

function roleKey(displayName: string) {
  return displayName
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission(PERMISSIONS.ROLES_MANAGE);
    if (!session.roles.includes('Super Admin')) throw new Error('FORBIDDEN');

    const body = await request.json();
    const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const permissionCodes = Array.isArray(body.permissionCodes)
      ? [...new Set<string>((body.permissionCodes as unknown[]).filter((code): code is string => typeof code === 'string'))]
      : [];

    if (displayName.length < 2 || displayName.length > 60) {
      return NextResponse.json({ error: 'Role name must be between 2 and 60 characters.' }, { status: 400 });
    }
    if (description.length > 240) {
      return NextResponse.json({ error: 'Description cannot exceed 240 characters.' }, { status: 400 });
    }

    const name = roleKey(displayName);
    if (!name) return NextResponse.json({ error: 'Please enter a valid role name.' }, { status: 400 });
    const duplicate = await prisma.role.findFirst({
      where: { OR: [{ name: { equals: name } }, { displayName: { equals: displayName } }] },
    });
    if (duplicate) return NextResponse.json({ error: 'A role with this name already exists.' }, { status: 409 });

    const validPermissions = await prisma.permission.findMany({ where: { code: { in: permissionCodes } } });
    if (validPermissions.length !== permissionCodes.length) {
      return NextResponse.json({ error: 'One or more permission codes are invalid.' }, { status: 400 });
    }

    const role = await prisma.role.create({
      data: {
        name,
        displayName,
        description: description || null,
        isSystem: false,
        permissions: {
          create: validPermissions.map((permission) => ({ permissionId: permission.id })),
        },
      },
      include: { permissions: { select: { permission: { select: { code: true } } } } },
    });

    await createAuditLog({
      schoolId: session.schoolId,
      userId: session.id,
      action: 'CREATE',
      module: 'Roles & Permissions',
      recordId: role.id,
      details: JSON.stringify({ role: role.name, permissionCodes }),
    });

    return NextResponse.json({
      role: {
        id: role.id,
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        isSystem: role.isSystem,
        userCount: 0,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        permissions: role.permissions.map((entry) => entry.permission.code),
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'You are not allowed to create roles.' }, { status: authorizationStatus(error) });
  }
}
