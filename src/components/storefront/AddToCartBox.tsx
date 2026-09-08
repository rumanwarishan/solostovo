"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { StarRating } from "./StarRating";

export function AddToCartBox({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const monthly = (product.price / 12).toFixed(0);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{product.name}</h1>
      <div className="mt-2">
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      </div>
      <p className="mt-4 text-brand-ink/80">{product.shortDescription}</p>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="tabular text-2xl font-bold">${product.price}</span>
        {product.compareAtPrice && (
          <span className="tabular text-brand-ink/40 line-through">${product.compareAtPrice}</span>
        )}
      </div>
      <p className="mt-1 text-xs text-brand-ink/50">
        or as low as <span className="tabular">${monthly}/mo</span> with financing — select at checkout
      </p>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex items-center rounded-sm border border-brand-line">
          <button
            className="h-11 w-11 text-lg"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="tabular w-8 text-center">{quantity}</span>
          <button
            className="h-11 w-11 text-lg"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>
        <button
          onClick={() => addItem(product, quantity)}
          className="flex-1 rounded-sm bg-brand-primary py-3 text-sm font-medium text-white hover:bg-brand-primary-dark"
        >
          Add to cart
        </button>
      </div>

      <p className="mt-3 text-xs text-brand-ink/50">
        {product.stock > 20 ? "In stock, ready to ship" : `Only ${product.stock} left`}
      </p>
    </div>
  );
}
