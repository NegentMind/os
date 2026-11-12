"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Retícula de puntos: el ruido resuelve en orden. Cada punto nace desplazado
 * (caos, color hiper-cromático solo dentro del field) y converge a su celda;
 * el puntero ordena localmente. Estado convergido estático con
 * prefers-reduced-motion. Determinista: mismo seed, mismo campo.
 */

const CHAOS_COLORS = ["#FF0055", "#00F0FF", "#CCFF00", "#FF6600"];
const ORDER_COLOR = "#98A1B3";
const PULSE = "#8B7CFF";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Dot = {
  hx: number;
  hy: number;
  sx: number;
  sy: number;
  seed: number;
  colorIdx: number;
};

export function LatticeField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    const GAP = 44;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rng = mulberry32(1337);
      dots = [];
      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            hx: c * GAP + (r % 2 ? GAP / 2 : 0),
            hy: r * GAP,
            sx: (rng() - 0.5) * w * 1.6,
            sy: (rng() - 0.5) * h * 1.6,
            seed: rng(),
            colorIdx: Math.floor(rng() * CHAOS_COLORS.length),
          });
        }
      }
    };

    const start = performance.now();
    const CONVERGE_MS = 4200;
    const ORDER_RADIUS = 190;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const elapsed = t - start;
      const global = Math.min(elapsed / CONVERGE_MS, 1);
      const eased = 1 - Math.pow(1 - global, 3);
      const wobble = Math.min(elapsed / 1400, 1);

      for (const d of dots) {
        // Punto parte de una posición caótica hacia su celda de retícula.
        let px = d.hx + d.sx * (1 - eased);
        let py = d.hy + d.sy * (1 - eased);

        // Deriva residual mínima una vez convergido (respiración de campo).
        const drift = wobble * 2.2;
        px += Math.sin(t / 1600 + d.seed * 12.56) * drift;
        py += Math.cos(t / 1900 + d.seed * 12.56) * drift;

        // El puntero impone orden local: los puntos cercanos encajan antes.
        let local = eased;
        if (pointer.active) {
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < ORDER_RADIUS) {
            local = Math.max(local, 1 - dist / ORDER_RADIUS);
            px = d.hx + (px - d.hx) * (1 - local);
            py = d.hy + (py - d.hy) * (1 - local);
          }
        }

        const chaos = 1 - Math.min(Math.max(local, eased), 1);
        const size = chaos > 0.35 ? 1.6 : 1.2;
        ctx.fillStyle = chaos > 0.45 ? CHAOS_COLORS[d.colorIdx] : ORDER_COLOR;
        ctx.globalAlpha = chaos > 0.45 ? 0.85 : 0.42;
        ctx.fillRect(px - size / 2, py - size / 2, size, size);
      }

      // Núcleo del puntero: pulso único, el acento del mundo.
      if (pointer.active) {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = PULSE;
        ctx.fillRect(pointer.x - 1.5, pointer.y - 1.5, 3, 3);
      }
      ctx.globalAlpha = 1;

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    if (reduced) {
      draw(start + CONVERGE_MS + 1);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className ?? "absolute inset-0 h-full w-full"}
    />
  );
}
