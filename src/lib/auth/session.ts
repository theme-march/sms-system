import { cookies } from 'next/headers';
import prisma from '@/src/lib/db/prisma';
import { UserSessionData } from '@/src/lib/permissions';
import { randomUUID } from 'crypto';

const SESSION_COOKIE_NAME = 'school_session';
const SESSION_EXPIRY_DAYS = 7;

export async function createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  await prisma.userSession.create({
    data: { userId, token, ipAddress, userAgent, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return token;
}

export async function getCurrentSession(): Promise<UserSessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    // No session token present
    return null;
  }

  try {
    const session = await prisma.userSession.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session || new Date() > session.expiresAt || !session.user || session.user.status !== 'ACTIVE') {
      return null;
    }

    const roles = session.user.userRoles.map((ur) => ur.role.name);
    const permissionsSet = new Set<string>();

    session.user.userRoles.forEach((ur) => {
      ur.role.permissions.forEach((rp) => {
        permissionsSet.add(rp.permission.code);
      });
    });

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      schoolId: session.user.schoolId,
      roles,
      permissions: Array.from(permissionsSet),
    };
  } catch (err) {
    console.error('Error retrieving session', err);
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await prisma.userSession.delete({ where: { token } });
    } catch {
      // ignore connection error
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
