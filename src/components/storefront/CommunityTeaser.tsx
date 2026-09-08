import Link from "next/link";
import { PlaceholderImage } from "./PlaceholderImage";

const posts = [
  { title: "5 tips for a truly smokeless fire", tag: "Fire pits" },
  { title: "Your first wood-fired pizza, step by step", tag: "Pizza ovens" },
  { title: "How to size a fire pit for your patio", tag: "Buying guide" },
];

export function CommunityTeaser() {
  return (
    <section className="border-t border-brand-line py-14">
      <div className="container-page">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold">From the community</h2>
          <Link href="/community" className="text-sm font-medium text-brand-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.title} href="/community" className="group">
              <PlaceholderImage tone="from-[#4a4a3a] to-[#232319]" label={p.tag} className="aspect-[4/3] w-full" />
              <span className="mt-2 block text-xs font-medium uppercase tracking-wide text-brand-primary">
                {p.tag}
              </span>
              <span className="mt-1 block text-sm font-medium group-hover:text-brand-primary">
                {p.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
