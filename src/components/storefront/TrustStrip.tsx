const press = ["Outdoor Living Weekly", "The Backyard Journal", "Field & Flame", "Patio Report", "GearWire"];

export function TrustStrip() {
  return (
    <section className="border-t border-brand-line py-10">
      <div className="container-page">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-brand-ink/40">
          As featured in
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {press.map((name) => (
            <span key={name} className="font-display text-sm font-bold uppercase tracking-wide text-brand-ink/35">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
