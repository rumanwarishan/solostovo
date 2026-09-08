import type { Product } from "@/data/products";
import { PlaceholderImage } from "./PlaceholderImage";

/**
 * Real product photo when set, falling back to the placeholder gradient
 * otherwise. Requires a `group` class on an ancestor (ProductCard has one)
 * so the hover-to-second-image crossfade works via group-hover.
 */
export function ProductImage({ product, className }: { product: Product; className?: string }) {
  if (!product.imageUrl) {
    return <PlaceholderImage tone={product.imageTone} label={product.name} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden bg-brand-paper ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.imageUrl}
        alt={product.name}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          product.imageUrl2 ? "group-hover:opacity-0" : ""
        }`}
      />
      {product.imageUrl2 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.imageUrl2}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
    </div>
  );
}
