import { WithLang } from "@/components/WithLang";
import { content } from "@/data/content";
import { calendarDocs } from "@/data/mock";

// ปฏิทิน (เมนู ประชาสัมพันธ์ > ปฏิทิน): รายการเอกสาร PDF ต่อปี ไม่มีแท็บ
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang) => {
        const t = content[lang];
        return (
          <main>
            <section className="bg-accent text-white">
              <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
                <p className="text-sm text-white/80">{t.nav.publicity} / {t.nav.calendar}</p>
                <h1 className="mt-2 text-3xl font-medium md:text-4xl">{t.nav.calendar}</h1>
              </div>
            </section>
            <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {calendarDocs.map((d) => (
                  <li key={d.id} className="flex items-center gap-4 py-4">
                    <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-ink">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
                        <path d="M14 3v6h6M8 13h8M8 17h8" />
                      </svg>
                    </span>
                    <a href={d.file} download className="min-w-0 flex-1 text-ink hover:text-accent-ink">
                      {d.title[lang]}
                    </a>
                    <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium tabular-nums text-accent-ink">{d.year}</span>
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
