/**
 * Homepage section keys and their admin-facing labels. Kept separate from
 * data/content.ts (which imports the MySQL pool) so client components can
 * import this without pulling server-only code into the browser bundle.
 */
export type SectionKey =
  | "hero"
  | "valueProps"
  | "customHtml"
  | "categories"
  | "bestSellers"
  | "trust"
  | "reviews"
  | "community";

export const sectionLabels: Record<SectionKey, string> = {
  hero: "Hero slider",
  valueProps: "Value props strip",
  customHtml: "Custom HTML sections",
  categories: "Shop by category",
  bestSellers: "Customer favorites",
  trust: "As featured in",
  reviews: "Reviews teaser",
  community: "From the community",
};

export const defaultSectionOrder: SectionKey[] = [
  "hero",
  "valueProps",
  "customHtml",
  "bestSellers",
  "categories",
  "trust",
  "reviews",
  "community",
];
