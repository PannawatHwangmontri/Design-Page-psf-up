"use client";

import { useState } from "react";
import { content, type Lang } from "@/data/content";
import type { Passer } from "@/data/mock";
import { PasserCard } from "./PasserCard";

// Year tabs (newest first, the newest is selected) + the people announced for that year. years are Buddhist years.
export function YearTabs({ lang, data }: { lang: Lang; data: { year: number; people: Passer[] }[] }) {
  const t = content[lang].pages.publicity;
  const [sel, setSel] = useState(data[0].year);
  const cur = data.find((d) => d.year === sel) ?? data[0];
  const label = (y: number) => (lang === "th" ? y : y - 543);
  const levels = [1, 2, 3].map((lv) => ({ lv, n: cur.people.filter((p) => p.level.en === `Level ${lv}`).length }));
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
            {levels.map((x) => (
              <span key={x.lv}>
                {" · "}
                {cur.people.find((p) => p.level.en === `Level ${x.lv}`)?.level[lang] ?? `${x.lv}`}: {x.n}
              </span>
            ))}
          </p>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cur.people.map((p) => (
            <PasserCard key={p.id} p={p} lang={lang} />
          ))}
        </ul>
      </div>
    </div>
  );
}
