import { NextRequest, NextResponse } from "next/server";
import { setSectionVisible, defaultSectionVisibility, type SectionVisibility } from "@/data/content";
import { isDbConfigured } from "@/lib/db";

const VALID_KEYS = new Set<string>(Object.keys(defaultSectionVisibility));

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function PUT(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const body = await req.json().catch(() => null);
  const key = body?.key;
  const visible = body?.visible;
  if (typeof key !== "string" || !VALID_KEYS.has(key) || typeof visible !== "boolean") {
    return NextResponse.json({ error: "key must be a valid section and visible must be a boolean." }, { status: 400 });
  }
  try {
    await setSectionVisible(key as keyof SectionVisibility, visible);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update section." },
      { status: 400 }
    );
  }
}
