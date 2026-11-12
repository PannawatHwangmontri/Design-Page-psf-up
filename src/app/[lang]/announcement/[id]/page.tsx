"use client";

import { useParams } from "next/navigation";
import { DetailPage, downloadBtn } from "@/components/DetailPage";
import { WithLang } from "@/components/WithLang";

// One announcement: title, year and the attached file. The id comes from the URL; the data is in localStorage (admin).
export default function Page() {
  const { id } = useParams<{ id: string }>();
  return (
    <WithLang>
      {(lang, { content, announcements }) => {
        const p = content[lang].pages.announcement;
        const a = announcements.find((x) => String(x.id) === id);
        if (!a) return <DetailPage backHref={`/${lang}/announcement`} backLabel={p.back} title={p.notFound} body={[]} />;
        const hasFile = !!a.file && a.file !== "#";
        return (
          <DetailPage backHref={`/${lang}/announcement`} backLabel={p.back} meta={lang === "th" ? `พ.ศ. ${a.year}` : `B.E. ${a.year}`} title={a.title[lang]} body={[]}>
            {hasFile ? (
              <a href={a.file} download className={downloadBtn}>
                {p.file}
              </a>
            ) : (
              <p className="mt-8 text-ink-3">{p.noFile}</p>
            )}
          </DetailPage>
        );
      }}
    </WithLang>
  );
}
