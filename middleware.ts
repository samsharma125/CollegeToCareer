import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup";

  // ✅ Correct Supabase session detection
  const hasSession = req.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.startsWith("sb-") &&
        cookie.name.endsWith("-auth-token")
    );

  // 🔒 Not logged in → block dashboard
  if (isDashboard && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🚀 Logged in → block landing/login/signup
  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
};
