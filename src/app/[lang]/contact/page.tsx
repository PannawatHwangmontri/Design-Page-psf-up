"use client";

import { WithLang } from "@/components/WithLang";

// Contact (menu: Help > Contact us): address, email and phone from content.contact (sample data, marked as such).
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content }) => {
        const c = content[lang];
        const t = c.pages.contact;
        const cards = [
          { label: t.address, value: c.contact.address, href: undefined as string | undefined },
          { label: t.email, value: c.contact.email, href: `mailto:${c.contact.email}` },
          { label: t.phone, value: c.contact.phone, href: `tel:${c.contact.phone.replace(/\s/g, "")}` },
        ];
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-forest text-page">
              <img src="/img/does/activity-meeting.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <p className="font-mono text-xs tracking-[0.05em] text-page/70">{c.nav.help} / {c.nav.contact}</p>
                <h1 className="mt-5 max-w-3xl text-5xl leading-[1.2] md:text-7xl md:leading-[1.15]">{t.title}</h1>
                <p className="mt-6 max-w-xl text-lg text-page/80">{t.intro}</p>
              </div>
            </section>
            <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
              <ul className="grid gap-4 md:grid-cols-3">
                {cards.map((k) => (
                  <li key={k.label} className="rounded-xl border border-ink/10 bg-card p-6 md:p-8">
                    <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{k.label}</p>
                    {k.href ? (
                      <a href={k.href} className="mt-4 block break-words font-serif text-2xl font-light leading-snug hover:text-accent-ink">
                        {k.value}
                      </a>
                    ) : (
                      <p className="mt-4 font-serif text-2xl font-light leading-snug">{k.value}</p>
                    )}
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
