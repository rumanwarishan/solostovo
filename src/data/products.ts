import { isDbConfigured, query } from "@/lib/db";
import type { CategorySlug } from "./categories";

export type Variant = {
  id: string;
  name: string;
  priceDelta: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  family: CategorySlug;
  fit?: "tabletop" | "backyard";
  fuel?: "wood" | "propane";
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  badges?: ("bestseller" | "new")[];
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
  variants?: Variant[];
  imageTone: string; // placeholder swatch color, used when no photos are set
  images?: string[]; // real product photos, in order — first is primary, second shows on hover
  imageUrl?: string; // convenience: images[0]
  imageUrl2?: string; // convenience: images[1]
  crossSell?: string[]; // product ids
  compareGroup?: string; // products in the same compareGroup show in the "how this compares" module
  stock: number;
};

/** Used until a database is connected, and as the "seed starter catalog" content. */
export const productsSeed: Product[] = [
  {
    id: "fp-ember-18",
    slug: "ember-18",
    name: "Ember 18",
    family: "fire-pits",
    fit: "backyard",
    fuel: "wood",
    price: 279,
    rating: 4.8,
    reviewCount: 3421,
    badges: ["bestseller"],
    shortDescription: "Our most popular backyard fire pit — smokeless, stainless steel, seats up to 6.",
    description:
      "The Ember 18 uses a double-wall airflow design to pull smoke back through the fire for a cleaner, nearly smokeless burn. Stainless steel construction stands up to weather and heat cycling year after year.",
    specs: {
      Diameter: '18.5"',
      Height: '14"',
      Weight: "20 lbs",
      Material: "304 Stainless Steel",
      "Recommended Group Size": "4–6 people",
      "Avg. Burn Time": "2–3 hrs per load",
    },
    imageTone: "from-[#3a4a3f] to-[#1f2b23]",
    crossSell: ["acc-stand-ember", "acc-cover-ember", "acc-fuel-bundle"],
    compareGroup: "backyard-wood",
    stock: 142,
  },
  {
    id: "fp-ember-27",
    slug: "ember-27",
    name: "Ember 27",
    family: "fire-pits",
    fit: "backyard",
    fuel: "wood",
    price: 449,
    rating: 4.9,
    reviewCount: 1876,
    shortDescription: "The large-format Ember for groups — same smokeless design, seats up to 10.",
    description:
      "Same double-wall smokeless airflow as the Ember 18, scaled up for bigger gatherings. A wider hearth means longer logs and a bigger flame without more smoke.",
    specs: {
      Diameter: '27"',
      Height: '16.5"',
      Weight: "38 lbs",
      Material: "304 Stainless Steel",
      "Recommended Group Size": "8–10 people",
      "Avg. Burn Time": "3–4 hrs per load",
    },
    imageTone: "from-[#3a4a3f] to-[#182019]",
    crossSell: ["acc-stand-ember", "acc-cover-ember-27", "acc-fuel-bundle"],
    compareGroup: "backyard-wood",
    stock: 64,
  },
  {
    id: "fp-scout-12",
    slug: "scout-12",
    name: "Scout 12",
    family: "fire-pits",
    fit: "tabletop",
    fuel: "wood",
    price: 129,
    rating: 4.6,
    reviewCount: 962,
    badges: ["new"],
    shortDescription: "A compact tabletop fire, smokeless enough for a small balcony or patio table.",
    description:
      "Scout 12 brings the same airflow technology to a tabletop size — enough real fire for a small deck, balcony, or camp table without the smoke that usually comes with it.",
    specs: {
      Diameter: '12"',
      Height: '9.5"',
      Weight: "7 lbs",
      Material: "304 Stainless Steel",
      "Recommended Group Size": "1–2 people",
      "Avg. Burn Time": "45–60 min per load",
    },
    imageTone: "from-[#4a5a4a] to-[#22301f]",
    crossSell: ["acc-cover-scout", "acc-fuel-bundle"],
    compareGroup: "tabletop-wood",
    stock: 210,
  },
  {
    id: "fp-infinity-flame",
    slug: "infinity-flame",
    name: "Infinity Flame",
    family: "fire-pits",
    fit: "backyard",
    fuel: "propane",
    price: 599,
    rating: 4.7,
    reviewCount: 588,
    badges: ["new"],
    shortDescription: "Push-button propane fire, no wood or smoke — just flame on demand.",
    description:
      "For nights you want fire without tending it: push-button ignition, adjustable flame height, and a lava-rock hearth. Runs on a standard 20 lb propane tank (sold separately) or a natural gas line kit.",
    specs: {
      Diameter: '24"',
      Height: '15"',
      Weight: "42 lbs",
      Material: "Stainless Steel + Powder-Coat Base",
      "Recommended Group Size": "6–8 people",
      "Avg. Run Time": "~8 hrs per 20 lb tank",
    },
    imageTone: "from-[#5a4030] to-[#2b1d14]",
    crossSell: ["acc-fuel-bundle"],
    compareGroup: "backyard-propane",
    stock: 37,
  },
  {
    id: "po-hearth-16",
    slug: "hearth-16",
    name: "Hearth 16",
    family: "pizza-ovens",
    price: 349,
    rating: 4.7,
    reviewCount: 741,
    badges: ["bestseller"],
    shortDescription: "Wood-fired pizza in 90 seconds. Fits a 12–14 inch pie.",
    description:
      "A refractory stone base and insulated dome hold consistent heat above 900°F, so a pizza cooks in about 90 seconds — closer to a restaurant oven than a backyard project.",
    specs: {
      "Max Pizza Size": '14"',
      "Preheat Time": "~15 min",
      Weight: "44 lbs",
      Material: "Stainless Steel, Ceramic Fiber Insulation",
      Fuel: "Wood or wood pellets",
    },
    imageTone: "from-[#4a3a2a] to-[#241a10]",
    crossSell: ["acc-fuel-bundle"],
    stock: 88,
  },
  {
    id: "cs-trailhead-1",
    slug: "trailhead-1",
    name: "Trailhead 1",
    family: "camp-stoves",
    price: 89,
    rating: 4.5,
    reviewCount: 412,
    shortDescription: "A pocket-size wood-burning stove for backcountry cooking.",
    description:
      "Collapses to fit in a pack side pocket, burns twigs and small fuel you find on trail, and boils a liter of water in about 8 minutes.",
    specs: {
      "Packed Size": '5.3" x 5.3" x 5.3"',
      Weight: "1.1 lbs",
      Material: "Stainless Steel",
      Fuel: "Wood, twigs, biomass",
    },
    imageTone: "from-[#4a4a3a] to-[#232319]",
    stock: 305,
  },
  {
    id: "ph-radiant-70",
    slug: "radiant-70",
    name: "Radiant 70",
    family: "patio-heaters",
    price: 429,
    rating: 4.4,
    reviewCount: 203,
    shortDescription: "Freestanding propane patio heater with a 10 ft heat radius.",
    description:
      "Radiant heat that keeps working when the wind picks up. Piezo ignition, tip-over safety shutoff, and a tank hideaway base.",
    specs: {
      Height: '87"',
      "Heat Output": "41,000 BTU",
      "Heat Radius": "~10 ft",
      Fuel: "Propane (20 lb tank)",
    },
    imageTone: "from-[#3a3f4a] to-[#1c1f26]",
    stock: 51,
  },
  {
    id: "acc-stand-ember",
    slug: "ember-stand",
    name: "Ember Stand",
    family: "accessories",
    price: 59,
    rating: 4.8,
    reviewCount: 1204,
    shortDescription: "Raise your Ember 18 or 27 off the ground and protect your deck or patio.",
    description: "A steel stand that lifts your fire pit for airflow and surface protection.",
    specs: { Fits: "Ember 18, Ember 27", Material: "Powder-Coated Steel" },
    imageTone: "from-[#565650] to-[#2b2b27]",
    stock: 260,
  },
  {
    id: "acc-cover-ember",
    slug: "ember-18-cover",
    name: "Ember 18 Cover",
    family: "accessories",
    price: 39,
    rating: 4.6,
    reviewCount: 890,
    shortDescription: "Weatherproof cover sized for the Ember 18.",
    description: "600D polyester cover with a cinch cord to keep your Ember 18 dry between fires.",
    specs: { Fits: "Ember 18", Material: "600D Polyester" },
    imageTone: "from-[#4a4a45] to-[#232320]",
    stock: 340,
  },
  {
    id: "acc-cover-ember-27",
    slug: "ember-27-cover",
    name: "Ember 27 Cover",
    family: "accessories",
    price: 49,
    rating: 4.6,
    reviewCount: 402,
    shortDescription: "Weatherproof cover sized for the Ember 27.",
    description: "600D polyester cover with a cinch cord to keep your Ember 27 dry between fires.",
    specs: { Fits: "Ember 27", Material: "600D Polyester" },
    imageTone: "from-[#4a4a45] to-[#232320]",
    stock: 198,
  },
  {
    id: "acc-cover-scout",
    slug: "scout-12-cover",
    name: "Scout 12 Cover",
    family: "accessories",
    price: 25,
    rating: 4.5,
    reviewCount: 233,
    shortDescription: "Weatherproof cover sized for the Scout 12.",
    description: "600D polyester cover with a cinch cord to keep your Scout 12 dry between fires.",
    specs: { Fits: "Scout 12", Material: "600D Polyester" },
    imageTone: "from-[#4a4a45] to-[#232320]",
    stock: 275,
  },
  {
    id: "acc-fuel-bundle",
    slug: "hardwood-fuel-bundle",
    name: "Hardwood Fuel Bundle",
    family: "accessories",
    price: 45,
    rating: 4.7,
    reviewCount: 615,
    shortDescription: "Kiln-dried hardwood, cut to fit tabletop and backyard fire pits.",
    description: "A dense, low-moisture hardwood mix that lights fast and burns clean.",
    specs: { Weight: "~20 lbs", Species: "Oak / Hickory Mix" },
    imageTone: "from-[#5a4530] to-[#2a2015]",
    stock: 500,
  },
];

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  family: string;
  fit: string | null;
  fuel: string | null;
  price: string;
  compare_at_price: string | null;
  rating: string;
  review_count: number;
  badges: unknown;
  short_description: string | null;
  description: string | null;
  specs: unknown;
  variants: unknown;
  image_tone: string;
  image_url: string | null;
  image_url_2: string | null;
  images: unknown;
  cross_sell: unknown;
  compare_group: string | null;
  stock: number;
};

function parseJsonColumn<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function rowToProduct(row: ProductRow): Product {
  const parsedImages = parseJsonColumn<string[]>(row.images, []);
  // Falls back to the old two-column fields for rows saved before the
  // gallery existed — the next edit through the admin form migrates them.
  const images = parsedImages.length > 0
    ? parsedImages
    : [row.image_url, row.image_url_2].filter((src): src is string => Boolean(src));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    family: row.family,
    fit: (row.fit as Product["fit"]) ?? undefined,
    fuel: (row.fuel as Product["fuel"]) ?? undefined,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    badges: parseJsonColumn(row.badges, undefined),
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    specs: parseJsonColumn(row.specs, {}),
    variants: parseJsonColumn(row.variants, undefined),
    imageTone: row.image_tone,
    images,
    imageUrl: images[0],
    imageUrl2: images[1],
    crossSell: parseJsonColumn(row.cross_sell, undefined),
    compareGroup: row.compare_group ?? undefined,
    stock: row.stock,
  };
}

const PRODUCT_COLUMNS = `
  id, slug, name, family, fit, fuel, price, compare_at_price, rating, review_count,
  badges, short_description, description, specs, variants, image_tone, image_url, image_url_2,
  images, cross_sell, compare_group, stock
`;

export async function getProducts(): Promise<Product[]> {
  if (!isDbConfigured()) return productsSeed;
  const rows = await query<ProductRow[]>(`SELECT ${PRODUCT_COLUMNS} FROM products ORDER BY name ASC`);
  return rows.map(rowToProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (!isDbConfigured()) return productsSeed.find((p) => p.slug === slug);
  const rows = await query<ProductRow[]>(
    `SELECT ${PRODUCT_COLUMNS} FROM products WHERE slug = ? LIMIT 1`,
    [slug]
  );
  return rows[0] ? rowToProduct(rows[0]) : undefined;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!isDbConfigured()) return productsSeed.find((p) => p.id === id);
  const rows = await query<ProductRow[]>(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = ? LIMIT 1`, [
    id,
  ]);
  return rows[0] ? rowToProduct(rows[0]) : undefined;
}

export async function productsByFamily(family: CategorySlug): Promise<Product[]> {
  if (!isDbConfigured()) return productsSeed.filter((p) => p.family === family);
  const rows = await query<ProductRow[]>(
    `SELECT ${PRODUCT_COLUMNS} FROM products WHERE family = ? ORDER BY name ASC`,
    [family]
  );
  return rows.map(rowToProduct);
}

export async function compareGroup(product: Product): Promise<Product[]> {
  if (!product.compareGroup) return [];
  if (!isDbConfigured()) {
    return productsSeed.filter((p) => p.compareGroup === product.compareGroup && p.id !== product.id);
  }
  const rows = await query<ProductRow[]>(
    `SELECT ${PRODUCT_COLUMNS} FROM products WHERE compare_group = ? AND id != ?`,
    [product.compareGroup, product.id]
  );
  return rows.map(rowToProduct);
}

export async function bestSellers(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.badges?.includes("bestseller"));
}

export async function productCount(): Promise<number> {
  if (!isDbConfigured()) return productsSeed.length;
  const rows = await query<{ count: number }[]>("SELECT COUNT(*) as count FROM products");
  return Number(rows[0]?.count ?? 0);
}

type ProductInput = Omit<Product, "id"> & { id?: string };

function slugify(id: string) {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(input: ProductInput): Promise<string> {
  const id = input.id || slugify(`${input.family}-${input.name}-${Date.now().toString(36)}`);
  await query(
    `INSERT INTO products (${PRODUCT_COLUMNS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.slug,
      input.name,
      input.family,
      input.fit ?? null,
      input.fuel ?? null,
      input.price,
      input.compareAtPrice ?? null,
      input.rating,
      input.reviewCount,
      JSON.stringify(input.badges ?? []),
      input.shortDescription,
      input.description,
      JSON.stringify(input.specs ?? {}),
      JSON.stringify(input.variants ?? []),
      input.imageTone,
      null, // image_url — superseded by the images column below
      null, // image_url_2 — superseded by the images column below
      JSON.stringify(input.images ?? []),
      JSON.stringify(input.crossSell ?? []),
      input.compareGroup ?? null,
      input.stock,
    ]
  );
  return id;
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  await query(
    `UPDATE products SET slug=?, name=?, family=?, fit=?, fuel=?, price=?, compare_at_price=?,
     rating=?, review_count=?, badges=?, short_description=?, description=?, specs=?, variants=?,
     image_tone=?, image_url=NULL, image_url_2=NULL, images=?, cross_sell=?, compare_group=?, stock=? WHERE id=?`,
    [
      input.slug,
      input.name,
      input.family,
      input.fit ?? null,
      input.fuel ?? null,
      input.price,
      input.compareAtPrice ?? null,
      input.rating,
      input.reviewCount,
      JSON.stringify(input.badges ?? []),
      input.shortDescription,
      input.description,
      JSON.stringify(input.specs ?? {}),
      JSON.stringify(input.variants ?? []),
      input.imageTone,
      JSON.stringify(input.images ?? []),
      JSON.stringify(input.crossSell ?? []),
      input.compareGroup ?? null,
      input.stock,
      id,
    ]
  );
}

export async function deleteProduct(id: string): Promise<void> {
  await query("DELETE FROM products WHERE id = ?", [id]);
}

export async function seedProducts(): Promise<void> {
  for (const p of productsSeed) {
    await query(
      `INSERT IGNORE INTO products (${PRODUCT_COLUMNS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.slug,
        p.name,
        p.family,
        p.fit ?? null,
        p.fuel ?? null,
        p.price,
        p.compareAtPrice ?? null,
        p.rating,
        p.reviewCount,
        JSON.stringify(p.badges ?? []),
        p.shortDescription,
        p.description,
        JSON.stringify(p.specs ?? {}),
        JSON.stringify(p.variants ?? []),
        p.imageTone,
        null,
        null,
        JSON.stringify(p.images ?? []),
        JSON.stringify(p.crossSell ?? []),
        p.compareGroup ?? null,
        p.stock,
      ]
    );
  }
}
