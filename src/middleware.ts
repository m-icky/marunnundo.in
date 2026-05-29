import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve token from cookies
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie?.value;

  // Enforce Owner Dashboard protection
  if (pathname.startsWith('/owner')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('role', 'OWNER');
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'OWNER') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('role', 'OWNER');
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Enforce Super Admin Dashboard protection
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('role', 'SUPERADMIN');
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'SUPERADMIN') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('role', 'SUPERADMIN');
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/owner/:path*', '/admin/:path*'],
};
