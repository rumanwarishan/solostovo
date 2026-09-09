"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The login screen isn't part of the authenticated admin shell.
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-brand-paper">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-brand-paper">
      <Sidebar />
      <div className="flex-1 overflow-x-auto p-8">{children}</div>
    </div>
  );
}
