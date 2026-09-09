import Stripe from "stripe";
import { getPaymentCredentials } from "@/data/payment-settings";

/** Admin-entered key (Admin → Payments) takes priority; falls back to the env var. */
export async function getStripeSecretKey(): Promise<string> {
  const creds = await getPaymentCredentials();
  return creds.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "";
}

export async function getStripeWebhookSecret(): Promise<string> {
  const creds = await getPaymentCredentials();
  return creds.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET || "";
}

export async function isStripeConfigured(): Promise<boolean> {
  return Boolean(await getStripeSecretKey());
}

export async function isStripeWebhookConfigured(): Promise<boolean> {
  return Boolean(await getStripeWebhookSecret());
}

/**
 * Builds a Stripe client from whichever key is currently configured. Not
 * cached — the key can change at runtime (an admin saving a new one)
 * without a redeploy, and constructing the SDK client does no network I/O.
 */
export async function getStripe(): Promise<Stripe> {
  const key = await getStripeSecretKey();
  if (!key) {
    throw new Error(
      "Stripe isn't connected yet. Add your secret key from Admin → Payments, or set STRIPE_SECRET_KEY."
    );
  }
  return new Stripe(key);
}
