"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  DEFAULT_PARAMS,
  VARIANTS,
  type TransitionParams,
  type TransitionVariant,
} from "@/components/nm/v2/section-transition/variants";
import {
  HERO_BACKGROUNDS,
  isHeroBackgroundVariant,
  type HeroBackgroundVariant,
} from "@/components/nm/v2/hero-preset";

export type BandConfig = {
  variant: TransitionVariant;
  params: TransitionParams;
  height: number | null;
};

/** Hero overrides owned by the lab: frame and animated background. */
export type HeroLabConfig = {
  fullbleed: boolean;
  background: HeroBackgroundVariant;
};

const DEFAULT_HERO: HeroLabConfig = {
  fullbleed: false,
  background: "warp-stripes",
};

type Band = { id: string; variant: TransitionVariant };
type Overrides = Record<string, BandConfig>;

type LabContextValue = {
  enabled: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  target: string;
  setTarget: (target: string) => void;
  bands: readonly Band[];
  overrides: Overrides;
  resolve: (id: string) => BandConfig | undefined;
  register: (id: string, variant: TransitionVariant) => () => void;
  update: (patch: Partial<BandConfig>) => void;
  setVariant: (variant: TransitionVariant) => void;
  reset: () => void;
  hero: HeroLabConfig;
  setHero: (patch: Partial<HeroLabConfig>) => void;
};

const STORAGE_KEY = "nm2-transition-lab";
const ALL = "*";

const LabContext = createContext<LabContextValue | null>(null);
const CurrentContext = createContext<BandConfig | null>(null);

function isVariant(value: unknown): value is TransitionVariant {
  return VARIANTS.some((v) => v.id === value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function toBandConfig(value: unknown): BandConfig | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  const params = record.params as Record<string, unknown> | undefined;
  if (!isVariant(record.variant) || !params) return null;
  const { intensity, speed, cell, spectrum } = params;
  if (
    !isFiniteNumber(intensity) || !isFiniteNumber(speed)
    || !isFiniteNumber(cell) || !isFiniteNumber(spectrum)
  ) {
    return null;
  }
  const height = isFiniteNumber(record.height) ? record.height : null;
  return {
    variant: record.variant,
    params: { intensity, speed, cell, spectrum },
    height,
  };
}

function toHeroConfig(value: unknown): HeroLabConfig {
  if (typeof value !== "object" || value === null) return DEFAULT_HERO;
  const record = value as Record<string, unknown>;
  return {
    fullbleed: record.fullbleed === true,
    background: isHeroBackgroundVariant(record.background)
      ? record.background
      : DEFAULT_HERO.background,
  };
}

type Stored = {
  overrides: Overrides;
  target: string;
  open: boolean;
  hero: HeroLabConfig;
};

function readStored(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const record = parsed as Record<string, unknown>;
    const overrides: Overrides = {};
    if (typeof record.overrides === "object" && record.overrides !== null) {
      for (const [key, value] of Object.entries(record.overrides)) {
        const config = toBandConfig(value);
        if (config) overrides[key] = config;
      }
    }
    return {
      overrides,
      target: typeof record.target === "string" ? record.target : ALL,
      open: record.open === true,
      hero: toHeroConfig(record.hero),
    };
  } catch {
    return null;
  }
}

function writeStored(value: Stored) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode); the lab still works in memory.
  }
}

export function TransitionLabProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(ALL);
  const [bands, setBands] = useState<readonly Band[]>([]);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [hero, setHeroState] = useState<HeroLabConfig>(DEFAULT_HERO);

  useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get("transitions") === "1";
    const active = process.env.NODE_ENV === "development" || flag;
    if (!active) return;
    const stored = readStored();
    if (stored) {
      setOverrides(stored.overrides);
      setTarget(stored.target);
      setOpen(stored.open);
      setHeroState(stored.hero);
    }
    setEnabled(true);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStored({ overrides, target, open, hero });
  }, [hydrated, overrides, target, open, hero]);

  const register = useCallback((id: string, variant: TransitionVariant) => {
    setBands((prev) => prev.some((b) => b.id === id)
      ? prev.map((b) => (b.id === id ? { id, variant } : b))
      : [...prev, { id, variant }]);
    return () => setBands((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const defaultFor = useCallback((key: string): BandConfig => {
    const base = key === ALL ? bands[0] : bands.find((b) => b.id === key);
    const variant = base?.variant ?? "dither";
    return { variant, params: DEFAULT_PARAMS[variant], height: null };
  }, [bands]);

  const currentFor = useCallback((key: string): BandConfig => {
    return overrides[key]
      ?? (key !== ALL ? overrides[ALL] : undefined)
      ?? defaultFor(key);
  }, [overrides, defaultFor]);

  const resolve = useCallback(
    (id: string) => overrides[id] ?? overrides[ALL],
    [overrides],
  );

  const update = useCallback((patch: Partial<BandConfig>) => {
    setOverrides((prev) => {
      const current = prev[target]
        ?? (target !== ALL ? prev[ALL] : undefined)
        ?? defaultFor(target);
      const next = { ...current, ...patch };
      return target === ALL ? { [ALL]: next } : { ...prev, [target]: next };
    });
  }, [target, defaultFor]);

  const setVariant = useCallback((variant: TransitionVariant) => {
    update({ variant, params: DEFAULT_PARAMS[variant] });
  }, [update]);

  const reset = useCallback(() => {
    setOverrides((prev) => {
      if (target === ALL) return {};
      const next = { ...prev };
      delete next[target];
      return next;
    });
  }, [target]);

  const setHero = useCallback((patch: Partial<HeroLabConfig>) => {
    setHeroState((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<LabContextValue>(() => ({
    enabled, open, setOpen, target, setTarget, bands, overrides,
    resolve, register, update, setVariant, reset, hero, setHero,
  }), [enabled, open, target, bands, overrides, resolve, register, update,
    setVariant, reset, hero, setHero]);

  const currentConfig = useMemo(() => currentFor(target), [currentFor, target]);

  return (
    <LabContext.Provider value={value}>
      <CurrentContext.Provider value={currentConfig}>{children}</CurrentContext.Provider>
    </LabContext.Provider>
  );
}

export function useTransitionOverride(
  id: string,
  variant: TransitionVariant,
): BandConfig | undefined {
  const ctx = useContext(LabContext);
  const register = ctx?.register;
  useEffect(() => register?.(id, variant), [register, id, variant]);
  return ctx?.resolve(id);
}

/**
 * Lab-controlled hero overrides. Null outside the provider or when the lab is
 * disabled, so the hero always falls back to its canonical layout.
 */
export function useHeroLabConfig(): HeroLabConfig | null {
  const ctx = useContext(LabContext);
  return ctx?.enabled ? ctx.hero : null;
}

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

export function TransitionLab() {
  const ctx = useContext(LabContext);
  const current = useContext(CurrentContext);
  const pill = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const targetId = useId();
  const regionId = useId();
  const [copied, setCopied] = useState<"idle" | "ok" | "error">("idle");
  const heroFullbleedId = useId();
  const open = ctx?.open ?? false;

  useEffect(() => {
    if (!open && restoreFocus.current) {
      restoreFocus.current = false;
      pill.current?.focus();
    }
  }, [open]);

  if (!ctx || !ctx.enabled || !current) return null;
  const { setOpen, target, setTarget, bands, update, setVariant, reset, hero, setHero } = ctx;
  const { variant, params, height } = current;
  const showCell = variant === "dither" || variant === "blocks";
  const showSpectrum = variant === "chromatic" || variant === "iridescent";
  const setParam = (key: keyof TransitionParams, value: number) =>
    update({ params: { ...params, [key]: value } });
  const readout = `${target} · ${variant} · i ${params.intensity} · v ${params.speed}`
    + `${showCell ? ` · c ${params.cell}` : ""}${showSpectrum ? ` · s ${params.spectrum}` : ""}`
    + ` · h ${height ?? "auto"}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify({ target, variant, params, height }, null, 2),
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
    return (
      <div className="nm2-transition-lab" data-open="false">
        <button
          ref={pill}
          type="button"
          className="nm2-transition-lab__pill"
          aria-expanded="false"
          aria-controls={regionId}
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
            <option value="*">Todas</option>
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
        <Slider label="Altura de banda (px)" value={height ?? 240} min={120} max={360} step={4}
          onChange={(v) => update({ height: v })} />

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
        <div className="nm2-transition-lab__variants" role="group" aria-label="Fondo del hero">
          {HERO_BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              type="button"
              className="nm2-transition-lab__button"
              aria-pressed={hero.background === bg.id}
              onClick={() => setHero({ background: bg.id })}
            >
              {bg.label}
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
