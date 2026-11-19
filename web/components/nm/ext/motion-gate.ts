"use client";

/**
 * Shared helpers for the adapted external pieces in `components/nm/ext/`.
 *
 * `extMotionOff()` is the imperative form of the site motion gate: it is true
 * when the OS asks for reduced motion OR the user paused decorative animation
 * from the footer control (MotionProvider mirrors that on
 * `<html data-motion="off">`). Reactive consumers should prefer
 * `useSiteMotion().canAnimate` from `@/components/nm/v2/motion-provider`;
 * this predicate exists for rAF loops and event handlers that never re-render.
 *
 * `resolveCssColor()` lets canvas/WebGL probes consume `--nm2-*` tokens:
 * `ctx.fillStyle = "var(--nm2-muted)"` is invalid outside the DOM, so the
 * `var()` reference is resolved against the document root first.
 */

export function extMotionOff(): boolean {
  if (typeof window === "undefined") return true;
  return (
    (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false) ||
    document.documentElement.dataset.motion === "off"
  );
}

const VAR_PATTERN = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]*))?\)/g;

export function resolveCssColor(value: string): string {
  if (typeof window === "undefined" || !value.includes("var(")) return value;
  const root = getComputedStyle(document.documentElement);
  return value.replace(VAR_PATTERN, (match, name: string, fallback?: string) => {
    const resolved = root.getPropertyValue(name).trim();
    return resolved || fallback?.trim() || match;
  });
}
