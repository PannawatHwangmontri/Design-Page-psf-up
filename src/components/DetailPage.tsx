import { Suspense } from "react";
import { content, type Lang } from "@/data/content";

async function Resolved({ searchParams, children }: { searchParams: Promise<{ lang?: string }>; children: (lang: Lang) => React.ReactNode }) {
  return children((await searchParams).lang === "en" ? "en" : "th");
}

// searchParams is runtime data (cacheComponents), so it is read inside Suspense; the Thai page is the prerendered shell.
export function LangPage({ searchParams, children }: { searchParams: Promise<{ lang?: string }>; children: (lang: Lang) => React.ReactNode }) {
  return (
    <Suspense fallback={children("th")}>
      <Resolved searchParams={searchParams}>{children}</Resolved>
    </Suspense>
  );
}

// Shared layout of the sample detail pages (/announcement /news /process). Language comes from ?lang=th|en.
export function DetailPage({
  lang,
  backHash,
  backLabel,
  meta,
  title,
  body,
}: {
  lang: Lang;
  backHash: string; // section id on the home page to return to
  backLabel: string;
  meta: React.ReactNode; // line above the title (date, unit...)
  title: string;
  body: readonly string[];
}) {
  const t = content[lang];
  return (
    <div lang={lang}>
      <header className="border-b border-white/15 bg-accent">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <a href={`/?lang=${lang}`} className="text-base font-medium text-white">
            {t.siteName}
          </a>
          <a
            href={`?lang=${lang === "th" ? "en" : "th"}`}
            aria-label={t.langLabel}
            className="flex h-8 items-center rounded-lg px-3 text-sm font-medium text-white hover:bg-white/15"
          >
            {t.langBtn}
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <a href={`/?lang=${lang}#${backHash}`} className="text-sm text-ink-2 underline decoration-ink/20 underline-offset-4 hover:text-ink">
          {backLabel}
        </a>
        <article className="mt-8">
          <p className="text-sm tabular-nums text-ink-3">{meta}</p>
          <h1 className="mt-2 text-3xl font-medium leading-[1.2] md:text-4xl md:leading-[1.2]">{title}</h1>
          <div className="mt-8 space-y-4 text-lg leading-8 text-ink-2">
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>
      </main>

      <footer className="bg-accent py-8 text-center text-sm text-white/90">
        <div className="mx-auto max-w-6xl px-4 md:px-8">{t.footer}</div>
      </footer>
    </div>
  );
}

export const fmtDate = (iso: string, lang: Lang) =>
  new Date(iso).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
