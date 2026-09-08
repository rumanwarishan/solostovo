import Link from "next/link";
import { getProducts } from "@/data/products";
import { getCategories } from "@/data/categories";
import { PlaceholderImage } from "@/components/storefront/PlaceholderImage";
import { SeedCatalogButton } from "@/components/admin/SeedCatalogButton";
import { isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
  const dbConfigured = isDbConfigured();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-brand-ink/50">{products.length} total</span>
          <Link
            href="/admin/products/new"
            className="rounded-sm bg-brand-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-primary-dark"
          >
            + Add product
          </Link>
        </div>
      </div>

      {!dbConfigured && (
        <p className="mt-3 rounded-sm border border-dashed border-brand-line bg-brand-surface p-3 text-xs text-brand-ink/60">
          Not connected to a database — showing the built-in starter catalog. Adding or editing
          products requires a database (see README).
        </p>
      )}
      {dbConfigured && products.length === 0 && (
        <div className="mt-4">
          <SeedCatalogButton />
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-sm border border-brand-line bg-brand-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-brand-line text-left text-xs uppercase tracking-wide text-brand-ink/50">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-brand-line last:border-0 hover:bg-brand-paper/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 font-medium hover:text-brand-primary">
                    <PlaceholderImage tone={p.imageTone} label="" className="h-9 w-9 flex-shrink-0" />
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-brand-ink/70">{categoryName(p.family)}</td>
                <td className="tabular px-4 py-3 text-right font-medium">${p.price}</td>
                <td className="tabular px-4 py-3 text-right">
                  <span className={p.stock <= 50 ? "text-brand-danger" : "text-brand-ink/70"}>
                    {p.stock}
                  </span>
                </td>
                <td className="tabular px-4 py-3 text-right text-brand-ink/70">{p.rating.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
