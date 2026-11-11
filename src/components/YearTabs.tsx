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
  return (
    <div>
      <div role="tablist" aria-label={t.title} className="flex flex-wrap gap-2">
        {data.map((d) => (
          <button
            key={d.year}
            type="button"
            role="tab"
            id={`year-${d.year}`}
            aria-selected={d.year === sel}
            aria-controls="year-panel"
            onClick={() => setSel(d.year)}
            className={`h-10 rounded-lg border px-4 text-sm font-medium tabular-nums ${
              d.year === sel ? "border-accent bg-accent text-white" : "border-ink/10 bg-card text-ink-2 hover:bg-raised"
            }`}
          >
            {t.yearTab} {label(d.year)}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="year-panel" aria-labelledby={`year-${cur.year}`} className="mt-8">
        <h2 className="text-xl font-medium">
          {t.resultTitle} {label(cur.year)}
          <span className="ml-3 text-sm font-normal tabular-nums text-ink-3">
            {cur.people.length} {t.count}
          </span>
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cur.people.map((p) => (
            <PasserCard key={p.id} p={p} lang={lang} />
          ))}
        </ul>
      </div>
    </div>
  );
}
