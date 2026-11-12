"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { content, type Lang } from "@/data/content";
import { announcements, news, passers } from "@/data/mock";
import { PasserCard } from "./PasserCard";
import { Placeholder } from "./Placeholder";

const PAGE = 4; // announcements shown per page
const pageBtn = "flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 bg-card text-ink-2 hover:bg-raised disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

// stagger index for [data-stagger] children (see .stagger in globals.css)
const idx = (i: number) => ({ "--i": i }) as React.CSSProperties;

const hairline ="border border-ink/10";

export default function PsfSite({ lang }: { lang: Lang }) {
  const t = content[lang];
  const track = useRef<HTMLDivElement>(null);
  // news carousel: one slide per view, endless. A clone of the first slide sits at the end;
  // once the scroll settles on it we jump (instantly, unnoticeably) back to the real first slide.
  const newsPaused = useRef(false);
  // News card <-> dialog morph (View Transitions API). The dialog carries the permanent transition name; the clicked
  // card is named only while it is the old/new side. No API or reduced motion: the dialog just opens, no animation.
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const morph = (update: () => void) => {
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return update();
    return document.startViewTransition(update);
  };
  const nameCard = (on: boolean) => cardRef.current?.style.setProperty("view-transition-name", on ? "news-morph" : "none");
  const openNews = (card: HTMLElement, i: number) => {
    cardRef.current = card;
    newsPaused.current = true;
    nameCard(true);
    morph(() => {
      nameCard(false);
      flushSync(() => setOpen(i));
      dialogRef.current?.showModal();
    });
  };
  const closeNews = () => {
    newsPaused.current = false;
    const t = morph(() => {
      nameCard(true);
      dialogRef.current?.close();
      flushSync(() => setOpen(null));
    });
    (t?.finished ?? Promise.resolve()).then(() => nameCard(false));
  };
  const slide = () => track.current?.scrollBy({ left: track.current.clientWidth, behavior: "smooth" });
  const [active, setActive] = useState(0);
  const passerTrack = useRef<HTMLUListElement>(null);
  const passersPaused = useRef(false);
  const [page, setPage] = useState(0); // announcements: PAGE per page, newest first
  const pages = Math.ceil(announcements.length / PAGE);
  const latestYear = Math.max(...announcements.map((a) => a.year));
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let settle: number;
    const onScroll = () => {
      setActive(Math.round(el.scrollLeft / el.clientWidth) % news.length);
      clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (el.scrollLeft >= news.length * el.clientWidth - 2) el.scrollTo({ left: 0, behavior: "instant" });
      }, 120);
    };
    el.addEventListener("scroll", onScroll);
    // auto-advance every 3s; paused while hovered/focused, off for reduced motion
    const id = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? undefined
      : setInterval(() => !newsPaused.current && slide(), 3000);
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(settle);
      clearInterval(id);
    };
  }, []);

  // passers drift left at a steady speed (rAF). The list is rendered twice, so when the first copy has scrolled out we
  // subtract its length and the loop is seamless. Paused on hover/focus, off for reduced motion.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const SPEED = 100; // px per second
    let raf = 0;
    let last = 0;
    let pos = 0;
    const tick = (now: number) => {
      const el = passerTrack.current;
      if (el) {
        if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft; // user / arrow moved it: follow
        if (!passersPaused.current && last) pos += ((now - last) / 1000) * SPEED;
        const loop = (el.children[passers.length] as HTMLElement).offsetLeft;
        if (loop > 0 && pos >= loop) pos -= loop;
        el.scrollLeft = pos;
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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
    <>
      <main>
        <section id="home" className="bg-tint">
          {/* banner fills the screen below the top bar + menu (6.5rem), anchored low so the title text is not cut */}
          <img src="/hero-banner.jpg" alt={t.hero.imageAlt} className="block h-auto w-full md:h-[31rem] md:object-cover md:object-[50%_100%]" />
        </section>

        <section id="news" className="relative scroll-mt-16 overflow-hidden border-t border-ink/10 bg-[color-mix(in_srgb,var(--color-tint)_30%,var(--color-page))]">
          {/* soft dot pattern fading out downward: fills the empty background without adding noise */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background-image:radial-gradient(color-mix(in_srgb,var(--color-accent)_22%,transparent)_1.2px,transparent_1.2px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-40">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-x-12">
              {/* left: news carousel (one card per view, endless, dots) */}
              <div className="flex min-w-0 flex-col">
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-3xl font-medium">
                    {t.news.title}
                  </h2>
                  <a href={`/${lang}/news`} className="text-sm font-medium text-accent-ink hover:underline">
                    {t.news.viewAll} →
                  </a>
                </div>
                <div
                  ref={track}
                  data-stagger
                  onMouseEnter={() => (newsPaused.current = true)}
                  onMouseLeave={() => (newsPaused.current = false)}
                  onFocus={() => (newsPaused.current = true)}
                  onBlur={() => (newsPaused.current = false)}
                  className="no-scrollbar mt-8 flex snap-x snap-mandatory overflow-x-auto md:min-h-0 md:flex-1"
                >
                  {/* last item = clone of the first, for the endless loop (see slide()) */}
                  {[...news, news[0]].map((n, i) => (
                    <article
                      key={i}
                      aria-hidden={i === news.length || undefined}
                      style={idx(i)}
                      className={`relative flex w-full shrink-0 snap-start flex-col overflow-hidden rounded-xl ${hairline} bg-card transition-colors hover:border-accent/40`}
                    >
                      <div className="relative flex flex-1 flex-col">
                        <Placeholder label={t.news.imageAlt} className="aspect-[16/11] bg-gradient-to-br from-tint to-raised md:aspect-auto md:min-h-72 md:flex-1" />
                        <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">{t.news.tag}</span>
                      </div>
                      <div className="p-5 md:p-8">
                        <time dateTime={n.date} className="text-xs tabular-nums text-ink-3">
                          {new Date(n.date).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </time>
                        <h3 className="mt-2 text-lg font-medium md:text-2xl">
                          {/* stretched button: the whole card opens the dialog; the hidden clone is skipped by keyboard */}
                          <button
                            type="button"
                            onClick={(e) => openNews(e.currentTarget.closest("article")!, i % news.length)}
                            tabIndex={i === news.length ? -1 : undefined}
                            className="text-left after:absolute after:inset-0 hover:text-accent-ink"
                          >
                            {n.title[lang]}
                          </button>
                        </h3>
                        <p className="mt-2 text-sm text-ink-2 md:text-base">{n.excerpt[lang]}</p>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  {news.map((n, i) => (
                    <button
                      key={n.id}
                      type="button"
                      aria-label={`${t.news.title} ${i + 1}/${news.length}`}
                      aria-current={i === active || undefined}
                      onClick={() => track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: "smooth" })}
                      className="flex h-6 w-6 items-center justify-center"
                    >
                      <span className={`h-2 w-2 rounded-full ${i === active ? "bg-accent" : "bg-ink/20"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* right: announcements list, independent of the carousel */}
              <div>
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-3xl font-medium">
                    {t.news.announcements}
                  </h2>
                  <a href={`/${lang}/announcement`} className="text-sm font-medium text-accent-ink hover:underline">
                    {t.news.viewAll} →
                  </a>
                </div>
                <ul data-lines className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                  {/* always 4 rows: a short last page is padded with invisible copies, so the arrows never move */}
                  {Array.from({ length: PAGE }, (_, i) => {
                    const shown = announcements[page * PAGE + i];
                    const a = shown ?? announcements[page * PAGE];
                    return (
                      <li key={shown ? a.id : `pad-${i}`} style={idx(i)} aria-hidden={!shown || undefined} className={`page-swap overflow-hidden ${shown ? "" : "invisible"}`}>
                        <div className={`line flex gap-6 px-4 py-5 ${a.year === latestYear ? "bg-accent/10" : ""}`}>
                          <span className="w-28 shrink-0 pt-0.5 text-sm tabular-nums text-ink-3">
                            {lang === "th" ? `พ.ศ. ${a.year}` : `B.E. ${a.year}`}
                            {a.year === latestYear && <span className="mt-2 block w-fit rounded-md bg-accent px-2.5 py-0.5 text-sm font-medium text-white">{t.news.isNew}</span>}
                          </span>
                          <div className="min-w-0">
                            <p className="line-clamp-2 font-medium" title={a.title[lang]}>
                              <a href={`/${lang}${a.href}`} className="hover:text-accent-ink">
                                {a.title[lang]}
                              </a>
                            </p>
                            <a href={`/${lang}${a.href}`} className="mt-2 inline-block text-sm font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 transition-colors hover:decoration-accent-ink">
                              {t.news.readMore}
                            </a>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label={t.news.newer} className={pageBtn}>
                    <Chevron dir="left" />
                  </button>
                  <span className="text-sm tabular-nums text-ink-3">
                    {page + 1} / {pages}
                  </span>
                  <button type="button" disabled={page === pages - 1} onClick={() => setPage(page + 1)} aria-label={t.news.older} className={pageBtn}>
                    <Chevron dir="right" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="passers" className="scroll-mt-16 border-t border-ink/10 bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-3xl font-medium">{t.passers.title}</h2>
              <a href={`/${lang}/publicity`} className="shrink-0 text-sm font-medium text-accent-ink hover:underline">
                {t.news.viewAll} →
              </a>
            </div>
            <p className="mt-2 text-ink-2">{t.passers.desc}</p>
            {/* one quiet line of counts, taken from the data */}
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm tabular-nums text-ink-3">
              <span>
                {t.passers.total} <b className="font-medium text-ink">{passers.length}</b> {t.passers.people}
              </span>
              {[1, 2, 3].map((lv) => {
                const of = passers.filter((p) => p.level.en === `Level ${lv}`);
                return (
                  <span key={lv}>
                    {of[0]?.level[lang]} <b className="font-medium text-ink">{of.length}</b> {t.passers.people}
                  </span>
                );
              })}
            </p>
            <ul
              ref={passerTrack}
              onMouseEnter={() => (passersPaused.current = true)}
              onMouseLeave={() => (passersPaused.current = false)}
              onFocus={() => (passersPaused.current = true)}
              onBlur={() => (passersPaused.current = false)} data-stagger className="no-scrollbar mt-8 flex gap-4 overflow-x-auto">
              {[...passers, ...passers].map((p, i) => (
                <PasserCard key={i} p={p} lang={lang} style={idx(i % passers.length)} tall hidden={i >= passers.length} />
              ))}
            </ul>
          </div>
        </section>

        <section id="process" className="scroll-mt-16 border-t border-ink/10">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
            <h2 className="text-3xl font-medium">{t.process.title}</h2>
            <ol data-stagger className="mt-10 grid md:grid-cols-4">
              {t.process.tiles.map((tile, i) => (
                <li key={tile.href} style={idx(i)} className="relative border-l border-ink/15 pb-10 pl-6 last:pb-0 md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pr-8 md:pt-6">
                  <span aria-hidden="true" className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full border border-accent bg-card md:-top-[5px] md:left-0" />
                  <span aria-hidden="true" className="block text-6xl font-normal tabular-nums text-accent-ink/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-medium">{tile.title}</h3>
                  <p className="mt-2 text-sm text-ink-2">{tile.desc}</p>
                  <a href={`/${lang}${tile.href}`} className="mt-4 inline-block text-sm font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 transition-colors hover:decoration-accent-ink">
                    {tile.link}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          closeNews();
        }}
        onClick={(e) => e.target === e.currentTarget && closeNews()}
        className="m-auto w-[min(32rem,calc(100%-2rem))] overflow-hidden rounded-2xl border border-ink/10 bg-card p-0 text-ink [view-transition-name:news-morph] backdrop:bg-ink/40"
      >
        {open !== null && (
          <>
            <Placeholder label={t.news.imageAlt} className="aspect-video" />
            <div className="p-6">
              <time dateTime={news[open].date} className="text-sm tabular-nums text-ink-3">
                {new Date(news[open].date).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </time>
              <h3 className="mt-2 text-2xl font-medium">{news[open].title[lang]}</h3>
              <p className="mt-4 text-ink-2">{news[open].excerpt[lang]}</p>
              <a href={`/${lang}/news`} className="mt-6 inline-flex h-12 items-center rounded-lg bg-accent px-6 font-medium text-white hover:bg-accent-hover">
                {t.news.readMore}
              </a>
            </div>
            <button
              type="button"
              onClick={closeNews}
              aria-label={t.news.close}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 bg-card/90 text-ink-2 hover:bg-raised"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </>
        )}
      </dialog>

    </>
  );
}
