import type { Dict } from "@/lib/i18n";
import { CONTACT_EMAIL, CONTACT_EMAIL_ENABLED, ORG_URL } from "@/lib/site";

const TONE: Record<string, string> = {
  pulse: "text-pulse",
  bone: "text-bone",
  fog: "text-fog",
};

/**
 * Zona 05 THE WORK — cómo opera la organización: pipeline RFC, bento de
 * métricas verificables, founder y contacto (mailto solo si
 * CONTACT_EMAIL_ENABLED; si no, texto + enlace a GitHub). El encabezado lo renderiza la
 * página (mismo patrón que HolonGrid).
 */
export function WorkSection({ dict }: { dict: Dict["work"] }) {
  return (
    <div className="work-grid">
      {/* RFC pipeline */}
      <div className="work-method">
        <p className="font-mono text-[10px] tracking-[0.2em] text-fog uppercase">
          {dict.method.title}
        </p>
        <ol className="work-steps">
          {dict.method.steps.map((s, i) => (
            <li key={s.name} className="work-step">
              <span className="work-step__num font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-bone">
                  {s.name}
                </p>
                <p className="mt-1 font-mono text-[11px] leading-relaxed text-fog">
                  {s.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Metrics bento — verifiable constants only */}
      <div className="work-metrics">
        {dict.metrics.map((m) => (
          <div key={m.label} className="work-metric">
            <p className={`work-metric__value ${TONE[m.tone ?? "bone"] ?? "text-bone"}`}>
              {m.value}
              {m.unit ? <span className="work-metric__unit">{m.unit}</span> : null}
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-fog uppercase">
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* Founder */}
      <div className="work-block">
        <p className="font-mono text-[10px] tracking-[0.2em] text-fog uppercase">
          {dict.founder.title}
        </p>
        <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-fog text-pretty">
          {dict.founder.body}
        </p>
      </div>

      {/* Contact */}
      <div className="work-block">
        <p className="font-mono text-[10px] tracking-[0.2em] text-fog uppercase">
          {dict.contact.title}
        </p>
        <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-fog text-pretty">
          {dict.contact.body}
        </p>
        {CONTACT_EMAIL_ENABLED ? (
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-4 inline-block border border-linedark px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-bone transition-colors hover:border-pulse hover:text-pulse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pulse"
          >
            {CONTACT_EMAIL}
          </a>
        ) : (
          <>
            {/* Domain not registered yet: show the address, never a dead mailto. */}
            <p className="mt-4 font-mono text-[11px] tracking-[0.15em] text-bone">
              {CONTACT_EMAIL}{" "}
              <span className="text-fog">{dict.contact.pending}</span>
            </p>
            <a
              href={ORG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block border border-linedark px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-bone transition-colors hover:border-pulse hover:text-pulse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pulse"
            >
              {dict.contact.fallback} ↗
            </a>
          </>
        )}
      </div>
    </div>
  );
}
