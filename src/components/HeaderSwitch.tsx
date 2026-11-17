"use client";

import { usePathname } from "next/navigation";
import type { Lang } from "@/data/content";
import { ApplicantHeader } from "@/components/ApplicantHeader";
import { SiteHeader } from "@/components/SiteHeader";

// The lecturer portal (/[lang]/applicant...) gets its own header; every other page keeps the public menu.
export function HeaderSwitch({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  if (/^\/(th|en)\/applicant(\/|$)/.test(pathname)) return <ApplicantHeader lang={lang} />;
  return <SiteHeader lang={lang} />;
}
