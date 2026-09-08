import { NextRequest, NextResponse } from "next/server";
import { createCategory } from "@/data/categories";
import { isDbConfigured } from "@/lib/db";

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const body = await req.json().catch(() => null);
  if (!body?.slug || !body?.name) {
    return NextResponse.json({ error: "Slug and name are required." }, { status: 400 });
  }
  try {
    await createCategory({ slug: body.slug, name: body.name, description: body.description ?? "" });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create category." },
      { status: 400 }
    );
  }
}
