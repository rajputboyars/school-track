import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  const isPublic =
    pathname.startsWith("/login") || pathname.startsWith("/api/auth/login");

  if (isPublic) {
    return NextResponse.next();
  }

  // Get token from cookies or headers
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

   // ✅ DO NOT VERIFY HERE
  return NextResponse.next();
}
