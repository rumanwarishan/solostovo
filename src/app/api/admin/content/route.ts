import { NextRequest, NextResponse } from "next/server";
import {
  setHeroContent,
  setAnnouncements,
  setValueProps,
  setTrustContent,
  setCommunityContent,
} from "@/data/content";
import { isDbConfigured } from "@/lib/db";

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function PUT(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    await Promise.all([
      setHeroContent(body.hero),
      setAnnouncements(body.announcements),
      setValueProps(body.valueProps),
      setTrustContent(body.trust),
      setCommunityContent(body.community),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save content." },
      { status: 400 }
    );
  }
}
