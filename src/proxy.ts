import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getSessionUser } from "@/data/admin-users";
import { SESSION_COOKIE } from "@/lib/auth";

const PUBLIC_PATHS = new Set(["/admin/login", "/api/admin/login", "/api/admin/logout"]);

/**
 * Gates /admin. With a database connected, this checks a signed-in session
 * (Admin → Users manages accounts). Without one, there's nowhere to store
 * accounts, so it falls back to single-credential Basic Auth via
 * ADMIN_USER/ADMIN_PASSWORD — a starting point for local/internal use, not
 * a substitute for real auth before this handles real customer data.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  const isApi = pathname.startsWith("/api/admin");

  if (!isDbConfigured()) {
    return legacyBasicAuth(req, isApi);
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? await getSessionUser(token) : null;
  if (!user) {
    if (isApi) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

function legacyBasicAuth(req: NextRequest, isApi: boolean) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  const unauthorized = () =>
    new NextResponse("Authentication required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });

  if (!user || !pass) {
    return new NextResponse(
      "Admin access is disabled: set ADMIN_USER and ADMIN_PASSWORD (see .env.example), or connect a database and sign in from /admin/login.",
      { status: 503 }
    );
  }

  const header = req.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return isApi ? NextResponse.json({ error: "Not authenticated." }, { status: 401 }) : unauthorized();

  const decoded = atob(header.slice(6));
  const separatorIndex = decoded.indexOf(":");
  const suppliedUser = decoded.slice(0, separatorIndex);
  const suppliedPass = decoded.slice(separatorIndex + 1);

  if (suppliedUser !== user || suppliedPass !== pass) {
    return isApi ? NextResponse.json({ error: "Not authenticated." }, { status: 401 }) : unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
