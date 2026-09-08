"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CustomCodeContent } from "@/data/content";

const textareaClass =
  "w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 font-mono text-xs outline-none focus:border-brand-primary";

export function CustomCodeForm({ initial }: { initial: CustomCodeContent }) {
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
      const res = await fetch("/api/admin/custom-code", {
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
      <div className="mb-6 rounded-sm border border-brand-accent/40 bg-brand-accent-soft px-3 py-2 text-sm text-brand-ink">
        ⚠ This HTML/JavaScript runs directly on your live site for every visitor. Only paste code
        from sources you trust (e.g. an analytics or chat-widget snippet) — it has the same access
        to your page as any other script would.
      </div>

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

      <div className="mb-6">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50">
          Header — renders just below the top nav on every page
        </label>
        <textarea
          rows={5}
          spellCheck={false}
          className={textareaClass}
          value={form.header}
          onChange={(e) => setForm((f) => ({ ...f, header: e.target.value }))}
        />
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50">
          Content — renders at the top of the main content area on every page
        </label>
        <textarea
          rows={5}
          spellCheck={false}
          className={textareaClass}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        />
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50">
          Footer — renders above the copyright line on every page
        </label>
        <textarea
          rows={5}
          spellCheck={false}
          className={textareaClass}
          value={form.footer}
          onChange={(e) => setForm((f) => ({ ...f, footer: e.target.value }))}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-sm bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-dark disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save custom code"}
      </button>
    </div>
  );
}
