"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettings } from "@/data/content";
import { ImageUploadField } from "./ImageUploadField";

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

  function updateSection(key: keyof SiteSettings["sections"], value: boolean) {
    setForm((f) => ({ ...f, sections: { ...f.sections, [key]: value } }));
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
          <ImageUploadField
            label="Logo"
            value={form.logoUrl}
            onChange={(url) => update("logoUrl", url)}
            hint="Leave blank to show the site title as text instead."
          />
          <ImageUploadField
            label="Favicon"
            value={form.faviconUrl}
            onChange={(url) => update("faviconUrl", url)}
            hint="Shown as the browser tab icon."
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-lg font-bold">Layout</h2>
        <div className="mt-4 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.showHeader}
              onChange={(e) => update("showHeader", e.target.checked)}
            />
            Show header (top nav, announcement bar, value props)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.showFooter}
              onChange={(e) => update("showFooter", e.target.checked)}
            />
            Show footer
          </label>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-lg font-bold">Homepage sections</h2>
        <p className="mt-1 text-xs text-brand-ink/60">
          Show or hide individual sections without deleting their content.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {(
            [
              ["announcement", "Announcement bar"],
              ["valueProps", "Value props strip"],
              ["hero", "Hero slider"],
              ["categories", "Shop by category"],
              ["bestSellers", "Customer favorites"],
              ["trust", "As featured in"],
              ["reviews", "Reviews teaser"],
              ["community", "From the community"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.sections[key]}
                onChange={(e) => updateSection(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
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
