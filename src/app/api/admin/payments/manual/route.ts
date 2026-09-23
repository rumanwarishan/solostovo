import { NextRequest, NextResponse } from "next/server";
import { setManualPaymentMethod, type ManualMethodKey } from "@/data/payment-settings";
import { isDbConfigured } from "@/lib/db";

const VALID_METHODS = new Set<string>(["bank_transfer", "cash_on_delivery"]);

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function PUT(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }
  const body = await req.json().catch(() => null);
  const method = body?.method;
  const enabled = body?.enabled;
  const instructions = body?.instructions;

  if (
    typeof method !== "string" ||
    !VALID_METHODS.has(method) ||
    typeof enabled !== "boolean" ||
    typeof instructions !== "string"
  ) {
    return NextResponse.json(
      { error: "method, enabled (boolean), and instructions (string) are required." },
      { status: 400 }
    );
  }

  try {
    await setManualPaymentMethod(method as ManualMethodKey, { enabled, instructions });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save payment method." },
      { status: 400 }
    );
  }
}
