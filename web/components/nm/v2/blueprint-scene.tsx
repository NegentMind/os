"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useSceneActivity } from "@/components/nm/v2/field-canvas";

export type BlueprintVariant =
  | "system"
  | "memory"
  | "scope"
  | "capabilities"
  | "evidence";

type Position = readonly [x: number, y: number, z: number];

// One orthographic isometric projection for every plate, port and connector.
// Shared vertices are calculated, rather than aligned by eye.
function project([x, y, z]: Position): readonly [number, number] {
  return [320 + (x - y) * Math.sqrt(3) / 2, 256 + (x + y) / 2 - z];
}

function point(position: Position) {
  return project(position).map((value) => value.toFixed(2)).join(",");
}

function path(positions: readonly Position[], close = false) {
  return `${positions.map((position, index) => `${index === 0 ? "M" : "L"}${point(position)}`).join(" ")}${close ? " Z" : ""}`;
}

function IsoBox({
  origin: [x, y, z],
  size: [width, depth, height],
  secondary = false,
}: {
  origin: Position;
  size: Position;
  secondary?: boolean;
}) {
  const a: Position = [x, y, z];
  const b: Position = [x + width, y, z];
  const c: Position = [x + width, y + depth, z];
  const d: Position = [x, y + depth, z];
  const topA: Position = [x, y, z + height];
  const topB: Position = [x + width, y, z + height];
  const topC: Position = [x + width, y + depth, z + height];
  const topD: Position = [x, y + depth, z + height];
  return (
    <g className={secondary ? "nm2-blueprint__secondary" : "nm2-blueprint__solid"}>
      <path className="nm2-blueprint__face" d={path([topA, topB, topC, topD], true)} />
      <path className="nm2-blueprint__face nm2-blueprint__face--side" d={path([topB, b, c, topC], true)} />
      <path data-draw="" d={path([topA, topB, topC, topD], true)} />
      <path data-draw="" d={`${path([topB, b, c, d, topD])} ${path([topC, c])}`} />
      <path className="nm2-blueprint__construction" d={`${path([a, b])} ${path([a, d])} ${path([a, topA])}`} />
    </g>
  );
}

function IsoRing({
  center: [x, y, z],
  radius,
  plane = "xy",
  secondary = false,
}: {
  center: Position;
  radius: number;
  plane?: "xy" | "xz" | "yz";
  secondary?: boolean;
}) {
  const positions = Array.from({ length: 97 }, (_, index): Position => {
    const angle = index / 96 * Math.PI * 2;
    const u = Math.cos(angle) * radius;
    const v = Math.sin(angle) * radius;
    if (plane === "xz") return [x + u, y, z + v];
    if (plane === "yz") return [x, y + u, z + v];
    return [x + u, y + v, z];
  });
  return (
    <path
      data-draw=""
      className={secondary ? "nm2-blueprint__secondary" : undefined}
      d={path(positions, true)}
    />
  );
}

function GroundPlane() {
  return (
    <g className="nm2-blueprint__ground">
      <path d={path([[-182, -138, -12], [182, -138, -12], [182, 138, -12], [-182, 138, -12]], true)} />
      <path d={`${path([[-200, 0, -12], [200, 0, -12]])} ${path([[0, -156, -12], [0, 156, -12]])}`} />
      {([-1, 1] as const).map((side) => (
        <path key={side} d={`${path([[side * 166, -8, -12], [side * 166, 8, -12]])} ${path([[-8, side * 122, -12], [8, side * 122, -12]])}`} />
      ))}
    </g>
  );
}

function SystemBlueprint() {
  const modules: Position[] = [
    [-157, -28, 12], [113, -28, 12], [-22, -147, 12], [-22, 103, 12],
  ];
  return (
    <>
      <GroundPlane />
      <g className="nm2-blueprint__secondary">
        <path data-draw="" d={`${path([[-68, 0, 12], [-135, 0, 12], [-135, 0, 34]])} ${path([[68, 0, 12], [135, 0, 12], [135, 0, 34]])}`} />
        <path data-draw="" d={`${path([[0, -68, 12], [0, -125, 12], [0, -125, 34]])} ${path([[0, 68, 12], [0, 125, 12], [0, 125, 34]])}`} />
      </g>
      {modules.slice(0, 3).map((origin, index) => (
        <IsoBox key={index} origin={origin} size={[44, 44, 30]} secondary />
      ))}
      <IsoBox origin={[-68, -68, 0]} size={[136, 136, 12]} secondary />
      <g className="nm2-blueprint__drift">
        <IsoBox origin={[-38, -38, 34]} size={[76, 76, 82]} />
        <IsoBox origin={[-24, -24, 116]} size={[48, 48, 7]} secondary />
        <path data-draw="" d={path([[-38, 0, 75], [38, 0, 75], [38, 38, 75]])} />
        <path className="nm2-blueprint__construction" d={path([[0, 0, 12], [0, 0, 152]])} />
      </g>
      <IsoBox origin={modules[3]} size={[44, 44, 30]} secondary />
      <g className="nm2-blueprint__ports">
        {([-18, 0, 18] as const).map((offset) => (
          <path key={offset} data-draw="" d={path([[38, offset, 47], [48, offset, 47], [48, offset, 34]])} />
        ))}
      </g>
    </>
  );
}

function MemoryBlueprint() {
  const radius = 19;
  const tangent = radius / Math.sqrt(2);
  const cylinderFront = Array.from({ length: 49 }, (_, index): Position => {
    const angle = -Math.PI / 4 + index / 48 * Math.PI;
    return [-116 + Math.cos(angle) * radius, 90 + Math.sin(angle) * radius, 1];
  });
  return (
    <>
      <GroundPlane />
      <g className="nm2-blueprint__construction">
        {([-1, 1] as const).flatMap((x) =>
          ([-1, 1] as const).map((y) => (
            <path key={`${x}-${y}`} d={path([[x * 88, y * 59, 6], [x * 88, y * 59, 182]])} />
          )),
        )}
      </g>
      {[18, 80, 142].map((z, index) => (
        <g key={z} className={`nm2-blueprint__layer nm2-blueprint__layer--${index}`}>
          <IsoBox origin={[-88, -59, z]} size={[176, 118, 10]} secondary={index === 0} />
          <path className="nm2-blueprint__secondary" data-draw="" d={path([[-70, -41, z + 10], [70, -41, z + 10], [70, 41, z + 10], [-70, 41, z + 10]], true)} />
          {Array.from({ length: 5 }, (_, col) =>
            Array.from({ length: 3 }, (_, row) => {
              const [x, y] = project([-48 + col * 24, -23 + row * 23, z + 10]);
              return <circle key={`${col}-${row}`} cx={x} cy={y} r="1.5" className="nm2-blueprint__node" />;
            }),
          )}
        </g>
      ))}
      <g className="nm2-blueprint__secondary">
        <IsoRing center={[-116, 90, 45]} radius={radius} />
        <path data-draw="" d={path(cylinderFront)} />
        <path data-draw="" d={`${path([[-116 + tangent, 90 - tangent, 45], [-116 + tangent, 90 - tangent, 1]])} ${path([[-116 - tangent, 90 + tangent, 45], [-116 - tangent, 90 + tangent, 1]])}`} />
        <IsoRing center={[-116, 90, 23]} radius={radius} secondary />
        <path data-draw="" d={path([[-116, 90, 1], [-116, 58, 1], [-88, 58, 18]])} />
      </g>
    </>
  );
}

function ScopeBlueprint() {
  return (
    <>
      <GroundPlane />
      {[-82, 82].map((y) => (
        <g key={y} className="nm2-blueprint__secondary">
          <path data-draw="" d={path([[-100, y, 8], [100, y, 8], [100, y, 172], [-100, y, 172]], true)} />
          <path d={path([[-87, y, 21], [87, y, 21], [87, y, 159], [-87, y, 159]], true)} />
          <path className="nm2-blueprint__construction" d={`${path([[0, y, -4], [0, y, 184]])} ${path([[-112, y, 90], [112, y, 90]])}`} />
        </g>
      ))}
      <IsoRing center={[0, 0, 90]} radius={78} plane="xz" secondary />
      <g className="nm2-blueprint__drift">
        <IsoBox origin={[-31, -31, 54]} size={[62, 62, 62]} />
        <path className="nm2-blueprint__secondary" data-draw="" d={path([[-48, -48, 42], [48, -48, 42], [48, 48, 42], [-48, 48, 42]], true)} />
      </g>
      <path className="nm2-blueprint__construction" d={`${path([[-100, -82, 172], [-100, 82, 172]])} ${path([[100, -82, 8], [100, 82, 8]])} ${path([[0, -118, 90], [0, 118, 90]])}`} />
    </>
  );
}

function CapabilitiesBlueprint() {
  const satellites: Position[] = [
    [-138, -12, 36], [112, -12, 36], [-12, -138, 36], [-12, 112, 36],
  ];
  return (
    <>
      <GroundPlane />
      <IsoRing center={[0, 0, 46]} radius={126} secondary />
      <IsoRing center={[0, 0, 88]} radius={126} secondary />
      <IsoRing center={[0, 0, 122]} radius={90} secondary />
      <g className="nm2-blueprint__secondary">
        {satellites.map(([x, y, z], index) => (
          <path key={index} data-draw="" d={path([[0, 0, 68], [x + 12, y + 12, 68], [x + 12, y + 12, z + 24]])} />
        ))}
      </g>
      {satellites.slice(0, 3).map((origin, index) => (
        <IsoBox key={index} origin={origin} size={[24, 24, 24]} secondary />
      ))}
      <g className="nm2-blueprint__drift">
        <IsoBox origin={[-30, -30, 42]} size={[60, 60, 68]} />
        <IsoRing center={[0, 0, 126]} radius={27} />
        <path data-draw="" d={path([[0, 0, 110], [0, 0, 146]])} />
      </g>
      <IsoBox origin={satellites[3]} size={[24, 24, 24]} secondary />
    </>
  );
}

function EvidenceSheet({
  origin: [x, y, z],
  width,
  depth,
}: {
  origin: Position;
  width: number;
  depth: number;
}) {
  return (
    <g>
      <IsoBox origin={[x, y, z]} size={[width, depth, 4]} />
      <path className="nm2-blueprint__secondary" data-draw="" d={path([
        [x + 12, y + 12, z + 4], [x + width - 12, y + 12, z + 4],
        [x + width - 12, y + depth - 12, z + 4], [x + 12, y + depth - 12, z + 4],
      ], true)} />
      <path className="nm2-blueprint__secondary" data-draw="" d={path([[x + 12, y + 33, z + 4], [x + width - 12, y + 33, z + 4]])} />
    </g>
  );
}

function EvidenceBlueprint() {
  return (
    <>
      <GroundPlane />
      <g className="nm2-blueprint__secondary">
        <path data-draw="" d={path([[-72, -54, 58], [-12, -54, 58], [-12, -82, 92], [26, -82, 92]])} />
        <path data-draw="" d={path([[80, -34, 92], [80, 48, 26], [22, 48, 26]])} />
        <path data-draw="" d={path([[-78, 91, 26], [-124, 91, 26], [-124, 10, 58]])} />
      </g>
      <g className="nm2-blueprint__drift">
        <EvidenceSheet origin={[-172, -100, 54]} width={100} depth={132} />
        <path className="nm2-blueprint__secondary" data-draw="" d={path([[-148, -42, 58], [-96, -42, 58], [-96, -5, 58], [-148, -5, 58]], true)} />
      </g>
      <EvidenceSheet origin={[26, -126, 88]} width={108} depth={92} />
      <path className="nm2-blueprint__secondary" data-draw="" d={`${path([[48, -72, 92], [72, -72, 92], [72, -56, 92], [48, -56, 92]], true)} ${path([[88, -72, 92], [112, -72, 92], [112, -56, 92], [88, -56, 92]], true)}`} />
      <IsoBox origin={[-78, 48, 14]} size={[100, 118, 4]} secondary />
      <EvidenceSheet origin={[-78, 48, 22]} width={100} depth={118} />
      <path className="nm2-blueprint__secondary" data-draw="" d={path([[-56, 104, 26], [-35, 92, 26], [-13, 104, 26], [-13, 128, 26], [-35, 140, 26], [-56, 128, 26]], true)} />
    </>
  );
}

const BLUEPRINTS = {
  system: SystemBlueprint,
  memory: MemoryBlueprint,
  scope: ScopeBlueprint,
  capabilities: CapabilitiesBlueprint,
  evidence: EvidenceBlueprint,
} satisfies Record<BlueprintVariant, () => ReactNode>;

export function BlueprintScene({
  variant,
  className = "",
}: {
  variant: BlueprintVariant;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const active = useSceneActivity(root);
  const Geometry = BLUEPRINTS[variant];

  useEffect(() => {
    const element = root.current;
    if (!element || !active) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const pointerHost = element.parentElement ?? element;
    let listening = false;
    const reset = () => {
      element.style.removeProperty("--nm2-scene-tilt-x");
      element.style.removeProperty("--nm2-scene-tilt-y");
    };
    const move = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType === "touch" || document.hidden) return;
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const x = (event.clientX - rect.left) / rect.width * 2 - 1;
      const y = (event.clientY - rect.top) / rect.height * 2 - 1;
      if (Math.abs(x) > 1 || Math.abs(y) > 1) {
        reset();
        return;
      }
      const magnitude = Math.max(1, Math.hypot(x, y));
      // The combined tilt vector stays below six degrees, including corners.
      element.style.setProperty("--nm2-scene-tilt-x", `${-y / magnitude * 5.5}deg`);
      element.style.setProperty("--nm2-scene-tilt-y", `${x / magnitude * 5.5}deg`);
    };
    const detach = () => {
      pointerHost.removeEventListener("pointermove", move);
      pointerHost.removeEventListener("pointerleave", reset);
      pointerHost.removeEventListener("pointercancel", reset);
      listening = false;
      reset();
    };
    const sync = () => {
      if (!fine.matches) {
        detach();
      } else if (!listening) {
        pointerHost.addEventListener("pointermove", move, { passive: true });
        pointerHost.addEventListener("pointerleave", reset, { passive: true });
        pointerHost.addEventListener("pointercancel", reset, { passive: true });
        listening = true;
      }
    };
    fine.addEventListener("change", sync);
    sync();
    return () => {
      fine.removeEventListener("change", sync);
      detach();
    };
  }, [active, variant]);

  return (
    <div
      ref={root}
      className={`nm2-blueprint nm2-blueprint--${variant} ${className}`}
      data-active={active ? "true" : "false"}
      aria-hidden="true"
    >
      <div className="nm2-blueprint__tilt">
        <svg
          className="nm2-blueprint__svg"
          viewBox="0 -32 640 500"
          width="640"
          height="500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          {/* Scroll, pointer and CSS loops each own a different wrapper. */}
          <g data-float="" className="nm2-blueprint__scroll">
            <Geometry />
          </g>
        </svg>
      </div>
    </div>
  );
}
