"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { content, type Lang } from "@/data/content";
import { announcements, news, passers } from "@/data/mock";
import { PasserCard } from "./PasserCard";
import { Placeholder } from "./Placeholder";
import { ripple } from "./ripple";
import { TextEffect } from "./TextEffect";

const PAGE = 4; // announcements shown per page
const PASSER_PAGE = 6; // applicant cards per page (3 columns x 2 rows)
const pageBtn = "flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 bg-card text-ink-2 hover:bg-raised disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card";

function Pager({ page, pages, onPage, prev, next }: { page: number; pages: number; onPage: (p: number) => void; prev: string; next: string }) {
  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <button type="button" disabled={page === 0} onClick={() => onPage(page - 1)} aria-label={prev} className={pageBtn}>
        <Chevron dir="left" />
      </button>
      <span className="text-sm tabular-nums text-ink-3">
        {page + 1} / {pages}
      </span>
      <button type="button" disabled={page === pages - 1} onClick={() => onPage(page + 1)} aria-label={next} className={pageBtn}>
        <Chevron dir="right" />
      </button>
    </div>
  );
}

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
  const [passerPage, setPasserPage] = useState(0);
  const [page, setPage] = useState(0); // announcements: PAGE per page, newest first
  const pages = Math.ceil(announcements.length / PAGE);
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
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
            <div className="rise">
              <p className="text-sm text-ink-2">{t.hero.eyebrow}</p>
              <TextEffect as="h1" text={t.hero.title} delay={200} step={40} className="mt-4 block text-4xl font-medium leading-[1.2] md:text-5xl md:leading-[1.2]" />
              {/* description starts when the title has finished */}
              <TextEffect as="p" text={t.hero.desc} delay={200 + [...t.hero.title].length * 40 + 200} step={12} className="mt-6 block max-w-xl text-lg leading-8 text-ink-2" />
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <a href="#passers" onClick={ripple} className="relative inline-flex h-12 overflow-hidden items-center rounded-lg bg-accent px-6 font-medium text-white hover:bg-accent-hover">
                  {t.hero.cta}
                </a>
                <a href="#news" className="font-medium text-ink-2 underline decoration-ink/20 underline-offset-4 hover:text-ink">
                  {t.hero.cta2}
                </a>
              </div>
            </div>
            <Placeholder label={t.hero.imageAlt} className="rise aspect-[4/3] rounded-2xl bg-white/60! text-ink-2!" />
          </div>
        </section>

        <section id="news" className="scroll-mt-16 border-t border-ink/10">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
            <div className="grid gap-12 md:grid-cols-2 md:gap-x-32">
              {/* left: news carousel (one card per view, endless, dots) */}
              <div className="min-w-0">
                <h2 className="text-3xl font-medium">{t.news.title}</h2>
                <div
                  ref={track}
                  data-stagger
                  onMouseEnter={() => (newsPaused.current = true)}
                  onMouseLeave={() => (newsPaused.current = false)}
                  onFocus={() => (newsPaused.current = true)}
                  onBlur={() => (newsPaused.current = false)}
                  className="no-scrollbar mt-8 flex snap-x snap-mandatory overflow-x-auto"
                >
                  {/* last item = clone of the first, for the endless loop (see slide()) */}
                  {[...news, news[0]].map((n, i) => (
                    <article
                      key={i}
                      aria-hidden={i === news.length || undefined}
                      style={idx(i)}
                      className={`relative w-full shrink-0 snap-start overflow-hidden rounded-xl ${hairline} bg-card`}
                    >
                      <Placeholder label={t.news.imageAlt} className="aspect-video" />
                      <div className="p-4 md:p-6">
                        <time dateTime={n.date} className="text-xs tabular-nums text-ink-3">
                          {new Date(n.date).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </time>
                        <h3 className="mt-2 text-base font-medium md:text-xl">
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
                <h2 className="text-3xl font-medium">{t.news.announcements}</h2>
                <ul data-lines className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                  {/* always 4 rows: a short last page is padded with invisible copies, so the arrows never move */}
                  {Array.from({ length: PAGE }, (_, i) => {
                    const shown = announcements[page * PAGE + i];
                    const a = shown ?? announcements[page * PAGE];
                    return (
                      <li key={shown ? a.id : `pad-${i}`} style={idx(i)} aria-hidden={!shown || undefined} className={`overflow-hidden ${shown ? "" : "invisible"}`}>
                        <div className="line py-4">
                        <time dateTime={a.date} className="text-xs tabular-nums text-ink-3">
                          {new Date(a.date).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </time>
                        <p className="mt-1 font-medium">
                          <a href={`/${lang}${a.href}`} className="hover:text-accent-ink">
                            {a.title[lang]}
                          </a>
                        </p>
                        <a href={`/${lang}${a.href}`} className="mt-2 inline-block text-sm font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink">
                          {t.news.readMore}
                        </a>
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

        <section id="passers" className="scroll-mt-16 border-t border-ink/10">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
            <h2 className="text-3xl font-medium">{t.passers.title}</h2>
            <p className="mt-2 text-ink-2">{t.passers.desc}</p>
            <ul data-stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {passers.slice(passerPage * PASSER_PAGE, (passerPage + 1) * PASSER_PAGE).map((p, i) => (
                <PasserCard key={p.id} p={p} lang={lang} style={idx(i)} />
              ))}
            </ul>
            {/* shortcut: a short last page moves the arrows up; mock data divides evenly, pad rows if real data does not */}
            <Pager page={passerPage} pages={Math.ceil(passers.length / PASSER_PAGE)} onPage={setPasserPage} prev={t.passers.prev} next={t.passers.next} />
          </div>
        </section>

        <section id="about" className="scroll-mt-16 border-t border-ink/10">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
            <h2 className="text-3xl font-medium">{t.about.title}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-2">{t.about.intro}</p>
            <h3 className="mt-12 text-sm text-ink-3">{t.about.missionTitle}</h3>
            <ul data-stagger className="mt-4 grid gap-4 md:grid-cols-3">
              {t.about.mission.map((m, i) => (
                <li key={i} style={idx(i)} className={`rounded-xl ${hairline} bg-card p-6`}>
                  <span className="block text-sm tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-4 block text-base">{m}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink-3">{t.about.note}</p>
          </div>
        </section>

        <section id="process" className="scroll-mt-16 border-t border-ink/10">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
            <h2 className="text-3xl font-medium">{t.process.title}</h2>
            <ul className="bento mt-8">
              {t.process.tiles.map((tile, i) => (
                <li key={tile.label} className={`bento-tile bento-${i + 1} relative`}>
                  <span className="font-mono text-xs tracking-wide text-ink-3">{tile.label}</span>
                  <div>
                    <h3 className={i === 0 ? "text-2xl font-medium" : "text-lg font-medium"}>
                      <a href={`/${lang}/process`} className="after:absolute after:inset-0">
                        {tile.title}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-ink-2">{tile.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
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
