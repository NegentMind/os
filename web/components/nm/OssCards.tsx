import Link from "next/link";
import type { Dict } from "@/lib/i18n";

/*
 * Open-source section ported from webTemplates/mondragon2 (price-card
 * pattern: plan label → oversized amount → description → included list →
 * pill CTA). Retokenized to Void/Bone/Pulse. No pricing is implied —
 * the "amount" is Apache-2.0.
 */
export function OssCards({ cards }: { cards: Dict["oss"]["cards"] }) {
  return (
    <div className="oss-cards">
      {cards.map((c) => (
        <article key={c.plan} className="price-card">
          <div>
            <span className="plan">{c.plan}</span>
            <span className="amount">{c.amount}</span>
            <span className="per"> / {c.per}</span>
          </div>
          <div>
            <p className="desc">{c.desc}</p>
            <p className="inc">{c.inc}</p>
            <ul>
              {c.rows.map(([k, v]) => (
                <li key={k} className="incrow">
                  <b>{k}</b>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill"
          >
            {c.cta}
          </Link>
        </article>
      ))}
    </div>
  );
}
