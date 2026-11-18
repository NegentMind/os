# Orbital v2 — final banner/OG/icon pipeline

Selected direction: **Strata v1 modified** (user pick, 2026-11-18):

- Wordmark `NEGENT MIND.` **centered and larger** (~66% of width, `wm` param).
- Warp crop (`../orbital-frame.png`) + 60% carbon veil + grain, as v1.
- **4-edge fade to transparency** (`fx`/`fy` params, ~10–12%) inside a card
  with **rounded corners** (~12‰ of width, 29px at 2400).
- **Animated GIF**: seamless Ken Burns loop (sinusoidal pan + zoom on the warp
  crop, period = loop length). GIF alpha is binary, so the edge fade is rendered
  over an opaque carbon matte (`matte=1`) → reads as a vignette to `#070809`;
  corners stay transparent. The PNG masters keep true alpha fades (`still=1`
  renders at exact cover, no overscan → sharpest master).

## Files produced (run `python capture-final.py`)

| Output | Size | Notes |
| --- | --- | --- |
| `banner.png` | 2400×800 RGBA | master, alpha edge fade, rounded |
| `banner-gh.png` | 1920×480 RGBA | GitHub size |
| `banner.gif` | 1200×400 | 60f @15fps (4s), palette 128, loop |
| `banner-gh.gif` | 1920×480 | same; auto-fallback to 1600/1280 if >8MB |
| `../og-final.png` | 1200×630 RGB | opaque, carbon edge fade (no rounding) → `web/public/og.png` |
| `icon-180.png` | 180×180 RGB | flat carbon bg → `web/public/apple-touch-icon.png` |
| `icon-48.png` / `icon-32.png` | RGBA | transparent corners → `web/public/favicon-*.png` |

`og-final.png` ships opaque on purpose: crawlers composite OG images on
unpredictable surfaces, so the soft edge fade is baked against carbon
instead of alpha.

## Params (`render-final.html?a=banner&...`)

`a`=banner|banner-gh|og|icon · `w`,`h`=px override · `t`=0..1 anim phase ·
`matte=1` carbon behind fade · `flat=1` opaque stage · `still=1` exact-cover
static · `wm`=0.66 · `fx`=0.10 · `fy`=0.12.

## Regenerate

```sh
python capture-final.py        # masters + frames + gifs (ffmpeg 2-pass palette)
python capture-final.py png    # masters/icons only
python capture-final.py gif    # frames + encode only
```

ffmpeg is not on PATH: the script calls the absolute binary under
`~/AppData/Local/hermes/tools/ffmpeg-9.0.1-win32-x64/bin/`.
Frames land in `_frames/` and are deleted after a successful encode.
