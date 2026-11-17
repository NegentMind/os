import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteCopy } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { hrefFor, type PageId } from "@/lib/site-routes";

export type MarketingPageProps = {
  params: Promise<{ lang: string }>;
};

/** Every public page owns its canonical, rather than inheriting the home URL. */
export async function metadataForPage(
  params: MarketingPageProps["params"],
  page: PageId,
): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { title, description } = getSiteCopy(lang).meta[page];
  const path = hrefFor(lang, page);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: hrefFor("en", page),
        es: hrefFor("es", page),
        "x-default": hrefFor("en", page),
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Negent Mind",
      url: path,
      locale: lang === "es" ? "es_ES" : "en_US",
      alternateLocale: lang === "es" ? "en_US" : "es_ES",
      images: [
        { url: "/og.png", width: 1200, height: 630, alt: "Negent Mind" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}
