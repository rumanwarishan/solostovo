import Link from "next/link";
import { getCategories } from "@/data/categories";
import { productsByFamily } from "@/data/products";
import { isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  const counts = await Promise.all(categories.map((c) => productsByFamily(c.slug)));
  const dbConfigured = isDbConfigured();

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
          Not connected to a database — showing the built-in starter categories. Adding or editing
          requires a database (see README).
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-sm border border-brand-line bg-brand-surface">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-brand-line text-left text-xs uppercase tracking-wide text-brand-ink/50">
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Products</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c.slug} className="border-b border-brand-line last:border-0 hover:bg-brand-paper/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/categories/${c.slug}`} className="font-medium hover:text-brand-primary">
                    {c.name}
                  </Link>
                </td>
                <td className="max-w-md truncate px-4 py-3 text-brand-ink/60">{c.description}</td>
                <td className="tabular px-4 py-3 text-right text-brand-ink/70">{counts[i].length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
