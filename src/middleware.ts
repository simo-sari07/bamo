import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin API routes (except authentication endpoint)
  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/auth") {
      return NextResponse.next();
    }
    const token = request.cookies.get("bamo_admin_session");
    if (!token || !token.value) {
      return NextResponse.json(
        { error: "Accès refusé. Session administrateur requise." },
        { status: 401 }
      );
    }
  }

  // Protect Admin Pages
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("bamo_admin_session");
    if (!token || !token.value) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is already authenticated and visits /admin/login, redirect to /admin
  if (pathname === "/admin/login") {
    const token = request.cookies.get("bamo_admin_session");
    if (token && token.value) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
