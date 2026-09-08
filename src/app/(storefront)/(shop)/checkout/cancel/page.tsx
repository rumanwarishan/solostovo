import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Checkout canceled</h1>
      <p className="mt-2 max-w-md text-brand-ink/70">
        No charge was made. Your cart is still saved if you&apos;d like to finish later.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-sm border border-brand-ink px-6 py-3 text-sm font-medium hover:border-brand-primary hover:text-brand-primary"
      >
        Back to shop
      </Link>
    </div>
  );
}
