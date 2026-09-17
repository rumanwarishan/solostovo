"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sectionLabels, type SectionKey } from "@/config/sections";
import type { SectionVisibility } from "@/data/content";

const TOGGLEABLE = new Set<string>(["hero", "valueProps", "categories", "bestSellers", "trust", "reviews", "community"]);

function isToggleable(key: SectionKey): key is Exclude<SectionKey, "customHtml"> {
  return TOGGLEABLE.has(key);
}

export function SectionOrderEditor({
  initialOrder,
  initialSections,
}: {
  initialOrder: SectionKey[];
  initialSections: SectionVisibility;
}) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [sections, setSections] = useState(initialSections);
  const [dragKey, setDragKey] = useState<SectionKey | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function persistOrder(next: SectionKey[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings/section-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save order.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save order.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(key: keyof SectionVisibility) {
    const next = !sections[key];
    setSections((s) => ({ ...s, [key]: next }));
    setError(null);
    try {
      const res = await fetch("/api/admin/settings/section-visibility", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, visible: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update section.");
      router.refresh();
    } catch (e) {
      setSections((s) => ({ ...s, [key]: !next }));
      setError(e instanceof Error ? e.message : "Failed to update section.");
    }
  }

  function handleDrop(targetKey: SectionKey) {
    if (!dragKey || dragKey === targetKey) return;
    const from = order.indexOf(dragKey);
    const to = order.indexOf(targetKey);
    if (from === -1 || to === -1) return;

    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrder(next);
    setDragKey(null);
    persistOrder(next);
  }

  return (
    <section className="mb-10">
      <h2 className="font-display text-lg font-bold">Homepage section order</h2>
      <p className="mt-1 text-xs text-brand-ink/60">
        Drag a section by the handle to move it up or down the page. Click the × to remove a
        section from the homepage — it stays listed here, dimmed, so you can bring it back anytime.
      </p>
      {error && (
        <div className="mt-3 rounded-sm border border-brand-danger/30 bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {error}
        </div>
      )}
      <div className="mt-3 flex flex-col gap-2">
        {order.map((key) => {
          const toggleable = isToggleable(key);
          const visible = toggleable ? sections[key] : true;
          return (
            <div
              key={key}
              draggable
              onDragStart={() => setDragKey(key)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(key)}
              onDragEnd={() => setDragKey(null)}
              className={`flex items-center gap-3 rounded-sm border border-brand-line bg-brand-surface px-3 py-2.5 text-sm ${
                dragKey === key ? "opacity-40" : !visible ? "opacity-50" : ""
              } ${saving ? "pointer-events-none" : ""}`}
            >
              <span className="cursor-grab text-brand-ink/30 active:cursor-grabbing" aria-label="Drag to reorder">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                  <circle cx="4" cy="3" r="1.3" />
                  <circle cx="10" cy="3" r="1.3" />
                  <circle cx="4" cy="7" r="1.3" />
                  <circle cx="10" cy="7" r="1.3" />
                  <circle cx="4" cy="11" r="1.3" />
                  <circle cx="10" cy="11" r="1.3" />
                </svg>
              </span>
              <span className="flex-1">
                {sectionLabels[key]}
                {!visible && <span className="ml-2 text-xs text-brand-ink/40">(hidden)</span>}
              </span>
              {toggleable && (
                <button
                  type="button"
                  onClick={() => toggleVisible(key)}
                  title={visible ? "Remove from homepage" : "Add back to homepage"}
                  className="rounded-sm px-2 py-1 text-xs font-medium text-brand-ink/40 hover:bg-brand-danger/10 hover:text-brand-danger"
                >
                  {visible ? "×" : "+ Restore"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
