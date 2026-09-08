import { getSettings } from "@/data/content";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  const dbConfigured = isDbConfigured();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-brand-ink/60">Site title, tagline, logo, favicon, and footer.</p>

      {!dbConfigured && (
        <p className="mt-3 rounded-sm border border-dashed border-brand-line bg-brand-surface p-3 text-xs text-brand-ink/60">
          Not connected to a database — showing the built-in defaults. Saving requires a database
          (see README).
        </p>
      )}

      <div className="mt-6">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
