"use client";

import type { Lang } from "@/data/content";
import { WithLang } from "@/components/WithLang";
import { useSite } from "@/lib/site";

// History of the standard (menu: เกี่ยวกับ > ความเป็นมา). A contents list on top, numbered sections, KNOW / DO / BE as three cards.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <WithLang params={params}>{(lang) => <History lang={lang} />}</WithLang>;
}

function History({ lang }: { lang: Lang }) {
  const h = useSite().content[lang].pages.history;
  const row = "mt-16 scroll-mt-28 border-t border-ink/10 pt-10 md:grid md:grid-cols-[16rem_minmax(0,1fr)] md:gap-16";
  const link = "text-ink-2 underline decoration-ink/20 underline-offset-4 hover:text-accent-ink hover:decoration-accent-ink";

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <h1 className="max-w-4xl text-3xl font-medium leading-[1.2] md:text-5xl">{h.title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-2">{h.intro}</p>

      <nav aria-label={h.toc} className="mt-10 max-w-3xl rounded-xl border border-ink/10 bg-card p-6">
        <p className="text-sm font-medium text-ink-3">{h.toc}</p>
        <ol className="mt-3 space-y-2">
          {h.sections.map((sec) => (
            <li key={sec.no}>
              <a href={`#sec-${sec.no}`} className={link}>
                <span className="mr-2 tabular-nums text-ink-3">{sec.no}</span>
                {sec.heading}
              </a>
              {"components" in sec && (
                <ul className="ml-6 mt-2 space-y-1.5 text-sm">
                  <li>
                    <a href={`#components-${sec.no}`} className={link}>
                      {h.componentsHeading} ({sec.components.map((c) => c.code).join(" / ")})
                    </a>
                  </li>
                  <li>
                    <a href={`#levels-${sec.no}`} className={link}>
                      {h.levelsHeading}
                    </a>
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {h.sections.map((sec) => (
        <section key={sec.no} id={`sec-${sec.no}`} className={row}>
          <h2 className="flex items-baseline gap-3 text-lg font-medium leading-8">
            <span className="text-sm tabular-nums text-ink-3">{sec.no}</span>
            {sec.heading}
          </h2>

          {"paragraphs" in sec ? (
            <div className="mt-4 max-w-3xl space-y-5 text-base leading-8 text-ink-2 md:mt-0 md:text-lg">
              {sec.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          ) : (
            <div className="mt-4 md:mt-0">
              <p className="max-w-3xl text-base leading-8 text-ink-2 md:text-lg">{sec.intro}</p>

              <ul id={`components-${sec.no}`} className="mt-8 grid scroll-mt-28 gap-4 md:grid-cols-3">
                {sec.components.map((c) => (
                  <li key={c.code} className="rounded-xl border border-ink/10 bg-card p-6">
                    <p className="font-mono text-2xl text-accent-ink">{c.code}</p>
                    <p className="mt-2 font-medium">{c.name}</p>
                    <ul className="mt-4 space-y-3 border-t border-ink/10 pt-4">
                      {c.items.map((it) => (
                        <li key={it.no} className="flex gap-3 text-sm leading-6 text-ink-2">
                          <span className="shrink-0 tabular-nums text-ink-3">{it.no}</span>
                          <span>{it.text}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <p id={`levels-${sec.no}`} className="mt-12 max-w-3xl scroll-mt-28 text-base leading-8 text-ink-2 md:text-lg">
                {sec.levelsIntro}
              </p>
              <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                {sec.levels.map((lv) => (
                  <li key={lv.label} className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
                    <p className="shrink-0 font-medium text-accent-ink sm:w-40">{lv.label}</p>
                    <p className="max-w-3xl leading-7 text-ink-2">{lv.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}

      <div className="mt-16 max-w-3xl space-y-2 border-t border-ink/10 pt-8 text-sm leading-6 text-ink-3">
        {h.notes.map((n, i) => (
          <p key={i}>{n}</p>
        ))}
      </div>
    </main>
  );
}
