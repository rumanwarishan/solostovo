import { NextRequest, NextResponse } from "next/server";
import { setCustomCode, type CustomCodeContent } from "@/data/content";
import { isDbConfigured } from "@/lib/db";

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function PUT(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const body = (await req.json().catch(() => null)) as CustomCodeContent | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  try {
    await setCustomCode({
      header: body.header ?? "",
      content: body.content ?? "",
      footer: body.footer ?? "",
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save custom code." },
      { status: 400 }
    );
  }
}
