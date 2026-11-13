"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import { PasserTile } from "./PasserCard";
import { Placeholder } from "./Placeholder";
import { TextEffect } from "./TextEffect";
import { ripple } from "./ripple";

const PAGE = 4; // announcements shown on the home page (the rest are on /announcement)
// stagger index for [data-stagger] children (see .stagger in globals.css)
const idx = (i: number) => ({ "--i": i }) as React.CSSProperties;

const hairline = "border border-ink/10";
const linkCls = "font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink";

// vertical section marker on the left page edge (wide screens only, see .side-label)
const Side = ({ children }: { children: React.ReactNode }) => <span aria-hidden="true" className="side-label">{children}</span>;

export default function PsfSite({ lang }: { lang: Lang }) {
  const { content, announcements, news, passers, assessmentCalendars } = useSite();
  const passedTotal = passers.length;
  const t = content[lang];
  const [lvl, setLvl] = useState(0); // passers filter: 0 = all, 1-3 = PSF level
  const latestYear = Math.max(...announcements.map((a) => a.year));
  const cal = [...assessmentCalendars].sort((a, b) => b.year - a.year)[0];
  const loc = lang === "th" ? "th-TH" : "en-GB";
  const day = (d: string) => new Date(d).toLocaleDateString(loc, { day: "numeric", month: "short" });
  const fullDate = (d: string) => new Date(d).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
  const range = (e?: { start: string; end?: string }) => (!e ? "–" : e.end ? `${day(e.start)} – ${day(e.end)}` : day(e.start));
  const [lead, ...rest] = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const pic = (src: string | undefined, alt: string, cls: string) =>
    src ? <img src={src} alt={alt} className={`${cls} object-cover`} /> : <Placeholder label={alt} className={cls} />;

  // play each [data-stagger] / [data-lines] group once, when it scrolls into view
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).dataset.in = "";
          io.unobserve(e.target);
        }),
      { threshold: 0.1 },
    );
    document.querySelectorAll("[data-stagger],[data-lines]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main>
      {/* hero: full-viewport documentary photo under a dark scrim, centered serif headline, one pill CTA */}
      <section id="home" className="relative isolate flex h-svh max-h-[960px] min-h-[600px] flex-col justify-center overflow-hidden bg-forest text-page">
        <img src="/img/does/campus-statue.webp" alt={t.hero.photoAlt} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/55" />
        <div className="mx-auto max-w-4xl px-4 pb-32 pt-36 text-center md:px-8">
          <p className="rise font-mono text-xs tracking-[0.05em] text-page/70">{t.hero.eyebrow}</p>
          <TextEffect as="h1" text={t.hero.title} delay={200} step={40} className="mt-6 block text-5xl leading-[1.25] md:text-7xl md:leading-[1.2]" />
          <TextEffect as="p" text={t.hero.desc} delay={200 + [...t.hero.title].length * 40 + 200} step={12} className="mx-auto mt-8 block max-w-xl text-lg leading-8 text-page/80" />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <a href={`/${lang}/publicity`} onClick={ripple} className="relative inline-flex items-center overflow-hidden rounded-full bg-accent px-6 py-2.5 font-medium text-white hover:bg-accent-hover">
              {t.hero.cta}
            </a>
            <a href="#announcements" className="text-page underline decoration-page/40 underline-offset-4 hover:decoration-page">
              {t.hero.cta2}
            </a>
          </div>
        </div>
        {announcements[0] && (
          <div className="absolute inset-x-0 bottom-0 border-t border-page/20">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 md:flex-row md:items-center md:gap-6 md:px-8">
              <span className="shrink-0 font-mono text-xs tracking-[0.05em] text-page/60">{t.hero.latest}</span>
              <a href={`/${lang}/announcement/${announcements[0].id}`} className="line-clamp-1 text-sm hover:underline">
                {announcements[0].title[lang]}
              </a>
            </div>
          </div>
        )}
      </section>

      {/* calendar: the real poster beside a table of the latest year's dates */}
      <section id="calendar" className="relative scroll-mt-16">
        <Side>{t.home.calendarTitle}</Side>
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-medium">{t.home.calendarTitle}</h2>
              <p className="mt-2 text-ink-2">{t.home.calendarLead}</p>
            </div>
            <a href={`/${lang}/assessment`} className={`${linkCls} shrink-0 text-sm`}>
              {t.home.calendarMore} →
            </a>
          </div>
          <div className="mt-10 grid items-start gap-10 md:grid-cols-12 md:gap-12">
            <a href={`/${lang}/calendar`} className="block md:col-span-5">
              <img src="/img/does/calendar-poster-2568.webp" alt={t.home.calendarPosterAlt} className={`aspect-[615/346] w-full rounded-xl ${hairline} object-cover`} />
            </a>
            {cal && (
              <div className="md:col-span-7">
                <p className="text-sm tabular-nums text-ink-3">
                  {t.home.yearLabel} {cal.year}
                </p>
                <table className="mt-3 w-full border-t border-ink/10 text-left">
                  <thead>
                    <tr className="text-sm text-ink-3">
                      <th scope="col" className="py-3 pr-4 font-normal">
                        {t.home.activity}
                      </th>
                      {[1, 2].map((r) => (
                        <th key={r} scope="col" className="py-3 pr-4 font-normal">
                          {t.pages.assessment.round} {r}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10 border-y border-ink/10">
                    {(["apply", "assess", "result"] as const).map((k) => (
                      <tr key={k}>
                        <th scope="row" className="py-4 pr-4 align-top font-medium">
                          {t.pages.assessment.types[k]}
                        </th>
                        {[1, 2].map((r) => (
                          <td key={r} className="py-4 pr-4 align-top tabular-nums text-ink-2">
                            {range(cal.events.find((e) => e.round === r && e.type === k))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* news: one lead story with a photo, the next three beside it */}
      <section id="news" className="relative scroll-mt-16 bg-card">
        <Side>{t.news.title}</Side>
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-medium">{t.news.title}</h2>
            <a href={`/${lang}/news`} className={`${linkCls} shrink-0 text-sm`}>
              {t.news.viewAll} →
            </a>
          </div>
          {lead && (
            <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-12">
              <article className="md:col-span-7">
                <a href={`/${lang}/news/${lead.id}`} className="group block">
                  {pic(lead.image, t.news.imageAlt, "aspect-[16/10] w-full rounded-xl")}
                  <time dateTime={lead.date} className="mt-4 block text-sm tabular-nums text-ink-3">
                    {fullDate(lead.date)}
                  </time>
                  <h3 className="mt-1 text-2xl font-medium group-hover:text-accent-ink">{lead.title[lang]}</h3>
                  <p className="mt-2 text-ink-2">{lead.excerpt[lang]}</p>
                </a>
              </article>
              <ul data-stagger className="divide-y divide-ink/10 border-y border-ink/10 md:col-span-5 md:self-start">
                {rest.slice(0, 3).map((n, i) => (
                  <li key={n.id} style={idx(i)}>
                    <a href={`/${lang}/news/${n.id}`} className="group flex gap-4 py-5">
                      {pic(n.image, t.news.imageAlt, "h-20 w-28 shrink-0 rounded-lg")}
                      <div className="min-w-0">
                        <time dateTime={n.date} className="text-sm tabular-nums text-ink-3">
                          {fullDate(n.date)}
                        </time>
                        <h3 className="mt-1 line-clamp-2 font-medium group-hover:text-accent-ink">{n.title[lang]}</h3>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* announcements: a plain register, year on the left like a gazette */}
      <section id="announcements" className="relative scroll-mt-16">
        <Side>{t.news.announcements}</Side>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
          <div className="md:col-span-4">
            <h2 className="text-3xl font-medium">{t.news.announcements}</h2>
            <a href={`/${lang}/announcement`} className={`${linkCls} mt-4 inline-block text-sm`}>
              {t.news.viewAll} →
            </a>
          </div>
          <ul data-lines className="divide-y divide-ink/10 border-y border-ink/10 md:col-span-8">
            {announcements.slice(0, PAGE).map((a, i) => (
              <li key={a.id} style={idx(i)} className="overflow-hidden">
                <div className="line flex gap-6 py-5">
                  <span className="w-24 shrink-0 pt-0.5 text-sm tabular-nums text-ink-3">
                    {lang === "th" ? `พ.ศ. ${a.year}` : `B.E. ${a.year}`}
                    {a.year === latestYear && <span className="mt-2 block text-accent-ink">{t.news.isNew}</span>}
                  </span>
                  <p className="min-w-0 line-clamp-2 font-medium" title={a.title[lang]}>
                    <a href={`/${lang}/announcement/${a.id}`} className="hover:text-accent-ink">
                      {a.title[lang]}
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* documentary band: one real number from the data over a photo */}
      <section aria-label={t.passers.total} className="relative isolate overflow-hidden bg-forest text-page">
        <img src="/img/does/activity-team.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/60" />
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-24 md:flex-row md:items-end md:justify-between md:px-8 md:py-32">
          <div>
            <p className="font-mono text-xs tracking-[0.05em] text-page/70">{t.passers.total}</p>
            <p className="mt-3 font-serif text-7xl font-light tabular-nums md:text-8xl">
              {passedTotal} <span className="text-3xl md:text-4xl">{t.passers.people}</span>
            </p>
          </div>
          <a href={`/${lang}/publicity`} className="text-page underline decoration-page/40 underline-offset-4 hover:decoration-page">
            {t.passers.title} →
          </a>
        </div>
      </section>

      {/* PSF: three levels as a ledger, then the four steps */}
      <section id="levels" className="relative scroll-mt-16 bg-card">
        <Side>{t.levels.title}</Side>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
          <div className="md:col-span-4">
            <h2 className="text-3xl font-medium">{t.levels.title}</h2>
            <p className="mt-3 text-ink-2">{t.levels.desc}</p>
          </div>
          <ol data-stagger className="divide-y divide-ink/10 border-y border-ink/10 md:col-span-8">
            {t.levels.items.map((l, n) => (
              <li key={l.name} style={idx(n)} className="grid grid-cols-[3rem_1fr] gap-4 py-6 md:grid-cols-[4rem_12rem_1fr]">
                <span aria-hidden="true" className="text-4xl tabular-nums text-ink/20">
                  {n + 1}
                </span>
                <h3 className="flex items-center gap-2 text-xl font-medium md:self-center">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: `var(--color-level-${n + 1})` }} />
                  {l.name}
                </h3>
                <p className="col-span-2 text-ink-2 md:col-span-1 md:self-center">{l.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="process" className="relative scroll-mt-16">
        <Side>{t.process.title}</Side>
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <h2 className="text-3xl font-medium">{t.process.title}</h2>
          <ol data-stagger className="mt-10 grid md:grid-cols-4">
            {t.process.tiles.map((tile, i) => (
              <li key={tile.href} style={idx(i)} className="group relative border-l border-ink/15 pb-10 pl-6 last:pb-0 md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pr-8 md:pt-6">
                <span aria-hidden="true" className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full border border-accent bg-card md:-top-[5px] md:left-0" />
                <span aria-hidden="true" className="block text-6xl font-normal tabular-nums text-accent-ink/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-xl font-medium">{tile.title}</h3>
                <p className="mt-2 text-sm text-ink-2">{tile.desc}</p>
                <a href={`/${lang}${tile.href}`} className={`${linkCls} mt-4 inline-block text-sm`}>
                  {tile.link}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="passers" className="relative scroll-mt-16 bg-card">
        <Side>{t.passers.title}</Side>
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-medium">{t.passers.title}</h2>
            <a href={`/${lang}/publicity`} className={`${linkCls} shrink-0 text-sm`}>
              {t.news.viewAll} →
            </a>
          </div>
          <p className="mt-2 text-ink-2">{t.passers.desc}</p>

          {/* level filter: underline tabs, each with its count taken from the data */}
          <div role="tablist" aria-label={t.passers.title} className="no-scrollbar -mx-4 mt-8 flex gap-6 overflow-x-auto border-b border-ink/10 px-4 md:mx-0 md:px-0">
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                role="tab"
                aria-selected={lvl === n}
                onClick={() => setLvl(n)}
                className={`-mb-px shrink-0 border-b-2 pb-3 text-sm transition-colors ${
                  lvl === n ? "border-accent font-medium text-accent-ink" : "border-transparent text-ink-2 hover:text-ink"
                }`}
              >
                {n === 0 ? t.passers.all : passers.find((p) => p.level.en === `Level ${n}`)?.level[lang]}{" "}
                <span className="tabular-nums text-ink-3">{n === 0 ? passers.length : passers.filter((p) => p.level.en === `Level ${n}`).length}</span>
              </button>
            ))}
          </div>

          {/* newest first, the first 4 of the selected level */}
          <ul data-stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {passers
              .filter((p) => lvl === 0 || p.level.en === `Level ${lvl}`)
              .sort((x, y) => Number(y.year.en) - Number(x.year.en) || x.id - y.id)
              .slice(0, 4)
              .map((p, i) => (
                <PasserTile key={p.id} p={p} lang={lang} style={idx(i)} />
              ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
