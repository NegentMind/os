import Link from "next/link";

/*
 * Open-source section ported from webTemplates/mondragon2 (price-card
 * pattern: plan label → oversized amount → description → included list →
 * pill CTA). Retokenized to Void/Bone/Pulse. No pricing is implied —
 * the "amount" is Apache-2.0.
 */
const CARDS = [
  {
    plan: "The substrate",
    amount: "Apache-2.0",
    per: "v0.9.0 — in build",
    desc: "VantaDB. One dependency, embedded in your process, readable end to end.",
    inc: "WHAT'S IN THE BOX",
    rows: [
      ["engine", "HNSW + BM25 hybrid search, fused by RRF"],
      ["isolation", "MVCC snapshots — reads never block writes"],
      ["durability", "WAL with CRC32C + auto-heal on open"],
      ["memory", "TTL expiry, scoped contexts, zero network"],
    ],
    cta: "github.com/ness-e/Vantadb",
    href: "https://github.com/ness-e/Vantadb",
  },
  {
    plan: "The organization",
    amount: "Open",
    per: "specs before code",
    desc: "Negent Mind publishes capability specifications as RFCs before any repository exists. No phantom projects.",
    inc: "HOW TO JOIN",
    rows: [
      ["read", "the specification and the RFC pipeline"],
      ["build", "good first issues on the engine repo"],
      ["shape", "RFC reviews decide what gets built next"],
      ["govern", "public roadmap, public roadmap only"],
    ],
    cta: "github.com/NegentMind",
    href: "https://github.com/NegentMind",
  },
] as const;

export function OssCards() {
  return (
    <div className="oss-cards">
      {CARDS.map((c) => (
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
