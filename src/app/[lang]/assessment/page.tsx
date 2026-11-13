"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { downloadBtn } from "@/components/DetailPage";
import { WithLang } from "@/components/WithLang";
import type { Lang } from "@/data/content";
import { fmtDate } from "@/lib/lang";
import type { SiteData } from "@/lib/site";

// Assessment: dark photo band holding the "now" box with a countdown, then a sticky year column beside a ledger of the latest year's
// periods (only those that have an activity) and the request form
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <WithLang params={params}>{(lang, site) => <Assessment lang={lang} site={site} />}</WithLang>;
}

const DAY = 864e5;
const subscribeNever = () => () => {};
const localMidnight = () => new Date().setHours(0, 0, 0, 0);
const at = (iso: string) => new Date(`${iso}T00:00:00`);

function Assessment({ lang, site }: { lang: Lang; site: SiteData }) {
  const t = site.content[lang].pages.assessment;
  const locale = lang === "th" ? "th-TH" : "en-GB";
  // "today" only exists in the browser (null while rendering on the server, so the timeline shows dates without status)
  const todayMs = useSyncExternalStore(subscribeNever, localMidnight, () => null);
  const today = todayMs === null ? null : new Date(todayMs);

  const cal = site.assessmentCalendars.reduce((a, b) => (b.year > a.year ? b : a));
  const year = lang === "th" ? cal.year : cal.year - 543;
  const events = [...cal.events].sort((a, b) => a.start.localeCompare(b.start));
  const short = (iso: string) => at(iso).toLocaleDateString(locale, { day: "numeric", month: "short" });
  const days = (iso: string) => (today ? Math.round((at(iso).getTime() - today.getTime()) / DAY) : 0);
  const fill = (s: string, n: number) => s.replace("{n}", String(n));

  type Ev = (typeof events)[number];
  const state = (e: Ev): "past" | "now" | "next" | null => (!today ? null : days(e.end ?? e.start) < 0 ? "past" : days(e.start) <= 0 ? "now" : "next");
  const openApply = events.find((e) => e.type === "apply" && state(e) === "now");
  const current = openApply ?? events.find((e) => state(e) === "now");
  const upcoming = events.find((e) => state(e) === "next");
  const range = (e: Ev) => (e.end ? `${short(e.start)} – ${fmtDate(e.end, lang)}` : fmtDate(e.start, lang));
  const status = (e: Ev) => {
    const s = state(e);
    if (s === "past") return t.ended;
    if (s === "next") return fill(t.startsIn, days(e.start));
    if (s === "now") {
      const left = days(e.end ?? e.start);
      return e.type === "apply" ? (left === 0 ? t.closesToday : fill(t.closesIn, left)) : t.ongoing;
    }
    return "";
  };

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-forest text-page">
        <img src="/img/does/activity-up-backdrop.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
          <h1 className="max-w-4xl text-4xl leading-[1.25] md:text-6xl md:leading-[1.2]">{t.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-page/80">{t.intro}</p>
          {today && (
            <section aria-labelledby="now" className="mt-12 max-w-3xl rounded-xl border border-page/20 bg-page/10 p-6 md:p-8">
              <h2 id="now" className="font-mono text-xs tracking-[0.05em] text-page/70">
                {t.nowTitle}
              </h2>
              {current ? (
                <>
                  <p className="mt-3 font-serif text-3xl font-light leading-[1.3] md:text-4xl">
                    {current.type === "apply" ? t.applyOpen : t.types[current.type]}{" "}
                    <span className="text-lg text-page/70">
                      ({t.round} {current.round})
                    </span>
                  </p>
                  <p className="mt-2 tabular-nums text-page/80">{range(current)}</p>
                  <p className="mt-4 inline-block rounded-full bg-accent px-4 py-1 text-sm font-medium text-white">{status(current)}</p>
                </>
              ) : upcoming ? (
                <>
                  <p className="mt-3 text-lg text-page/80">{t.noOpen}</p>
                  <p className="mt-3 font-medium">
                    {t.nextUp}: {t.types[upcoming.type]} ({t.round} {upcoming.round}) · <span className="tabular-nums">{range(upcoming)}</span> · {status(upcoming)}
                  </p>
                </>
              ) : (
                <p className="mt-3 text-lg text-page/80">{t.noOpen}</p>
              )}
            </section>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
        <aside className="md:col-span-3">
          <div className="md:sticky md:top-28">
            <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{t.timelineTitle}</p>
            <p className="mt-2 font-serif text-6xl font-light tabular-nums leading-none md:text-7xl">{year}</p>
            <Link href={`/${lang}/calendar`} className="mt-6 inline-block text-sm font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink">
              {t.docsLink} →
            </Link>
          </div>
        </aside>

        <div className="md:col-span-9">
          <section aria-labelledby="timeline">
            <h2 id="timeline" className="sr-only">
              {t.timelineTitle} {year}
            </h2>
            <ol className="border-t border-ink/10">
              {events.map((e) => {
                const s = state(e);
                return (
                  <li
                    key={`${e.round}-${e.type}`}
                    className={`grid gap-1 border-b border-ink/10 px-4 py-5 sm:grid-cols-[13rem_1fr_auto] sm:items-baseline sm:gap-6 ${s === "now" ? "border-l-2 border-l-accent bg-tint/50" : ""} ${s === "past" ? "text-ink-3" : ""}`}
                  >
                    <p className="tabular-nums">{range(e)}</p>
                    <p className={s === "past" ? "" : "font-medium"}>
                      {t.types[e.type]}{" "}
                      <span className="font-normal text-ink-3">
                        ({t.round} {e.round})
                      </span>
                    </p>
                    {s && <p className={`text-sm ${s === "now" ? "font-medium text-accent-ink" : "text-ink-3"}`}>{status(e)}</p>}
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-labelledby="form" className="mt-16 rounded-xl border border-ink/10 bg-card p-6 md:p-8">
            <h2 id="form" className="text-2xl">
              {t.formTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-ink-2">{t.formDesc}</p>
            {/* TODO: ไฟล์แบบฟอร์มจริง (ตอนนี้ลิงก์ชั่วคราว) */}
            <a href="#" className={downloadBtn}>
              {t.formBtn}
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
