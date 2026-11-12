"use client";

import { PageFrame } from "@/components/DetailPage";
import { YearTabs } from "@/components/YearTabs";
import { WithLang } from "@/components/WithLang";

// PR news: results announced per year (67-70), newest year first
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content, publicity }) => {
          const t = content[lang].pages.publicity;
          return (
            <PageFrame title={t.title} intro={t.intro}>
              <YearTabs lang={lang} data={publicity} />
            </PageFrame>
          );
      }}
    </WithLang>
  );
}
