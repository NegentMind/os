import { HERO_ART } from "@/components/nm/v2/hero-preset";

export type TransitionVariant =
  | "dither"
  | "blocks"
  | "tear"
  | "chromatic"
  | "iridescent";

export type TransitionParams = {
  intensity: number;
  speed: number;
  cell: number;
  spectrum: number;
};

type Rgb = [number, number, number];

export type RenderInput = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  time: number;
  from: Rgb;
  to: Rgb;
  params: TransitionParams;
  progress: number;
  pointerX: number | null;
};

export const VARIANTS: readonly {
  id: TransitionVariant;
  label: string;
  smooth: boolean;
}[] = [
  { id: "dither", label: "Dither", smooth: false },
  { id: "blocks", label: "Bloques", smooth: false },
  { id: "tear", label: "Desgarre", smooth: false },
  { id: "chromatic", label: "Cromática", smooth: true },
  { id: "iridescent", label: "Iridiscente", smooth: true },
];

export const DEFAULT_PARAMS: Record<TransitionVariant, TransitionParams> = {
  dither: { intensity: 1, speed: 1, cell: 2, spectrum: 0 },
  blocks: { intensity: 1, speed: 1, cell: 3, spectrum: 0 },
  tear: { intensity: 1, speed: 1, cell: 3, spectrum: 0 },
  chromatic: { intensity: 1, speed: 1, cell: 3, spectrum: 0.55 },
  iridescent: { intensity: 1, speed: 1, cell: 3, spectrum: 1 },
};

const BAYER_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
] as const;

const LEVELS = 6;
const LIFT_RANGE = 0.12;
const BULGE_SIGMA = 0.08;
const BULGE_AMPLITUDE = 0.07;

function parseHex(hex: string): Rgb {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

const PALETTE: readonly Rgb[] = HERO_ART.params.colors.map(parseHex);

function spectrumAt(t: number): Rgb {
  const wrapped = t - Math.floor(t);
  const position = wrapped * (PALETTE.length - 1);
  const index = Math.min(PALETTE.length - 2, Math.floor(position));
  const k = position - index;
  const a = PALETTE[index];
  const b = PALETTE[index + 1];
  return [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k,
  ];
}

/** Deterministic per-cell/frame grain; never Math.random. */
function hash(x: number, y: number, z: number): number {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)
    + Math.imul(z | 0, 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function smoothstep(value: number): number {
  return value * value * (3 - 2 * value);
}

function write(data: Uint8ClampedArray, index: number, r: number, g: number, b: number) {
  data[index] = r;
  data[index + 1] = g;
  data[index + 2] = b;
  data[index + 3] = 255;
}

function writeMix(
  data: Uint8ClampedArray,
  index: number,
  from: Rgb,
  to: Rgb,
  k: number,
) {
  write(
    data,
    index,
    from[0] + (to[0] - from[0]) * k,
    from[1] + (to[1] - from[1]) * k,
    from[2] + (to[2] - from[2]) * k,
  );
}

/** Per-column boundary bulge; zero without a pointer. */
function bulgeColumns(width: number, intensity: number, pointerX: number | null) {
  const columns = new Float32Array(width);
  if (pointerX === null) return columns;
  for (let x = 0; x < width; x += 1) {
    const d = x / Math.max(1, width - 1) - pointerX;
    columns[x] = BULGE_AMPLITUDE * intensity
      * Math.exp(-(d * d) / (2 * BULGE_SIGMA * BULGE_SIGMA));
  }
  return columns;
}

function renderDither(input: RenderInput, bulge: Float32Array, lift: number) {
  const { data, width, height, time, from, to, params } = input;
  const cell = Math.max(1, Math.round(params.cell));
  const intensity = params.intensity;
  for (let y = 0; y < height; y += 1) {
    const ny = y / Math.max(1, height - 1);
    const edge = Math.sin(Math.PI * ny);
    const cy = Math.floor(y / cell);
    for (let x = 0; x < width; x += 1) {
      const cx = Math.floor(x / cell);
      const nx = (cx * cell) / Math.max(1, width - 1);
      const wave = (Math.sin(nx * 9 + time * 0.8) * 0.08
        + Math.cos(nx * 23 - time * 0.5) * 0.04) * intensity;
      const scatter = hash(cx, cy, 0);
      const noise = (scatter - 0.5) * 0.28 * intensity;
      const local = clamp01(
        ny + (-lift + bulge[x] + wave + noise) * edge,
      );
      let k: number;
      if (local < 0.15) k = 0;
      else if (local > 0.88) k = 1;
      else {
        const adjusted = (local - 0.15) / 0.73;
        const threshold = BAYER_8[cy % 8][cx % 8] / 64;
        if (adjusted > threshold) {
          k = scatter > 0.86 && adjusted < 0.75 ? 0.55 : 1;
        } else {
          k = scatter > 0.88 && adjusted > 0.25 ? 0.12 : 0;
        }
      }
      writeMix(data, (y * width + x) * 4, from, to, k);
    }
  }
}

function renderBlocks(input: RenderInput, bulge: Float32Array, lift: number) {
  const { data, width, height, time, from, to, params } = input;
  const block = Math.max(1, Math.round(params.cell * 2));
  const intensity = params.intensity;
  const step = Math.floor(time * 2);
  for (let y = 0; y < height; y += 1) {
    const ny = y / Math.max(1, height - 1);
    const edge = Math.sin(Math.PI * ny);
    const br = Math.floor(y / block);
    const glitch = hash(br, 7, step);
    const rowShift = glitch > 0.82
      ? Math.round((hash(br, 11, step) - 0.5) * 8 * intensity)
      : 0;
    for (let x = 0; x < width; x += 1) {
      const bc = Math.floor(x / block) + rowShift;
      const shift = (hash(bc, br, step) - 0.5) * 0.45 * intensity;
      const local = clamp01(ny + (-lift + bulge[x] + shift) * edge);
      const level = Math.min(LEVELS - 1, Math.floor(local * LEVELS));
      writeMix(data, (y * width + x) * 4, from, to, level / (LEVELS - 1));
    }
  }
}

function renderTear(input: RenderInput, bulge: Float32Array, lift: number) {
  const { data, width, height, time, from, to, params } = input;
  const intensity = params.intensity;
  const shard = 3;
  for (let y = 0; y < height; y += 1) {
    const ny = y / Math.max(1, height - 1);
    const edge = Math.sin(Math.PI * ny);
    const cy = Math.floor(y / shard);
    for (let x = 0; x < width; x += 1) {
      const cx = Math.floor(x / shard);
      const nx = x / Math.max(1, width - 1);
      const jagged1 = Math.sin(nx * 14 + time * 0.3) * 0.14;
      const mod = (nx * 17) % 1;
      const jagged2 = Math.abs(mod - 0.5) * 0.32;
      const micro = hash(cx, cy, 0) * 0.12;
      const tearLine = 0.42 + (jagged1 + jagged2 + micro) * intensity
        + (lift - bulge[x]) * edge;
      const dist = ny - tearLine;
      let k: number;
      if (dist < -0.06) k = 0;
      else if (dist > 0.08) k = 1;
      else {
        const edgeNorm = (dist + 0.06) / 0.14;
        k = Math.max(0, Math.min(LEVELS - 1, Math.floor(edgeNorm * LEVELS)))
          / (LEVELS - 1);
      }
      writeMix(data, (y * width + x) * 4, from, to, k);
    }
  }
}

function renderChromatic(input: RenderInput, bulge: Float32Array, lift: number) {
  const { data, width, height, time, from, to, params } = input;
  const intensity = params.intensity;
  const spectrum = params.spectrum;
  const sharpness = 9.5;
  for (let y = 0; y < height; y += 1) {
    const ny = y / Math.max(1, height - 1);
    const envelope = Math.sin(ny * Math.PI);
    for (let x = 0; x < width; x += 1) {
      const nx = x / Math.max(1, width - 1);
      const ty = ny + (-lift + bulge[x]) * envelope;
      const wave = (Math.sin(nx * 7 + time * 1.1) * 0.14
        + Math.cos(nx * 15 - time * 0.75) * 0.05) * envelope * intensity;
      const center = 0.5 + wave;
      const spread = 0.065 * envelope * Math.max(0.2, intensity);
      const sR = smoothstep(clamp01(0.5 + (ty - (center - spread)) * sharpness));
      const sG = smoothstep(clamp01(0.5 + (ty - center) * sharpness));
      const sB = smoothstep(clamp01(0.5 + (ty - (center + spread)) * sharpness));
      const base = ny * (1 - envelope);
      let r = from[0] + (to[0] - from[0]) * (base + sR * envelope);
      let g = from[1] + (to[1] - from[1]) * (base + sG * envelope);
      let b = from[2] + (to[2] - from[2]) * (base + sB * envelope);
      const fringe = Math.abs(sB - sR) * spectrum;
      if (fringe > 0) {
        const tint = spectrumAt(nx * 0.6 + sG * 0.5 + time * 0.05);
        r += (tint[0] - r) * fringe;
        g += (tint[1] - g) * fringe;
        b += (tint[2] - b) * fringe;
      }
      write(data, (y * width + x) * 4, r, g, b);
    }
  }
}

function renderIridescent(input: RenderInput, bulge: Float32Array, lift: number) {
  const { data, width, height, time, from, to, params } = input;
  const intensity = params.intensity;
  const frame = Math.floor(time * 12);
  for (let y = 0; y < height; y += 1) {
    const ny = y / Math.max(1, height - 1);
    const envelope = Math.sin(ny * Math.PI);
    const mixBase = Math.pow(envelope, 1.4) * 0.78 * params.spectrum;
    for (let x = 0; x < width; x += 1) {
      const nx = x / Math.max(1, width - 1);
      const ty = clamp01(ny + (-lift + bulge[x]) * envelope);
      const warp1 = Math.sin(nx * 5.2 + ny * 3 + time * 0.65) * intensity;
      const warp2 = Math.cos(nx * 3.8 - ny * 4.2 + warp1 * 1.35 - time * 0.45)
        * intensity;
      const phase = nx * 1.9 + ny * 1.2 + warp1 * 0.38 + warp2 * 0.28
        + time * 0.15;
      const irid = spectrumAt(phase);
      const k = smoothstep(ty);
      const grain = (hash(x, y, frame) - 0.5) * 34 * envelope * intensity;
      const r = (from[0] + (to[0] - from[0]) * k) * (1 - mixBase)
        + irid[0] * mixBase + grain;
      const g = (from[1] + (to[1] - from[1]) * k) * (1 - mixBase)
        + irid[1] * mixBase + grain;
      const b = (from[2] + (to[2] - from[2]) * k) * (1 - mixBase)
        + irid[2] * mixBase + grain;
      write(data, (y * width + x) * 4, r, g, b);
    }
  }
}

export function renderVariant(variant: TransitionVariant, input: RenderInput): void {
  const lift = (input.progress - 0.5) * 2 * LIFT_RANGE * input.params.intensity;
  const bulge = bulgeColumns(input.width, input.params.intensity, input.pointerX);
  if (variant === "dither") renderDither(input, bulge, lift);
  else if (variant === "blocks") renderBlocks(input, bulge, lift);
  else if (variant === "tear") renderTear(input, bulge, lift);
  else if (variant === "chromatic") renderChromatic(input, bulge, lift);
  else renderIridescent(input, bulge, lift);
}
