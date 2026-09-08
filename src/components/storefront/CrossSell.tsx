import { getProductById } from "@/data/products";
import { ProductCard } from "./ProductCard";

export async function CrossSell({ ids }: { ids: string[] }) {
  const resolved = await Promise.all(ids.map(getProductById));
  const items = resolved.filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (items.length === 0) return null;

  return (
    <section className="mt-16 border-t border-brand-line pt-10">
      <h2 className="font-display text-xl font-bold">Complete your setup</h2>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
