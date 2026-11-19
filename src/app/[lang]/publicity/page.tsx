"use client";

import { PublicityTabs } from "@/components/PublicityTabs";
import { WithLang } from "@/components/WithLang";

// Public relations hub: three tabs (news and events, announcements, passers by year). The active tab is kept in the URL hash.
// (/news and /announcement stay as the standalone lists.)
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content, publicity, news, announcements }) => {
        const c = content[lang];
        const t = c.pages.publicity;
        const newsAll = [...news].sort((a, b) => b.date.localeCompare(a.date));
        const annAll = [...announcements].sort((a, b) => b.year - a.year || b.id - a.id);
        const passerTotal = publicity.reduce((n, y) => n + y.people.length, 0);
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-block-dark text-on-dark">
              {/* TODO: this hero photo shows real people; replace with a photo without people, or get written permission first (CLAUDE.md) */}
              <img src="/img/does/activity-award.jpg" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-scrim" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <h1 className="max-w-3xl text-5xl leading-[1.2] md:text-7xl md:leading-[1.15]">{c.nav.publicity}</h1>
                <p className="mt-6 max-w-xl text-lg text-on-dark/80">{t.hubIntro}</p>
              </div>
            </section>

            <PublicityTabs lang={lang} news={newsAll} announcements={annAll} passers={publicity} passerTotal={passerTotal} />
          </main>
        );
      }}
    </WithLang>
  );
}
