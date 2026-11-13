"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";

type Ev = { round: number; type: "apply" | "assess" | "result"; start: string; end?: string; note?: { th: string; en: string } };
type Doc = { id: number; year: number; title: { th: string; en: string }; file: string; poster?: string };

// One year of the calendar: poster, the dates of both rounds, the PDF download and the PDF shown inline.
// borrowedFrom = the B.E. year whose schedule/poster fill in when this year has none (labelled as a sample).
export function CalendarYear({ lang, doc, events, borrowedFrom }: { lang: Lang; doc: Doc; events?: Ev[]; borrowedFrom?: number }) {
  const t = useSite().content[lang];
  const c = t.pages.calendar;
  const [open, setOpen] = useState(false);
  const has = !!doc.file && doc.file !== "#";
  const year = lang === "th" ? doc.year : doc.year - 543;
  const loc = lang === "th" ? "th-TH" : "en-GB";
  const day = (d: string) => new Date(d).toLocaleDateString(loc, { day: "numeric", month: "short" });
  const when = (e?: Ev) => (!e ? "–" : e.note ? e.note[lang] : e.end ? `${day(e.start)} – ${day(e.end)}` : day(e.start));
  const rounds = events ? [...new Set(events.map((e) => e.round))].sort() : [];

  return (
    <article id={`y${doc.year}`} className="scroll-mt-28 border-t border-ink/10 py-14 first:border-t-0 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.05em] text-ink-3">
            {t.pages.assessment.calendarTitle}
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl">
            {t.home.yearLabel} {year}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {has ? (
            <>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`pdf-${doc.id}`}
                onClick={() => setOpen(!open)}
                className="inline-flex h-10 items-center rounded-full border border-ink/20 px-5 text-sm font-medium hover:border-ink/50"
              >
                {open ? c.hideDoc : c.viewDoc}
              </button>
              <a href={doc.file} download className="inline-flex h-10 items-center rounded-full bg-accent px-5 text-sm font-medium text-white hover:bg-accent-hover">
                {c.download}
              </a>
            </>
          ) : null}
        </div>
      </div>

      {borrowedFrom && (
        <p className="mt-6 inline-block rounded-lg border border-ink/15 px-3 py-1.5 text-sm text-ink-2">
          {c.borrowed.replace("{y}", String(lang === "th" ? borrowedFrom : borrowedFrom - 543))}
        </p>
      )}

      <div className="mt-10 grid items-start gap-6 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          {doc.poster ? (
            <img src={doc.poster} alt={`${c.posterAlt} ${t.home.yearLabel} ${year}`} className="aspect-video w-full rounded-xl border border-ink/10 object-cover" />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-ink/20 bg-raised text-sm text-ink-3">{c.posterPending}</div>
          )}
        </div>
        <div className="md:col-span-7">
          {rounds.length === 0 ? (
            <p className="rounded-xl border border-ink/10 bg-card p-6 text-ink-3">{c.noSchedule}</p>
          ) : (
            <div className="rounded-xl border border-ink/10 bg-card p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="font-mono text-xs tracking-[0.05em] text-ink-3">
                    <th scope="col" className="pb-3 pr-4 font-normal">
                      {t.home.activity}
                    </th>
                    {rounds.map((r) => (
                      <th key={r} scope="col" className="pb-3 pr-4 font-normal">
                        {t.pages.assessment.round} {r}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 border-t border-ink/10">
                  {(["apply", "assess", "result"] as const).map((k) => (
                    <tr key={k}>
                      <th scope="row" className="py-4 pr-4 align-top font-medium">
                        {t.pages.assessment.types[k]}
                      </th>
                      {rounds.map((r) => (
                        <td key={r} className="py-4 pr-4 align-top tabular-nums text-ink-2">
                          {when(events?.find((e) => e.round === r && e.type === k))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-4 text-sm text-ink-2">{doc.title[lang]}</p>
        </div>
      </div>

      {has && open && (
        <div id={`pdf-${doc.id}`} className="mt-8">
          <iframe src={`${doc.file}#view=FitH`} title={doc.title[lang]} className="h-[75vh] w-full rounded-xl border border-ink/10 bg-card" />
          <p className="mt-2 text-xs text-ink-3">{c.viewHint}</p>
        </div>
      )}
    </article>
  );
}

type Cal = { year: number; events: Ev[] };

// A year without a schedule or poster borrows them from the nearest year that has one, so the page never looks empty.
// Returns the props for <CalendarYear>; borrowedFrom is set only when something was borrowed.
export function withFallback(doc: Doc, docs: Doc[], cals: Cal[]) {
  const near = <T extends { year: number }>(a: T[]): T | undefined => [...a].sort((x, y) => Math.abs(x.year - doc.year) - Math.abs(y.year - doc.year) || y.year - x.year)[0];
  const own = cals.find((c) => c.year === doc.year);
  const fbCal = own ? undefined : near(cals.filter((c) => c.year !== doc.year));
  const fbPoster = doc.poster ? undefined : near(docs.filter((d) => d.poster && d.year !== doc.year));
  const from = fbCal?.year ?? fbPoster?.year;
  return {
    doc: { ...doc, poster: doc.poster ?? fbPoster?.poster },
    events: (own ?? fbCal)?.events,
    borrowedFrom: from,
  };
}
