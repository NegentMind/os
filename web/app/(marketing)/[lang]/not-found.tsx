import { ActionLink } from "@/components/nm/v2/action-link";
import { SectionHeading } from "@/components/nm/v2/section-heading";
import { LOCALES } from "@/lib/i18n";

/*
 * Branded 404 inside the locale shell (header/footer stay mounted).
 * The boundary cannot read route params, so the copy is bilingual and
 * links point at both locales' home.
 */
export default function NotFound() {
  return (
    <section className="nm2-page nm2-editorial" data-page="not-found">
      <div className="nm2-container">
        <p className="nm2-nf-code">404</p>
        <SectionHeading
          title="This page does not exist. / Esta página no existe."
          description="The link may be stale or the route was never published. / El enlace puede estar desfasado o la ruta nunca se publicó."
        />
        <div className="nm2-actions">
          {LOCALES.map((lang) => (
            <ActionLink key={lang} href={`/${lang}`}>
              {lang === "en" ? "Home — English" : "Inicio — Español"}
            </ActionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
