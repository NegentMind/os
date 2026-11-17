import {
  AnimatedHeading,
  type HeadingEffect,
} from "@/components/nm/v2/animated-heading";

type SectionHeadingProps = {
  title: string;
  description?: string;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
  effect?: HeadingEffect;
};

export function SectionHeading({
  title,
  description,
  id,
  as: Tag = "h2",
  className,
  effect = "assemble",
}: SectionHeadingProps) {
  return (
    <div className={["nm2-section-heading", className].filter(Boolean).join(" ")}>
      <Tag id={id} className="nm2-section-heading__title">
        <AnimatedHeading text={title} effect={effect} />
      </Tag>
      {description ? (
        <p className="nm2-section-heading__description">{description}</p>
      ) : null}
    </div>
  );
}
