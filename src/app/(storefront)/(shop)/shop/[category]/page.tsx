import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategory } from "@/data/categories";
import { productsByFamily } from "@/data/products";
import { ShopGrid } from "@/components/storefront/ShopGrid";

// Categories and their products can change from the admin at any time.
export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const items = await productsByFamily(category.slug);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10">
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
