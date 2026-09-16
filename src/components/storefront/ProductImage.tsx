import type { Product } from "@/data/products";
import { PlaceholderImage } from "./PlaceholderImage";

/**
 * Real product photo when set, falling back to the placeholder gradient
 * otherwise. Requires a `group` class on an ancestor (ProductCard has one)
 * so the hover-to-second-image slide-in works via group-hover: the second
 * photo sits off-screen to the right and slides in over the first on hover.
 */
export function ProductImage({ product, className }: { product: Product; className?: string }) {
  if (!product.imageUrl) {
    return <PlaceholderImage tone={product.imageTone} label={product.name} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden bg-brand-paper ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.imageUrl} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
      {product.imageUrl2 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.imageUrl2}
          alt=""
          className="absolute inset-0 h-full w-full translate-x-full object-cover transition-transform duration-200 ease-out group-hover:translate-x-0"
        />
      )}
    </div>
  );
}
