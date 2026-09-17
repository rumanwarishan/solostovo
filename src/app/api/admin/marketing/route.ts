import { NextRequest, NextResponse } from "next/server";
import { setMarketingContent, isValidGtmId, isValidMetaPixelId, type MarketingContent } from "@/data/content";
import { isDbConfigured } from "@/lib/db";

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function PUT(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const body = (await req.json().catch(() => null)) as MarketingContent | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const googleTagManagerId = (body.googleTagManagerId ?? "").trim();
  const metaPixelId = (body.metaPixelId ?? "").trim();

  if (!isValidGtmId(googleTagManagerId)) {
    return NextResponse.json(
      { error: "That doesn't look like a Google Tag Manager container ID (expected format: GTM-XXXXXXX)." },
      { status: 400 }
    );
  }
  if (!isValidMetaPixelId(metaPixelId)) {
    return NextResponse.json(
      { error: "That doesn't look like a Meta Pixel ID (should be a numeric ID from Events Manager)." },
      { status: 400 }
    );
  }

  try {
    await setMarketingContent({ googleTagManagerId, metaPixelId });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save marketing settings." },
      { status: 400 }
    );
  }
}
