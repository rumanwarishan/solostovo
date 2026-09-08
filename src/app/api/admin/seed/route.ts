import { NextResponse } from "next/server";
import { seedCategories } from "@/data/categories";
import { seedProducts } from "@/data/products";
import { isDbConfigured } from "@/lib/db";

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
// Inserts the placeholder starter catalog — uses INSERT IGNORE, so running
// it again after you've added your own products/categories is harmless.
export async function POST() {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  try {
    await seedCategories();
    await seedProducts();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to seed catalog." },
      { status: 400 }
    );
  }
}
