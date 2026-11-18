import type { ComponentPropsWithoutRef, ReactNode } from "react";

/*
 * ArtFigure — the canonical "art plate" of the Orbital scenes: a `<figure>`
 * holding a framed diagram/canvas plus its `<figcaption>` provenance line.
 *
 * Repeated grammar consolidated from SystemStory, CapabilityStory,
 * ScopeStudy, EvidenceWorkbench, HolonExplorer and MemoryDemo, where the
 * same figure/frame/caption markup was inlined six times.
 *
 * `decorative` controls the frame's `aria-hidden`: pass `false` when the
 * art carries real content or interactive controls (the orb toggle in
 * SystemStory, the module seats in HolonExplorer). Extra frame attributes
 * (e.g. `data-art` for lab variants) go through `frameProps`.
 */
export function ArtFigure({
  caption,
  children,
  className,
  frameClassName,
  decorative = true,
  frameProps,
}: {
  /** Provenance caption rendered in `<figcaption>` (e.g. "conceptual"). */
  caption: string;
  /** The art itself: a BlueprintScene, CoreOrb, MemoryStack or map. */
  children: ReactNode;
  /** Class for the outer `<figure>` (defaults to none). */
  className?: string;
  /** Class for the art frame div that wraps `children`. */
  frameClassName?: string;
  /** When true (default) the frame is `aria-hidden` — the art is pure
   *  illustration and the caption carries its meaning. */
  decorative?: boolean;
  /** Extra props for the art frame (data-* hooks, labels, styling refs). */
  frameProps?: ComponentPropsWithoutRef<"div">;
}) {
  return (
    <figure className={className}>
      <div
        {...frameProps}
        className={frameClassName}
        aria-hidden={decorative || undefined}
      >
        {children}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
