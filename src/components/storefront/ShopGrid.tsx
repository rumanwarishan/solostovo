"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { CompareTable } from "./CompareTable";

type Fit = "all" | "tabletop" | "backyard";
type Sort = "featured" | "price-asc" | "price-desc";

export function ShopGrid({
  products,
  showFitFilter,
}: {
  products: Product[];
  showFitFilter: boolean;
}) {
  const searchParams = useSearchParams();
  const initialFit = (searchParams.get("fit") as Fit) ?? "all";

  const [fit, setFit] = useState<Fit>(initialFit === "tabletop" || initialFit === "backyard" ? initialFit : "all");
  const [sort, setSort] = useState<Sort>("featured");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = products;
    if (fit !== "all") list = list.filter((p) => p.fit === fit);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, fit, sort]);

  const compareProducts = products.filter((p) => compareIds.includes(p.id));

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-line pb-4">
        <div className="flex flex-wrap gap-2">
          {showFitFilter &&
            (["all", "tabletop", "backyard"] as Fit[]).map((f) => (
              <button
                key={f}
                onClick={() => setFit(f)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${
                  fit === f
                    ? "border-brand-primary bg-brand-primary text-white"
                    : "border-brand-line text-brand-ink/70 hover:border-brand-primary"
                }`}
              >
                {f}
              </button>
            ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-brand-ink/60">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-sm border border-brand-line bg-brand-surface px-2 py-1.5 text-xs"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>
      </div>

      {products.length > 1 && (
        <p className="mt-3 text-xs text-brand-ink/50">
          Select up to 3 to compare specs side by side ({compareIds.length}/3 selected)
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {filtered.map((p) => (
          <div key={p.id}>
            <ProductCard product={p} />
            {products.length > 1 && (
              <label className="mt-2 flex items-center gap-2 text-xs text-brand-ink/60">
                <input
                  type="checkbox"
                  checked={compareIds.includes(p.id)}
                  onChange={() => toggleCompare(p.id)}
                  className="accent-[color:var(--brand-primary)]"
                />
                Compare
              </label>
            )}
          </div>
        ))}
      </div>

      {compareProducts.length >= 2 && (
        <div className="mt-12">
          <h2 className="font-display text-xl font-bold">Compare</h2>
          <CompareTable products={compareProducts} />
        </div>
      )}
    </div>
  );
}
