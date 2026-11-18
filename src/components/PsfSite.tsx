"use client";

import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import { fmtDate } from "@/lib/lang";
import { roundStatus } from "@/lib/rounds";
import { Hero } from "@/components/Hero";
import { Placeholder } from "./Placeholder";

// Home order and background rhythm: hero (forest, photo) → rounds (tint) → news + announcements (page)
// → PSF levels (card) → steps (forest) → passers (page) → eligibility + FAQ (card) → closing (forest, photo).
// Every section uses SECTION spacing and a WRAP container. Section heads share one pattern: tag, accent bar, h2, link.
const PAGE = 5; // announcements on the home page; the rest are on /announcement
const WRAP = "mx-auto max-w-6xl px-5 md:px-10";
const SECTION = "py-16 md:py-24";
const H2 = "text-3xl font-bold leading-[1.2] tracking-tight md:text-4xl";
const LINK = "inline-flex min-h-11 items-center text-base font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink";
const LINK_DARK = "inline-flex min-h-11 items-center text-base font-medium text-page underline decoration-page/40 underline-offset-4 hover:decoration-page";
const LEVEL_TONE = ["var(--color-level-1)", "var(--color-level-2)", "var(--color-level-3)"];

function SectionHead({ tag, title, href, linkLabel, dark = false }: { tag: string; title: string; href?: string; linkLabel?: string; dark?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={`text-sm font-medium ${dark ? "text-page/85" : "text-ink-2"}`}>{tag}</p>
        <span aria-hidden="true" className={`mt-3 block h-[3px] w-8 ${dark ? "bg-[#c79bef]" : "bg-accent"}`} />
        <h2 className={`mt-4 ${H2}`}>{title}</h2>
      </div>
      {href && linkLabel && (
        <a href={href} className={dark ? LINK_DARK : LINK}>
          {linkLabel} →
        </a>
      )}
    </div>
  );
}

export default function PsfSite({ lang }: { lang: Lang }) {
  const { content, announcements, news, passers, assessmentCalendars } = useSite();
  const t = content[lang];
  const latestYear = Math.max(...announcements.map((a) => a.year));
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const count = (n: number) => (n === 0 ? passers.length : passers.filter((p) => p.level.en === `Level ${n}`).length);
  const levelName = (n: number) => passers.find((p) => p.level.en === `Level ${n}`)?.level[lang] ?? "";
  const passersShown = [...passers].sort((x, y) => Number(y.year.en) - Number(x.year.en) || x.id - y.id).slice(0, 3);
  const loc = lang === "th" ? "th-TH" : "en-GB";
  const dateLong = (d: string) => new Date(`${d}T00:00`).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
  const kind = (title: string) => {
    if (title.includes("หลักเกณฑ์") || title.includes("Criteria")) return { label: t.home.kindCriteria, cls: "bg-tint text-accent-ink" };
    if (title.includes("ผลการ") || title.includes("Result")) return { label: t.home.kindResult, cls: "bg-accent text-white" };
    return { label: t.home.kindNotice, cls: "bg-raised text-ink-2" };
  };

  // closing call: same round status as the hero
  const cal = [...assessmentCalendars].sort((a, b) => b.year - a.year)[0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const round = roundStatus(cal ? cal.events : [], today.getTime());

  return (
    <main id="main-content" className="bg-page text-ink">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-page">
        {t.nav.skip}
      </a>

      <Hero lang={lang} />

      {/* news and announcements: news left, a hairline, announcements right with type badges */}
      <section id="news" className={`bg-page ${SECTION}`}>
        <div className={`${WRAP} grid gap-12 md:grid-cols-12`}>
          <div className="md:col-span-7">
            <SectionHead tag={t.home.tagNews} title={t.news.title} href={`/${lang}/news`} linkLabel={t.news.viewAll} />
            {sorted[0] && (
              <a href={`/${lang}/news/${sorted[0].id}`} className="group mt-10 block">
                {sorted[0].image ? (
                  <img src={sorted[0].image} alt={sorted[0].title[lang]} loading="lazy" className="aspect-[16/9] w-full rounded-2xl object-cover md:aspect-[16/10]" />
                ) : (
                  <Placeholder label={t.news.imageAlt} className="aspect-[16/9] w-full rounded-2xl md:aspect-[16/10]" />
                )}
                <time dateTime={sorted[0].date} className="mt-5 block text-sm tabular-nums text-ink-2">
                  {fmtDate(sorted[0].date, lang)}
                </time>
                <h3 className="mt-2 line-clamp-3 text-xl font-bold leading-snug group-hover:text-accent-ink">{sorted[0].title[lang]}</h3>
              </a>
            )}
            <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
              {sorted.slice(1, 4).map((n) => (
                <li key={n.id}>
                  <a href={`/${lang}/news/${n.id}`} className="group grid gap-1 py-4 md:grid-cols-[8rem_1fr] md:gap-5">
                    <time dateTime={n.date} className="text-sm tabular-nums text-ink-2">
                      {fmtDate(n.date, lang)}
                    </time>
                    <span className="line-clamp-2 text-base font-bold group-hover:text-accent-ink">{n.title[lang]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-5 md:border-l md:border-ink/10 md:pl-10">
            <SectionHead tag={t.home.tagNews} title={t.news.announcements} href={`/${lang}/announcement`} linkLabel={t.news.viewAll} />
            <ul data-lines className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {announcements.slice(0, PAGE).map((a) => {
                const k = kind(a.title[lang]);
                return (
                  <li key={a.id} className="overflow-hidden">
                    <a href={`/${lang}/announcement/${a.id}`} className="line group grid gap-2 py-4">
                      <span className="flex flex-wrap items-center gap-2 text-sm text-ink-2">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[13px] font-medium ${k.cls}`}>{k.label}</span>
                        <span className="tabular-nums">{lang === "th" ? `พ.ศ. ${a.year}` : `B.E. ${a.year}`}</span>
                        {a.year === latestYear && <span className="font-medium text-accent-ink">{t.news.isNew}</span>}
                      </span>
                      <span className="line-clamp-2 text-base font-bold group-hover:text-accent-ink">{a.title[lang]}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* PSF levels: three equal cards, a large level numeral as a faint watermark, the level colour as the top rule */}
      <section id="levels" className={`bg-card ${SECTION}`}>
        <div className={WRAP}>
          <SectionHead tag={t.home.tagPsf} title={t.levels.title} />
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-2">{t.levels.desc}</p>
          <ol data-stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {t.levels.items.map((l, n) => (
              <li key={l.name} className="relative flex flex-col overflow-hidden rounded-2xl bg-page p-6" style={{ borderTop: `4px solid ${LEVEL_TONE[n]}` }}>
                <span aria-hidden="true" className="pointer-events-none absolute right-4 top-2 text-7xl font-bold leading-none tabular-nums text-ink/10">
                  {n + 1}
                </span>
                <h3 className="relative mt-4 text-xl font-bold">{l.name}</h3>
                <p className="relative mt-3 text-base leading-7 text-ink">{l.desc}</p>
                {/* TODO: "เหมาะกับ" line per level; the text is not in content.ts yet, ask the owner */}
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <a href={`/${lang}/eligibility`} className={LINK}>
              {t.home.levelsMore} →
            </a>
          </div>
        </div>
      </section>

      {/* steps: one forest band, four steps in a row, the connector line behind the numbers (vertical on mobile) */}
      <section id="process" className={`bg-forest text-page ${SECTION}`}>
        <div className={WRAP}>
          <SectionHead tag={t.home.tagSteps} title={t.process.title} dark />
          <ol className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-8">
            <span aria-hidden="true" className="absolute bottom-4 left-[0.45rem] top-4 w-px bg-page/25 md:hidden" />
            <span aria-hidden="true" className="absolute left-0 right-0 top-9 hidden h-px bg-page/25 md:block" />
            {t.process.tiles.map((tile, i) => (
              <li key={tile.href} className="relative pl-8 md:pl-0">
                <span className="relative block bg-forest pr-3 text-6xl font-bold leading-none tabular-nums text-[#c79bef] md:inline-block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-lg font-bold">{tile.title}</h3>
                <p className="mt-2 text-base leading-7 text-page/90">{tile.desc}</p>
                <a href={`/${lang}${tile.href}`} className={`${LINK_DARK} mt-2`}>
                  {tile.link} →
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* passers: big totals as the graphic, three rows, one link to the full list */}
      <section id="passers" className={`bg-page ${SECTION}`}>
        <div className={WRAP}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-3 text-sm font-medium text-ink-2">
                {t.passers.title}
                <span className="inline-flex rounded-full bg-tint px-2.5 py-0.5 text-[13px] font-medium text-accent-ink">{t.pages.faq.sample}</span>
              </p>
              <span aria-hidden="true" className="mt-3 block h-[3px] w-8 bg-accent" />
              <h2 className={`mt-4 ${H2}`}>{t.passers.total}</h2>
            </div>
            <a href={`/${lang}/publicity`} className={LINK}>
              {t.home.seeList} →
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-end gap-x-14 gap-y-6">
            <p>
              <span className="text-7xl font-bold leading-none tabular-nums text-accent-ink md:text-8xl">{count(0)}</span>
              <span className="ml-3 text-lg text-ink-2">{t.passers.people}</span>
            </p>
            <ul className="flex flex-wrap gap-x-10 gap-y-4">
              {[1, 2, 3].map((n) => (
                <li key={n} className="flex items-center gap-3">
                  <span aria-hidden="true" className="size-3 rounded-full" style={{ background: LEVEL_TONE[n - 1] }} />
                  <span className="text-base text-ink-2">{levelName(n)}</span>
                  <span className="text-3xl font-bold tabular-nums">{count(n)}</span>
                </li>
              ))}
            </ul>
          </div>
          {passers.length === 0 ? (
            <p className="mt-10 text-base text-ink-2">{t.home.noData}</p>
          ) : (
            <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {passersShown.map((p) => (
                <li key={p.id} className="grid min-h-14 grid-cols-[2.5rem_1fr] items-center gap-x-4 py-4 md:grid-cols-[2.5rem_1fr_16rem_12rem] md:gap-x-6">
                  <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-raised text-ink-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
                    </svg>
                  </span>
                  <span className="text-base font-bold">{p.name[lang]}</span>
                  <span className="col-start-2 text-base text-ink-2 md:col-start-auto">{p.unit[lang]}</span>
                  <span className="col-start-2 flex items-center gap-2 text-sm tabular-nums text-ink-2 md:col-start-auto">
                    <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: LEVEL_TONE[Number(p.level.en.replace("Level ", "")) - 1] }} />
                    {p.level[lang]} · {p.year[lang]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* eligibility and FAQ side by side on the card colour */}
      <section id="help" className={`bg-card ${SECTION}`}>
        <div className={`${WRAP} grid gap-12 md:grid-cols-2 md:gap-16`}>
          <div>
            <SectionHead tag={t.home.tagHelp} title={t.pages.eligibility.who.title} href={`/${lang}/eligibility`} linkLabel={t.pages.eligibility.title} />
            <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {t.pages.eligibility.who.items.map((it) => (
                <li key={it} className="flex min-h-11 items-center py-3 text-base">
                  {it}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-base leading-7 text-ink-2">{t.pages.eligibility.who.note}</p>
          </div>
          <div>
            <SectionHead tag={t.home.tagHelp} title={t.pages.faq.title} href={`/${lang}/faq`} linkLabel={t.home.allFaq} />
            <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {t.pages.faq.items.slice(0, 3).map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded text-base font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                    {f.q}
                    <span aria-hidden="true" className="text-xl leading-none text-ink-2 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-base leading-7 text-ink">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* closing: one forest band with the campus photo under a dark scrim, the credit at the corner */}
      <section className="relative isolate overflow-hidden bg-forest text-page">
        <img src="/img/commons/kwan-phayao-sunset.webp" alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-forest via-forest/85 to-forest/55" />
        <div className={`${WRAP} ${SECTION}`}>
          <p className="text-sm font-medium text-page/85">{t.home.tagApply}</p>
          <span aria-hidden="true" className="mt-3 block h-[3px] w-8 bg-[#c79bef]" />
          <h2 className={`mt-4 ${H2}`}>{t.nav.apply}</h2>
          <p className="mt-4 text-lg text-page/90">
            {round.kind === "open" ? t.home.heroCloses.replace("{date}", dateLong(round.date)) : round.kind === "next" ? t.home.heroOpens.replace("{date}", dateLong(round.date)) : t.home.closeNone}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`/${lang}/documents/forms`} className="inline-flex h-12 items-center rounded-full bg-accent px-7 text-base font-semibold text-white transition-colors hover:bg-accent-hover">
              {t.home.applyNow}
            </a>
            <a href={`/${lang}/calendar`} className="inline-flex h-12 items-center rounded-full border border-page/50 px-7 text-base font-medium text-page transition-colors hover:bg-page/10">
              {t.home.allCalendar}
            </a>
          </div>
          <a href="#home" className={`${LINK_DARK} mt-16`}>
            ↑ {t.home.backTop}
          </a>
        </div>
        <p className="absolute bottom-3 right-3 rounded bg-forest/70 px-2 py-1 text-xs text-page md:right-4">{t.home.closeCredit}</p>
      </section>
    </main>
  );
}

