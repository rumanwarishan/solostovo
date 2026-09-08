"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { HeroContent, ValuePropsContent, TrustContent, CommunityContent, HeroSlide } from "@/data/content";

const inputClass =
  "w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-primary";
const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50";

const blankSlide: HeroSlide = {
  eyebrow: "",
  heading: "New headline",
  subtitle: "",
  ctaLabel: "",
  ctaHref: "",
  secondaryCtaLabel: "",
  secondaryCtaHref: "",
  mediaType: "image",
  mediaUrl: "",
  tone: "from-[#3a4a3f] to-[#141c17]",
};

export function ContentForm({
  initialHero,
  initialValueProps,
  initialTrust,
  initialCommunity,
}: {
  initialHero: HeroContent;
  initialValueProps: ValuePropsContent;
  initialTrust: TrustContent;
  initialCommunity: CommunityContent;
}) {
  const router = useRouter();
  const [hero, setHero] = useState(initialHero);
  const [valueProps, setValueProps] = useState(initialValueProps.items);
  const [trust, setTrust] = useState(initialTrust.names);
  const [community, setCommunity] = useState(initialCommunity.posts);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function updateSlide(i: number, patch: Partial<HeroSlide>) {
    setHero((h) => ({ slides: h.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero,
          valueProps: { items: valueProps.filter((v) => v.trim() !== "") },
          trust: { names: trust.filter((v) => v.trim() !== "") },
          community: { posts: community.filter((p) => p.title.trim() !== "") },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save content.");
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save content.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      {error && (
        <div className="mb-4 rounded-sm border border-brand-danger/30 bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 rounded-sm border border-brand-primary/30 bg-brand-primary-soft px-3 py-2 text-sm text-brand-primary-dark">
          Saved. Refresh the storefront to see it live.
        </div>
      )}

      {/* Hero slides */}
      <section className="mb-10">
        <h2 className="font-display text-lg font-bold">Hero slider</h2>
        <p className="mt-1 text-xs text-brand-ink/60">
          The full-width banner at the top of the homepage. Add a video or image URL, or leave blank
          to use the placeholder gradient.
        </p>
        <div className="mt-4 flex flex-col gap-6">
          {hero.slides.map((slide, i) => (
            <div key={i} className="rounded-sm border border-brand-line bg-brand-surface p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-ink/50">
                  Slide {i + 1}
                </span>
                {hero.slides.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setHero((h) => ({ slides: h.slides.filter((_, idx) => idx !== i) }))}
                    className="text-xs text-brand-ink/40 hover:text-brand-danger"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Eyebrow label</label>
                  <input className={inputClass} value={slide.eyebrow} onChange={(e) => updateSlide(i, { eyebrow: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Headline</label>
                  <input className={inputClass} value={slide.heading} onChange={(e) => updateSlide(i, { heading: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Subtitle</label>
                  <textarea rows={2} className={inputClass} value={slide.subtitle} onChange={(e) => updateSlide(i, { subtitle: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Primary button label</label>
                  <input className={inputClass} value={slide.ctaLabel} onChange={(e) => updateSlide(i, { ctaLabel: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Primary button link</label>
                  <input className={inputClass} value={slide.ctaHref} onChange={(e) => updateSlide(i, { ctaHref: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Secondary button label</label>
                  <input className={inputClass} value={slide.secondaryCtaLabel} onChange={(e) => updateSlide(i, { secondaryCtaLabel: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Secondary button link</label>
                  <input className={inputClass} value={slide.secondaryCtaHref} onChange={(e) => updateSlide(i, { secondaryCtaHref: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Media type</label>
                  <select
                    className={inputClass}
                    value={slide.mediaType}
                    onChange={(e) => updateSlide(i, { mediaType: e.target.value as HeroSlide["mediaType"] })}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Media URL (optional)</label>
                  <input
                    className={inputClass}
                    placeholder="https://…"
                    value={slide.mediaUrl}
                    onChange={(e) => updateSlide(i, { mediaUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setHero((h) => ({ slides: [...h.slides, { ...blankSlide }] }))}
            className="self-start text-xs font-medium text-brand-primary hover:underline"
          >
            + Add slide
          </button>
        </div>
      </section>

      {/* Value props */}
      <section className="mb-10">
        <h2 className="font-display text-lg font-bold">Value props bar</h2>
        <p className="mt-1 text-xs text-brand-ink/60">
          The strip under the header (shipping, warranty, trial, financing).
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {valueProps.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputClass}
                value={item}
                onChange={(e) => setValueProps(valueProps.map((v, idx) => (idx === i ? e.target.value : v)))}
              />
              <button
                type="button"
                onClick={() => setValueProps(valueProps.filter((_, idx) => idx !== i))}
                className="px-2 text-brand-ink/40 hover:text-brand-danger"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setValueProps([...valueProps, ""])}
            className="self-start text-xs font-medium text-brand-primary hover:underline"
          >
            + Add item
          </button>
        </div>
      </section>

      {/* Trust strip */}
      <section className="mb-10">
        <h2 className="font-display text-lg font-bold">&quot;As featured in&quot; strip</h2>
        <div className="mt-3 flex flex-col gap-2">
          {trust.map((name, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setTrust(trust.map((v, idx) => (idx === i ? e.target.value : v)))}
              />
              <button
                type="button"
                onClick={() => setTrust(trust.filter((_, idx) => idx !== i))}
                className="px-2 text-brand-ink/40 hover:text-brand-danger"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setTrust([...trust, ""])}
            className="self-start text-xs font-medium text-brand-primary hover:underline"
          >
            + Add name
          </button>
        </div>
      </section>

      {/* Community posts */}
      <section className="mb-10">
        <h2 className="font-display text-lg font-bold">&quot;From the community&quot; teaser</h2>
        <div className="mt-3 flex flex-col gap-2">
          {community.map((post, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Tag"
                className={`${inputClass} max-w-[160px]`}
                value={post.tag}
                onChange={(e) => setCommunity(community.map((p, idx) => (idx === i ? { ...p, tag: e.target.value } : p)))}
              />
              <input
                placeholder="Post title"
                className={inputClass}
                value={post.title}
                onChange={(e) => setCommunity(community.map((p, idx) => (idx === i ? { ...p, title: e.target.value } : p)))}
              />
              <button
                type="button"
                onClick={() => setCommunity(community.filter((_, idx) => idx !== i))}
                className="px-2 text-brand-ink/40 hover:text-brand-danger"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setCommunity([...community, { title: "", tag: "" }])}
            className="self-start text-xs font-medium text-brand-primary hover:underline"
          >
            + Add post
          </button>
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-sm bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-dark disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save content"}
      </button>
    </div>
  );
}
