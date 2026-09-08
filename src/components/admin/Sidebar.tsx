"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/config/brand";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-shrink-0 flex-col border-r border-white/10 bg-[#14150f] text-[#e7e6de]">
      <div className="border-b border-white/10 px-5 py-5">
        <span className="font-display text-lg font-bold">{brand.shortName}</span>
        <span className="ml-2 rounded-sm bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
          Admin
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-sm px-3 py-2 text-sm ${
                active ? "bg-white/10 font-medium text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-3">
        <Link href="/" className="block rounded-sm px-3 py-2 text-xs text-white/40 hover:text-white/70">
          ← Back to storefront
        </Link>
      </div>
    </aside>
  );
}
