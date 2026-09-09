import { query } from "@/lib/db";
import { generateId, generateSessionToken, hashPassword, verifyPassword, SESSION_TTL_MS } from "@/lib/auth";

export type AdminUser = { id: string; username: string; createdAt: string };

type AdminUserRow = { id: string; username: string; created_at: string };
type CredentialRow = { id: string; username: string; password_hash: string };
type SessionRow = { id: string; username: string; expires_at: string };

function rowToUser(row: AdminUserRow): AdminUser {
  return { id: row.id, username: row.username, createdAt: row.created_at };
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const rows = await query<AdminUserRow[]>(
    "SELECT id, username, created_at FROM admin_users ORDER BY created_at ASC"
  );
  return rows.map(rowToUser);
}

export async function countAdminUsers(): Promise<number> {
  const rows = await query<{ count: number }[]>("SELECT COUNT(*) as count FROM admin_users");
  return Number(rows[0]?.count ?? 0);
}

export async function createAdminUser(username: string, password: string): Promise<AdminUser> {
  const existing = await query<{ id: string }[]>("SELECT id FROM admin_users WHERE username = ? LIMIT 1", [
    username,
  ]);
  if (existing[0]) throw new Error("That username is already taken.");

  const id = generateId();
  await query("INSERT INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)", [
    id,
    username,
    hashPassword(password),
  ]);
  return { id, username, createdAt: new Date().toISOString() };
}

export async function deleteAdminUser(id: string): Promise<void> {
  const total = await countAdminUsers();
  if (total <= 1) throw new Error("You can't remove the last admin account.");
  await query("DELETE FROM admin_users WHERE id = ?", [id]);
}

export async function verifyAdminCredentials(username: string, password: string): Promise<AdminUser | null> {
  const rows = await query<CredentialRow[]>(
    "SELECT id, username, password_hash FROM admin_users WHERE username = ? LIMIT 1",
    [username]
  );
  const row = rows[0];
  if (!row || !verifyPassword(password, row.password_hash)) return null;
  return { id: row.id, username: row.username, createdAt: "" };
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await query("INSERT INTO admin_sessions (token, user_id, expires_at) VALUES (?, ?, ?)", [
    token,
    userId,
    expiresAt,
  ]);
  return { token, expiresAt };
}

export async function getSessionUser(token: string): Promise<{ id: string; username: string } | null> {
  const rows = await query<SessionRow[]>(
    `SELECT u.id as id, u.username as username, s.expires_at as expires_at
     FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
     WHERE s.token = ? LIMIT 1`,
    [token]
  );
  const row = rows[0];
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await query("DELETE FROM admin_sessions WHERE token = ?", [token]);
    return null;
  }
  return { id: row.id, username: row.username };
}

export async function deleteSession(token: string): Promise<void> {
  await query("DELETE FROM admin_sessions WHERE token = ?", [token]);
}
