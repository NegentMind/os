"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Trazado de osciloscopio de la entropía medida (0–8 bits, escala Shannon
 * para byte). Dibuja solo valores reales recibidos por props; sin datos
 * no hay línea. Retícula tenue, trazo Pulse, sin rellenos ni glow decorativo.
 */
export function EntropyTrace({
  values,
  className,
  ariaLabel,
}: {
  values: number[];
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const valuesRef = useRef<number[]>(values);
  valuesRef.current = values;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = !reduced;
    const MAX = 8;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(2, Math.floor(r.width * dpr));
      canvas.height = Math.max(2, Math.floor(r.height * dpr));
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = "#08090C";
      ctx.fillRect(0, 0, w, h);
      // Retícula: 4 divisiones horizontales tenues.
      ctx.strokeStyle = "rgba(35,43,56,0.9)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const y = Math.floor((h / 4) * i) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      const vs = valuesRef.current;
      if (vs.length > 1) {
        ctx.strokeStyle = "#8B7CFF";
        ctx.lineWidth = Math.max(1.5, w / 480);
        ctx.beginPath();
        vs.forEach((v, i) => {
          const x = (i / (vs.length - 1)) * w;
          const y = h - (Math.min(v, MAX) / MAX) * (h - 4) - 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        // Punto de lectura actual.
        const last = vs[vs.length - 1];
        const lx = w - 2;
        const ly = h - (Math.min(last, MAX) / MAX) * (h - 4) - 2;
        ctx.fillStyle = "#EDEAE3";
        ctx.fillRect(lx - 2, ly - 2, 4, 4);
      }
      // Etiquetas de escala honestas: 0 y 8 bits.
      ctx.fillStyle = "#98A1B3";
      ctx.font = `${Math.max(9, Math.floor(h / 12))}px "JetBrains Mono", monospace`;
      ctx.fillText("8", 4, 12);
      ctx.fillText("0", 4, h - 5);
    };

    if (reduced) {
      draw();
      return () => window.removeEventListener("resize", resize);
    }
    const loop = () => {
      if (!running) return;
      draw();
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
      role="img"
      aria-label={ariaLabel}
      className={className ?? "h-28 w-full"}
    />
  );
}
