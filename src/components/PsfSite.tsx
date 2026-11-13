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
const linkCls = "font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink";

// Section head: eyebrow, heavy heading, optional link on the right, hairline across the full width below
function Head({ eyebrow, title, intro, action }: { eyebrow: string; title: string; intro?: string; action?: React.ReactNode }) {
  return (
    <div className="border-b border-ink/15 pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ink-2">{eyebrow}</p>
          <h2 className="mt-4 text-3xl leading-[1.3] md:text-5xl md:leading-[1.25]">{title}</h2>
        </div>
        {action}
      </div>
      {intro && <p className="mt-4 max-w-2xl text-lg text-ink-2">{intro}</p>}
    </div>
  );
}

export default function PsfSite({ lang }: { lang: Lang }) {
  const { content, announcements, news, passers, assessmentCalendars } = useSite();
  const t = content[lang];
  const [lvl, setLvl] = useState(0); // passers filter: 0 = all, 1-3 = PSF level
  const latestYear = Math.max(...announcements.map((a) => a.year));
  const cal = [...assessmentCalendars].sort((a, b) => b.year - a.year)[0];
  const loc = lang === "th" ? "th-TH" : "en-GB";
  const day = (d: string) => new Date(d).toLocaleDateString(loc, { day: "numeric", month: "short" });
  const fullDate = (d: string) => new Date(d).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
  const range = (e?: { start: string; end?: string }) => (!e ? "–" : e.end ? `${day(e.start)} – ${day(e.end)}` : day(e.start));
  const latestNews = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const all = (href: string) => (
    <a href={href} className={`${linkCls} shrink-0 text-sm`}>
      {t.news.viewAll} →
    </a>
  );

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
      {/* hero: desaturated photo under a dark scrim, left-aligned text, the single gradient button */}
      <section id="home" className="relative isolate flex min-h-[600px] flex-col justify-center overflow-hidden bg-forest text-white md:min-h-[720px]">
        <img src="/img/does/campus-statue.webp" alt={t.hero.photoAlt} className="absolute inset-0 -z-20 h-full w-full object-cover grayscale" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/60" />
        <div className="mx-auto w-full max-w-6xl px-4 pb-32 pt-20 md:px-8">
          <p className="eyebrow rise text-white/70">{t.hero.eyebrow}</p>
          <TextEffect as="h1" text={t.hero.title} delay={200} step={40} className="mt-5 block max-w-4xl text-5xl leading-[1.2] md:text-7xl md:leading-[1.15]" />
          <TextEffect as="p" text={t.hero.desc} delay={200 + [...t.hero.title].length * 40 + 200} step={12} className="mt-6 block max-w-xl text-lg leading-8 text-white/80" />
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a href={`/${lang}/publicity`} onClick={ripple} className="btn-gradient relative inline-flex items-center overflow-hidden rounded-lg px-10 py-2.5 text-sm">
              {t.hero.cta}
            </a>
            <a href="#announcements" className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
              {t.hero.cta2}
            </a>
          </div>
        </div>
        {announcements[0] && (
          <div className="absolute inset-x-0 bottom-0 border-t border-white/20">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 md:flex-row md:items-center md:gap-6 md:px-8">
              <span className="eyebrow shrink-0 text-white/60">{t.hero.latest}</span>
              <a href={`/${lang}/announcement/${announcements[0].id}`} className="line-clamp-1 text-sm font-medium hover:underline">
                {announcements[0].title[lang]}
              </a>
            </div>
          </div>
        )}
      </section>

      {/* calendar: the real poster and the latest year's dates, each on a white card */}
      <section id="calendar" className="scroll-mt-4">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <Head
            eyebrow={t.home.yearLabel + " " + (cal?.year ?? "")}
            title={t.home.calendarTitle}
            intro={t.home.calendarLead}
            action={
              <a href={`/${lang}/assessment`} className={`${linkCls} shrink-0 text-sm`}>
                {t.home.calendarMore} →
              </a>
            }
          />
          <div className="mt-10 grid items-start gap-3 md:grid-cols-12">
            <a href={`/${lang}/calendar`} className={`block rounded-xl bg-card p-3 md:col-span-5 ${hairline}`}>
              <img src="/img/does/calendar-poster-2568.webp" alt={t.home.calendarPosterAlt} className={`aspect-[615/346] w-full rounded-xl ${hairline} object-cover`} />
            </a>
            {cal && (
              <div className={`rounded-xl bg-card p-6 md:col-span-7 ${hairline}`}>
                <table className="w-full text-left">
                  <thead>
                    <tr className="eyebrow text-ink-2">
                      <th scope="col" className="pb-3 pr-4 font-semibold">
                        {t.home.activity}
                      </th>
                      {[1, 2].map((r) => (
                        <th key={r} scope="col" className="pb-3 pr-4 font-semibold">
                          {t.pages.assessment.round} {r}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10 border-t border-ink/10">
                    {(["apply", "assess", "result"] as const).map((k) => (
                      <tr key={k}>
                        <th scope="row" className="py-4 pr-4 align-top font-semibold">
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

      {/* news: three feature cards on the canvas */}
      <section id="news" className="scroll-mt-4">
        <div className="mx-auto max-w-6xl px-4 pb-16 md:px-8 md:pb-24">
          <Head eyebrow={t.news.tag} title={t.news.title} action={all(`/${lang}/news`)} />
          <ul data-stagger className="mt-10 grid gap-3 md:grid-cols-3">
            {latestNews.map((n, i) => (
              <li key={n.id} style={idx(i)}>
                <a href={`/${lang}/news/${n.id}`} className={`group flex h-full flex-col rounded-xl bg-card p-3 ${hairline}`}>
                  {n.image ? (
                    <img src={n.image} alt={t.news.imageAlt} className={`aspect-[16/10] w-full rounded-xl ${hairline} object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0`} />
                  ) : (
                    <Placeholder label={t.news.imageAlt} className="aspect-[16/10] rounded-xl" />
                  )}
                  <div className="flex flex-1 flex-col p-3 pt-5">
                    <time dateTime={n.date} className="eyebrow tabular-nums text-ink-2">
                      {fullDate(n.date)}
                    </time>
                    <h3 className="mt-3 text-xl leading-[1.3] group-hover:underline">{n.title[lang]}</h3>
                    <p className="mt-2 line-clamp-3 text-ink-2">{n.excerpt[lang]}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* announcements: sand band, one white card holding the register */}
      <section id="announcements" className="scroll-mt-4 bg-raised">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <Head eyebrow={t.news.tag} title={t.news.announcements} action={all(`/${lang}/announcement`)} />
          <ul data-lines className={`mt-10 divide-y divide-ink/10 rounded-xl bg-card px-6 ${hairline}`}>
            {announcements.slice(0, PAGE).map((a, i) => (
              <li key={a.id} style={idx(i)} className="overflow-hidden">
                <div className="line flex gap-6 py-5">
                  <span className="w-24 shrink-0 pt-0.5 text-sm tabular-nums text-ink-2">
                    {lang === "th" ? `พ.ศ. ${a.year}` : `B.E. ${a.year}`}
                    {a.year === latestYear && <span className="eyebrow mt-2 block text-ink">{t.news.isNew}</span>}
                  </span>
                  <p className="line-clamp-2 min-w-0 font-semibold" title={a.title[lang]}>
                    <a href={`/${lang}/announcement/${a.id}`} className="hover:underline">
                      {a.title[lang]}
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* the oversized wordmark moment: 243px "UP PSF" over a desaturated photo, with one real number */}
      <section aria-label={t.passers.total} className="relative isolate overflow-hidden bg-forest text-white">
        <img src="/img/does/activity-team.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover grayscale" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/75" />
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <p aria-hidden="true" className="text-[clamp(96px,21vw,243px)] font-extrabold leading-none tracking-[-0.074em]">
            UP PSF
          </p>
          <div className="mt-10 flex flex-col gap-4 border-t border-white/20 pt-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-white/70">{t.passers.total}</p>
              <p className="mt-2 text-5xl font-extrabold tabular-nums md:text-6xl">
                {passers.length} <span className="text-2xl font-semibold md:text-3xl">{t.passers.people}</span>
              </p>
            </div>
            <a href={`/${lang}/publicity`} className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
              {t.passers.title} →
            </a>
          </div>
        </div>
      </section>

      <section id="levels" className="scroll-mt-4">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <Head eyebrow="PSF" title={t.levels.title} intro={t.levels.desc} />
          <ol data-stagger className="mt-10 grid gap-3 md:grid-cols-3">
            {t.levels.items.map((l, n) => (
              <li key={l.name} style={idx(n)} className={`flex flex-col rounded-xl bg-card p-6 ${hairline}`}>
                <div className="flex items-start justify-between">
                  <p className="eyebrow flex items-center gap-2">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: `var(--color-level-${n + 1})` }} />
                    {l.name}
                  </p>
                  <span aria-hidden="true" className="text-6xl font-extrabold leading-none tabular-nums text-ink/10">
                    {n + 1}
                  </span>
                </div>
                <p className="mt-8 text-lg text-ink-2">{l.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="process" className="scroll-mt-4 bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <Head eyebrow="PSF" title={t.process.title} />
          <ol data-stagger className="mt-10 grid md:grid-cols-4">
            {t.process.tiles.map((tile, i) => (
              <li key={tile.href} style={idx(i)} className="relative border-l border-ink/15 pb-10 pl-6 last:pb-0 md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pr-8 md:pt-6">
                <span aria-hidden="true" className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full border border-ink bg-card md:-top-[5px] md:left-0" />
                <span aria-hidden="true" className="block text-6xl font-extrabold tabular-nums text-ink/15">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-xl">{tile.title}</h3>
                <p className="mt-2 text-sm text-ink-2">{tile.desc}</p>
                <a href={`/${lang}${tile.href}`} className={`${linkCls} mt-4 inline-block text-sm`}>
                  {tile.link}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="passers" className="scroll-mt-4">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <Head eyebrow={t.passers.level} title={t.passers.title} intro={t.passers.desc} action={all(`/${lang}/publicity`)} />

          {/* level filter: underline tabs, each with its count taken from the data */}
          <div role="tablist" aria-label={t.passers.title} className="no-scrollbar -mx-4 mt-8 flex gap-6 overflow-x-auto border-b border-ink/15 px-4 md:mx-0 md:px-0">
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                role="tab"
                aria-selected={lvl === n}
                onClick={() => setLvl(n)}
                className={`-mb-px shrink-0 border-b-2 pb-3 text-sm transition-colors ${
                  lvl === n ? "border-ink font-semibold text-ink" : "border-transparent text-ink-2 hover:text-ink"
                }`}
              >
                {n === 0 ? t.passers.all : passers.find((p) => p.level.en === `Level ${n}`)?.level[lang]}{" "}
                <span className="tabular-nums text-ink-2">{n === 0 ? passers.length : passers.filter((p) => p.level.en === `Level ${n}`).length}</span>
              </button>
            ))}
          </div>

          {/* newest first, the first 4 of the selected level */}
          <ul data-stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
