"use client";

import { ApplyCountdown } from "@/components/ApplyCountdown";
import { Wave } from "@/components/Wave";
import { useEffect, useState, useSyncExternalStore } from "react";
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
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const [top, setTop] = useState(0); // index in sorted of the lead story; side items are picked to change it
  const cur = sorted.length ? top % sorted.length : 0;
  const lead = sorted[cur];
  const rest = [...sorted.slice(cur + 1), ...sorted.slice(0, cur)];
  const pic = (src: string | undefined, alt: string, cls: string) =>
    src ? <img src={src} alt={alt} className={`${cls} photo-dim object-cover`} /> : <Placeholder label={alt} className={cls} />;


  return (
    <main className="font-ui">
      {/* hero: full-viewport documentary photo under a dark scrim, centered serif headline, one pill CTA */}
      <section id="home" className="relative isolate flex min-h-[640px] flex-col justify-center overflow-hidden bg-forest text-on-dark">
        <img src="/img/does/campus-statue.webp" alt={t.hero.photoAlt} className="hero-zoom absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/30" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#2a1450]/80 via-[#2a1450]/30 to-transparent" />
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
            <a href={`/${lang}/publicity`} data-magnetic onClick={ripple} className="relative inline-flex items-center overflow-hidden rounded-full bg-accent px-6 py-2.5 font-medium text-white hover:bg-accent-hover">
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
              <ul data-stagger className="divide-y divide-ink/10 border-y border-ink/10 md:col-span-5 md:self-start">
                {rest.slice(0, 3).map((n, i) => (
                  <li key={n.id} style={idx(i)}>
                    <button type="button" onClick={() => setTop((cur + 1 + i) % sorted.length)} className="group flex w-full gap-4 py-5 text-left">
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
            </div>
          )}
          {/* more stories: the next four after the lead and the three beside it (the full list is on /news) */}
          {rest.length > 3 && (
            <ul data-stagger className="mt-12 grid grid-cols-2 gap-4 border-t border-ink/10 pt-10 sm:gap-6 lg:grid-cols-4">
              {rest.slice(3, 7).map((n, i) => (
                <li key={n.id} style={idx(i)}>
                  <a href={`/${lang}/news/${n.id}`} className="group block">
                    {pic(n.image, t.news.imageAlt, "aspect-[4/3] w-full rounded-xl")}
                    <time dateTime={n.date} className="mt-3 block text-sm tabular-nums text-ink-3">
                      {fullDate(n.date)}
                    </time>
                    <h3 className="mt-1 line-clamp-2 font-medium group-hover:text-accent-ink">{n.title[lang]}</h3>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* announcements: a plain register, year on the left like a gazette */}
      <section id="announcements" className="font-sans relative scroll-mt-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
          <div className="md:col-span-4">
            <h2 data-reveal className="text-4xl leading-tight tracking-tight text-ink md:text-5xl">{t.news.announcements}</h2>
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

      {/* calendar: its own dark photo band (the quick links above and the news below are light), poster beside two glass cards, one per round */}
      <section id="calendar" className="relative isolate scroll-mt-16 overflow-x-clip bg-page text-ink">
        <Wave fill="text-page" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 data-reveal className="text-4xl leading-tight tracking-tight text-ink md:text-5xl">{t.home.calendarTitle}</h2>
              <p className="mt-2 text-ink-2">
                {t.home.calendarLead}
                {cal && <span className="tabular-nums"> · {t.home.yearLabel} {cal.year}</span>}
              </p>
            </div>
            <a href={`/${lang}/assessment`} className="inline-flex h-11 shrink-0 items-center rounded-full bg-page px-6 text-sm font-medium text-ink hover:bg-card">
              {t.home.calendarMore} →
            </a>
          </div>
          <ApplyCountdown lang={lang} />
          <div className="mt-10 grid items-start gap-6 md:grid-cols-12 md:gap-8">
            <a href={`/${lang}/calendar`} className="block md:col-span-5">
              <img src="/img/does/calendar-poster-2568.webp" alt={t.home.calendarPosterAlt} className="h-auto w-full rounded-3xl border border-ink/10 bg-card object-contain" />
            </a>
            {cal && (
              <div data-reveal className="grid gap-6 md:col-span-7 md:gap-8">
                {[1, 2].map((r) => (
                  <div key={r} className="overflow-hidden rounded-3xl border border-ink/10 bg-card p-6 backdrop-blur-md">
                    <p className="-mx-6 -mt-6 mb-5 bg-gradient-to-r from-accent to-[#c2378f] px-6 py-4 font-ui font-semibold text-2xl text-white">
                      {t.pages.assessment.round} {r}
                    </p>
                    <dl className="mt-3 divide-y divide-page/15">
                      {(["apply", "assess", "result"] as const).map((k) => (
                        <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                          <dt className="text-ink-2">{t.pages.assessment.types[k]}</dt>
                          <dd className="text-right text-lg tabular-nums">{range(cal.events.find((e) => e.round === r && e.type === k))}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            )}
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
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: `var(--color-level-${n + 1})` }} />
                  {l.name}
                </h3>
                <p className="col-span-2 text-ink-2 md:col-span-1 md:self-center">{l.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* process: four steps in columns, each with a top rule, number and title */}
      <section id="process" className="relative overflow-x-clip scroll-mt-16 bg-forest text-on-dark">
        <Wave fill="text-forest" />
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
              <div key={n} className="rounded-2xl bg-tint p-5">
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
      {/* photo band before the footer: Kwan Phayao at sunset (no people), CC BY-SA credit shown on the band */}
      <section className="relative isolate h-64 overflow-hidden md:h-80">
        <img src="/img/commons/kwan-phayao-sunset.webp" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="mx-auto flex h-full max-w-6xl flex-col justify-end gap-4 px-4 pb-8 md:px-8">
          <p className="text-2xl font-medium text-on-dark md:text-4xl">{t.home.bandTitle}</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a href={`/${lang}/calendar`} className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-white hover:bg-accent-hover">
              {t.home.bandCta}
            </a>
            <p className="credit-chip font-mono text-[11px] text-on-dark/80">{t.home.bandCredit}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

