"use client";

import { useEffect, useState } from "react";

/*
 * Terminal mechanics ported from webTemplates/nice-squash-242352
 * (Terminal.tsx): typed command lines, spinner run-lines, ok/live
 * status lines and a replay control. Session content describes only
 * documented VantaDB behavior.
 */
type Line = { kind: "cmd" | "ok" | "run" | "live"; text: string; note?: string };

const LINES: Line[] = [
  { kind: "cmd", text: "pip install vantadb-py" },
  { kind: "ok", text: "Successfully installed vantadb-py-0.5.0" },
  { kind: "cmd", text: 'db = vantadb.Client("./agent_memory")' },
  { kind: "run", text: "Opening WAL · CRC32C check", note: "auto-heal" },
  { kind: "ok", text: "HNSW + BM25 indexes ready" },
  {
    kind: "cmd",
    text: 'db.put("agent/session-1", "ctx-001", "User prefers concise technical answers")',
  },
  { kind: "ok", text: "MVCC snapshot committed" },
  {
    kind: "cmd",
    text: 'db.search("agent/session-1", text_query="concise answers", top_k=3)',
  },
  { kind: "live", text: "1 result · hybrid BM25 + HNSW · RRF fusion" },
];

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function TerminalDemo() {
  const [run, setRun] = useState(0);
  const [li, setLi] = useState(0);
  const [ch, setCh] = useState(0);
  const [spin, setSpin] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (reduced) {
      setLi(LINES.length);
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) =>
      timers.push(setTimeout(fn, ms));

    setLi(0);
    setCh(0);
    setSpin(0);
    later(function tick() {
      if (cancelled) return;
      let i = 0,
        chAcc = 0;
      const step = () => {
        if (cancelled) return;
        if (i >= LINES.length) return;
        const line = LINES[i];
        if (line.kind === "cmd") {
          if (chAcc <= line.text.length) {
            setLi(i);
            setCh(chAcc);
            chAcc++;
            later(step, 34);
          } else {
            i++;
            chAcc = 0;
            later(step, 320);
          }
        } else if (line.kind === "run") {
          setLi(i);
          setCh(0);
          setSpin(0);
          let s = 0;
          const sp = () => {
            if (cancelled) return;
            if (s < 6) {
              setSpin(s);
              s++;
              later(sp, 90);
            } else {
              i++;
              chAcc = 0;
              later(step, 120);
            }
          };
          sp();
        } else {
          setLi(i);
          setCh(0);
          i++;
          chAcc = 0;
          later(step, 460);
        }
      };
      step();
      later(() => setLi(LINES.length), 14000);
    }, 900);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [run, reduced]);

  const done = li >= LINES.length;

  return (
    <div className="nm-term">
      <div className="nm-term-head">
        {[0, 1, 2].map((i) => (
          <i key={i} />
        ))}
        <span>agent_memory — python</span>
        <button
          type="button"
          aria-label="Replay terminal session"
          onClick={() => {
            setReduced(false);
            setRun((r) => r + 1);
          }}
        >
          ↻
        </button>
      </div>
      <div className="nm-term-body">
        {LINES.map((l, idx) => {
          if (idx > li) return null;
          const active = idx === li;
          if (l.kind === "cmd") {
            if (active && ch === 0) return null;
            return (
              <div className="ln cmd" key={idx}>
                <span className="ps">»</span>{" "}
                {active && !done ? l.text.slice(0, ch) : l.text}
                {active && !done && <span className="caret" />}
              </div>
            );
          }
          const icon =
            l.kind === "run" ? "→" : l.kind === "live" ? "●" : "✓";
          return (
            <div className={`ln ${l.kind}`} key={idx}>
              <span className={l.kind === "ok" || l.kind === "live" ? "ok" : "run"}>
                {icon}
              </span>{" "}
              {l.text}
              <span className="ps">
                {active && l.kind === "run" && !done
                  ? " " + SPINNER[spin % SPINNER.length]
                  : l.note
                    ? "  " + l.note
                    : ""}
              </span>
            </div>
          );
        })}
        {done && (
          <div className="ln cmd">
            <span className="ps">»</span> <span className="caret" />
          </div>
        )}
      </div>
    </div>
  );
}
