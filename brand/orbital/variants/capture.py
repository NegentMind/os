"""Capture Orbital v2 variant compositions from render.html via Playwright/Chromium.
Usage: python capture.py
Outputs PNG masters next to this file. deviceScaleFactor=1, exact stage size.
"""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
RENDER = os.path.join(HERE, "render.html").replace("\\", "/")

SHOTS = [
    ("banner", 1, 2400, 800, "banner-v1.png"),
    ("banner", 2, 2400, 800, "banner-v2.png"),
    ("banner", 3, 2400, 800, "banner-v3.png"),
    ("banner-gh", 1, 1920, 480, "banner-gh-v1.png"),
    ("banner-gh", 2, 1920, 480, "banner-gh-v2.png"),
    ("banner-gh", 3, 1920, 480, "banner-gh-v3.png"),
    ("icon", 1, 512, 512, "icon-v1.png"),
    ("icon", 2, 512, 512, "icon-v2.png"),
    ("icon", 3, 512, 512, "icon-v3.png"),
    ("avatar", 1, 512, 512, "avatar-v1.png"),
    ("avatar", 2, 512, 512, "avatar-v2.png"),
    ("avatar", 3, 512, 512, "avatar-v3.png"),
    ("og", 1, 1200, 630, "og-v1.png"),
    ("og", 2, 1200, 630, "og-v2.png"),
    ("og", 3, 1200, 630, "og-v3.png"),
]


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(device_scale_factor=1)
        for asset, variant, w, h, out in SHOTS:
            url = f"file:///{RENDER}?a={asset}&v={variant}"
            page.set_viewport_size({"width": w, "height": h})
            page.goto(url)
            page.wait_for_load_state("load")
            page.wait_for_function("document.body.dataset.ready==='1'")
            page.wait_for_timeout(150)
            transparent = asset == "icon" and variant == 3
            page.locator("#stage").screenshot(
                path=os.path.join(HERE, out), omit_background=transparent
            )
            print(f"{out}: {w}x{h}")
        browser.close()


if __name__ == "__main__":
    main()
