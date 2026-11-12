"use client";

/*
 * Infinite text marquee ported from webTemplates/mondragon2 (marquee +
 * marquee-track, 22s linear loop, content duplicated for the -50% wrap).
 */
const WORDS = [
  "Negentropy",
  "VantaDB",
  "Cardinal",
  "Meta",
  "Iris",
  "Execute",
  "Sage",
];

export function Marquee() {
  const items = [...WORDS, ...WORDS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((w, i) => (
          <span key={i} className={i % 2 === 1 ? "marquee-ghost" : ""}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
