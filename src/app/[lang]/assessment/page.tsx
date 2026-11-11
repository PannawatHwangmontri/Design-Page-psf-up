import { PageFrame, downloadBtn } from "@/components/DetailPage";
import { content } from "@/data/content";
import { assessmentCalendars } from "@/data/mock";
import { WithLang } from "@/components/WithLang";

// Assessment: calendar of the latest year (rounds: applications -> assessment -> results) + the request form
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang) => {
          const t = content[lang].pages.assessment;
          const locale = lang === "th" ? "th-TH" : "en-GB";
          const cal = assessmentCalendars.reduce((a, b) => (b.year > a.year ? b : a));
          const year = lang === "th" ? cal.year : cal.year - 543;
          const short = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short" });
          const months = Array.from({ length: 12 }, (_, m) => ({
            name: new Date(2000, m, 1).toLocaleDateString(locale, { month: "long" }),
            events: cal.events.filter((e) => new Date(e.start).getMonth() === m),
          }));
          return (
            <PageFrame title={t.title} intro={t.intro}>
              <section aria-labelledby="calendar">
                <h2 id="calendar" className="text-2xl font-medium">
                  {t.calendarTitle} <span className="tabular-nums">{year}</span>
                </h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {months.map((m) => (
                    <li key={m.name} className={`rounded-xl border p-4 ${m.events.length ? "border-accent/40 bg-tint/40" : "border-ink/10 bg-card"}`}>
                      <p className="text-sm font-medium text-ink-2">{m.name}</p>
                      {m.events.length === 0 ? (
                        <p className="mt-2 text-sm text-ink-3">{t.noEvents}</p>
                      ) : (
                        <ul className="mt-2 space-y-2">
                          {m.events.map((e) => (
                            <li key={e.type + e.round} className="text-sm">
                              <span className="flex items-center gap-2 font-medium">
                                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
                                {t.types[e.type]} <span className="font-normal text-ink-3">({t.round} {e.round})</span>
                              </span>
                              <span className="ml-4 block tabular-nums text-ink-2">
                                {short(e.start)}
                                {e.end ? ` – ${short(e.end)}` : ""}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
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
      }}
    </WithLang>
  );
}
