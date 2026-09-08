"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/config/brand";
import { familyNav, needNav } from "@/data/nav";
import { useCart } from "@/context/CartContext";
import type { Category } from "@/data/categories";
import { MobileMenu } from "./MobileMenu";

const SCROLL_THRESHOLD = 48;

export function Header({
  siteTitle,
  logoUrl,
  categories = [],
}: {
  siteTitle?: string;
  logoUrl?: string;
  categories?: Category[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Only the homepage has a hero for the header to float over — everywhere
  // else it's always in its normal solid state.
  const [scrolled, setScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Lock body scroll while the full-screen mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const transparent = isHome && !scrolled;
  const title = siteTitle || brand.shortName;

  const chrome = transparent
    ? "bg-transparent border-transparent"
    : "bg-brand-surface/95 backdrop-blur border-b border-brand-line";
  const textStrong = transparent ? "text-white" : "text-brand-ink";
  const textMuted = transparent ? "text-white/85" : "text-brand-ink/80";
  const iconColor = transparent
    ? "text-white/90 hover:text-white"
    : "text-brand-ink/70 hover:text-brand-primary";
  const menuButtonBorder = transparent ? "border-white/40" : "border-brand-line";
  const cartButtonBorder = transparent
    ? "border-white/40 text-white hover:border-white"
    : "border-brand-line hover:border-brand-primary";

  return (
    <>
      <header className={`sticky top-0 z-40 transition-colors duration-300 ${chrome}`}>
        <div className="container-page grid h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          {/* Left: mobile hamburger + search; desktop gets the need-based nav */}
          <div className="flex min-w-0 items-center gap-1 md:gap-6">
            <button
              className={`inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm border md:hidden ${menuButtonBorder} ${textStrong}`}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button className={`inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm md:hidden ${iconColor}`} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12.2 12.2 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Split across both sides of the centered logo so neither side
                overflows and pushes the logo off-center. */}
            <nav className="hidden min-w-0 items-center gap-5 md:flex" aria-label="Primary">
              {needNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap text-sm transition-colors hover:text-brand-primary ${textMuted}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: logo, always dead-center regardless of side content */}
          <Link href="/" className={`flex items-center justify-self-center gap-2 font-display text-xl font-bold tracking-tight ${textStrong}`}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={title} className="h-8 w-auto" />
            ) : (
              title
            )}
          </Link>

          {/* Right: family nav (desktop) + search, account, cart */}
          <div className="flex min-w-0 items-center justify-end gap-1 md:gap-5">
            <nav className="hidden min-w-0 items-center gap-5 lg:flex" aria-label="Shop by category">
              {familyNav.map((group) => (
                <div key={group.href} className="group relative">
                  <Link
                    href={group.href}
                    className={`whitespace-nowrap text-sm transition-colors hover:text-brand-primary ${textMuted}`}
                  >
                    {group.label}
                  </Link>
                  <div className="invisible absolute right-0 top-full z-10 pt-3 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[180px] rounded-sm border border-brand-line bg-brand-surface py-2 shadow-lg">
                      {group.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block whitespace-nowrap px-4 py-1.5 text-sm text-brand-ink/80 hover:bg-brand-bg hover:text-brand-primary"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
            <button className={`hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm md:inline-flex ${iconColor}`} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12.2 12.2 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button className={`hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm sm:inline-flex ${iconColor}`} aria-label="Account">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 15c1.2-3 3.6-4.5 6-4.5s4.8 1.5 6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button
              className={`relative inline-flex h-9 flex-shrink-0 items-center gap-1.5 rounded-sm border px-3 text-sm ${cartButtonBorder}`}
              aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
              onClick={openCart}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4 5.5h10l-1 8.5H5l-1-8.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M6.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <span className="tabular">{itemCount}</span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
        siteTitle={title}
        logoUrl={logoUrl}
      />
    </>
  );
}
