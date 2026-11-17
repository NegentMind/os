/**
 * First-party Orbital exports. Node 26 + ImageMagick.
 * No browser/server installation or startup is performed.
 *
 * node brand/orbital/export-assets.mjs grain
 * node brand/orbital/export-assets.mjs plate
 * node brand/orbital/export-assets.mjs export <captured-1920x1080-art-plate.png>
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import { execFileSync } from "node:child_process";
import { HERO_ART } from "../../web/components/nm/v2/hero-preset.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const publicDir = join(root, "web/public/brand");
const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const check = Buffer.alloc(4);
  check.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, check]);
}

function grain() {
  const size = 192;
  const bytes = Buffer.alloc((size + 1) * size);
  let state = 0x4e4d3031;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Reproducible first-party surface grain, not a runtime random effect.
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      bytes[y * (size + 1) + x + 1] = state >>> 24;
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 0;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", header),
    pngChunk("tEXt", Buffer.from("Comment\0Origin: first-party seeded xorshift32 grain; seed 0x4e4d3031; Orbital strata-01")),
    pngChunk("IDAT", deflateSync(bytes)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(join(here, "orbital-grain.png"), png);
  copyFileSync(join(here, "orbital-grain.png"), join(publicDir, "orbital-grain.png"));
}

function vector(symbol, file, title) {
  const original = readFileSync(join(here, "orbital-source.svg"), "utf8");
  const match = original.match(new RegExp(`<symbol id="${symbol}" viewBox="([^"]+)">([\\s\\S]*?)<\\/symbol>`));
  if (!match) throw new Error(`Missing original Orbital symbol: ${symbol}`);
  const body = match[2].replaceAll('fill="var(--logo-dot)"', 'fill="currentColor"');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${match[1]}" fill="none" color="#F1F3F5" role="img" aria-labelledby="title"><title id="title">${title}</title>${body}</svg>\n`;
  writeFileSync(join(here, file), svg);
  copyFileSync(join(here, file), join(publicDir, file));
  return { body, viewBox: match[1] };
}

function plate() {
  // A file:// capture path is available when the shared Next root is being
  // edited. This uses Paper's actual Warp fragment and public ShaderMount,
  // with the same uniform mapping as its React Warp, not a second artwork.
  const html = `<!doctype html>
<html lang="en"><meta charset="utf-8"><title>Orbital frozen Paper Warp plate</title>
<style>
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#101C27}
#plate,.grain{position:fixed;inset:0;pointer-events:none}
#plate{isolation:isolate}
.grain{background:url("./orbital-grain.png") 0 0/192px 192px;opacity:.2;mix-blend-mode:soft-light}
</style>
<div id="plate"></div><div class="grain"></div>
<script type="module">
import {ShaderMount} from "../../web/node_modules/@paper-design/shaders/dist/shader-mount.js";
import {warpFragmentShader, WarpPatterns} from "../../web/node_modules/@paper-design/shaders/dist/shaders/warp.js";
import {defaultPatternSizing, ShaderFitOptions} from "../../web/node_modules/@paper-design/shaders/dist/shader-sizing.js";
import {getShaderColorFromString} from "../../web/node_modules/@paper-design/shaders/dist/get-shader-color-from-string.js";
import {getShaderNoiseTexture} from "../../web/node_modules/@paper-design/shaders/dist/get-shader-noise-texture.js";
const p={...defaultPatternSizing,...${JSON.stringify(HERO_ART.params)}};
const noise=getShaderNoiseTexture(); await noise.decode();
window.orbitalMount=new ShaderMount(document.querySelector("#plate"),warpFragmentShader,{
u_colors:p.colors.map(getShaderColorFromString),u_colorsCount:p.colors.length,
u_proportion:p.proportion,u_softness:p.softness,u_distortion:p.distortion,
u_swirl:p.swirl,u_swirlIterations:p.swirlIterations,u_shapeScale:p.shapeScale,
u_shape:WarpPatterns[p.shape],u_noiseTexture:noise,
u_scale:p.scale,u_rotation:p.rotation,u_fit:ShaderFitOptions[p.fit],
u_offsetX:p.offsetX,u_offsetY:p.offsetY,u_originX:p.originX,u_originY:p.originY,
u_worldWidth:p.worldWidth,u_worldHeight:p.worldHeight
},{preserveDrawingBuffer:true},0,p.frame,p.minPixelRatio,p.maxPixelCount);
await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
document.body.dataset.artReady="true";
</script></html>\n`;
  writeFileSync(join(here, "capture-plate.html"), html);
}

function exportAssets(rawArg) {
  if (!rawArg) throw new Error("Pass the actual captured art plate PNG.");
  const raw = resolve(rawArg);
  const dimensions = execFileSync("magick", ["identify", "-format", "%wx%h", raw], { encoding: "utf8" });
  if (dimensions !== `${HERO_ART.width}x${HERO_ART.height}`) {
    throw new Error(`Art plate must be ${HERO_ART.width}x${HERO_ART.height}, got ${dimensions}`);
  }
  copyFileSync(raw, join(here, "orbital-frame.png"));
  const wordmark = vector("wm-orbital", "orbital-wordmark.svg", "Negent Mind");
  const monogram = vector("mn-orbital", "orbital-monogram.svg", "Negent Mind");
  const provenance = `Origin: first-party ${HERO_ART.id}; actual Paper Warp frozen frame ${HERO_ART.params.frame}; ${HERO_ART.package}; source sha256 ${sha(raw)}`;
  const run = (args) => execFileSync("magick", args, { stdio: "inherit" });
  const poster = join(here, "orbital-poster.webp");
  run([raw, "-set", "comment", provenance, "-quality", "92", poster]);
  copyFileSync(poster, join(publicDir, "orbital-poster.webp"));

  function compose(file, width, height, mark, markWidth, markHeight) {
    run([
      raw, "-resize", `${width}x${height}^`, "-gravity", "center",
      "-extent", `${width}x${height}`,
      "-fill", "#07080999", "-draw", `rectangle 0,0 ${width},${height}`,
      "(", "-background", "none", join(here, mark), "-resize", `${markWidth}x${markHeight}`, ")",
      "-gravity", "center", "-compose", "over", "-composite",
      "-set", "comment", provenance, join(here, file),
    ]);
    copyFileSync(join(here, file), join(publicDir, file));
  }
  compose("orbital-avatar.png", 512, 512, "orbital-monogram.svg", 384, 256);
  compose("orbital-banner.png", 2400, 800, "orbital-wordmark.svg", 2080, 299);
  compose("orbital-og.png", 1200, 630, "orbital-wordmark.svg", 1040, 150);
  copyFileSync(join(here, "orbital-og.png"), join(root, "web/public/og.png"));

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#070809"/><svg x="5" y="14" width="54" height="36" viewBox="${monogram.viewBox}" color="#F1F3F5">${monogram.body}</svg></svg>\n`;
  writeFileSync(join(here, "orbital-icon.svg"), icon);
  copyFileSync(join(here, "orbital-icon.svg"), join(root, "web/app/icon.svg"));
  copyFileSync(join(here, "orbital-icon.svg"), join(publicDir, "orbital-icon.svg"));

  for (const file of ["LICENSE", "NOTICE"]) {
    copyFileSync(
      join(root, `web/node_modules/@paper-design/shaders-react/${file}`),
      join(here, `PAPER-${file}`),
    );
  }
  const exported = [
    "orbital-frame.png", "orbital-grain.png", "orbital-poster.webp",
    "orbital-wordmark.svg", "orbital-monogram.svg", "orbital-icon.svg",
    "orbital-avatar.png", "orbital-banner.png", "orbital-og.png",
  ];
  const manifest = {
    ...HERO_ART,
    capture: {
      renderer: "capture-plate.html: public ShaderMount + maintained warpFragmentShader; identical HeroWarp uniform mapping",
      letteringSource: "brand/orbital/orbital-source.svg",
      developmentRoute: "/en/design-system/art",
      viewport: [HERO_ART.width, HERO_ART.height],
      speed: 0,
      grain: { seed: "0x4e4d3031", size: 192, opacity: 0.2, blend: "soft-light" },
      source: "Orbital original SVG geometry; first-party Paper Warp art direction",
      rawSha256: sha(raw),
    },
    wordmarkViewBox: wordmark.viewBox,
    exports: Object.fromEntries(exported.map((file) => [file, sha(join(here, file))])),
  };
  writeFileSync(join(here, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

if (process.argv[2] === "grain") grain();
else if (process.argv[2] === "plate") plate();
else if (process.argv[2] === "export") exportAssets(process.argv[3]);
else throw new Error("Use grain, plate, or export <captured-art-plate.png>.");
