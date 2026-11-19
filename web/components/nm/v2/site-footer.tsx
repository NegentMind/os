import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { FooterCopy, NavCopy } from "@/lib/marketing-types";
import { hrefFor, type PageId } from "@/lib/site-routes";
import {
  CODE_OF_CONDUCT_URL,
  CONTACT_EMAIL,
  CONTACT_EMAIL_ENABLED,
  DISCUSSIONS_URL,
  HANDBOOK_URL,
  ORG_URL,
  SECURITY_URL,
  TRADEMARK_URL,
} from "@/lib/site";
import { BrandMark } from "@/components/nm/v2/brand-mark";
import { FieldCanvas } from "@/components/nm/v2/field-canvas";
import {
  MotionPreference,
  type MotionPreferenceCopy,
} from "@/components/nm/v2/motion-preference";

const NAV_ITEMS: { page: PageId; key: "home" | "projects" | "about" | "contribute" }[] = [
  { page: "home", key: "home" },
  { page: "projects", key: "projects" },
  { page: "about", key: "about" },
  { page: "contribute", key: "contribute" },
];

/* Governance links live in the base strip, next to the legal line — the
   resource column stays for community entry points only. */
const POLICIES: { href: string; key: "conduct" | "security" | "trademark" }[] = [
  { href: CODE_OF_CONDUCT_URL, key: "conduct" },
  { href: SECURITY_URL, key: "security" },
  { href: TRADEMARK_URL, key: "trademark" },
];

function ExtLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="nm2-footer__ext">
      {children}
      <ArrowUpRight size={11} aria-hidden="true" />
    </a>
  );
}

export function SiteFooter({
  lang,
  nav,
  copy,
  motionCopy,
}: {
  lang: Locale;
  nav: NavCopy;
  copy: FooterCopy;
  motionCopy: MotionPreferenceCopy;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="nm2-footer nm2-tone-section" aria-labelledby="footer-statement">
      <FieldCanvas variant="network" className="nm2-footer__field" interactive />
      <div className="nm2-container nm2-footer__content">
        <div className="nm2-footer__grid">
          <div className="nm2-footer__lead">
            <Link
              href={hrefFor(lang, "home")}
              aria-label={`NEGENT MIND — ${nav.home}`}
              className="nm2-footer__brand"
            >
              <BrandMark variant="monogram" decorative />
            </Link>
            <h2 id="footer-statement" className="nm2-footer__statement">{copy.statement}</h2>
            <p className="nm2-footer__independence">{copy.independence}</p>
            <p className="nm2-footer__contact">
              {CONTACT_EMAIL_ENABLED ? (
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              ) : (
                copy.contactPending
              )}
            </p>
          </div>
          <div className="nm2-footer__cols">
            <nav aria-label={copy.sections}>
              <h2 className="nm2-footer__heading">
                <span className="nm2-footer__index" aria-hidden="true">01</span>
                {copy.sections}
              </h2>
              <ul className="nm2-footer__list">
                {NAV_ITEMS.map(({ page, key }) => (
                  <li key={page}>
                    <Link href={hrefFor(lang, page)}>{nav[key]}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label={copy.projects}>
              <h2 className="nm2-footer__heading">
                <span className="nm2-footer__index" aria-hidden="true">02</span>
                {copy.projects}
              </h2>
              <ul className="nm2-footer__list">
                <li>
                  <Link href={hrefFor(lang, "vantadb")}>VantaDB</Link>
                </li>
                <li>
                  <Link href={hrefFor(lang, "projects")}>Scopegrain</Link>
                </li>
              </ul>
            </nav>
            <nav aria-label={copy.resources}>
              <h2 className="nm2-footer__heading">
                <span className="nm2-footer__index" aria-hidden="true">03</span>
                {copy.resources}
              </h2>
              <ul className="nm2-footer__list">
                <li>
                  <ExtLink href={ORG_URL}>{nav.github}</ExtLink>
                </li>
                <li>
                  <ExtLink href={DISCUSSIONS_URL}>{copy.discussions}</ExtLink>
                </li>
                <li>
                  {HANDBOOK_URL ? (
                    <ExtLink href={HANDBOOK_URL}>{copy.handbook}</ExtLink>
                  ) : (
                    <span className="nm2-footer__pending" data-pending={copy.handbookPending}>
                      {copy.handbook}
                    </span>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="nm2-footer__base">
          <p className="nm2-footer__legal">© {year} NEGENT MIND · {copy.builtOpen}</p>
          <ul className="nm2-footer__policies">
            {POLICIES.map(({ href, key }) => (
              <li key={key}>
                <ExtLink href={href}>{copy[key]}</ExtLink>
              </li>
            ))}
          </ul>
          <MotionPreference copy={motionCopy} />
        </div>
        <div className="nm2-footer__signature" aria-hidden="true">
          <BrandMark variant="wordmark" decorative />
        </div>
      </div>
    </footer>
  );
}
