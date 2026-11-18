"use client";

import Link from "next/link";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";

// Dark footer band in three columns (brand + contact, related units, help) with a copyright line below.
export function SiteFooter({ lang }: { lang: Lang }) {
  const { content } = useSite();
  const t = content[lang];
  const help = [
    { label: t.nav.faq, href: `/${lang}/faq` },
    { label: t.nav.contact, href: `/${lang}/contact` },
    { label: t.nav.otherForms, href: `/${lang}/documents/forms` },
    { label: t.nav.calendar, href: `/${lang}/calendar` },
  ];
  const heading = "font-mono text-xs tracking-[0.08em] text-on-dark/60";
  const link = "text-sm text-on-dark/80 underline-offset-4 hover:text-on-dark hover:underline";

  return (
    <footer className="font-ui bg-block-dark text-on-dark">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <span className="inline-block rounded-xl bg-card p-3">
            <img src="/brand/logo-up.png" alt={t.siteOrg} width={188} height={40} className="h-10 w-auto" />
          </span>
          <p className="mt-6 font-ui font-semibold text-2xl font-light">{t.siteName}</p>
          <p className="mt-1 text-sm text-on-dark/60">{t.siteOrg}</p>
        </div>

        <div className="md:col-span-4">
          <p className={heading}>{t.footerContact}</p>
          <ul className="mt-4 space-y-3 text-sm text-on-dark/80">
            <li>{t.contact.address}</li>
            <li>
              <a href={`mailto:${t.contact.email}`} className="underline decoration-on-dark/30 underline-offset-4 hover:text-on-dark hover:decoration-on-dark">
                {t.contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${t.contact.phone.replace(/\s/g, "")}`} className="tabular-nums hover:text-on-dark hover:underline">
                {t.contact.phone}
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className={heading}>{t.footerRelated.title}</p>
          <ul className="mt-4 space-y-3">
            {t.footerRelated.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-on-dark/15">
        <nav aria-label={t.nav.help} className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-3 px-4 py-6 md:px-8">
          {help.map((l) => (
            <Link key={l.href} href={l.href} className={link}>
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="mx-auto max-w-6xl px-4 pb-10 text-xs leading-relaxed text-on-dark/60 md:px-8">{t.footer}</p>
      </div>
    </footer>
  );
}
