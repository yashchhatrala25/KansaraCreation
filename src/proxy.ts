import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const rawToken = request.cookies.get("kc_admin_token")?.value;
  const session = rawToken ? verifyAdminToken(rawToken) : null;
  const isAuthenticated = !!session;
  const isLoginPage = pathname === "/admin/login";

  // If user is trying to access /admin/login while already logged in
  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // If user is trying to access /admin or any protected admin page without valid token
  if (!isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin" && pathname !== "/admin/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // If visiting /admin root while logged in, redirect to dashboard
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
