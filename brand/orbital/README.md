# Orbital — Strata 01

First-party Negent Mind identity assets for the approved carbon/silver website.
These are new exports, not a modification or publication of the frozen GitHub
profile or Remotion identity.

## Source and provenance

- **Lettering:** the original geometric Orbital paths are frozen in the versioned
  [orbital-source.svg](orbital-source.svg). The exporter reads this file directly,
  with no dependency on ignored specimen sources. No font substitution, redrawing,
  distorted aspect ratios or cropped letters.
- **Art:** the maintained `warpFragmentShader` and public `ShaderMount` API from
  **`@paper-design/shaders@0.0.82`**. The live `HeroWarp` adapter owns asynchronous
  noise decoding, construction, speed updates and disposal; it does not use the
  React `Warp` initializer. Source:
  [Paper Shaders](https://github.com/paper-design/shaders).
- **Preset authority:** `web/components/nm/v2/hero-preset.ts` (`HERO_ART`).
  The live hero, development capture route and exporter read this same object.
  [manifest.json](manifest.json) records parameters, capture dimensions,
  library version, frame, grain settings and SHA-256 hashes. Its preset speed
  is the live motion setting; the frozen capture always uses `capture.speed=0`.
  Vector hashes identify the LF-normalized exports committed here.
- **Frozen plate:** [orbital-frame.png](orbital-frame.png), captured from
  [capture-plate.html](capture-plate.html) at **1920 × 1080**, `speed=0`,
  `frame=24000`. This local, text-free graphics renderer uses Paper's actual
  `warpFragmentShader` and public `ShaderMount`, with the same uniform mapping
  as React `Warp` and parameters read directly from `HERO_ART`. It is not an
  independently painted approximation. The equivalent development-only
  `/en/design-system/art` route has no text, is noindex, and returns 404 outside
  development. The file renderer avoids depending on a partially edited root
  layout during parallel implementation.
- **Grain:** a first-party 192 × 192 grayscale texture generated deterministically
  with xorshift32 seed `0x4e4d3031`, applied at 20% soft-light to the plate.
  There is no runtime random loader or extra GPU effect.

The flowing strata are an original native adaptation of the expressive
Mondragon2 art direction. No Framer HTML, runtime, analytics, third-party
lettering, images or scripts are shipped. **Shader behavior is not claimed to
be identical to the Framer reference.**

## Frozen spectrum

| Role | Hex |
| --- | --- |
| Deep ink | `#101C27` |
| Teal | `#5BADA0` |
| Blue | `#465DCF` |
| Violet | `#965CCB` |
| Rose | `#DC5E89` |
| Amber | `#D9A45E` |
| Ice | `#B7CDD7` |

The six expressive colors appear in this order, between deep ink at both ends.
They match the foundation's `--nm2-spectrum-*` tokens in `web/app/orbital.css`;
they are not action/button colors. Functional website colors remain neutral.

## Export inventory

| Source in this directory | Size | Web copy / use |
| --- | --- | --- |
| `orbital-frame.png` | 1920 × 1080 | Retained master, not a second runtime image |
| `orbital-poster.webp` | 1920 × 1080 | `web/public/brand/orbital-poster.webp`; immediate SSR/no-JS/WebGL fallback |
| `orbital-grain.png` | 192 × 192 | `web/public/brand/orbital-grain.png`; live art texture |
| `orbital-wordmark.svg` | viewBox 836 × 120 | `web/public/brand/orbital-wordmark.svg`; monochrome full NEGENT MIND lettering |
| `orbital-monogram.svg` | viewBox 180 × 120 | `web/public/brand/orbital-monogram.svg`; monochrome NM mark |
| `orbital-icon.svg` | 64 × 64 | `web/public/brand/orbital-icon.svg` and `web/app/icon.svg` |
| `orbital-avatar.png` | 512 × 512 | `web/public/brand/orbital-avatar.png` |
| `orbital-banner.png` | 2400 × 800 | `web/public/brand/orbital-banner.png` |
| `orbital-og.png` | 1200 × 630 | `web/public/brand/orbital-og.png` and `web/public/og.png` |

Avatar, banner and OG center-crop the same frozen plate. They apply a uniform
60% carbon reading veil and undistorted silver Orbital paths; no independent
color redraw or unverified marketing claim is added.

## Reproduction

From the `os` root, using Node 26, ImageMagick and a browser with local-file access.
No development server is needed for this capture:

```powershell
node brand/orbital/export-assets.mjs plate
agent-browser --session orbital-art-fix --allow-file-access open "file:///C:/Users/Eros/Negent%20Mind/os/brand/orbital/capture-plate.html"
agent-browser --session orbital-art-fix set viewport 1920 1080
agent-browser --session orbital-art-fix wait 'body[data-art-ready="true"]'
# Verify brand/specimens/out exists and choose a NEW filename; preserve before shots.
$plate = Join-Path (Get-Location) "brand\specimens\out\orbital-frame-approved-spectrum.png"
if (Test-Path $plate) { throw "Choose a new capture filename before proceeding." }
agent-browser --session orbital-art-fix screenshot "$plate"
node brand/orbital/export-assets.mjs export "$plate"
```

The exporter requires Node 26's TypeScript stripping and ImageMagick, reads
the canonical preset directly, validates the input dimensions, preserves the
original vector geometry, and writes provenance comments plus the manifest.
Changing visual uniforms or the capture frame requires a fresh plate and all
derived exports together. Changing only the live speed does not change the
frozen frame rendered at speed zero and does not require recapturing its pixels.
Do not regenerate from the poster or a screenshot containing hero text.
The grain is already frozen and must not be regenerated for a palette change.
Exact raster hashes can vary with the browser/GPU; the committed plate and
manifest identify the actual captured pixels, rather than promising cross-GPU
bitwise rendering.

## Motion, fallback and bounded rendering

- The hero's semantic content and links render on the server and never await
  an animation, loader or canvas.
- The local poster is always present. WebGL2 is requested only when the
  shared provider permits animation and the hero approaches the viewport.
  Noise decoding and the actual `ShaderMount` constructor share one local
  try/catch. Unsupported WebGL2, decoding/constructor failure and local canvas
  context-loss/creation-error events leave the poster in place without retrying
  in a loop. There is no speculative probe context or global rejection handler.
  A render boundary separately protects the dynamic module import.
- Unknown motion preference does not mount the shader. Reduced motion uses
  the poster; a preference change back to reduce unmounts the live shader.
- Manual pause calls `ShaderMount.setSpeed(0)`, freezing its current frame without
  rebuilding the mount. The latest animation preference is read after decoding.
  Paper 0.0.82's
  `ShaderMount.setCurrentSpeed` cancels its animation frame at zero.
  Paper's own `IntersectionObserver` and `visibilitychange` handling stop the
  render loop offscreen and in hidden tabs. The hero additionally passes
  zero speed outside its observed region.
- The live shader uses `minPixelRatio=1` and `maxPixelCount=2073600`.
  There is no measured FPS or bundle-size improvement claim.
- Unmount/StrictMode cleanup disposes returned instances and local context
  listeners. A constructor that throws before returning only has its residual
  canvas removed from the dedicated host; content or unrelated DOM is not cleared.
  The extra live grain is enabled only once the shader is ready, so the frozen
  poster is not grained twice while initialization is pending.
- GSAP animates an already-visible, bounded entrance only. Its context is
  reverted on cleanup, preference changes and global pause. It never shares
  animated nodes with Motion.

## Third-party acknowledgment

The site uses **Paper Shaders**, specifically
**`@paper-design/shaders-react@0.0.82`** and
**`@paper-design/shaders@0.0.82`**, licensed under **Apache License 2.0**.
Upstream [source repository](https://github.com/paper-design/shaders) and
[shader documentation](https://shaders.paper.design/).

The unmodified license and upstream notice distributed with the installed
React package are retained as [PAPER-LICENSE](PAPER-LICENSE) and
[PAPER-NOTICE](PAPER-NOTICE). This is an acknowledgment of the maintained
library, not an attribution or copyright claim over the Framer reference.
