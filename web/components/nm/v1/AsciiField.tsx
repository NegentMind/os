"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const CHAOS_GLYPHS = "@#%?*+~!:;";
const ORDER_GLYPHS = "█▓╬═│· ";
const CHAOS_COLORS = ["#FF0055", "#00F0FF", "#CCFF00", "#FF6600"];

export type FieldStats = { entropy: number; resolved: number; fps: number };

type Props = {
  onStats?: (s: FieldStats) => void;
  className?: string;
};

function hash2(x: number, y: number, seed: number): number {
  let h = (x * 374761393 + y * 668265263 + seed * 974634) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function valueNoise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const s = (t: number) => t * t * (3 - 2 * t);
  const a = hash2(xi, yi, seed);
  const b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed);
  const d = hash2(xi + 1, yi + 1, seed);
  return a + (b - a) * s(xf) + (c - a) * s(yf) + (a - b - c + d) * s(xf) * s(yf);
}

function fractal(x: number, y: number, t: number): number {
  return (
    valueNoise(x * 0.045 + t * 0.11, y * 0.045, 7) * 0.55 +
    valueNoise(x * 0.11 - t * 0.07, y * 0.11 + t * 0.05, 31) * 0.3 +
    valueNoise(x * 0.23, y * 0.23 - t * 0.09, 91) * 0.15
  );
}

/**
 * Campo ASCII de ruido fractal que el scroll converge a orden.
 * order 0→1 vía ScrollTrigger scrub (+ imán local al puntero).
 * Entropía de Shannon real sobre el histograma de glifos visibles.
 */
export function AsciiField({ onStats, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const statsRef = useRef(onStats);
  statsRef.current = onStats;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL = 15;
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let running = false;
    let order = reduced ? 1 : 0;
    let pointer = { x: -9999, y: -9999, active: false };
    let lastT = performance.now();
    let fps = 60;
    let frames = 0;
    let statTimer = 0;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      cols = Math.max(8, Math.floor(r.width / CELL));
      rows = Math.max(8, Math.floor(r.height / CELL));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `13px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = now - lastT;
      lastT = now;
      if (dt > 0) fps = fps * 0.92 + (1000 / dt) * 0.08;

      const r = wrap.getBoundingClientRect();
      const t = now / 1000;
      const hist = new Array(ORDER_GLYPHS.length + CHAOS_GLYPHS.length).fill(0);
      let resolved = 0;

      ctx.fillStyle = "#08090C";
      ctx.fillRect(0, 0, r.width, r.height);

      const cw = r.width / cols;
      const chh = r.height / rows;
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const n = fractal(gx, gy, t);
          let local = order;
          if (pointer.active) {
            const px = (pointer.x / r.width) * cols;
            const py = (pointer.y / r.height) * rows;
            const d = Math.hypot(gx - px, gy - py);
            local = Math.min(1, order + Math.max(0, 1 - d / 9) * 0.9);
          }
          const gate = 0.32 + local * 0.55;
          const x = gx * cw + 2;
          const y = gy * chh + 1;
          if (n > gate) {
            const gi = Math.floor(hash2(gx, gy, 5) * CHAOS_GLYPHS.length);
            ctx.fillStyle = CHAOS_COLORS[Math.floor(hash2(gy, gx, 9) * 4)];
            ctx.fillText(CHAOS_GLYPHS[gi], x, y);
            hist[ORDER_GLYPHS.length + gi]++;
          } else {
            const gi = Math.min(
              ORDER_GLYPHS.length - 1,
              Math.floor(n * ORDER_GLYPHS.length * 1.4)
            );
            ctx.fillStyle = n > gate - 0.12 ? "#EDEAE3" : "#232B38";
            ctx.fillText(ORDER_GLYPHS[gi], x, y);
            hist[gi]++;
            resolved++;
          }
        }
      }

      frames++;
      if (now - statTimer > 250) {
        statTimer = now;
        const total = cols * rows || 1;
        let entropy = 0;
        for (const c of hist) {
          if (c > 0) {
            const p = c / total;
            entropy -= p * Math.log2(p);
          }
        }
        statsRef.current?.({
          entropy: Math.round(entropy * 100) / 100,
          resolved: Math.round((resolved / total) * 100),
          fps: Math.round(fps),
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
    };
    const onLeave = () => {
      pointer.active = false;
    };

    let trigger: ScrollTrigger | undefined;
    if (!reduced) {
      trigger = ScrollTrigger.create({
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
        onUpdate: (self) => {
          order = self.progress;
        },
      });
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !running) {
            running = true;
            lastT = performance.now();
            raf = requestAnimationFrame(draw);
          } else if (!entry.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0.05 }
      );
      io.observe(wrap);
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
      return () => {
        io.disconnect();
        cancelAnimationFrame(raf);
        running = false;
        trigger?.kill();
        window.removeEventListener("resize", resize);
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
      };
    }

    // reduced-motion: un fotograma convergido, sin listeners
    {
      const r = wrap.getBoundingClientRect();
      const t = 0;
      const hist = new Array(ORDER_GLYPHS.length).fill(0);
      ctx.fillStyle = "#08090C";
      ctx.fillRect(0, 0, r.width, r.height);
      const cw = r.width / cols;
      const chh = r.height / rows;
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const n = fractal(gx, gy, t);
          const gi = Math.min(
            ORDER_GLYPHS.length - 1,
            Math.floor(n * ORDER_GLYPHS.length * 1.4)
          );
          ctx.fillStyle = "#232B38";
          if (n > 0.2) ctx.fillStyle = "#EDEAE3";
          ctx.fillText(ORDER_GLYPHS[gi], gx * cw + 2, gy * chh + 1);
          hist[gi]++;
        }
      }
      const total = cols * rows || 1;
      let entropy = 0;
      for (const c of hist) {
        if (c > 0) {
          const p = c / total;
          entropy -= p * Math.log2(p);
        }
      }
      statsRef.current?.({
        entropy: Math.round(entropy * 100) / 100,
        resolved: 100,
        fps: 0,
      });
    }
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
