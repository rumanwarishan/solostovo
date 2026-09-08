import { cache } from "react";
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
export type AnnouncementContent = { messages: string[] };
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

export const defaultAnnouncements: AnnouncementContent = {
  messages: [
    `Free shipping on orders over $${brand.freeShippingThreshold}`,
    brand.trialLine,
    brand.warrantyLine,
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

export type SiteSettings = {
  siteTitle: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  footerDescription: string;
  social: { instagram: string; youtube: string; facebook: string; tiktok: string };
  showHeader: boolean;
  showFooter: boolean;
};

export const defaultSettings: SiteSettings = {
  siteTitle: brand.name,
  tagline: brand.tagline,
  logoUrl: "",
  faviconUrl: "",
  footerDescription: brand.tagline,
  social: { ...brand.social },
  showHeader: true,
  showFooter: true,
};

export type CustomCodeContent = { header: string; content: string; footer: string };

export const defaultCustomCode: CustomCodeContent = { header: "", content: "", footer: "" };

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

// Wrapped in React's cache() so multiple layouts/pages reading the same
// block in one request (header + footer + page all want `settings`, say)
// only hit the database once per request instead of once per caller.
export const getHeroContent = cache(() => getContent<HeroContent>("hero", defaultHero));
export const setHeroContent = (data: HeroContent) => setContent("hero", data);

export const getAnnouncements = cache(() =>
  getContent<AnnouncementContent>("announcements", defaultAnnouncements)
);
export const setAnnouncements = (data: AnnouncementContent) => setContent("announcements", data);

export const getValueProps = cache(() => getContent<ValuePropsContent>("valueProps", defaultValueProps));
export const setValueProps = (data: ValuePropsContent) => setContent("valueProps", data);

export const getTrustContent = cache(() => getContent<TrustContent>("trust", defaultTrust));
export const setTrustContent = (data: TrustContent) => setContent("trust", data);

export const getCommunityContent = cache(() =>
  getContent<CommunityContent>("community", defaultCommunity)
);
export const setCommunityContent = (data: CommunityContent) => setContent("community", data);

export const getSettings = cache(() => getContent<SiteSettings>("settings", defaultSettings));
export const setSettings = (data: SiteSettings) => setContent("settings", data);

export const getCustomCode = cache(() =>
  getContent<CustomCodeContent>("customCode", defaultCustomCode)
);
export const setCustomCode = (data: CustomCodeContent) => setContent("customCode", data);
