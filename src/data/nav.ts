export type NavLink = {
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  href: string;
  links: NavLink[];
};

/** Need-based entry points, leading the primary nav (fixes the audit's #6 recommendation). */
export const needNav: NavLink[] = [
  { label: "Small Space", href: "/shop/fire-pits?fit=tabletop" },
  { label: "Entertaining", href: "/shop/fire-pits?fit=backyard" },
  { label: "Cooking", href: "/shop/pizza-ovens" },
  { label: "Gifts", href: "/shop/accessories" },
];

/** Product-family nav, for returning shoppers who already know the line. */
export const familyNav: NavGroup[] = [
  {
    label: "Fire Pits",
    href: "/shop/fire-pits",
    links: [
      { label: "All Fire Pits", href: "/shop/fire-pits" },
      { label: "Tabletop", href: "/shop/fire-pits?fit=tabletop" },
      { label: "Backyard", href: "/shop/fire-pits?fit=backyard" },
      { label: "Propane", href: "/shop/fire-pits?fuel=propane" },
    ],
  },
  {
    label: "Pizza Ovens",
    href: "/shop/pizza-ovens",
    links: [{ label: "All Pizza Ovens", href: "/shop/pizza-ovens" }],
  },
  {
    label: "Camp Stoves",
    href: "/shop/camp-stoves",
    links: [{ label: "All Camp Stoves", href: "/shop/camp-stoves" }],
  },
  {
    label: "Patio Heaters",
    href: "/shop/patio-heaters",
    links: [{ label: "All Patio Heaters", href: "/shop/patio-heaters" }],
  },
  {
    label: "Accessories",
    href: "/shop/accessories",
    links: [
      { label: "Stands", href: "/shop/accessories?type=stand" },
      { label: "Covers", href: "/shop/accessories?type=cover" },
      { label: "Fuel", href: "/shop/accessories?type=fuel" },
      { label: "Tools", href: "/shop/accessories?type=tool" },
    ],
  },
];

export const footerNav = {
  shop: familyNav.map((f) => ({ label: f.label, href: f.href })),
  help: [
    { label: "Help Center", href: "/help" },
    { label: "Shipping & Returns", href: "/help/shipping-returns" },
    { label: "Warranty", href: "/help/warranty" },
    { label: "Track My Order", href: "/help/track-order" },
    { label: "Contact Us", href: "/help/contact" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Community", href: "/community" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Accessibility", href: "/legal/accessibility" },
  ],
};
