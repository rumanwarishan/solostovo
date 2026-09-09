"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-primary";
const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50";

export function StripeConnectForm({
  connected,
  maskedKey,
  webhookConnected,
}: {
  connected: boolean;
  maskedKey: string;
  webhookConnected: boolean;
}) {
  const router = useRouter();
  const [secretKey, setSecretKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/payments/stripe", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey, webhookSecret }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Stripe rejected these credentials.");
      setSuccess("Connected.");
      setSecretKey("");
      setWebhookSecret("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to connect.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    if (!window.confirm("Disconnect Stripe? Checkout will stop working until you reconnect.")) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/payments/stripe", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to disconnect.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to disconnect.");
    }
  }

  return (
    <form onSubmit={handleConnect} className="mt-4 border-t border-brand-line pt-4">
      {error && (
        <div className="mb-3 rounded-sm border border-brand-danger/30 bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-3 rounded-sm border border-brand-primary/30 bg-brand-primary-soft px-3 py-2 text-sm text-brand-primary-dark">
          {success}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Secret key</label>
          <input
            type="password"
            className={inputClass}
            placeholder={connected ? `Connected (${maskedKey}) — leave blank to keep` : "sk_live_… or sk_test_…"}
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <label className={labelClass}>Webhook signing secret</label>
          <input
            type="password"
            className={inputClass}
            placeholder={webhookConnected ? "Already set — leave blank to keep" : "whsec_…"}
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-brand-ink/50">
        Get these from the{" "}
        <a
          href="https://dashboard.stripe.com/apikeys"
          target="_blank"
          rel="noreferrer"
          className="text-brand-primary hover:underline"
        >
          Stripe dashboard
        </a>{" "}
        — the secret key from API keys, the webhook secret after adding an endpoint at{" "}
        <code className="rounded bg-brand-line/60 px-1">/api/stripe/webhook</code>. Connecting verifies
        the key against Stripe before saving.
      </p>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-dark disabled:opacity-50"
        >
          {saving ? "Connecting…" : connected ? "Update & reconnect" : "Click to connect"}
        </button>
        {connected && (
          <button
            type="button"
            onClick={handleDisconnect}
            className="text-sm text-brand-ink/50 hover:text-brand-danger"
          >
            Disconnect
          </button>
        )}
      </div>
    </form>
  );
}
