import { redirect } from "next/navigation";
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
  // Unknown first segment (e.g. /foo) resolves as an invalid locale:
  // send it back through the middleware, which negotiates /en or /es.
  if (!isLocale(lang)) redirect("/");
  const copy = getSiteCopy(lang);
  return (
    <html lang={lang} className={fontVarsV2} data-headings="orbital" suppressHydrationWarning>
      <body className="nm2-site">
        {/* Pre-hydration heading-mode restore: the lab persists
            orbitalHeadings in localStorage (nm2-transition-lab) but only
            mirrors it on <html> after hydration — headings painted in the
            SSR default, then visibly swapped fonts seconds later. This
            synchronous script applies the stored choice before first
            paint. Keep in sync with transition-lab.tsx STORAGE_KEY. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=JSON.parse(localStorage.getItem("nm2-transition-lab"));if(s&&s.composition&&s.composition.orbitalHeadings===false)document.documentElement.dataset.headings="sans"}catch(e){}`,
          }}
        />
        {/* No manual preloads live here: next/font already emits its own
            preload for the hashed orbital-display woff2 (the literal
            /fonts/orbital-display.woff2 URL was a wasted fetch), and the
            hero poster preload moved into Hero so it only ships on the
            home route that actually paints it. */}
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
