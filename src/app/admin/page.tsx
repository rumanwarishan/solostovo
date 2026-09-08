import Link from "next/link";
import { getAllOrders } from "@/data/orders";
import { getProducts } from "@/data/products";
import { StatCard } from "@/components/admin/StatCard";
import { StatusPill } from "@/components/admin/StatusPill";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [orders, products] = await Promise.all([getAllOrders(), getProducts()]);
  const revenue = orders
    .filter((o) => o.status !== "refunded")
    .reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 50).sort((a, b) => a.stock - b.stock);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Revenue" value={`$${revenue.toLocaleString()}`} sub="all-time, excl. refunds" />
        <StatCard label="Orders" value={orders.length.toString()} />
        <StatCard label="Products" value={products.length.toString()} />
        <StatCard label="Low stock" value={lowStock.length.toString()} sub="≤ 50 units" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs font-medium text-brand-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 overflow-hidden rounded-sm border border-brand-line bg-brand-surface">
            <table className="w-full text-sm">
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="border-b border-brand-line last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-brand-primary">
                        {o.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-brand-ink/70">{o.customerName}</td>
                    <td className="tabular px-4 py-3 text-right font-medium">${o.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <StatusPill status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">Low stock</h2>
          <div className="mt-3 overflow-hidden rounded-sm border border-brand-line bg-brand-surface">
            <ul className="divide-y divide-brand-line">
              {lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <Link href={`/admin/products/${p.id}`} className="hover:text-brand-primary">
                    {p.name}
                  </Link>
                  <span className="tabular text-brand-ink/60">{p.stock} left</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
