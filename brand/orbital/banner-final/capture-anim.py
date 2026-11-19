"""Capture gh-size GIF frames for BOTH themes with the animated-letter
renderer (spectrum wave + float, deterministic on t -> seamless loop)
and encode org-banner gifs. Also shoots the light PNG masters.

Outputs:
  banner-light.png / banner-gh-light.png   light masters
  banner-gh.gif                            dark loop 960x240 (re-encoded)
  banner-light.gif                         light loop 960x240
"""
import os
import subprocess
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
RENDER = os.path.join(HERE, "render-final.html").replace("\\", "/")
FFMPEG = r"C:\Users\Eros\AppData\Local\hermes\tools\ffmpeg-9.0.1-win32-x64\bin\ffmpeg.exe"
FPS, DUR = 15, 4.0
N = int(FPS * DUR)


def url(a, theme, **kw):
    q = "&".join(f"{k}={v}" for k, v in kw.items())
    t = f"&theme={theme}" if theme else ""
    return f"file:///{RENDER}?a={a}{t}" + (f"&{q}" if q else "")


def shot(page, a, theme, w, h, out, **kw):
    page.set_viewport_size({"width": w, "height": h})
    page.goto(url(a, theme, w=w, h=h, **kw))
    page.wait_for_function("document.body.dataset.ready==='1'")
    page.wait_for_timeout(120)
    page.screenshot(path=out, omit_background=True)


def frames(page, theme, prefix):
    d = os.path.join(HERE, "_frames", prefix)
    os.makedirs(d, exist_ok=True)
    for i in range(N):
        shot(page, "banner-gh", theme, 1920, 480,
             os.path.join(d, f"{prefix}-{i:03d}.png"), matte="1", t=f"{i / N:.4f}")
    print(f"{prefix}: {N} frames", flush=True)
    return d


def encode(frames_dir, prefix, out):
    pal = os.path.join(frames_dir, "pal.png")
    subprocess.run([
        FFMPEG, "-y", "-v", "error", "-framerate", "12",
        "-i", os.path.join(frames_dir, f"{prefix}-%03d.png"),
        "-vf", "scale=960:240:flags=lanczos,palettegen=max_colors=48:reserve_transparent=1",
        pal, "-frames:v", "1"], check=True)
    subprocess.run([
        FFMPEG, "-y", "-v", "error", "-framerate", "12",
        "-i", os.path.join(frames_dir, f"{prefix}-%03d.png"), "-i", pal,
        "-lavfi", "scale=960:240:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3:alpha_threshold=128",
        out], check=True)
    print(out, os.path.getsize(out), "bytes", flush=True)


def main():
    with sync_playwright() as p:
        page = p.chromium.launch().new_page()
        shot(page, "banner", "light", 2400, 800,
             os.path.join(HERE, "banner-light.png"), still="1")
        shot(page, "banner-gh", "light", 1920, 480,
             os.path.join(HERE, "banner-gh-light.png"), still="1")
        dark = frames(page, None, "g")
        light = frames(page, "light", "l")
    encode(dark, "g", os.path.join(HERE, "banner-gh.gif"))
    encode(light, "l", os.path.join(HERE, "banner-light.gif"))


if __name__ == "__main__":
    sys.exit(main())
