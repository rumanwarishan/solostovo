import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { ValuePropBar } from "@/components/storefront/ValuePropBar";
import { getSettings } from "@/data/content";
import { getCategories } from "@/data/categories";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);

  return (
    <>
      {settings.sections.announcement && <AnnouncementBar />}
      {settings.showHeader && (
        <Header
          siteTitle={settings.siteTitle}
          logoUrl={settings.logoUrl}
          categories={categories}
          enableTransparent={settings.sections.hero}
        />
      )}
      {settings.sections.valueProps && <ValuePropBar />}
      <main className="flex-1">{children}</main>
    </>
  );
}
