"use client";

import { useEffect, useRef } from "react";
import { useSceneActivity } from "@/components/nm/v2/field-canvas";
import { HERO_ART } from "@/components/nm/v2/hero-preset";

/*
 * Core orb — the minimal system diagram: one point cycling through the
 * spectrum, wrapped by a slowly rotating sphere of dots. Canvas 2D only;
 * poster SVG is the SSR/no-JS/reduced surface. Decorative: click pins the
 * color for play, but nothing here carries information.
 */

const FRAME_INTERVAL = 1000 / 30;
const TAU = Math.PI * 2;
const POINT_COUNT = 120;
const ROTATION_PERIOD = 40; // seconds per revolution
const TILT = -0.42;
const COLOR_DWELL = 1.6; // seconds per spectrum color
const COLOR_FADE = 0.45;
const REPEL_RADIUS = 0.42; // fraction of orb radius

type Vec3 = { x: number; y: number; z: number };
type Rgb = [number, number, number];

// Even fibonacci lattice on the unit sphere.
const BASE_POINTS: Vec3[] = (() => {
  const points: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < POINT_COUNT; i += 1) {
    const y = 1 - (i / (POINT_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return points;
})();

function hexToRgb(hex: string): Rgb {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const SPECTRUM: Rgb[] = Array.from(new Set(HERO_ART.params.colors)).map(hexToRgb);

function mix(a: Rgb, b: Rgb, t: number): string {
  const c = (i: number) => Math.round(a[i] + (b[i] - a[i]) * t);
  return `rgb(${c(0)} ${c(1)} ${c(2)})`;
}

function colorAt(time: number, pinned: number | null): string {
  const index = pinned ?? Math.floor(time / COLOR_DWELL) % SPECTRUM.length;
  if (pinned !== null) return mix(SPECTRUM[index], SPECTRUM[index], 0);
  const phase = (time % COLOR_DWELL) / COLOR_DWELL;
  if (phase > 1 - COLOR_FADE / COLOR_DWELL) {
    const t = (phase - (1 - COLOR_FADE / COLOR_DWELL)) * (COLOR_DWELL / COLOR_FADE);
    return mix(SPECTRUM[index], SPECTRUM[(index + 1) % SPECTRUM.length], t);
  }
  return mix(SPECTRUM[index], SPECTRUM[index], 0);
}

/** Projected point set for a fixed rotation — used by the static poster. */
function projectPoints(rotation: number): { x: number; y: number; z: number }[] {
  const cosA = Math.cos(rotation);
  const sinA = Math.sin(rotation);
  const cosT = Math.cos(TILT);
  const sinT = Math.sin(TILT);
  return BASE_POINTS.map((p) => {
    const x = p.x * cosA + p.z * sinA;
    const z = -p.x * sinA + p.z * cosA;
    const y = p.y * cosT - z * sinT;
    const depth = p.y * sinT + z * cosT;
    return { x, y, z: depth };
  });
}

// Round to 4 decimals: SSR/client float tails differ and would otherwise
// produce hydration attribute warnings on the static poster.
const POSTER_POINTS = projectPoints(0.6).map((p) => ({
  cx: Number((100 + p.x * 78).toFixed(4)),
  cy: Number((100 + p.y * 78).toFixed(4)),
  r: Number((0.9 + (p.z + 1) * 0.55).toFixed(4)),
  o: Number((0.25 + (p.z + 1) * 0.36).toFixed(4)),
}));

function OrbPoster() {
  return (
    <svg
      className="nm2-core-orb__poster"
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6">
        <circle cx="100" cy="100" r="78" />
        <ellipse cx="100" cy="100" rx="78" ry="24" />
        <ellipse cx="100" cy="100" rx="38" ry="78" />
      </g>
      <g fill="currentColor">
        {POSTER_POINTS.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} opacity={p.o} />
        ))}
      </g>
      <circle cx="100" cy="100" r="9" fill={HERO_ART.params.colors[1]} />
    </svg>
  );
}

export function CoreOrb({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const time = useRef(0);
  const active = useSceneActivity(root);

  useEffect(() => {
    const element = root.current;
    const surface = canvas.current;
    if (!element || !surface || !active) return;

    let disposed = false;
    let raf = 0;
    let lastPaint = 0;
    let lastTick = 0;
    let width = 0;
    let height = 0;
    let color = "";
    let boost = 1;
    let boostTarget = 1;
    const pointer = { x: 0, y: 0, present: false };
    let pinned: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const context = surface.getContext("2d", { alpha: true });
    if (!context) return;

    const draw = () => {
      if (disposed || width <= 0 || height <= 0) return;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.39;
      boost += (boostTarget - boost) * 0.06;
      const rotation = time.current * (TAU / ROTATION_PERIOD) * boost;
      const points = projectPoints(rotation);
      context.clearRect(0, 0, width, height);

      // Meridian frame in the section line color.
      context.strokeStyle = color;
      context.lineWidth = 1;
      context.globalAlpha = 0.5;
      context.beginPath();
      context.arc(cx, cy, radius, 0, TAU);
      context.stroke();
      context.globalAlpha = 0.3;
      for (const offset of [0, Math.PI / 3]) {
        context.beginPath();
        context.ellipse(
          cx, cy,
          Math.abs(Math.cos(rotation + offset)) * radius,
          radius,
          0, 0, TAU,
        );
        context.stroke();
      }
      context.beginPath();
      context.ellipse(cx, cy, radius, Math.abs(Math.sin(TILT)) * radius, 0, 0, TAU);
      context.stroke();

      // Sphere dots; pointer presence repels and accelerates.
      const reach = radius * (1 + REPEL_RADIUS);
      context.fillStyle = color;
      for (const p of points) {
        let px = cx + p.x * radius;
        let py = cy + p.y * radius;
        if (pointer.present) {
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < reach && d > 0.001) {
            const push = (1 - d / reach) * radius * 0.16;
            px += (dx / d) * push;
            py += (dy / d) * push;
          }
        }
        const depth = (p.z + 1) / 2;
        context.globalAlpha = 0.22 + depth * 0.66;
        context.beginPath();
        context.arc(px, py, 0.9 + depth * 1.5, 0, TAU);
        context.fill();
      }

      // The single colored point — spectrum cycle or pinned hue.
      const dotColor = colorAt(
        time.current,
        pinned !== null ? pinned % SPECTRUM.length : null,
      );
      context.globalAlpha = 0.5;
      context.fillStyle = dotColor;
      context.beginPath();
      context.arc(cx, cy, 13, 0, TAU);
      context.fill();
      context.globalAlpha = 1;
      context.beginPath();
      context.arc(cx, cy, 8, 0, TAU);
      context.fill();
      context.globalAlpha = 1;
      surface.hidden = false;
      element.dataset.rendered = "true";
    };

    const tick = (now: number) => {
      raf = 0;
      if (disposed || document.hidden) return;
      if (now - lastPaint >= FRAME_INTERVAL) {
        if (lastTick !== 0) time.current += Math.min((now - lastTick) / 1000, 0.1);
        lastTick = now;
        lastPaint = now - ((now - lastPaint) % FRAME_INTERVAL);
        draw();
      }
      raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      if (disposed) return;
      const rect = element.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      surface.width = Math.max(1, Math.round(width * dpr));
      surface.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      color = getComputedStyle(element).color;
      draw();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || document.hidden) return;
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer.present = x >= 0 && x <= width && y >= 0 && y <= height;
      pointer.x = x;
      pointer.y = y;
      boostTarget = pointer.present ? 3 : 1;
    };
    const resetPointer = () => {
      pointer.present = false;
      boostTarget = 1;
    };
    const onClick = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const d = Math.hypot(event.clientX - rect.left - cx, event.clientY - rect.top - cy);
      if (d > 22) return;
      pinned = pinned === null
        ? Math.floor(time.current / COLOR_DWELL) % SPECTRUM.length
        : null;
      draw();
    };

    resize();
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(element);
    }
    window.addEventListener("resize", resize, { passive: true });
    element.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerleave", resetPointer, { passive: true });
    element.addEventListener("pointercancel", resetPointer, { passive: true });
    element.addEventListener("click", onClick);
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", resetPointer);
      element.removeEventListener("pointercancel", resetPointer);
      element.removeEventListener("click", onClick);
      delete element.dataset.rendered;
      surface.hidden = true;
      surface.width = 0;
      surface.height = 0;
    };
  }, [active]);

  return (
    <div ref={root} className={`nm2-core-orb ${className}`} aria-hidden="true">
      <OrbPoster />
      <canvas ref={canvas} className="nm2-core-orb__canvas" hidden />
    </div>
  );
}
