"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ManualMethodKey, ManualPaymentMethod } from "@/data/payment-settings";

const textareaClass =
  "w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-primary";

function MethodRow({
  method,
  title,
  description,
  placeholder,
  initial,
}: {
  method: ManualMethodKey;
  title: string;
  description: string;
  placeholder: string;
  initial: ManualPaymentMethod;
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initial.enabled);
  const [instructions, setInstructions] = useState(initial.instructions);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save(nextEnabled: boolean, nextInstructions: string) {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/payments/manual", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, enabled: nextEnabled, instructions: nextInstructions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-sm border border-brand-line bg-brand-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <p className="mt-1 text-sm text-brand-ink/60">{description}</p>
        </div>
        <label className="flex flex-shrink-0 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {
              setEnabled(e.target.checked);
              save(e.target.checked, instructions);
            }}
          />
          Enabled
        </label>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50">
          Instructions shown to the customer at checkout
        </label>
        <textarea
          rows={4}
          className={textareaClass}
          placeholder={placeholder}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>

      {error && <p className="mt-2 text-sm text-brand-danger">{error}</p>}
      {saved && <p className="mt-2 text-sm text-brand-primary-dark">Saved.</p>}

      <button
        type="button"
        onClick={() => save(enabled, instructions)}
        disabled={saving}
        className="mt-3 rounded-sm border border-brand-line px-4 py-1.5 text-sm font-medium hover:border-brand-primary disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

export function ManualPaymentsForm({
  bankTransfer,
  cashOnDelivery,
}: {
  bankTransfer: ManualPaymentMethod;
  cashOnDelivery: ManualPaymentMethod;
}) {
  return (
    <div className="flex flex-col gap-4">
      <MethodRow
        method="bank_transfer"
        title="Bank transfer"
        description="Customer places the order, then wires payment manually — you confirm and mark it paid once it arrives."
        placeholder={"Account name: …\nAccount number: …\nRouting/SWIFT: …\nPlease include your order number as the payment reference."}
        initial={bankTransfer}
      />
      <MethodRow
        method="cash_on_delivery"
        title="Cash on delivery"
        description="Customer pays in cash when the order is delivered."
        placeholder="Pay the courier in cash when your order arrives. Please have the exact amount ready."
        initial={cashOnDelivery}
      />
    </div>
  );
}
