"""Capture the FINAL Orbital v2 assets (Strata-mod) and encode the GIFs.

Pipeline: render-final.html + Playwright/Chromium -> PNG masters + GIF frames
-> ffmpeg (palettegen/paletteuse, loop 0).

Outputs next to this file:
  banner.png      2400x800 master, 4-edge alpha fade, rounded corners
  banner-gh.png   1920x480 GitHub size, same treatment
  banner.gif      1200x400, N frames @ FPS, matte vignette (GIF-safe), loop
  banner-gh.gif   1920x480 (scaled down if the encode is too heavy)
  og-final.png    1200x630, same comp, opaque carbon fade  -> brand/orbital/
  icon-180.png    flat carbon bg (apple-touch-icon source)
  icon-48.png     transparent corners                      -> favicon-48.png
  icon-32.png     transparent corners                      -> favicon-32.png

Usage: python capture-final.py            # everything
        python capture-final.py png       # masters + icons only (no gif)
        python capture-final.py gif       # frames + encode only
"""
import os
import shutil
import subprocess
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
RENDER = os.path.join(HERE, "render-final.html").replace("\\", "/")
ORBITAL = os.path.dirname(HERE)
FRAMES = os.path.join(HERE, "_frames")
FFMPEG = r"C:\Users\Eros\AppData\Local\hermes\tools\ffmpeg-9.0.1-win32-x64\bin\ffmpeg.exe"

FPS = 15
DUR = 4.0                 # seconds; spec asks for a ~4-6 s loop
N = int(FPS * DUR)        # 60 frames
GIF_W, GIF_H = 1200, 400
GH_W, GH_H = 1920, 480
SIZE_LIMIT = 8 * 1024 * 1024


def url(a, **kw):
    q = "&".join(f"{k}={v}" for k, v in kw.items())
    return f"file:///{RENDER}?a={a}" + (f"&{q}" if q else "")


def shot(page, a, w, h, out, **kw):
    page.set_viewport_size({"width": w, "height": h})
    page.goto(url(a, w=w, h=h, **kw))
    page.wait_for_function("document.body.dataset.ready==='1'")
    page.wait_for_timeout(120)
    page.locator("#stage").screenshot(path=out, omit_background=True)
    print(f"  {os.path.basename(out)}: {w}x{h} {kw or ''}")


def capture_masters(page):
    shot(page, "banner", 2400, 800, os.path.join(HERE, "banner.png"), t=0, still=1)
    shot(page, "banner-gh", 1920, 480, os.path.join(HERE, "banner-gh.png"), t=0, still=1)
    # OG ships opaque: the soft edge fade reads against carbon, deterministic
    # on any crawler surface.
    shot(page, "og", 1200, 630, os.path.join(ORBITAL, "og-final.png"), t=0, matte=1, still=1)
    shot(page, "icon", 180, 180, os.path.join(HERE, "icon-180.png"), flat=1)
    shot(page, "icon", 48, 48, os.path.join(HERE, "icon-48.png"))
    shot(page, "icon", 32, 32, os.path.join(HERE, "icon-32.png"))


def capture_frames(page):
    os.makedirs(FRAMES, exist_ok=True)
    for i in range(N):
        t = i / N
        shot(page, "banner", GIF_W, GIF_H,
             os.path.join(FRAMES, f"b-{i:03d}.png"), t=f"{t:.4f}", matte=1)
        shot(page, "banner", GH_W, GH_H,
             os.path.join(FRAMES, f"g-{i:03d}.png"), t=f"{t:.4f}", matte=1)


def ffmpeg(*args):
    cmd = [FFMPEG, "-y", "-hide_banner", "-loglevel", "error", *args]
    subprocess.run(cmd, check=True)


def encode_gif(pattern, palette, out, fps=FPS, colors=128, scale=None):
    pre = f"scale={scale}:flags=lanczos," if scale else ""
    ffmpeg("-framerate", str(fps), "-i", pattern,
           "-vf", f"{pre}palettegen=max_colors={colors}:reserve_transparent=1",
           palette)
    fc = (f"[0:v]{pre.rstrip(',')}[v];" if scale else "[0:v]copy[v];") + \
         "[v][1:v]paletteuse=dither=bayer:bayer_scale=4:alpha_threshold=128"
    # when not scaling, `copy` is a no-op that still names the stream
    ffmpeg("-framerate", str(fps), "-i", pattern, "-i", palette,
           "-filter_complex", fc, "-loop", "0", out)
    size = os.path.getsize(out)
    print(f"  {os.path.basename(out)}: {size/1e6:.2f} MB")
    return size


def main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(device_scale_factor=1)
        if mode in ("all", "png"):
            print("[masters]")
            capture_masters(page)
        if mode in ("all", "gif"):
            print(f"[frames] {N} @ {FPS}fps ({DUR}s)")
            capture_frames(page)
        browser.close()

    if mode in ("all", "gif"):
        bpat = os.path.join(FRAMES, "b-%03d.png")
        gpat = os.path.join(FRAMES, "g-%03d.png")
        print("[encode]")
        size = encode_gif(bpat, os.path.join(FRAMES, "bpal.png"),
                          os.path.join(HERE, "banner.gif"))
        if size > SIZE_LIMIT:
            print("  banner.gif >8MB, retrying at 960x320 / 96 colors")
            size = encode_gif(bpat, os.path.join(FRAMES, "bpal.png"),
                              os.path.join(HERE, "banner.gif"),
                              colors=96, scale="960:320")
        size = encode_gif(gpat, os.path.join(FRAMES, "gpal.png"),
                          os.path.join(HERE, "banner-gh.gif"))
        if size > SIZE_LIMIT:
            print("  banner-gh.gif >8MB, retrying at 1600x400 / 96 colors")
            size = encode_gif(gpat, os.path.join(FRAMES, "gpal.png"),
                              os.path.join(HERE, "banner-gh.gif"),
                              colors=96, scale="1600:400")
        if size > SIZE_LIMIT:
            print("  still >8MB, retrying at 1280x320 / 64 colors")
            encode_gif(gpat, os.path.join(FRAMES, "gpal.png"),
                       os.path.join(HERE, "banner-gh.gif"),
                       colors=64, scale="1280:320")
        shutil.rmtree(FRAMES, ignore_errors=True)


if __name__ == "__main__":
    main()
