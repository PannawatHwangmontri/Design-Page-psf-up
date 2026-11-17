"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";

const CLOSE_MS = 220; // length of the close animation (.jelly-out in globals.css)

// Search in the top bar: an icon that opens into a pill input. Matching news and announcements drop down, each row jelly-pops in.
export function SiteSearch({ lang, wide = false }: { lang: Lang; wide?: boolean }) {
  const { content, news, announcements } = useSite();
  const t = content[lang].nav;
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [q, setQ] = useState("");
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // start the close animation, then unmount the field once it has played
  const close = () => {
    if (!open || closing) return;
    setClosing(true);
    timer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setQ("");
    }, CLOSE_MS);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open || closing) return;
    input.current?.focus();
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
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
  const hits = useMemo(() => {
    if (!term) return [];
    const all = [
      ...announcements.map((a) => ({ key: `a${a.id}`, title: a.title[lang], href: `/${lang}/announcement/${a.id}` })),
      ...news.map((n) => ({ key: `n${n.id}`, title: n.title[lang], href: `/${lang}/news/${n.id}` })),
    ];
    return all.filter((h) => h.title.toLowerCase().includes(term)).slice(0, 6);
  }, [term, lang, news, announcements]);

  return (
    // the box stays 36px wide; the open field overlays the bar so the nav never reflows
    <div ref={wrap} className={wide ? "relative h-9 w-full" : "relative size-11 shrink-0"}>
      {open ? (
        <div
          className={`${closing ? "jelly-out" : "jelly-pop"} absolute top-0 z-40 flex h-9 items-center gap-2 rounded-full border border-ink/10 bg-card px-3 ${wide ? "inset-x-0" : "right-0 w-56 lg:w-64"}`}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" className="shrink-0 text-ink-3">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.search}
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
          />
          <button type="button" onClick={close} aria-label="×" className="flex size-6 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-raised hover:text-ink">
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.search}
          className={
            wide
              ? "flex h-9 w-full items-center gap-2 rounded-full border border-ink/10 px-3 text-sm text-ink-3 hover:bg-raised"
              : "flex size-11 items-center justify-center rounded-full text-ink-2 hover:bg-raised hover:text-accent-ink"
          }
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          {wide && t.searchPlaceholder}
        </button>
      )}
      {open && !closing && term && (
        <ul className={`absolute top-full z-30 mt-2 rounded-xl border border-ink/10 bg-card p-1 ${wide ? "inset-x-0" : "right-0 w-72 lg:w-80"}`}>
          {hits.length === 0 ? (
            <li className="jelly-item px-3 py-2 text-sm text-ink-3">{t.searchEmpty}</li>
          ) : (
            hits.map((h, i) => (
              <li key={h.key} className="jelly-item" style={{ animationDelay: `${i * 70}ms` }}>
                <Link href={h.href} onClick={() => close()} className="block rounded-lg px-3 py-2 text-sm text-ink-2 hover:bg-accent/10 hover:text-accent-ink">
                  {h.title}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
