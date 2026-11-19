import { BrandMark } from "@/components/nm/v2/brand-mark";

/*
 * OrbitSigil — the lab's seal: the NM monogram held inside a breathing
 * orbital ring, with one spectrum point traveling the boundary and three
 * quiet nodes already in orbit. Interim stand-in for the registry Orb
 * (components/nm/ext): same brief — an orbital ring that breathes — drawn
 * with the scene grammar (1.5 structural stroke, 0.65 ambient, single
 * punctual spectrum accent) so it can be swapped without rethinking the
 * section.
 *
 * Pure SVG + CSS, no client script: SSR-complete and decorative. The
 * breathing and the travel live only under html[data-motion="on"], which
 * MotionProvider sets once JS resolves, the OS does not ask for reduced
 * motion and the global control is not paused — every other surface
 * renders the same still plate. The outer ring is a <path> carrying
 * data-draw so the enclosing ScrollScene traces it on entry.
 */
export function OrbitSigil({ className = "" }: { className?: string }) {
  return (
    <div className={`nm2-orbit-sigil ${className}`} aria-hidden="true">
      <svg
        className="nm2-orbit-sigil__art"
        viewBox="0 0 240 240"
        fill="none"
        focusable="false"
      >
        <g className="nm2-orbit-sigil__breath">
          <path
            className="nm2-orbit-sigil__ring"
            d="M224 120A104 104 0 1 1 16 120 104 104 0 1 1 224 120Z"
            data-draw=""
          />
          <ellipse
            className="nm2-orbit-sigil__orbit"
            cx="120"
            cy="120"
            rx="104"
            ry="38"
            transform="rotate(-18 120 120)"
          />
          <ellipse
            className="nm2-orbit-sigil__orbit"
            cx="120"
            cy="120"
            rx="104"
            ry="38"
            transform="rotate(54 120 120)"
          />
          <circle className="nm2-orbit-sigil__node" cx="199.7" cy="186.9" r="3" />
          <circle
            className="nm2-orbit-sigil__node"
            cx="22.3"
            cy="155.6"
            r="3"
            opacity="0.6"
          />
          <circle
            className="nm2-orbit-sigil__node"
            cx="138.1"
            cy="17.6"
            r="3"
            opacity="0.4"
          />
        </g>
        <g className="nm2-orbit-sigil__traveler">
          <circle className="nm2-orbit-sigil__halo" cx="224" cy="120" r="9" />
          <circle className="nm2-orbit-sigil__dot" cx="224" cy="120" r="4.5" />
        </g>
      </svg>
      <BrandMark
        variant="monogram"
        className="nm2-orbit-sigil__mark"
        decorative
      />
    </div>
  );
}
