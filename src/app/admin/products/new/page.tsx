import Link from "next/link";
import { getCategories } from "@/data/categories";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <Link href="/admin/products" className="text-xs text-brand-ink/50 hover:text-brand-primary">
        ← Back to products
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Add product</h1>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
