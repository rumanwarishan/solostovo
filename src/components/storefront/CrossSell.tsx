import { getProductById } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function CrossSell({ ids }: { ids: string[] }) {
  const items = ids.map(getProductById).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (items.length === 0) return null;

  return (
    <section className="mt-16 border-t border-brand-line pt-10">
      <h2 className="font-display text-xl font-bold">Complete your setup</h2>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
