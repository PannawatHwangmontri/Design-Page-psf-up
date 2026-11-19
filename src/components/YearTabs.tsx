"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import type { Passer } from "@/data/mock";
import { PasserCard } from "./PasserCard";

// Years (newest first, the newest is selected) + the people announced for that year. years are Buddhist years.
// Editorial layout: left column = year list and level filter, right column = search and the results.
export function YearTabs({ lang, data }: { lang: Lang; data: { year: number; people: Passer[] }[] }) {
  const t = useSite().content[lang].pages.publicity;
  const [sel, setSel] = useState(data[0]?.year);
  const [lv, setLv] = useState(0); // level filter: 0 = all, otherwise a PSF level number found in the data
  const [q, setQ] = useState("");
  const cur = data.find((d) => d.year === sel) ?? data[0];
  if (!cur) return null;
  const label = (y: number) => (lang === "th" ? y : y - 543);
  // level numbers come from the data, not a fixed list
  const levels = Array.from(
    new Set(data.flatMap((d) => d.people.map((p) => Number(p.level.en.replace(/\D/g, ""))).filter((n) => n > 0))),
  ).sort((a, b) => a - b);
  const inLevel = (n: number) => (n === 0 ? cur.people : cur.people.filter((p) => p.level.en === `Level ${n}`));
  const query = q.trim().toLowerCase();
  const matches = (p: Passer) => query === "" || `${p.name[lang]} ${p.unit[lang]}`.toLowerCase().includes(query);
  const shown = inLevel(lv).filter(matches);
  const reset = () => {
    setQ("");
    setLv(0);
  };
  return (
    <div className="font-ui grid gap-10 md:grid-cols-12 md:gap-12">
      <div className="min-w-0 md:col-span-3">
        <div className="md:sticky md:top-44">
          <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{t.yearTab}</p>
          <div role="tablist" aria-label={t.title} className="no-scrollbar -mx-4 mt-3 flex gap-6 overflow-x-auto px-4 md:mx-0 md:flex-col md:gap-1 md:px-0">
            {data.map((d) => (
              <button
                key={d.year}
                type="button"
                role="tab"
                id={`year-${d.year}`}
                aria-selected={d.year === sel}
                aria-controls="year-panel"
                onClick={() => setSel(d.year)}
                className={`flex min-h-11 shrink-0 items-baseline gap-3 py-1 text-left font-ui font-semibold text-3xl font-light tabular-nums transition-colors md:text-4xl ${
                  d.year === sel ? "text-ink" : "text-ink/35 hover:text-ink/70"
                }`}
              >
                <span aria-hidden="true" className={`h-2 w-2 shrink-0 self-center rounded-full ${d.year === sel ? "bg-accent" : "bg-transparent"}`} />
                {label(d.year)}
              </button>
            ))}
          </div>

          <p className="mt-8 font-mono text-xs tracking-[0.05em] text-ink-3">{t.level}</p>
          <div role="group" aria-label={t.levelAll} className="mt-3 flex flex-wrap gap-2">
            {[0, ...levels].map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={lv === n}
                onClick={() => setLv(n)}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors ${lv === n ? "border-accent bg-accent text-white" : "border-ink/15 text-ink-2 hover:border-ink/40 hover:text-ink"}`}
              >
                {n === 0 ? t.levelAll : `${t.level} ${n}`} <span className="ml-1 tabular-nums opacity-70">{inLevel(n).length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div key={cur.year} role="tabpanel" id="year-panel" aria-labelledby={`year-${cur.year}`} className="page-swap min-w-0 md:col-span-9">
        <div className="flex flex-col gap-2 border-b border-ink/10 pb-6 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-3xl md:text-4xl">
            {t.resultTitle} {label(cur.year)}
          </h2>
          <p className="font-mono text-xs tabular-nums tracking-[0.05em] text-ink-3">
            {shown.length} / {cur.people.length} {t.count}
          </p>
        </div>
        <div className="mt-6">
          <label className="block">
            <span className="sr-only">{t.searchLabel}</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.searchLabel}
              className="h-11 w-full rounded-full border border-ink/15 bg-page px-5 text-base text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
            />
          </label>
        </div>
        {shown.length === 0 ? (
          <div className="mt-8 flex flex-wrap items-center gap-4 text-ink-3">
            <p>{query ? t.searchNone : t.empty}</p>
            {(query || lv !== 0) && (
              <button type="button" onClick={reset} className="inline-flex h-11 items-center rounded-full border border-ink/15 px-5 text-sm font-medium text-ink hover:bg-raised">
                {t.clearFilter}
              </button>
            )}
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((p) => (
              <PasserCard key={p.id} p={p} lang={lang} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
