import Link from "next/link";
import { brand } from "@/config/brand";
import { footerNav } from "@/data/nav";
import { getSettings } from "@/data/content";
import { NewsletterForm } from "./NewsletterForm";

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-[15px] font-bold">{title}</h3>
      <ul className="flex flex-col gap-[9px]">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-white underline decoration-white/40 underline-offset-2 hover:opacity-75"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const settings = await getSettings();
  const siteTitle = settings.siteTitle || brand.shortName;
  const description = settings.footerDescription || brand.tagline;
  const social = settings.social;
  const socialLinks = (["instagram", "youtube", "facebook", "tiktok"] as const).filter((k) => social[k]);

  return (
    <>
      <footer className="relative mx-3 mt-16 overflow-hidden rounded-t-[20px] text-white sm:mx-5">
        {settings.footerBackgroundUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.footerBackgroundUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Two stacked washes so a bright photo still reads as a moody, text-friendly backdrop. */}
            <div className="absolute inset-0 bg-[rgba(5,10,15,0.78)]" />
            <div className="absolute inset-0 bg-black/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-brand-ink" />
        )}

        <div className="relative grid grid-cols-1 gap-x-10 gap-y-12 px-6 py-14 sm:grid-cols-3 lg:grid-cols-6 lg:px-9">
          <div className="sm:col-span-3 lg:col-span-2">
            <span className="font-display text-lg font-bold">{siteTitle}</span>
            <p className="mt-2 max-w-[32ch] text-sm text-white/80">{description}</p>
            {socialLinks.length > 0 && (
              <div className="mt-4 flex gap-3">
                {socialLinks.map((k) => (
                  <a
                    key={k}
                    href={social[k]}
                    aria-label={k}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-xs uppercase text-white/80 hover:border-white hover:text-white"
                  >
                    {k[0]}
                  </a>
                ))}
              </div>
            )}
            <div className="mt-6 max-w-[280px]">
              <h3 className="mb-3 text-[15px] font-bold">Stay in touch</h3>
              <NewsletterForm />
            </div>
          </div>
          <FooterColumn title="Shop" links={footerNav.shop} />
          <FooterColumn title="Help" links={footerNav.help} />
          <FooterColumn title="Company" links={footerNav.company} />
          <div>
            <FooterColumn title="Legal" links={footerNav.legal} />
            <p className="mt-4 text-sm font-semibold text-white/90">
              © {new Date().getFullYear()} {siteTitle}
            </p>
          </div>
        </div>

        <div className="relative border-t border-white/15 py-4">
          <p className="text-center text-[11px] text-white/70">
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
        </div>
      </footer>

      <Link
        href="/legal/accessibility"
        aria-label="Accessibility statement"
        className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-brand-ink shadow-lg hover:bg-brand-paper"
      >
        ♿
      </Link>
      <button
        type="button"
        title="Live chat coming soon"
        className="fixed bottom-4 right-4 z-40 flex h-[62px] w-[62px] cursor-default items-center justify-center rounded-full border-[6px] border-brand-accent bg-white shadow-lg"
      >
        <span className="text-lg" aria-hidden>
          💬
        </span>
        <span className="sr-only">Live chat — coming soon</span>
      </button>
    </>
  );
}
