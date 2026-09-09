import { NextRequest, NextResponse } from "next/server";
import { setPaymentCredentials } from "@/data/payment-settings";
import { testPaypalCredentials } from "@/lib/paypal";
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
  const clientId = typeof body?.clientId === "string" ? body.clientId.trim() : "";
  const clientSecret = typeof body?.clientSecret === "string" ? body.clientSecret.trim() : "";
  const mode = body?.mode === "live" ? "live" : "sandbox";

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Client ID and secret are both required." }, { status: 400 });
  }

  const result = await testPaypalCredentials(clientId, clientSecret, mode);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    await setPaymentCredentials({ paypalClientId: clientId, paypalClientSecret: clientSecret, paypalMode: mode });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save PayPal credentials." },
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
  await setPaymentCredentials({ paypalClientId: "", paypalClientSecret: "", paypalMode: "sandbox" });
  return NextResponse.json({ ok: true });
}
