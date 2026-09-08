import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold">Order confirmed</h1>
      <p className="mt-2 max-w-md text-brand-ink/70">
        Thanks for your order. A confirmation email is on its way, and we&apos;ll send
        tracking as soon as it ships.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-sm bg-brand-ink px-6 py-3 text-sm font-medium text-brand-paper hover:bg-brand-primary"
      >
        Continue shopping
      </Link>
    </div>
  );
}
