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
    <main>
      <Band>
        <Link href={backHref} className="text-sm text-page/70 underline decoration-page/30 underline-offset-4 hover:text-page">
          {backLabel}
        </Link>
        {meta && <p className="mt-8 font-mono text-xs tracking-[0.05em] text-page/70">{meta}</p>}
        <h1 className="mt-4 max-w-4xl text-4xl leading-[1.25] md:text-6xl md:leading-[1.2]">{title}</h1>
      </Band>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
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

// dark photo band at the top of the inner pages (the floating menu sits over it, hence pt-44)
function Band({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-forest text-page">
      <img src="/img/does/activity-workshop.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">{children}</div>
    </section>
  );
}

// page frame for the list pages (news, announcement)
export function PageFrame({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main>
      <Band>
        <h1 className="max-w-4xl text-4xl leading-[1.25] md:text-6xl md:leading-[1.2]">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-page/80">{intro}</p>
      </Band>
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">{children}</div>
    </main>
  );
}

export const downloadBtn =
  "mt-8 inline-flex h-12 items-center rounded-full bg-accent px-6 font-medium text-white hover:bg-accent-hover";
