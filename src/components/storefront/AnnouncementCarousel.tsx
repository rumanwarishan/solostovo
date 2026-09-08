"use client";

import { useEffect, useState } from "react";

const AUTOPLAY_MS = 5000;

export function AnnouncementCarousel({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);
  const multi = messages.length > 1;

  useEffect(() => {
    if (!multi) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % messages.length), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [multi, messages.length]);

  if (messages.length === 0) return null;

  return (
    <div className="flex h-9 items-center justify-center gap-3 bg-brand-ink px-3 text-xs text-brand-paper">
      {multi && (
        <button
          aria-label="Previous message"
          onClick={() => setIndex((i) => (i - 1 + messages.length) % messages.length)}
          className="text-brand-paper/60 hover:text-brand-paper"
        >
          ‹
        </button>
      )}
      <span className="text-center underline decoration-brand-paper/40 underline-offset-2">
        {messages[index]}
      </span>
      {multi && (
        <button
          aria-label="Next message"
          onClick={() => setIndex((i) => (i + 1) % messages.length)}
          className="text-brand-paper/60 hover:text-brand-paper"
        >
          ›
        </button>
      )}
    </div>
  );
}
