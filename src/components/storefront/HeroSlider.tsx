"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/data/content";

const AUTOPLAY_MS = 6500;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const multi = slides.length > 1;

  useEffect(() => {
    if (!multi) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [multi, slides.length]);

  const slide = slides[index] ?? slides[0];
  if (!slide) return null;

  return (
    <section className="relative overflow-hidden border-b border-brand-line">
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            {s.mediaType === "video" && s.mediaUrl ? (
              <video
                className="h-full w-full object-cover"
                src={s.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : s.mediaType === "image" && s.mediaUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.mediaUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${s.tone}`}>
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,190,120,0.2),transparent_55%)]" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/35" />
          </div>
        ))}

        <div className="container-page absolute inset-0 flex items-center">
          <div className="max-w-xl text-white">
            {slide.eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                {slide.eyebrow}
              </span>
            )}
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight font-display sm:text-5xl">
              {slide.heading}
            </h1>
            {slide.subtitle && <p className="mt-4 max-w-md text-white/80">{slide.subtitle}</p>}
            <div className="mt-7 flex flex-wrap gap-3">
              {slide.ctaLabel && (
                <Link
                  href={slide.ctaHref || "#"}
                  className="rounded-sm bg-white px-6 py-3 text-sm font-medium text-brand-ink hover:bg-white/90"
                >
                  {slide.ctaLabel}
                </Link>
              )}
              {slide.secondaryCtaLabel && (
                <Link
                  href={slide.secondaryCtaHref || "#"}
                  className="rounded-sm border border-white px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
                >
                  {slide.secondaryCtaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>

        {multi && (
          <>
            <button
              aria-label="Previous slide"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
            >
              ‹
            </button>
            <button
              aria-label="Next slide"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
            >
              ›
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
