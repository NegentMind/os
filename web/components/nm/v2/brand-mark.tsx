/*
 * Orbital lettering — original vector geometry approved in
 * brand/specimens/verdigris-copper.html (frozen). Not a font: never set
 * font-family on this artwork, and never substitute a text rendering.
 */
type BrandMarkProps = {
  variant?: "wordmark" | "monogram";
  className?: string;
  /** Decorative duplicates hide from assistive tech; the primary mark speaks. */
  decorative?: boolean;
};

const WORDMARK = (
  <g fill="none" stroke="currentColor" strokeWidth={13} strokeLinejoin="bevel">
    <path d="M12,96 V16 L56,96 V16" />
    <path transform="translate(80,0)" d="M52,16 H12 V96 H52 M12,56 H44" />
    <path transform="translate(154,0)" d="M68,34 A30,30 0 1 0 74,56 H46" />
    <path transform="translate(248,0)" d="M52,16 H12 V96 H52 M12,56 H44" />
    <path transform="translate(322,0)" d="M12,96 V16 L56,96 V16" />
    <path transform="translate(402,0)" d="M6,16 H58 M32,16 V96" />
    <path transform="translate(506,0)" d="M12,96 V16 L40,62 L68,16 V96" />
    <path transform="translate(596,0)" d="M18,16 V96" />
    <path transform="translate(642,0)" d="M12,96 V16 L56,96 V16" />
    <path transform="translate(722,0)" d="M12,16 V96 H38 A40,40 0 0 0 38,16 H12 Z" />
    <circle cx={822} cy={92} r={6} stroke="none" fill="currentColor" />
  </g>
);

const MONOGRAM = (
  <g fill="none" stroke="currentColor" strokeWidth={13} strokeLinejoin="bevel">
    <path d="M12,96 V16 L56,96 V16" />
    <path transform="translate(82,0)" d="M12,96 V16 L40,62 L68,16 V96" />
    <circle cx={170} cy={92} r={6} stroke="none" fill="currentColor" />
  </g>
);

export function BrandMark({
  variant = "wordmark",
  className,
  decorative = false,
}: BrandMarkProps) {
  const isWordmark = variant === "wordmark";
  return (
    <svg
      viewBox={isWordmark ? "0 0 836 120" : "0 0 180 120"}
      className={["nm2-brandmark", className].filter(Boolean).join(" ")}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Negent Mind"}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      {isWordmark ? WORDMARK : MONOGRAM}
    </svg>
  );
}
