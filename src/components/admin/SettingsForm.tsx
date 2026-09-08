"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettings } from "@/data/content";

const inputClass =
  "w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-primary";
const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateSocial(key: keyof SiteSettings["social"], value: string) {
    setForm((f) => ({ ...f, social: { ...f.social, [key]: value } }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings.");
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save settings.");
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
          Saved.
        </div>
      )}

      <section className="mb-10">
        <h2 className="font-display text-lg font-bold">Site identity</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Site title</label>
            <input className={inputClass} value={form.siteTitle} onChange={(e) => update("siteTitle", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input className={inputClass} value={form.tagline} onChange={(e) => update("tagline", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Logo image URL (optional)</label>
            <input
              className={inputClass}
              placeholder="https://…"
              value={form.logoUrl}
              onChange={(e) => update("logoUrl", e.target.value)}
            />
            <p className="mt-1 text-xs text-brand-ink/50">Leave blank to show the site title as text instead.</p>
          </div>
          <div>
            <label className={labelClass}>Favicon image URL (optional)</label>
            <input
              className={inputClass}
              placeholder="https://…/favicon.png"
              value={form.faviconUrl}
              onChange={(e) => update("faviconUrl", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-lg font-bold">Footer</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <label className={labelClass}>Footer description (under the logo)</label>
            <textarea
              rows={2}
              className={inputClass}
              value={form.footerDescription}
              onChange={(e) => update("footerDescription", e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(["instagram", "youtube", "facebook", "tiktok"] as const).map((key) => (
              <div key={key}>
                <label className={labelClass}>{key}</label>
                <input
                  className={inputClass}
                  placeholder={`https://${key}.com/…`}
                  value={form.social[key]}
                  onChange={(e) => updateSocial(key, e.target.value)}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-brand-ink/50">Leave a social link blank to hide that icon in the footer.</p>
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-sm bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-dark disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
    </div>
  );
}
