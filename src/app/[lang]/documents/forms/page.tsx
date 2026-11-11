import { PageFrame } from "@/components/DetailPage";
import { WithLang } from "@/components/WithLang";
import { content } from "@/data/content";
import { forms } from "@/data/mock";

// Other forms: PDF downloads. Files are placeholders until the real PDFs are supplied.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang) => {
        const t = content[lang].pages.forms;
        return (
          <PageFrame title={t.title} intro={t.intro}>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {forms.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-4 py-4">
                  <span className="font-medium">{f.title[lang]}</span>
                  <a
                    href={f.file}
                    download
                    className="inline-flex h-10 shrink-0 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover"
                  >
                    {t.download}
                  </a>
                </li>
              ))}
            </ul>
          </PageFrame>
        );
      }}
    </WithLang>
  );
}
