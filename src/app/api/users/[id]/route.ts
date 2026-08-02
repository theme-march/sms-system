import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { createAuditLog } from '@/src/lib/audit';

const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(190).transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  password: z.string().min(8).max(128).optional().or(z.literal('')),
  roleId: z.string().uuid(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']),
  language: z.enum(['en', 'bn']),
  avatarUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
});

async function ownedUser(id: string) {
  const session = await requirePermission(PERMISSIONS.USERS_MANAGE);
  const user = await prisma.user.findFirst({
    where: { id, schoolId: session.schoolId, deletedAt: null },
    select: { id: true, email: true, userRoles: { select: { role: { select: { name: true } } } } },
  });
  if (!user) throw new Error('USER_NOT_FOUND');
  return { session, user };
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { session, user: existingUser } = await ownedUser(id);
    const parsed = updateUserSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid user data.' }, { status: 400 });
    const targetIsSuperAdmin = existingUser.userRoles.some(({ role }) => role.name === 'Super Admin');
    const role = await prisma.role.findUnique({ where: { id: parsed.data.roleId }, select: { id: true, name: true, displayName: true } });
    if (!role) return NextResponse.json({ error: 'Selected role does not exist.' }, { status: 400 });
    if (role.name === 'Super Admin' && !targetIsSuperAdmin) return NextResponse.json({ error: 'Only one Super Admin is allowed.' }, { status: 409 });
    if (targetIsSuperAdmin && (role.name !== 'Super Admin' || parsed.data.status !== 'ACTIVE')) {
      return NextResponse.json({ error: 'The primary Super Admin must remain active with the Super Admin role.' }, { status: 409 });
    }
    const duplicate = await prisma.user.findFirst({ where: { email: parsed.data.email, id: { not: id } }, select: { id: true } });
    if (duplicate) return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });

    const passwordHash = parsed.data.password ? await bcrypt.hash(parsed.data.password, 12) : undefined;
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id }, data: {
        name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone || null,
        status: parsed.data.status, language: parsed.data.language, avatarUrl: parsed.data.avatarUrl || null,
        ...(passwordHash ? { passwordHash } : {}),
      } });
      await tx.userRole.deleteMany({ where: { userId: id } });
      await tx.userRole.create({ data: { userId: id, roleId: role.id } });
      if (parsed.data.status !== 'ACTIVE' || passwordHash) await tx.userSession.deleteMany({ where: { userId: id } });
    });
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'UPDATE', module: 'Users', recordId: id, details: `Updated ${role.displayName} account ${parsed.data.email}` });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('PATCH /api/users/[id] error', error);
    const message = error instanceof Error ? error.message : '';
    return NextResponse.json({ error: message === 'USER_NOT_FOUND' ? 'User not found.' : 'Unable to update user.' }, { status: message === 'USER_NOT_FOUND' ? 404 : authorizationStatus(error) });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { session, user } = await ownedUser(id);
    if (id === session.id) return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 409 });
    if (user.userRoles.some(({ role }) => role.name === 'Super Admin')) return NextResponse.json({ error: 'The primary Super Admin cannot be deleted.' }, { status: 409 });
    await prisma.$transaction([
      prisma.userSession.deleteMany({ where: { userId: id } }),
      prisma.user.update({ where: { id }, data: { status: 'INACTIVE', deletedAt: new Date() } }),
    ]);
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'DELETE', module: 'Users', recordId: id, details: `Deleted user account ${user.email}` });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/users/[id] error', error);
    const message = error instanceof Error ? error.message : '';
    return NextResponse.json({ error: message === 'USER_NOT_FOUND' ? 'User not found.' : 'Unable to delete user.' }, { status: message === 'USER_NOT_FOUND' ? 404 : authorizationStatus(error) });
  }
}
