import { query, isDbConfigured } from "@/lib/db";
import { encryptSecret, decryptSecret } from "@/lib/secrets";

export type PaymentCredentials = {
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  paypalClientId: string;
  paypalClientSecret: string;
  paypalMode: "sandbox" | "live";
};

const empty: PaymentCredentials = {
  stripeSecretKey: "",
  stripeWebhookSecret: "",
  paypalClientId: "",
  paypalClientSecret: "",
  paypalMode: "sandbox",
};

type Row = {
  stripe_secret_key: string | null;
  stripe_webhook_secret: string | null;
  paypal_client_id: string | null;
  paypal_client_secret: string | null;
  paypal_mode: string | null;
};

/** Real, decrypted credentials — for server-side use (building API clients) only. */
export async function getPaymentCredentials(): Promise<PaymentCredentials> {
  if (!isDbConfigured()) return empty;
  const rows = await query<Row[]>("SELECT * FROM payment_credentials WHERE id = 1 LIMIT 1");
  const row = rows[0];
  if (!row) return empty;
  return {
    stripeSecretKey: decryptSecret(row.stripe_secret_key ?? ""),
    stripeWebhookSecret: decryptSecret(row.stripe_webhook_secret ?? ""),
    paypalClientId: row.paypal_client_id ?? "",
    paypalClientSecret: decryptSecret(row.paypal_client_secret ?? ""),
    paypalMode: row.paypal_mode === "live" ? "live" : "sandbox",
  };
}

export async function setPaymentCredentials(
  patch: Partial<PaymentCredentials>
): Promise<PaymentCredentials> {
  const merged = { ...(await getPaymentCredentials()), ...patch };
  await query(
    `INSERT INTO payment_credentials
       (id, stripe_secret_key, stripe_webhook_secret, paypal_client_id, paypal_client_secret, paypal_mode)
     VALUES (1, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       stripe_secret_key = VALUES(stripe_secret_key),
       stripe_webhook_secret = VALUES(stripe_webhook_secret),
       paypal_client_id = VALUES(paypal_client_id),
       paypal_client_secret = VALUES(paypal_client_secret),
       paypal_mode = VALUES(paypal_mode)`,
    [
      encryptSecret(merged.stripeSecretKey),
      encryptSecret(merged.stripeWebhookSecret),
      merged.paypalClientId,
      encryptSecret(merged.paypalClientSecret),
      merged.paypalMode,
    ]
  );
  return merged;
}

/** Masked, browser-safe view: real config lives server-side only. */
export type PaymentStatus = {
  stripeConnected: boolean;
  stripeSecretKeyMasked: string;
  stripeWebhookConnected: boolean;
  paypalConnected: boolean;
  paypalClientId: string;
  paypalMode: "sandbox" | "live";
};

export async function getPaymentStatus(): Promise<PaymentStatus> {
  const creds = await getPaymentCredentials();
  const stripeKey = creds.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "";
  const stripeWebhook = creds.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET || "";
  return {
    stripeConnected: Boolean(stripeKey),
    stripeSecretKeyMasked: stripeKey ? `••••${stripeKey.slice(-4)}` : "",
    stripeWebhookConnected: Boolean(stripeWebhook),
    paypalConnected: Boolean(creds.paypalClientId && creds.paypalClientSecret),
    paypalClientId: creds.paypalClientId,
    paypalMode: creds.paypalMode,
  };
}
