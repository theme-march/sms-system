import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('school_session')?.value;
  const { pathname } = request.nextUrl;
  const isPublic =
    pathname === '/login' ||
    pathname.startsWith('/admission/') ||
    pathname.startsWith('/api/auth/');

  if (pathname === '/') {
    return NextResponse.redirect(new URL(sessionCookie ? '/dashboard' : '/login', request.url));
  }

  if (!isPublic && !sessionCookie) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-dashboard-path', pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
