import { NextRequest, NextResponse } from "next/server";
import { setSettings, type SiteSettings } from "@/data/content";
import { isDbConfigured } from "@/lib/db";

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function PUT(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const body = (await req.json().catch(() => null)) as SiteSettings | null;
  if (!body?.siteTitle) {
    return NextResponse.json({ error: "Site title is required." }, { status: 400 });
  }
  try {
    await setSettings(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save settings." },
      { status: 400 }
    );
  }
}
