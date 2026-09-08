const faqs = [
  {
    q: "How is this actually smokeless?",
    a: "A double-wall body pulls air in at the base and preheats it before releasing it above the fire through small ports, causing more complete combustion — less unburned particulate means less visible smoke.",
  },
  {
    q: "What's the return policy?",
    a: "You have 60 days to try it. Returns within that window are refunded to your original payment method, minus a restocking fee disclosed at checkout before you complete your order.",
  },
  {
    q: "Do I need a stand or can it sit directly on my deck?",
    a: "We recommend a stand or heat-safe surface for wood decking — check the product's spec table for compatible accessories.",
  },
  {
    q: "How long does shipping take?",
    a: "Most orders ship within 2 business days. You'll get tracking as soon as it leaves the warehouse.",
  },
];

export function FaqAccordion() {
  return (
    <section className="mt-16 border-t border-brand-line pt-10">
      <h2 className="font-display text-xl font-bold">Questions &amp; answers</h2>
      <div className="mt-4 divide-y divide-brand-line">
        {faqs.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
              {f.q}
              <span className="ml-4 text-brand-ink/40 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm text-brand-ink/70">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
