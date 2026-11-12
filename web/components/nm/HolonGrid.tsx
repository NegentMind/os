"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { HalftoneCanvas, type HalftoneKind } from "@/components/nm/HalftoneCanvas";

/*
 * Capability grid ported from webTemplates/nice-squash-242352 (Sections.tsx
 * `Platform`): bordered grid of technical cards, each pairing a numbered
 * header + HUD-framed halftone instrument with a system name and spec.
 * Content maps 1:1 to specs/SPECIFICATION.md — VantaDB is the only shipped
 * module; every RFC card is labelled DEFINED, not built.
 */
type Status = "IN BUILD" | "RFC";

interface Holon {
  num: string;
  cat: string;
  kind: HalftoneKind;
  title: string;
  body: string;
  status: Status;
  hudLeft: string;
}

const HOLONS: Holon[] = [
  {
    num: "S/01",
    cat: "MEMORY SUBSTRATE",
    kind: "memory",
    title: "VantaDB",
    body: "Embedded Rust engine — HNSW + BM25 hybrid retrieval with MVCC isolation, WAL durability and snapshotting. The storage layer every other module builds on.",
    status: "IN BUILD",
    hudLeft: "ENGINE · v0.9.0",
  },
  {
    num: "S/02",
    cat: "RFC-01",
    kind: "orchestration",
    title: "Cardinal",
    body: "Context & working memory. Bitemporal episodic state — what an agent knew, and when it became true — with provenance tracking and token budgeting.",
    status: "RFC",
    hudLeft: "CONTEXT LAYER",
  },
  {
    num: "S/03",
    cat: "RFC-02",
    kind: "evaluations",
    title: "Meta",
    body: "Verification & metacognition. Deterministic execution traces and signed attestation logs so an agent's actions can be audited, not just logged.",
    status: "RFC",
    hudLeft: "AUDIT LAYER",
  },
  {
    num: "S/04",
    cat: "RFC-03",
    kind: "observability",
    title: "Iris",
    body: "Perception & ingestion. Local-first pipelines that turn unstructured multimodal documents into vector-indexed, verifiable nodes.",
    status: "RFC",
    hudLeft: "PERCEPTION",
  },
  {
    num: "S/05",
    cat: "RFC-04",
    kind: "runtime",
    title: "Execute",
    body: "Deterministic tool execution. Sandboxed action boundaries with explicit retry policies — no probabilistic retry loops.",
    status: "RFC",
    hudLeft: "EXECUTION",
  },
  {
    num: "S/06",
    cat: "RFC-04",
    kind: "security",
    title: "Sage",
    body: "Correction feedback. Persistent human-in-the-loop signals so agents stop repeating mistakes that were already corrected.",
    status: "RFC",
    hudLeft: "ADAPTATION",
  },
];

function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e[0]?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`hg-reveal${on ? " is-in" : ""}`}>
      {children}
    </div>
  );
}

export function HolonGrid() {
  return (
    <div className="feat-grid">
      {HOLONS.map((h) => (
        <Reveal key={h.num}>
          <article className="feat">
            <header className="fhead">
              <span className="fnum">{h.num}</span>
              <span className="fcat">{h.cat}</span>
            </header>
            <div className="graphic">
              <HalftoneCanvas kind={h.kind} />
              <div className="g-hud" aria-hidden="true">
                <span>{h.hudLeft}</span>
                <b className={h.status === "IN BUILD" ? "live" : ""}>
                  {h.status}
                </b>
              </div>
            </div>
            <h3>{h.title}</h3>
            <p>{h.body}</p>
            <span className="arrow" aria-hidden="true">
              ↗
            </span>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
