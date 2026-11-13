"use client";

import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";

// Dark band like the documentary sections; contact details moved here from the old top bar.
export function SiteFooter({ lang }: { lang: Lang }) {
  const { content } = useSite();
  const t = content[lang];
  return (
    <footer className="bg-forest text-page">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-6">
          <span className="inline-block rounded-xl bg-card p-3">
            <img src="/brand/logo-up.png" alt={t.siteOrg} width={188} height={40} className="h-10 w-auto" />
          </span>
          <p className="mt-6 font-serif text-2xl font-light">{t.siteName}</p>
          <p className="mt-1 font-mono text-xs tracking-[0.05em] text-page/60">{t.siteOrg}</p>
        </div>
        <ul className="space-y-1 text-sm text-page/80 md:col-span-6">
          <li>{t.contact.address}</li>
          <li>
            <a href={`mailto:${t.contact.email}`} className="underline decoration-page/30 underline-offset-4 hover:decoration-page">
              {t.contact.email}
            </a>
          </li>
          <li>
            <a href={`tel:${t.contact.phone.replace(/\s/g, "")}`} className="tabular-nums hover:underline">
              {t.contact.phone}
            </a>
          </li>
        </ul>
        <p className="border-t border-page/15 pt-6 text-sm text-page/60 md:col-span-12">{t.footer}</p>
      </div>
    </footer>
  );
}
