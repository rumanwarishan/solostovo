"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/config/brand";

const icons: Record<string, React.ReactNode> = {
  dashboard: (
    <path d="M2.5 2.5h6v6h-6v-6Zm9 0h6v4h-6v-4Zm0 7h6v8.5h-6v-8.5Zm-9 3h6v5.5h-6v-5.5Z" strokeLinejoin="round" />
  ),
  orders: (
    <path
      d="M4 5.5h10l-1 8.5H5l-1-8.5Zm2.5 0V4a2.5 2.5 0 0 1 5 0v1.5"
      strokeLinejoin="round"
    />
  ),
  products: (
    <path d="M2.5 6 10 2.5 17.5 6 10 9.5 2.5 6Zm0 0v8L10 17.5m0-8v8m0-8L17.5 6v8L10 17.5" strokeLinejoin="round" />
  ),
  categories: (
    <path d="M3 3.5h6v6H3v-6Zm8 0h6v6h-6v-6Zm0 8h6v6h-6v-6Zm-8 0h6v6H3v-6Z" strokeLinejoin="round" />
  ),
  content: (
    <path
      d="M4 2.5h9l3.5 3.5V17.5H4V2.5Zm9 0v3.5h3.5M7 10h6M7 13h6M7 7h3"
      strokeLinejoin="round"
    />
  ),
};

const links = [
  { href: "/admin", label: "Dashboard", exact: true, icon: "dashboard" },
  { href: "/admin/orders", label: "Orders", icon: "orders" },
  { href: "/admin/products", label: "Products", icon: "products" },
  { href: "/admin/categories", label: "Categories", icon: "categories" },
  { href: "/admin/content", label: "Content", icon: "content" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-shrink-0 flex-col border-r border-white/10 bg-[#14150f] text-[#e7e6de]">
      <div className="border-b border-white/10 px-5 py-5">
        <span className="font-display text-lg font-bold">{brand.shortName}</span>
        <span className="ml-2 rounded-sm bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
          Admin
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {links.map((link) => {
          const active = "exact" in link && link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-sm px-3 py-2 text-sm ${
                active ? "bg-white/10 font-medium text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="flex-shrink-0">
                {icons[link.icon]}
              </svg>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-white/10 p-3">
        <Link href="/" className="block rounded-sm px-3 py-2 text-xs text-white/40 hover:text-white/70">
          ← Back to storefront
        </Link>
      </div>
    </aside>
  );
}
