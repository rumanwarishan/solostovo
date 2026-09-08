export type CategorySlug =
  | "fire-pits"
  | "pizza-ovens"
  | "camp-stoves"
  | "patio-heaters"
  | "accessories";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
};

export const categories: Category[] = [
  {
    slug: "fire-pits",
    name: "Fire Pits",
    description:
      "Smokeless wood-burning and propane fire pits, from tabletop to backyard.",
  },
  {
    slug: "pizza-ovens",
    name: "Pizza Ovens",
    description: "Wood-fired outdoor ovens for pizza, bread, and roasts.",
  },
  {
    slug: "camp-stoves",
    name: "Camp Stoves",
    description: "Portable stoves for backcountry cooking.",
  },
  {
    slug: "patio-heaters",
    name: "Patio Heaters",
    description: "Radiant heaters that stretch the outdoor season.",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Stands, covers, tools, and fuel for your setup.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
