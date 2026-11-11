import { PageFrame } from "@/components/DetailPage";
import { WithLang } from "@/components/WithLang";
import { content } from "@/data/content";

// Mission as its own page (menu: เกี่ยวกับ > พันธกิจ). Text comes from the home section's content.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang) => {
        const t = content[lang];
        return (
          <PageFrame title={t.nav.mission} intro={t.about.intro}>
            <ol className="max-w-2xl list-decimal space-y-4 pl-6 text-lg leading-8 text-ink-2">
              {t.about.mission.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-ink-3">{t.about.note}</p>
          </PageFrame>
        );
      }}
    </WithLang>
  );
}
