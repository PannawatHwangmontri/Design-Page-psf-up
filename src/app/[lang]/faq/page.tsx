"use client";

import { WithLang } from "@/components/WithLang";

// FAQ (menu: Help > FAQ): an accordion of <details>. The questions are sample text and every item is marked as such.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content }) => {
        const c = content[lang];
        const t = c.pages.faq;
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-forest text-page">
              <img src="/img/does/activity-workshop.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <p className="font-mono text-xs tracking-[0.05em] text-page/70">{c.nav.help} / {c.nav.faq}</p>
                <h1 className="mt-5 max-w-3xl text-5xl leading-[1.2] md:text-7xl md:leading-[1.15]">{t.title}</h1>
                <p className="mt-6 max-w-xl text-lg text-page/80">{t.intro}</p>
              </div>
            </section>
            <section className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {t.items.map((it) => (
                  <li key={it.q}>
                    <details className="group py-6">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-serif text-xl font-light leading-snug md:text-2xl [&::-webkit-details-marker]:hidden">
                        <span>
                          {it.q}
                          <span className="ml-3 rounded-full border border-ink/15 px-2 py-0.5 align-middle font-sans text-xs text-ink-3">{t.sample}</span>
                        </span>
                        <span aria-hidden="true" className="mt-1 shrink-0 text-2xl leading-none text-ink-3 transition-transform duration-150 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-4 max-w-3xl text-lg leading-8 text-ink-2">{it.a}</p>
                    </details>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-ink-3">{t.note}</p>
            </section>
          </main>
        );
      }}
    </WithLang>
  );
}
