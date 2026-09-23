"use client";

import { useState } from "react";

export function NewsletterForm({
  source = "footer",
  onSuccess,
  inputClassName,
  buttonClassName,
}: {
  source?: string;
  onSuccess?: () => void;
  inputClassName?: string;
  buttonClassName?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe.");
      setStatus("done");
      onSuccess?.();
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Failed to subscribe.");
    }
  }

  if (status === "done") {
    return <p className="text-sm text-white/85">You&apos;re on the list — thanks for signing up.</p>;
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={
          inputClassName ??
          "rounded-sm border border-white/25 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/60"
        }
      />
      {error && <p className="text-xs text-red-300">{error}</p>}
      <button
        disabled={status === "loading"}
        className={
          buttonClassName ??
          "rounded-sm bg-white px-3 py-2 text-sm font-medium text-brand-ink hover:bg-white/90 disabled:opacity-50"
        }
      >
        {status === "loading" ? "Signing up…" : "Sign up"}
      </button>
    </form>
  );
}
