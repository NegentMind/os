"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { LOCALES, type Locale } from "@/lib/i18n";
import type { NavCopy } from "@/lib/marketing-types";
import { hrefFor, type PageId } from "@/lib/site-routes";
import { ORG_URL } from "@/lib/site";
import { BrandMark } from "@/components/nm/v2/brand-mark";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ITEMS: { page: PageId; key: "home" | "projects" | "about" | "contribute" }[] = [
  { page: "home", key: "home" },
  { page: "projects", key: "projects" },
  { page: "about", key: "about" },
  { page: "contribute", key: "contribute" },
];

function pageFromPath(pathname: string): PageId {
  if (pathname.includes("/projects/vantadb")) return "vantadb";
  if (pathname.includes("/projects")) return "projects";
  if (pathname.includes("/about")) return "about";
  if (pathname.includes("/contribute")) return "contribute";
  return "home";
}

function LangSwitch({ lang, copy }: { lang: Locale; copy: NavCopy }) {
  const pathname = usePathname();
  const pillId = useId();
  const { canAnimate } = useSiteMotion();
  const hrefForLocale = (l: Locale) =>
    pathname.replace(/^\/(en|es)(?=\/|$)/, `/${l}`) || `/${l}`;
  return (
    // Pill toggle: a hairline structure-colored plate marks the active
    // locale and slides between options, same grammar as the nav pill.
    <nav aria-label={copy.language} className="nm2-header__lang">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={hrefForLocale(l)}
          hrefLang={l}
          className="nm2-header__lang-link"
          data-current={l === lang || undefined}
          aria-current={l === lang ? "page" : undefined}
        >
          {l === lang && (
            <motion.span
              layoutId={`${pillId}-lang`}
              className="nm2-header__lang-pill"
              transition={canAnimate
                ? { type: "spring", stiffness: 420, damping: 36 }
                : { duration: 0 }}
              aria-hidden="true"
            />
          )}
          <span className="nm2-header__lang-label">{l.toUpperCase()}</span>
        </Link>
      ))}
    </nav>
  );
}

export function SiteHeader({ lang, copy }: { lang: Locale; copy: NavCopy }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [floating, setFloating] = useState(false);
  const floatingRef = useRef(false);
  const { scrollY } = useScroll();
  const { canAnimate } = useSiteMotion();
  const current = pageFromPath(pathname);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = floatingRef.current ? latest >= 40 : latest > 96;
    if (next === floatingRef.current) return;
    floatingRef.current = next;
    setFloating(next);
  });

  useEffect(() => {
    const next = window.scrollY > 96;
    floatingRef.current = next;
    setFloating(next);
  }, []);

  // Close the sheet on any route change (links, locale switch, back/forward)
  // and when the desktop nav takes over at 64rem. Escape and Radix focus
  // restoration stay intact because onOpenChange still drives the root.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const isActive = (page: PageId) =>
    page === current || (page === "projects" && current === "vantadb");

  const links = ITEMS.map(({ page, key }) => (
    <Link
      key={page}
      href={hrefFor(lang, page)}
      className="nm2-header__link"
      data-active={isActive(page) || undefined}
      aria-current={isActive(page) ? "page" : undefined}
    >
      {isActive(page) && (
        <motion.span
          layoutId="nm2-nav-pill"
          className="nm2-header__link-pill"
          transition={canAnimate
            ? { type: "spring", stiffness: 420, damping: 36 }
            : { duration: 0 }}
          aria-hidden="true"
        />
      )}
      {copy[key]}
    </Link>
  ));

  return (
    <>
      <a href="#main-content" className="nm2-skip">
        {copy.skipToContent}
      </a>
      <header className="nm2-header">
          <motion.div
            initial={false}
            animate={{ y: floating ? -6 : 0 }}
            transition={{ duration: canAnimate ? 1.1 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="nm2-header__bar"
            data-floating={floating || undefined}
          >
            <Link
              href={hrefFor(lang, "home")}
              className="nm2-header__brand"
              aria-label={`NEGENT MIND — ${copy.home}`}
            >
              <BrandMark variant="wordmark" decorative />
            </Link>

            <nav className="nm2-header__nav">{links}</nav>

            <div className="nm2-header__right">
              <LangSwitch lang={lang} copy={copy} />
              <a
                href={ORG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="nm2-header__github"
              >
                {copy.github}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>

              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="nm2-header__menu"
                    aria-label={copy.openMenu}
                  >
                    <Menu size={18} aria-hidden="true" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="nm2-menu"
                  showCloseButton={false}
                  aria-describedby={undefined}
                >
                  <SheetTitle className="sr-only">{copy.openMenu}</SheetTitle>
                  <div className="nm2-menu__list">
                    {ITEMS.map(({ page, key }) => (
                      <SheetClose asChild key={page}>
                        <Link
                          href={hrefFor(lang, page)}
                          className="nm2-menu__link"
                          data-active={isActive(page) || undefined}
                          aria-current={isActive(page) ? "page" : undefined}
                        >
                          {copy[key]}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  <div className="nm2-menu__meta">
                    <LangSwitch lang={lang} copy={copy} />
                    <SheetClose asChild>
                      <a
                        href={ORG_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nm2-header__github nm2-menu__github"
                      >
                        {copy.github}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </SheetClose>
                  </div>
                  <SheetClose asChild>
                    <button
                      type="button"
                      className="nm2-header__menu nm2-menu__close"
                      aria-label={copy.closeMenu}
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  </SheetClose>
                </SheetContent>
              </Sheet>
            </div>
          </motion.div>
      </header>
    </>
  );
}
