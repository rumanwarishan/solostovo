"use client";

import Link from "next/link";
import type { Category } from "@/data/categories";
import { PlaceholderImage } from "./PlaceholderImage";

const categoryTones: Record<string, string> = {
  "fire-pits": "from-[#3a4a3f] to-[#1a241e]",
  "pizza-ovens": "from-[#4a3a2a] to-[#241a10]",
  "camp-stoves": "from-[#4a4a3a] to-[#232319]",
  "patio-heaters": "from-[#3a3f4a] to-[#1c1f26]",
  accessories: "from-[#565650] to-[#2b2b27]",
};
const fallbackTone = "from-[#4a4a45] to-[#232320]";

// Not-yet-built destinations (no account system, store locator, or gift
// cards in this scaffold) — shown for visual/structural parity with the
// reference design, but intentionally inert rather than a fake link.
const secondaryLinks: { label: string; href?: string; icon: React.ReactNode }[] = [
  {
    label: "Account",
    icon: <path d="M9 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM3 15c1.2-3 3.6-4.5 6-4.5s4.8 1.5 6 4.5" strokeLinecap="round" />,
  },
  {
    label: "Track Order",
    href: "/help/track-order",
    icon: (
      <>
        <path d="M9 2.5c-3 0-5 2.2-5 5 0 3.5 5 8.5 5 8.5s5-5 5-8.5c0-2.8-2-5-5-5Z" strokeLinejoin="round" />
        <circle cx="9" cy="7.5" r="1.6" />
      </>
    ),
  },
  {
    label: "Find In Store",
    icon: <path d="M3 7.5 9 3l6 4.5V15a1 1 0 0 1-1 1h-3v-5H7v5H4a1 1 0 0 1-1-1V7.5Z" strokeLinejoin="round" />,
  },
  {
    label: "Help",
    href: "/help",
    icon: (
      <>
        <circle cx="9" cy="9" r="6.5" />
        <path d="M7 7a2 2 0 1 1 3 1.7c-.6.4-1 .8-1 1.6" strokeLinecap="round" />
        <circle cx="9" cy="12.6" r="0.15" fill="currentColor" />
      </>
    ),
  },
  {
    label: "Gift Cards",
    icon: (
      <>
        <rect x="2.5" y="6" width="13" height="9" rx="1" />
        <path d="M2.5 9h13M9 6v9M6.5 6a1.5 1.5 0 1 1 2.5 1.7A1.5 1.5 0 1 1 11.5 6c.6.7 0 1.7-2.5 1.7S5.9 6.7 6.5 6Z" />
      </>
    ),
  },
];

export function MobileMenu({
  open,
  onClose,
  categories,
  siteTitle,
  logoUrl,
}: {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  siteTitle: string;
  logoUrl?: string;
}) {
  return (
    <div
      className={`fixed inset-0 z-[60] bg-brand-surface transition-transform duration-300 md:hidden ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="relative flex h-16 flex-shrink-0 items-center justify-center border-b border-brand-line">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteTitle} className="h-8 w-auto" />
          ) : (
            <span className="font-display text-lg font-bold">{siteTitle}</span>
          )}
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-line"
          >
            ×
          </button>
        </div>

        <nav className="flex flex-col divide-y divide-brand-line px-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 py-3"
            >
              {c.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.imageUrl} alt="" className="h-11 w-11 rounded-sm object-cover" />
              ) : (
                <PlaceholderImage
                  tone={categoryTones[c.slug] ?? fallbackTone}
                  label=""
                  className="h-11 w-11 rounded-sm"
                />
              )}
              <span className="flex-1 text-sm font-semibold">{c.name}</span>
              <span className="text-brand-ink/30">→</span>
            </Link>
          ))}
        </nav>

        <nav className="mt-2 flex flex-col px-4 pb-8">
          {secondaryLinks.map((link) => {
            const content = (
              <span className="flex items-center gap-3 py-2.5 text-sm text-brand-ink/80">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4">
                  {link.icon}
                </svg>
                {link.label}
              </span>
            );
            return link.href ? (
              <Link key={link.label} href={link.href} onClick={onClose}>
                {content}
              </Link>
            ) : (
              <span key={link.label} className="cursor-default opacity-60" title="Coming soon">
                {content}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
