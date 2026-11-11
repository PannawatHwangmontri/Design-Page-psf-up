import { notFound } from "next/navigation";
import { DetailPage, downloadBtn } from "@/components/DetailPage";
import { content } from "@/data/content";
import { outstandingSlugs } from "@/data/nav";
import { WithLang } from "@/components/WithLang";

const key = { project: "outstandingProject", announcement: "outstandingAnnouncement", process: "outstandingProcess", apply: "outstandingApply" } as const;

export function generateStaticParams() {
  return outstandingSlugs.map((slug) => ({ slug }));
}

// Sample pages of the outstanding teaching lecturers menu: project, announcement, process, application
export default function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  return (
    <WithLang params={params}>
      {async (lang) => {
          const { slug } = await params;
          if (!(outstandingSlugs as readonly string[]).includes(slug)) notFound();
          const s = slug as (typeof outstandingSlugs)[number];
          const t = content[lang];
          const o = t.pages.outstanding;
          return (
            <DetailPage backHref={`/${lang}/outstanding`} backLabel={o.back} meta={o.title} title={t.nav[key[s]]} body={o.pages[s].body}>
              {s === "apply" && (
                // TODO: ไฟล์ใบสมัครจริง (ตอนนี้ลิงก์ชั่วคราว)
                <a href="#" className={downloadBtn}>
                  {o.download}
                </a>
              )}
            </DetailPage>
          );
      }}
    </WithLang>
  );
}
