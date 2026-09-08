import { StarRating } from "./StarRating";
import { PlaceholderImage } from "./PlaceholderImage";

const reviews = [
  {
    name: "Priya S.",
    product: "Ember 18",
    rating: 5,
    quote:
      "Actually smokeless. Had six people around it and nobody had to move seats to escape the smoke.",
  },
  {
    name: "Marcus T.",
    product: "Hearth 16",
    rating: 5,
    quote: "First pizza took about 90 seconds once it was up to temp. Genuinely restaurant-quality crust.",
  },
  {
    name: "Dana K.",
    product: "Scout 12",
    rating: 4,
    quote: "Perfect size for our apartment balcony. Wish the fuel lasted a little longer per load.",
  },
];

export function ReviewsTeaser() {
  return (
    <section className="border-t border-brand-line bg-brand-surface py-14">
      <div className="container-page">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold">What customers are saying</h2>
          <StarRating rating={4.8} reviewCount={9412} />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-sm border border-brand-line p-5">
              <StarRating rating={r.rating} reviewCount={0} hideCount />
              <blockquote className="mt-3 text-sm text-brand-ink/80">&ldquo;{r.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <PlaceholderImage tone="from-[#565650] to-[#2b2b27]" label="" className="h-8 w-8 rounded-full" />
                <span className="text-xs text-brand-ink/60">
                  {r.name} · {r.product}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
