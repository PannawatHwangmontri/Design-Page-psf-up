"use client";

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

// line icons for the category bar, one array of paths per item (24 px grid, 1.6 stroke)
const CAT_ICONS: string[][] = [
  // apply: document with a check
  ["M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M14 3v5h5", "M9 14l2 2 4-4"],
  // calendar
  ["M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z", "M4 10h16", "M8 2v4", "M16 2v4", "M8 14h2", "M14 14h2", "M8 17h2"],
  // passers: medal with ribbons
  ["M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "M9 13.2L7.5 21l4.5-2.4L16.5 21 15 13.2"],
  // announcements: megaphone
  ["M3 10v4a1 1 0 0 0 1 1h2l6 4V5L6 9H4a1 1 0 0 0-1 1z", "M16 9a4 4 0 0 1 0 6", "M19 6a8 8 0 0 1 0 12"],
  // process: three linked steps
  ["M4 5h5v5H4z", "M15 14h5v5h-5z", "M9 7.5h3a3 3 0 0 1 3 3v3"],
  // eligibility: clipboard with a check
  ["M6 5h12a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "M9 3h6v4H9z", "M9 13l2 2 4-4"],
];

export default function PsfSite({ lang }: { lang: Lang }) {
  // mobile category bar: shown at the bottom, hidden while scrolling down, back when scrolling up
  const [barShown, setBarShown] = useState(true);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setBarShown(y < last || y < 80);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const { content, announcements, news, passers, assessmentCalendars } = useSite();
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

  // play each [data-stagger] / [data-lines] / [data-reveal] group once, when it scrolls into view
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
    document.querySelectorAll("[data-stagger],[data-lines],[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="font-ui">
      {/* hero: full-viewport documentary photo under a dark scrim, centered serif headline, one pill CTA */}
      <section id="home" className="relative isolate flex min-h-[640px] flex-col justify-center overflow-hidden bg-forest text-page">
        <img src="/img/does/campus-statue.webp" alt={t.hero.photoAlt} className="hero-zoom absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/30" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#2a1450]/80 via-[#2a1450]/30 to-transparent" />
        {/* hero extras: a purple light that follows the pointer (Motion.tsx sets --mx/--my) and pulse rings behind the title */}
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10" />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden size-[46rem] -translate-x-1/2 -translate-y-1/2 md:block">
          <span className="pulse-ring inset-0" style={{ animationDelay: "0s" }} />
          <span className="pulse-ring inset-0" style={{ animationDelay: "1s" }} />
          <span className="pulse-ring inset-0" style={{ animationDelay: "2s" }} />
          <span className="pulse-ring inset-0" style={{ animationDelay: "3s" }} />
        </div>
        <div className="mx-auto max-w-4xl px-4 pb-32 pt-36 text-center md:px-8">
          <p className="rise mx-auto inline-flex items-center gap-2 rounded-full border border-page/40 bg-page/20 px-5 py-2 text-base font-semibold text-page"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-page" />{t.hero.eyebrow}</p>
          <TextEffect as="h1" text={t.hero.title} delay={200} step={40} className="mt-6 block text-4xl leading-[1.25] md:text-6xl md:leading-[1.2]" />
          <TextEffect as="p" text={t.hero.desc} delay={200 + [...t.hero.title].length * 40 + 200} step={12} className="mx-auto mt-8 block max-w-xl text-lg font-medium leading-8 text-page" />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <a href={`/${lang}/publicity`} data-magnetic onClick={ripple} className="relative inline-flex items-center overflow-hidden rounded-full bg-accent px-6 py-2.5 font-medium text-white hover:bg-accent-hover">
              {t.hero.cta}
            </a>
            <a href="#announcements" className="inline-flex h-11 items-center rounded-full border border-page/70 px-6 text-sm font-medium text-page hover:bg-page/10">
              {t.hero.cta2}
            </a>
          </div>
        </div>
        {announcements[0] && (
          <div className="absolute inset-x-0 bottom-0 border-t border-page/20 bg-[#1d1630]/85">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 md:flex-row md:items-center md:gap-6 md:px-8">
              <span className="shrink-0 font-mono text-xs tracking-[0.05em] text-page/80">{t.hero.latest}</span>
              <a href={`/${lang}/announcement/${announcements[0].id}`} className="line-clamp-1 text-sm hover:underline">
                {announcements[0].title[lang]}
              </a>
            </div>
          </div>
        )}
      </section>


      {/* calendar: its own dark photo band (the quick links above and the news below are light), poster beside two glass cards, one per round */}
      <section id="calendar" className="relative isolate scroll-mt-16 overflow-hidden bg-page text-ink">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
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

      {/* news: one lead story with a photo, the next three beside it */}
      <section id="news" className="relative scroll-mt-16 bg-card">
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
                <a href={`/${lang}/news/${lead.id}`} className="group block">
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

      {/* process: four steps in columns, each with a top rule, number and title */}
      <section id="process" className="relative overflow-hidden scroll-mt-16 bg-forest text-page">
        {/* decorative motion: pulse rings and a tilted floating card (no text, so nothing to translate) */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 hidden size-[34rem] md:block">
          <span className="pulse-ring inset-0" style={{ animationDelay: "0s" }} />
          <span className="pulse-ring inset-0" style={{ animationDelay: "1.2s" }} />
          <span className="pulse-ring inset-0" style={{ animationDelay: "2.4s" }} />
        </div>
        <div aria-hidden="true" className="tilt-float pointer-events-none absolute right-10 top-28 hidden w-48 rounded-[22px] bg-page p-5 md:block">
          <span className="block h-2 w-16 rounded-full bg-accent" />
          <span className="mt-4 block h-2 w-28 rounded-full bg-raised" />
          <span className="mt-2 block h-2 w-20 rounded-full bg-raised" />
          <span className="mt-5 block h-8 rounded-full bg-accent/15" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <TextEffect as="h2" text={t.process.title} className="text-4xl leading-tight tracking-tight text-page md:text-5xl" />
          <span aria-hidden="true" className="line-grow mt-5 block h-px w-28 bg-page/70" />
          <ol data-stagger className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.process.tiles.map((tile, i) => (
              <li key={tile.href} style={idx(i)} className="rounded-[22px] border border-page/15 bg-page/5 p-6">
                <p className="font-mono text-xs tabular-nums text-page/60">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-xl">{tile.title}</h3>
                <p className="mt-3 text-sm leading-6 text-page/75">{tile.desc}</p>
                <a href={`/${lang}${tile.href}`} className="mt-4 inline-block text-sm font-medium text-page underline underline-offset-4 hover:decoration-page">
                  {tile.link}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="passers" className="relative scroll-mt-16 bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
            <h2 data-reveal className="text-4xl leading-tight tracking-tight text-ink md:text-5xl">{t.passers.title}</h2>
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
      <nav aria-label={t.home.quickTitle} className={`fixed inset-x-3 bottom-3 z-40 rounded-[22px] border border-ink/10 bg-card/95 p-2 shadow-none backdrop-blur-md transition-transform duration-300 md:inset-x-auto md:bottom-6 md:left-1/2 md:w-[46rem] md:-translate-x-1/2 md:p-3 ${barShown ? "translate-y-0" : "translate-y-[150%]"}`}>
        <ul className="flex gap-1 overflow-x-auto md:grid md:grid-cols-6 md:gap-2 md:overflow-visible">
          {t.home.quick.slice(0, 6).map((q, i) => (
            <li key={q.href} className="w-[30vw] shrink-0 md:w-auto">
              <a href={`/${lang}${q.href}`} className="flex flex-col items-center gap-1.5 rounded-xl px-1 py-2 text-center text-[11px] font-medium leading-tight text-ink hover:bg-raised md:text-sm">
                <span className="flex size-11 items-center justify-center rounded-full bg-tint">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-accent" aria-hidden="true">
                    {CAT_ICONS[i % CAT_ICONS.length].map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                </span>
                <span className="flex h-[2.4em] items-center justify-center">{q.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
