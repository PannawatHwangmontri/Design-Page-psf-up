import { DetailPage } from "@/components/DetailPage";
import { content } from "@/data/content";
import { announcements } from "@/data/mock";
import { fmtDate } from "@/lib/lang";
import { WithLang } from "@/components/WithLang";

// sample page: every announcement in the home list links here
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang) => {
          const a = announcements[0];
          const d = content[lang].detail.announcement;
          return <DetailPage backHref={`/${lang}#news`} backLabel={d.back} meta={fmtDate(a.date, lang)} title={a.title[lang]} body={d.body} />;
      }}
    </WithLang>
  );
}
