import type { ReactNode } from "react";

type SurfaceProps = {
  children: ReactNode;
  tone?: "surface" | "raised" | "spectrum";
  className?: string;
};

export function Surface({ children, tone = "surface", className }: SurfaceProps) {
  return (
    <div
      className={["nm2-surface", className].filter(Boolean).join(" ")}
      data-tone={tone}
    >
      {children}
    </div>
  );
}
