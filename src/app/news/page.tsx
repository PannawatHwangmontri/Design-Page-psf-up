import { DetailPage, fmtDate, LangPage } from "@/components/DetailPage";
import { content } from "@/data/content";
import { news } from "@/data/mock";

export default function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  return (
    <LangPage searchParams={searchParams}>
      {(lang) => {
        const n = news[0];
        const d = content[lang].detail.news;
        return <DetailPage lang={lang} backHash="news" backLabel={d.back} meta={fmtDate(n.date, lang)} title={n.title[lang]} body={d.body} />;
      }}
    </LangPage>
  );
}
