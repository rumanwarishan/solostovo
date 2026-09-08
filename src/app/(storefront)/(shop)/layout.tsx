import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { ValuePropBar } from "@/components/storefront/ValuePropBar";
import { CustomHtml } from "@/components/storefront/CustomHtml";
import { getSettings, getCustomCode } from "@/data/content";
import { getCategories } from "@/data/categories";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [settings, customCode, categories] = await Promise.all([
    getSettings(),
    getCustomCode(),
    getCategories(),
  ]);

  return (
    <>
      {settings.showHeader && (
        <>
          <AnnouncementBar />
          <Header siteTitle={settings.siteTitle} logoUrl={settings.logoUrl} categories={categories} />
          <ValuePropBar />
        </>
      )}
      <main className="flex-1">
        {customCode.content && <CustomHtml html={customCode.content} className="container-page py-2" />}
        {children}
      </main>
    </>
  );
}
