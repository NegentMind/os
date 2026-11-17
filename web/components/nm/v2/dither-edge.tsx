"use client";

import { useEffect, useRef } from "react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";

const CELL = 6;
const MAX_DPR = 1.5;
const JITTER = 0.08;
const SHIFT = 0.15;

function buildBayer(size: number): number[][] {
  let matrix = [[0]];
  for (let n = 1; n < size; n *= 2) {
    const next: number[][] = [];
    for (let y = 0; y < n * 2; y++) {
      next.push([]);
      for (let x = 0; x < n * 2; x++) {
        const base = matrix[y % n][x % n] * 4;
        const quad = (y < n ? 0 : 2) + (x < n ? 0 : 1);
        next[y].push(base + [0, 2, 3, 1][quad]);
      }
    }
    matrix = next;
  }
  return matrix;
}

const BAYER = buildBayer(8);

function columnJitter(column: number): number {
  let h = Math.imul(column + 1, 2654435761) >>> 0;
  h ^= h >>> 15;
  h = Math.imul(h, 2246822519) >>> 0;
  h ^= h >>> 13;
  return ((h % 1000) / 1000 - 0.5) * 2 * JITTER;
}

function easeOutCubic(value: number): number {
  return 1 - Math.pow(1 - value, 3);
}

export function DitherEdge({ edge }: { edge: "top" | "bottom" }) {
  const host = useRef<HTMLDivElement>(null);
  const { canAnimate } = useSiteMotion();

  useEffect(() => {
    const container = host.current;
    const canvas = container?.querySelector("canvas");
    if (!container || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let shift = 0;
    let drawnShift = Number.NaN;
    let frame = 0;
    let visible = false;

    const draw = () => {
      drawnShift = shift;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#000";
      const columns = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      for (let x = 0; x < columns; x++) {
        const jitter = columnJitter(x);
        for (let r = 0; r < rows; r++) {
          const depth = rows > 1 ? r / (rows - 1) : 0;
          const density = easeOutCubic(1 - depth) + jitter + shift;
          if (BAYER[x % 8][r % 8] / 64 >= density) continue;
          const y = edge === "top" ? r * CELL : height - (r + 1) * CELL;
          context.fillRect(x * CELL, y, CELL, CELL);
        }
      }
      container.dataset.ready = "true";
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width <= 0 || height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      draw();
    };

    const measure = () => {
      frame = 0;
      const rect = container.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - center) / window.innerHeight),
      );
      const next = Math.round((0.5 - progress) * 2 * SHIFT * 50) / 50;
      shift = next;
      if (next !== drawnShift && width > 0) draw();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let intersection: IntersectionObserver | undefined;
    const onScroll = () => schedule();
    if (canAnimate) {
      intersection = new IntersectionObserver(([entry]) => {
        const nextVisible = entry.isIntersecting;
        if (nextVisible === visible) return;
        visible = nextVisible;
        if (visible) {
          window.addEventListener("scroll", onScroll, { passive: true });
          schedule();
        } else {
          window.removeEventListener("scroll", onScroll);
        }
      });
      intersection.observe(container);
    }

    return () => {
      resizeObserver.disconnect();
      intersection?.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [canAnimate, edge]);

  return (
    <div
      ref={host}
      className={`nm2-dither-edge nm2-dither-edge--${edge}`}
      aria-hidden="true"
    >
      <canvas className="nm2-dither-edge__canvas" />
    </div>
  );
}
