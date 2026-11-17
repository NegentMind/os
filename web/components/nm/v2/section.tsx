import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} className={["nm2-section", className].filter(Boolean).join(" ")}>
      <div className="nm2-container">{children}</div>
    </section>
  );
}
