import type { OrderStatus } from "@/data/orders";

const styles: Record<OrderStatus, string> = {
  pending_payment: "bg-[#f3e3cf] text-[#8a621a]",
  paid: "bg-brand-primary-soft text-brand-primary-dark",
  processing: "bg-[#f0e3c6] text-[#8a621a]",
  shipped: "bg-[#dce8db] text-[#2f5a37]",
  refunded: "bg-[#efd8d3] text-[#8a3730]",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${styles[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}
