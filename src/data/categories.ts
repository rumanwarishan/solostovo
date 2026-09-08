import { isDbConfigured, query } from "@/lib/db";

export type CategorySlug =
  | "fire-pits"
  | "pizza-ovens"
  | "camp-stoves"
  | "patio-heaters"
  | "accessories"
  | (string & {});

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
};

/** Used until a database is connected, and as the "seed starter catalog" content. */
export const categoriesSeed: Category[] = [
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

type CategoryRow = {
  slug: string;
  name: string;
  description: string | null;
};

function rowToCategory(row: CategoryRow): Category {
  return { slug: row.slug, name: row.name, description: row.description ?? "" };
}

export async function getCategories(): Promise<Category[]> {
  if (!isDbConfigured()) return categoriesSeed;
  const rows = await query<CategoryRow[]>(
    "SELECT slug, name, description FROM categories ORDER BY sort_order ASC, name ASC"
  );
  return rows.map(rowToCategory);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  if (!isDbConfigured()) return categoriesSeed.find((c) => c.slug === slug);
  const rows = await query<CategoryRow[]>(
    "SELECT slug, name, description FROM categories WHERE slug = ? LIMIT 1",
    [slug]
  );
  return rows[0] ? rowToCategory(rows[0]) : undefined;
}

export async function createCategory(input: Category): Promise<void> {
  await query(
    "INSERT INTO categories (slug, name, description) VALUES (?, ?, ?)",
    [input.slug, input.name, input.description]
  );
}

export async function updateCategory(slug: string, input: Omit<Category, "slug">): Promise<void> {
  await query("UPDATE categories SET name = ?, description = ? WHERE slug = ?", [
    input.name,
    input.description,
    slug,
  ]);
}

export async function deleteCategory(slug: string): Promise<void> {
  await query("DELETE FROM categories WHERE slug = ?", [slug]);
}

export async function categoryCount(): Promise<number> {
  if (!isDbConfigured()) return categoriesSeed.length;
  const rows = await query<{ count: number }[]>("SELECT COUNT(*) as count FROM categories");
  return Number(rows[0]?.count ?? 0);
}

export async function seedCategories(): Promise<void> {
  for (const [i, c] of categoriesSeed.entries()) {
    await query(
      "INSERT IGNORE INTO categories (slug, name, description, sort_order) VALUES (?, ?, ?, ?)",
      [c.slug, c.name, c.description, i]
    );
  }
}
