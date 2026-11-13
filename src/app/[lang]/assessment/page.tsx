"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageFrame, downloadBtn } from "@/components/DetailPage";
import { WithLang } from "@/components/WithLang";
import type { Lang } from "@/data/content";
import { fmtDate } from "@/lib/lang";
import type { SiteData } from "@/lib/site";

// Assessment: timeline of the latest year (only the periods that have an activity), the "now" box with a countdown, and the request form
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <WithLang params={params}>{(lang, site) => <Assessment lang={lang} site={site} />}</WithLang>;
}

const DAY = 864e5;
const at = (iso: string) => new Date(`${iso}T00:00:00`);

function Assessment({ lang, site }: { lang: Lang; site: SiteData }) {
  const t = site.content[lang].pages.assessment;
  const locale = lang === "th" ? "th-TH" : "en-GB";
  // "today" only exists in the browser; before it is known the timeline shows dates without status
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setToday(d);
  }, []);

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
    <PageFrame title={t.title} intro={t.intro}>
      {today && (
        <section aria-labelledby="now" className={`mb-12 rounded-xl border p-6 md:p-8 ${current ? "border-accent/50 bg-tint/50" : "border-ink/10 bg-card"}`}>
          <h2 id="now" className="text-sm font-medium text-ink-2">
            {t.nowTitle}
          </h2>
          {current ? (
            <>
              <p className="mt-2 text-2xl font-medium">
                {current.type === "apply" ? t.applyOpen : t.types[current.type]}{" "}
                <span className="text-lg font-normal text-ink-2">
                  ({t.round} {current.round})
                </span>
              </p>
              <p className="mt-1 tabular-nums text-ink-2">{range(current)}</p>
              <p className="mt-3 inline-block rounded-full bg-accent px-3 py-1 text-sm font-medium text-white">{status(current)}</p>
            </>
          ) : upcoming ? (
            <>
              <p className="mt-2 text-lg text-ink-2">{t.noOpen}</p>
              <p className="mt-3 font-medium">
                {t.nextUp}: {t.types[upcoming.type]} ({t.round} {upcoming.round}) · <span className="tabular-nums">{range(upcoming)}</span> · {status(upcoming)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-lg text-ink-2">{t.noOpen}</p>
          )}
        </section>
      )}

      <section aria-labelledby="timeline">
        <h2 id="timeline" className="text-2xl font-medium">
          {t.timelineTitle} <span className="tabular-nums">{year}</span>
        </h2>
        <ol className="mt-8 border-l border-ink/15">
          {events.map((e) => {
            const s = state(e);
            return (
              <li key={`${e.round}-${e.type}`} className="relative pb-8 pl-8 last:pb-0">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${s === "now" ? "border-accent bg-accent" : s === "past" ? "border-ink/25 bg-ink/25" : "border-accent bg-card"}`}
                />
                <div className={`flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6 ${s === "past" ? "text-ink-3" : ""}`}>
                  <p className="w-56 shrink-0 tabular-nums">{range(e)}</p>
                  <p className="font-medium">
                    {t.types[e.type]}{" "}
                    <span className="font-normal text-ink-3">
                      ({t.round} {e.round})
                    </span>
                  </p>
                  {s && <p className={`text-sm sm:ml-auto ${s === "now" ? "font-medium text-accent-ink" : "text-ink-3"}`}>{status(e)}</p>}
                </div>
              </li>
            );
          })}
        </ol>
        <Link href={`/${lang}/calendar`} className="mt-8 inline-block text-sm font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink">
          {t.docsLink} →
        </Link>
      </section>

      <section aria-labelledby="form" className="mt-16 rounded-xl border border-ink/10 bg-card p-6 md:p-8">
        <h2 id="form" className="text-2xl font-medium">
          {t.formTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-ink-2">{t.formDesc}</p>
        {/* TODO: ไฟล์แบบฟอร์มจริง (ตอนนี้ลิงก์ชั่วคราว) */}
        <a href="#" className={downloadBtn}>
          {t.formBtn}
        </a>
      </section>
    </PageFrame>
  );
}
