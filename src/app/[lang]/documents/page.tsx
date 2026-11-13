"use client";

import { WithLang } from "@/components/WithLang";

// อื่น ๆ (เมนู เอกสาร > อื่น ๆ): รายการเอกสารแบบเดียวกับหน้าปฏิทิน ไม่มีแท็บ
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content, announcements }) => {
        const t = content[lang];
        return (
          <main>
            <section className="bg-forest text-page">
              <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 md:px-8 md:pb-16">
                <p className="text-sm text-page/70">{t.nav.documents} / {t.nav.relatedAnnouncements}</p>
                <h1 className="mt-2 text-3xl font-medium md:text-4xl">{t.nav.relatedAnnouncements}</h1>
              </div>
            </section>
            <section className="mx-auto max-w-6xl px-4 pb-12 pt-28 md:px-8 md:pb-16">
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {announcements.map((a) => (
                  <li key={a.id} className="flex items-center gap-4 py-4">
                    <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-ink">
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
