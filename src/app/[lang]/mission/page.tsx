"use client";

import { WithLang } from "@/components/WithLang";

// Mission (menu: เกี่ยวกับ > พันธกิจ), laid out like the history page: numbered rows with a heading column.
// TODO: vision and values text (placeholders in content.ts "about.todo", waiting for the owner)
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content }) => {
        const t = content[lang];
        const row = "mt-12 border-t border-ink/10 pt-10 md:grid md:grid-cols-[16rem_minmax(0,1fr)] md:gap-16";
        return (
          <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pb-24">
            <h1 className="max-w-4xl text-3xl font-medium leading-[1.2] md:text-5xl">{t.nav.mission}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-2">{t.about.intro}</p>

            <section className={row}>
              <h2 className="text-lg font-medium leading-8">{t.about.missionTitle}</h2>
              <ol className="mt-4 divide-y divide-ink/10 border-y border-ink/10 md:mt-0">
                {t.about.mission.map((m, i) => (
                  <li key={m} className="flex gap-6 py-6">
                    <span aria-hidden="true" className="w-12 shrink-0 text-3xl tabular-nums text-accent-ink/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="max-w-2xl text-lg leading-8">{m}</span>
                  </li>
                ))}
              </ol>
            </section>

            {[t.about.visionTitle, t.about.valuesTitle].map((title) => (
              <section key={title} className={row}>
                <h2 className="text-lg font-medium leading-8">{title}</h2>
                <p className="mt-4 text-ink-3 md:mt-0">{t.about.todo}</p>
              </section>
            ))}

            <p className="mt-16 border-t border-ink/10 pt-8 text-sm text-ink-3">{t.about.note}</p>
          </main>
        );
      }}
    </WithLang>
  );
}
