import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProductById } from "@/data/products";

type CheckoutLine = { productId: string; quantity: number };

export async function POST(req: NextRequest) {
  let stripe;
  try {
    stripe = getStripe();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Stripe is not configured." },
      { status: 501 }
    );
  }

  const body = await req.json().catch(() => null);
  const lines: CheckoutLine[] = body?.lines ?? [];

  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  // Prices always come from the server-side catalog, never the client —
  // never trust a price submitted by the browser, even if the cart UI
  // already shows a snapshot of it.
  const resolved = await Promise.all(
    lines.map(async (line) => {
      const product = await getProductById(line.productId);
      if (!product || line.quantity < 1) return null;
      return {
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100),
          product_data: { name: product.name },
        },
      };
    })
  );
  const line_items = resolved.filter((li): li is NonNullable<typeof li> => li !== null);

  if (line_items.length === 0) {
    return NextResponse.json({ error: "No valid items in cart." }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel`,
    shipping_address_collection: { allowed_countries: ["US", "CA"] },
  });

  return NextResponse.json({ url: session.url });
}
