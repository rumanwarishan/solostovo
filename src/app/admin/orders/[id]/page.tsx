import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder, orderItemsWithProducts } from "@/data/orders";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const items = await orderItemsWithProducts(order);

  return (
    <div>
      <Link href="/admin/orders" className="text-xs text-brand-ink/50 hover:text-brand-primary">
        ← Back to orders
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{order.id}</h1>
        <OrderStatusForm orderId={order.id} status={order.status} />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-ink/50">Items</h2>
          <div className="mt-3 overflow-hidden rounded-sm border border-brand-line bg-brand-surface">
            <table className="w-full text-sm">
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-brand-line last:border-0">
                    <td className="px-4 py-3">
                      {item.product ? (
                        <Link href={`/admin/products/${item.product.id}`} className="font-medium hover:text-brand-primary">
                          {item.name}
                        </Link>
                      ) : (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </td>
                    <td className="tabular px-4 py-3 text-brand-ink/60">× {item.quantity}</td>
                    <td className="tabular px-4 py-3 text-right font-medium">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right text-xs uppercase tracking-wide text-brand-ink/50">
                    Total
                  </td>
                  <td className="tabular px-4 py-3 text-right font-bold">${order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-ink/50">Customer</h2>
          <div className="mt-3 rounded-sm border border-brand-line bg-brand-surface p-4 text-sm">
            <div className="font-medium">{order.customerName}</div>
            <div className="text-brand-ink/60">{order.customerEmail}</div>
            <div className="mt-3 text-xs text-brand-ink/50">
              Placed {new Date(order.createdAt).toLocaleString()}
            </div>
            <div className="mt-1 text-xs uppercase text-brand-ink/40">Source: {order.source}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
