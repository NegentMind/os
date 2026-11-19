"use client";

import { useEffect, useRef } from "react";
import { useSceneActivity } from "@/components/nm/v2/field-canvas";

/*
 * VantaStrata — the signature plate of the VantaDB section.
 *
 * One metaphor, drawn live on Canvas 2D: the single `.vanta` artifact as a
 * bright core, holding three concentric memory strata — L1 episodic (outer,
 * dense and ephemeral, with an append-head tracing writes), L2 semantic
 * (middle, sparser, steadier) and L3 procedural (inner, few and stable).
 * Occasional particles travel inward: the asynchronous consolidation pass.
 * Two slow monochrome gradient washes drift behind the rings — carbon to
 * silver, the only "color" the plate needs.
 *
 * Same lifecycle contract as FieldCanvas: SSR/reduced-motion renders the
 * static SVG poster; the canvas takes over only while the scene is visible,
 * the tab active and motion allowed, at a ~30 fps planning target.
 */

const TAU = Math.PI * 2;
const FRAME_INTERVAL = 1000 / 30;
const POSTER = 640;

/* Normalized geometry (unit = min(width, height)): the same projection feeds
   the live canvas and the static poster. */
const CX = 0.5;
const CY = 0.497;
const TILT = 0.86;

type Ring = { rx: number; count: number; size: number; speed: number; alpha: number };
const RINGS: readonly Ring[] = [
  { rx: 0.368, count: 30, size: 1.1, speed: 0.05, alpha: 0.32 }, // L1 episodic
  { rx: 0.256, count: 16, size: 1.5, speed: -0.032, alpha: 0.42 }, // L2 semantic
  { rx: 0.15, count: 7, size: 2.1, speed: 0.018, alpha: 0.6 }, // L3 procedural
];

const TRANSITS = 3;
const TRANSIT_PERIOD = 9;
const HEAD_TRAIL = 14;
const BLOBS = [
  { x: 0.32, y: 0.34, r: 0.52, driftX: 0.05, driftY: 0.04, speed: 0.07, phase: 0, alpha: 0.09 },
  { x: 0.7, y: 0.66, r: 0.44, driftX: 0.045, driftY: 0.05, speed: 0.06, phase: 2.1, alpha: 0.075 },
] as const;

const easeInOut = (p: number) => p * p * (3 - 2 * p);

function ringPoint(ring: Ring, theta: number, cx: number, cy: number, unit: number) {
  return {
    x: cx + Math.cos(theta) * ring.rx * unit,
    y: cy + Math.sin(theta) * ring.rx * TILT * unit,
  };
}

type StrataParticle = { x: number; y: number; radius: number; alpha: number; ring: number };

function particlesAt(t: number, cx: number, cy: number, unit: number): StrataParticle[] {
  const points: StrataParticle[] = [];
  for (let ring = 0; ring < RINGS.length; ring += 1) {
    const def = RINGS[ring];
    for (let i = 0; i < def.count; i += 1) {
      // Deterministic spread (golden-angle steps), never Math.random: the
      // poster and the live canvas must draw the same constellation.
      const theta = (i * 2.399963 + ring * 0.7) % TAU + t * def.speed;
      const point = ringPoint(def, theta, cx, cy, unit);
      const churn =
        ring === 0
          ? 0.55 + 0.45 * Math.sin(t * 0.5 + i * 1.7) // episodic: entries fade
          : ring === 1
            ? 0.8 + 0.2 * Math.sin(t * 0.3 + i * 2.3)
            : 1;
      points.push({
        x: point.x,
        y: point.y,
        radius: def.size,
        alpha: Math.max(0.05, def.alpha * churn),
        ring,
      });
    }
  }
  return points;
}

type Transit = { x: number; y: number; alpha: number };

/* Consolidation: a particle leaves L1 and settles toward the core along a
   decaying spiral; three staggered slots keep one in flight at a time. */
function transitAt(t: number, slot: number, cx: number, cy: number, unit: number): Transit[] {
  const trail: Transit[] = [];
  const p = (t / TRANSIT_PERIOD + slot / TRANSITS) % 1;
  for (let j = 0; j <= 5; j += 1) {
    const pj = p - j * 0.016;
    if (pj <= 0 || pj >= 0.98) continue;
    const eased = easeInOut(pj / 0.98);
    const rx = RINGS[0].rx + (RINGS[2].rx * 0.55 - RINGS[0].rx) * eased;
    const theta = slot * 2.1 + pj * 3.4;
    trail.push({
      x: cx + Math.cos(theta) * rx * unit,
      y: cy + Math.sin(theta) * rx * TILT * unit,
      alpha: Math.sin(Math.min(pj / 0.98, 1) * Math.PI) * 0.85 * (1 - j / 7),
    });
  }
  return trail;
}

function blobAt(t: number, index: number, w: number, h: number, unit: number) {
  const def = BLOBS[index];
  return {
    x: (def.x + Math.sin(t * def.speed + def.phase) * def.driftX) * w,
    y: (def.y + Math.cos(t * def.speed * 1.3 + def.phase) * def.driftY) * h,
    r: def.r * unit,
    alpha: def.alpha,
  };
}

/* getComputedStyle hands back "rgb(r, g, b)" or a hex token; canvas needs a
   channel-wise rgba() string for the gradient stops. */
function toRgba(color: string, alpha: number): string | null {
  const rgb = /^rgb\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)\s*\)$/.exec(color.trim());
  if (rgb) return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})`;
  const hex = /^#([0-9a-f]{6})$/i.exec(color.trim());
  if (hex) {
    const value = Number.parseInt(hex[1], 16);
    return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
  }
  return null;
}

function StrataPoster() {
  const cx = CX * POSTER;
  const cy = CY * POSTER;
  const particles = particlesAt(0, cx, cy, POSTER);
  const headTheta = 0;
  return (
    <svg
      className="nm2-vanta-strata__poster"
      viewBox={`0 0 ${POSTER} ${POSTER}`}
      width={POSTER}
      height={POSTER}
      preserveAspectRatio="xMidYMid meet"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {BLOBS.map((_, index) => (
          <radialGradient key={`wash-${index}`} id={`nm2-vanta-wash-${index}`}>
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.09" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {BLOBS.map((_, index) => {
        const blob = blobAt(0, index, POSTER, POSTER, POSTER);
        return (
          <circle
            key={`blob-${index}`}
            cx={blob.x.toFixed(1)}
            cy={blob.y.toFixed(1)}
            r={blob.r.toFixed(1)}
            fill={`url(#nm2-vanta-wash-${index})`}
          />
        );
      })}
      {RINGS.map((ring, index) => (
        <ellipse
          key={`ring-${index}`}
          cx={cx}
          cy={cy}
          rx={ring.rx * POSTER}
          ry={ring.rx * TILT * POSTER}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.14"
        />
      ))}
      {/* Static write-head trace on the episodic ring. */}
      <path
        d={describeRingArc(RINGS[0], headTheta - HEAD_TRAIL * 0.045, headTheta, cx, cy, POSTER)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.3"
      />
      {particles.map((point, index) => (
        <circle
          key={`p-${index}`}
          cx={point.x.toFixed(1)}
          cy={point.y.toFixed(1)}
          r={point.radius.toFixed(2)}
          opacity={point.alpha.toFixed(3)}
        />
      ))}
      <circle className="nm2-vanta-strata__core-halo" cx={cx} cy={cy} r={26} opacity="0.1" />
      <circle className="nm2-vanta-strata__core" cx={cx} cy={cy} r={3.5} />
    </svg>
  );
}

function describeRingArc(ring: Ring, a0: number, a1: number, cx: number, cy: number, unit: number) {
  const p0 = ringPoint(ring, a0, cx, cy, unit);
  const p1 = ringPoint(ring, a1, cx, cy, unit);
  const rx = ring.rx * unit;
  const ry = ring.rx * TILT * unit;
  return `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
}

export function VantaStrata({
  layers,
  core,
}: {
  /** Names for the L1→L3 strata, outer to inner. */
  layers: readonly string[];
  /** Label drawn at the core (the single-file artifact). */
  core: string;
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
    let resizeObserver: ResizeObserver | null = null;

    const dispose = () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
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
        "Orbital VantaStrata: Canvas 2D unavailable; static SVG retained. Check canvas support/context errors before remounting the scene.",
        error,
      );
    };
    function onContextLost() {
      fail(new Error("Canvas 2D context lost"));
    }

    let context: CanvasRenderingContext2D | null = null;
    let ink = "";
    let bright = "";
    const draw = () => {
      if (!context || disposed || width <= 0 || height <= 0) return;
      try {
        const t = time.current;
        const unit = Math.min(width, height);
        const cx = CX * width;
        const cy = CY * height;
        const silver = (alpha: number) => toRgba(ink, alpha) ?? `rgba(167, 180, 199, ${alpha})`;
        context.clearRect(0, 0, width, height);

        // Drifting monochrome washes: the plate's only "gradient" moment.
        context.globalCompositeOperation = "lighter";
        for (let index = 0; index < BLOBS.length; index += 1) {
          const blob = blobAt(t, index, width, height, unit);
          const gradient = context.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
          gradient.addColorStop(0, silver(blob.alpha));
          gradient.addColorStop(1, silver(0));
          context.fillStyle = gradient;
          context.fillRect(0, 0, width, height);
        }
        context.globalCompositeOperation = "source-over";

        // Strata outlines: ambient 0.65-weight ellipses.
        context.strokeStyle = ink;
        context.lineWidth = 0.65;
        context.globalAlpha = 0.14;
        for (const ring of RINGS) {
          context.beginPath();
          context.ellipse(cx, cy, ring.rx * unit, ring.rx * TILT * unit, 0, 0, TAU);
          context.stroke();
        }

        // Append head on L1: a bright point tracing the write position, with
        // a short arc trail fading behind it (append-only log).
        const headTheta = t * 0.35;
        const outer = RINGS[0];
        for (let j = 0; j < HEAD_TRAIL; j += 1) {
          context.globalAlpha = (1 - j / HEAD_TRAIL) * 0.32;
          context.lineWidth = 1.2;
          context.beginPath();
          context.ellipse(
            cx,
            cy,
            outer.rx * unit,
            outer.rx * TILT * unit,
            0,
            headTheta - (j + 1) * 0.045,
            headTheta - j * 0.045,
          );
          context.stroke();
        }
        const head = ringPoint(outer, headTheta, cx, cy, unit);
        context.globalAlpha = 0.9;
        context.beginPath();
        context.arc(head.x, head.y, 2 * (unit / POSTER), 0, TAU);
        context.fillStyle = bright;
        context.fill();

        // Orbiting particles, inner layers steadier and brighter.
        context.fillStyle = ink;
        for (const point of particlesAt(t, cx, cy, unit)) {
          context.globalAlpha = point.alpha;
          context.beginPath();
          context.arc(point.x, point.y, point.radius * (unit / POSTER), 0, TAU);
          context.fill();
        }

        // Consolidation transits drifting toward the core.
        context.fillStyle = bright;
        for (let slot = 0; slot < TRANSITS; slot += 1) {
          for (const step of transitAt(t, slot, cx, cy, unit)) {
            context.globalAlpha = step.alpha;
            context.beginPath();
            context.arc(step.x, step.y, 1.7 * (unit / POSTER), 0, TAU);
            context.fill();
          }
        }

        // The .vanta artifact: bright core + soft halo, 'lighter' so it reads
        // as the single luminous point every ring answers to.
        context.globalCompositeOperation = "lighter";
        const halo = context.createRadialGradient(cx, cy, 0, cx, cy, unit * 0.16);
        halo.addColorStop(0, silver(0.16));
        halo.addColorStop(1, silver(0));
        context.globalAlpha = 1;
        context.fillStyle = halo;
        context.fillRect(cx - unit * 0.16, cy - unit * 0.16, unit * 0.32, unit * 0.32);
        context.globalCompositeOperation = "source-over";
        context.fillStyle = bright;
        context.beginPath();
        context.arc(cx, cy, 3.5 * (unit / POSTER), 0, TAU);
        context.fill();
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
        const styles = getComputedStyle(element);
        ink = styles.color;
        bright = styles.getPropertyValue("--nm2-text") || "#f1f3f5";
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
        raf = requestAnimationFrame(tick);
      }
    } catch (error: unknown) {
      fail(error);
    }
    return dispose;
  }, [active]);

  return (
    <div
      ref={root}
      className="nm2-vanta-strata"
      data-float=""
      data-active={active ? "true" : "false"}
      aria-hidden="true"
    >
      <StrataPoster />
      <canvas ref={canvas} className="nm2-vanta-strata__canvas" hidden />
      <ol className="nm2-vanta-strata__labels">
        {layers.map((layer, index) => (
          <li
            key={layer}
            className={`nm2-vanta-strata__label nm2-vanta-strata__label--l${index + 1}`}
          >
            <span className="nm2-vanta-strata__index">{`L${index + 1}`}</span>
            {layer}
          </li>
        ))}
        <li className="nm2-vanta-strata__label nm2-vanta-strata__label--core">
          <span className="nm2-vanta-strata__index">{core}</span>
        </li>
      </ol>
    </div>
  );
}
