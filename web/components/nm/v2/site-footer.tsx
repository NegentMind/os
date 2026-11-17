import Link from "next/link";
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

function ExtLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
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
  return (
    <footer className="nm2-footer" aria-labelledby="footer-statement">
      <FieldCanvas variant="network" className="nm2-footer__field" interactive />
      <div className="nm2-container nm2-footer__content">
        <div className="nm2-footer__grid">
          <div>
            <Link
              href={hrefFor(lang, "home")}
              aria-label={`Negent Mind — ${nav.home}`}
              className="nm2-footer__brand"
            >
              <BrandMark
                variant="monogram"
                decorative
              />
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
            <div>
              <h2 className="nm2-footer__heading">{copy.resources}</h2>
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
            </div>
            <nav>
              <ul className="nm2-footer__list">
                {NAV_ITEMS.map(({ page, key }) => (
                  <li key={page}>
                    <Link href={hrefFor(lang, page)}>{nav[key]}</Link>
                  </li>
                ))}
                <li>
                  <ExtLink href={CODE_OF_CONDUCT_URL}>{copy.conduct}</ExtLink>
                </li>
                <li>
                  <ExtLink href={SECURITY_URL}>{copy.security}</ExtLink>
                </li>
                <li>
                  <ExtLink href={TRADEMARK_URL}>{copy.trademark}</ExtLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="nm2-footer__preferences">
          <MotionPreference copy={motionCopy} />
        </div>
      </div>
    </footer>
  );
}
