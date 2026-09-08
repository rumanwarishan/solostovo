import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { brand } from "@/config/brand";
import { getSettings, getCustomCode } from "@/data/content";
import { RawCodeInjector } from "@/components/RawCodeInjector";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `${settings.siteTitle || brand.name} — Fire Pits, Pizza Ovens & Outdoor Gear`,
    description: settings.tagline || brand.tagline,
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const customCode = await getCustomCode();

  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {children}
        {/* "Header" custom code = the <head> (analytics, meta/verification
            tags); "Footer" custom code = just before </body> (chat widgets,
            tracking pixels) — mounted once here so both cover every route. */}
        <RawCodeInjector html={customCode.header} target="head" />
        <RawCodeInjector html={customCode.footer} target="body" />
      </body>
    </html>
  );
}
