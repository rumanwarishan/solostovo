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
  imageTone: string; // placeholder swatch color for the product image block
  crossSell?: string[]; // product ids
  compareGroup?: string; // products in the same compareGroup show in the "how this compares" module
  stock: number;
};

export const products: Product[] = [
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

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function productsByFamily(family: CategorySlug): Product[] {
  return products.filter((p) => p.family === family);
}

export function compareGroup(product: Product): Product[] {
  if (!product.compareGroup) return [];
  return products.filter(
    (p) => p.compareGroup === product.compareGroup && p.id !== product.id
  );
}

export function bestSellers(): Product[] {
  return products.filter((p) => p.badges?.includes("bestseller"));
}
