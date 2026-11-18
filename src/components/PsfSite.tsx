"use client";

import { ApplyCountdown } from "@/components/ApplyCountdown";
import { Wave } from "@/components/Wave";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import { calendarPoster } from "@/data/mock";
import { PasserTile } from "./PasserCard";
import { Placeholder } from "./Placeholder";
import { TextEffect } from "./TextEffect";
import { ripple } from "./ripple";

const PAGE = 4; // announcements shown on the home page (the rest are on /announcement)
// stagger index for [data-stagger] children (see .stagger in globals.css)
const idx = (i: number) => ({ "--i": i }) as React.CSSProperties;

const hairline = "border border-ink/10";
// level shape next to the level name: circle, diamond, triangle (readable without colour)
const LEVEL_SHAPE: Record<number, string> = { 1: "rounded-full", 2: "rotate-45 rounded-[2px]", 3: "[clip-path:polygon(50%_0%,100%_100%,0%_100%)]" };
const linkCls = "font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink";

// vertical section marker on the left page edge (wide screens only, see .side-label)

export default function PsfSite({ lang }: { lang: Lang }) {
  const { content, announcements, news, passers, assessmentCalendars } = useSite();
  const t = content[lang];
  const [lvl, setLvl] = useState(0); // passers filter: 0 = all, 1-3 = PSF level
  const posterRef = useRef<HTMLDialogElement>(null); // full-size calendar poster
  const latestYear = Math.max(...announcements.map((a) => a.year));
  const cal = [...assessmentCalendars].sort((a, b) => b.year - a.year)[0];
  const loc = lang === "th" ? "th-TH" : "en-GB";
  const fullDate = (d: string) => new Date(d).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const [top, setTop] = useState(0); // index in sorted of the lead story; side items are picked to change it
  const [page, setPage] = useState(0); // side list shows 3 stories per page, newest first
  const cur = sorted.length ? top % sorted.length : 0;
  const lead = sorted[cur];
  // side list = every story except the lead, in date order (no wrap-around)
  const list = sorted.filter((_, k) => k !== cur);
  const pages = Math.max(1, Math.ceil(list.length / 3));
  const p = Math.min(page, pages - 1); // clamp when the lead changes and the list gets shorter
  const shown = list.slice(p * 3, p * 3 + 3);
  const pic = (src: string | undefined, alt: string, cls: string) =>
    src ? <img src={src} alt={alt} className={`${cls} photo-dim object-cover`} /> : <Placeholder label={alt} className={cls} />;


  return (
    <main className="font-ui">
      {/* hero: full-viewport documentary photo under a dark scrim, centered serif headline, one pill CTA */}
      <section id="home" className="relative isolate flex min-h-[640px] flex-col justify-center overflow-hidden bg-block-dark text-on-dark">
        <img src="/img/does/campus-statue.webp" alt={t.hero.photoAlt} className="hero-zoom absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-scrim-soft" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-block-dark/80 via-block-dark/30 to-transparent" />
        {/* hero extras: a purple light that follows the pointer (Motion.tsx sets --mx/--my) and pulse rings behind the title */}
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10" />
        {/* clip box: the rings scale past their own box, so they are clipped here, not left to the section */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden overflow-clip md:block">
          <div className="absolute left-1/2 top-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2">
            <span className="pulse-ring inset-0" style={{ animationDelay: "0s" }} />
            <span className="pulse-ring inset-0" style={{ animationDelay: "1s" }} />
            <span className="pulse-ring inset-0" style={{ animationDelay: "2s" }} />
            <span className="pulse-ring inset-0" style={{ animationDelay: "3s" }} />
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-4 pb-32 pt-36 text-center md:px-8">
          <TextEffect as="h1" text={t.hero.title} delay={200} step={40} className="mt-6 block text-4xl leading-[1.25] md:text-6xl md:leading-[1.2]" />
          <TextEffect as="p" text={t.hero.desc} delay={200 + [...t.hero.title].length * 40 + 200} step={12} className="mx-auto mt-8 block max-w-xl text-lg font-medium leading-8 text-on-dark" />
          <div className="rise mt-10 flex flex-wrap items-center justify-center gap-6" style={{ animationDelay: "1.5s" }}>
            <a href={`/${lang}/publicity`} data-magnetic onClick={ripple} className="relative inline-flex items-center overflow-hidden rounded-full bg-on-dark px-6 py-2.5 font-medium text-block-dark hover:opacity-90">
              {t.hero.cta}
            </a>
            <a href="#announcements" className="inline-flex h-11 items-center rounded-full border border-on-dark/70 px-6 text-sm font-medium text-on-dark hover:bg-on-dark/10">
              {t.hero.cta2}
            </a>
          </div>
        </div>
      </section>


      {/* news: one lead story with a photo, the next three beside it */}
      <section id="news" className="relative scroll-mt-16 bg-card">
        <Wave fill="text-card" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
            <h2 data-reveal className="text-4xl leading-tight tracking-tight text-ink md:text-5xl">{t.news.title}</h2>
            <a href={`/${lang}/news`} className={`${linkCls} shrink-0 text-sm`}>
              {t.news.viewAll} →
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { href: "#news", label: t.news.title },
              { href: "#announcements", label: t.news.announcements },
              { href: "#calendar", label: t.home.calendarTitle },
              { href: "#passers", label: t.passers.title },
            ].map((c) => (
              <a key={c.href} href={c.href} className="rounded-full border border-ink/10 bg-page px-4 py-1.5 text-sm font-medium text-ink hover:bg-raised">
                {c.label}
              </a>
            ))}
          </div>
          {lead && (
            <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-12">
              <article data-reveal className="md:col-span-7">
                <a key={lead.id} href={`/${lang}/news/${lead.id}`} className="news-swap group block">
                  {pic(lead.image, t.news.imageAlt, "aspect-[16/10] w-full rounded-xl")}
                  <time dateTime={lead.date} className="mt-4 block text-sm tabular-nums text-ink-3">
                    {fullDate(lead.date)}
                  </time>
                  <h3 className="mt-1 line-clamp-3 text-2xl font-medium group-hover:text-accent-ink">{lead.title[lang]}</h3>
                  <p className="mt-2 line-clamp-3 text-ink-2">{lead.excerpt[lang]}</p>
                </a>
              </article>
              <div className="md:col-span-5 md:self-start">
              <ul data-stagger className="divide-y divide-ink/10 border-y border-ink/10">
                {shown.map((n, i) => (
                  <li key={n.id} style={idx(i)}>
                    <button
                      type="button"
                      onClick={() => {
                        setTop(sorted.findIndex((x) => x.id === n.id));
                        setPage(p);
                      }}
                      className="group flex w-full gap-4 py-5 text-left"
                    >
                      {pic(n.image, t.news.imageAlt, "h-20 w-28 shrink-0 rounded-lg")}
                      <div className="min-w-0">
                        <time dateTime={n.date} className="text-sm tabular-nums text-ink-3">
                          {fullDate(n.date)}
                        </time>
                        <h3 className="mt-1 line-clamp-2 font-medium group-hover:text-accent-ink">{n.title[lang]}</h3>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              {pages > 1 && (
                <div className="mt-6 flex gap-3">
                  {p > 0 && (
                    <button
                      type="button"
                      aria-label={t.news.back}
                      onClick={() => setPage(p - 1)}
                      className="inline-flex h-11 items-center rounded-full border border-ink/10 bg-page px-5 text-sm font-medium text-ink hover:bg-raised"
                    >
                      ← {t.news.back}
                    </button>
                  )}
                  {p < pages - 1 && (
                    <button
                      type="button"
                      aria-label={t.news.more}
                      onClick={() => setPage(p + 1)}
                      className="inline-flex h-11 items-center rounded-full border border-ink/10 bg-page px-5 text-sm font-medium text-ink hover:bg-raised"
                    >
                      {t.news.more} →
                    </button>
                  )}
                </div>
              )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* announcements (left) and assessment calendar (right) in one section; the calendar comes first in the DOM so mobile reads it first */}
      <section id="announcements" className="relative scroll-mt-16 bg-page text-ink">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[minmax(0,1.15fr)_1px_minmax(0,1fr)] md:gap-x-12 md:px-8 md:py-24">
          <div id="calendar" className="scroll-mt-16 md:order-last">
            <TextEffect as="h2" text={t.home.calendarTitle} className="!font-bold text-4xl leading-tight tracking-tight md:text-5xl" />
            <span aria-hidden="true" className="line-grow mt-4 block h-px w-28 bg-accent" />
            <p data-reveal className="mt-2 text-ink-3">
              {t.home.calendarLead}
              {cal && <span className="tabular-nums"> · {t.home.yearLabel} {cal.year}</span>}
            </p>
            <div data-reveal>
              <ApplyCountdown lang={lang} />
            </div>
            <figure data-reveal className="mt-6">
              <button type="button" onClick={() => posterRef.current?.showModal()} aria-label={t.home.posterOpen} className="block w-full rounded-2xl text-left">
                <img src={calendarPoster.src} alt={t.home.calendarPosterAlt} width={762} height={486} className="h-auto w-full rounded-2xl object-contain" />
              </button>
              <figcaption data-reveal className="mt-2 text-sm text-ink-3">{t.home.posterCaption.replace("{year}", String(calendarPoster.year))}</figcaption>
              <dialog ref={posterRef} className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-scrim">
                <div
                  className="relative flex h-full w-full items-center justify-center p-4"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) posterRef.current?.close();
                  }}
                >
                  <button type="button" onClick={() => posterRef.current?.close()} className="absolute right-4 top-4 inline-flex h-11 items-center rounded-full bg-page px-5 text-sm font-medium text-ink hover:bg-raised">
                    {t.news.close}
                  </button>
                  <img src={calendarPoster.src} alt={t.home.calendarPosterAlt} className="max-h-full max-w-full rounded-2xl object-contain" />
                </div>
              </dialog>
            </figure>
            <a data-reveal href={`/${lang}/calendar`} className={`${linkCls} mt-6 inline-block text-base`}>
              {t.home.calendarAll} →
            </a>
          </div>

          <div aria-hidden="true" className="hidden bg-ink/30 md:order-none md:block" />

          <div className="border-t border-ink/20 pt-12 md:order-first md:border-0 md:pt-0">
            <h2 data-reveal className="!font-bold text-4xl leading-tight tracking-tight md:text-5xl">{t.news.announcements}</h2>
            <a href={`/${lang}/announcement`} className={`${linkCls} mt-4 inline-block text-base`}>
              {t.news.viewAll} →
            </a>
            <ul data-lines className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
              {announcements.slice(0, PAGE).map((a, i) => (
                <li key={a.id} style={idx(i)} className="overflow-hidden">
                  <a href={`/${lang}/announcement/${a.id}`} className="line group flex min-h-14 gap-6 py-5 hover:text-accent-ink">
                    <span className="w-24 shrink-0 pt-0.5 text-sm tabular-nums text-ink-3">
                      {lang === "th" ? `พ.ศ. ${a.year}` : `B.E. ${a.year}`}
                      {a.year === latestYear && <span className="mt-2 block text-accent-ink">{t.news.isNew}</span>}
                    </span>
                    <span className="min-w-0 line-clamp-2 font-medium text-ink" title={a.title[lang]}>
                      {a.title[lang]}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PSF: three levels as a ledger, then the four steps */}
      <section id="levels" className="relative scroll-mt-16 bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
          <div className="md:col-span-4">
            <h2 data-reveal className="text-4xl leading-tight tracking-tight text-ink md:text-5xl">{t.levels.title}</h2>
            <p className="mt-3 text-ink-2">{t.levels.desc}</p>
          </div>
          <ol data-stagger className="divide-y divide-ink/10 border-y border-ink/10 md:col-span-8">
            {t.levels.items.map((l, n) => (
              <li key={l.name} style={idx(n)} className="grid grid-cols-[3rem_1fr] gap-4 py-6 md:grid-cols-[4rem_12rem_1fr]">
                <span aria-hidden="true" className="num-faint text-4xl tabular-nums text-ink/20">
                  {n + 1}
                </span>
                <h3 className="flex items-center gap-2 text-xl font-medium md:self-center">
                  <span aria-hidden="true" className={`h-2 w-2 ${LEVEL_SHAPE[n + 1]}`} style={{ background: `var(--color-level-${n + 1})` }} />
                  {l.name}
                </h3>
                <p className="col-span-2 text-ink-2 md:col-span-1 md:self-center">{l.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* process: four steps in columns, each with a top rule, number and title */}
      <section id="process" className="relative overflow-x-clip scroll-mt-16 bg-block-dark text-on-dark">
        <Wave fill="text-block-dark" />
        {/* decorative motion: pulse rings and a tilted floating card (no text, so nothing to translate) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-clip md:block">
          <div className="absolute -right-40 top-10 size-[34rem]">
            <span className="pulse-ring inset-0" style={{ animationDelay: "0s" }} />
            <span className="pulse-ring inset-0" style={{ animationDelay: "1.2s" }} />
            <span className="pulse-ring inset-0" style={{ animationDelay: "2.4s" }} />
          </div>
        </div>
        <div aria-hidden="true" className="tilt-float pointer-events-none absolute right-10 top-28 hidden w-48 rounded-[22px] bg-on-dark p-5 md:block">
          <span className="block h-2 w-16 rounded-full bg-accent" />
          <span className="mt-4 block h-2 w-28 rounded-full bg-raised" />
          <span className="mt-2 block h-2 w-20 rounded-full bg-raised" />
          <span className="mt-5 block h-8 rounded-full bg-accent/15" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <TextEffect as="h2" text={t.process.title} className="text-4xl leading-tight tracking-tight text-on-dark md:text-5xl" />
          <span aria-hidden="true" className="line-grow mt-5 block h-px w-28 bg-on-dark/70" />
          <ol data-stagger className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.process.tiles.map((tile, i) => (
              <li key={tile.href} style={idx(i)} className="rounded-[22px] border border-on-dark/15 bg-on-dark/5 p-6">
                <p className="font-mono text-xs tabular-nums text-on-dark/60">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-xl">{tile.title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-dark/75">{tile.desc}</p>
                <a href={`/${lang}${tile.href}`} className="mt-4 inline-block text-sm font-medium text-on-dark underline underline-offset-4 hover:decoration-on-dark">
                  {tile.link}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="passers" className="relative scroll-mt-16 bg-card">
        <Wave fill="text-card" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
            <h2 data-reveal className="text-4xl leading-tight tracking-tight text-ink md:text-5xl">{t.passers.title}</h2>
            <a href={`/${lang}/publicity`} className={`${linkCls} shrink-0 text-sm`}>
              {t.news.viewAll} →
            </a>
          </div>
          <p className="mt-2 text-ink-2">{t.passers.desc}</p>

          {/* headline counts: total and per level, from the same data as the tabs below */}
          <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl border border-ink/10 bg-tint p-5">
                <dt className="text-sm text-ink-2">{n === 0 ? t.passers.all : passers.find((p) => p.level.en === `Level ${n}`)?.level[lang]}</dt>
                <dd className="mt-2 font-ui text-4xl font-semibold tabular-nums text-accent-ink">
                  {n === 0 ? passers.length : passers.filter((p) => p.level.en === `Level ${n}`).length}
                </dd>
              </div>
            ))}
          </dl>

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
      {/* help strip: first three FAQ questions (native details, no script) and who can apply, both from content.ts */}
      <section id="help" className="relative scroll-mt-16 bg-page text-ink">
        <Wave fill="text-page" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr] md:gap-12 md:px-8 md:py-24">
          <div>
            <h2 data-reveal className="text-3xl leading-tight tracking-tight md:text-4xl">{t.pages.faq.title}</h2>
            <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {t.pages.faq.items.slice(0, 3).map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                    {f.q}
                    <span aria-hidden="true" className="text-xl leading-none text-accent-ink transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-ink-2">{f.a}</p>
                </details>
              ))}
            </div>
            <a href={`/${lang}/faq`} className={`${linkCls} mt-5 inline-block text-sm`}>
              {t.news.viewAll} →
            </a>
          </div>
          <aside className="rounded-2xl border border-ink/10 bg-tint p-6">
            <h2 className="text-xl font-medium">{t.pages.eligibility.who.title}</h2>
            <ul className="mt-4 space-y-2">
              {t.pages.eligibility.who.items.map((it) => (
                <li key={it} className="flex items-center gap-3 text-ink">
                  <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] text-white">✓</span>
                  {it}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-2">{t.pages.eligibility.who.note}</p>
            <a href={`/${lang}/eligibility`} className={`${linkCls} mt-5 inline-block text-sm`}>
              {t.pages.eligibility.title} →
            </a>
          </aside>
        </div>
      </section>
    </main>
  );
}

