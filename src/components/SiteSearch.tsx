"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";

const CLOSE_MS = 280; // length of the close animation (.search-collapse in globals.css), mirrors the 280ms open
const TRIGGER_ID = "site-search-trigger"; // the icon button; it becomes the ✕ inside the open field, and focus returns to it
const LIST_ID = "site-search-list";
const SHOW = 6; // results shown in the list; the rest go to "ดูทั้งหมด"

const icon = (size: number) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" className="shrink-0">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

// the matched part of a title in bold with a tint (not colour alone)
function highlight(title: string, term: string): ReactNode {
  const i = title.toLowerCase().indexOf(term);
  if (i < 0) return title;
  return (
    <>
      {title.slice(0, i)}
      <mark className="rounded-sm bg-accent/15 px-0.5 font-semibold text-ink">{title.slice(i, i + term.length)}</mark>
      {title.slice(i + term.length)}
    </>
  );
}

// Search in the top bar. Closed: an icon (or the full-width pill when wide). Open: a field that takes the bar's space
// between the logo and the login link while the main menu fades out. onOpenChange tells the bar to hide the menu.
export function SiteSearch({ lang, wide = false, onOpenChange }: { lang: Lang; wide?: boolean; onOpenChange?: (open: boolean) => void }) {
  const { content, news, announcements } = useSite();
  const t = content[lang].nav;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1); // highlighted result (combobox), -1 = none
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const halfTimer = useRef<number | undefined>(undefined);
  const restoreFocus = useRef(false); // set by ✕ and Esc only; a click outside must not steal focus

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  // start the close animation, then unmount the field once it has played
  const close = (returnFocus: boolean) => {
    if (!open || closing) return;
    restoreFocus.current = returnFocus;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOpen(false);
      setQ("");
      return;
    }
    setClosing(true);
    // the menu starts fading back when the field is half closed, so the two never overlap
    halfTimer.current = window.setTimeout(() => onOpenChange?.(false), CLOSE_MS / 2);
    timer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setQ("");
    }, CLOSE_MS);
  };

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      window.clearTimeout(halfTimer.current);
    },
    [],
  );

  // after the field unmounts, put focus back on the icon when the user closed it with ✕ or Esc
  useEffect(() => {
    if (!open && restoreFocus.current) {
      restoreFocus.current = false;
      document.getElementById(TRIGGER_ID)?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open || closing) return;
    input.current?.focus();
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) close(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // close is recreated each render but only reads open/closing, which are in the deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closing]);

  const term = q.trim().toLowerCase();
  const all = useMemo(() => {
    if (!term) return [];
    const items = [
      ...announcements.map((a) => ({
        key: `a${a.id}`,
        title: a.title[lang],
        href: `/${lang}/announcement/${a.id}`,
        type: t.searchTypeAnnouncement,
        meta: lang === "th" ? `พ.ศ. ${a.year}` : `B.E. ${a.year}`,
      })),
      ...news.map((n) => ({
        key: `n${n.id}`,
        title: n.title[lang],
        href: `/${lang}/news/${n.id}`,
        type: t.searchTypeNews,
        meta: new Date(n.date).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "short", year: "numeric" }),
      })),
    ];
    return items.filter((h) => h.title.toLowerCase().includes(term));
  }, [term, lang, news, announcements, t.searchTypeAnnouncement, t.searchTypeNews]);
  const hits = all.slice(0, SHOW);
  const showPanel = open && !closing && !!term;
  const status = !term ? "" : all.length ? t.searchCount.replace("{n}", String(all.length)) : t.searchEmpty;

  const go = (href: string) => {
    router.push(href);
    close(false);
  };

  // Enter opens the highlighted result (or the first); ArrowDown/ArrowUp move the highlight
  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && hits.length) {
      e.preventDefault();
      setActive((a) => (a + 1) % hits.length);
    } else if (e.key === "ArrowUp" && hits.length) {
      e.preventDefault();
      setActive((a) => (a <= 0 ? hits.length - 1 : a - 1));
    } else if (e.key === "Enter") {
      const target = hits[active >= 0 ? active : 0];
      if (target) {
        e.preventDefault();
        go(target.href);
      }
    }
  };

  const openField = !!open;
  return (
    // closed: a fixed 44px icon (or the full-width pill when wide); open: the field fills the slot, results sit under it
    <div ref={wrap} className={openField ? "absolute inset-y-0 left-0 right-0 z-40 flex items-center max-md:left-2 max-md:right-2" : wide ? "relative w-full" : "relative size-11 shrink-0"}>
      {openField ? (
        <div className={`${closing ? "search-collapse" : "search-expand"} flex h-9 w-full items-center gap-1 rounded-full bg-ink/5 pl-3`}>
          <span className="text-ink-3">{icon(14)}</span>
          <input
            ref={input}
            role="combobox"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(-1);
            }}
            onKeyDown={onInputKey}
            placeholder={t.searchPlaceholder}
            aria-label={t.search}
            aria-expanded={showPanel && hits.length > 0}
            aria-controls={showPanel && hits.length > 0 ? LIST_ID : undefined}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${LIST_ID}-${active}` : undefined}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-2"
          />
          <button
            id={TRIGGER_ID}
            type="button"
            onClick={(e) => close(e.detail === 0)} // keyboard activation only: a mouse close must not leave a focus ring on the icon
            aria-label={t.searchClose}
            aria-expanded={true}
            className="group -my-1 -mr-1 flex h-11 w-11 shrink-0 items-center justify-center text-ink-2 hover:text-ink"
          >
            <span className="flex size-7 items-center justify-center rounded-full group-hover:bg-page">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </span>
          </button>
        </div>
      ) : wide ? (
        <button
          id={TRIGGER_ID}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.search}
          aria-expanded={false}
          className="flex h-11 w-full items-center gap-2 rounded-full border border-ink/10 px-3 text-sm text-ink-3 hover:bg-raised"
        >
          {icon(16)}
          {t.searchPlaceholder}
        </button>
      ) : (
        <button
          id={TRIGGER_ID}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.search}
          aria-expanded={false}
          className="flex size-11 items-center justify-center rounded-full text-ink-2 hover:bg-raised hover:text-accent-ink"
        >
          {icon(16)}
        </button>
      )}

      {/* announced to screen readers: how many results, or none */}
      <p aria-live="polite" className="sr-only">{openField && !closing ? status : ""}</p>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-ink/10 bg-page/95 p-1 shadow-[0_10px_30px_-12px_rgba(29,22,48,0.35)] backdrop-blur-md">
          {hits.length === 0 ? (
            <p className="px-3 py-2 text-sm text-ink-3">{t.searchEmpty}</p>
          ) : (
            <ul id={LIST_ID} role="listbox" aria-label={t.search}>
              {hits.map((h, i) => (
                <li
                  key={h.key}
                  id={`${LIST_ID}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(h.href)}
                  className={`jelly-item cursor-pointer rounded-xl px-3 py-2 text-sm ${i === active ? "bg-accent/10 text-accent-ink" : "text-ink-2 hover:bg-accent/10 hover:text-accent-ink"}`}
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <span className="mb-0.5 inline-flex items-center gap-2 text-xs text-ink-3">
                    <span className="rounded-full bg-tint px-2 py-0.5 font-medium text-accent-ink">{h.type}</span>
                    <span className="tabular-nums">{h.meta}</span>
                  </span>
                  <span className="block font-medium">{highlight(h.title, term)}</span>
                </li>
              ))}
            </ul>
          )}
          {all.length > SHOW && (
            <Link href={`/${lang}/publicity`} onClick={() => close(false)} className="mt-1 block rounded-xl px-3 py-2 text-sm font-medium text-accent-ink hover:bg-accent/10">
              {t.searchAll.replace("{n}", String(all.length))}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
