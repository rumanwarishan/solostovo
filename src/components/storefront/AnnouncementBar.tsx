import { brand } from "@/config/brand";

export function AnnouncementBar() {
  return (
    <div className="bg-brand-ink py-2 text-center text-xs tracking-wide text-brand-paper">
      Free shipping on orders over ${brand.freeShippingThreshold} · {brand.trialLine}
    </div>
  );
}
