"use client";

import { useEffect, useRef } from "react";
import { useSceneActivity } from "@/components/nm/v2/field-canvas";
import { HERO_ART_MONO, HERO_SPECTRUM_TEXT } from "@/components/nm/v2/hero-preset";

/*
 * Drift canvas — slow monochrome currents for the system story stage:
 * carbon→silver ribbons that undulate like fluid waves, sparse particles
 * riding them, and one spectral crest point that either drifts with time
 * or travels with the section's scroll progress when the choreography sets
 * `--nm2-system-progress` on the nearest `progressHost` ancestor.
 *
 * Same lifecycle contract as FieldCanvas: the CSS poster stays the
 * SSR/no-JS/reduced surface, the canvas paints only while animated motion
 * is allowed and the plate is visible, and `data-rendered` swaps layers.
 */

const FRAME_INTERVAL = 1000 / 30;
const TAU = Math.PI * 2;
const PARTICLE_COUNT = 64;
/** Band the spectral point rides — a mid-depth current. */
const CREST_BAND = 2;
const COLOR_DWELL = 1.6;
const COLOR_FADE = 0.45;

type Band = {
  /** Vertical anchor as a fraction of height. */
  base: number;
  /** Two sine components; amplitudes are fractions of height, frequencies
   *  count cycles across the width, speeds are radians-ish per second. */
  amp1: number;
  amp2: number;
  freq1: number;
  freq2: number;
  speed1: number;
  speed2: number;
  phase: number;
  /** Ribbon thickness as a fraction of height. */
  thick: number;
  /** Crest tone from the approved carbon→silver ramp. */
  tone: string;
  /** Peak alpha of the ribbon crest. */
  alpha: number;
};

type DriftParticle = {
  band: number;
  u0: number;
  speed: number;
  size: number;
  alpha: number;
  offset: number;
};

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}

function mixRgb(a: readonly number[], b: readonly number[], t: number): string {
  const c = (i: number) => Math.round(a[i] + (b[i] - a[i]) * t);
  return `rgb(${c(0)} ${c(1)} ${c(2)})`;
}

// The ramp is the approved monochrome hero variant, silver only — the two
// carbon bookends are the base, never a crest.
const MONO_COLORS: readonly string[] = HERO_ART_MONO.params.colors ?? [
  "#0a0c0f",
  "#1b2129",
  "#2e3641",
  "#4a5462",
  "#68737f",
  "#262c35",
  "#0a0c0f",
];
const SPECTRUM: readonly (readonly number[])[] =
  HERO_SPECTRUM_TEXT.map(hexToRgb);
const PARTICLE_INK = "#a7b4c7";

const BANDS: readonly Band[] = [
  {
    base: 0.16, amp1: 0.028, amp2: 0.014, freq1: 0.9, freq2: 2.1,
    speed1: 0.055, speed2: 0.04, phase: 0.3, thick: 0.13,
    tone: MONO_COLORS[2] ?? "#2e3641", alpha: 0.5,
  },
  {
    base: 0.34, amp1: 0.045, amp2: 0.02, freq1: 0.7, freq2: 1.7,
    speed1: 0.045, speed2: 0.032, phase: 1.8, thick: 0.2,
    tone: MONO_COLORS[3] ?? "#4a5462", alpha: 0.42,
  },
  {
    base: 0.52, amp1: 0.055, amp2: 0.024, freq1: 0.8, freq2: 2.6,
    speed1: 0.038, speed2: 0.052, phase: 3.9, thick: 0.24,
    tone: MONO_COLORS[4] ?? "#68737f", alpha: 0.34,
  },
  {
    base: 0.68, amp1: 0.04, amp2: 0.018, freq1: 1.2, freq2: 2.9,
    speed1: 0.06, speed2: 0.03, phase: 5.1, thick: 0.18,
    tone: MONO_COLORS[3] ?? "#4a5462", alpha: 0.4,
  },
  {
    base: 0.84, amp1: 0.03, amp2: 0.012, freq1: 1.4, freq2: 3.4,
    speed1: 0.05, speed2: 0.044, phase: 2.4, thick: 0.12,
    tone: MONO_COLORS[2] ?? "#2e3641", alpha: 0.55,
  },
];

// Deterministic hash — same contract as the transition bands' grain.
function hash(index: number, salt: number): number {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const PARTICLES: readonly DriftParticle[] = Array.from(
  { length: PARTICLE_COUNT },
  (_, index) => ({
    band: Math.floor(hash(index, 1) * BANDS.length),
    u0: hash(index, 2),
    speed: 0.006 + hash(index, 3) * 0.018,
    size: 0.6 + hash(index, 4) * 1.1,
    alpha: 0.14 + hash(index, 5) * 0.3,
    offset: (hash(index, 6) - 0.5) * 26,
  }),
);

function bandY(
  band: Band,
  x: number,
  width: number,
  height: number,
  t: number,
  energy: number,
): number {
  return (
    height * band.base +
    Math.sin((x / width) * band.freq1 * TAU + t * band.speed1 + band.phase) *
      height * band.amp1 * energy +
    Math.sin((x / width) * band.freq2 * TAU - t * band.speed2 + band.phase * 1.7) *
      height * band.amp2 * energy
  );
}

function crestColor(time: number): string {
  const count = SPECTRUM.length;
  if (count === 0) return PARTICLE_INK;
  const index = Math.floor(time / COLOR_DWELL) % count;
  const phase = (time % COLOR_DWELL) / COLOR_DWELL;
  const fade = COLOR_FADE / COLOR_DWELL;
  if (phase > 1 - fade) {
    const t = (phase - (1 - fade)) / fade;
    return mixRgb(SPECTRUM[index], SPECTRUM[(index + 1) % count], t);
  }
  return mixRgb(SPECTRUM[index], SPECTRUM[index], 0);
}

export function DriftCanvas({
  className = "",
  /** Selector resolved via closest() whose inline
   *  `--nm2-system-progress` drives the spectral crest. */
  progressHost = ".nm2-system-story",
}: {
  className?: string;
  progressHost?: string;
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
    const progressSource =
      element.closest<HTMLElement>(progressHost) ?? element.parentElement ?? element;

    const dispose = () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      surface.removeEventListener("contextlost", onContextLost);
      element.dataset.rendered = "false";
      surface.hidden = true;
      surface.width = 0;
      surface.height = 0;
    };
    const fail = (error: unknown) => {
      if (disposed) return;
      failed.current = true;
      dispose();
      console.warn(
        "Orbital DriftCanvas: Canvas 2D unavailable; static gradient retained. Check canvas support/context errors before remounting the backdrop.",
        error,
      );
    };
    function onContextLost() {
      fail(new Error("Canvas 2D context lost"));
    }

    let context: CanvasRenderingContext2D | null = null;

    const readProgress = (): number => {
      const raw = progressSource.style.getPropertyValue(
        "--nm2-system-progress",
      );
      const parsed = Number.parseFloat(raw);
      return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : Number.NaN;
    };

    const draw = () => {
      if (!context || disposed || width <= 0 || height <= 0) return;
      try {
        const t = time.current;
        const progress = readProgress();
        const energy = 0.9 + 0.25 * (Number.isFinite(progress) ? progress : 0.5);
        const step = Math.max(8, Math.round(width / 96));
        context.clearRect(0, 0, width, height);

        for (const band of BANDS) {
          let topY = height;
          context.beginPath();
          for (let x = -step; x <= width + step; x += step) {
            const y = bandY(band, x, width, height, t, energy);
            if (y < topY) topY = y;
            if (x === -step) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          for (let x = width + step; x >= -step; x -= step) {
            const lift =
              band.thick *
              height *
              (0.55 +
                0.45 *
                  Math.sin(
                    (x / width) * 3.1 * TAU - t * band.speed2 + band.phase,
                  ));
            context.lineTo(x, bandY(band, x, width, height, t, energy) + lift);
          }
          context.closePath();
          const gradient = context.createLinearGradient(
            0,
            topY,
            0,
            topY + band.thick * height * 1.7,
          );
          gradient.addColorStop(0, rgba(band.tone, band.alpha));
          gradient.addColorStop(1, rgba(band.tone, 0));
          context.fillStyle = gradient;
          context.fill();
        }

        // Sparse particles riding the currents — same ambient silver the
        // field canvases draw with.
        context.fillStyle = PARTICLE_INK;
        for (const particle of PARTICLES) {
          const band = BANDS[particle.band];
          const u = (particle.u0 + t * particle.speed) % 1;
          const x = u * width;
          const y =
            bandY(band, x, width, height, t, energy) + particle.offset;
          const edge = Math.sin(u * Math.PI);
          context.globalAlpha = particle.alpha * edge * edge;
          context.beginPath();
          context.arc(x, y, particle.size, 0, TAU);
          context.fill();
        }
        context.globalAlpha = 1;

        // The one spectral accent: a crest point cycling the hero spectrum,
        // traveling with scroll progress when the story choreography drives
        // it, or with its own slow drift otherwise.
        const band = BANDS[CREST_BAND];
        const u = Number.isFinite(progress) ? progress : (t * 0.035) % 1;
        const cx = u * width;
        const cy = bandY(band, cx, width, height, t, energy);
        const ink = crestColor(t);
        context.fillStyle = ink;
        context.globalAlpha = 0.16;
        context.beginPath();
        context.arc(cx, cy, 9, 0, TAU);
        context.fill();
        context.globalAlpha = 0.9;
        context.beginPath();
        context.arc(cx, cy, 3, 0, TAU);
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
  }, [active, progressHost]);

  return (
    <div
      ref={root}
      className={`nm2-drift ${className}`}
      data-active={active ? "true" : "false"}
      aria-hidden="true"
    >
      <div className="nm2-drift__poster" />
      <canvas ref={canvas} className="nm2-drift__canvas" hidden />
    </div>
  );
}
