import type { ReactNode } from "react";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  backdrop?: ReactNode;
};

export function Section({ id, children, className, backdrop }: SectionProps) {
  return (
    <section id={id} className={["nm2-section", className].filter(Boolean).join(" ")}>
      {backdrop}
      <ScrollScene className="nm2-container">{children}</ScrollScene>
    </section>
  );
}
