"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-primary";
const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50";

export function PaypalConnectForm({
  connected,
  initialClientId,
  initialMode,
}: {
  connected: boolean;
  initialClientId: string;
  initialMode: "sandbox" | "live";
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState(initialClientId);
  const [clientSecret, setClientSecret] = useState("");
  const [mode, setMode] = useState<"sandbox" | "live">(initialMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/payments/paypal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, clientSecret, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "PayPal rejected these credentials.");
      setSuccess("Connected.");
      setClientSecret("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to connect.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    if (!window.confirm("Disconnect PayPal?")) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/payments/paypal", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to disconnect.");
      setClientId("");
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
          <label className={labelClass}>Client ID</label>
          <input
            className={inputClass}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <label className={labelClass}>Client secret</label>
          <input
            type="password"
            className={inputClass}
            placeholder={connected ? "Connected — leave blank to keep, or retype to change" : "Paste your client secret"}
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <label className={labelClass}>Mode</label>
          <select className={inputClass} value={mode} onChange={(e) => setMode(e.target.value as "sandbox" | "live")}>
            <option value="sandbox">Sandbox (testing)</option>
            <option value="live">Live</option>
          </select>
        </div>
      </div>
      <p className="mt-2 text-xs text-brand-ink/50">
        Create an app at the{" "}
        <a
          href="https://developer.paypal.com/dashboard/applications"
          target="_blank"
          rel="noreferrer"
          className="text-brand-primary hover:underline"
        >
          PayPal developer dashboard
        </a>{" "}
        to get a Client ID and secret. Connecting verifies them against PayPal before saving. Note:
        this saves your credentials — a &quot;Pay with PayPal&quot; button at checkout is a separate
        follow-up.
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
