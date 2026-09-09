import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/data/admin-users";
import { isDbConfigured } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

// Publicly reachable (src/proxy.ts explicitly exempts this path) so an
// expired/invalid session can still clear its cookie.
export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token && isDbConfigured()) {
    await deleteSession(token).catch(() => {});
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
