"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";

export type FieldVariant = "wave" | "orbit" | "network" | "memory";

type Particle = {
  u: number;
  v: number;
  layer: number;
  x: number;
  y: number;
  radius: number;
  alpha: number;
  light: number;
};

type Field = {
  points: Particle[];
  filaments: number[][];
  columns: number;
};

type Pointer = { x: number; y: number; present: boolean };

// Scheduling target, not a measured frame-rate claim.
const FRAME_INTERVAL = 1000 / 30;
const TAU = Math.PI * 2;
const STILL_POINTER: Pointer = { x: 0, y: 0, present: false };
const FIELD_DIMENSIONS = {
  wave: { poster: [24, 14], mobile: [30, 20], desktop: [50, 28] },
  orbit: { poster: [64, 6], mobile: [75, 8], desktop: [175, 8] },
  network: { poster: [24, 14], mobile: [30, 20], desktop: [50, 28] },
  memory: { poster: [14, 8], mobile: [20, 10], desktop: [25, 18] },
} as const satisfies Record<
  FieldVariant,
  Record<"poster" | "mobile" | "desktop", readonly [number, number]>
>;

/**
 * Lifecycle state only: no frame-driven React updates. Shared by the two
 * decorative scenes so CSS and Canvas honor the same visibility contract.
 */
export function useSceneActivity(root: RefObject<HTMLDivElement | null>) {
  const { canAnimate } = useSiteMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    let disposed = false;
    // Without viewport observation, retain static art instead of running an
    // unbounded decorative loop in a browser that cannot report offscreen work.
    let inView = false;
    const sync = () => {
      if (!disposed) setVisible(inView && !document.hidden);
    };
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry?.isIntersecting ?? false;
              sync();
            },
            { threshold: 0 },
          )
        : null;

    observer?.observe(element);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      disposed = true;
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [root]);

  return canAnimate && visible;
}

function createField(variant: FieldVariant, compact: boolean, poster = false): Field {
  const size = poster ? "poster" : compact ? "mobile" : "desktop";
  const [columns, rows] = FIELD_DIMENSIONS[variant][size];
  const layers = variant === "memory" ? 3 : 1;
  const points: Particle[] = [];
  const filaments: number[][] = [];

  for (let layer = 0; layer < layers; layer += 1) {
    const base = points.length;
    for (let row = 0; row < rows; row += 1) {
      const indices: number[] = [];
      for (let col = 0; col < columns; col += 1) {
        indices.push(points.length);
        points.push({
          u: col / (variant === "orbit" ? columns : columns - 1),
          v: row / (rows - 1),
          layer,
          x: 0,
          y: 0,
          radius: 1,
          alpha: 0,
          light: 0,
        });
      }
      if (variant === "orbit") {
        filaments.push([...indices, indices[0]]);
      } else if (
        (variant === "wave" && row % 3 === 0) ||
        (variant === "memory" && (row % 4 === 0 || row === rows - 1))
      ) {
        filaments.push(indices);
      }
    }
    if (variant === "memory") {
      for (const col of [0, columns - 1]) {
        filaments.push(
          Array.from({ length: rows }, (_, row) => base + row * columns + col),
        );
      }
    }
  }
  return { points, filaments, columns };
}

function projectField(
  field: Field,
  variant: FieldVariant,
  width: number,
  height: number,
  t: number,
  pointer: Pointer,
) {
  const reach = variant === "network"
    ? Math.min(width * 0.3, 240)
    : Math.min(width * 0.24, height * 0.6, 180);
  for (const point of field.points) {
    const { u, v, layer } = point;
    point.light = 0;
    if (variant === "wave") {
      const depth = (Math.sin(u * 6 + t * 0.2 + v) + 1) * 0.5;
      point.x = (u - 0.5) * width * 1.18 + width * 0.5;
      point.y = height * 0.5
        + Math.sin(u * 8 - t * 0.4 + v * 1.3) * height * 0.15
        + Math.sin(u * 15 + t * 0.17 + v * 0.5) * height * 0.04
        + (v - 0.5) * height * 0.28;
      point.radius = 0.6 + depth * 0.9;
      point.alpha = 0.08 + depth * 0.4;
    } else if (variant === "orbit") {
      const angle = u * TAU + t * 0.035 * (v < 0.5 ? 1 : -1);
      const tilt = -0.32 + v * 0.62;
      const x = Math.cos(angle) * width * (0.28 + v * 0.18);
      const y = Math.sin(angle) * height * (0.12 + v * 0.13);
      const depth = (Math.sin(angle) + 1) * 0.5;
      point.x = width * 0.5 + x * Math.cos(tilt) - y * Math.sin(tilt);
      point.y = height * 0.5 + x * Math.sin(tilt) + y * Math.cos(tilt);
      point.radius = 0.65 + depth * 0.7;
      point.alpha = 0.08 + depth * 0.34;
    } else if (variant === "memory") {
      point.x = width * 0.5 + (u - 0.5) * width * 0.64
        + (v - 0.5) * width * 0.22;
      point.y = height * 0.5 + (v - 0.5) * height * 0.28
        - (u - 0.5) * height * 0.11 + (layer - 1) * height * 0.2
        + Math.sin(t * 0.18 + layer) * height * 0.006;
      point.radius = 0.75 + layer * 0.17;
      point.alpha = 0.1 + layer * 0.11 + v * 0.08;
    } else {
      point.x = width * (0.06 + u * 0.88)
        + Math.sin(v * 7 + t * 0.24) * Math.min(width * 0.008, 8);
      point.y = height * (0.13 + v * 0.74)
        + Math.sin(u * 8 - t * 0.32 + v) * Math.min(height * 0.022, 12);
      if (pointer.present && reach > 0) {
        const distance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
        point.light = Math.max(0, 1 - distance / reach) ** 2;
      }
      point.radius = 0.95 + point.light * 0.9;
      const base = 0.18 + (1 - v) * 0.12
        + Math.sin(u * 4 + v * 3 + t * 0.18) * 0.045;
      point.alpha = Math.min(0.95, base * (1 + point.light * 1.2));
    }
  }
}

const POSTERS = Object.fromEntries(
  (["wave", "orbit", "network", "memory"] as const).map((variant) => {
    const field = createField(variant, true, true);
    projectField(field, variant, 960, 540, 0, STILL_POINTER);
    return [variant, field];
  }),
) as Record<FieldVariant, Field>;

function FieldPoster({ variant }: { variant: FieldVariant }) {
  const field = POSTERS[variant];
  return (
    <svg
      className="nm2-field__poster"
      viewBox="0 0 960 540"
      width="960"
      height="540"
      preserveAspectRatio="none"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.65" opacity="0.075">
        {field.filaments.map((indices, index) => (
          <polyline
            key={index}
            points={indices.map((i) => {
              const point = field.points[i];
              return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
            }).join(" ")}
          />
        ))}
      </g>
      {field.points.map((point, index) => (
        <circle
          key={index}
          cx={point.x.toFixed(2)}
          cy={point.y.toFixed(2)}
          r={point.radius.toFixed(2)}
          opacity={point.alpha.toFixed(3)}
        />
      ))}
    </svg>
  );
}

export function FieldCanvas({
  variant,
  className = "",
  interactive = false,
}: {
  variant: FieldVariant;
  className?: string;
  interactive?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const time = useRef(0);
  const failed = useRef(false);
  const active = useSceneActivity(root);

  useEffect(() => {
    const element = root.current;
    const surface = canvas.current;
    if (!element || !surface || !active || failed.current) return;

    let raf = 0;
    let disposed = false;
    let width = 0;
    let height = 0;
    let lastPaint = 0;
    let lastTick = 0;
    let field = createField(variant, true);
    let resizeObserver: ResizeObserver | null = null;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const pointer: Pointer = { ...STILL_POINTER };
    // Observe pointer activity without turning this decorative layer into a
    // hit target or stealing interactions from the composing section.
    const pointerHost = element.parentElement ?? element;
    let listening = false;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !fine.matches || document.hidden) return;
      const rect = element.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.present = pointer.x >= 0 && pointer.x <= width
        && pointer.y >= 0 && pointer.y <= height;
    };
    const resetPointer = () => { pointer.present = false; };
    const syncPointer = () => {
      const allowed = interactive && fine.matches && !disposed;
      if (allowed === listening) return;
      listening = allowed;
      if (allowed) {
        pointerHost.addEventListener("pointermove", onPointerMove, { passive: true });
        pointerHost.addEventListener("pointerleave", resetPointer, { passive: true });
        pointerHost.addEventListener("pointercancel", resetPointer, { passive: true });
      } else {
        pointerHost.removeEventListener("pointermove", onPointerMove);
        pointerHost.removeEventListener("pointerleave", resetPointer);
        pointerHost.removeEventListener("pointercancel", resetPointer);
        resetPointer();
      }
    };

    const dispose = () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      mobile.removeEventListener("change", resize);
      fine.removeEventListener("change", syncPointer);
      syncPointer();
      surface.removeEventListener("contextlost", onContextLost);
      element.dataset.rendered = "false";
      surface.hidden = true;
      // Release the backing store while the SVG remains immediately available.
      surface.width = 0;
      surface.height = 0;
    };
    const fail = (error: unknown) => {
      if (disposed) return;
      failed.current = true;
      dispose();
      console.warn(
        "Orbital FieldCanvas: Canvas 2D unavailable; static SVG retained. Check canvas support/context errors before remounting the scene.",
        error,
      );
    };
    function onContextLost() {
      fail(new Error("Canvas 2D context lost"));
    }

    let context: CanvasRenderingContext2D | null = null;
    let color = "";
    const draw = () => {
      if (!context || disposed || width <= 0 || height <= 0) return;
      try {
        projectField(field, variant, width, height, time.current, pointer);
        context.clearRect(0, 0, width, height);
        context.fillStyle = color;
        context.strokeStyle = color;
        context.lineWidth = 0.65;
        context.globalAlpha = variant === "memory" ? 0.085 : 0.06;
        for (const indices of field.filaments) {
          context.beginPath();
          indices.forEach((index, position) => {
            const point = field.points[index];
            if (position === 0) context?.moveTo(point.x, point.y);
            else context?.lineTo(point.x, point.y);
          });
          context.stroke();
        }
        for (let index = 0; index < field.points.length; index += 1) {
          const point = field.points[index];
          if (variant === "network" && point.light > 0.01) {
            context.globalAlpha = point.light * 0.16;
            context.beginPath();
            if (index % field.columns < field.columns - 1) {
              const neighbor = field.points[index + 1];
              context.moveTo(point.x, point.y);
              context.lineTo(neighbor.x, neighbor.y);
            }
            const below = field.points[index + field.columns];
            if (below) {
              context.moveTo(point.x, point.y);
              context.lineTo(below.x, below.y);
            }
            context.stroke();
          }
          context.globalAlpha = point.alpha;
          context.beginPath();
          context.arc(point.x, point.y, point.radius, 0, TAU);
          context.fill();
        }
        if (variant === "network" && pointer.present) {
          context.lineWidth = 0.8;
          for (const point of field.points) {
            if (point.light < 0.12) continue;
            context.globalAlpha = point.light * 0.4;
            context.beginPath();
            context.moveTo(pointer.x, pointer.y);
            context.lineTo(point.x, point.y);
            context.stroke();
          }
        }
        context.globalAlpha = 1;
        surface.hidden = false;
        element.dataset.rendered = "true";
      } catch (error: unknown) {
        fail(error);
      }
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
      if (!disposed) raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      if (!context || disposed) return;
      try {
        const rect = element.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        surface.width = Math.max(1, Math.round(width * dpr));
        surface.height = Math.max(1, Math.round(height * dpr));
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        // Resolved inherited color works on both carbon and inverse surfaces.
        color = getComputedStyle(element).color;
        field = createField(variant, mobile.matches || width < 480);
        draw();
      } catch (error: unknown) {
        fail(error);
      }
    };

    try {
      context = surface.getContext("2d", { alpha: true });
      if (!context) throw new Error("No CanvasRenderingContext2D");
      surface.addEventListener("contextlost", onContextLost);
      resize();
      if (!disposed) {
        if ("ResizeObserver" in window) {
          resizeObserver = new ResizeObserver(resize);
          resizeObserver.observe(element);
        }
        window.addEventListener("resize", resize, { passive: true });
        mobile.addEventListener("change", resize);
        fine.addEventListener("change", syncPointer);
        syncPointer();
        raf = requestAnimationFrame(tick);
      }
    } catch (error: unknown) {
      fail(error);
    }
    return dispose;
  }, [active, interactive, variant]);

  return (
    <div
      ref={root}
      className={`nm2-field nm2-field--${variant} ${className}`}
      data-active={active ? "true" : "false"}
      aria-hidden="true"
    >
      <FieldPoster variant={variant} />
      <canvas ref={canvas} className="nm2-field__canvas" hidden />
    </div>
  );
}
