import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/data/products";
import { PlaceholderImage } from "@/components/storefront/PlaceholderImage";

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-xs text-brand-ink/50 hover:text-brand-primary">
        ← Back to products
      </Link>

      <div className="mt-2 grid gap-8 lg:grid-cols-3">
        <PlaceholderImage tone={product.imageTone} label={product.name} className="aspect-square w-full lg:col-span-1" />

        <div className="lg:col-span-2">
          <h1 className="font-display text-2xl font-bold">{product.name}</h1>
          <p className="mt-1 text-sm text-brand-ink/60">
            <Link href={`/product/${product.slug}`} className="hover:text-brand-primary">
              View live page →
            </Link>
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-sm border border-brand-line bg-brand-surface p-3">
              <dt className="text-xs uppercase text-brand-ink/50">Price</dt>
              <dd className="tabular mt-1 text-lg font-bold">${product.price}</dd>
            </div>
            <div className="rounded-sm border border-brand-line bg-brand-surface p-3">
              <dt className="text-xs uppercase text-brand-ink/50">Stock</dt>
              <dd className="tabular mt-1 text-lg font-bold">{product.stock}</dd>
            </div>
            <div className="rounded-sm border border-brand-line bg-brand-surface p-3">
              <dt className="text-xs uppercase text-brand-ink/50">Rating</dt>
              <dd className="tabular mt-1 text-lg font-bold">{product.rating.toFixed(1)}</dd>
            </div>
          </dl>

          <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-brand-ink/50">Specs</h2>
          <dl className="mt-2 divide-y divide-brand-line text-sm">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2">
                <dt className="text-brand-ink/60">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 rounded-sm border border-dashed border-brand-line p-3 text-xs text-brand-ink/50">
            This is a read-only view over the in-code catalog (src/data/products.ts). Connect a
            database to make editing here persist.
          </p>
        </div>
      </div>
    </div>
  );
}
