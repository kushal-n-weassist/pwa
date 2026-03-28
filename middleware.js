import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/signup/verify-otp",
  ];

  const isAuthRoute = pathname.startsWith("/auth");
  const isPublic = publicRoutes.includes(pathname);

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/auth/signup/verify-otp")) {
    return NextResponse.next();
  }

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|manifest.webmanifest|sw.js|workbox-.*\\.js|offline|icons|globals.css).*)",
  ],
};