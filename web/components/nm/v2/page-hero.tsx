import type { ReactNode } from "react";
import { AnimatedHeading } from "@/components/nm/v2/animated-heading";
import { BlueprintScene } from "@/components/nm/v2/blueprint-scene";
import { FieldCanvas, type FieldVariant } from "@/components/nm/v2/field-canvas";

export function PageHero({
  title,
  description,
  variant,
  children,
}: {
  title: string;
  description: string;
  variant: FieldVariant;
  children?: ReactNode;
}) {
  return (
    <section className={`nm2-page-hero nm2-page-hero--${variant}`} aria-labelledby="page-heading">
      <FieldCanvas variant={variant} className="nm2-page-hero__field" interactive />
      <div className="nm2-page-hero__content">
        <h1 id="page-heading" className="nm2-page-hero__title">
          <AnimatedHeading text={title} effect={variant === "memory" ? "trace" : "focus"} />
        </h1>
        <p className="nm2-page-hero__description">{description}</p>
        {children ? <div className="nm2-page-hero__details">{children}</div> : null}
      </div>
      <div className="nm2-page-hero__art" aria-hidden="true">
        <BlueprintScene
          variant={variant === "memory" ? "memory" : variant === "orbit" ? "capabilities" : "system"}
          className="nm2-page-hero__geometry"
        />
      </div>
    </section>
  );
}
