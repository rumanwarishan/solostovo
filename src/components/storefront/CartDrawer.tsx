"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/data/products";
import { brand } from "@/config/brand";
import { PlaceholderImage } from "./PlaceholderImage";

export function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, setQuantity, subtotal, itemCount } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = Math.max(brand.freeShippingThreshold - subtotal, 0);
  const progress = Math.min((subtotal / brand.freeShippingThreshold) * 100, 100);

  async function handleCheckout() {
    setError(null);
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout is not configured yet.");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setCheckingOut(false);
    }
  }

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close cart"
          className="fixed inset-0 z-50 bg-black/40"
          onClick={closeCart}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-brand-surface shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-brand-line px-5 py-4">
          <h2 className="font-display text-lg font-bold">Your Cart ({itemCount})</h2>
          <button aria-label="Close cart" onClick={closeCart} className="text-xl leading-none">
            &times;
          </button>
        </div>

        <div className="border-b border-brand-line px-5 py-3">
          {remaining > 0 ? (
            <p className="text-xs text-brand-ink/70">
              Add <span className="tabular font-medium">${remaining.toFixed(2)}</span> more for free shipping
            </p>
          ) : (
            <p className="text-xs font-medium text-brand-primary">You&apos;ve unlocked free shipping</p>
          )}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-line">
            <div
              className="h-full rounded-full bg-brand-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="text-sm text-brand-ink/60">Your cart is empty.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map((line) => {
                const product = getProductById(line.productId);
                if (!product) return null;
                return (
                  <li key={line.productId} className="flex gap-3">
                    <PlaceholderImage
                      tone={product.imageTone}
                      label={product.name}
                      className="h-16 w-16 flex-shrink-0"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/product/${product.slug}`} onClick={closeCart} className="text-sm font-medium hover:text-brand-primary">
                          {product.name}
                        </Link>
                        <span className="tabular text-sm">${(product.price * line.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-sm border border-brand-line">
                          <button
                            className="h-7 w-7 text-sm"
                            aria-label={`Decrease ${product.name} quantity`}
                            onClick={() => setQuantity(product.id, line.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="tabular w-6 text-center text-sm">{line.quantity}</span>
                          <button
                            className="h-7 w-7 text-sm"
                            aria-label={`Increase ${product.name} quantity`}
                            onClick={() => setQuantity(product.id, line.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="text-xs text-brand-ink/50 underline hover:text-brand-danger"
                          onClick={() => removeItem(product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-brand-line px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-brand-ink/70">Subtotal</span>
            <span className="tabular font-medium">${subtotal.toFixed(2)}</span>
          </div>
          {error && <p className="mb-2 text-xs text-brand-danger">{error}</p>}
          <button
            className="w-full rounded-sm bg-brand-primary py-3 text-sm font-medium text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-50"
            disabled={lines.length === 0 || checkingOut}
            onClick={handleCheckout}
          >
            {checkingOut ? "Redirecting to checkout…" : "Checkout"}
          </button>
          <p className="mt-2 text-center text-[11px] text-brand-ink/50">
            Secure checkout powered by Stripe
          </p>
        </div>
      </aside>
    </>
  );
}
