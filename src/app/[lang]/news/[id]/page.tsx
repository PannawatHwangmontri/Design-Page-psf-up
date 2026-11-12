"use client";

import { useParams } from "next/navigation";
import { DetailPage, downloadBtn } from "@/components/DetailPage";
import { WithLang } from "@/components/WithLang";
import { fmtDate } from "@/lib/lang";

// One news item. The id comes from the URL; the data is in localStorage (admin), so this page cannot be prerendered per id.
export default function Page() {
  const { id } = useParams<{ id: string }>();
  return (
    <WithLang>
      {(lang, { content, news }) => {
        const p = content[lang].pages.news;
        const n = news.find((x) => String(x.id) === id);
        if (!n) return <DetailPage backHref={`/${lang}/news`} backLabel={p.back} title={p.notFound} body={[]} />;
        const hasFile = !!n.file && n.file !== "#";
        return (
          <DetailPage backHref={`/${lang}/news`} backLabel={p.back} meta={fmtDate(n.date, lang)} title={n.title[lang]} body={[n.excerpt[lang]]}>
            {n.image && <img src={n.image} alt="" className="mt-8 w-full rounded-xl object-cover" />}
            {hasFile && (
              <a href={n.file} download className={downloadBtn}>
                {p.file}
              </a>
            )}
          </DetailPage>
        );
      }}
    </WithLang>
  );
}
