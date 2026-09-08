import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { appendGeneratedOrder, type Order } from "@/data/orders";

/**
 * Receives Stripe webhook events. In dev, forward events to this route with:
 *   stripe listen --forward-to localhost:3000/api/stripe/webhook
 * In production, add this URL as an endpoint in the Stripe dashboard and
 * copy its signing secret into STRIPE_WEBHOOK_SECRET.
 */
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 501 });
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let stripe;
  try {
    stripe = getStripe();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Stripe is not configured." },
      { status: 501 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature ?? "", webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err instanceof Error ? err.message : "unknown error"}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

    const order: Order = {
      id: `ORD-${session.id.slice(-8).toUpperCase()}`,
      customerEmail: session.customer_details?.email ?? "unknown@example.com",
      customerName: session.customer_details?.name ?? "Unknown",
      items: lineItems.data.map((li) => ({
        productId: li.price?.product?.toString() ?? "unknown",
        name: li.description ?? "Item",
        quantity: li.quantity ?? 1,
        unitPrice: (li.price?.unit_amount ?? 0) / 100,
      })),
      total: (session.amount_total ?? 0) / 100,
      status: "paid",
      createdAt: new Date().toISOString(),
      source: "stripe",
    };

    appendGeneratedOrder(order);
  }

  return NextResponse.json({ received: true });
}
