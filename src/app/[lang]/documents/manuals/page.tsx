"use client";

import { PdfRow } from "@/components/PdfRow";
import { WithLang } from "@/components/WithLang";
import { manuals } from "@/data/mock";

// Manuals (menu: Documents > Manuals): the real PSF announcements from does.up.ac.th, readable in the page or downloadable.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content }) => {
        const c = content[lang];
        const t = c.pages.manuals;
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-forest text-page">
              <img src="/img/does/activity-gifts.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <p className="font-mono text-xs tracking-[0.05em] text-page/70">{c.nav.documents} / {c.nav.manuals}</p>
                <h1 className="mt-5 max-w-3xl text-5xl leading-[1.2] md:text-7xl md:leading-[1.15]">{t.title}</h1>
                <p className="mt-6 max-w-xl text-lg text-page/80">{t.intro}</p>
              </div>
            </section>
            <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {manuals.map((m) => (
                  <PdfRow key={m.id} lang={lang} item={m} />
                ))}
              </ul>
              <p className="mt-8 text-sm text-ink-3">{t.source}</p>
            </section>
          </main>
        );
      }}
    </WithLang>
  );
}
