import { NextRequest, NextResponse } from "next/server";
import { getManualPaymentMethods, type ManualMethodKey } from "@/data/payment-settings";
import { getProductById } from "@/data/products";
import { createOrder, type Order, type OrderItem } from "@/data/orders";
import { generateId } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";

type CheckoutLine = { productId: string; quantity: number };

const VALID_METHODS = new Set<string>(["bank_transfer", "cash_on_delivery"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }

  const body = await req.json().catch(() => null);
  const lines: CheckoutLine[] = body?.lines ?? [];
  const method = body?.method;
  const customerEmail = (body?.customerEmail ?? "").trim();
  const customerName = (body?.customerName ?? "").trim();

  if (!customerName) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(customerEmail)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (typeof method !== "string" || !VALID_METHODS.has(method)) {
    return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
  }
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  // Never trust the client on whether a manual method is actually enabled —
  // it could be stale (turned off after the page loaded) or forged.
  const manualMethods = await getManualPaymentMethods();
  const methodConfig = manualMethods[method as ManualMethodKey];
  if (!methodConfig?.enabled) {
    return NextResponse.json({ error: "That payment method isn't available." }, { status: 400 });
  }

  // Prices always come from the server-side catalog, never the client.
  const resolved = await Promise.all(
    lines.map(async (line): Promise<OrderItem | null> => {
      const product = await getProductById(line.productId);
      if (!product || line.quantity < 1) return null;
      return {
        productId: product.id,
        name: product.name,
        quantity: line.quantity,
        unitPrice: product.price,
      };
    })
  );
  const items = resolved.filter((i): i is OrderItem => i !== null);
  if (items.length === 0) {
    return NextResponse.json({ error: "No valid items in cart." }, { status: 400 });
  }

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const order: Order = {
    id: `ORD-${generateId().slice(0, 8).toUpperCase()}`,
    customerEmail,
    customerName,
    items,
    total,
    status: "pending_payment",
    createdAt: new Date().toISOString(),
    source: method as ManualMethodKey,
  };

  await createOrder(order);

  return NextResponse.json({ orderId: order.id });
}
