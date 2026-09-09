import { NextRequest, NextResponse } from "next/server";
import { reorderCategories } from "@/data/categories";
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
  if (!Array.isArray(body?.slugs) || body.slugs.some((s: unknown) => typeof s !== "string")) {
    return NextResponse.json({ error: "slugs must be an array of category slugs." }, { status: 400 });
  }
  try {
    await reorderCategories(body.slugs);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to reorder categories." },
      { status: 400 }
    );
  }
}
