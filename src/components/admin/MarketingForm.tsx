"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { MarketingContent } from "@/data/content";

const inputClass =
  "w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-primary";
const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50";

function ConnectionBadge({ connected }: { connected: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        connected ? "bg-brand-primary-soft text-brand-primary-dark" : "bg-brand-line/60 text-brand-ink/50"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-brand-primary" : "bg-brand-ink/30"}`} />
      {connected ? "Connected" : "Not connected"}
    </span>
  );
}

export function MarketingForm({ initial }: { initial: MarketingContent }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      {error && (
        <div className="mb-4 rounded-sm border border-brand-danger/30 bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 rounded-sm border border-brand-primary/30 bg-brand-primary-soft px-3 py-2 text-sm text-brand-primary-dark">
          Saved. It&apos;s live on your site immediately — no redeploy needed.
        </div>
      )}

      <section className="mb-8 rounded-sm border border-brand-line bg-brand-surface p-5">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">Google Tag Manager</h2>
          <ConnectionBadge connected={!!form.googleTagManagerId} />
        </div>
        <p className="mb-3 text-xs text-brand-ink/60">
          Paste your container ID and every tag you set up in Tag Manager — Google Ads conversion
          tracking, Google Analytics, remarketing pixels — starts firing on your site. Find it in
          Tag Manager under Admin → Container Settings; it looks like{" "}
          <code className="rounded-sm bg-brand-paper px-1 py-0.5">GTM-XXXXXXX</code>.
        </p>
        <label className={labelClass}>Container ID</label>
        <input
          className={inputClass}
          placeholder="GTM-XXXXXXX"
          spellCheck={false}
          value={form.googleTagManagerId}
          onChange={(e) => setForm((f) => ({ ...f, googleTagManagerId: e.target.value.trim() }))}
        />
      </section>

      <section className="mb-8 rounded-sm border border-brand-line bg-brand-surface p-5">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">Meta (Facebook) Pixel</h2>
          <ConnectionBadge connected={!!form.metaPixelId} />
        </div>
        <p className="mb-3 text-xs text-brand-ink/60">
          Paste your Pixel ID and your Facebook/Instagram ad campaigns start receiving page-view
          and purchase events from your site. Find it in Meta Events Manager → Data Sources —
          it&apos;s a numeric ID.
        </p>
        <label className={labelClass}>Pixel ID</label>
        <input
          className={inputClass}
          placeholder="123456789012345"
          spellCheck={false}
          value={form.metaPixelId}
          onChange={(e) => setForm((f) => ({ ...f, metaPixelId: e.target.value.trim() }))}
        />
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-sm bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-dark disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save & connect"}
      </button>
    </div>
  );
}
