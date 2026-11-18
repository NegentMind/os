import type { ReactNode } from "react";

/*
 * StoryDetail — the live region that reads out the selected item of a
 * story control group (SystemStory, MemoryDemo, EvidenceWorkbench; the
 * HolonExplorer detail panel shares the same grammar).
 *
 * The contract is the point: a single `aria-live="polite"` + `aria-atomic`
 * region whose `id` the controls point at via `aria-controls`. Content is
 * free-form (heading + copy, optionally a badge or context line) so each
 * story keeps its own typography while the announcement behavior stays
 * identical.
 */
export function StoryDetail({
  id,
  className,
  children,
}: {
  /** Referenced by StoryControl's `controlsId`. */
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className={["nm2-story-detail", className].filter(Boolean).join(" ")}
      aria-live="polite"
      aria-atomic="true"
    >
      {children}
    </div>
  );
}
