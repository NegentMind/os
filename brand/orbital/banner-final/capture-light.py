"""Capture the LIGHT variant of the final banner (paper bg, pastel warp,
carbon wordmark) and encode its GIF — mirrors capture-final.py.

Outputs next to this file:
  banner-light.png      2400x800 master, alpha fade, rounded corners
  banner-gh-light.png   1920x480 GitHub size
  banner-light.gif      960x240 light loop (matte=paper vignette, GIF-safe)
"""
import os
import subprocess
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
RENDER = os.path.join(HERE, "render-final.html").replace("\\", "/")
FRAMES = os.path.join(HERE, "_frames_light")
FFMPEG = r"C:\Users\Eros\AppData\Local\hermes\tools\ffmpeg-9.0.1-win32-x64\bin\ffmpeg.exe"

FPS, DUR = 15, 4.0
N = int(FPS * DUR)


def url(a, **kw):
    q = "&".join(f"{k}={v}" for k, v in kw.items())
    return f"file:///{RENDER}?a={a}&theme=light" + (f"&{q}" if q else "")


def shot(page, a, w, h, out, **kw):
    page.set_viewport_size({"width": w, "height": h})
    page.goto(url(a, w=w, h=h, **kw))
    page.wait_for_function("document.body.dataset.ready==='1'")
    page.wait_for_timeout(120)
    page.screenshot(path=out)


def main():
    os.makedirs(FRAMES, exist_ok=True)
    with sync_playwright() as p:
        page = p.chromium.launch().new_page()
        shot(page, "banner", 2400, 800, os.path.join(HERE, "banner-light.png"), still="1")
        shot(page, "banner-gh", 1920, 480, os.path.join(HERE, "banner-gh-light.png"), still="1")
        for i in range(N):
            t = i / N
            shot(page, "banner-gh", 1920, 480,
                 os.path.join(FRAMES, f"l-{i:03d}.png"), matte="1", t=f"{t:.4f}")
            print(f"frame {i + 1}/{N}", flush=True)

    # encode: scale to 960x240, 12fps, 48 colours — same recipe as the dark gif
    palette = os.path.join(FRAMES, "pal.png")
    subprocess.run([
        FFMPEG, "-y", "-v", "error", "-framerate", "12",
        "-i", os.path.join(FRAMES, "l-%03d.png"),
        "-vf", "scale=960:240:flags=lanczos,palettegen=max_colors=48:reserve_transparent=0",
        palette, "-frames:v", "1"], check=True)
    subprocess.run([
        FFMPEG, "-y", "-v", "error", "-framerate", "12",
        "-i", os.path.join(FRAMES, "l-%03d.png"), "-i", palette,
        "-lavfi", "scale=960:240:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3",
        os.path.join(HERE, "banner-light.gif")], check=True)
    print("done:", os.path.getsize(os.path.join(HERE, "banner-light.gif")), "bytes")


if __name__ == "__main__":
    sys.exit(main())
