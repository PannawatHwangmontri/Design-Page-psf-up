"use client";

import { CalendarYear } from "@/components/CalendarYear";
import { WithLang } from "@/components/WithLang";

// Calendar (menu: Publicity > Calendar): one block per year with the poster, the dates of both rounds,
// the PDF download and the PDF shown in the page. Years come from the announcement documents, newest first.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content, calendarDocs, assessmentCalendars }) => {
        const t = content[lang];
        const p = t.pages.calendar;
        const docs = [...calendarDocs].sort((a, b) => b.year - a.year);
        const yr = (y: number) => (lang === "th" ? y : y - 543);
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-forest text-page">
              <img src="/img/does/activity-meeting.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/65" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <p className="font-mono text-xs tracking-[0.05em] text-page/70">
                  {t.nav.publicity} / {t.nav.calendar}
                </p>
                <h1 className="mt-5 max-w-3xl text-5xl leading-[1.2] md:text-7xl md:leading-[1.15]">{t.nav.calendar}</h1>
                <p className="mt-6 max-w-xl text-lg text-page/80">{p.intro}</p>
                <ul className="mt-10 flex flex-wrap gap-2 border-t border-page/25 pt-6">
                  {docs.map((d) => (
                    <li key={d.id}>
                      <a href={`#y${d.year}`} className="inline-flex rounded-full border border-page/40 px-4 py-1.5 text-sm tabular-nums hover:bg-page/10">
                        {t.home.yearLabel} {yr(d.year)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            <section className="mx-auto max-w-6xl px-4 md:px-8">
              {docs.map((d) => (
                <CalendarYear key={d.id} lang={lang} doc={d} events={assessmentCalendars.find((c) => c.year === d.year)?.events} />
              ))}
            </section>
          </main>
        );
      }}
    </WithLang>
  );
}
