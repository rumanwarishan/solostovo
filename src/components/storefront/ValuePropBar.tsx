import { brand } from "@/config/brand";

const props = [
  { label: `Free shipping over $${brand.freeShippingThreshold}` },
  { label: brand.warrantyLine },
  { label: brand.trialLine },
  { label: "Financing available at checkout" },
];

/**
 * Pinned under the header on every page so anxiety-reducing info survives
 * scroll instead of living only in one hero-adjacent strip.
 */
export function ValuePropBar() {
  return (
    <div className="border-b border-brand-line bg-brand-primary-soft/60">
      <div className="container-page flex flex-wrap justify-center gap-x-8 gap-y-1 py-2 text-[13px] text-brand-ink/80">
        {props.map((p) => (
          <span key={p.label} className="whitespace-nowrap">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
