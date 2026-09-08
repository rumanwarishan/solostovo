"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SeedCatalogButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function seed() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to seed catalog.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to seed catalog.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6 flex items-center justify-between rounded-sm border border-dashed border-brand-line bg-brand-surface p-4">
      <div>
        <p className="text-sm font-medium">Your catalog is empty.</p>
        <p className="text-xs text-brand-ink/60">
          Seed it with the starter fire pit / pizza oven catalog to get going, or add your own products.
        </p>
        {error && <p className="mt-1 text-xs text-brand-danger">{error}</p>}
      </div>
      <button
        onClick={seed}
        disabled={loading}
        className="rounded-sm bg-brand-primary px-4 py-2 text-xs font-medium text-white hover:bg-brand-primary-dark disabled:opacity-50"
      >
        {loading ? "Seeding…" : "Seed starter catalog"}
      </button>
    </div>
  );
}
