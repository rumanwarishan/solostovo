"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/data/categories";

type Row = { category: Category; productCount: number };

export function CategoriesTable({ initialRows }: { initialRows: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [dragSlug, setDragSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function persistOrder(next: Row[]) {
    try {
      const res = await fetch("/api/admin/categories/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: next.map((r) => r.category.slug) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save order.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save order.");
    }
  }

  function handleDrop(targetSlug: string) {
    if (!dragSlug || dragSlug === targetSlug) return;
    const from = rows.findIndex((r) => r.category.slug === dragSlug);
    const to = rows.findIndex((r) => r.category.slug === targetSlug);
    if (from === -1 || to === -1) return;

    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setRows(next);
    setDragSlug(null);
    persistOrder(next);
  }

  return (
    <div>
      {error && (
        <div className="mb-3 rounded-sm border border-brand-danger/30 bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {error}
        </div>
      )}
      <p className="mb-2 text-xs text-brand-ink/50">Drag rows by the handle to change the display order.</p>
      <div className="overflow-x-auto rounded-sm border border-brand-line bg-brand-surface">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-brand-line text-left text-xs uppercase tracking-wide text-brand-ink/50">
              <th className="w-8 px-2 py-3" />
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Products</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ category: c, productCount }) => (
              <tr
                key={c.slug}
                draggable
                onDragStart={() => setDragSlug(c.slug)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(c.slug)}
                onDragEnd={() => setDragSlug(null)}
                className={`border-b border-brand-line last:border-0 hover:bg-brand-paper/60 ${
                  dragSlug === c.slug ? "opacity-40" : ""
                }`}
              >
                <td className="cursor-grab px-2 py-3 text-center text-brand-ink/30 active:cursor-grabbing" aria-label="Drag to reorder">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                    <circle cx="4" cy="3" r="1.3" />
                    <circle cx="10" cy="3" r="1.3" />
                    <circle cx="4" cy="7" r="1.3" />
                    <circle cx="10" cy="7" r="1.3" />
                    <circle cx="4" cy="11" r="1.3" />
                    <circle cx="10" cy="11" r="1.3" />
                  </svg>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/categories/${c.slug}`} className="font-medium hover:text-brand-primary">
                    {c.name}
                  </Link>
                </td>
                <td className="max-w-md truncate px-4 py-3 text-brand-ink/60">{c.description}</td>
                <td className="tabular px-4 py-3 text-right text-brand-ink/70">{productCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
