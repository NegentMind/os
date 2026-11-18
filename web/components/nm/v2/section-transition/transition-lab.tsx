"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_PARAMS,
  VARIANTS,
  type TransitionParams,
  type TransitionVariant,
} from "@/components/nm/v2/section-transition/variants";
import type { HeadingEffect } from "@/components/nm/v2/animated-heading";

/*
 * TransitionLab — module split.
 *
 * This file is the LIGHT, publicly imported module: context, provider,
 * storage and the override hooks consumed by live components
 * (`useTransitionOverride` in SectionTransition, `useHeroLabConfig` in
 * HeroBackground, `useCompositionLabConfig` in AnimatedHeading/SystemStory)
 * plus the `TransitionLab` stub. It ships in the regular bundle.
 *
 * The panel UI lives in `transition-lab-panel.tsx` behind a
 * `next/dynamic({ ssr: false })` boundary: it is only fetched when the lab
 * is actually enabled (development or `?transitions=1`), so the lab's
 * markup never reaches the public bundle of regular visitors.
 */

export type BandConfig = {
  variant: TransitionVariant;
  params: TransitionParams;
  height: number | null;
  /** Lab-only: swap the band's from/to tones. */
  flip?: boolean;
};

/** Hero overrides owned by the lab: only the frame toggle survives — the
 *  background pool and the fullbleed default are shipped decisions. */
export type HeroLabConfig = {
  fullbleed: boolean;
};

/** Composition overrides owned by the lab: page scenes and heading effect. */
export type CompositionLabConfig = {
  /** Art plate of the #org system story. */
  orgArt: "orb" | "blueprint";
  /** Effect applied to every AnimatedHeading; null keeps each call site's. */
  heading: HeadingEffect | null;
  /** Orbital lettering is the shipped default; false restores animated type. */
  orbitalHeadings: boolean;
};

const DEFAULT_HERO: HeroLabConfig = {
  fullbleed: true,
};

const DEFAULT_COMPOSITION: CompositionLabConfig = {
  orgArt: "orb",
  heading: null,
  orbitalHeadings: true,
};

/* Exported for the lazily loaded panel; part of the internal lab contract. */
export const HEADING_EFFECTS: readonly { id: HeadingEffect; label: string }[] = [
  { id: "assemble", label: "Assemble" },
  { id: "focus", label: "Focus" },
  { id: "trace", label: "Trace" },
  { id: "decode", label: "Decode" },
];

type Band = { id: string; variant: TransitionVariant; height: number | null };
type Overrides = Record<string, BandConfig>;

export type LabContextValue = {
  enabled: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  target: string;
  setTarget: (target: string) => void;
  bands: readonly Band[];
  overrides: Overrides;
  resolve: (id: string) => BandConfig | undefined;
  register: (
    id: string,
    variant: TransitionVariant,
    height?: number | null,
  ) => () => void;
  update: (patch: Partial<BandConfig>) => void;
  setVariant: (variant: TransitionVariant) => void;
  reset: () => void;
  hero: HeroLabConfig;
  setHero: (patch: Partial<HeroLabConfig>) => void;
  composition: CompositionLabConfig;
  setComposition: (patch: Partial<CompositionLabConfig>) => void;
};

const STORAGE_KEY = "nm2-transition-lab";
/** Target key meaning "every band". Exported for the lazily loaded panel. */
export const TARGET_ALL = "*";

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
  const config: BandConfig = {
    variant: record.variant,
    params: { intensity, speed, cell, spectrum },
    height,
  };
  if (record.flip === true) config.flip = true;
  return config;
}

function toHeroConfig(value: unknown): HeroLabConfig {
  if (typeof value !== "object" || value === null) return DEFAULT_HERO;
  const record = value as Record<string, unknown>;
  return {
    // Fullbleed is the shipped default; only an explicit false re-frames it.
    fullbleed: record.fullbleed !== false,
  };
}

function isHeadingEffect(value: unknown): value is HeadingEffect {
  return HEADING_EFFECTS.some((effect) => effect.id === value);
}

function toCompositionConfig(value: unknown): CompositionLabConfig {
  if (typeof value !== "object" || value === null) return DEFAULT_COMPOSITION;
  const record = value as Record<string, unknown>;
  return {
    orgArt: record.orgArt === "blueprint" ? "blueprint" : "orb",
    heading: isHeadingEffect(record.heading) ? record.heading : null,
    // Orbital is the shipped default; only an explicit stored false opts out.
    orbitalHeadings: record.orbitalHeadings !== false,
  };
}

type Stored = {
  overrides: Overrides;
  target: string;
  open: boolean;
  hero: HeroLabConfig;
  composition: CompositionLabConfig;
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
      target: typeof record.target === "string" ? record.target : TARGET_ALL,
      open: record.open === true,
      hero: toHeroConfig(record.hero),
      composition: toCompositionConfig(record.composition),
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
  const [target, setTarget] = useState(TARGET_ALL);
  const [bands, setBands] = useState<readonly Band[]>([]);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [hero, setHeroState] = useState<HeroLabConfig>(DEFAULT_HERO);
  const [composition, setCompositionState] = useState<CompositionLabConfig>(
    DEFAULT_COMPOSITION,
  );

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
      setCompositionState(stored.composition);
    }
    setEnabled(true);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStored({ overrides, target, open, hero, composition });
  }, [hydrated, overrides, target, open, hero, composition]);

  // Mirror the headings mode on <html> so any heading renderer (and CSS)
  // can read it without the context. "orbital" is the shipped default —
  // the layout emits it server-side; the lab flips it to "sans".
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.dataset.headings =
      composition.orbitalHeadings ? "orbital" : "sans";
    return () => {
      document.documentElement.dataset.headings = "orbital";
    };
  }, [enabled, composition.orbitalHeadings]);

  const register = useCallback((
    id: string,
    variant: TransitionVariant,
    height: number | null = null,
  ) => {
    setBands((prev) => prev.some((b) => b.id === id)
      ? prev.map((b) => (b.id === id ? { id, variant, height } : b))
      : [...prev, { id, variant, height }]);
    return () => setBands((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const defaultFor = useCallback((key: string): BandConfig => {
    const base = key === TARGET_ALL ? bands[0] : bands.find((b) => b.id === key);
    const variant = base?.variant ?? "dither";
    return {
      variant,
      params: DEFAULT_PARAMS[variant],
      height: base?.height ?? null,
    };
  }, [bands]);

  const currentFor = useCallback((key: string): BandConfig => {
    return overrides[key]
      ?? (key !== TARGET_ALL ? overrides[TARGET_ALL] : undefined)
      ?? defaultFor(key);
  }, [overrides, defaultFor]);

  const resolve = useCallback(
    (id: string) => overrides[id] ?? overrides[TARGET_ALL],
    [overrides],
  );

  const update = useCallback((patch: Partial<BandConfig>) => {
    setOverrides((prev) => {
      const current = prev[target]
        ?? (target !== TARGET_ALL ? prev[TARGET_ALL] : undefined)
        ?? defaultFor(target);
      const next = { ...current, ...patch };
      return target === TARGET_ALL ? { [TARGET_ALL]: next } : { ...prev, [target]: next };
    });
  }, [target, defaultFor]);

  const setVariant = useCallback((variant: TransitionVariant) => {
    update({ variant, params: DEFAULT_PARAMS[variant] });
  }, [update]);

  const reset = useCallback(() => {
    setOverrides((prev) => {
      if (target === TARGET_ALL) return {};
      const next = { ...prev };
      delete next[target];
      return next;
    });
  }, [target]);

  const setHero = useCallback((patch: Partial<HeroLabConfig>) => {
    setHeroState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setComposition = useCallback((patch: Partial<CompositionLabConfig>) => {
    setCompositionState((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<LabContextValue>(() => ({
    enabled, open, setOpen, target, setTarget, bands, overrides,
    resolve, register, update, setVariant, reset, hero, setHero,
    composition, setComposition,
  }), [enabled, open, target, bands, overrides, resolve, register, update,
    setVariant, reset, hero, setHero, composition, setComposition]);

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
  height: number | null = null,
): BandConfig | undefined {
  const ctx = useContext(LabContext);
  const register = ctx?.register;
  useEffect(
    () => register?.(id, variant, height),
    [register, id, variant, height],
  );
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

/**
 * Lab-controlled composition overrides (scene art, heading effects). Null
 * outside the provider or when the lab is disabled, so every consumer keeps
 * its own defaults.
 */
export function useCompositionLabConfig(): CompositionLabConfig | null {
  const ctx = useContext(LabContext);
  return ctx?.enabled ? ctx.composition : null;
}

/* Internal contract for the lazily loaded panel — not a public API. */
export function useLabContext(): LabContextValue | null {
  return useContext(LabContext);
}

/* Internal: band config under edit in the panel. Never null inside the
 *  provider (the target always resolves), but the panel still guards. */
export function useCurrentBand(): BandConfig | null {
  return useContext(CurrentContext);
}

const TransitionLabPanel = dynamic(
  () =>
    import(
      "@/components/nm/v2/section-transition/transition-lab-panel"
    ).then((module) => module.TransitionLabPanel),
  { ssr: false },
);

/*
 * Stub boundary: the panel chunk is only requested once the lab is actually
 * enabled, so production visitors never download the dev UI.
 */
export function TransitionLab() {
  const ctx = useLabContext();
  if (!ctx?.enabled) return null;
  return <TransitionLabPanel />;
}
