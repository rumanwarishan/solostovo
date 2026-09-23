"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { brand } from "@/config/brand";
import { PlaceholderImage } from "./PlaceholderImage";
import type { ManualPaymentMethod } from "@/data/payment-settings";

type Method = "card" | "bank_transfer" | "cash_on_delivery";

export function CheckoutForm({
  stripeConnected,
  paypalConnected,
  bankTransfer,
  cashOnDelivery,
}: {
  stripeConnected: boolean;
  paypalConnected: boolean;
  bankTransfer: ManualPaymentMethod;
  cashOnDelivery: ManualPaymentMethod;
}) {
  const router = useRouter();
  const { lines, subtotal, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const anyMethodConnected = stripeConnected || bankTransfer.enabled || cashOnDelivery.enabled;
  const [method, setMethod] = useState<Method>(() =>
    stripeConnected ? "card" : bankTransfer.enabled ? "bank_transfer" : "cash_on_delivery"
  );

  async function handlePayWithCard() {
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

  async function handlePlaceManualOrder(manualMethod: "bank_transfer" | "cash_on_delivery") {
    setError(null);
    if (!customerName.trim() || !customerEmail.trim()) {
      setError("Name and email are required.");
      return;
    }
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, method: manualMethod, customerName, customerEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data.orderId) {
        throw new Error(data.error || "Something went wrong placing your order.");
      }
      clearCart();
      router.push(`/checkout/success?order=${data.orderId}&method=${manualMethod}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setCheckingOut(false);
    }
  }

  function handleContinue() {
    if (method === "card") return handlePayWithCard();
    return handlePlaceManualOrder(method);
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <p className="text-brand-ink/70">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-6 rounded-sm bg-brand-ink px-6 py-3 text-sm font-medium text-brand-paper hover:bg-brand-primary"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <h2 className="font-display text-lg font-bold">Payment method</h2>
        {!anyMethodConnected && (
          <p className="mt-2 rounded-sm border border-dashed border-brand-line bg-brand-surface p-3 text-sm text-brand-ink/60">
            No payment method is connected yet. The store owner needs to add one from Admin →
            Payments before checkout can go through.
          </p>
        )}
        {error && (
          <p className="mt-2 rounded-sm border border-brand-danger/30 bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-3">
          <label
            className={`flex items-center gap-3 rounded-sm border px-4 py-3 ${
              !stripeConnected
                ? "border-brand-line opacity-50"
                : method === "card"
                  ? "border-brand-primary bg-brand-primary-soft/40"
                  : "border-brand-line"
            }`}
          >
            <input
              type="radio"
              name="payment-method"
              checked={method === "card"}
              disabled={!stripeConnected}
              onChange={() => setMethod("card")}
            />
            <span className="flex-1 text-sm font-medium">Credit or debit card</span>
            <span className="text-xs text-brand-ink/50">{stripeConnected ? "via Stripe" : "Not connected"}</span>
          </label>

          <label className="flex items-center gap-3 rounded-sm border border-brand-line px-4 py-3 opacity-50">
            <input type="radio" name="payment-method" disabled readOnly />
            <span className="flex-1 text-sm font-medium">PayPal</span>
            <span className="text-xs text-brand-ink/50">{paypalConnected ? "Coming soon" : "Not connected"}</span>
          </label>

          {bankTransfer.enabled && (
            <label
              className={`flex items-center gap-3 rounded-sm border px-4 py-3 ${
                method === "bank_transfer" ? "border-brand-primary bg-brand-primary-soft/40" : "border-brand-line"
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                checked={method === "bank_transfer"}
                onChange={() => setMethod("bank_transfer")}
              />
              <span className="flex-1 text-sm font-medium">Bank transfer</span>
            </label>
          )}

          {cashOnDelivery.enabled && (
            <label
              className={`flex items-center gap-3 rounded-sm border px-4 py-3 ${
                method === "cash_on_delivery" ? "border-brand-primary bg-brand-primary-soft/40" : "border-brand-line"
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                checked={method === "cash_on_delivery"}
                onChange={() => setMethod("cash_on_delivery")}
              />
              <span className="flex-1 text-sm font-medium">Cash on delivery</span>
            </label>
          )}
        </div>

        {method === "bank_transfer" && bankTransfer.instructions && (
          <p className="mt-3 whitespace-pre-line rounded-sm border border-dashed border-brand-line bg-brand-surface p-3 text-sm text-brand-ink/70">
            {bankTransfer.instructions}
          </p>
        )}
        {method === "cash_on_delivery" && cashOnDelivery.instructions && (
          <p className="mt-3 whitespace-pre-line rounded-sm border border-dashed border-brand-line bg-brand-surface p-3 text-sm text-brand-ink/70">
            {cashOnDelivery.instructions}
          </p>
        )}

        {(method === "bank_transfer" || method === "cash_on_delivery") && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50">
                Full name
              </label>
              <input
                className="w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-primary"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-primary"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={!anyMethodConnected || checkingOut}
          className="mt-6 w-full rounded-sm bg-brand-primary py-3 text-sm font-medium text-white hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
        >
          {checkingOut
            ? method === "card"
              ? "Redirecting to Stripe…"
              : "Placing order…"
            : method === "card"
              ? "Continue to payment"
              : "Place order"}
        </button>
        <p className="mt-3 text-xs text-brand-ink/50">
          {method === "card"
            ? "You'll enter your card details on Stripe's secure checkout page, then return here to confirm your order."
            : "Your order is placed immediately — no card details needed."}
        </p>
      </div>

      <div className="h-fit rounded-sm border border-brand-line bg-brand-surface p-5">
        <h2 className="font-display text-lg font-bold">Order summary</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {lines.map((line) => (
            <li key={line.productId} className="flex gap-3">
              {line.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={line.imageUrl}
                  alt={line.name}
                  className="h-14 w-14 flex-shrink-0 rounded-sm object-cover"
                />
              ) : (
                <PlaceholderImage tone={line.imageTone} label={line.name} className="h-14 w-14 flex-shrink-0" />
              )}
              <div className="flex flex-1 items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{line.name}</p>
                  <p className="text-xs text-brand-ink/50">Qty {line.quantity}</p>
                </div>
                <span className="tabular text-sm">${(line.price * line.quantity).toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-brand-line pt-4 text-sm">
          <span className="text-brand-ink/70">Subtotal</span>
          <span className="tabular font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <p className="mt-1 text-xs text-brand-ink/50">
          {subtotal >= brand.freeShippingThreshold
            ? "Free shipping applied"
            : `Shipping and taxes calculated at checkout`}
        </p>
      </div>
    </div>
  );
}
