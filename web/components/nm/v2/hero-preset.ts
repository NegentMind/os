import type { WarpPattern, WarpProps } from "@paper-design/shaders-react";

/**
 * Orbital / strata-01. Single source for live art and frozen exports.
 * Capture /en/design-system/art at 1920 × 1080, speed 0, frame 24000.
 * Colors are the approved spectrum, not a library preset.
 */
export const HERO_ART = Object.freeze({
  id: "orbital-strata-01",
  package: "@paper-design/shaders@0.0.82",
  width: 1920,
  height: 1080,
  params: {
    colors: [
      "#101C27",
      "#5BADA0",
      "#465DCF",
      "#965CCB",
      "#DC5E89",
      "#D9A45E",
      "#B7CDD7",
      "#101C27",
    ],
    shape: "stripes",
    shapeScale: 0.38,
    proportion: 0.52,
    softness: 0.54,
    distortion: 0.17,
    swirl: 0.72,
    swirlIterations: 5,
    scale: 2.45,
    rotation: -32,
    offsetX: 0.12,
    offsetY: -0.08,
    frame: 24000,
    speed: 0.42,
    minPixelRatio: 1,
    maxPixelCount: 1920 * 1080,
  } satisfies WarpProps,
});

export type HeroArtPreset = {
  readonly id: string;
  readonly params: Readonly<WarpProps>;
};

/**
 * Monochrome contrast variant for quiet sections (e.g. home #contribute):
 * same motion grammar, carbon-to-silver ramp, different base pattern.
 */
export const HERO_ART_ALT: HeroArtPreset = Object.freeze({
  id: "orbital-contrast-01",
  params: {
    ...HERO_ART.params,
    colors: [
      "#0A0C0F",
      "#1B2129",
      "#2E3641",
      "#4A5462",
      "#68737F",
      "#262C35",
      "#0A0C0F",
    ],
    shape: "checks",
    shapeScale: 0.5,
    softness: 0.62,
    distortion: 0.12,
    swirl: 0.5,
    speed: 0.3,
    rotation: -18,
  } satisfies WarpProps,
});

/** Clone the canonical art with another base pattern. */
export function heroWarpPreset(shape: WarpPattern): HeroArtPreset {
  return Object.freeze({
    id: `${HERO_ART.id}--${shape}`,
    params: { ...HERO_ART.params, shape },
  });
}

/**
 * The hero's live-art pool: one of these warps is picked at random on every
 * page load (no persistence). Shared references, never re-cloned.
 */
export const HERO_WARP_PRESETS = Object.freeze({
  "warp-stripes": HERO_ART,
  "warp-checks": heroWarpPreset("checks"),
  "warp-edge": heroWarpPreset("edge"),
});

export const HERO_WARP_IDS = Object.freeze(
  Object.keys(HERO_WARP_PRESETS) as (keyof typeof HERO_WARP_PRESETS)[],
);

export type HeroWarpId = (typeof HERO_WARP_IDS)[number];

/**
 * The spectrum hues that read as ink on the hero's dark art — the two
 * `#101C27` bookends of the palette are the base, not a text color.
 */
export const HERO_SPECTRUM_TEXT: readonly string[] = Object.freeze(
  HERO_ART.params.colors.slice(1, -1),
);
