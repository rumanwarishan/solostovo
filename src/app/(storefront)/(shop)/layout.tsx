import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { ValuePropBar } from "@/components/storefront/ValuePropBar";
import { CustomHtml } from "@/components/storefront/CustomHtml";
import { getSettings, getCustomCode } from "@/data/content";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [settings, customCode] = await Promise.all([getSettings(), getCustomCode()]);

  return (
    <>
      <AnnouncementBar />
      <Header siteTitle={settings.siteTitle} logoUrl={settings.logoUrl} />
      {customCode.header && <CustomHtml html={customCode.header} className="container-page py-2" />}
      <ValuePropBar />
      <main className="flex-1">
        {customCode.content && <CustomHtml html={customCode.content} className="container-page py-2" />}
        {children}
      </main>
    </>
  );
}
