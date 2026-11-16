import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fontVars } from "@/lib/fonts";
import { getDictionary, isLocale, LOCALES, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import "../../globals.css";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: d.meta.title,
    description: d.meta.description,
    openGraph: {
      title: d.meta.title,
      description: d.meta.description,
      type: "website",
      siteName: "Negent Mind",
      url: `/${locale}`,
      locale: locale === "es" ? "es_ES" : "en_US",
      // Brand hero export (brand/exports/hero-dark.png), 1920×640.
      images: [{ url: "/og.png", width: 1920, height: 640, alt: "Negent Mind" }],
    },
    twitter: {
      card: "summary_large_image",
      title: d.meta.title,
      description: d.meta.description,
      images: ["/og.png"],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", es: "/es", "x-default": "/en" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
