import { content, type Lang } from "@/data/content";
import { WithLang } from "@/components/WithLang";

// History of the standard (menu: เกี่ยวกับ > ความเป็นมา). Laid out as a numbered document: sections 1 and 2.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <WithLang params={params}>{(lang) => <History lang={lang} />}</WithLang>;
}

function History({ lang }: { lang: Lang }) {
  const h = content[lang].pages.history;
  const row = "mt-16 border-t border-ink/10 pt-10 md:grid md:grid-cols-[16rem_minmax(0,1fr)] md:gap-16";

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <h1 className="max-w-4xl text-3xl font-medium leading-[1.2] md:text-5xl">{h.title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-2">{h.intro}</p>

      {h.sections.map((sec, i) => (
        <section key={sec.no} className={i === 0 ? "mt-12 border-t border-ink/10 pt-10 md:grid md:grid-cols-[16rem_minmax(0,1fr)] md:gap-16" : row}>
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
            <div className="mt-4 md:mt-0 md:max-w-none">
              <p className="text-base leading-8 text-ink-2 md:text-lg">{sec.intro}</p>

              <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                {sec.components.map((c) => (
                  <li key={c.code} className="flex flex-col gap-3 py-6 sm:flex-row sm:gap-8">
                    <div className="sm:w-56 sm:shrink-0">
                      <p className="font-mono text-sm text-accent-ink">{c.code}</p>
                      <p className="mt-1 font-medium">{c.name}</p>
                    </div>
                    <ul className="min-w-0 flex-1 space-y-3">
                      {c.items.map((it) => (
                        <li key={it.no} className="flex gap-3 leading-7 text-ink-2">
                          <span className="shrink-0 text-sm tabular-nums text-ink-3">{it.no}</span>
                          <span>{it.text}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <p className="mt-10 text-base leading-8 text-ink-2 md:text-lg">{sec.levelsIntro}</p>
              <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                {sec.levels.map((lv) => (
                  <li key={lv.label} className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
                    <p className="shrink-0 font-medium text-accent-ink sm:w-56">{lv.label}</p>
                    <p className="leading-7 text-ink-2">{lv.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}

      <div className="mt-16 space-y-2 border-t border-ink/10 pt-8 text-sm leading-6 text-ink-3">
        {h.notes.map((n, i) => (
          <p key={i}>{n}</p>
        ))}
      </div>
    </main>
  );
}
