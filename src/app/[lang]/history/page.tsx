"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/data/content";
import { WithLang } from "@/components/WithLang";
import { useSite } from "@/lib/site";

// History of the standard (menu: About > Background). Dark photo band, then a sticky contents column beside the numbered
// sections; the current section is highlighted while reading. KNOW / DO / BE as three cards, the quality levels as a ledger.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <WithLang params={params}>{(lang) => <History lang={lang} />}</WithLang>;
}

function History({ lang }: { lang: Lang }) {
  const h = useSite().content[lang].pages.history;
  const [active, setActive] = useState("");

  // highlight the contents entry of the section that is nearest the top of the screen
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-spy]")];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const tocLink = (id: string, on: boolean) =>
    `block border-l-2 py-1.5 pl-4 text-sm transition-colors ${on ? "border-accent font-medium text-ink" : "border-ink/10 text-ink-2 hover:text-ink"}`;

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-forest text-page">
        <img src="/img/does/activity-up-backdrop.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
          <h1 className="max-w-4xl text-4xl leading-[1.25] md:text-6xl md:leading-[1.2]">{h.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-page/80">{h.intro}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
        <nav aria-label={h.toc} className="md:col-span-3">
          <div className="md:sticky md:top-28">
            <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{h.toc}</p>
            <ol className="mt-4">
              {h.sections.map((sec) => (
                <li key={sec.no}>
                  <a href={`#sec-${sec.no}`} className={tocLink(`sec-${sec.no}`, active === `sec-${sec.no}`)}>
                    <span className="mr-2 tabular-nums text-ink-3">{sec.no}</span>
                    {sec.heading}
                  </a>
                  {"components" in sec && (
                    <ul>
                      <li>
                        <a href={`#components-${sec.no}`} className={`${tocLink(`components-${sec.no}`, active === `components-${sec.no}`)} pl-9`}>
                          {h.componentsHeading}
                        </a>
                      </li>
                      <li>
                        <a href={`#levels-${sec.no}`} className={`${tocLink(`levels-${sec.no}`, active === `levels-${sec.no}`)} pl-9`}>
                          {h.levelsHeading}
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="md:col-span-9">
          {h.sections.map((sec) => (
            <section key={sec.no} id={`sec-${sec.no}`} data-spy className="scroll-mt-28 border-t border-ink/10 pt-12 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-16">
              <p className="font-mono text-xs tabular-nums tracking-[0.05em] text-ink-3">{sec.no}</p>
              <h2 className="mt-2 text-3xl leading-[1.3] md:text-4xl">{sec.heading}</h2>

              {"paragraphs" in sec ? (
                <div className="mt-8 max-w-3xl space-y-5 text-lg leading-8 text-ink-2">
                  {sec.paragraphs.map((p, j) => (
                    <p key={j} className={j === 0 ? "text-xl leading-9 text-ink" : ""}>
                      {p}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="mt-8">
                  <p className="max-w-3xl text-xl leading-9 text-ink">{sec.intro}</p>

                  <ul id={`components-${sec.no}`} data-spy className="mt-10 grid scroll-mt-28 gap-4 lg:grid-cols-3">
                    {sec.components.map((c) => (
                      <li key={c.code} className="rounded-xl border border-ink/10 bg-card p-6">
                        <p className="font-serif text-5xl font-light text-accent-ink">{c.code}</p>
                        <p className="mt-3 font-semibold">{c.name}</p>
                        <ul className="mt-5 space-y-3 border-t border-ink/10 pt-5">
                          {c.items.map((it) => (
                            <li key={it.no} className="flex gap-3 text-sm leading-6 text-ink-2">
                              <span className="shrink-0 font-mono text-xs tabular-nums leading-6 text-ink-3">{it.no}</span>
                              <span>{it.text}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>

                  <div id={`levels-${sec.no}`} data-spy className="mt-16 scroll-mt-28">
                    <h3 className="font-serif text-2xl font-light md:text-3xl">{h.levelsHeading}</h3>
                    <p className="mt-4 max-w-3xl text-lg leading-8 text-ink-2">{sec.levelsIntro}</p>
                    <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                      {sec.levels.map((lv, k) => (
                        <li key={lv.label} className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8">
                          <p className="flex shrink-0 items-center gap-2 font-semibold sm:w-44">
                            <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: `var(--color-level-${Math.min(k + 1, 3)})` }} />
                            {lv.label}
                          </p>
                          <p className="max-w-3xl leading-7 text-ink-2">{lv.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </section>
          ))}

          <div className="mt-16 max-w-3xl space-y-2 border-t border-ink/10 pt-8 text-sm leading-6 text-ink-3">
            {h.notes.map((n, i) => (
              <p key={i}>{n}</p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
