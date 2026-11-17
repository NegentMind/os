import type { ReactNode } from "react";
import { DitherEdge } from "@/components/nm/v2/dither-edge";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  dither?: boolean;
  backdrop?: ReactNode;
};

export function Section({ id, children, className, dither, backdrop }: SectionProps) {
  return (
    <section id={id} className={["nm2-section", className].filter(Boolean).join(" ")}>
      {backdrop}
      {dither ? <DitherEdge edge="top" /> : null}
      <ScrollScene className="nm2-container">{children}</ScrollScene>
      {dither ? <DitherEdge edge="bottom" /> : null}
    </section>
  );
}
