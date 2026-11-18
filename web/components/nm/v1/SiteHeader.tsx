"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FlipText } from "@/components/nm/v1/FlipText";
import { useLuminance } from "@/components/nm/v1/useLuminance";
import { LOCALES, type Dict, type Locale } from "@/lib/i18n";
import { ORG_URL } from "@/lib/site";

/*
 * Floating nav ported from webTemplates/mondragon2 (Nav.tsx): transparent
 * over the hero — bone ink that reads over the silk — collapsing into a
 * light pill after 60px of scroll. Links use letter-by-letter FlipText.
 * Language switch swaps the first path segment (/en ↔ /es).
 */
export function SiteHeader({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dict["nav"];
}) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const tone = useLuminance(navRef);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hrefFor = (l: Locale) =>
    pathname.replace(/^\/(en|es)(?=\/|$)/, `/${l}`) || `/${l}`;

  return (
    <header
      ref={navRef}
      className={`nm-nav${scrolled ? " pill" : ""}`}
      data-tone={tone}
    >
      <div className="nm-nav-inner">
        <Link
          href={`/${lang}`}
          className="nm-nav-word font-display uppercase"
          aria-label={dict.homeAria}
        >
          NEGENT&nbsp;MIND<span className="text-pulse">.</span>
        </Link>
        <nav aria-label={dict.navAria} className="nm-nav-links">
          {dict.links.map((l) => (
            <Link key={l.href} href={l.href}>
              <FlipText text={l.label} />
            </Link>
          ))}
        </nav>
        <div className="nm-nav-right">
          <nav aria-label={dict.langAria} className="nm-nav-lang font-mono">
            {LOCALES.map((l, i) => (
              <span key={l} className="nm-nav-lang-item">
                {i > 0 && <span className="nm-nav-lang-sep">/</span>}
                <Link
                  href={hrefFor(l)}
                  hrefLang={l}
                  aria-current={l === lang ? "true" : undefined}
                  className={l === lang ? "on" : ""}
                >
                  {l.toUpperCase()}
                </Link>
              </span>
            ))}
          </nav>
          <a
            href={ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nm-nav-cta font-mono"
          >
            {dict.cta}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
