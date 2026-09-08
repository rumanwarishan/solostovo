import Link from "next/link";
import { getAllOrders } from "@/data/orders";
import { StatusPill } from "@/components/admin/StatusPill";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <span className="text-sm text-brand-ink/50">{orders.length} total</span>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-brand-line bg-brand-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-brand-line text-left text-xs uppercase tracking-wide text-brand-ink/50">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Status</th>
              <th className="px-4 py-3 text-right">Source</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-brand-line last:border-0 hover:bg-brand-paper/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-brand-primary">
                    {o.id}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div>{o.customerName}</div>
                  <div className="text-xs text-brand-ink/50">{o.customerEmail}</div>
                </td>
                <td className="px-4 py-3 text-brand-ink/70">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="tabular px-4 py-3 text-brand-ink/70">{o.items.length}</td>
                <td className="tabular px-4 py-3 text-right font-medium">${o.total.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <StatusPill status={o.status} />
                </td>
                <td className="px-4 py-3 text-right text-xs uppercase text-brand-ink/40">{o.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
