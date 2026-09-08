"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/data/categories";
import type { Product } from "@/data/products";

export type ProductFormPayload = {
  slug: string;
  name: string;
  family: string;
  fit: "" | "tabletop" | "backyard";
  fuel: "" | "wood" | "propane";
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  badges: ("bestseller" | "new")[];
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
  imageTone: string;
  crossSell: string[];
  compareGroup: string;
  stock: number;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toFormState(product?: Product) {
  return {
    slug: product?.slug ?? "",
    name: product?.name ?? "",
    family: product?.family ?? "",
    fit: (product?.fit ?? "") as ProductFormPayload["fit"],
    fuel: (product?.fuel ?? "") as ProductFormPayload["fuel"],
    price: product?.price ?? 0,
    compareAtPrice: product?.compareAtPrice ?? 0,
    rating: product?.rating ?? 5,
    reviewCount: product?.reviewCount ?? 0,
    badges: product?.badges ?? [],
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    specs: product?.specs ?? {},
    imageTone: product?.imageTone ?? "from-[#3a4a3f] to-[#1f2b23]",
    crossSell: product?.crossSell ?? [],
    compareGroup: product?.compareGroup ?? "",
    stock: product?.stock ?? 0,
  };
}

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [form, setForm] = useState(toFormState(product));
  const [specRows, setSpecRows] = useState<[string, string][]>(
    Object.entries(product?.specs ?? {}).length ? Object.entries(product?.specs ?? {}) : [["", ""]]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleBadge(badge: "bestseller" | "new") {
    setForm((f) => ({
      ...f,
      badges: f.badges.includes(badge) ? f.badges.filter((b) => b !== badge) : [...f.badges, badge],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const specs = Object.fromEntries(specRows.filter(([k]) => k.trim() !== ""));
    const payload: ProductFormPayload = {
      ...form,
      specs,
      crossSell: form.crossSell,
      compareAtPrice: form.compareAtPrice || undefined,
    };

    try {
      const url = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product.");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm(`Delete ${product.name}? This can't be undone.`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product.");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product.");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-primary";
  const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {error && (
        <div className="mb-4 rounded-sm border border-brand-danger/30 bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Name</label>
          <input
            required
            className={inputClass}
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              update("name", name);
              if (!isEdit) update("slug", slugify(name));
            }}
          />
        </div>
        <div>
          <label className={labelClass}>Slug (URL)</label>
          <input
            required
            className={inputClass}
            value={form.slug}
            onChange={(e) => update("slug", slugify(e.target.value))}
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            required
            className={inputClass}
            value={form.family}
            onChange={(e) => update("family", e.target.value)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fit</label>
            <select className={inputClass} value={form.fit} onChange={(e) => update("fit", e.target.value as ProductFormPayload["fit"])}>
              <option value="">—</option>
              <option value="tabletop">Tabletop</option>
              <option value="backyard">Backyard</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Fuel</label>
            <select className={inputClass} value={form.fuel} onChange={(e) => update("fuel", e.target.value as ProductFormPayload["fuel"])}>
              <option value="">—</option>
              <option value="wood">Wood</option>
              <option value="propane">Propane</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Price (USD)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
            value={form.price}
            onChange={(e) => update("price", Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Compare-at price (optional)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
            value={form.compareAtPrice}
            onChange={(e) => update("compareAtPrice", Number(e.target.value))}
          />
        </div>

        <div>
          <label className={labelClass}>Stock</label>
          <input
            required
            type="number"
            min="0"
            className={inputClass}
            value={form.stock}
            onChange={(e) => update("stock", Number(e.target.value))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              className={inputClass}
              value={form.rating}
              onChange={(e) => update("rating", Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelClass}>Review count</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.reviewCount}
              onChange={(e) => update("reviewCount", Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass}>Badges</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.badges.includes("bestseller")} onChange={() => toggleBadge("bestseller")} />
            Bestseller
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.badges.includes("new")} onChange={() => toggleBadge("new")} />
            New
          </label>
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass}>Short description (shown on cards)</label>
        <textarea
          required
          rows={2}
          className={inputClass}
          value={form.shortDescription}
          onChange={(e) => update("shortDescription", e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className={labelClass}>Full description (shown on product page)</label>
        <textarea
          required
          rows={4}
          className={inputClass}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className={labelClass}>Specs</label>
        <div className="flex flex-col gap-2">
          {specRows.map(([k, v], i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Diameter"
                className={inputClass}
                value={k}
                onChange={(e) => {
                  const next = [...specRows];
                  next[i] = [e.target.value, v];
                  setSpecRows(next);
                }}
              />
              <input
                placeholder='18.5"'
                className={inputClass}
                value={v}
                onChange={(e) => {
                  const next = [...specRows];
                  next[i] = [k, e.target.value];
                  setSpecRows(next);
                }}
              />
              <button
                type="button"
                onClick={() => setSpecRows(specRows.filter((_, idx) => idx !== i))}
                className="px-2 text-brand-ink/40 hover:text-brand-danger"
                aria-label="Remove spec row"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecRows([...specRows, ["", ""]])}
            className="self-start text-xs font-medium text-brand-primary hover:underline"
          >
            + Add spec
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Image tone (placeholder gradient classes)</label>
          <input className={inputClass} value={form.imageTone} onChange={(e) => update("imageTone", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Compare group (optional)</label>
          <input
            className={inputClass}
            placeholder="e.g. backyard-wood"
            value={form.compareGroup}
            onChange={(e) => update("compareGroup", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass}>Cross-sell product IDs (comma-separated)</label>
        <input
          className={inputClass}
          value={form.crossSell.join(", ")}
          onChange={(e) =>
            update(
              "crossSell",
              e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
            )
          }
        />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-brand-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-dark disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="rounded-sm border border-brand-danger/40 px-5 py-2.5 text-sm font-medium text-brand-danger hover:bg-brand-danger/10 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
