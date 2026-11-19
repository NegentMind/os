"use client";

import { useEffect, useRef } from "react";
import { useSceneActivity } from "@/components/nm/v2/field-canvas";

/*
 * HolonField — the "membrane field" map of the nine holons: nine overlapping
 * cells with permeable (dashed) boundaries inside a mother membrane, each
 * exchanging bidirectional signal traffic with the system's nucleus.
 *
 * Surfaces, same contract as FieldCanvas/CoreOrb:
 *  - SSR/no-JS/reduced-motion: the React SVG poster, complete and static,
 *    selection-aware (hue + Janus rings) via data attributes.
 *  - Animated: canvas 2D, ~30fps scheduling target, breathing membranes,
 *    particles crossing the cells' boundaries and the mother membrane,
 *    and the dual Janus ring on the selected holon.
 *
 * Cell seats for the interactive label buttons live in orbital-home.css
 * (`.nm2-holon-explorer__module-seat--N`) — keep them in sync with
 * HOLON_LAYOUT below.
 */

const TAU = Math.PI * 2;
const FRAME_INTERVAL = 1000 / 30;
const CENTER = 0.5;
const MOTHER = { rx: 0.472, ry: 0.462 };

/** Spectrum token names — the base scene stays monochrome; only the
 *  selected holon is tinted with its assigned hue. */
export const HOLON_TONES = [
  "teal",
  "violet",
  "amber",
  "blue",
  "rose",
  "ice",
  "violet",
  "teal",
  "amber",
] as const;

/** Normalized seats (0..1); `r` is a fraction of the frame on each axis —
 *  cells are ellipses in screen space, like the mother membrane. */
export const HOLON_LAYOUT = [
  { x: 0.5, y: 0.185, r: 0.13 },
  { x: 0.715, y: 0.255, r: 0.12 },
  { x: 0.818, y: 0.452, r: 0.14 },
  { x: 0.79, y: 0.672, r: 0.128 },
  { x: 0.618, y: 0.8, r: 0.142 },
  { x: 0.382, y: 0.8, r: 0.128 },
  { x: 0.21, y: 0.672, r: 0.135 },
  { x: 0.182, y: 0.452, r: 0.13 },
  { x: 0.285, y: 0.255, r: 0.118 },
] as const;

type Point = { x: number; y: number };

/** Small triangle on a ring around (cx, cy): tip `depth` units beyond the
 *  ring toward the center (inward) or away (outward); `span` radians of
 *  half-width at the base. Used by both the poster and the canvas loop. */
function janusChevron(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  ringScale: number,
  theta: number,
  outward: boolean,
  depth: number,
  span: number,
): [Point, Point, Point] {
  const at = (angle: number, scale: number): Point => ({
    x: cx + rx * ringScale * scale * Math.cos(angle),
    y: cy + ry * ringScale * scale * Math.sin(angle),
  });
  const tipScale = outward ? 1 + depth : 1 - depth;
  const baseScale = outward ? 1 - depth : 1 + depth;
  return [
    at(theta, tipScale),
    at(theta - span, baseScale),
    at(theta + span, baseScale),
  ];
}

function pointsToPath(points: readonly Point[]): string {
  const [tip, b1, b2] = points;
  return `M${tip.x.toFixed(3)} ${tip.y.toFixed(3)}L${b1.x.toFixed(3)} ${b1.y.toFixed(3)}L${b2.x.toFixed(3)} ${b2.y.toFixed(3)}Z`;
}

const JANUS_OUTER = 1.24;
const JANUS_INNER = 0.55;
const JANUS_ANGLES = [0.4, 0.4 + TAU / 3, 0.4 + (2 * TAU) / 3];

function HolonPoster({
  selected,
  hovered,
}: {
  selected: number;
  hovered: number | null;
}) {
  const active = HOLON_LAYOUT[selected] ?? HOLON_LAYOUT[0];
  const outerR = { x: active.r * 100 * JANUS_OUTER, y: active.r * 100 * JANUS_OUTER };
  const innerR = { x: active.r * 100 * JANUS_INNER, y: active.r * 100 * JANUS_INNER };
  return (
    <svg
      className="nm2-holon-field__poster"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse
        className="nm2-holon-field__mother"
        cx="50"
        cy="50"
        rx={MOTHER.rx * 100}
        ry={MOTHER.ry * 100}
      />
      {HOLON_LAYOUT.map((cell, index) => (
        <line
          key={`channel-${index}`}
          className="nm2-holon-field__channel"
          data-draw=""
          x1="50"
          y1="50"
          x2={(cell.x * 100).toFixed(3)}
          y2={(cell.y * 100).toFixed(3)}
        />
      ))}
      {HOLON_LAYOUT.map((cell, index) => (
        <ellipse
          key={`cell-${index}`}
          className="nm2-holon-field__cell"
          cx={(cell.x * 100).toFixed(3)}
          cy={(cell.y * 100).toFixed(3)}
          rx={(cell.r * 100).toFixed(3)}
          ry={(cell.r * 100).toFixed(3)}
          data-tone={HOLON_TONES[index]}
          data-active={selected === index || undefined}
          data-hover={hovered === index || undefined}
        />
      ))}
      <g data-tone={HOLON_TONES[selected]} key={`janus-${selected}`}>
        <ellipse
          className="nm2-holon-field__janus nm2-holon-field__janus--outer"
          cx={active.x * 100}
          cy={active.y * 100}
          rx={outerR.x}
          ry={outerR.y}
        />
        <ellipse
          className="nm2-holon-field__janus nm2-holon-field__janus--inner"
          cx={active.x * 100}
          cy={active.y * 100}
          rx={innerR.x}
          ry={innerR.y}
        />
        {JANUS_ANGLES.map((theta) => (
          <path
            key={`out-${theta}`}
            className="nm2-holon-field__chevron"
            d={pointsToPath(
              janusChevron(
                active.x * 100,
                active.y * 100,
                active.r * 100,
                active.r * 100,
                JANUS_OUTER,
                theta,
                true,
                0.07,
                0.09,
              ),
            )}
          />
        ))}
        {JANUS_ANGLES.map((theta) => (
          <path
            key={`in-${theta}`}
            className="nm2-holon-field__chevron"
            d={pointsToPath(
              janusChevron(
                active.x * 100,
                active.y * 100,
                active.r * 100,
                active.r * 100,
                JANUS_INNER,
                theta + 0.55,
                false,
                0.12,
                0.14,
              ),
            )}
          />
        ))}
      </g>
      <circle className="nm2-holon-field__nucleus" cx="50" cy="50" r="1.6" />
      <ellipse
        className="nm2-holon-field__nucleus-ring"
        cx="50"
        cy="50"
        rx="4.4"
        ry="4.4"
      />
    </svg>
  );
}

export function HolonField({
  selected,
  hovered,
}: {
  selected: number;
  hovered: number | null;
}) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const time = useRef(0);
  const selectedRef = useRef(selected);
  const hoveredRef = useRef(hovered);
  selectedRef.current = selected;
  hoveredRef.current = hovered;
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
    let ink = "";
    let line = "";
    let hues: string[] = [];
    let resizeObserver: ResizeObserver | null = null;
    const context = surface.getContext("2d", { alpha: true });
    if (!context) return;

    /** Perturbed closed loop: cells and the mother membrane are organic
     *  blobs, not perfect ellipses. */
    const traceBlob = (
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      wobble: number,
      phase: number,
    ) => {
      context.beginPath();
      const steps = 30;
      for (let k = 0; k <= steps; k += 1) {
        const theta = (k / steps) * TAU;
        const m =
          1 +
          wobble * Math.sin(3 * theta + phase) +
          wobble * 0.6 * Math.sin(5 * theta - phase * 1.7);
        const px = cx + rx * m * Math.cos(theta);
        const py = cy + ry * m * Math.sin(theta);
        if (k === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
    };

    const draw = () => {
      if (disposed || width <= 0 || height <= 0) return;
      const t = time.current;
      const cx = width * CENTER;
      const cy = height * CENTER;
      const sel = selectedRef.current;
      const hov = hoveredRef.current;
      context.clearRect(0, 0, width, height);

      // Channels first: membrane strokes cross above the spokes.
      context.setLineDash([]);
      context.lineWidth = 0.65;
      for (let index = 0; index < HOLON_LAYOUT.length; index += 1) {
        const cell = HOLON_LAYOUT[index];
        context.globalAlpha = sel === index ? 0.55 : 0.32;
        context.strokeStyle = sel === index ? hues[index] ?? ink : line;
        context.beginPath();
        context.moveTo(cx, cy);
        context.lineTo(cell.x * width, cell.y * height);
        context.stroke();
      }

      // Mother membrane: permeable dashed blob, slow breath.
      const breathe = 1 + 0.009 * Math.sin(t * 0.45);
      context.setLineDash([6, 4.5]);
      context.lineWidth = 1.5;
      context.strokeStyle = ink;
      context.globalAlpha = 0.42;
      traceBlob(
        cx,
        cy,
        MOTHER.rx * width * breathe,
        MOTHER.ry * height * breathe,
        0.016,
        t * 0.22,
      );
      context.stroke();

      // Ambient exchange: sparse particles crossing the mother membrane —
      // the whole is itself a holon, open to a larger context.
      context.setLineDash([]);
      context.fillStyle = ink;
      for (let k = 0; k < 8; k += 1) {
        const angle = k * (TAU / 8) + 0.45;
        const outward = k % 2 === 0;
        const u = (t * 0.055 + k * 0.37) % 1;
        const dNorm = 0.3 + (outward ? u : 1 - u) * 0.3;
        const px = cx + Math.cos(angle) * dNorm * width;
        const py = cy + Math.sin(angle) * dNorm * height;
        const edge =
          (MOTHER.rx * MOTHER.ry) /
          Math.hypot(
            MOTHER.ry * Math.cos(angle),
            MOTHER.rx * Math.sin(angle),
          );
        const proximity = 1 - Math.abs(dNorm - edge) / 0.075;
        if (proximity <= 0) continue;
        context.globalAlpha = proximity * 0.5;
        context.beginPath();
        context.arc(px, py, 1.4, 0, TAU);
        context.fill();
      }

      // Cells: permeable dashed membranes, each breathing on its own phase.
      context.lineWidth = 1.5;
      for (let index = 0; index < HOLON_LAYOUT.length; index += 1) {
        const cell = HOLON_LAYOUT[index];
        const breath = 1 + 0.035 * Math.sin(t * 0.7 + index * 2.3);
        const rx = cell.r * width * breath;
        const ry = cell.r * height * breath;
        const isSel = sel === index;
        const isHov = hov === index;
        traceBlob(
          cell.x * width,
          cell.y * height,
          rx,
          ry,
          0.028,
          index * 1.9 + t * 0.5,
        );
        context.setLineDash([4, 3]);
        context.strokeStyle = isSel ? hues[index] ?? ink : ink;
        context.fillStyle = context.strokeStyle;
        context.globalAlpha = isSel ? 0.07 : 0.035;
        context.fill();
        context.globalAlpha = isSel ? 0.95 : isHov ? 0.8 : 0.55;
        context.stroke();
      }

      // Janus rings on the selected holon: the outer ring's chevrons point
      // away (the part integrates into the whole), the inner ring's point
      // inward (the holon gathers and asserts its own autonomy). Counter-
      // rotating dashes make the two vectors readable at a glance.
      if (sel >= 0 && sel < HOLON_LAYOUT.length) {
        const cell = HOLON_LAYOUT[sel];
        const hue = hues[sel] ?? ink;
        const scx = cell.x * width;
        const scy = cell.y * height;
        const srx = cell.r * width;
        const sry = cell.r * height;
        context.strokeStyle = hue;
        context.fillStyle = hue;
        context.lineWidth = 1.5;

        context.globalAlpha = 0.85;
        context.setLineDash([2.5, 5]);
        context.lineDashOffset = -t * 14;
        context.beginPath();
        context.ellipse(scx, scy, srx * JANUS_OUTER, sry * JANUS_OUTER, 0, 0, TAU);
        context.stroke();
        context.setLineDash([3, 4]);
        context.lineDashOffset = t * 14;
        context.beginPath();
        context.ellipse(scx, scy, srx * JANUS_INNER, sry * JANUS_INNER, 0, 0, TAU);
        context.stroke();
        context.setLineDash([]);
        context.lineDashOffset = 0;

        context.globalAlpha = 0.9;
        for (const theta of JANUS_ANGLES) {
          const [tip, b1, b2] = janusChevron(
            scx,
            scy,
            srx,
            sry,
            JANUS_OUTER,
            theta + t * 0.35,
            true,
            0.07,
            0.09,
          );
          context.beginPath();
          context.moveTo(tip.x, tip.y);
          context.lineTo(b1.x, b1.y);
          context.lineTo(b2.x, b2.y);
          context.closePath();
          context.fill();
        }
        for (const theta of JANUS_ANGLES) {
          const [tip, b1, b2] = janusChevron(
            scx,
            scy,
            srx,
            sry,
            JANUS_INNER,
            theta + 0.55 - t * 0.5,
            false,
            0.12,
            0.14,
          );
          context.beginPath();
          context.moveTo(tip.x, tip.y);
          context.lineTo(b1.x, b1.y);
          context.lineTo(b2.x, b2.y);
          context.closePath();
          context.fill();
        }
      }

      // Signal traffic: two lanes per channel. Inbound (nucleus -> cell)
      // feeds the holon's autonomy; outbound (cell -> nucleus) carries its
      // integration into the whole. Particles cross the membrane dashes.
      context.setLineDash([]);
      for (let index = 0; index < HOLON_LAYOUT.length; index += 1) {
        const cell = HOLON_LAYOUT[index];
        const ccx = cell.x * width;
        const ccy = cell.y * height;
        const isSel = sel === index;
        const boost = isSel ? 0.85 : hov === index ? 0.62 : 0.42;
        for (let lane = -1; lane <= 1; lane += 2) {
          for (let k = 0; k < 3; k += 1) {
            const u = (t * (0.085 + k * 0.014) + k * 0.34 + index * 0.618) % 1;
            const ux = 0.06 + u * 0.88;
            // lane > 0: nucleus -> cell; lane < 0: cell -> nucleus.
            const sx = lane > 0 ? cx : ccx;
            const sy = lane > 0 ? cy : ccy;
            const ex = lane > 0 ? ccx : cx;
            const ey = lane > 0 ? ccy : cy;
            const px = sx + (ex - sx) * ux;
            const py = sy + (ey - sy) * ux;
            // Small perpendicular offset keeps the two lanes legible.
            const dx = ex - sx;
            const dy = ey - sy;
            const len = Math.hypot(dx, dy) || 1;
            const ox = (-dy / len) * lane * 2.2;
            const oy = (dx / len) * lane * 2.2;
            context.globalAlpha = Math.sin(ux * Math.PI) * boost;
            context.fillStyle = isSel ? hues[index] ?? ink : ink;
            context.beginPath();
            context.arc(px + ox, py + oy, isSel ? 1.9 : 1.5, 0, TAU);
            context.fill();
          }
        }
      }

      // Nucleus: the whole the nine holons belong to. Sized on the frame
      // so the canvas matches the poster's nucleus proportions.
      context.globalAlpha = 0.85;
      context.fillStyle = ink;
      context.beginPath();
      context.arc(cx, cy, width * 0.008, 0, TAU);
      context.fill();
      context.setLineDash([3, 3]);
      context.lineWidth = 1.5;
      context.globalAlpha = 0.5;
      context.beginPath();
      context.arc(cx, cy, width * 0.022, 0, TAU);
      context.stroke();
      context.setLineDash([]);

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
      const styles = getComputedStyle(element);
      ink = styles.color;
      line = styles.getPropertyValue("--nm2-line").trim() || ink;
      hues = HOLON_TONES.map(
        (tone) =>
          styles.getPropertyValue(`--nm2-spectrum-${tone}`).trim() || ink,
      );
      draw();
    };

    resize();
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(element);
    }
    window.addEventListener("resize", resize, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      delete element.dataset.rendered;
      surface.hidden = true;
      surface.width = 0;
      surface.height = 0;
    };
  }, [active]);

  return (
    <div ref={root} className="nm2-holon-field" aria-hidden="true">
      <HolonPoster selected={selected} hovered={hovered} />
      <canvas ref={canvas} className="nm2-holon-field__canvas" hidden />
    </div>
  );
}
