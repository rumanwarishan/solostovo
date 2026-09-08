import { getValueProps } from "@/data/content";

/**
 * Pinned under the header on every page so anxiety-reducing info survives
 * scroll instead of living only in one hero-adjacent strip.
 */
export async function ValuePropBar() {
  const { items } = await getValueProps();
  return (
    <div className="border-b border-brand-line bg-brand-primary-soft/60">
      <div className="container-page flex flex-wrap justify-center gap-x-8 gap-y-1 py-2 text-[13px] text-brand-ink/80">
        {items.map((label) => (
          <span key={label} className="whitespace-nowrap">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
