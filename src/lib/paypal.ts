const PAYPAL_API_BASE = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
} as const;

/**
 * "Connecting" PayPal here means confirming your Client ID/Secret pair
 * actually authenticates, via PayPal's own OAuth token endpoint — the same
 * client-credentials grant the real integration would use, not a fake check.
 */
export async function testPaypalCredentials(
  clientId: string,
  clientSecret: string,
  mode: "sandbox" | "live"
): Promise<{ ok: boolean; error?: string }> {
  if (!clientId || !clientSecret) {
    return { ok: false, error: "Client ID and secret are both required." };
  }
  try {
    const res = await fetch(`${PAYPAL_API_BASE[mode]}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}) as { error_description?: string });
      return {
        ok: false,
        error: data.error_description || `PayPal rejected these credentials (HTTP ${res.status}).`,
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't reach PayPal to verify the credentials. Try again." };
  }
}
