import { DetailPage, LangPage } from "@/components/DetailPage";
import { content } from "@/data/content";

export default function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  return (
    <LangPage searchParams={searchParams}>
      {(lang) => {
        const t = content[lang];
        return <DetailPage lang={lang} backHash="process" backLabel={t.detail.process.back} meta="PSF" title={t.process.title} body={t.detail.process.body} />;
      }}
    </LangPage>
  );
}
