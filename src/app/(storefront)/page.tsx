import { Fragment } from "react";
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
import { getSettings, getCustomCode, type SectionKey } from "@/data/content";
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

  // The transparent-over-hero header effect relies on Hero sliding up
  // directly underneath Header (see HeroSlider's -mt-16) — so it only
  // applies while Hero is still first in the (admin-reorderable) section
  // order. Drag it elsewhere and it just renders as a normal solid banner.
  const heroIsFirst = settings.sectionOrder[0] === "hero";
  const overlapHeader = settings.showHeader && heroIsFirst;

  function renderSection(key: SectionKey) {
    switch (key) {
      case "hero":
        return settings.sections.hero && <Hero key={key} overlapHeader={overlapHeader} />;
      case "valueProps":
        return settings.sections.valueProps && <ValuePropBar key={key} />;
      case "customHtml":
        return customCode.sections.map((s) => (
          <CustomHtml key={s.id} html={s.html} className="container-page py-2" />
        ));
      case "categories":
        return settings.sections.categories && <CategoryTiles key={key} />;
      case "bestSellers":
        return settings.sections.bestSellers && <BestSellers key={key} />;
      case "trust":
        return settings.sections.trust && <TrustStrip key={key} />;
      case "reviews":
        return settings.sections.reviews && <ReviewsTeaser key={key} />;
      case "community":
        return settings.sections.community && <CommunityTeaser key={key} />;
    }
  }

  return (
    <>
      {/* Composed here (not in a shared layout) so Header sits directly
          before Hero with nothing solid between them — that's what lets
          Hero slide up underneath it for the transparent-over-hero look,
          only while Hero is first in the section order. */}
      {settings.sections.announcement && <AnnouncementBar />}
      {settings.showHeader && (
        <Header
          siteTitle={settings.siteTitle}
          logoUrl={settings.logoUrl}
          categories={categories}
          enableTransparent={heroIsFirst && settings.sections.hero}
        />
      )}
      <main className="flex-1">
        {settings.sectionOrder.map((key) => (
          <Fragment key={key}>{renderSection(key)}</Fragment>
        ))}
      </main>
    </>
  );
}
