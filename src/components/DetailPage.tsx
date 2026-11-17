import Link from "next/link";

// One template for every inner page: quiet header (breadcrumb, title, optional intro), then the content on the same grid.
// Header and footer come from the [lang] layout.
export function DetailPage({
  backHref,
  backLabel,
  meta,
  title,
  body,
  children,
}: {
  backHref: string;
  backLabel: string;
  meta?: React.ReactNode; // line above the title (date, unit...)
  title: string;
  body: readonly string[];
  children?: React.ReactNode; // extra block under the text (e.g. download button)
}) {
  return (
    <main>
      <PageHeader>
        <Link href={backHref} className="text-base text-ink-2 underline decoration-ink/25 underline-offset-4 hover:text-accent-ink">
          {backLabel}
        </Link>
        {meta && <p className="mt-6 text-[13px] text-ink-3">{meta}</p>}
        <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-[1.25] md:text-4xl">{title}</h1>
      </PageHeader>
      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <div className="space-y-4 text-lg leading-8 text-ink-2">
          {body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {children}
      </article>
    </main>
  );
}

// the shared inner-page header: plain page colour, one hairline below, no photo
export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-b border-ink/10 bg-page pb-12 pt-32 text-ink md:pb-16 md:pt-36">
      <div className="mx-auto max-w-6xl px-5 md:px-8">{children}</div>
    </section>
  );
}

// page frame for the list pages (news, announcement): same header, the list below on the same grid
export function PageFrame({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main>
      <PageHeader>
        <h1 className="max-w-4xl text-3xl font-bold leading-[1.25] md:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-2">{intro}</p>
      </PageHeader>
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">{children}</div>
    </main>
  );
}

export const downloadBtn =
  "mt-8 inline-flex h-12 items-center rounded-full bg-accent px-6 font-medium text-white hover:bg-accent-hover";
