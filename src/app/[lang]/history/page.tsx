import { DetailPage } from "@/components/DetailPage";
import { WithLang } from "@/components/WithLang";
import { content } from "@/data/content";

// History of the standard (menu: เกี่ยวกับ > ความเป็นมา). Sample text until the real content is supplied.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang) => {
        const h = content[lang].pages.history;
        return <DetailPage backHref={`/${lang}`} backLabel={h.back} title={h.title} body={h.body} />;
      }}
    </WithLang>
  );
}
