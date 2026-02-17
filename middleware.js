import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/auth')) {

    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }


  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // User has token, allow access to protected routes
  return NextResponse.next();
}

// This prevents the middleware from running on static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, manifest.json, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|globals.css).*)',
  ],
};