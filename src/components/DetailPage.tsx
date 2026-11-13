import Link from "next/link";

// Shared body of the sample detail pages. Header/footer come from the [lang] layout.
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
    <main className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
      <Link href={backHref} className="text-sm text-ink-2 underline decoration-ink/20 underline-offset-4 hover:text-ink">
        {backLabel}
      </Link>
      <article className="mt-8">
        {meta && <p className="text-sm tabular-nums text-ink-3">{meta}</p>}
        <h1 className="mt-2 text-3xl font-medium leading-[1.2] md:text-4xl md:leading-[1.2]">{title}</h1>
        <div className="mt-8 space-y-4 text-lg leading-8 text-ink-2">
          {body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {children}
      </article>
    </main>
  );
}

// page frame for the list pages (publicity, documents, outstanding index, assessment)
export function PageFrame({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
      <h1 className="text-3xl font-medium leading-[1.2] md:text-4xl md:leading-[1.2]">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-2">{intro}</p>
      <div className="mt-12">{children}</div>
    </main>
  );
}

export const downloadBtn =
  "mt-8 inline-flex h-12 items-center rounded-lg bg-accent px-6 font-medium text-white hover:bg-accent-hover";
