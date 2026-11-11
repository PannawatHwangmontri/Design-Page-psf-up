import { Suspense } from "react";
import type { Lang } from "@/data/content";
import { langOf } from "@/lib/lang";

type Params = Promise<{ lang: string }>;
type Render = (lang: Lang) => React.ReactNode | Promise<React.ReactNode>;

async function Resolved({ params, children }: { params: Params; children: Render }) {
  return children(await langOf(params));
}

// params is URL data (Cache Components), so a page reads it inside <Suspense>. Every /th and /en page is still
// prerendered through generateStaticParams in [lang]/layout.tsx.
export function WithLang({ params, children }: { params: Params; children: Render }) {
  return (
    <Suspense fallback={null}>
      <Resolved params={params}>{children}</Resolved>
    </Suspense>
  );
}
