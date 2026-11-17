"use client";

import { useEffect } from "react";
import { motion, useMotionValue } from "motion/react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";

export function PointerFeedback() {
  const { canAnimate } = useSiteMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const opacity = useMotionValue(0);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!canAnimate) {
      opacity.set(0);
      return;
    }

    const hide = () => opacity.set(0);
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || document.hidden) return;
      // Motion values update the decorative transform, not React per frame.
      x.set(event.clientX - 18);
      y.set(event.clientY - 18);
      opacity.set(1);
    };
    let listening = false;
    const syncPointer = () => {
      const enabled = finePointer.matches;
      if (enabled === listening) return;
      listening = enabled;
      if (enabled) {
        window.addEventListener("pointermove", move, { passive: true });
      } else {
        window.removeEventListener("pointermove", move);
        hide();
      }
    };
    const onVisibility = () => { if (document.hidden) hide(); };
    syncPointer();
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", onVisibility);
    finePointer.addEventListener("change", syncPointer);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", onVisibility);
      finePointer.removeEventListener("change", syncPointer);
      hide();
    };
  }, [canAnimate, opacity, x, y]);

  return (
    <motion.div
      className="nm2-pointer-feedback"
      style={{ x, y, opacity }}
      aria-hidden="true"
    />
  );
}
