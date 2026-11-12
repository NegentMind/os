"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Terminal tipeada: sesión real de la API de VantaDB (Python SDK).
 * Un único contador de caracteres recorre la sesión; cada línea deriva
 * su texto visible de ese contador. Bucle con pausa al final.
 * prefers-reduced-motion: sesión completa, sin animación.
 */

type Line = { text: string; kind: "cmd" | "out" | "res" };

const SESSION: Line[] = [
  { text: "pip install vantadb-py", kind: "cmd" },
  { text: "Successfully installed vantadb-py-0.5.0", kind: "out" },
  { text: "", kind: "out" },
  { text: "import vantadb", kind: "cmd" },
  { text: 'db = vantadb.Client("./agent_memory")', kind: "cmd" },
  { text: "", kind: "out" },
  { text: 'db.put("agent/session-1", "ctx-001",', kind: "cmd" },
  { text: '        "User prefers concise technical answers",', kind: "cmd" },
  { text: "        vector=embedding)", kind: "cmd" },
  { text: "", kind: "out" },
  { text: 'db.search("agent/session-1",', kind: "cmd" },
  { text: '           text_query="concise answers", top_k=3)', kind: "cmd" },
  { text: "→ 1 result · hybrid BM25 + HNSW · RRF fusion", kind: "res" },
  { text: '  ctx-001  "User prefers concise technical answers"', kind: "res" },
];

/** Caracteres "presupuestados" por línea: cmd teclea lento, salidas rápido. */
const CHAR_COST = { cmd: 2, out: 8, res: 6 } as const;
const LINE_PAUSE = { cmd: 10, out: 6, res: 30 } as const;
const END_PAUSE = 140;

// Posición acumulada (coste) al inicio de cada línea + su span total.
const SPANS = (() => {
  let acc = 0;
  return SESSION.map((l) => {
    const span =
      l.text.length * CHAR_COST[l.kind] + LINE_PAUSE[l.kind];
    const s = { start: acc, span, len: l.text.length, cost: CHAR_COST[l.kind] };
    acc += span;
    return s;
  });
})();
const TOTAL = SPANS.reduce((a, s) => a + s.span, 0);

export function TerminalDemo({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [pos, setPos] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const blink = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(
      () => setPos((p) => (p >= TOTAL + END_PAUSE ? 0 : p + 1)),
      24,
    );
    return () => clearInterval(t);
  }, [reduced]);

  const visible = useMemo(() => {
    if (reduced) return SESSION;
    const out: Line[] = [];
    for (let i = 0; i < SESSION.length; i++) {
      const s = SPANS[i];
      if (pos <= s.start) break;
      const chars = Math.min(Math.floor((pos - s.start) / s.cost), s.len);
      out.push({ ...SESSION[i], text: SESSION[i].text.slice(0, chars) });
    }
    return out;
  }, [pos, reduced]);

  return (
    <div
      className={className ?? "border-linedark border bg-panel"}
      role="img"
      aria-label="Terminal session: installing vantadb-py and storing and searching agent memory"
    >
      <div className="border-linedark flex items-center gap-2 border-b px-4 py-2">
        <span className="bg-linedark h-2 w-2 rounded-full" aria-hidden="true" />
        <span className="bg-linedark h-2 w-2 rounded-full" aria-hidden="true" />
        <span className="bg-pulse h-2 w-2 rounded-full" aria-hidden="true" />
        <span className="font-mono ml-3 text-[11px] tracking-[0.14em] text-fog uppercase">
          agent_memory · python
        </span>
      </div>
      <div className="font-mono overflow-x-auto p-4 text-[12.5px] leading-relaxed sm:text-[13px]">
        {visible.map((l, i) => (
          <p
            key={i}
            className={
              l.kind === "cmd"
                ? "text-bone"
                : l.kind === "res"
                  ? "text-pulse"
                  : "text-fog"
            }
          >
            {l.kind === "cmd" && (
              <span className="text-pulse" aria-hidden="true">
                {"» "}
              </span>
            )}
            {l.text || "\u00a0"}
          </p>
        ))}
        <p className="text-bone">
          <span className="text-pulse" aria-hidden="true">
            {"» "}
          </span>
          <span
            aria-hidden="true"
            className={cursorOn ? "opacity-100" : "opacity-0"}
          >
            ▌
          </span>
        </p>
      </div>
    </div>
  );
}
