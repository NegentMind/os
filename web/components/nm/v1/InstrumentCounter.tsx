"use client";

type Props = {
  label: string;
  value: string;
  unit?: string;
  tone?: "bone" | "pulse" | "fog";
};

/**
 * Contador instrumento: numerales tabulares mono, una sola cifra que importa.
 * Solo muestra valores medidos o constantes documentadas del repo.
 */
export function InstrumentCounter({ label, value, unit, tone = "bone" }: Props) {
  const color =
    tone === "pulse" ? "text-pulse" : tone === "fog" ? "text-fog" : "text-bone";
  return (
    <div className="border-linedark border-l pl-4">
      <p
        className={`font-mono text-3xl tabular-nums sm:text-4xl ${color}`}
        aria-live="off"
      >
        {value}
        {unit ? (
          <span className="ml-1 text-sm text-fog">{unit}</span>
        ) : null}
      </p>
      <p className="font-mono mt-2 text-[11px] tracking-[0.18em] text-fog uppercase">
        {label}
      </p>
    </div>
  );
}
