"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/data/categories";
import { ImageUploadField } from "./ImageUploadField";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const isEdit = Boolean(category);
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-primary";
  const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = isEdit ? `/api/admin/categories/${category!.slug}` : "/api/admin/categories";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, description, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category.");
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!category) return;
    if (!confirm(`Delete ${category.name}? Products in this category must be moved or removed first.`))
      return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${category.slug}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category.");
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      {error && (
        <div className="mb-4 rounded-sm border border-brand-danger/30 bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className={labelClass}>Name</label>
        <input
          required
          className={inputClass}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!isEdit) setSlug(slugify(e.target.value));
          }}
        />
      </div>
      <div className="mb-4">
        <label className={labelClass}>Slug (URL — used in /shop/&lt;slug&gt;)</label>
        <input
          required
          disabled={isEdit}
          className={`${inputClass} disabled:opacity-60`}
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
        />
      </div>
      <div className="mb-4">
        <label className={labelClass}>Description</label>
        <textarea
          rows={3}
          className={inputClass}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <ImageUploadField
          label="Tile photo (optional)"
          value={imageUrl}
          onChange={setImageUrl}
          hint="Shown on the homepage category tile and menu. Falls back to a placeholder if left blank."
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-brand-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-dark disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create category"}
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
