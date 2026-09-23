import { query, isDbConfigured } from "@/lib/db";

export type NewsletterSubscriber = { email: string; source: string; createdAt: string };

/** Re-subscribing (e.g. from a different popup) just refreshes the source/timestamp. */
export async function subscribeToNewsletter(email: string, source: string): Promise<void> {
  if (!isDbConfigured()) {
    throw new Error("Newsletter signup requires a database (see README).");
  }
  await query(
    `INSERT INTO newsletter_subscribers (email, source) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE source = VALUES(source), created_at = CURRENT_TIMESTAMP`,
    [email, source]
  );
}

type Row = { email: string; source: string; created_at: string };

export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  if (!isDbConfigured()) return [];
  const rows = await query<Row[]>(
    "SELECT email, source, created_at FROM newsletter_subscribers ORDER BY created_at DESC"
  );
  return rows.map((r) => ({ email: r.email, source: r.source, createdAt: new Date(r.created_at).toISOString() }));
}
