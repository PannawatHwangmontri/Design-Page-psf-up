"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { WithLang } from "@/components/WithLang";

// อื่น ๆ (เมนู เอกสาร > อื่น ๆ): รายการเอกสารแบบเดียวกับหน้าปฏิทิน ไม่มีแท็บ
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content, announcements }) => {
        const t = content[lang];
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-forest text-page">
              <img src="/img/does/activity-workshop.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <Breadcrumb lang={lang} items={[{ label: t.nav.documents }, { label: t.nav.relatedAnnouncements }]} />
                <h1 className="mt-5 max-w-3xl text-4xl leading-[1.25] md:text-6xl md:leading-[1.2]">{t.nav.relatedAnnouncements}</h1>
              </div>
            </section>
            <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {announcements.map((a) => (
                  <li key={a.id} className="flex items-center gap-4 py-4">
                    <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-accent-ink">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
                        <path d="M14 3v6h6M8 13h8M8 17h8" />
                      </svg>
                    </span>
                    <a href={`/${lang}${a.href}`} className="min-w-0 flex-1 text-ink hover:text-accent-ink">
                      {a.title[lang]}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </main>
        );
      }}
    </WithLang>
  );
}
