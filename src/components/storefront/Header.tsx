"use client";

import Link from "next/link";
import { useState } from "react";
import { brand } from "@/config/brand";
import { familyNav, needNav } from "@/data/nav";
import { useCart } from "@/context/CartContext";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-line bg-brand-surface/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-brand-line md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="sr-only">Menu</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          {brand.shortName}
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex" aria-label="Primary">
          {needNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-brand-ink/80 transition-colors hover:text-brand-primary"
            >
              {link.label}
            </Link>
          ))}
          <span className="h-4 w-px bg-brand-line" aria-hidden="true" />
          {familyNav.map((group) => (
            <div key={group.href} className="group relative">
              <Link
                href={group.href}
                className="text-sm font-medium text-brand-ink transition-colors hover:text-brand-primary"
              >
                {group.label}
              </Link>
              <div className="invisible absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="rounded-sm border border-brand-line bg-brand-surface p-2 shadow-lg">
                  {group.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block rounded-sm px-3 py-2 text-sm text-brand-ink/80 hover:bg-brand-primary-soft hover:text-brand-ink"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="hidden h-9 w-9 items-center justify-center rounded-sm text-brand-ink/70 hover:text-brand-primary sm:inline-flex"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12.2 12.2 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="hidden h-9 w-9 items-center justify-center rounded-sm text-brand-ink/70 hover:text-brand-primary sm:inline-flex"
            aria-label="Account"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 15c1.2-3 3.6-4.5 6-4.5s4.8 1.5 6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="relative inline-flex h-9 items-center gap-1.5 rounded-sm border border-brand-line px-3 text-sm hover:border-brand-primary"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            onClick={openCart}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M4 5.5h10l-1 8.5H5l-1-8.5Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path d="M6.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span className="tabular">{itemCount}</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-brand-line px-4 pb-4 md:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1 pt-2">
            {needNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-sm px-2 py-2 text-sm text-brand-ink/80"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-brand-line" />
            {familyNav.map((group) => (
              <Link
                key={group.href}
                href={group.href}
                className="rounded-sm px-2 py-2 text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {group.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
