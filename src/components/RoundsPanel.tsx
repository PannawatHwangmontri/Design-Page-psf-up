"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import { fmtDate } from "@/lib/lang";
import { roundStatus } from "@/lib/rounds";

type Phase = "open" | "past" | "upcoming";
type Kind = "apply" | "assess" | "result";
type Cell = { gap: boolean; start: number; end: number };

// one symbol per phase, used on the timeline, its legend and the table row labels:
// apply = solid accent bar, assess = diagonal accent stripes, result = forest diamond
const STRIPE = "repeating-linear-gradient(135deg, var(--color-accent) 0 3px, var(--color-tint) 3px 6px)";
const STRIPE_SLATE = "repeating-linear-gradient(135deg, var(--color-ink-3) 0 3px, var(--color-tint) 3px 6px)";

function Mark({ k }: { k: Kind }) {
  if (k === "result") {
    return (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
        <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="var(--color-forest)" />
      </svg>
    );
  }
  return <span aria-hidden="true" className="inline-block h-3 w-6 shrink-0 rounded-sm" style={{ background: k === "apply" ? "var(--color-accent)" : STRIPE }} />;
}

// Assessment rounds. Left column: a condensed year timeline (only months with activity; idle runs collapse to one ⋯ cell)
// and the round table under it. Right column (lg+): the highlighted round card, using the hero's countdown logic.
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
  const endOf = (e: { start: string; end?: string }) => ts(e.end ?? e.start);
  const applyOf = (r: number) => events.find((e) => e.round === r && e.type === "apply");
  const phase = (r: number): Phase => {
    const a = applyOf(r);
    if (!a || !a.end) return "upcoming";
    if (endOf(a) < todayT) return "past";
    if (ts(a.start) <= todayT) return "open";
    return "upcoming";
  };
  const ordered = [...rounds].sort((a, b) => (phase(a) === "open" ? -1 : 0) - (phase(b) === "open" ? -1 : 0) || a - b);

  const loc = lang === "th" ? "th-TH" : "en-GB";
  const dateShort = (iso: string) => new Date(`${iso}T00:00`).toLocaleDateString(loc, { day: "numeric", month: "short" });
  // Buddhist era for Thai; the year is shown only when a range crosses a year
  const yearFull = (iso: string) => String(Number(iso.slice(0, 4)) + (lang === "th" ? 543 : 0));
  const rangeText = (r: number, k: Kind) => {
    const e = events.find((x) => x.round === r && x.type === k);
    if (!e) return "–";
    if (!e.end) return dateShort(e.start);
    const cross = e.start.slice(0, 4) !== e.end.slice(0, 4);
    return `${dateShort(e.start)} – ${dateShort(e.end)}${cross ? ` ${yearFull(e.end)}` : ""}`;
  };
  const fullLabel = (r: number, k: Kind) => {
    const e = events.find((x) => x.round === r && x.type === k);
    if (!e) return "";
    const range = e.end ? `${fmtDate(`${e.start}T00:00`, lang)} – ${fmtDate(`${e.end}T00:00`, lang)}` : fmtDate(`${e.start}T00:00`, lang);
    return `${t.pages.assessment.round} ${r} · ${t.pages.assessment.types[k]} · ${range}`;
  };

  // ---- condensed axis: months that touch any event, idle runs collapsed into one gap cell ----
  const monthStart = (x: number) => {
    const d = new Date(x);
    return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  };
  const nextMonth = (x: number) => {
    const d = new Date(x);
    return new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
  };
  const spans = events.map((e) => [ts(e.start), endOf(e)] as const);
  const cells: Cell[] = [];
  if (spans.length) {
    const lo = Math.min(...spans.map((s) => s[0]));
    const hi = Math.max(...spans.map((s) => s[1]));
    let ms = monthStart(lo);
    while (ms <= hi) {
      const me = nextMonth(ms);
      const active = spans.some(([s, e]) => s < me && e >= ms);
      const last = cells[cells.length - 1];
      if (active) cells.push({ gap: false, start: ms, end: me });
      else if (last && last.gap) last.end = me;
      else cells.push({ gap: true, start: ms, end: me });
      ms = me;
    }
  }
  const colOf = (cellIndex: number) => cellIndex + 2; // column 1 holds the round labels
  // where "today" sits: inside its cell, or at the edges when outside the whole span
  let todayCol = 2;
  let todayFrac = 0;
  if (cells.length) {
    const idx = cells.findIndex((c) => todayT >= c.start && todayT < c.end);
    if (idx >= 0) {
      todayCol = colOf(idx);
      todayFrac = cells[idx].gap ? 0.5 : (todayT - cells[idx].start) / (cells[idx].end - cells[idx].start);
    } else if (todayT < cells[0].start) {
      todayCol = colOf(0);
      todayFrac = 0;
    } else {
      todayCol = colOf(cells.length - 1);
      todayFrac = 1;
    }
  }
  const monthLabel = (x: number) => new Date(x).toLocaleDateString(loc, { month: "short" });
  // month heads carry the year at the first column and at every January; idle runs show their months
  const monthHead = (x: number, j: number) => (
    <>
      {monthLabel(x)}
      {(j === 0 || new Date(x).getMonth() === 0) && <span className="block text-sm text-ink">{Number(new Date(x).getFullYear()) + (lang === "th" ? 543 : 0)}</span>}
    </>
  );
  const gapLabel = (c: Cell) => `${monthLabel(c.start)}–${monthLabel(c.end - 1)}`;

  const rows: Kind[] = ["apply", "assess", "result"];
  const colClass = (r: number) => (phase(r) === "open" ? "bg-page" : "");
  const pastNote = (r: number) => (phase(r) === "past" ? <span className="ml-2 text-sm font-normal text-ink-2">{t.home.pastSuffix}</span> : null);
  const openBadge = (r: number) =>
    phase(r) === "open" ? <span className="ml-2 text-sm font-bold text-accent-ink">{t.home.openNow}</span> : null;
  // the result date is bold only in the open round
  const cellText = (r: number, k: Kind) => {
    const p = phase(r);
    if (p === "past") return "font-normal text-ink-2";
    if (k === "result" && p === "open") return "font-bold text-accent-ink";
    return "font-normal text-ink";
  };

  // one fragment of a bar inside one month cell
  const fragment = (r: number, k: Kind, ci: number) => {
    const e = events.find((x) => x.round === r && x.type === k);
    const c = cells[ci];
    if (!e || !c || c.gap) return null;
    const es = ts(e.start);
    const ee = endOf(e);
    if (k === "result") {
      if (es < c.start || es >= c.end) return null;
      const frac = (es - c.start) / (c.end - c.start);
      return (
        <span key={k} role="img" tabIndex={0} aria-label={fullLabel(r, k)} className="group absolute inset-y-0 w-4 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" style={{ left: `calc(${frac * 100}% - 8px)` }}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className="absolute left-0 top-1/2 -translate-y-1/2">
            <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="var(--color-forest)" />
          </svg>
          <Tip text={fullLabel(r, k)} />
        </span>
      );
    }
    if (!(es < c.end && ee >= c.start)) return null;
    const fs = Math.max(es, c.start);
    const fe = Math.min(ee, c.end);
    const left = ((fs - c.start) / (c.end - c.start)) * 100;
    const width = Math.max(0.8, ((fe - fs) / (c.end - c.start)) * 100);
    return (
      <span key={k} role="img" tabIndex={0} aria-label={fullLabel(r, k)} className="group absolute inset-y-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" style={{ left: `${left}%`, width: `${width}%`, background: phase(r) === "open" ? (k === "apply" ? "var(--color-accent)" : STRIPE) : k === "apply" ? "var(--color-ink-3)" : STRIPE_SLATE }}>
        <Tip text={fullLabel(r, k)} />
      </span>
    );
  };
  const Tip = ({ text }: { text: string }) => (
    <span className="pointer-events-none absolute -top-9 left-0 z-20 hidden whitespace-nowrap rounded-md bg-forest px-2.5 py-1 text-sm text-page group-hover:block group-focus-visible:block">{text}</span>
  );

  // caption under each round's bar row, the short ranges of all three phases
  const caption = (r: number) => (
    <p className="text-sm text-ink-2">
      {rows.map((k, i) => (
        <span key={k}>
          {i > 0 && " · "}
          {k === "apply" && t.home.captApply.replace("{range}", rangeText(r, k))}
          {k === "assess" && t.home.captAssess.replace("{range}", rangeText(r, k))}
          {k === "result" && t.home.captResult.replace("{date}", dateShort(events.find((x) => x.round === r && x.type === "result")?.start ?? "2000-01-01"))}
        </span>
      ))}
    </p>
  );

  // ---- right card: the same status the hero uses ----
  const status = roundStatus(events, todayT);
  const nextStep = (r: number) => {
    const upcoming = events.filter((e) => e.round === r && ts(e.start) > todayT).sort((a, b) => a.start.localeCompare(b.start))[0];
    const when = fmtDate(`${upcoming?.start ?? "2000-01-01"}T00:00`, lang);
    if (!upcoming) return null;
    return upcoming.type === "assess" ? t.home.assessFrom.replace("{date}", when) : upcoming.type === "result" ? t.home.resultOn.replace("{date}", when) : t.home.applyFrom.replace("{date}", when);
  };
  const cardRound = status.kind === "none" ? undefined : status.round;

  const gridCols = `9rem ${cells.map((c) => (c.gap ? "5rem" : "minmax(0,1fr)")).join(" ")}`;
  const barRow = (i: number) => 2 + i * 2;

  return (
    <div suppressHydrationWarning className="w-full">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0">
          {/* condensed year timeline */}
          {rounds.length > 0 && cells.length > 0 && (
            <div role="group" aria-label={t.home.calendarTitle} className="hidden md:block">
              <div className="grid items-center" style={{ gridTemplateColumns: gridCols }}>
                <div />
                {cells.map((c, j) => (
                  <div key={c.start} style={{ gridColumn: colOf(j), gridRow: 1 }} className={`h-11 whitespace-nowrap text-sm leading-5 text-ink-2 ${c.gap ? "text-center" : "border-l border-ink/15 pl-1.5"}`} aria-hidden="true">
                    {c.gap ? gapLabel(c) : monthHead(c.start, j)}
                  </div>
                ))}
                {rounds.map((r, i) => (
                  <div key={r} className="contents">
                    <div style={{ gridColumn: 1, gridRow: barRow(i) }} className={`pr-4 text-base font-bold ${phase(r) === "past" ? "text-ink-2" : "text-ink"}`}>
                      {t.pages.assessment.round} {r}
                    </div>
                    {cells.map((c, j) =>
                      c.gap ? (
                        <div key={j} style={{ gridColumn: colOf(j), gridRow: barRow(i) }} className="flex items-center justify-center text-sm text-ink-2" aria-hidden="true">
                          ⋯
                        </div>
                      ) : (
                        <div key={j} style={{ gridColumn: colOf(j), gridRow: barRow(i) }} className="relative h-7">
                          {rows.map((k) => fragment(r, k, j))}
                        </div>
                      ),
                    )}
                    <div style={{ gridColumn: "2 / -1", gridRow: barRow(i) + 1 }} className="pb-3 pt-1">
                      {caption(r)}
                    </div>
                  </div>
                ))}
                {/* today: one line across all rows */}
                <div aria-hidden="true" className="pointer-events-none relative" style={{ gridColumn: todayCol, gridRow: `1 / span ${1 + rounds.length * 2}` }}>
                  <span className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: `${todayFrac * 100}%` }} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 pl-36 text-sm text-ink-2">
                {rows.map((k) => (
                  <span key={k} className="inline-flex items-center gap-2">
                    <Mark k={k} />
                    {t.pages.assessment.types[k]}
                  </span>
                ))}
                <span className="inline-flex items-center gap-2 font-bold text-ink">
                  <span aria-hidden="true" className="h-4 w-0.5 bg-ink" />
                  {t.home.today}
                </span>
              </div>
            </div>
          )}

          {/* desktop table, same width as the timeline column */}
          <table className="mt-10 hidden w-full table-fixed border-collapse text-left tabular-nums md:table">
            <caption className="sr-only">{t.home.calendarTitle}</caption>
            <colgroup>
              <col style={{ width: "9rem" }} />
              {rounds.map((r) => (
                <col key={r} style={{ width: `calc((100% - 9rem) / ${Math.max(1, rounds.length)})` }} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-ink/15">
                <th scope="col" className="py-3 pr-4 font-normal text-ink-2">
                  &nbsp;
                </th>
                {rounds.map((r) => (
                  <th key={r} scope="col" className={`border-t-[3px] py-3 pl-4 text-base font-bold ${phase(r) === "open" ? "border-accent" : "border-transparent"} ${colClass(r)} ${phase(r) === "past" ? "text-ink-2" : "text-ink"}`}>
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
                  <th scope="row" className="py-3 pr-4 text-base font-normal text-ink-2">
                    <span className="inline-flex items-center gap-2">
                      <Mark k={k} />
                      {t.pages.assessment.types[k]}
                    </span>
                  </th>
                  {rounds.map((r) => (
                    <td key={r} className={`py-3 pl-4 text-base ${colClass(r)} ${cellText(r, k)}`}>
                      {rangeText(r, k)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* highlight card: the open round, or the next one when nothing is open */}
        <aside className="hidden rounded-xl bg-page p-8 lg:block">
          {status.kind === "none" ? (
            <p className="text-lg font-bold">{t.home.cdNone}</p>
          ) : (
            <>
              <span className="text-sm font-bold text-accent-ink">{status.kind === "open" ? t.home.openNow : t.home.nextRoundBadge}</span>
              <p className="mt-5 text-xl font-bold">
                {t.pages.assessment.round} {cardRound}
              </p>
              <p className="mt-4 text-7xl font-bold leading-none tabular-nums">{status.days}</p>
              <p className="mt-3 text-base text-ink-2">
                {status.kind === "open" ? t.home.closesOn.replace("{date}", fmtDate(`${status.date}T00:00`, lang)) : t.home.applyFrom.replace("{date}", fmtDate(`${status.date}T00:00`, lang))}
              </p>
              {cardRound !== undefined && nextStep(cardRound) && (
                <p className="mt-6 border-t border-ink/10 pt-4 text-base">
                  <span className="block text-sm text-ink-2">{t.home.cardNext}</span>
                  {nextStep(cardRound)}
                </p>
              )}
            </>
          )}
          <a href={`/${lang}/documents/forms`} className="mt-6 inline-flex h-12 items-center rounded-full bg-accent px-7 text-base font-semibold text-white transition-colors hover:bg-accent-hover">
            {t.home.applyNow}
          </a>
        </aside>
      </div>

      {/* mobile: one card per round, the open round first */}
      <ul className="grid gap-4 md:hidden">
        {ordered.map((r) => (
          <li key={r} className={`rounded-xl border p-5 ${phase(r) === "open" ? "border-accent border-t-[3px] bg-page" : "border-ink/10 bg-page"}`}>
            <p className={`flex flex-wrap items-center text-lg font-bold ${phase(r) === "past" ? "text-ink-2" : "text-ink"}`}>
              {t.pages.assessment.round} {r}
              {openBadge(r)}
              {pastNote(r)}
            </p>
            <dl className="mt-4 grid gap-3">
              {rows.map((k) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-t border-ink/10 pt-3">
                  <dt className="inline-flex items-center gap-2 text-base text-ink-2">
                    <Mark k={k} />
                    {t.pages.assessment.types[k]}
                  </dt>
                  <dd className={`text-right text-base tabular-nums ${cellText(r, k)}`}>{rangeText(r, k)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
