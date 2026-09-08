import { NextRequest, NextResponse } from "next/server";
import { getMedia } from "@/data/media";

// Public — anyone viewing the storefront needs to load logos/product photos.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await getMedia(id).catch(() => undefined);
  if (!media) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(media.data), {
    headers: {
      "Content-Type": media.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
