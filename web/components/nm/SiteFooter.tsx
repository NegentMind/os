import Link from "next/link";
import type { Dict } from "@/lib/i18n";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_ENABLED,
  HANDBOOK_URL,
  ORG_URL,
  SPECS_REPO,
  VANTADB_REPO,
} from "@/lib/site";

/*
 * Cierre real: wordmark gigante (patrón portado de templates/ox Footer —
 * footer-word a escala de viewport), sitemap centrado y meta row.
 * Sin rutas inventadas; legales marcados como pendientes. El mailto solo
 * aparece con CONTACT_EMAIL_ENABLED (dominio activo); el Handbook es texto
 * plano hasta que exista HANDBOOK_URL.
 */
export function SiteFooter({ dict }: { dict: Dict["footer"] }) {
  return (
    <footer className="border-linedark border-t pt-16 pb-10">
      <p
        aria-hidden="true"
        className="font-display text-center font-bold tracking-[0.02em] text-bone select-none"
        style={{ fontSize: "clamp(96px, 17vw, 240px)", lineHeight: 0.8 }}
      >
        NEGENT<span className="text-pulse">.</span>
      </p>

      <nav
        aria-label={dict.navAria}
        className="font-mono mt-12 mb-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs font-bold tracking-[0.14em] text-fog uppercase"
      >
        {dict.links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="transition-colors hover:text-pulse"
          >
            {l.label}
          </Link>
        ))}
        <a
          href={VANTADB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-pulse"
        >
          VantaDB
        </a>
        <a
          href={ORG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-pulse"
        >
          GitHub
        </a>
        <a
          href={SPECS_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-pulse"
        >
          Specs
        </a>
        {HANDBOOK_URL ? (
          <a
            href={HANDBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-pulse"
          >
            {dict.handbook}
          </a>
        ) : (
          <span>{dict.handbookPending}</span>
        )}
        {CONTACT_EMAIL_ENABLED ? (
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="transition-colors hover:text-pulse"
          >
            {CONTACT_EMAIL}
          </a>
        ) : null}
      </nav>

      <div className="font-mono mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 text-[13px] text-fog sm:px-6">
        <span>{dict.legal.replace("{year}", "2026")}</span>
        <span>{dict.pending}</span>
      </div>
    </footer>
  );
}
