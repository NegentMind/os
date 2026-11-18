import { notFound } from "next/navigation";
import Link from "next/link";
import { MotionProvider } from "@/components/nm/v2/motion-provider";
import { SiteHeader } from "@/components/nm/v2/site-header";
import { SiteFooter } from "@/components/nm/v2/site-footer";
import { PointerFeedback } from "@/components/nm/v2/pointer-feedback";
import { SmoothScroll } from "@/components/nm/v2/smooth-scroll";
import { ViewportFade } from "@/components/nm/v2/viewport-fade";
import { getSiteCopy } from "@/lib/content";
import { fontVarsV2 } from "@/lib/fonts";
import { isLocale, LOCALES } from "@/lib/i18n";
import "@/app/orbital.css";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
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
  const copy = getSiteCopy(lang);
  return (
    <html lang={lang} className={fontVarsV2} data-headings="orbital">
      <body className="nm2-site">
        {/* LCP: the hero poster is a CSS background on .nm2-hero-art__poster;
            preloading here lets the browser fetch the webp while CSS still
            resolves. React hoists this link to <head>. */}
        <link
          rel="preload"
          as="image"
          href="/brand/orbital-poster.webp"
          fetchPriority="high"
        />
        <MotionProvider>
          <SiteHeader lang={lang} copy={copy.nav} />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter lang={lang} nav={copy.nav} copy={copy.footer} motionCopy={copy.hero} />
          <ViewportFade />
          <PointerFeedback />
          <SmoothScroll />
          {process.env.NODE_ENV === "development" && (
            <div className="nm2-dev-gallery">
              <Link href={`/${lang}/design-system`}>{copy.common.gallery}</Link>
            </div>
          )}
        </MotionProvider>
      </body>
    </html>
  );
}
