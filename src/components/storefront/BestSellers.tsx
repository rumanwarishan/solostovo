import { bestSellers } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function BestSellers() {
  const items = bestSellers();
  if (items.length === 0) return null;

  return (
    <section className="border-t border-brand-line bg-brand-surface py-14">
      <div className="container-page">
        <h2 className="font-display text-2xl font-bold">Customer favorites</h2>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
