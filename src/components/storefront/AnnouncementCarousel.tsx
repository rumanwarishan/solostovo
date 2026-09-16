"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AnnouncementMessage } from "@/data/content";

const AUTOPLAY_MS = 5000;

export function AnnouncementCarousel({ messages }: { messages: AnnouncementMessage[] }) {
  const [index, setIndex] = useState(0);
  const multi = messages.length > 1;

  useEffect(() => {
    if (!multi) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % messages.length), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [multi, messages.length]);

  if (messages.length === 0) return null;
  const current = messages[index];

  const utilityLinkClass = "cursor-default whitespace-nowrap opacity-70";

  return (
    <div className="bg-brand-ink text-xs text-brand-paper">
      <div className="container-page flex h-9 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {multi && (
            <button
              aria-label="Previous message"
              onClick={() => setIndex((i) => (i - 1 + messages.length) % messages.length)}
              className="flex-shrink-0 text-brand-paper/60 hover:text-brand-paper"
            >
              ‹
            </button>
          )}
          {current.href ? (
            <Link href={current.href} className="truncate underline decoration-brand-paper/40 underline-offset-2 hover:text-brand-paper">
              {current.text}
            </Link>
          ) : (
            <span className="truncate">{current.text}</span>
          )}
          {multi && (
            <button
              aria-label="Next message"
              onClick={() => setIndex((i) => (i + 1) % messages.length)}
              className="flex-shrink-0 text-brand-paper/60 hover:text-brand-paper"
            >
              ›
            </button>
          )}
        </div>

        {/* Decorative for now — no gift-card, corporate-gifting, store-locator,
            or localization features exist behind these yet. */}
        <div className="hidden flex-shrink-0 items-center gap-5 sm:flex">
          <span className={utilityLinkClass} title="Coming soon">
            Gift Cards
          </span>
          <span className={utilityLinkClass} title="Coming soon">
            Corporate Gifting
          </span>
          <span className={utilityLinkClass} title="Coming soon">
            Find In Store
          </span>
          <span className={`flex items-center gap-1.5 ${utilityLinkClass}`} title="Coming soon">
            <span aria-hidden="true">🇺🇸</span>
            US/EN
          </span>
        </div>
      </div>
    </div>
  );
}
