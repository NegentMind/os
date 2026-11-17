import type { ReactNode } from "react";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} className={["nm2-section", className].filter(Boolean).join(" ")}>
      <ScrollScene className="nm2-container">{children}</ScrollScene>
    </section>
  );
}
