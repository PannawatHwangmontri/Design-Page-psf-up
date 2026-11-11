import { DetailPage, fmtDate, LangPage } from "@/components/DetailPage";
import { content } from "@/data/content";
import { announcements } from "@/data/mock";

export default function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  return (
    <LangPage searchParams={searchParams}>
      {(lang) => {
        const a = announcements[0];
        const d = content[lang].detail.announcement;
        return <DetailPage lang={lang} backHash="news" backLabel={d.back} meta={fmtDate(a.date, lang)} title={a.title[lang]} body={d.body} />;
      }}
    </LangPage>
  );
}
