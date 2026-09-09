import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { setPaymentCredentials, type PaymentCredentials } from "@/data/payment-settings";
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
  const secretKey = typeof body?.secretKey === "string" ? body.secretKey.trim() : "";
  const webhookSecret = typeof body?.webhookSecret === "string" ? body.webhookSecret.trim() : "";

  if (!secretKey && !webhookSecret) {
    return NextResponse.json({ error: "Enter a secret key or webhook secret to save." }, { status: 400 });
  }

  const patch: Partial<PaymentCredentials> = {};

  if (secretKey) {
    try {
      const stripe = new Stripe(secretKey);
      await stripe.balance.retrieve(); // confirms the key actually authenticates
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Stripe rejected this secret key." },
        { status: 400 }
      );
    }
    patch.stripeSecretKey = secretKey;
  }
  if (webhookSecret) patch.stripeWebhookSecret = webhookSecret;

  try {
    await setPaymentCredentials(patch);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save Stripe credentials." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  await setPaymentCredentials({ stripeSecretKey: "", stripeWebhookSecret: "" });
  return NextResponse.json({ ok: true });
}
