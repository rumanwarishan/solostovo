"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderStatus } from "@/data/orders";

const STATUSES: OrderStatus[] = ["paid", "processing", "shipped", "refunded"];

export function OrderStatusForm({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(next: OrderStatus) {
    setValue(next);
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status.");
      setValue(status);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        value={value}
        disabled={saving}
        onChange={(e) => save(e.target.value as OrderStatus)}
        className="rounded-sm border border-brand-line bg-brand-surface px-2 py-1.5 text-xs capitalize disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error && <span className="text-[11px] text-brand-danger">{error}</span>}
    </div>
  );
}
