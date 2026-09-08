import { NextRequest, NextResponse } from "next/server";

/**
 * Minimal Basic Auth gate for /admin. This is a starting point for local/
 * internal use, not a substitute for real authentication (roles, sessions,
 * audit logs) before this handles real customer data in production —
 * swap in NextAuth/Clerk/your identity provider before going live.
 */
export function proxy(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  const unauthorized = () =>
    new NextResponse("Authentication required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });

  if (!user || !pass) {
    return new NextResponse(
      "Admin access is disabled: set ADMIN_USER and ADMIN_PASSWORD (see .env.example).",
      { status: 503 }
    );
  }

  const header = req.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return unauthorized();

  const decoded = atob(header.slice(6));
  const separatorIndex = decoded.indexOf(":");
  const suppliedUser = decoded.slice(0, separatorIndex);
  const suppliedPass = decoded.slice(separatorIndex + 1);

  if (suppliedUser !== user || suppliedPass !== pass) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
