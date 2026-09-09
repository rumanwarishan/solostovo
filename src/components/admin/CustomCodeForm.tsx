"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CustomCodeContent, CustomHtmlSection } from "@/data/content";

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
        from sources you trust — it has the same access to your page as any other script would.
        Note it&apos;s injected by the browser after the page loads, so it works for analytics and
        widgets but isn&apos;t guaranteed to be seen by crawlers that don&apos;t run JavaScript
        (most search-engine verification tags are fine; check the specific tool&apos;s requirements
        if in doubt).
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
          Header — injected into the page&apos;s &lt;head&gt;
        </label>
        <p className="mb-1.5 text-xs text-brand-ink/50">
          For analytics/tracking scripts, site-verification meta tags, custom CSS overrides.
        </p>
        <textarea
          rows={5}
          spellCheck={false}
          placeholder={'<meta name="google-site-verification" content="…">\n<script>…</script>'}
          className={textareaClass}
          value={form.header}
          onChange={(e) => setForm((f) => ({ ...f, header: e.target.value }))}
        />
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50">
          Content sections — visible blocks at the top of the page content
        </label>
        <p className="mb-1.5 text-xs text-brand-ink/50">
          For visible banners or notices. Each one appears on every page, right below the header, in
          the order listed here.
        </p>
        <div className="flex flex-col gap-4">
          {form.sections.map((section, i) => (
            <div key={section.id} className="rounded-sm border border-brand-line bg-brand-surface p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <input
                  placeholder={`Section ${i + 1} name (for your reference only)`}
                  className="w-full rounded-sm border border-brand-line bg-white px-2 py-1 text-sm outline-none focus:border-brand-primary"
                  value={section.label}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sections: f.sections.map((s, idx) => (idx === i ? { ...s, label: e.target.value } : s)),
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, sections: f.sections.filter((_, idx) => idx !== i) }))}
                  className="whitespace-nowrap px-2 text-xs text-brand-ink/40 hover:text-brand-danger"
                >
                  Remove
                </button>
              </div>
              <textarea
                rows={5}
                spellCheck={false}
                className={textareaClass}
                value={section.html}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sections: f.sections.map((s, idx) => (idx === i ? { ...s, html: e.target.value } : s)),
                  }))
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setForm((f) => ({
                ...f,
                sections: [...f.sections, { id: crypto.randomUUID(), label: "", html: "" } as CustomHtmlSection],
              }))
            }
            className="self-start text-xs font-medium text-brand-primary hover:underline"
          >
            + Add HTML section
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50">
          Footer — injected just before the closing &lt;/body&gt;
        </label>
        <p className="mb-1.5 text-xs text-brand-ink/50">
          For chat widgets and tracking pixels that recommend loading last.
        </p>
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
