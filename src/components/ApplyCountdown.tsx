"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import { fmtDate } from "@/lib/lang";

const DAY = 86_400_000;

// Countdown to the next application window: days left if one is open now, otherwise days until the next one opens.
export function ApplyCountdown({ lang }: { lang: Lang }) {
  const { content, assessmentCalendars } = useSite();
  const t = content[lang].home;
  // read the clock once on mount; the text can differ between server and browser, so hydration warnings are muted
  const [now] = useState(() => Date.now());

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const todayT = today.getTime();
  const next = assessmentCalendars
    .flatMap((c) => c.events)
    .filter((e) => e.type === "apply" && e.end && new Date(`${e.end}T00:00`).getTime() >= todayT)
    .sort((a, b) => a.start.localeCompare(b.start))[0];

  // splits "… {n} … {date}" into text with the number and the date highlighted
  const fill = (template: string, n: number, date: string) =>
    template.split(/(\{n\}|\{date\})/).map((part, i) =>
      part === "{n}" ? (
        <span key={i} className="font-ui text-2xl font-semibold tabular-nums text-accent-ink">{n}</span>
      ) : part === "{date}" ? (
        <span key={i} className="font-medium text-ink">{date}</span>
      ) : (
        <span key={i}>{part}</span>
      ),
    );

  let body: React.ReactNode = t.cdNone;
  if (next && next.end) {
    const startT = new Date(`${next.start}T00:00`).getTime();
    const endT = new Date(`${next.end}T00:00`).getTime();
    if (startT <= todayT) {
      body = fill(t.cdOpen, Math.ceil((endT - todayT) / DAY), fmtDate(next.end, lang));
    } else {
      body = fill(t.cdNext, Math.ceil((startT - todayT) / DAY), fmtDate(next.start, lang));
    }
  }

  return (
    <div suppressHydrationWarning className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl bg-tint px-5 py-4 text-sm text-ink-2">
      <span className="font-mono text-[11px] tracking-[0.05em] text-accent-ink">{t.cdLabel}</span>
      <span>{body}</span>
    </div>
  );
}
