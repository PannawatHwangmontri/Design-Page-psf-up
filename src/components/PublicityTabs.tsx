"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import type { Lang } from "@/data/content";
import type { Passer } from "@/data/mock";
import { Placeholder } from "@/components/Placeholder";
import { YearTabs } from "@/components/YearTabs";
import { useSite } from "@/lib/site";

type Tab = "news" | "announcements" | "passers";
type Kind = "criteria" | "result" | "other";
const TABS: Tab[] = ["news", "announcements", "passers"];
const NEWS_PER_PAGE = 9;
const ANN_PER_PAGE = 8;
const EVENT = "psf-hash-change";

// the active tab lives in the URL hash (#news, #announcements, #passers); read after mount so the server render matches
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("hashchange", cb);
    window.removeEventListener(EVENT, cb);
  };
};
const readTab = (): Tab => {
  const h = window.location.hash.slice(1);
  return TABS.includes(h as Tab) ? (h as Tab) : "news";
};

type Ann = { id: number; year: number; title: { th: string; en: string } };
type News = { id: number; date: string; image?: string; title: { th: string; en: string }; excerpt: { th: string; en: string } };

// announcement kind from its title (the data has no type field)
const kindOf = (a: Ann): Kind => {
  if (a.title.th.includes("หลักเกณฑ์")) return "criteria";
  if (a.title.th.includes("ผลการคัดเลือก")) return "result";
  return "other";
};

const btnPlain = "inline-flex h-11 items-center rounded-full border border-ink/10 bg-page px-5 text-sm font-medium text-ink hover:bg-raised";
const chip = (on: boolean) =>
  `inline-flex h-11 items-center rounded-full border px-4 text-sm transition-colors ${
    on ? "border-accent bg-accent text-white" : "border-ink/15 text-ink-2 hover:border-ink/40 hover:text-ink"
  }`;

export function PublicityTabs({
  lang,
  news,
  announcements,
  passers,
  passerTotal,
}: {
  lang: Lang;
  news: News[];
  announcements: Ann[];
  passers: { year: number; people: Passer[] }[];
  passerTotal: number;
}) {
  const { content } = useSite();
  const c = content[lang];
  const t = c.pages.publicity;
  const tab = useSyncExternalStore(subscribe, readTab, () => "news" as Tab);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [newsPage, setNewsPage] = useState(0);
  const [annPage, setAnnPage] = useState(0);
  const [annKind, setAnnKind] = useState<"all" | Kind>("all");
  const loc = lang === "th" ? "th-TH" : "en-GB";
  const fullDate = (d: string) => new Date(d).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });

  const select = (next: Tab, focus = false) => {
    window.history.replaceState(null, "", `#${next}`);
    window.dispatchEvent(new Event(EVENT));
    if (focus) tabRefs.current[next]?.focus();
    // after React renders the new panel: if the reader is further down the list, bring the panel top back into view
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const el = document.getElementById(`panel-${next}`);
        if (el && el.getBoundingClientRect().top < 0) {
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }
      }),
    );
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = TABS.length;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const j = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (i + (e.key === "ArrowRight" ? 1 : n - 1)) % n;
      select(TABS[j], true);
    }
  };

  const kinds = Array.from(new Set(announcements.map(kindOf)));
  const counts: Record<Tab, number> = { news: news.length, announcements: announcements.length, passers: passerTotal };
  const labels: Record<Tab, string> = { news: c.news.title, announcements: t.announcementsTitle, passers: t.title };

  return (
    <>
      <div className="sticky top-[70px] z-20 border-b border-ink/10 bg-page">
        <div role="tablist" aria-label={t.title} className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 md:px-8">
          {TABS.map((k, i) => (
            <button
              key={k}
              ref={(el) => {
                tabRefs.current[k] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${k}`}
              aria-selected={tab === k}
              aria-controls={`panel-${k}`}
              tabIndex={tab === k ? 0 : -1}
              onKeyDown={(e) => onKey(e, i)}
              onClick={() => select(k)}
              className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors ${
                tab === k ? "border-accent bg-accent text-white" : "border-ink/15 text-ink-2 hover:border-ink/40 hover:text-ink"
              }`}
            >
              {labels[k]}
              <span className="tabular-nums opacity-80">{counts[k]}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === "news" && (
        <section id="panel-news" role="tabpanel" aria-labelledby="tab-news" className="scroll-mt-44 mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          <NewsList lang={lang} news={news} fullDate={fullDate} page={newsPage} setPage={setNewsPage} />
        </section>
      )}

      {tab === "announcements" && (
        <section id="panel-announcements" role="tabpanel" aria-labelledby="tab-announcements" className="scroll-mt-44 mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          {kinds.length > 1 && (
            <div role="group" aria-label={t.typeAll} className="mb-6 flex flex-wrap gap-2">
              {(["all", ...kinds] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={annKind === k}
                  onClick={() => {
                    setAnnKind(k);
                    setAnnPage(0);
                  }}
                  className={chip(annKind === k)}
                >
                  {k === "all" ? t.typeAll : k === "criteria" ? t.typeCriteria : k === "result" ? t.typeResult : t.typeOther}
                </button>
              ))}
            </div>
          )}
          <AnnList lang={lang} announcements={announcements} kind={annKind} page={annPage} setPage={setAnnPage} />
        </section>
      )}

      {tab === "passers" && (
        <section id="panel-passers" role="tabpanel" aria-labelledby="tab-passers" className="scroll-mt-44 mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          <p className="max-w-2xl text-lg text-ink-2">{t.intro}</p>
          <div className="mt-10">
            <YearTabs lang={lang} data={passers} />
          </div>
        </section>
      )}
    </>
  );
}

function Pager({ page, pages, setPage, older, newer, label }: { page: number; pages: number; setPage: (p: number) => void; older: string; newer: string; label: string }) {
  if (pages <= 1) return null;
  return (
    <nav aria-label={label} className="mt-12 flex items-center justify-between gap-4 border-t border-ink/10 pt-6">
      {page > 0 ? (
        <button type="button" className={btnPlain} onClick={() => setPage(page - 1)}>
          ← {newer}
        </button>
      ) : (
        <span />
      )}
      <span className="font-mono text-sm tabular-nums text-ink-3">
        {page + 1} / {pages}
      </span>
      {page < pages - 1 ? (
        <button type="button" className={btnPlain} onClick={() => setPage(page + 1)}>
          {older} →
        </button>
      ) : (
        <span />
      )}
    </nav>
  );
}

function NewsList({ lang, news, fullDate, page, setPage }: { lang: Lang; news: News[]; fullDate: (d: string) => string; page: number; setPage: (p: number) => void }) {
  const { content } = useSite();
  const c = content[lang];
  const t = c.pages.publicity;
  const pages = Math.max(1, Math.ceil(news.length / NEWS_PER_PAGE));
  const p = Math.min(page, pages - 1);
  const shown = news.slice(p * NEWS_PER_PAGE, p * NEWS_PER_PAGE + NEWS_PER_PAGE);
  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((n, i) => (
          <li key={n.id} className={i === 0 && p === 0 ? "sm:col-span-2 lg:col-span-2" : undefined}>
            <a href={`/${lang}/news/${n.id}`} className="lift group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-card">
              {n.image ? <img src={n.image} alt={c.news.imageAlt} className="photo-dim aspect-[16/10] w-full object-cover" /> : <Placeholder label={c.news.imageAlt} className="aspect-[16/10]" />}
              <div className="flex flex-1 flex-col p-6">
                <time dateTime={n.date} className="text-sm tabular-nums text-ink-3">
                  {fullDate(n.date)}
                </time>
                <h3 className="mt-3 font-ui text-xl font-semibold leading-snug group-hover:text-accent-ink">{n.title[lang]}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-ink-2">{n.excerpt[lang]}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <Pager page={p} pages={pages} setPage={setPage} older={t.olderNews} newer={t.newerNews} label={c.news.title} />
    </>
  );
}

function AnnList({ lang, announcements, kind, page, setPage }: { lang: Lang; announcements: Ann[]; kind: "all" | Kind; page: number; setPage: (p: number) => void }) {
  const { content } = useSite();
  const t = content[lang].pages.publicity;
  const c = content[lang].news;
  const list = announcements.filter((a) => kind === "all" || kindOf(a) === kind);
  const pages = Math.max(1, Math.ceil(list.length / ANN_PER_PAGE));
  const p = Math.min(page, pages - 1);
  const shown = list.slice(p * ANN_PER_PAGE, p * ANN_PER_PAGE + ANN_PER_PAGE);
  const latestYear = Math.max(...announcements.map((a) => a.year));
  if (shown.length === 0) return <p className="py-10 text-ink-3">{t.annNone}</p>;
  return (
    <>
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {shown.map((a) => (
          <li key={a.id}>
            <a href={`/${lang}/announcement/${a.id}`} className="group flex min-h-14 items-start gap-6 py-5">
              <span className="w-24 shrink-0 pt-0.5 text-sm tabular-nums text-ink-3">
                {lang === "th" ? `พ.ศ. ${a.year}` : `B.E. ${a.year}`}
                {a.year === latestYear && <span className="mt-2 inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">{c.isNew}</span>}
              </span>
              <span className="min-w-0 flex-1 font-medium group-hover:text-accent-ink">{a.title[lang]}</span>
              <span aria-hidden="true" className="shrink-0 pt-0.5 text-ink-3 group-hover:text-accent-ink">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
      <Pager page={p} pages={pages} setPage={setPage} older={t.olderAnn} newer={t.newerAnn} label={t.announcementsTitle} />
    </>
  );
}
