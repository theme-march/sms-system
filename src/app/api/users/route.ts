import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/src/lib/db/prisma';
import { requirePermission, authorizationStatus } from '@/src/lib/auth/authorize';
import { PERMISSIONS } from '@/src/config/permissions';
import { createAuditLog } from '@/src/lib/audit';

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(190).transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  password: z.string().min(8).max(128),
  roleId: z.string().uuid(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']).default('ACTIVE'),
  language: z.enum(['en', 'bn']).default('en'),
  avatarUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
});

export async function GET(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.USERS_VIEW);
    const search = request.nextUrl.searchParams.get('search')?.trim() ?? '';
    const status = request.nextUrl.searchParams.get('status')?.trim() ?? '';
    const roleId = request.nextUrl.searchParams.get('roleId')?.trim() ?? '';
    const page = Math.max(1, Number(request.nextUrl.searchParams.get('page') || 1));
    const pageSize = Math.min(100, Math.max(10, Number(request.nextUrl.searchParams.get('pageSize') || 20)));
    const where = {
      schoolId: session.schoolId,
      deletedAt: null,
      ...(status ? { status: status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING' } : {}),
      ...(roleId ? { userRoles: { some: { roleId } } } : {}),
      ...(search ? { OR: [{ name: { contains: search } }, { email: { contains: search } }, { phone: { contains: search } }] } : {}),
    };

    const [users, total, roles] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, phone: true, status: true, language: true,
          avatarUrl: true, createdAt: true, updatedAt: true,
          userRoles: { select: { role: { select: { id: true, name: true, displayName: true } } } },
          teacher: { select: { id: true, employeeCode: true } },
          employee: { select: { id: true, employeeCode: true } },
          student: { select: { id: true, studentCode: true } },
          guardian: { select: { id: true } },
        },
        orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
      prisma.role.findMany({ select: { id: true, name: true, displayName: true }, orderBy: { displayName: 'asc' } }),
    ]);

    return NextResponse.json({
      data: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        roles: user.userRoles.map(({ role }) => role),
        userRoles: undefined,
        profile: user.teacher ? { type: 'teacher', id: user.teacher.id, code: user.teacher.employeeCode }
          : user.employee ? { type: 'employee', id: user.employee.id, code: user.employee.employeeCode }
            : user.student ? { type: 'student', id: user.student.id, code: user.student.studentCode }
              : user.guardian ? { type: 'guardian', id: user.guardian.id, code: null }
                : null,
        teacher: undefined, employee: undefined, student: undefined, guardian: undefined,
      })),
      roles,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
      canManage: session.roles.includes('Super Admin') || session.permissions.includes(PERMISSIONS.USERS_MANAGE),
      currentUserId: session.id,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to load users.' }, { status: authorizationStatus(error) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.USERS_MANAGE);
    const parsed = createUserSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid user data.' }, { status: 400 });

    const role = await prisma.role.findUnique({ where: { id: parsed.data.roleId }, select: { id: true, name: true, displayName: true } });
    if (!role) return NextResponse.json({ error: 'Selected role does not exist.' }, { status: 400 });
    if (role.name === 'Super Admin') return NextResponse.json({ error: 'Only one Super Admin is allowed.' }, { status: 409 });
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
    if (existing) return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        schoolId: session.schoolId,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        passwordHash,
        status: parsed.data.status,
        language: parsed.data.language,
        avatarUrl: parsed.data.avatarUrl || null,
        userRoles: { create: { roleId: role.id } },
      },
      select: { id: true, name: true, email: true },
    });
    await createAuditLog({ schoolId: session.schoolId, userId: session.id, action: 'CREATE', module: 'Users', recordId: user.id, details: `Created ${role.displayName} account ${user.email}` });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error', error);
    return NextResponse.json({ error: 'Unable to create user.' }, { status: authorizationStatus(error) });
  }
}
