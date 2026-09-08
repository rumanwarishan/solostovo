import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, type OrderStatus } from "@/data/orders";

const VALID: OrderStatus[] = ["paid", "processing", "shipped", "refunded"];

// Protected by src/proxy.ts (matcher covers /api/admin/:path* — same admin
// Basic Auth as the /admin pages).
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.status as OrderStatus | undefined;

  if (!status || !VALID.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    await updateOrderStatus(id, status);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update order." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
