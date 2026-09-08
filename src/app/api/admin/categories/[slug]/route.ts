import { NextRequest, NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/data/categories";
import { isDbConfigured } from "@/lib/db";

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const { slug } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  try {
    await updateCategory(slug, { name: body.name, description: body.description ?? "" });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update category." },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const { slug } = await params;
  try {
    await deleteCategory(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? e.message
            : "Failed to delete category — it may still have products assigned to it.",
      },
      { status: 400 }
    );
  }
}
