"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { brand } from "@/config/brand";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sign in.");
      router.replace(searchParams.get("next") || "/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-sm border border-brand-line bg-brand-surface p-8 shadow-sm"
      >
        <div className="mb-6 text-center">
          <span className="font-display text-xl font-bold">{brand.shortName}</span>
          <span className="ml-2 rounded-sm bg-brand-ink/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
            Admin
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-sm border border-brand-danger/30 bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
            {error}
          </div>
        )}

        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50">
          Username
        </label>
        <input
          className="mb-4 w-full rounded-sm border border-brand-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-primary"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          autoComplete="username"
        />

        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50">
          Password
        </label>
        <input
          type="password"
          className="mb-6 w-full rounded-sm border border-brand-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-primary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-dark disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
