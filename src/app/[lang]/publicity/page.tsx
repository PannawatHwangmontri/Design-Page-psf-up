import { PageFrame } from "@/components/DetailPage";
import { YearTabs } from "@/components/YearTabs";
import { content } from "@/data/content";
import { publicity } from "@/data/mock";
import { WithLang } from "@/components/WithLang";

// PR news: results announced per year (67-70), newest year first
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang) => {
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
