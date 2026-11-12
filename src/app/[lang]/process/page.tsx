"use client";

import { DetailPage } from "@/components/DetailPage";
import { WithLang } from "@/components/WithLang";

// sample page: every tile of the process section links here
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content }) => {
          const t = content[lang];
          return <DetailPage backHref={`/${lang}#process`} backLabel={t.detail.process.back} meta="PSF" title={t.process.title} body={t.detail.process.body} />;
      }}
    </WithLang>
  );
}
