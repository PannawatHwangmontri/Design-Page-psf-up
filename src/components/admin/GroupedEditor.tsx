"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import { BE_YEARS, type Item, type ListSchema } from "@/data/admin-schema";
import { btnLine, input, type Ui } from "./Field";
import { ListEditor } from "./ListEditor";

// Records grouped by year ({ year, [itemsKey]: records[] }): year tabs, add / delete a year, and a list editor per year.
export function GroupedEditor({
  groups,
  itemsKey,
  onChange,
  schema,
  lang,
  ui,
  ids,
  normalize,
}: {
  groups: Item[];
  itemsKey: string;
  onChange: (groups: Item[]) => boolean;
  schema: ListSchema;
  lang: Lang;
  ui: Ui;
  ids?: { next: () => number };
  normalize?: (item: Item, year: number) => Item;
}) {
  const sorted = [...groups].sort((a, b) => b.year - a.year);
  const [sel, setSel] = useState<number | null>(null);
  const cur = sorted.find((g) => g.year === sel) ?? sorted[0];
  const label = (y: number) => (lang === "th" ? y : y - 543);
  const free = BE_YEARS.filter((y) => !groups.some((g) => g.year === y)).reverse();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-ink/10 pb-4">
        {sorted.map((g) => (
          <button
            key={g.year}
            type="button"
            aria-pressed={g.year === cur?.year}
            onClick={() => setSel(g.year)}
            className={`h-10 rounded-lg px-4 text-sm tabular-nums ${g.year === cur?.year ? "bg-accent font-medium text-white" : "border border-ink/20 text-ink-2 hover:bg-raised"}`}
          >
            {label(g.year)}
          </button>
        ))}
        <select
          aria-label={ui.addYear}
          value=""
          onChange={(e) => {
            const y = Number(e.target.value);
            if (y && onChange([...groups, { year: y, [itemsKey]: [] }])) setSel(y);
          }}
          className={`${input} !w-auto`}
        >
          <option value="">+ {ui.addYear}</option>
          {free.map((y) => (
            <option key={y} value={y}>
              {label(y)}
            </option>
          ))}
        </select>
        {cur && (
          <button
            type="button"
            onClick={() => confirm(ui.confirmDeleteYear) && onChange(groups.filter((g) => g.year !== cur.year))}
            className={`${btnLine} ml-auto`}
          >
            {ui.deleteYear}
          </button>
        )}
      </div>

      {cur ? (
        <ListEditor
          key={cur.year}
          items={cur[itemsKey]}
          schema={schema}
          lang={lang}
          ui={ui}
          ids={ids}
          normalize={normalize && ((it) => normalize(it, cur.year))}
          onChange={(items) => onChange(groups.map((g) => (g.year === cur.year ? { ...g, [itemsKey]: items } : g)))}
        />
      ) : (
        <p className="rounded-xl border border-dashed border-ink/20 p-8 text-center text-ink-3">{ui.empty}</p>
      )}
    </div>
  );
}
