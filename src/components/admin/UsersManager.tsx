"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminUser } from "@/data/admin-users";

const inputClass =
  "w-full rounded-sm border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-primary";
const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-brand-ink/50";

export function UsersManager({ initialUsers, currentUserId }: { initialUsers: AdminUser[]; currentUserId: string | null }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add user.");
      setUsers((u) => [...u, data.user]);
      setUsername("");
      setPassword("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    if (!window.confirm("Remove this admin account? They'll be signed out immediately.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove user.");
      setUsers((u) => u.filter((user) => user.id !== id));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove user.");
    }
  }

  return (
    <div className="max-w-2xl">
      {error && (
        <div className="mb-4 rounded-sm border border-brand-danger/30 bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {error}
        </div>
      )}

      <section className="mb-10">
        <h2 className="font-display text-lg font-bold">Admin accounts</h2>
        <div className="mt-4 divide-y divide-brand-line rounded-sm border border-brand-line bg-brand-surface">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">
                  {user.username}
                  {user.id === currentUserId && (
                    <span className="ml-2 rounded-sm bg-brand-primary-soft px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-brand-primary-dark">
                      You
                    </span>
                  )}
                </p>
                {user.createdAt && (
                  <p className="text-xs text-brand-ink/50">
                    Added {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(user.id)}
                disabled={user.id === currentUserId || users.length <= 1}
                title={
                  user.id === currentUserId
                    ? "You can't remove the account you're logged in as."
                    : users.length <= 1
                      ? "You can't remove the last admin account."
                      : undefined
                }
                className="text-xs text-brand-ink/40 hover:text-brand-danger disabled:cursor-not-allowed disabled:opacity-40"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold">Add an admin</h2>
        <p className="mt-1 text-xs text-brand-ink/60">
          They&apos;ll sign in at /admin/login with these credentials — no email required.
        </p>
        <form onSubmit={handleAdd} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Username</label>
            <input className={inputClass} value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="self-start rounded-sm bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-dark disabled:opacity-50 sm:col-span-2"
          >
            {saving ? "Adding…" : "Add admin"}
          </button>
        </form>
      </section>
    </div>
  );
}
