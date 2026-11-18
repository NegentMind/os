/*
 * SpecList — the term/detail row grammar (`<dl>` → `<div>` → `<dt>`/`<dd>`)
 * shared by the VantaDB facts sheet (`nm2-facts`) and the About principles
 * ledger (`nm2-principles`). Same semantics, divergent skins: the visual
 * weight lives in the className the call site passes, the list structure
 * stops being rewritten per page.
 */
export type SpecRow = {
  /** Term rendered in `<dt>` (key/name/principle). */
  term: string;
  /** Detail rendered in `<dd>` (value/description). */
  detail: string;
};

export function SpecList({
  rows,
  className,
}: {
  rows: readonly SpecRow[];
  /** Skin selector (e.g. "nm2-facts", "nm2-principles"). */
  className?: string;
}) {
  return (
    <dl className={className}>
      {rows.map((row) => (
        <div key={row.term}>
          <dt>{row.term}</dt>
          <dd>{row.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
