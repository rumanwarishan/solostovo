"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sectionLabels, type SectionKey } from "@/config/sections";

export function SectionOrderEditor({ initialOrder }: { initialOrder: SectionKey[] }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [dragKey, setDragKey] = useState<SectionKey | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function persist(next: SectionKey[]) {
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
    persist(next);
  }

  return (
    <section className="mb-10">
      <h2 className="font-display text-lg font-bold">Homepage section order</h2>
      <p className="mt-1 text-xs text-brand-ink/60">
        Drag a section by the handle to move it up or down the page. Hidden sections (turned off in
        Settings) still show here so you can position them ahead of time.
      </p>
      {error && (
        <div className="mt-3 rounded-sm border border-brand-danger/30 bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {error}
        </div>
      )}
      <div className="mt-3 flex flex-col gap-2">
        {order.map((key) => (
          <div
            key={key}
            draggable
            onDragStart={() => setDragKey(key)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(key)}
            onDragEnd={() => setDragKey(null)}
            className={`flex items-center gap-3 rounded-sm border border-brand-line bg-brand-surface px-3 py-2.5 text-sm ${
              dragKey === key ? "opacity-40" : ""
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
            {sectionLabels[key]}
          </div>
        ))}
      </div>
    </section>
  );
}
