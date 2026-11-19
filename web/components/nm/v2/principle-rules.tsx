import type { SiteCopy } from "@/lib/content/en";

/*
 * PrincipleRules — the home principles (#principles) rendered as a short
 * manifesto rather than a spec list: each principle is a numbered rule
 * (01–03) whose statement carries the hierarchy, followed by its detail
 * and a mono footnote naming where the rule can be checked.
 *
 * Marks are small geometric signs from the scene grammar (1.5 structural
 * stroke, fill+border nodes, no shadows): a reticle for evidence, a
 * bounded cell holding its node for local-first, and a permeable
 * membrane with a solid nucleus for open core — the same dashed/solid
 * language the holon field uses for vision vs. built. Server component;
 * `data-scroll-reveal` lets the Section's ScrollScene stagger the rules.
 */

type PrincipleRule = SiteCopy["home"]["principles"]["items"][number];

const MARK_STROKE = "nm2-rules__mark-line";
const MARK_FILL = "nm2-rules__mark-fill";

function RuleMark({ kind }: { kind: string }) {
  return (
    <svg
      className="nm2-rules__mark"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      data-mark={kind}
    >
      {kind === "local" ? (
        /* The capability kept inside the application's own boundary. */
        <>
          <rect className={MARK_STROKE} x="8" y="8" width="24" height="24" rx="5" />
          <circle className={MARK_FILL} cx="20" cy="20" r="4.5" />
        </>
      ) : kind === "open" ? (
        /* A permeable membrane around an open nucleus. */
        <>
          <circle
            className={`${MARK_STROKE} ${MARK_STROKE}--dashed`}
            cx="20"
            cy="20"
            r="13"
          />
          <circle className={MARK_FILL} cx="20" cy="20" r="5" />
        </>
      ) : (
        /* "evidence" and the default: an inspection reticle on a point. */
        <>
          <path
            className={MARK_STROKE}
            d="M6 13V6h7M27 6h7v7M34 27v7h-7M13 34H6v-7"
          />
          <circle className={MARK_FILL} cx="20" cy="20" r="4.5" />
        </>
      )}
    </svg>
  );
}

export function PrincipleRules({ items }: { items: readonly PrincipleRule[] }) {
  return (
    <ol className="nm2-rules">
      {items.map((item, index) => (
        <li key={item.term} className="nm2-rules__rule" data-scroll-reveal="">
          <div className="nm2-rules__index">
            <span className="nm2-rules__num">{String(index + 1).padStart(2, "0")}</span>
            <RuleMark kind={item.mark} />
          </div>
          <div className="nm2-rules__statement">
            <h3 className="nm2-rules__term">{item.term}</h3>
            <p className="nm2-rules__detail">{item.detail}</p>
            <p className="nm2-rules__check">{item.check}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
