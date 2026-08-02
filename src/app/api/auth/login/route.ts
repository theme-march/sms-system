import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/src/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/src/lib/auth/session';
import { defaultLandingPage } from '@/src/config/access-control';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const cutoff = new Date(Date.now() - 15 * 60 * 1000);
    const recentFailures = await prisma.failedLoginAttempt.count({
      where: { email, attemptAt: { gte: cutoff } },
    });
    if (recentFailures >= 5) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Try again in 15 minutes.' },
        { status: 429 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: {
              select: {
                name: true,
                permissions: { select: { permission: { select: { code: true } } } },
              },
            },
          },
        },
      },
    });
    const validPassword = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !validPassword || user.status !== 'ACTIVE') {
      await prisma.failedLoginAttempt.create({
        data: { email, ipAddress, userId: user?.id },
      });
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    await createSession(user.id, ipAddress, request.headers.get('user-agent') ?? undefined);
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent: request.headers.get('user-agent'),
        status: 'SUCCESS',
      },
    });

    const roles = user.userRoles.map((assignment) => assignment.role.name);
    const permissions = [...new Set(user.userRoles.flatMap((assignment) =>
      assignment.role.permissions.map((entry) => entry.permission.code),
    ))];
    const redirectTo = defaultLandingPage(permissions, roles);

    return NextResponse.json({ ok: true, redirectTo });
  } catch (e) {
    console.error('Auth login error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
