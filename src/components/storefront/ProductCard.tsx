"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { PlaceholderImage } from "./PlaceholderImage";
import { StarRating } from "./StarRating";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative block">
        <PlaceholderImage tone={product.imageTone} label={product.name} className="aspect-square w-full" />
        {product.badges?.includes("bestseller") && (
          <span className="absolute left-2 top-2 rounded-sm bg-brand-accent px-2 py-0.5 text-[11px] font-medium text-white">
            Bestseller
          </span>
        )}
        {product.badges?.includes("new") && (
          <span className="absolute left-2 top-2 rounded-sm bg-brand-primary px-2 py-0.5 text-[11px] font-medium text-white">
            New
          </span>
        )}
      </Link>
      <Link href={`/product/${product.slug}`} className="mt-3 text-sm font-medium group-hover:text-brand-primary">
        {product.name}
      </Link>
      <div className="mt-1">
        <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="tabular text-sm font-semibold">${product.price}</span>
        {product.compareAtPrice && (
          <span className="tabular text-xs text-brand-ink/40 line-through">
            ${product.compareAtPrice}
          </span>
        )}
      </div>
      <button
        onClick={() => addItem(product.id)}
        className="mt-3 rounded-sm border border-brand-line py-2 text-xs font-medium hover:border-brand-primary hover:text-brand-primary"
      >
        Add to cart
      </button>
    </div>
  );
}
