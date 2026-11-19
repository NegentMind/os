# Orbital v2 — variant candidates

Selection set for the next brand assets. Nothing here overwrites the
frozen exports in `brand/orbital/` — these are candidates only.

## Choosing

Open `index.html` (all variants side by side, labeled) or the per-asset
previews: `preview-banner.html`, `preview-icon.html` (includes real
64/48/32/16 px legibility checks), `preview-avatar.html` (circular-crop
simulation), `preview-og.html`.

## Files

| PNG | Size | Composition |
| --- | --- | --- |
| `banner-v1.png` / `banner-gh-v1.png` | 2400×800 / 1920×480 | Strata: warp full-bleed + 60% carbon veil + left wordmark |
| `banner-v2.png` / `banner-gh-v2.png` | 2400×800 / 1920×480 | Spectrum: clean carbon + spectral band (lower third) + wordmark + monogram |
| `banner-v3.png` / `banner-gh-v3.png` | 2400×800 / 1920×480 | Core: near-monochrome warp + core-orb right + wordmark |
| `icon-v1.png` | 512×512 | NM on rounded carbon square |
| `icon-v2.png` | 512×512 | NM on warp mini-crop, 55% veil |
| `icon-v3.png` | 512×512, alpha | Silver NM + teal registration dot on transparent |
| `avatar-v1.png` | 512×512 | Warp center-crop + 60% veil + monogram (≈ current) |
| `avatar-v2.png` | 512×512 | Pure carbon + thin spectral orbital ring + monogram |
| `avatar-v3.png` | 512×512 | Core-orb, no letters |
| `og-v1..v3.png` | 1200×630 | Same three compositions adapted |

`*-gh-*` files are the 1920×480 GitHub-profile versions of each banner
concept; once a winner is chosen, only its `-gh` file is needed.

## Regenerating

```sh
python capture.py   # Playwright/Chromium, deviceScaleFactor=1
python verify.py    # screenshots of index/preview pages -> _check-*.png
```

`render.html?a=<asset>&v=<1..3>` renders each composition at exact size
(`a`: banner, banner-gh, icon, avatar, og). Sources: `../orbital-frame.png`
crops, `../orbital-wordmark.svg`, `../orbital-monogram.svg`,
`../orbital-grain.png`; palette per `web/components/nm/v2/hero-preset.ts`.

## Next steps after selection

- Winning icon → export 64 SVG / 48 / 180 into `web/public/`.
- Winning banner `-gh` → export for `github-profile/`.
- Winning OG → `web/public/brand/orbital-og.png` + `web/public/og.png`.
