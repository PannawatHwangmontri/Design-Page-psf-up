import Link from "next/link";
import { PageFrame } from "@/components/DetailPage";
import { content } from "@/data/content";
import { outstandingSlugs } from "@/data/nav";
import { WithLang } from "@/components/WithLang";

const key = { project: "outstandingProject", announcement: "outstandingAnnouncement", process: "outstandingProcess", apply: "outstandingApply" } as const;

// Outstanding teaching lecturers: landing page listing the four sub pages (project, announcement, process, application)
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang) => {
          const t = content[lang];
          return (
            <PageFrame title={t.pages.outstanding.title} intro={t.pages.outstanding.intro}>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {outstandingSlugs.map((slug, i) => (
                  <li key={slug}>
                    <Link href={`/${lang}/outstanding/${slug}`} className="block h-full rounded-xl border border-ink/10 bg-card p-6 hover:bg-raised">
                      <span className="block text-sm tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                      <span className="mt-4 block text-lg font-medium">{t.nav[key[slug]]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </PageFrame>
          );
      }}
    </WithLang>
  );
}
