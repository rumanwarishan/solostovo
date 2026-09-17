import { getMarketingContent } from "@/data/content";
import { MarketingForm } from "@/components/admin/MarketingForm";
import { isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminMarketingPage() {
  const marketing = await getMarketingContent();
  const dbConfigured = isDbConfigured();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Marketing</h1>
      <p className="mt-1 text-sm text-brand-ink/60">
        Connect your Google and Meta ad accounts to your site — no code required.
      </p>

      {!dbConfigured && (
        <p className="mt-3 rounded-sm border border-dashed border-brand-line bg-brand-surface p-3 text-xs text-brand-ink/60">
          Not connected to a database — saving requires a database (see README).
        </p>
      )}

      <div className="mt-6">
        <MarketingForm initial={marketing} />
      </div>
    </div>
  );
}
