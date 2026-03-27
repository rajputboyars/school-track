import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Skip Next.js internal files & static assets (VERY IMPORTANT)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".") // handles css, js, png, etc.
  ) {
    return NextResponse.next();
  }

  // ✅ Public routes
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth/login");

  if (isPublic) {
    return NextResponse.next();
  }

  // ✅ Get token
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}