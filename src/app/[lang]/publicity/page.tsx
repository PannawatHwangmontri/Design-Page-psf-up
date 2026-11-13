"use client";

import { YearTabs } from "@/components/YearTabs";
import { Placeholder } from "@/components/Placeholder";
import { WithLang } from "@/components/WithLang";

const linkCls = "font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink";

// Public relations hub: every news item, every announcement and the passers by year, all on this page.
// (/news and /announcement stay as the standalone lists.)
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content, publicity, news, announcements }) => {
        const c = content[lang];
        const t = c.pages.publicity;
        const total = publicity.reduce((n, y) => n + y.people.length, 0);
        const loc = lang === "th" ? "th-TH" : "en-GB";
        const fullDate = (d: string) => new Date(d).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
        const newsAll = [...news].sort((a, b) => b.date.localeCompare(a.date));
        const annAll = [...announcements].sort((a, b) => b.year - a.year || b.id - a.id);
        const latestYear = annAll[0]?.year;
        // anchors in the hero: where each block is and how many items it holds
        const jump = [
          { id: "news", label: c.news.title, n: newsAll.length },
          { id: "announcements", label: t.announcementsTitle, n: annAll.length },
          { id: "passers", label: t.title, n: total },
        ];
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-forest text-page">
              <img src="/img/does/activity-award.jpg" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/65" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <h1 className="max-w-3xl text-5xl leading-[1.2] md:text-7xl md:leading-[1.15]">{c.nav.publicity}</h1>
                <p className="mt-6 max-w-xl text-lg text-page/80">{t.hubIntro}</p>
                <ul className="mt-10 grid divide-y divide-page/25 border-t border-page/25 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {jump.map((j) => (
                    <li key={j.id}>
                      <a href={`#${j.id}`} className="group block px-0 py-5 sm:px-6 sm:first:pl-0">
                        <span className="font-serif text-4xl font-light tabular-nums md:text-5xl">{j.n}</span>
                        <span className="mt-1 block text-sm text-page/80 group-hover:underline">{j.label} ↓</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="news" className="scroll-mt-28">
              <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
                <div className="flex items-end justify-between gap-4 border-b border-ink/10 pb-6">
                  <h2 className="text-3xl md:text-5xl">{c.news.title}</h2>
                  <p className="font-mono text-xs tabular-nums tracking-[0.05em] text-ink-3">{newsAll.length}</p>
                </div>
                <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {newsAll.map((n) => (
                    <li key={n.id}>
                      <a href={`/${lang}/news/${n.id}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-card">
                        {n.image ? <img src={n.image} alt={c.news.imageAlt} className="aspect-[16/10] w-full object-cover" /> : <Placeholder label={c.news.imageAlt} className="aspect-[16/10]" />}
                        <div className="flex flex-1 flex-col p-6">
                          <time dateTime={n.date} className="font-mono text-xs tabular-nums tracking-[0.05em] text-ink-3">
                            {fullDate(n.date)}
                          </time>
                          <h3 className="mt-3 font-serif text-xl font-light leading-snug group-hover:text-accent-ink">{n.title[lang]}</h3>
                          <p className="mt-2 line-clamp-3 text-sm text-ink-2">{n.excerpt[lang]}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="announcements" className="scroll-mt-28 border-t border-ink/10 bg-card">
              <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
                <div className="md:col-span-4">
                  <h2 className="text-3xl md:text-5xl">{t.announcementsTitle}</h2>
                  <p className="mt-3 font-mono text-xs tabular-nums tracking-[0.05em] text-ink-3">{annAll.length}</p>
                </div>
                <ul className="divide-y divide-ink/10 border-y border-ink/10 md:col-span-8">
                  {annAll.map((a) => (
                    <li key={a.id} className="flex gap-6 py-5">
                      <span className="w-24 shrink-0 pt-0.5 text-sm tabular-nums text-ink-3">
                        {lang === "th" ? `พ.ศ. ${a.year}` : `B.E. ${a.year}`}
                        {a.year === latestYear && <span className="mt-2 block text-accent-ink">{c.news.isNew}</span>}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium">
                          <a href={`/${lang}/announcement/${a.id}`} className="hover:text-accent-ink">
                            {a.title[lang]}
                          </a>
                        </p>
                        <a href={`/${lang}/announcement/${a.id}`} className={`${linkCls} mt-2 inline-block text-sm`}>
                          {c.news.readMore}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="passers" className="scroll-mt-28 border-t border-ink/10">
              <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
                <h2 className="text-3xl md:text-5xl">{t.title}</h2>
                <p className="mt-4 max-w-2xl text-lg text-ink-2">{t.intro}</p>
                <div className="mt-12">
                  <YearTabs lang={lang} data={publicity} />
                </div>
              </div>
            </section>
          </main>
        );
      }}
    </WithLang>
  );
}
