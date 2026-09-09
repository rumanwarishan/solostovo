import { NextRequest, NextResponse } from "next/server";
import { listAdminUsers, createAdminUser } from "@/data/admin-users";
import { isDbConfigured } from "@/lib/db";

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const users = await listAdminUsers();
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const body = await req.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!username || password.length < 8) {
    return NextResponse.json(
      { error: "Username is required and password must be at least 8 characters." },
      { status: 400 }
    );
  }

  try {
    const user = await createAdminUser(username, password);
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create user." },
      { status: 400 }
    );
  }
}
