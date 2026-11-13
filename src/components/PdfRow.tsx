"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import type { Manual } from "@/data/mock";

// One announcement file: year, title, "view here" (the PDF opens inside the page) and download.
export function PdfRow({ lang, item }: { lang: Lang; item: Manual }) {
  const t = useSite().content[lang].pages.manuals;
  const [open, setOpen] = useState(false);
  const year = lang === "th" ? item.year : item.year - 543;
  return (
    <li className="py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex min-w-0 gap-6">
          <span className="w-24 shrink-0 pt-0.5 font-mono text-xs tabular-nums tracking-[0.05em] text-ink-3">
            {t.yearLabel} {year}
          </span>
          <p className="font-serif text-xl font-light leading-snug">{item.title[lang]}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`pdf-${item.id}`}
            onClick={() => setOpen(!open)}
            className="inline-flex h-10 items-center rounded-full border border-ink/20 px-4 text-sm font-medium hover:border-ink/50"
          >
            {open ? t.hide : t.view}
          </button>
          <a href={item.file} download className="inline-flex h-10 items-center rounded-full bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover">
            {t.download}
          </a>
        </div>
      </div>
      {open && (
        <div id={`pdf-${item.id}`} className="mt-6">
          <iframe src={`${item.file}#view=FitH`} title={item.title[lang]} className="h-[75vh] w-full rounded-xl border border-ink/10 bg-card" />
          <p className="mt-2 text-xs text-ink-3">{t.hint}</p>
        </div>
      )}
    </li>
  );
}
