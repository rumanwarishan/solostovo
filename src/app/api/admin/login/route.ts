import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, createSession } from "@/data/admin-users";
import { isDbConfigured } from "@/lib/db";
import { SESSION_COOKIE, SESSION_TTL_MS } from "@/lib/auth";

// Publicly reachable (src/proxy.ts explicitly exempts this path) — it's the
// login mechanism itself, so it can't require an existing session.
export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "No database connected — using the single ADMIN_USER/ADMIN_PASSWORD login instead." },
      { status: 501 }
    );
  }
  const body = await req.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const user = await verifyAdminCredentials(username, password);
  if (!user) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const { token } = await createSession(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return res;
}
