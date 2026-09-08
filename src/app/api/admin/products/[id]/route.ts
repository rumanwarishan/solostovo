import { NextRequest, NextResponse } from "next/server";
import { updateProduct, deleteProduct } from "@/data/products";
import { isDbConfigured } from "@/lib/db";
import type { ProductFormPayload } from "@/components/admin/ProductForm";

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as ProductFormPayload | null;
  if (!body?.name || !body.slug || !body.family) {
    return NextResponse.json({ error: "Name, slug, and category are required." }, { status: 400 });
  }

  try {
    await updateProduct(id, {
      slug: body.slug,
      name: body.name,
      family: body.family,
      fit: body.fit || undefined,
      fuel: body.fuel || undefined,
      price: body.price,
      compareAtPrice: body.compareAtPrice,
      rating: body.rating,
      reviewCount: body.reviewCount,
      badges: body.badges,
      shortDescription: body.shortDescription,
      description: body.description,
      specs: body.specs,
      imageTone: body.imageTone,
      crossSell: body.crossSell,
      compareGroup: body.compareGroup || undefined,
      stock: body.stock,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update product." },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const { id } = await params;
  try {
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete product." },
      { status: 400 }
    );
  }
}
