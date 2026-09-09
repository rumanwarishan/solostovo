import Link from "next/link";
import { getCategories } from "@/data/categories";
import { productsByFamily } from "@/data/products";
import { isDbConfigured } from "@/lib/db";
import { CategoriesTable } from "@/components/admin/CategoriesTable";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  const counts = await Promise.all(categories.map((c) => productsByFamily(c.slug)));
  const dbConfigured = isDbConfigured();
  const rows = categories.map((category, i) => ({ category, productCount: counts[i].length }));

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl font-bold">Categories</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-brand-ink/50">{categories.length} total</span>
          <Link
            href="/admin/categories/new"
            className="rounded-sm bg-brand-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-primary-dark"
          >
            + Add category
          </Link>
        </div>
      </div>

      {!dbConfigured && (
        <p className="mt-3 rounded-sm border border-dashed border-brand-line bg-brand-surface p-3 text-xs text-brand-ink/60">
          Not connected to a database — showing the built-in starter categories. Adding, editing, or
          reordering requires a database (see README).
        </p>
      )}

      <div className="mt-6">
        <CategoriesTable initialRows={rows} />
      </div>
    </div>
  );
}
