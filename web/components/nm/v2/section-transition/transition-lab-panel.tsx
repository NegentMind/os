"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  VARIANTS,
  type TransitionParams,
} from "@/components/nm/v2/section-transition/variants";
import {
  HEADING_EFFECTS,
  TARGET_ALL,
  useCurrentBand,
  useLabContext,
} from "@/components/nm/v2/section-transition/transition-lab";

/*
 * TransitionLabPanel — the dev panel UI of the TransitionLab, split from
 * `transition-lab.tsx` so it only ships in its own lazy chunk
 * (`next/dynamic`, `ssr: false`). Mounted by the `TransitionLab` stub and
 * only when the lab is enabled; reads state through the internal
 * `useLabContext`/`useCurrentBand` hooks — no logic is duplicated here.
 */

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="nm2-transition-lab__row">
      <label htmlFor={id}>
        {label} <output htmlFor={id}>{Number.isInteger(step) ? value : value.toFixed(2)}</output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export function TransitionLabPanel() {
  const ctx = useLabContext();
  const current = useCurrentBand();
  const pill = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const targetId = useId();
  const regionId = useId();
  const [copied, setCopied] = useState<"idle" | "ok" | "error">("idle");
  const heroFullbleedId = useId();
  const orbitalHeadingsId = useId();
  const flipId = useId();
  const open = ctx?.open ?? false;
  const bands = ctx?.bands ?? [];
  const target = ctx?.target ?? TARGET_ALL;
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!open && restoreFocus.current) {
      restoreFocus.current = false;
      pill.current?.focus();
    }
  }, [open]);

  // The slider starts at the band's effective height, not a guessed constant.
  useEffect(() => {
    const id = !target || target === TARGET_ALL ? bands?.[0]?.id : target;
    const element = id
      ? document.getElementById(`transition-${id}`)
      : null;
    setMeasuredHeight(
      element ? Math.round(element.getBoundingClientRect().height) : null,
    );
  }, [target, bands]);

  if (!ctx || !ctx.enabled || !current) return null;
  const { setOpen, setTarget, update, setVariant, reset, hero, setHero,
    composition, setComposition } = ctx;
  const { variant, params, height } = current;
  const showCell = variant === "dither" || variant === "blocks";
  const showSpectrum = variant === "chromatic" || variant === "iridescent";
  const setParam = (key: keyof TransitionParams, value: number) =>
    update({ params: { ...params, [key]: value } });
  const readout = `${target} · ${variant} · i ${params.intensity} · v ${params.speed}`
    + `${showCell ? ` · c ${params.cell}` : ""}${showSpectrum ? ` · s ${params.spectrum}` : ""}`
    + ` · h ${height ?? "auto"}${current.flip ? " · invertida" : ""}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(
          { target, variant, params, height, ...(current.flip ? { flip: true } : {}) },
          null,
          2,
        ),
      );
      setCopied("ok");
    } catch {
      setCopied("error");
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    restoreFocus.current = true;
    setOpen(false);
  };

  if (!open) {
    // aria-controls is omitted: the controlled region only exists while open.
    return (
      <div className="nm2-transition-lab" data-open="false">
        <button
          ref={pill}
          type="button"
          className="nm2-transition-lab__pill"
          aria-expanded="false"
          onClick={() => setOpen(true)}
        >
          Transiciones
        </button>
      </div>
    );
  }

  return (
    <div className="nm2-transition-lab" data-open="true">
      <section
        id={regionId}
        role="region"
        aria-label="Laboratorio de transiciones"
        className="nm2-transition-lab__panel"
        onKeyDown={onKeyDown}
      >
        <div className="nm2-transition-lab__head">
          <strong>Laboratorio de transiciones</strong>
          <button
            type="button"
            className="nm2-transition-lab__button"
            aria-expanded="true"
            aria-controls={regionId}
            onClick={() => {
              restoreFocus.current = true;
              setOpen(false);
            }}
          >
            Minimizar
          </button>
        </div>

        <div className="nm2-transition-lab__row">
          <label htmlFor={targetId}>Destino</label>
          <select
            id={targetId}
            value={target}
            onChange={(event) => setTarget(event.target.value)}
          >
            <option value={TARGET_ALL}>Todas</option>
            {bands.map((band) => (
              <option key={band.id} value={band.id}>{band.id}</option>
            ))}
          </select>
        </div>

        <div className="nm2-transition-lab__variants" role="group" aria-label="Variante">
          {VARIANTS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="nm2-transition-lab__button"
              aria-pressed={variant === item.id}
              onClick={() => setVariant(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <Slider label="Intensidad" value={params.intensity} min={0} max={1.5} step={0.05}
          onChange={(v) => setParam("intensity", v)} />
        <Slider label="Velocidad" value={params.speed} min={0} max={2} step={0.05}
          onChange={(v) => setParam("speed", v)} />
        {showCell ? (
          <Slider label="Celda" value={params.cell} min={2} max={12} step={1}
            onChange={(v) => setParam("cell", v)} />
        ) : null}
        {showSpectrum ? (
          <Slider label="Espectro" value={params.spectrum} min={0} max={1} step={0.05}
            onChange={(v) => setParam("spectrum", v)} />
        ) : null}
        <Slider label="Altura de banda (px)"
          value={height ?? measuredHeight ?? 288} min={120} max={360} step={4}
          onChange={(v) => update({ height: v })} />
        <div className="nm2-transition-lab__row">
          <label htmlFor={flipId}>Invertir origen → destino</label>
          <input
            id={flipId}
            type="checkbox"
            checked={current.flip === true}
            onChange={(event) => update({ flip: event.target.checked })}
          />
        </div>

        <p className="nm2-transition-lab__group">Hero</p>
        <div className="nm2-transition-lab__row">
          <label htmlFor={heroFullbleedId}>A todo el viewport</label>
          <input
            id={heroFullbleedId}
            type="checkbox"
            checked={hero.fullbleed}
            onChange={(event) => setHero({ fullbleed: event.target.checked })}
          />
        </div>

        <p className="nm2-transition-lab__group">Composición</p>
        <div className="nm2-transition-lab__variants" role="group" aria-label="Arte de la sección org">
          {(["orb", "blueprint"] as const).map((art) => (
            <button
              key={art}
              type="button"
              className="nm2-transition-lab__button"
              aria-pressed={composition.orgArt === art}
              onClick={() => setComposition({ orgArt: art })}
            >
              {art === "orb" ? "Orbe" : "Blueprint"}
            </button>
          ))}
        </div>
        <div className="nm2-transition-lab__row">
          <label htmlFor={orbitalHeadingsId}>Titulares en Orbital</label>
          <input
            id={orbitalHeadingsId}
            type="checkbox"
            checked={composition.orbitalHeadings}
            onChange={(event) =>
              setComposition({ orbitalHeadings: event.target.checked })
            }
          />
        </div>
        <div className="nm2-transition-lab__variants" role="group" aria-label="Efecto de los titulares">
          <button
            type="button"
            className="nm2-transition-lab__button"
            aria-pressed={composition.heading === null}
            onClick={() => setComposition({ heading: null })}
          >
            Auto
          </button>
          {HEADING_EFFECTS.map((effect) => (
            <button
              key={effect.id}
              type="button"
              className="nm2-transition-lab__button"
              aria-pressed={composition.heading === effect.id}
              onClick={() => setComposition({ heading: effect.id })}
            >
              {effect.label}
            </button>
          ))}
        </div>

        <p className="nm2-transition-lab__readout">{readout}</p>
        <div className="nm2-transition-lab__actions">
          <button type="button" className="nm2-transition-lab__button" onClick={reset}>
            Restablecer
          </button>
          <button type="button" className="nm2-transition-lab__button" onClick={copy}>
            Copiar config
          </button>
          <span role="status" className="nm2-transition-lab__status">
            {copied === "ok" ? "Copiado" : copied === "error" ? "No disponible" : ""}
          </span>
        </div>
      </section>
    </div>
  );
}
