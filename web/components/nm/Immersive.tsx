"use client";

import { useEffect, useRef } from "react";
import { Sculpture } from "@/components/nm/sculpture";

/*
 * Immersive scroll-driven halftone sculpture, ported from
 * webTemplates/nice-squash-242352 (Immersive.tsx). 400vh track:
 * particles assemble → expand → morph → reorganise into a lattice —
 * negentropy made literal. Drag to rotate.
 */
const PHASES = [
  "PHASE 01 — ASSEMBLE",
  "PHASE 02 — EXPAND",
  "PHASE 03 — MORPH",
  "PHASE 04 — REORGANISE",
];

export function Immersive() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const prog = useRef(0);

  useEffect(() => {
    let s: Sculpture | null = null;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (cvsRef.current) {
      s = new Sculpture(cvsRef.current, {
        shapes: ["sphere", "torusKnot", "lattice"],
        points: reduced ? 12000 : 46000,
        ink: "#EDEAE3",
        dotSize: 1.35,
        rotationSpeed: 0.1,
        interactive: !reduced,
        externalProgress: () => prog.current,
      });
    }
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      prog.current = reduced ? 1 : p;
      const ph = Math.min(3, Math.floor((reduced ? 1 : p) * 4));
      if (phaseRef.current && phaseRef.current.textContent !== PHASES[ph]) {
        phaseRef.current.textContent = PHASES[ph];
      }
      if (barRef.current)
        barRef.current.style.setProperty("--p", String(reduced ? 1 : p));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sec = trackRef.current;
    const tags = sec?.querySelectorAll<HTMLElement>(".tag") ?? [];
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      tags.forEach((t, i) => {
        const d = 10 + i * 6;
        t.style.setProperty("--px", `${(nx * d).toFixed(1)}px`);
        t.style.setProperty("--py", `${(ny * d).toFixed(1)}px`);
      });
    };
    sec?.addEventListener("pointermove", onMove);

    return () => {
      s?.dispose();
      window.removeEventListener("scroll", onScroll);
      sec?.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section className="imm" id="system" aria-label="Immersive system">
      <div ref={trackRef} style={{ height: "400vh" }}>
        <div className="ordo-imm" style={{ height: "100%" }}>
          <div className="ordo-imm__sticky">
            <canvas
              ref={cvsRef}
              role="img"
              aria-label="A large sculpture of halftone particles. Scrolling assembles it, expands it, morphs it into a knot and finally reorganises the particles into a clean cubic lattice. Drag to rotate."
            />
            <div className="ordo-imm__ui">
              <div className="ordo-imm__top">
                <p className="lbl">[ 02 / THE PRINCIPLE ]</p>
                <p className="lbl ordo-imm__phase" aria-live="polite">
                  <span ref={phaseRef}>PHASE 01 — ASSEMBLE</span>
                </p>
              </div>
              <div className="ordo-imm__tags" aria-hidden="true">
                <span className="tag tag--1">
                  <i />
                  CAPABILITY / <b>MEMORY</b>
                </span>
                <span className="tag tag--2">
                  <i />
                  PRINCIPLE / <b>NEGENTROPY</b>
                </span>
                <span className="tag tag--3">
                  <i />
                  METHOD / <b>HYBRID</b>
                </span>
                <span className="tag tag--4">
                  <i />
                  LICENSE / <b>APACHE-2.0</b>
                </span>
              </div>
              <div className="ordo-imm__copy">
                <h3 className="ordo-imm__title">Order out of chaos.</h3>
                <p className="ordo-imm__sub">
                  <span>Capabilities agents don't have.</span>
                  <span>Built in the open.</span>
                </p>
              </div>
              <div className="ordo-imm__ruler">
                <span>00</span>
                <div className="ordo-imm__track">
                  <i ref={barRef} />
                  {[0.25, 0.5, 0.75].map((x) => (
                    <b key={x} style={{ left: `${x * 100}%` }} />
                  ))}
                </div>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
