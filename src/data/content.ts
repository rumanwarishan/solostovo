import { isDbConfigured, query } from "@/lib/db";
import { brand } from "@/config/brand";

export type HeroSlide = {
  heading: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  eyebrow: string;
  mediaType: "image" | "video";
  mediaUrl: string; // used when mediaType is "video" (or an image URL); ignored for the placeholder tone
  tone: string; // Tailwind gradient classes for the placeholder, used when mediaUrl is empty
};

export type HeroContent = { slides: HeroSlide[] };
export type ValuePropsContent = { items: string[] };
export type TrustContent = { names: string[] };
export type CommunityPost = { title: string; tag: string };
export type CommunityContent = { posts: CommunityPost[] };

export const defaultHero: HeroContent = {
  slides: [
    {
      eyebrow: "New — Infinity Flame propane collection",
      heading: "Gather around the fire.",
      subtitle: `Smokeless fire pits, wood-fired ovens, and gear built to hold up to real use — backed by ${brand.warrantyLine.toLowerCase()} and a ${brand.trialLine.toLowerCase()}.`,
      ctaLabel: "Shop Fire Pits",
      ctaHref: "/shop/fire-pits",
      secondaryCtaLabel: "Find my size",
      secondaryCtaHref: "/shop/fire-pits?fit=tabletop",
      mediaType: "image",
      mediaUrl: "",
      tone: "from-[#3a4a3f] to-[#141c17]",
    },
  ],
};

export const defaultValueProps: ValuePropsContent = {
  items: [
    `Free shipping over $${brand.freeShippingThreshold}`,
    brand.warrantyLine,
    brand.trialLine,
    "Financing available at checkout",
  ],
};

export const defaultTrust: TrustContent = {
  names: ["Outdoor Living Weekly", "The Backyard Journal", "Field & Flame", "Patio Report", "GearWire"],
};

export const defaultCommunity: CommunityContent = {
  posts: [
    { title: "5 tips for a truly smokeless fire", tag: "Fire pits" },
    { title: "Your first wood-fired pizza, step by step", tag: "Pizza ovens" },
    { title: "How to size a fire pit for your patio", tag: "Buying guide" },
  ],
};

type ContentRow = { data: unknown };

async function getContent<T>(key: string, fallback: T): Promise<T> {
  if (!isDbConfigured()) return fallback;
  const rows = await query<ContentRow[]>("SELECT data FROM content_blocks WHERE block_key = ? LIMIT 1", [
    key,
  ]);
  if (!rows[0]) return fallback;
  const raw = rows[0].data;
  return (typeof raw === "string" ? JSON.parse(raw) : raw) as T;
}

async function setContent(key: string, data: unknown): Promise<void> {
  await query(
    "INSERT INTO content_blocks (block_key, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)",
    [key, JSON.stringify(data)]
  );
}

export const getHeroContent = () => getContent<HeroContent>("hero", defaultHero);
export const setHeroContent = (data: HeroContent) => setContent("hero", data);

export const getValueProps = () => getContent<ValuePropsContent>("valueProps", defaultValueProps);
export const setValueProps = (data: ValuePropsContent) => setContent("valueProps", data);

export const getTrustContent = () => getContent<TrustContent>("trust", defaultTrust);
export const setTrustContent = (data: TrustContent) => setContent("trust", data);

export const getCommunityContent = () => getContent<CommunityContent>("community", defaultCommunity);
export const setCommunityContent = (data: CommunityContent) => setContent("community", data);
