import crypto from "crypto";

/**
 * Encrypts payment-provider secrets before they're stored in the database.
 * The key is derived from the DB credentials themselves (already a secret
 * every deployment must have) rather than a new env var — so a raw SQL
 * dump alone doesn't leak these values, but the running app (which already
 * knows DB_PASSWORD) can still decrypt them at request time. This is not a
 * substitute for keeping admin access limited to people you trust.
 */
function deriveKey(): Buffer {
  const material = `${process.env.DB_PASSWORD ?? ""}:${process.env.DB_NAME ?? ""}`;
  return crypto.scryptSync(material, "solostovo-payment-secrets", 32);
}

export function encryptSecret(plain: string): string {
  if (!plain) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", deriveKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptSecret(stored: string): string {
  if (!stored) return "";
  try {
    const raw = Buffer.from(stored, "base64");
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const encrypted = raw.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", deriveKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  } catch {
    return "";
  }
}

/** For display only — never send a real secret back to the browser. */
export function maskSecret(value: string): string {
  if (!value) return "";
  if (value.length <= 4) return "••••";
  return `••••${value.slice(-4)}`;
}
