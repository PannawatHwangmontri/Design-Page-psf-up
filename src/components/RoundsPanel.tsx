"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";

type Phase = "open" | "past" | "upcoming";
type Kind = "apply" | "assess" | "result";

// Assessment rounds table: the open round gets a page-coloured column with a 3px accent top rule and a badge.
// Past rounds fade. A timeline above the table shows where today sits in the open round.
// The status banner lives in the hero, so it is not repeated here.
export function RoundsPanel({ lang }: { lang: Lang }) {
  const { content, assessmentCalendars } = useSite();
  const t = content[lang];
  // read the clock once on mount; text can differ between server and browser, so hydration warnings are muted
  const [now] = useState(() => Date.now());
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const todayT = today.getTime();

  const cal = [...assessmentCalendars].sort((a, b) => b.year - a.year)[0];
  const events = cal ? cal.events : [];
  const rounds = [...new Set(events.map((e) => e.round))].sort((a, b) => a - b);
  const ts = (iso: string) => new Date(`${iso}T00:00`).getTime();
  const applyOf = (r: number) => events.find((e) => e.round === r && e.type === "apply");
  const phase = (r: number): Phase => {
    const a = applyOf(r);
    if (!a || !a.end) return "upcoming";
    if (ts(a.end) < todayT) return "past";
    if (ts(a.start) <= todayT) return "open";
    return "upcoming";
  };
  const openRound = rounds.find((r) => phase(r) === "open");
  // mobile cards: the open round first, then the rest in round order
  const ordered = [...rounds].sort((a, b) => (phase(a) === "open" ? -1 : 0) - (phase(b) === "open" ? -1 : 0) || a - b);

  const loc = lang === "th" ? "th-TH" : "en-GB";
  const dateShort = (iso: string) => new Date(`${iso}T00:00`).toLocaleDateString(loc, { day: "numeric", month: "short" });
  // Buddhist era for Thai, the last two digits only
  const yearShort = (iso: string) => String(Number(iso.slice(0, 4)) + (lang === "th" ? 543 : 0)).slice(-2);

  // a range shows the year only on the end date, and only when it crosses a year boundary
  const rangeText = (r: number, k: Kind) => {
    const e = events.find((x) => x.round === r && x.type === k);
    if (!e) return "–";
    if (!e.end) return dateShort(e.start);
    const cross = e.start.slice(0, 4) !== e.end.slice(0, 4);
    return `${dateShort(e.start)} – ${dateShort(e.end)}${cross ? ` ${yearShort(e.end)}` : ""}`;
  };

  // timeline of the open round: positions are percentages of the span from the first to the last date
  const openEvents = openRound !== undefined ? events.filter((e) => e.round === openRound) : [];
  const spanLo = openEvents.length ? Math.min(...openEvents.map((e) => ts(e.start))) : 0;
  const spanHi = openEvents.length ? Math.max(...openEvents.map((e) => ts(e.end ?? e.start))) : 1;
  const pct = (iso: string) => Math.min(100, Math.max(0, ((ts(iso) - spanLo) / Math.max(1, spanHi - spanLo)) * 100));
  const todayPct = Math.min(100, Math.max(0, ((todayT - spanLo) / Math.max(1, spanHi - spanLo)) * 100));
  const seg = (k: Kind) => openEvents.find((e) => e.type === k);

  const rows: Kind[] = ["apply", "assess", "result"];
  const colClass = (r: number) => (phase(r) === "open" ? "bg-page" : "");
  const pastNote = (r: number) => (phase(r) === "past" ? <span className="ml-2 text-[13px] font-normal text-ink-3">{t.home.pastSuffix}</span> : null);
  const openBadge = (r: number) =>
    phase(r) === "open" ? <span className="ml-2 inline-flex rounded-full bg-accent px-2.5 py-0.5 text-[13px] font-medium text-white">{t.home.openNow}</span> : null;

  return (
    <div suppressHydrationWarning className="w-full">
      {/* timeline: apply, assess, result of the open round, with a marker for today */}
      {openRound !== undefined && (
        <div className="mb-12 hidden md:block" aria-hidden="true">
          <div className="relative h-2 rounded-full bg-raised">
            {seg("apply") && <span className="absolute inset-y-0 rounded-full bg-accent" style={{ left: `${pct(seg("apply")!.start)}%`, width: `${pct(seg("apply")!.end ?? seg("apply")!.start) - pct(seg("apply")!.start)}%` }} />}
            {seg("assess") && <span className="absolute inset-y-0 rounded-full bg-ink-3" style={{ left: `${pct(seg("assess")!.start)}%`, width: `${pct(seg("assess")!.end ?? seg("assess")!.start) - pct(seg("assess")!.start)}%` }} />}
            {seg("result") && <span className="absolute -top-1 size-4 -translate-x-1/2 rounded-full bg-accent-ink" style={{ left: `${pct(seg("result")!.start)}%` }} />}
            <span className="absolute -top-2 h-6 w-0.5 -translate-x-1/2 bg-ink" style={{ left: `${todayPct}%` }} />
            <span className="absolute -top-7 -translate-x-1/2 whitespace-nowrap text-sm font-bold text-ink" style={{ left: `${todayPct}%` }}>{t.home.today}</span>
          </div>
          <div className="relative mt-3 h-5 text-sm text-ink-2">
            {rows.map((k) => {
              const e = seg(k);
              if (!e) return null;
              return (
                <span key={k} className="absolute -translate-x-0 whitespace-nowrap" style={{ left: `${pct(e.start)}%` }}>
                  {t.pages.assessment.types[k]}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* desktop: the table, full width, equal round columns */}
      <table className="hidden w-full table-fixed border-collapse text-left tabular-nums md:table">
        <caption className="sr-only">{t.home.calendarTitle}</caption>
        <colgroup>
          <col className="w-[30%]" />
          {rounds.map((r) => (
            <col key={r} style={{ width: `${70 / Math.max(1, rounds.length)}%` }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-ink/15">
            <th scope="col" className="py-3 pr-4 font-normal text-ink-2">
              &nbsp;
            </th>
            {rounds.map((r) => (
              <th key={r} scope="col" className={`border-t-[3px] py-3 pl-4 text-base font-bold ${phase(r) === "open" ? "border-accent" : "border-transparent"} ${colClass(r)} ${phase(r) === "past" ? "text-ink-3" : "text-ink"}`}>
                <span className="inline-flex flex-wrap items-center">
                  {t.pages.assessment.round} {r}
                  {openBadge(r)}
                  {pastNote(r)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((k) => (
            <tr key={k} className="border-b border-ink/10">
              <th scope="row" className="py-4 pr-4 text-base font-normal text-ink-2">
                {t.pages.assessment.types[k]}
              </th>
              {rounds.map((r) => (
                <td
                  key={r}
                  className={`py-4 pl-4 text-base ${colClass(r)} ${phase(r) === "past" ? "text-ink-3" : ""} ${k === "result" && phase(r) !== "past" ? "font-bold text-accent-ink" : ""} ${k === "result" && phase(r) === "past" ? "font-bold" : ""}`}
                >
                  {rangeText(r, k)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* mobile: one card per round, the open round first, label and value pairs, no horizontal scroll */}
      <ul className="grid gap-4 md:hidden">
        {ordered.map((r) => (
          <li key={r} className={`rounded-2xl border p-5 ${phase(r) === "open" ? "border-accent border-t-[3px] bg-page" : "border-ink/10 bg-page"}`}>
            <p className={`flex flex-wrap items-center text-lg font-bold ${phase(r) === "past" ? "text-ink-3" : "text-ink"}`}>
              {t.pages.assessment.round} {r}
              {openBadge(r)}
              {pastNote(r)}
            </p>
            <dl className="mt-4 grid gap-3">
              {rows.map((k) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-t border-ink/10 pt-3">
                  <dt className="text-base text-ink-2">{t.pages.assessment.types[k]}</dt>
                  <dd className={`text-right text-base tabular-nums ${k === "result" && phase(r) !== "past" ? "font-bold text-accent-ink" : phase(r) === "past" ? "text-ink-3" : ""}`}>{rangeText(r, k)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

