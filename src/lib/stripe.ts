import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function isStripeWebhookConfigured(): boolean {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET);
}

/**
 * Lazily-constructed Stripe client. Throws only when a route actually tries
 * to use Stripe without a key configured, instead of at import/build time —
 * so the rest of the app builds and runs fine before you've added keys.
 */
export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (see .env.example) to enable checkout."
    );
  }

  stripeClient = new Stripe(key);
  return stripeClient;
}
