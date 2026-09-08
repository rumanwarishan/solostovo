import Link from "next/link";
import { brand } from "@/config/brand";
import { footerNav } from "@/data/nav";
import { getSettings } from "@/data/content";
import { NewsletterForm } from "./NewsletterForm";

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-ink/60">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-brand-ink/80 hover:text-brand-primary">
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

  return (
    <footer className="border-t border-brand-line bg-brand-surface">
      <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-3 md:grid-cols-5">
        <div className="col-span-2 sm:col-span-3 md:col-span-1">
          <span className="font-display text-lg font-bold">{siteTitle}</span>
          <p className="mt-2 max-w-[22ch] text-sm text-brand-ink/60">{description}</p>
          <div className="mt-4 flex gap-3">
            {(["instagram", "youtube", "facebook", "tiktok"] as const).map((k) =>
              social[k] ? (
                <a
                  key={k}
                  href={social[k]}
                  aria-label={k}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-line text-xs uppercase text-brand-ink/60 hover:border-brand-primary hover:text-brand-primary"
                >
                  {k[0]}
                </a>
              ) : null
            )}
          </div>
        </div>
        <FooterColumn title="Shop" links={footerNav.shop} />
        <FooterColumn title="Help" links={footerNav.help} />
        <FooterColumn title="Company" links={footerNav.company} />
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-ink/60">
            Stay in touch
          </h3>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-brand-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-ink/50 sm:flex-row">
          <span>© {new Date().getFullYear()} {siteTitle}. All rights reserved.</span>
          <div className="flex gap-4">
            {footerNav.legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-brand-primary">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
