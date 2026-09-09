import { NextRequest, NextResponse } from "next/server";
import { setSectionOrder } from "@/data/content";
import { defaultSectionOrder, type SectionKey } from "@/config/sections";
import { isDbConfigured } from "@/lib/db";

const VALID_KEYS = new Set<string>(defaultSectionOrder);

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function PUT(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const body = await req.json().catch(() => null);
  const order = body?.order;
  if (
    !Array.isArray(order) ||
    order.length !== defaultSectionOrder.length ||
    !order.every((k) => typeof k === "string" && VALID_KEYS.has(k))
  ) {
    return NextResponse.json({ error: "order must include every section key exactly once." }, { status: 400 });
  }
  try {
    await setSectionOrder(order as SectionKey[]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save section order." },
      { status: 400 }
    );
  }
}
