import type { WarpProps } from "@paper-design/shaders-react";

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
