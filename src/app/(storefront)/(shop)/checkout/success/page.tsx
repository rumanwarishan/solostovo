import Link from "next/link";
import { getManualPaymentMethods, type ManualMethodKey } from "@/data/payment-settings";
import { ClearCartOnMount } from "@/components/storefront/ClearCartOnMount";

export const dynamic = "force-dynamic";

const METHOD_LABELS: Record<ManualMethodKey, string> = {
  bank_transfer: "Bank transfer",
  cash_on_delivery: "Cash on delivery",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; method?: string }>;
}) {
  const { order, method } = await searchParams;
  const isManualMethod = method === "bank_transfer" || method === "cash_on_delivery";
  const manual = isManualMethod ? await getManualPaymentMethods() : null;
  const methodConfig = isManualMethod ? manual?.[method as ManualMethodKey] : null;

  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <ClearCartOnMount />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold">Order confirmed</h1>
      {order && <p className="mt-1 text-sm text-brand-ink/50">Order #{order}</p>}

      {isManualMethod ? (
        <>
          <p className="mt-2 max-w-md text-brand-ink/70">
            Thanks for your order — it&apos;s placed as {METHOD_LABELS[method as ManualMethodKey]}.
            We&apos;ll email you once it&apos;s confirmed.
          </p>
          {methodConfig?.instructions && (
            <div className="mt-6 max-w-md rounded-sm border border-dashed border-brand-line bg-brand-surface p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/50">
                {METHOD_LABELS[method as ManualMethodKey]} instructions
              </p>
              <p className="mt-2 whitespace-pre-line text-sm text-brand-ink/80">{methodConfig.instructions}</p>
            </div>
          )}
        </>
      ) : (
        <p className="mt-2 max-w-md text-brand-ink/70">
          Thanks for your order. A confirmation email is on its way, and we&apos;ll send
          tracking as soon as it ships.
        </p>
      )}

      <Link
        href="/"
        className="mt-8 rounded-sm bg-brand-ink px-6 py-3 text-sm font-medium text-brand-paper hover:bg-brand-primary"
      >
        Continue shopping
      </Link>
    </div>
  );
}
