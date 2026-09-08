import { NextRequest, NextResponse } from "next/server";
import { saveMedia, MAX_UPLOAD_BYTES, ALLOWED_MIME_TYPES } from "@/data/media";
import { isDbConfigured } from "@/lib/db";

// Protected by src/proxy.ts (matcher covers /api/admin/:path*).
export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Connect a database first — see README for setup steps." },
      { status: 501 }
    );
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type "${file.type}". Use PNG, JPEG, WebP, GIF, or SVG.` },
      { status: 400 }
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `File is too large (max ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB).` },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const id = await saveMedia(file.type, buffer);
    return NextResponse.json({ url: `/api/media/${id}` });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 400 }
    );
  }
}
