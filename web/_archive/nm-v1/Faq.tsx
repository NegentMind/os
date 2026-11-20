"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: string };

/** Acordeón FAQ: una respuesta abierta a la vez, motion/react. */
export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-linedark divide-linedark divide-y border-t">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span
                className={cn(
                  "font-display text-sm font-bold tracking-[0.06em] uppercase transition-colors sm:text-base",
                  isOpen ? "text-pulse" : "text-bone group-hover:text-pulse",
                )}
              >
                {item.q}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-fog transition-transform duration-300",
                  isOpen && "rotate-180 text-pulse",
                )}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[68ch] pb-6 text-sm leading-relaxed text-fog text-pretty sm:text-base">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
