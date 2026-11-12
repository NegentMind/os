import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fontVars } from "@/lib/fonts";
import { getDictionary, isLocale, LOCALES, type Locale } from "@/lib/i18n";
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
    title: d.meta.title,
    description: d.meta.description,
    openGraph: {
      title: d.meta.title,
      description: d.meta.description,
      type: "website",
      siteName: "Negent Mind",
    },
    alternates: {
      languages: { en: "/en", es: "/es" },
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
