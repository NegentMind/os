"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Revelado por máscara: la línea entra desde abajo con recorte.
 * Reservado a titulares display del hero. Una vez por vista.
 */
export function MaskLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={className ?? "block"}
        initial={{ y: "112%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
