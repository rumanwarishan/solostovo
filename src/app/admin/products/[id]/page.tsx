import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/data/products";
import { getCategories } from "@/data/categories";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-xs text-brand-ink/50 hover:text-brand-primary">
        ← Back to products
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{product.name}</h1>
        <Link href={`/product/${product.slug}`} className="text-sm text-brand-ink/60 hover:text-brand-primary">
          View live page →
        </Link>
      </div>
      <div className="mt-6">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}
