import {
  getHeroContent,
  getAnnouncements,
  getValueProps,
  getTrustContent,
  getCommunityContent,
} from "@/data/content";
import { ContentForm } from "@/components/admin/ContentForm";
import { isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [hero, announcements, valueProps, trust, community] = await Promise.all([
    getHeroContent(),
    getAnnouncements(),
    getValueProps(),
    getTrustContent(),
    getCommunityContent(),
  ]);
  const dbConfigured = isDbConfigured();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Content</h1>
      <p className="mt-1 text-sm text-brand-ink/60">Edit the homepage sections below.</p>

      {!dbConfigured && (
        <p className="mt-3 rounded-sm border border-dashed border-brand-line bg-brand-surface p-3 text-xs text-brand-ink/60">
          Not connected to a database — showing the built-in defaults. Saving requires a database
          (see README).
        </p>
      )}

      <div className="mt-6">
        <ContentForm
          initialHero={hero}
          initialAnnouncements={announcements}
          initialValueProps={valueProps}
          initialTrust={trust}
          initialCommunity={community}
        />
      </div>
    </div>
  );
}
