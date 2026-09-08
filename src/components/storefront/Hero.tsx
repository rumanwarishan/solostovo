import Link from "next/link";
import { brand } from "@/config/brand";

export function Hero() {
  return (
    <section className="border-b border-brand-line bg-gradient-to-br from-brand-primary-soft/70 to-brand-paper">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-20">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary-dark">
            New — Infinity Flame propane collection
          </span>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight font-display sm:text-5xl">
            {brand.tagline}
          </h1>
          <p className="mt-4 max-w-md text-brand-ink/70">
            Smokeless fire pits, wood-fired ovens, and gear built to hold up to
            real use — backed by {brand.warrantyLine.toLowerCase()} and a{" "}
            {brand.trialLine.toLowerCase()}.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/shop/fire-pits"
              className="rounded-sm bg-brand-ink px-6 py-3 text-sm font-medium text-brand-paper hover:bg-brand-primary"
            >
              Shop Fire Pits
            </Link>
            <Link
              href="/shop/fire-pits?fit=tabletop"
              className="rounded-sm border border-brand-ink px-6 py-3 text-sm font-medium hover:border-brand-primary hover:text-brand-primary"
            >
              Find my size
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-gradient-to-br from-[#3a4a3f] to-[#141c17]">
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,190,120,0.25),transparent_55%)]" />
          <span className="absolute bottom-4 left-4 font-display text-sm uppercase tracking-wide text-white/70">
            Lifestyle photo placeholder — drop in your product photography
          </span>
        </div>
      </div>
    </section>
  );
}
