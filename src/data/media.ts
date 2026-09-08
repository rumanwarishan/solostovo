import crypto from "crypto";
import { query } from "@/lib/db";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

export async function saveMedia(mimeType: string, data: Buffer): Promise<string> {
  const id = crypto.randomUUID();
  await query("INSERT INTO media (id, mime_type, data) VALUES (?, ?, ?)", [id, mimeType, data]);
  return id;
}

type MediaRow = { mime_type: string; data: Buffer };

export async function getMedia(id: string): Promise<{ mimeType: string; data: Buffer } | undefined> {
  const rows = await query<MediaRow[]>("SELECT mime_type, data FROM media WHERE id = ? LIMIT 1", [id]);
  if (!rows[0]) return undefined;
  return { mimeType: rows[0].mime_type, data: rows[0].data };
}
