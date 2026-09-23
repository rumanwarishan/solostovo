"use client";

import { useEffect, useState } from "react";
import { NewsletterForm } from "./NewsletterForm";

const STORAGE_KEY = "location-popup:dismissed-at";
const RESHOW_AFTER_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

type Detected = { matches: boolean; countryName: string };

/**
 * Detects the visitor's country client-side (their browser has real
 * internet access even when this server doesn't) via a free, keyless geo-IP
 * lookup, then shows one of two honest popups: a newsletter signup if they
 * match the store's country, or a plain shipping notice if they don't —
 * never a fake "take me to the UK site" button, since there's no other
 * regional storefront to send them to.
 */
export function LocationNotice({ enabled, storeCountry }: { enabled: boolean; storeCountry: string }) {
  const [detected, setDetected] = useState<Detected | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled || !storeCountry.trim()) return;

    let lastDismissed = 0;
    try {
      lastDismissed = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
    } catch {
      // localStorage unavailable — just show it, no way to remember dismissal
    }
    if (Date.now() - lastDismissed < RESHOW_AFTER_MS) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const countryName = data?.country_name;
        if (typeof countryName !== "string" || !countryName) return;
        setDetected({
          matches: countryName.trim().toLowerCase() === storeCountry.trim().toLowerCase(),
          countryName,
        });
      })
      .catch(() => {
        // Blocked by an ad blocker, offline, rate-limited, whatever — fail silent.
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [enabled, storeCountry]);

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  }

  if (!enabled || !detected || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-sm bg-white p-6 shadow-2xl">
        <button
          aria-label="Close"
          onClick={dismiss}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-brand-line text-brand-ink/60 hover:text-brand-ink"
        >
          ×
        </button>

        {detected.matches ? (
          <>
            <h2 className="pr-8 font-display text-xl font-bold text-brand-ink">Join our newsletter</h2>
            <p className="mt-2 text-sm text-brand-ink/70">
              Sign up for restock alerts, new drops, and the occasional discount code.
            </p>
            <div className="mt-4">
              <NewsletterForm
                source="location-popup"
                onSuccess={dismiss}
                inputClassName="w-full rounded-sm border border-brand-line bg-brand-paper px-3 py-2 text-sm text-brand-ink placeholder:text-brand-ink/40 outline-none focus:border-brand-primary"
                buttonClassName="w-full rounded-sm bg-brand-ink px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-primary disabled:opacity-50"
              />
            </div>
            <button
              onClick={dismiss}
              className="mt-3 w-full text-center text-xs text-brand-ink/50 hover:text-brand-ink"
            >
              No thanks
            </button>
          </>
        ) : (
          <>
            <h2 className="pr-8 font-display text-xl font-bold text-brand-ink">
              We&apos;ve detected that you&apos;re in {detected.countryName}
            </h2>
            <p className="mt-2 text-sm text-brand-ink/70">
              You&apos;re viewing the {storeCountry} store. We currently ship within {storeCountry}{" "}
              only, so items and pricing here may not be available to you.
            </p>
            <button
              onClick={dismiss}
              className="mt-5 w-full rounded-sm border border-brand-line px-4 py-2.5 text-sm font-medium hover:border-brand-primary hover:text-brand-primary"
            >
              Continue browsing
            </button>
          </>
        )}
      </div>
    </div>
  );
}
