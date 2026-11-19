"""Visual self-check: screenshot the master index + per-asset previews."""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))


def shot(page, name, out, width=1400):
    url = f"file:///{os.path.join(HERE, name).replace(os.sep, '/')}"
    page.set_viewport_size({"width": width, "height": 900})
    page.goto(url)
    page.wait_for_load_state("load")
    page.wait_for_timeout(200)
    page.screenshot(path=os.path.join(HERE, out), full_page=True)
    print(out)


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(device_scale_factor=1)
        shot(page, "index.html", "_check-index.png")
        shot(page, "preview-icon.html", "_check-icon.png")
        browser.close()


if __name__ == "__main__":
    main()
