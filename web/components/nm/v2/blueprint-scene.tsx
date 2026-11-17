import {
  ArrowDownToLine,
  BookOpen,
  BrainCircuit,
  Database,
  FileCode2,
  Layers,
  MessagesSquare,
  ScanEye,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type BlueprintVariant =
  | "system"
  | "memory"
  | "scope"
  | "capabilities"
  | "evidence";

type BlueprintSceneProps = {
  variant: BlueprintVariant;
  className?: string;
  labels?: readonly string[];
  selected?: number;
  expanded?: boolean;
};

const SYSTEM_ICONS: readonly LucideIcon[] = [
  BrainCircuit,
  Database,
  ScanEye,
  Wrench,
  ShieldCheck,
];
const MEMORY_ICONS: readonly LucideIcon[] = [ArrowDownToLine, Database, Layers];
const EVIDENCE_ICONS: readonly LucideIcon[] = [
  FileCode2,
  BookOpen,
  MessagesSquare,
];

function iconsFor(variant: BlueprintVariant): readonly LucideIcon[] {
  if (variant === "system") return SYSTEM_ICONS;
  if (variant === "evidence") return EVIDENCE_ICONS;
  return MEMORY_ICONS;
}

/* Center-to-center spokes sit behind the solid node cards. */
const SYSTEM_SPOKES = [
  "M320 210L115.2 67.2",
  "M320 210L524.8 67.2",
  "M320 210L524.8 352.8",
  "M320 210L115.2 352.8",
];
const FLOW_CONNECTORS = ["M192 210H230", "M403.2 210H441"];

/* Scope/evidence studies: one exploded sheet, three clean parallelograms. */
const SHEET = "M170 160L400 110L470 260L240 310Z";

/* One cube for the unlabeled system/capabilities plates. */
const CUBE_TOP = "M320 100L460 180L320 260L180 180Z";
const CUBE_LEFT = "M180 180V290L320 370V260Z";
const CUBE_RIGHT = "M460 180V290L320 370V260Z";

function SheetStudy() {
  return (
    <>
      {[0, 1, 2].map((index) => (
        <path
          key={index}
          className={`nm2-blueprint__sheet nm2-blueprint__sheet--${index}`}
          d={SHEET}
        />
      ))}
    </>
  );
}

function Cube() {
  return (
    <>
      <path className="nm2-blueprint__face nm2-blueprint__face--left" d={CUBE_LEFT} />
      <path className="nm2-blueprint__face nm2-blueprint__face--right" d={CUBE_RIGHT} />
      <path className="nm2-blueprint__face nm2-blueprint__face--top" d={CUBE_TOP} />
    </>
  );
}

function Cylinder() {
  return (
    <>
      <path
        className="nm2-blueprint__face nm2-blueprint__face--side"
        d="M200 120V300a120 34 0 0 0 240 0V120Z"
      />
      <path
        className="nm2-blueprint__edge"
        d="M200 210a120 34 0 0 0 240 0"
      />
      <ellipse
        className="nm2-blueprint__face nm2-blueprint__face--top"
        cx="320"
        cy="120"
        rx="120"
        ry="34"
      />
    </>
  );
}

function DecorativeSolid({ variant }: { variant: BlueprintVariant }) {
  if (variant === "memory") return <Cylinder />;
  if (variant === "scope" || variant === "evidence") return <SheetStudy />;
  return <Cube />;
}

export function BlueprintScene({
  variant,
  className = "",
  labels,
  selected,
  expanded,
}: BlueprintSceneProps) {
  const semantic = variant !== "scope" && labels !== undefined;
  const icons = semantic ? iconsFor(variant) : [];

  return (
    <div
      className={`nm2-blueprint nm2-blueprint--${variant} ${className}`}
      data-expanded={expanded || undefined}
      data-float=""
      aria-hidden="true"
    >
      <svg
        className="nm2-blueprint__svg"
        viewBox="0 0 640 420"
        preserveAspectRatio="none"
        fill="none"
      >
        {semantic ? (
          (variant === "system" ? SYSTEM_SPOKES : FLOW_CONNECTORS).map(
            (d, index) => (
              <g key={d}>
                <path className="nm2-blueprint__connector" d={d} />
                <path
                  className="nm2-blueprint__connector-trace"
                  d={d}
                  data-draw=""
                  data-selected={
                    (variant === "system"
                      ? selected === 0 || selected === index + 1
                      : selected === index || selected === index + 1) ||
                    undefined
                  }
                />
              </g>
            ),
          )
        ) : (
          <DecorativeSolid variant={variant} />
        )}
      </svg>
      {semantic ? (
        <div className="nm2-blueprint__nodes">
          {Array.from({ length: variant === "system" ? 5 : 3 }, (_, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className={`nm2-blueprint__node-card nm2-blueprint__node-card--${index}`}
                data-selected={selected === index || undefined}
              >
                {Icon ? (
                  <Icon size={20} className="nm2-blueprint__node-icon" aria-hidden="true" />
                ) : null}
                <span className="nm2-blueprint__node-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {labels?.[index] ? <span>{labels[index]}</span> : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
