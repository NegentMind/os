import type { ReactNode } from "react";

/** First-paint CSS entrance avoids resetting content after a lazy import. */
export function HeroEntrance({ children }: { children: ReactNode }) {
  return <div className="nm2-hero__content">{children}</div>;
}
