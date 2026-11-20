"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  index: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  className?: string;
};

/**
 * Encabezado numerado de sección (00–05). El número ordena el dossier;
 * el titular lleva el peso, sin kickers encima.
 */
export function SectionHeading({ index, title, lede, id, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn("max-w-3xl", className)}
    >
      <p
        aria-hidden="true"
        className="font-mono text-xs tracking-[0.2em] text-fog tabular-nums"
      >
        {index}
      </p>
      <h2
        id={id}
        className="font-display mt-4 text-4xl font-bold uppercase leading-[1.02] tracking-[0.02em] text-bone sm:text-6xl"
      >
        {title}
      </h2>
      {lede ? (
        <div className="mt-5 max-w-[65ch] text-base leading-relaxed text-fog">
          {lede}
        </div>
      ) : null}
    </motion.div>
  );
}
