import { cookies } from "next/headers";
import { listAdminUsers, getSessionUser } from "@/data/admin-users";
import { UsersManager } from "@/components/admin/UsersManager";
import { isDbConfigured } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const dbConfigured = isDbConfigured();

  if (!dbConfigured) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold">Admin accounts</h1>
        <p className="mt-3 rounded-sm border border-dashed border-brand-line bg-brand-surface p-3 text-sm text-brand-ink/60">
          Multiple admin accounts require a database. Without one, access is gated by the single
          ADMIN_USER/ADMIN_PASSWORD pair in your environment variables (see README).
        </p>
      </div>
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const [users, currentUser] = await Promise.all([
    listAdminUsers(),
    token ? getSessionUser(token) : Promise.resolve(null),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Admin accounts</h1>
      <p className="mt-1 text-sm text-brand-ink/60">Add or remove people who can access this admin panel.</p>
      <div className="mt-6">
        <UsersManager initialUsers={users} currentUserId={currentUser?.id ?? null} />
      </div>
    </div>
  );
}
