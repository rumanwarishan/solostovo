"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { PlaceholderImage } from "./PlaceholderImage";

export function PdpGallery({ product }: { product: Product }) {
  const images = [product.imageUrl, product.imageUrl2].filter((src): src is string => Boolean(src));
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="grid grid-cols-[64px_1fr] gap-3">
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <PlaceholderImage
              key={i}
              tone={product.imageTone}
              label={`${i + 1}`}
              className="aspect-square w-16"
            />
          ))}
        </div>
        <PlaceholderImage tone={product.imageTone} label={product.name} className="aspect-square w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[64px_1fr] gap-3">
      <div className="flex flex-col gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            aria-label={`View photo ${i + 1}`}
            className={`aspect-square w-16 overflow-hidden rounded-sm border ${
              active === i ? "border-brand-primary" : "border-brand-line"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="aspect-square w-full overflow-hidden bg-brand-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={product.name} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
