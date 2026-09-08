import Link from "next/link";
import { getCategories } from "@/data/categories";
import { PlaceholderImage } from "./PlaceholderImage";

const tones: Record<string, string> = {
  "fire-pits": "from-[#3a4a3f] to-[#1a241e]",
  "pizza-ovens": "from-[#4a3a2a] to-[#241a10]",
  "camp-stoves": "from-[#4a4a3a] to-[#232319]",
  "patio-heaters": "from-[#3a3f4a] to-[#1c1f26]",
  accessories: "from-[#565650] to-[#2b2b27]",
};
const fallbackTone = "from-[#4a4a45] to-[#232320]";

export async function CategoryTiles() {
  const categories = await getCategories();
  return (
    <section className="container-page py-14">
      <h2 className="font-display text-2xl font-bold">Shop by category</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {categories.map((c) => (
          <Link key={c.slug} href={`/shop/${c.slug}`} className="group">
            <PlaceholderImage
              tone={tones[c.slug] ?? fallbackTone}
              label={c.name}
              className="aspect-square w-full"
            />
            <span className="mt-2 block text-sm font-medium group-hover:text-brand-primary">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
