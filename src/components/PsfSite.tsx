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
const linkCls = "font-semibold text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink";
const pill = "relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 font-semibold transition-colors";

// Section head: serif heading, optional intro, optional link on the right
function Head({ title, intro, action, light }: { title: string; intro?: string; action?: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className={`text-4xl leading-[1.25] md:text-5xl md:leading-[1.2] ${light ? "text-white" : ""}`}>{title}</h2>
        {intro && <p className={`mt-4 max-w-2xl text-lg ${light ? "text-white/75" : "text-ink-2"}`}>{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export default function PsfSite({ lang }: { lang: Lang }) {
  const { content, announcements, news, passers, assessmentCalendars } = useSite();
  const t = content[lang];
  const [lvl, setLvl] = useState(0); // passers filter: 0 = all, 1-3 = PSF level
  const latestYear = Math.max(...announcements.map((a) => a.year));
  const cal = [...assessmentCalendars].sort((a, b) => b.year - a.year)[0];
  const rounds = cal ? Math.max(...cal.events.map((e) => e.round)) : 0;
  const loc = lang === "th" ? "th-TH" : "en-GB";
  const day = (d: string) => new Date(d).toLocaleDateString(loc, { day: "numeric", month: "short" });
  const fullDate = (d: string) => new Date(d).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
  const range = (e?: { start: string; end?: string }) => (!e ? "–" : e.end ? `${day(e.start)} – ${day(e.end)}` : day(e.start));
  const latestNews = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const all = (href: string, light?: boolean) => (
    <a href={href} className={`${light ? "font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white" : linkCls} shrink-0 text-sm`}>
      {t.news.viewAll} →
    </a>
  );
  const stats = [
    { v: t.levels.items.length, l: t.home.stats.levels },
    { v: passers.length, l: t.home.stats.passers },
    { v: rounds, l: t.home.stats.rounds },
  ];

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
      {/* hero: full-bleed photo, serif headline bottom-left, cream pill button, a stat strip */}
      <section id="home" className="relative isolate flex min-h-[640px] flex-col justify-end overflow-hidden bg-forest text-white md:min-h-[780px]">
        <img src="/img/does/campus-statue.webp" alt={t.hero.photoAlt} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/25 to-black/30" />
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-12 pt-40 md:grid-cols-12 md:items-end md:px-8 md:pb-16">
          <div className="md:col-span-7">
            <p className="rise inline-block rounded-full bg-black/35 px-3 py-1 text-sm font-semibold backdrop-blur-sm">{t.hero.eyebrow}</p>
            <TextEffect as="h1" text={t.hero.title} delay={200} step={40} className="mt-5 block text-5xl leading-[1.2] md:text-7xl md:leading-[1.15]" />
            <TextEffect as="p" text={t.hero.desc} delay={200 + [...t.hero.title].length * 40 + 200} step={12} className="mt-6 block max-w-xl text-lg leading-8 text-white/85" />
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a href={`/${lang}/publicity`} onClick={ripple} className={`${pill} bg-card text-accent-ink hover:bg-white`}>
                {t.hero.cta}
              </a>
              <a href="#announcements" className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                {t.hero.cta2}
              </a>
            </div>
          </div>
          <dl className="grid grid-cols-3 divide-x divide-white/30 md:col-span-5">
            {stats.map((s) => (
              <div key={s.l} className="px-4 first:pl-0">
                <dt className="text-3xl font-semibold tabular-nums md:text-4xl">{s.v}</dt>
                <dd className="mt-1 text-sm text-white/80">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* how it works: four numbered steps */}
      <section id="process" className="scroll-mt-4">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <Head title={t.process.title} />
          <ol data-stagger className="mt-12 grid gap-4 md:grid-cols-4">
            {t.process.tiles.map((tile, i) => (
              <li key={tile.href} style={idx(i)} className={`flex flex-col rounded-3xl bg-card p-6 ${hairline}`}>
                <span aria-hidden="true" className="font-serif text-5xl tabular-nums text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-xl">{tile.title}</h3>
                <p className="mt-2 flex-1 text-ink-2">{tile.desc}</p>
                <a href={`/${lang}${tile.href}`} className={`${linkCls} mt-6 inline-block text-sm`}>
                  {tile.link}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* calendar: the real poster and the latest year's dates */}
      <section id="calendar" className="scroll-mt-4 bg-raised/60">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <Head
            title={`${t.home.calendarTitle} ${t.home.yearLabel} ${cal?.year ?? ""}`}
            intro={t.home.calendarLead}
            action={
              <a href={`/${lang}/assessment`} className={`${linkCls} shrink-0 text-sm`}>
                {t.home.calendarMore} →
              </a>
            }
          />
          <div className="mt-12 grid items-start gap-4 md:grid-cols-12">
            <a href={`/${lang}/calendar`} className={`block rounded-3xl bg-card p-3 md:col-span-5 ${hairline}`}>
              <img src="/img/does/calendar-poster-2568.webp" alt={t.home.calendarPosterAlt} className="aspect-[615/346] w-full rounded-2xl object-cover" />
            </a>
            {cal && (
              <div className={`rounded-3xl bg-card p-6 md:col-span-7 md:p-8 ${hairline}`}>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-ink-3">
                      <th scope="col" className="pb-3 pr-4 font-medium">
                        {t.home.activity}
                      </th>
                      {[1, 2].map((r) => (
                        <th key={r} scope="col" className="pb-3 pr-4 font-medium">
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

      {/* levels: dark band, three panels */}
      <section id="levels" className="scroll-mt-4 bg-forest text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <Head title={t.levels.title} intro={t.levels.desc} light />
          <ol data-stagger className="mt-12 grid gap-4 md:grid-cols-3">
            {t.levels.items.map((l, n) => (
              <li key={l.name} style={idx(n)} className="flex flex-col rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8">
                <span className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-white" style={{ background: `var(--color-level-${n + 1})` }}>
                  {l.name}
                </span>
                <p className="mt-8 text-xl leading-8 text-white/90">{l.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* news: three story cards */}
      <section id="news" className="scroll-mt-4">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <Head title={t.news.title} action={all(`/${lang}/news`)} />
          <ul data-stagger className="mt-12 grid gap-4 md:grid-cols-3">
            {latestNews.map((n, i) => (
              <li key={n.id} style={idx(i)}>
                <a href={`/${lang}/news/${n.id}`} className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-card ${hairline}`}>
                  {n.image ? (
                    <img src={n.image} alt={t.news.imageAlt} className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <Placeholder label={t.news.imageAlt} className="aspect-[4/3]" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <time dateTime={n.date} className="text-sm tabular-nums text-ink-3">
                      {fullDate(n.date)}
                    </time>
                    <h3 className="mt-2 text-xl leading-[1.35] group-hover:text-accent-ink">{n.title[lang]}</h3>
                    <p className="mt-2 line-clamp-3 text-ink-2">{n.excerpt[lang]}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* announcements: one rounded card holding the register */}
      <section id="announcements" className="scroll-mt-4 bg-raised/60">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <Head title={t.news.announcements} action={all(`/${lang}/announcement`)} />
          <ul data-lines className={`mt-12 divide-y divide-ink/10 rounded-3xl bg-card px-6 md:px-8 ${hairline}`}>
            {announcements.slice(0, PAGE).map((a, i) => (
              <li key={a.id} style={idx(i)} className="overflow-hidden">
                <div className="line flex gap-6 py-5">
                  <span className="w-24 shrink-0 pt-0.5 text-sm tabular-nums text-ink-3">
                    {lang === "th" ? `พ.ศ. ${a.year}` : `B.E. ${a.year}`}
                    {a.year === latestYear && <span className="mt-2 block w-fit rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">{t.news.isNew}</span>}
                  </span>
                  <p className="line-clamp-2 min-w-0 font-semibold" title={a.title[lang]}>
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

      <section id="passers" className="scroll-mt-4">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <Head title={t.passers.title} intro={t.passers.desc} action={all(`/${lang}/publicity`)} />

          {/* level filter: pill chips, each with its count taken from the data */}
          <div role="tablist" aria-label={t.passers.title} className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                role="tab"
                aria-selected={lvl === n}
                onClick={() => setLvl(n)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                  lvl === n ? "border-accent bg-accent font-semibold text-white" : "border-ink/15 bg-card text-ink-2 hover:border-ink/40"
                }`}
              >
                {n === 0 ? t.passers.all : passers.find((p) => p.level.en === `Level ${n}`)?.level[lang]}{" "}
                <span className="tabular-nums opacity-80">{n === 0 ? passers.length : passers.filter((p) => p.level.en === `Level ${n}`).length}</span>
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

      {/* closing call to action */}
      <section className="mx-auto max-w-6xl px-4 pb-20 md:px-8 md:pb-28">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-accent p-8 text-white md:flex-row md:items-center md:p-14">
          <div>
            <h2 className="max-w-xl text-4xl leading-[1.25] md:text-5xl md:leading-[1.2]">{t.home.ctaTitle}</h2>
            <p className="mt-4 max-w-xl text-lg text-white/85">{t.pages.assessment.formDesc}</p>
          </div>
          <a href={`/${lang}/documents/forms`} onClick={ripple} className={`${pill} shrink-0 bg-card text-accent-ink hover:bg-white`}>
            {t.nav.submitReview}
          </a>
        </div>
      </section>
    </main>
  );
}
