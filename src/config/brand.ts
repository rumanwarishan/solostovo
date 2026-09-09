/**
 * Single source of truth for brand identity.
 *
 * This is a scaffold — every value below is a clearly-marked placeholder.
 * Swap them for your real brand before shipping. Nothing here is copied
 * from any third-party site; it's generic so you can drop your own
 * name, palette, and copy in.
 */
export const brand = {
  name: "Solostovo",
  shortName: "Solostovo",
  tagline: "Gather around the fire.", // TODO: replace with your tagline
  domain: "solostovo.example",
  supportEmail: "help@solostovo.example",
  freeShippingThreshold: 199,
  warrantyLine: "Lifetime warranty on stainless steel",
  trialLine: "60-day risk-free trial",
  social: {
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },
} as const;
