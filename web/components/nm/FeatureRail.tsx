"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type RailItem = {
  index: string;
  name: string;
  detail: string;
  spec: string;
};

/**
 * Rail de capacidades (patrón feature-rail): índice mono fijo a la izquierda
 * que marca la fila activa mientras el scroll recorre las filas a la derecha.
 * Hairlines, sin cards. IntersectionObserver, sin GSAP.
 */
export function FeatureRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState(0);
  const rowsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx ?? 0);
            setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rowsRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  return (
    <div className="grid gap-10 md:grid-cols-[220px_1fr]">
      <div className="relative hidden md:block">
        <div className="sticky top-32">
          <div className="border-linedark border-l-2">
            {items.map((it, i) => (
              <div
                key={it.index}
                className={cn(
                  "font-mono px-4 py-1.5 text-[11px] tracking-[0.14em] uppercase transition-colors duration-300",
                  i === active
                    ? "border-pulse -ml-0.5 border-l-2 text-pulse"
                    : "text-fog",
                )}
              >
                {it.index} · {it.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        {items.map((it, i) => (
          <div
            key={it.index}
            data-idx={i}
            ref={(el) => {
              rowsRef.current[i] = el;
            }}
            className="border-linedark border-t py-10 first:border-t-0 md:min-h-[38vh] md:first:pt-0"
          >
            <p className="font-mono text-[11px] tracking-[0.14em] text-fog uppercase md:hidden">
              {it.index}
            </p>
            <h3 className="font-display mt-2 text-2xl font-bold tracking-[0.04em] text-bone uppercase sm:text-3xl md:mt-0">
              {it.name}
            </h3>
            <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-fog text-pretty">
              {it.detail}
            </p>
            <p className="font-mono mt-5 text-xs tracking-[0.1em] text-pulse">
              {it.spec}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
