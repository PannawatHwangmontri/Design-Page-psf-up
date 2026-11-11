import { DetailPage } from "@/components/DetailPage";
import { content } from "@/data/content";
import { news } from "@/data/mock";
import { fmtDate } from "@/lib/lang";
import { WithLang } from "@/components/WithLang";

// sample page: the link inside the news dialog
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang) => {
          const n = news[0];
          const d = content[lang].detail.news;
          return <DetailPage backHref={`/${lang}#news`} backLabel={d.back} meta={fmtDate(n.date, lang)} title={n.title[lang]} body={d.body} />;
      }}
    </WithLang>
  );
}
