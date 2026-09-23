import { getAllSubscribers } from "@/data/newsletter";
import { isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const dbReady = isDbConfigured();
  const subscribers = dbReady ? await getAllSubscribers() : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Newsletter</h1>
      <p className="mt-1 text-sm text-brand-ink/60">
        Signups from the footer form and the location popup ({subscribers.length} total).
      </p>

      {!dbReady && (
        <p className="mt-3 rounded-sm border border-dashed border-brand-line bg-brand-surface p-3 text-xs text-brand-ink/60">
          Not connected to a database — newsletter signups require one (see README).
        </p>
      )}

      {dbReady && subscribers.length === 0 && (
        <p className="mt-6 text-sm text-brand-ink/60">No signups yet.</p>
      )}

      {subscribers.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-sm border border-brand-line">
          <table className="w-full text-sm">
            <thead className="bg-brand-surface text-left text-xs uppercase tracking-wide text-brand-ink/50">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Signed up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {subscribers.map((s) => (
                <tr key={s.email}>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3 capitalize text-brand-ink/60">{s.source.replace("-", " ")}</td>
                  <td className="px-4 py-3 text-brand-ink/60">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
