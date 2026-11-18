"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Sculpture, type ShapeName } from "@/components/nm/sculpture";
import type { Dict } from "@/lib/i18n";

/*
 * Scroll-pinned stage board ported from webTemplates/nice-squash-242352
 * (Flow.tsx): stage tabs, code panel, query graph, metric panel and a
 * point-cloud form, linked by drawn connector paths. Stage content
 * describes only documented VantaDB usage. Code stays in English
 * (it's product code); names, statuses and metric chrome localize.
 */
type Metric =
  | { kind: "checks"; title: string; value: string; unit: string; rows: string[] }
  | {
      kind: "bars";
      title: string;
      value: string;
      unit: string;
      rows: [string, number][];
    }
  | { kind: "grid"; title: string; value: string; unit: string }
  | { kind: "line"; title: string; value: string; unit: string };

interface StageDef {
  key: string;
  file: string;
  shape: ShapeName;
  code: ReactNode;
  active: string[];
  metricValue: string;
  metricRows?: number[];
}

const K = ({ c, children }: { c: string; children: ReactNode }) => (
  <span className={`t-${c}`}>{children}</span>
);

const STAGE_DEFS: StageDef[] = [
  {
    key: "connect",
    file: "client.py",
    shape: "lattice",
    code: (
      <>
        <K c="k">import</K> vantadb
        <br />
        <br />
        db = vantadb.<K c="fn">Client</K>(
        <K c="s">"./agent_memory"</K>)
        <br />
        <K c="c"># embedded — runs inside your process</K>
        <br />
        <K c="c"># no server, no daemon, no network</K>
      </>
    ),
    active: ["in", "router"],
    metricValue: "1",
  },
  {
    key: "index",
    file: "put.py",
    shape: "twistTorus",
    code: (
      <>
        db.<K c="fn">put</K>(<K c="s">"agent/session-1"</K>,
        <K c="s">"ctx-001"</K>,<br />
        {"    "}
        <K c="s">"User prefers concise technical answers"</K>,<br />
        {"    "}vector=embedding)
        <br />
        <br />
        <K c="c">→ embedding indexed in HNSW</K>
        <br />
        <K c="c">→ terms indexed in BM25</K>
        <br />
        <K c="c">→ appended to WAL</K>
      </>
    ),
    active: ["router", "search", "crm", "tickets"],
    metricValue: "2",
    metricRows: [1, 1, 0.9, 0.72],
  },
  {
    key: "query",
    file: "search.py",
    shape: "sphere",
    code: (
      <>
        hits = db.<K c="fn">search</K>(<K c="s">"agent/session-1"</K>,
        <br />
        {"    "}text_query=<K c="s">"concise answers"</K>,<br />
        {"    "}top_k=<K c="n">3</K>)
        <br />
        <br />
        <K c="c"># vector + lexical scored in one pass,</K>
        <br />
        <K c="c"># fused by Reciprocal Rank Fusion</K>
      </>
    ),
    active: ["search", "crm", "tickets", "judge"],
    metricValue: "RRF",
  },
  {
    key: "commit",
    file: "wal.log",
    shape: "rings",
    code: (
      <>
        <K c="c">→</K> WAL appended <K c="ok">✓</K> CRC32C verified
        <br />
        <K c="ok">✓</K> snapshot committed
        <br />
        <K c="ok">✓</K> readers unblocked — MVCC
        <br />
        <K c="ok">✓</K> crash-safe — auto-heal on open
      </>
    ),
    active: ["judge", "out"],
    metricValue: "MVCC",
  },
];

const NODES = [
  { id: "in", l: "QUERY", x: 40, y: 75 },
  { id: "router", l: "FUSION", x: 130, y: 75 },
  { id: "search", l: "VECTOR", x: 240, y: 27 },
  { id: "crm", l: "BM25", x: 240, y: 75 },
  { id: "tickets", l: "DOCS", x: 240, y: 123 },
  { id: "judge", l: "RRF", x: 345, y: 75 },
  { id: "out", l: "HITS", x: 420, y: 75 },
];
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [3, 5],
  [4, 5],
  [5, 6],
];

function Graph({ active }: { active: string[] }) {
  return (
    <svg
      className="graph"
      viewBox="0 0 460 150"
      style={{ width: "100%", height: 150 }}
      aria-hidden="true"
    >
      {EDGES.map(([a, b], i) => {
        const on =
          active.includes(NODES[a].id) && active.includes(NODES[b].id);
        return (
          <line
            key={i}
            className={`ge${on ? " on" : ""}`}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
          />
        );
      })}
      {NODES.map((n) => {
        const on = active.includes(n.id);
        return (
          <g
            key={n.id}
            className={`gn${on ? " on" : ""}`}
            style={{ transition: "opacity .4s" }}
            opacity={on ? 1 : 0.55}
          >
            <rect x={n.x - 20} y={n.y - 13} width={40} height={26} />
            <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize={8.5}>
              {n.l}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MetricPanel({ m, regions }: { m: Metric; regions: readonly string[] }) {
  return (
    <>
      <div className="mt-head">
        <span>{m.title}</span>
        <span className={`mt-dot${m.kind === "line" ? " is-live" : ""}`} />
      </div>
      <div className="mt-value">
        <b>{m.value}</b>
        <span>{m.unit}</span>
      </div>
      {m.kind === "checks" && (
        <ul className="mt-checks">
          {m.rows.map((r, i) => (
            <li key={r} style={{ ["--i" as string]: i } as React.CSSProperties}>
              <span>✓</span>
              {r}
            </li>
          ))}
        </ul>
      )}
      {m.kind === "bars" && (
        <ul className="mt-bars">
          {m.rows.map(([r, v], i) => (
            <li key={r}>
              <span>{r}</span>
              <i
                style={
                  {
                    ["--v" as string]: v,
                    ["--i" as string]: i,
                  } as React.CSSProperties
                }
              />
              <b>{Math.round(v * 100)}%</b>
            </li>
          ))}
        </ul>
      )}
      {m.kind === "grid" && (
        <div className="mt-grid">
          {Array.from({ length: 48 }, (_, i) => (
            <i
              key={i}
              className={i === 29 ? "x" : i % 7 === 3 && i > 40 ? "r" : ""}
              style={{ ["--i" as string]: i } as React.CSSProperties}
            />
          ))}
        </div>
      )}
      {m.kind === "line" && (
        <>
          <svg
            className="mt-line"
            viewBox="0 0 195 34"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              pathLength={1}
              d={
                "M" +
                Array.from({ length: 40 }, (_, i) => {
                  const x = i * 5;
                  const y =
                    30 -
                    (Math.min(1, i / 16) * 18 +
                      Math.sin(i * 0.7) * 2.5 +
                      (i > 16 ? 4 : 0));
                  return `${x} ${y}`;
                }).join(" L")
              }
            />
          </svg>
          <div className="mt-regions">
            {regions.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function Links({
  boardRef,
  seq,
}: {
  boardRef: RefObject<HTMLDivElement | null>;
  seq: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const board = boardRef.current;
    const svg = svgRef.current;
    if (!board || !svg) return;
    const draw = () => {
      const br = board.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${br.width} ${br.height}`);
      const code = board
        .querySelector(".pnl--code")
        ?.getBoundingClientRect();
      const graph = board
        .querySelector(".pnl--graph")
        ?.getBoundingClientRect();
      const metric = board
        .querySelector(".pnl--metric")
        ?.getBoundingClientRect();
      const object = board
        .querySelector(".pnl--object")
        ?.getBoundingClientRect();
      svg.innerHTML = "";
      if (!code || !graph || !metric || !object) return;
      const segs: [number, number, number, number][] = [
        [
          code.right - br.left,
          code.top - br.top + code.height * 0.5,
          graph.left - br.left,
          graph.top - br.top + 20,
        ],
        [
          code.right - br.left - code.width * 0.3,
          code.bottom - br.top,
          metric.left - br.left + metric.width * 0.6,
          metric.top - br.top,
        ],
        [
          metric.right - br.left,
          metric.top - br.top + metric.height * 0.5,
          object.left - br.left,
          object.top - br.top + object.height * 0.3,
        ],
      ];
      for (const [x1, y1, x2, y2] of segs) {
        const p = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        p.setAttribute(
          "d",
          `M${x1} ${y1} C ${x1 + 40} ${y1}, ${x2 - 40} ${y2}, ${x2} ${y2}`,
        );
        p.setAttribute("pathLength", "1");
        p.setAttribute("class", "draw");
        svg.appendChild(p);
        const r = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        r.setAttribute("x", String(x2 - 2));
        r.setAttribute("y", String(y2 - 2));
        r.setAttribute("width", "4");
        r.setAttribute("height", "4");
        svg.appendChild(r);
      }
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(board);
    return () => ro.disconnect();
  }, [boardRef, seq]);
  return <svg className="sc__links" ref={svgRef} aria-hidden="true" />;
}

export function FlowBoard({ dict }: { dict: Dict["engine"]["board"] }) {
  const [stage, setStage] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLCanvasElement>(null);
  const sculpt = useRef<Sculpture | null>(null);

  const STAGES = STAGE_DEFS.map((d, i) => {
    const meta = dict.stages[i];
    let metric: Metric;
    if (d.key === "connect")
      metric = {
        kind: "checks",
        title: meta.metricTitle,
        value: d.metricValue,
        unit: meta.metricUnit,
        rows: meta.rowLabels,
      };
    else if (d.key === "index")
      metric = {
        kind: "bars",
        title: meta.metricTitle,
        value: d.metricValue,
        unit: meta.metricUnit,
        rows: meta.rowLabels.map(
          (l, j) => [l, d.metricRows?.[j] ?? 0] as [string, number],
        ),
      };
    else if (d.key === "query")
      metric = {
        kind: "grid",
        title: meta.metricTitle,
        value: d.metricValue,
        unit: meta.metricUnit,
      };
    else
      metric = {
        kind: "line",
        title: meta.metricTitle,
        value: d.metricValue,
        unit: meta.metricUnit,
      };
    return { ...d, name: meta.name, status: meta.status, metric };
  });

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (shapeRef.current) {
      sculpt.current = new Sculpture(shapeRef.current, {
        shapes: STAGE_DEFS.map((s) => s.shape),
        points: 6000,
        ink: "#EDEAE3",
        dotSize: 1.4,
        rotationSpeed: reduced ? 0 : 0.3,
        interactive: false,
      });
    }
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(0.999, Math.max(0, -r.top / Math.max(1, total)));
      setStage(Math.floor(p * STAGES.length));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      sculpt.current?.dispose();
    };
  }, []);

  useEffect(() => {
    sculpt.current?.setShape(stage);
  }, [stage]);

  const cur = STAGES[stage];

  return (
    <div
      className="flow-track"
      ref={trackRef}
      style={{ height: `${STAGES.length * 100}vh` }}
    >
      <div className="wrap" style={{ height: "100%" }}>
        <div
          className="ordo-sc"
          data-stage={cur.key}
          style={{ height: "100%" }}
        >
          <div className="sc__sticky">
            <div
              className="sc__steps"
              role="tablist"
              aria-label={dict.stagesAria}
            >
              {STAGES.map((s, i) => (
                <button
                  key={s.key}
                  role="tab"
                  aria-selected={i === stage}
                  className={i < stage ? "is-done" : ""}
                  onClick={() => {
                    setStage(i);
                    const el = trackRef.current!;
                    const total = el.offsetHeight - window.innerHeight;
                    const top =
                      el.offsetTop + ((i + 0.5) / STAGES.length) * total;
                    window.scrollTo({ top, behavior: "smooth" });
                  }}
                >
                  <span className="sc__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="sc__name">{s.name}</span>
                  <span className="sc__bar">
                    <i
                      style={
                        {
                          ["--fill" as string]:
                            i < stage ? 1 : i === stage ? 0.5 : 0,
                        } as React.CSSProperties
                      }
                    />
                  </span>
                </button>
              ))}
              <p className="sc__hint lbl">{dict.hint}</p>
            </div>
            <div className="sc__board" ref={boardRef}>
              <Links boardRef={boardRef} seq={stage} />
              <div className="sc__bar-top">
                <span>
                  {dict.stageLabel}{" "}
                  <b>
                    {String(stage + 1).padStart(2, "0")} /{" "}
                    {cur.name.toUpperCase()}
                  </b>
                </span>
                <span>VANTADB · PY</span>
                <span className="sc__status">
                  {dict.statusLabel} {cur.status}
                </span>
              </div>
              <div className="pnl pnl--code">
                <div className="pnl__head">
                  <span>{cur.file}</span>
                  <span>PY</span>
                </div>
                <div className="pnl__body">
                  <pre>{cur.code}</pre>
                </div>
              </div>
              <div className="pnl pnl--graph">
                <div className="pnl__head">
                  <span>{dict.graphHead}</span>
                  <span>7 NODES</span>
                </div>
                <div className="pnl__body">
                  <Graph active={cur.active} />
                </div>
              </div>
              <div className="pnl pnl--metric">
                <div className="pnl__body">
                  <MetricPanel m={cur.metric} regions={dict.regions} />
                </div>
              </div>
              <div className="pnl pnl--object">
                <div className="pnl__head">
                  <span>{dict.formHead}</span>
                  <span>{cur.shape.toUpperCase()}</span>
                </div>
                <div className="pnl__body">
                  <canvas ref={shapeRef} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
