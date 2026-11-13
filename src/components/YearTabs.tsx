"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import type { Passer } from "@/data/mock";
import { PasserCard } from "./PasserCard";

// Year tabs (newest first, the newest is selected) + the people announced for that year. years are Buddhist years.
export function YearTabs({ lang, data }: { lang: Lang; data: { year: number; people: Passer[] }[] }) {
  const t = useSite().content[lang].pages.publicity;
  const [sel, setSel] = useState(data[0]?.year);
  const [lv, setLv] = useState(0); // level filter: 0 = all, 1-3 = PSF level
  const cur = data.find((d) => d.year === sel) ?? data[0];
  if (!cur) return null;
  const label = (y: number) => (lang === "th" ? y : y - 543);
  const inLevel = (n: number) => (n === 0 ? cur.people : cur.people.filter((p) => p.level.en === `Level ${n}`));
  const shown = inLevel(lv);
  return (
    <div>
      {/* underline tabs: the selected year gets the accent line, the rest stay quiet */}
      <div role="tablist" aria-label={t.title} className="no-scrollbar -mx-4 flex gap-8 overflow-x-auto border-b border-ink/10 px-4 md:mx-0 md:px-0">
        {data.map((d) => (
          <button
            key={d.year}
            type="button"
            role="tab"
            id={`year-${d.year}`}
            aria-selected={d.year === sel}
            aria-controls="year-panel"
            onClick={() => setSel(d.year)}
            className={`-mb-px shrink-0 border-b-2 pb-3 text-base tabular-nums transition-colors ${
              d.year === sel ? "border-accent font-medium text-accent-ink" : "border-transparent text-ink-2 hover:text-ink"
            }`}
          >
            {t.yearTab} {label(d.year)}
          </button>
        ))}
      </div>
      <div key={cur.year} role="tabpanel" id="year-panel" aria-labelledby={`year-${cur.year}`} className="page-swap mt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-2xl font-medium">
            {t.resultTitle} {label(cur.year)}
          </h2>
          <p className="text-sm tabular-nums text-ink-3">
            {cur.people.length} {t.count}
          </p>
        </div>
        {/* level filter: pill buttons with the count of the selected year */}
        <div role="group" aria-label={t.levelAll} className="mt-6 flex flex-wrap gap-2">
          {[0, 1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={lv === n}
              onClick={() => setLv(n)}
              className={`rounded-lg border px-4 py-1.5 text-sm transition-colors ${lv === n ? "border-accent bg-accent font-medium text-white" : "border-ink/15 text-ink-2 hover:bg-accent/10 hover:text-accent-ink"}`}
            >
              {n === 0 ? t.levelAll : `${t.level} ${n}`}{" "}
              <span className="tabular-nums opacity-70">{inLevel(n).length}</span>
            </button>
          ))}
        </div>
        {shown.length === 0 ? (
          <p className="mt-8 text-ink-3">{t.empty}</p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <PasserCard key={p.id} p={p} lang={lang} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
