import PsfSite from "@/components/PsfSite";
import { WithLang } from "@/components/WithLang";

export default function Home({ params }: { params: Promise<{ lang: string }> }) {
  return <WithLang params={params}>{(lang) => <PsfSite lang={lang} />}</WithLang>;
}
