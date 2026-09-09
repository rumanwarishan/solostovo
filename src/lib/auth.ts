import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, "hex");
  const suppliedBuffer = scryptSync(password, salt, hashBuffer.length);
  return hashBuffer.length === suppliedBuffer.length && timingSafeEqual(hashBuffer, suppliedBuffer);
}

export function generateId(): string {
  return randomUUID();
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
