import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategory, categories } from "@/data/categories";
import { productsByFamily } from "@/data/products";
import { ShopGrid } from "@/components/storefront/ShopGrid";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = productsByFamily(category.slug);

  return (
    <div className="container-page py-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold">{category.name}</h1>
        <p className="mt-2 text-brand-ink/70">{category.description}</p>
      </div>
      <Suspense fallback={null}>
        <ShopGrid products={items} showFitFilter={category.slug === "fire-pits"} />
      </Suspense>
    </div>
  );
}
