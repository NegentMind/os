"use client";

import { useEffect, useState, type RefObject } from "react";

/*
 * Luminance probe for fixed chrome, ported from webTemplates/noveq
 * (app/src/ssr/runtime.ts → setupScrollNav / sampleLum / mediaLuminance).
 *
 * Samples whatever paints just under a fixed/sticky bar: a single point at
 * the bar's horizontal centre, 8px above its bottom edge, resolved through
 * document.elementsFromPoint + the ancestor background-color chain. If the
 * sampled element is an <img>/<video> the template averages it on an 8×8
 * canvas instead of trusting the element's (usually transparent) background.
 *
 * Classification is perceptual luminance (0.299R + 0.587G + 0.114B) against
 * the template's 0.55 threshold: returns "dark" | "light" describing the
 * surface UNDER the bar — "dark" ⇒ use light ink, "light" ⇒ use dark ink.
 * When nothing opaque resolves (pre-layout), the template falls back to a
 * scrollY > 60 heuristic; we keep it verbatim.
 */

export type SurfaceTone = "dark" | "light";

const LIGHT_THRESHOLD = 0.55;
const MIN_ALPHA = 0.05;
const FALLBACK_SCROLL_Y = 60;

function colorLuminance(cssColor: string): number | null {
  const m = cssColor.match(/[\d.]+/g);
  if (!m || m.length < 3) return null;
  const alpha = m.length >= 4 ? Number(m[3]) : 1;
  if (alpha <= MIN_ALPHA) return null;
  return (
    (0.299 * Number(m[0]) + 0.587 * Number(m[1]) + 0.114 * Number(m[2])) / 255
  );
}

/* Average luminance of an image/video, sampled on a tiny canvas.
 * Cached per element — a cross-origin or unpainted source yields null. */
const mediaCache = new WeakMap<Element, number | null>();
function mediaLuminance(el: HTMLImageElement | HTMLVideoElement): number | null {
  if (mediaCache.has(el)) return mediaCache.get(el) ?? null;
  try {
    const c = document.createElement("canvas");
    c.width = 8;
    c.height = 8;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(el, 0, 0, 8, 8);
    const d = ctx.getImageData(0, 0, 8, 8).data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3] / 255;
      sum += (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) * a;
    }
    const v = sum / 64 / 255;
    mediaCache.set(el, v);
    return v;
  } catch {
    mediaCache.set(el, null);
    return null;
  }
}

/* Luminance (0–1) of whatever is painted under the host bar, or null when
 * the element stack exposes no opaque surface. Skips the bar's own subtree
 * so flyouts and pills inside the nav never poison the vote. */
function probeUnder(host: HTMLElement): number | null {
  const r = host.getBoundingClientRect();
  const x = Math.min(window.innerWidth - 1, r.left + r.width * 0.5);
  const y = Math.min(window.innerHeight - 1, Math.max(0, r.bottom - 8));
  for (const el of document.elementsFromPoint(x, y)) {
    if (host.contains(el)) continue;
    let n: Element | null = el;
    while (n && n !== document.documentElement) {
      if (n instanceof HTMLImageElement || n instanceof HTMLVideoElement) {
        const l = mediaLuminance(n);
        if (l !== null) return l;
      }
      const lum = colorLuminance(getComputedStyle(n).backgroundColor);
      if (lum !== null) return lum;
      n = n.parentElement;
    }
    return null;
  }
  return null;
}

export function useLuminance(
  ref: RefObject<HTMLElement | null>,
  fallback: SurfaceTone = "dark",
): SurfaceTone {
  const [tone, setTone] = useState<SurfaceTone>(fallback);

  useEffect(() => {
    let frame = 0;

    const sample = () => {
      frame = 0;
      const host = ref.current;
      if (!host) return;
      const lum = probeUnder(host);
      const light =
        lum === null ? window.scrollY > FALLBACK_SCROLL_Y : lum > LIGHT_THRESHOLD;
      const next: SurfaceTone = light ? "light" : "dark";
      setTone((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(sample);
    };

    sample();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, fallback]);

  return tone;
}
