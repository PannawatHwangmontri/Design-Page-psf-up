// Round status from the calendar data: the open application window, else the next one to open.
// Shared by the hero and the rounds panel so both read the same dates.
export type RoundEvent = {
  round: number;
  type: "apply" | "assess" | "result";
  start: string;
  end?: string;
  note?: { th: string; en: string };
};

const DAY = 86_400_000;
const ts = (iso: string) => new Date(`${iso}T00:00`).getTime();

export function roundStatus(events: RoundEvent[], todayT: number) {
  const applies = events.filter((e) => e.type === "apply" && e.end);
  const open = applies.find((e) => ts(e.start) <= todayT && ts(e.end!) >= todayT);
  if (open) {
    return { kind: "open" as const, round: open.round, days: Math.max(0, Math.ceil((ts(open.end!) - todayT) / DAY)), date: open.end!, start: open.start, total: Math.round((ts(open.end!) - ts(open.start)) / DAY), elapsed: Math.min(Math.round((ts(open.end!) - ts(open.start)) / DAY), Math.max(0, Math.round((todayT - ts(open.start)) / DAY))) };
  }
  const next = applies.filter((e) => ts(e.start) > todayT).sort((a, b) => a.start.localeCompare(b.start))[0];
  if (next) {
    return { kind: "next" as const, round: next.round, days: Math.ceil((ts(next.start) - todayT) / DAY), date: next.start };
  }
  return { kind: "none" as const };
}
