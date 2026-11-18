"use client";

import { useEffect, useRef } from "react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import { useTransitionOverride } from "@/components/nm/v2/section-transition/transition-lab";
import {
  DEFAULT_PARAMS,
  VARIANTS,
  renderVariant,
  type TransitionParams,
  type TransitionVariant,
} from "@/components/nm/v2/section-transition/variants";

type Tone = "dark" | "light";
type Rgb = [number, number, number];

const FRAME_INTERVAL = 1000 / 30;
const STATIC_TIME = 2.4;
const POINTER_LERP = 0.12;
const POINTER_REACH = 120;
const SMOOTH_RATE = 2.8;
const DISCRETE_RATE = 1.76;

function parseColor(value: string, fallback: Rgb): Rgb {
  const text = value.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (hex) {
    const digits = hex[1].length === 3
      ? hex[1].split("").map((c) => c + c).join("")
      : hex[1];
    const n = Number.parseInt(digits, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(text);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return fallback;
}

type Effective = {
  variant: TransitionVariant;
  params: TransitionParams;
  height: number | null;
  flip?: boolean;
};

// Converts the `to` color contribution into transparency so the band's own
// background (set to the destination tone) shows through — the seam can never
// drift to a different tint. t is recovered by projecting each pixel onto the
// from→to axis; the solid rgb is un-composited so `rgb′·(1-t) + to·t = c`.
function dissolveTo(data: Uint8ClampedArray, from: Rgb, to: Rgb): void {
  const dr = to[0] - from[0];
  const dg = to[1] - from[1];
  const db = to[2] - from[2];
  const len2 = dr * dr + dg * dg + db * db || 1;
  for (let i = 0; i < data.length; i += 4) {
    const t = Math.min(
      1,
      Math.max(
        0,
        ((data[i] - from[0]) * dr +
          (data[i + 1] - from[1]) * dg +
          (data[i + 2] - from[2]) * db) /
          len2,
      ),
    );
    const keep = 1 - t;
    if (keep <= 0.001) {
      data[i + 3] = 0;
      continue;
    }
    data[i] = Math.min(255, Math.max(0, Math.round((data[i] - to[0] * t) / keep)));
    data[i + 1] = Math.min(
      255,
      Math.max(0, Math.round((data[i + 1] - to[1] * t) / keep)),
    );
    data[i + 2] = Math.min(
      255,
      Math.max(0, Math.round((data[i + 2] - to[2] * t) / keep)),
    );
    data[i + 3] = Math.round(keep * 255);
  }
}

export function SectionTransition({
  id,
  variant,
  height = null,
  from = "dark",
  to = "light",
}: {
  id: string;
  variant: TransitionVariant;
  /** Baseline band height in px; CSS clamps it when unset. The lab can
   *  still override it per band. */
  height?: number | null;
  from?: Tone;
  to?: Tone;
}) {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const paintRef = useRef<(() => void) | null>(null);
  const { canAnimate } = useSiteMotion();
  const override = useTransitionOverride(id, variant, height);
  const effective: Effective = override ?? {
    variant,
    params: DEFAULT_PARAMS[variant],
    height,
  };
  const config = useRef(effective);
  config.current = effective;
  // Lab-only inversion: swap the declared tones so the band reads
  // destination → origin without touching the section props.
  const fromTone: Tone = effective.flip
    ? (from === "dark" ? "light" : "dark")
    : from;
  const toTone: Tone = effective.flip
    ? (to === "dark" ? "light" : "dark")
    : to;

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    if (effective.height) {
      element.style.setProperty("--nm2-transition-h", `${effective.height}px`);
    } else {
      element.style.removeProperty("--nm2-transition-h");
    }
  }, [effective.height]);

  useEffect(() => {
    paintRef.current?.();
  }, [effective.variant, effective.params]);

  useEffect(() => {
    const element = container.current;
    const surface = canvas.current;
    if (!element || !surface) return;
    const context = surface.getContext("2d");
    const buffer = document.createElement("canvas");
    const bufferContext = buffer.getContext("2d");
    if (!context || !bufferContext) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let image: ImageData | null = null;
    let time = STATIC_TIME;
    let visible = false;
    let raf = 0;
    let lastPaint = 0;
    let pointer: number | null = null;
    let pointerTarget: number | null = null;
    let listening = false;
    let colors: { dark: Rgb; light: Rgb } | null = null;

    const readColors = () => {
      const style = getComputedStyle(element);
      colors = {
        dark: parseColor(style.getPropertyValue("--nm2-bg"), [0, 0, 0]),
        light: parseColor(style.getPropertyValue("--nm2-paper-bg"), [255, 255, 255]),
      };
    };

    const resize = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;
      const compact = rect.width < 768;
      const smooth =
        VARIANTS.find((v) => v.id === config.current.variant)?.smooth ?? false;
      const renderWidth = Math.round(
        compact
          ? Math.min(smooth ? 480 : 320, Math.max(160, rect.width / 1.6))
          : Math.min(smooth ? 960 : 640, Math.max(240, rect.width / 1.5)),
      );
      const renderHeight = Math.max(
        16,
        Math.min(
          smooth ? 360 : 260,
          Math.round((renderWidth * rect.height) / rect.width),
        ),
      );
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      surface.width = Math.max(1, Math.round(rect.width * dpr));
      surface.height = Math.max(1, Math.round(rect.height * dpr));
      if (buffer.width !== renderWidth || buffer.height !== renderHeight) {
        buffer.width = renderWidth;
        buffer.height = renderHeight;
        image = null;
      }
      if (!image) image = bufferContext.createImageData(renderWidth, renderHeight);
      return true;
    };

    const paint = () => {
      if (!resize() || !image) return;
      if (!colors) readColors();
      if (!colors) return;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = Math.min(
        1,
        Math.max(0, (viewport - rect.top) / (viewport + rect.height)),
      );
      const current = config.current;
      const swatch = { dark: colors.dark, light: colors.light };
      renderVariant(current.variant, {
        data: image.data,
        width: image.width,
        height: image.height,
        time,
        from: swatch[fromTone],
        to: swatch[toTone],
        params: current.params,
        progress,
        pointerX: pointer,
      });
      dissolveTo(image.data, swatch[fromTone], swatch[toTone]);
      bufferContext.putImageData(image, 0, 0);
      const smooth = VARIANTS.find((v) => v.id === current.variant)?.smooth ?? false;
      context.imageSmoothingEnabled = smooth;
      context.drawImage(buffer, 0, 0, surface.width, surface.height);
      // Cheap every paint; keeps the band's base color correct when the lab
      // flips from/to on a live band.
      const [r, g, b] = swatch[toTone];
      element.style.background = `rgb(${r} ${g} ${b})`;
      element.dataset.ready = "true";
    };
    paintRef.current = paint;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      const inside = event.clientY >= rect.top - POINTER_REACH
        && event.clientY <= rect.bottom + POINTER_REACH;
      pointerTarget = inside && rect.width > 0
        ? Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
        : null;
      if (pointerTarget === null) pointer = null;
    };

    const tick = (now: number) => {
      raf = 0;
      if (now - lastPaint >= FRAME_INTERVAL) {
        const step = Math.min((now - lastPaint) / 1000, 0.1);
        const current = config.current;
        const smooth = VARIANTS.find((v) => v.id === current.variant)?.smooth ?? false;
        time += step * (smooth ? SMOOTH_RATE : DISCRETE_RATE) * current.params.speed;
        lastPaint = now;
        if (pointerTarget !== null) {
          pointer = pointer === null
            ? pointerTarget
            : pointer + (pointerTarget - pointer) * POINTER_LERP;
        }
        paint();
      }
      raf = requestAnimationFrame(tick);
    };

    const sync = () => {
      const run = canAnimate && visible && !document.hidden;
      if (run && !raf) {
        lastPaint = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      const wantPointer = run && fine.matches;
      if (wantPointer !== listening) {
        listening = wantPointer;
        if (wantPointer) {
          window.addEventListener("pointermove", onPointerMove, { passive: true });
        } else {
          window.removeEventListener("pointermove", onPointerMove);
          pointer = null;
          pointerTarget = null;
        }
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      image = null;
      paint();
    });
    resizeObserver.observe(element);
    paint();

    let intersection: IntersectionObserver | undefined;
    if (canAnimate) {
      intersection = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? false;
        sync();
      });
      intersection.observe(element);
      document.addEventListener("visibilitychange", sync);
      fine.addEventListener("change", sync);
    }

    return () => {
      paintRef.current = null;
      resizeObserver.disconnect();
      intersection?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      fine.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onPointerMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [canAnimate, fromTone, toTone]);

  return (
    <div
      ref={container}
      id={`transition-${id}`}
      className="nm2-transition"
      data-from={fromTone}
      data-to={toTone}
      aria-hidden="true"
    >
      <canvas ref={canvas} className="nm2-transition__canvas" />
    </div>
  );
}
