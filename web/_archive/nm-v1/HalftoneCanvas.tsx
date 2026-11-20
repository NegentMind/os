"use client";

import { useEffect, useRef } from "react";
import type { HalftoneKind } from "@/lib/marketing-types";

/*
 * Halftone/line canvas engine ported from webTemplates/nice-squash-242352
 * (FeatureCanvas.tsx): six small animated instruments drawn with 2D
 * canvas — chip scan, halftone sphere, flow graph, bars, grid wave,
 * orbit ring. Retokenized: ink→Bone, accent→Pulse, dim→Fog.
 *
 * `HalftoneKind` lives in `lib/marketing-types` (single source — the V1
 * i18n dict types `kind` from there); re-exported so legacy consumers
 * keep this import site.
 */
export type { HalftoneKind };

const INK = "#EDEAE3";
const ACC = "#8B7CFF";
const DIM = "#98A1B3";
const NODE = "#0E131B";

export function HalftoneCanvas({ kind }: { kind: HalftoneKind }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d")!;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let raf = 0;
    let t = 0;
    let vis = true;
    let hover = 0;
    let hoverT = 0;

    const fit = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      const r = cvs.getBoundingClientRect();
      cvs.width = Math.max(1, r.width * dpr);
      cvs.height = Math.max(1, r.height * dpr);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cvs);
    const io = new IntersectionObserver(
      (e) => {
        vis = e[0]?.isIntersecting ?? true;
      },
      { rootMargin: "60px" },
    );
    io.observe(cvs);
    const enter = () => {
      hoverT = 1;
    };
    const leave = () => {
      hoverT = 0;
    };
    cvs.parentElement?.addEventListener("pointerenter", enter);
    cvs.parentElement?.addEventListener("pointerleave", leave);

    const dots: [number, number, number][] = [];
    if (kind === "memory" || kind === "security") {
      const n = 900;
      const ga = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const rad = Math.sqrt(Math.max(0, 1 - y * y));
        const th = ga * i;
        dots.push([Math.cos(th) * rad, y, Math.sin(th) * rad]);
      }
    }
    const chipDots: [number, number][] = [];
    if (kind === "runtime") {
      for (let i = 0; i < 60; i++) {
        const a = i / 60;
        chipDots.push(
          [-0.8 + a * 1.6, -0.8],
          [0.8, -0.8 + a * 1.6],
          [0.8 - a * 1.6, 0.8],
          [-0.8, 0.8 - a * 1.6],
        );
      }
      for (let i = 0; i < 40; i++) {
        const a = i / 40;
        chipDots.push(
          [-0.45 + a * 0.9, -0.45],
          [0.45, -0.45 + a * 0.9],
          [0.45 - a * 0.9, 0.45],
          [-0.45, 0.45 - a * 0.9],
        );
      }
      for (let i = 0; i < 8; i++) {
        const p = -0.7 + (i / 7) * 1.4;
        chipDots.push([p, -1.0], [p, 1.0], [-1.0, p], [1.0, p]);
      }
    }
    const graph = {
      nodes: [
        [0.1, 0.5],
        [0.32, 0.5],
        [0.55, 0.2],
        [0.55, 0.5],
        [0.55, 0.8],
        [0.78, 0.5],
        [0.92, 0.5],
      ],
      edges: [
        [0, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 5],
        [3, 5],
        [4, 5],
        [5, 6],
      ],
    };
    const cols: number[] = Array.from(
      { length: 48 },
      (_, i) => 0.3 + (0.5 * Math.abs(Math.sin(i * 0.7) + Math.sin(i * 0.23))) / 2,
    );
    const cells: number[] = Array.from({ length: 84 }, () => Math.random());

    const draw = () => {
      t += reduced ? 0 : 0.016;
      hover += (hoverT - hover) * 0.08;
      const w = cvs.width,
        h = cvs.height;
      if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2,
        cy = h / 2;

      if (kind === "runtime") {
        const s = Math.min(w, h) * 0.32;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(hover * 0.12 * Math.sin(t * 0.5));
        ctx.fillStyle = INK;
        for (const [x, y] of chipDots) {
          ctx.globalAlpha = 0.8;
          ctx.fillRect(x * s, y * s, 1.6, 1.6);
        }
        ctx.globalAlpha = 1;
        const sy = -s + ((t * (0.5 + hover * 1.6)) % 2) * s;
        ctx.fillStyle = ACC;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(-s, sy, s * 2, 1.5);
        ctx.restore();
      }

      if (kind === "memory") {
        const s = Math.min(w, h) * 0.34;
        const ry = t * 0.4;
        const wave = ((t * 1.6) % 2) - 1;
        for (const [x, y, z] of dots) {
          const x1 = x * Math.cos(ry) - z * Math.sin(ry);
          const z1 = x * Math.sin(ry) + z * Math.cos(ry);
          const near = Math.abs(y - wave);
          const boost = Math.max(0, 1 - near * 6) * (0.4 + hover);
          const p = 1 / (2 - z1);
          ctx.globalAlpha = Math.min(1, 0.3 + p * 0.45 + boost);
          ctx.fillStyle = boost > 0.35 ? ACC : INK;
          ctx.fillRect(
            cx + x1 * s * p,
            cy + y * s * p,
            1.5 + boost * 1.5,
            1.5 + boost * 1.5,
          );
        }
        ctx.globalAlpha = 1;
      }

      if (kind === "orchestration") {
        const sx = w * 1,
          sy = h * 1;
        ctx.strokeStyle = DIM;
        ctx.lineWidth = 1;
        for (const [a, b] of graph.edges) {
          ctx.beginPath();
          ctx.moveTo(graph.nodes[a][0] * sx, graph.nodes[a][1] * sy);
          ctx.lineTo(graph.nodes[b][0] * sx, graph.nodes[b][1] * sy);
          ctx.stroke();
        }
        const k = Math.floor(t * 2) % graph.edges.length;
        graph.edges.forEach((e, i) => {
          const f = (t * 0.9 + i * 0.17) % 1;
          if (i > k + 3) return;
          const x =
            graph.nodes[e[0]][0] +
            (graph.nodes[e[1]][0] - graph.nodes[e[0]][0]) * f;
          const y =
            graph.nodes[e[0]][1] +
            (graph.nodes[e[1]][1] - graph.nodes[e[0]][1]) * f;
          ctx.fillStyle = ACC;
          ctx.fillRect(x * sx - 1.5, y * sy - 1.5, 3, 3);
        });
        for (const [x, y] of graph.nodes) {
          ctx.fillStyle = NODE;
          ctx.strokeStyle = INK;
          ctx.beginPath();
          ctx.rect(x * sx - 5, y * sy - 5, 10, 10);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = INK;
          ctx.fillRect(x * sx - 1.5, y * sy - 1.5, 3, 3);
        }
      }

      if (kind === "observability") {
        const n = cols.length;
        const bw = w / n;
        const sloY = h * 0.4;
        for (let i = 0; i < n; i++) {
          const v = cols[i] * (0.75 + 0.25 * Math.sin(t * 1.4 + i * 0.9));
          const bh = v * h * 0.8;
          ctx.fillStyle = INK;
          for (let yy = h - bh; yy < h; yy += 4) {
            const edge = 1 - (yy - (h - bh)) / Math.max(1, bh);
            ctx.globalAlpha = 0.15 + edge * 0.6;
            ctx.fillRect(i * bw + 1, yy, bw - 2, 2);
          }
        }
        ctx.globalAlpha = 1;
        ctx.strokeStyle = ACC;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, sloY);
        ctx.lineTo(w, sloY);
        ctx.stroke();
        ctx.setLineDash([]);
        const px = ((t * 0.15) % 1) * w;
        ctx.globalAlpha = 0.5 + hover * 0.5;
        ctx.fillStyle = ACC;
        ctx.fillRect(px, 0, 1, h);
        ctx.globalAlpha = 1;
      }

      if (kind === "evaluations") {
        const gc = 12,
          gr = 7;
        const cw = w / gc,
          chh = h / gr;
        const wave = (t * (0.6 + hover * 1.2)) % 2;
        for (let i = 0; i < gc * gr; i++) {
          const gx = i % gc,
            gy = Math.floor(i / gc);
          const d = Math.hypot(gx / gc - 0.5, gy / gr - 0.5) * 2;
          const on = d < wave || cells[i] > 0.93;
          ctx.fillStyle = on ? INK : DIM;
          ctx.globalAlpha = on ? 0.95 : 0.85;
          ctx.fillRect(gx * cw + 1.5, gy * chh + 1.5, cw - 3, chh - 3);
        }
        ctx.globalAlpha = 1;
      }

      if (kind === "security") {
        const s = Math.min(w, h) * 0.34;
        const ry = t * (0.3 + hover * 0.5);
        ctx.fillStyle = INK;
        for (const [x, y, z] of dots) {
          const x1 = x * Math.cos(ry) - z * Math.sin(ry);
          const z1 = x * Math.sin(ry) + z * Math.cos(ry);
          const y1 = y * Math.cos(-0.4) - z1 * Math.sin(-0.4);
          const p = 1 / (2 - z1);
          ctx.globalAlpha = 0.2 + p * 0.35;
          ctx.fillRect(cx + x1 * s * p, cy + y1 * s * p, 1.4, 1.4);
        }
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = ACC;
        const rr = s * (0.55 + 0.4 * Math.sin(t * (0.8 + hover)));
        ctx.beginPath();
        ctx.ellipse(cx, cy, rr, rr * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    if (reduced) {
      t = 8;
      draw();
    } else {
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!vis) return;
        draw();
      };
      loop();
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      cvs.parentElement?.removeEventListener("pointerenter", enter);
      cvs.parentElement?.removeEventListener("pointerleave", leave);
    };
  }, [kind]);

  return <canvas ref={ref} aria-hidden="true" className="h-full w-full" />;
}
