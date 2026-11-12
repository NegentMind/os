"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Telón cinematográfico generado por canvas: base void, fugas de luz tenues
 * a la deriva (caos atado al campo, nunca decoración UI), grano de película
 * y viñeta. Todo procedural: ningún píxel se descarga, todo se computa.
 */
export function FilmBackdrop({ className }: { className?: string }) {
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

    // Grano de película: puntos pseudoaleatorios por fotograma.
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.floor(r.width * dpr);
      h = Math.floor(r.height * dpr);
      canvas.width = Math.max(2, w);
      canvas.height = Math.max(2, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const leaks = [
      { hue: "255,0,85", bx: 0.82, by: 0.22, r: 0.55, sp: 0.021, ph: 0.0, a: 0.1 },
      { hue: "0,240,255", bx: 0.12, by: 0.75, r: 0.5, sp: 0.016, ph: 2.1, a: 0.08 },
      { hue: "204,255,0", bx: 0.65, by: 0.88, r: 0.42, sp: 0.026, ph: 4.2, a: 0.06 },
      { hue: "139,92,246", bx: 0.3, by: 0.15, r: 0.48, sp: 0.013, ph: 1.2, a: 0.09 },
    ];

    const draw = (t: number) => {
      ctx.fillStyle = "#08090C";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const L of leaks) {
        const x = (L.bx + 0.06 * Math.sin(t * L.sp + L.ph)) * w;
        const y = (L.by + 0.05 * Math.cos(t * L.sp * 1.3 + L.ph)) * h;
        const rad = L.r * Math.max(w, h);
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(${L.hue},${L.a})`);
        g.addColorStop(1, `rgba(${L.hue},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = "source-over";
      // Grano: puntos pseudoaleatorios estables por frame (barato y vivo).
      const n = Math.floor((w * h) / 9000);
      ctx.fillStyle = "rgba(237,234,225,0.05)";
      let seed = (t * 60) | 0;
      for (let i = 0; i < n; i++) {
        seed = (Math.imul(seed ^ (seed >>> 15), 1 | seed) + 0x6d2b79f5) | 0;
        const x = ((seed >>> 8) % w + w) % w;
        seed = (Math.imul(seed ^ (seed >>> 7), 61 | seed) ^ seed) >>> 0;
        const y = (seed % h + h) % h;
        ctx.fillRect(x, y, 1, 1);
      }
      // Viñeta.
      const v = ctx.createRadialGradient(
        w / 2, h / 2, Math.min(w, h) * 0.35,
        w / 2, h / 2, Math.max(w, h) * 0.75
      );
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, w, h);
    };

    if (reduced) {
      draw(12.5);
      return () => window.removeEventListener("resize", resize);
    }
    let running = true;
    const loop = () => {
      if (!running) return;
      draw(performance.now() / 1000);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    loop();
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
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
