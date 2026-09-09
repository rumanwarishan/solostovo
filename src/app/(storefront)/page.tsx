import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Hero } from "@/components/storefront/Hero";
import { ValuePropBar } from "@/components/storefront/ValuePropBar";
import { CategoryTiles } from "@/components/storefront/CategoryTiles";
import { BestSellers } from "@/components/storefront/BestSellers";
import { TrustStrip } from "@/components/storefront/TrustStrip";
import { ReviewsTeaser } from "@/components/storefront/ReviewsTeaser";
import { CommunityTeaser } from "@/components/storefront/CommunityTeaser";
import { CustomHtml } from "@/components/storefront/CustomHtml";
import { getSettings, getCustomCode } from "@/data/content";
import { getCategories } from "@/data/categories";

// Homepage content (hero slides, categories, best sellers) is DB-backed
// and editable from /admin, so it must reflect edits without a rebuild.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, customCode, categories] = await Promise.all([
    getSettings(),
    getCustomCode(),
    getCategories(),
  ]);

  return (
    <>
      {/* Composed here (not in a shared layout) so Header sits directly
          before Hero with nothing solid between them — that's what lets
          Hero slide up underneath it for the transparent-over-hero look.
          ValuePropBar moves to right after Hero instead of its usual spot
          directly under the header, only on this page. */}
      {settings.sections.announcement && <AnnouncementBar />}
      {settings.showHeader && (
        <Header
          siteTitle={settings.siteTitle}
          logoUrl={settings.logoUrl}
          categories={categories}
          enableTransparent={settings.sections.hero}
        />
      )}
      <main className="flex-1">
        {settings.sections.hero && <Hero overlapHeader={settings.showHeader} />}
        {settings.sections.valueProps && <ValuePropBar />}
        {customCode.sections.map((s) => (
          <CustomHtml key={s.id} html={s.html} className="container-page py-2" />
        ))}
        {settings.sections.bestSellers && <BestSellers />}
        {settings.sections.categories && <CategoryTiles />}
        {settings.sections.trust && <TrustStrip />}
        {settings.sections.reviews && <ReviewsTeaser />}
        {settings.sections.community && <CommunityTeaser />}
      </main>
    </>
  );
}
