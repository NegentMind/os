"""Primer login HN con tecleo OS-level (eventos trusted) para pasar la validacion anti-bot.
Uso: python mcp-hub/tools/hn-first-login.py  (ventana visible, no tocar nada ~20s)
Lee HN_USERNAME/HN_PASSWORD de social/.env sin imprimir valores.
Verifica foco real y longitudes; aborta sin enviar si el foco falla.
Requiere: pip install keyboard playwright"""
import os
import sys
import time
import random

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE, "node_modules"))

env = {}
with open(os.path.join(BASE, "..", ".env"), encoding="utf-8") as f:
    for line in f:
        if "=" in line and not line.startswith("#"):
            k, v = line.rstrip("\n").split("=", 1)
            env[k.strip()] = v.strip()

USER = env.get("HN_USERNAME", "")
PW = env.get("HN_PASSWORD", "")
assert USER and PW, "faltan HN_* en social/.env"

ACCT = 'form:has(input[value="login"]) input[name="acct"]'
PASS = 'form:has(input[value="login"]) input[name="pw"]'

import keyboard
from playwright.sync_api import sync_playwright


def htype(s: str) -> None:
    for ch in s:
        keyboard.write(ch)
        time.sleep(random.uniform(0.05, 0.16))


with sync_playwright() as pw:
    b = pw.chromium.launch_persistent_context(
        os.path.join(os.environ["USERPROFILE"], ".social-hub", "chrome-hn"),
        headless=False,
    )
    p = b.pages[0] if b.pages else b.new_page()
    p.goto("https://news.ycombinator.com/login", wait_until="domcontentloaded", timeout=45000)
    p.wait_for_timeout(2000)
    try:
        p.bring_to_front()
    except Exception:
        pass
    p.wait_for_timeout(1000)
    p.locator(ACCT).click(timeout=15000)
    p.wait_for_timeout(600)
    focus = p.evaluate("document.activeElement ? document.activeElement.getAttribute('name') : 'none'")
    if focus != "acct":
        print("FOCUS_FAIL");
        b.close()
        sys.exit(4)
    htype(USER)
    if len(p.locator(ACCT).input_value()) != len(USER):
        print("TYPE_FAIL");
        b.close()
        sys.exit(5)
    keyboard.press_and_release("tab")
    time.sleep(0.5)
    htype(PW)
    if len(p.locator(PASS).input_value()) != len(PW):
        print("TYPE_FAIL_PW");
        b.close()
        sys.exit(5)
    p.locator('form:has(input[value="login"]) input[value="login"]').click(timeout=15000)
    p.wait_for_timeout(4000)
    print("LOGIN_" + ("OK" if p.locator('a[href^="logout"]').count() > 0 else "FAIL"))
    b.close()
