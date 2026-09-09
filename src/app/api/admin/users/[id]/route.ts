import { NextRequest, NextResponse } from "next/server";
import { deleteAdminUser, getSessionUser } from "@/data/admin-users";
import { isDbConfigured } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const { id } = await params;

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const currentUser = token ? await getSessionUser(token) : null;
  if (currentUser?.id === id) {
    return NextResponse.json({ error: "You can't remove the account you're logged in as." }, { status: 400 });
  }

  try {
    await deleteAdminUser(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to remove user." },
      { status: 400 }
    );
  }
}
