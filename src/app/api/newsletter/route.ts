import { NextRequest, NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/data/newsletter";
import { isDbConfigured } from "@/lib/db";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Newsletter signup isn't set up yet — connect a database (see README)." },
      { status: 501 }
    );
  }
  const body = await req.json().catch(() => null);
  const email = (body?.email ?? "").trim().toLowerCase();
  const source = typeof body?.source === "string" && body.source ? body.source.slice(0, 64) : "footer";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await subscribeToNewsletter(email, source);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to subscribe." },
      { status: 400 }
    );
  }
}
