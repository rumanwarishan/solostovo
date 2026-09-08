import { getTrustContent } from "@/data/content";

export async function TrustStrip() {
  const { names } = await getTrustContent();
  if (names.length === 0) return null;

  return (
    <section className="border-t border-brand-line py-10">
      <div className="container-page">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-brand-ink/40">
          As featured in
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {names.map((name) => (
            <span key={name} className="font-display text-sm font-bold uppercase tracking-wide text-brand-ink/35">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
