// Reddit por browser (old.reddit, HTML server-rendered) con perfil persistente.
// Uso: fallback cuando OAuth/JSON fallan, o escritura sin app.
// Login manual 1 vez en ~/.social-hub/chrome-reddit. Ritmo humano.
import { chromium, type Page } from "playwright";
import { REDDIT_PROFILE, ensureDirs } from "../session.js";

async function withPage<T>(fn: (page: Page) => Promise<T>): Promise<T> {
  ensureDirs();
  const browser = await chromium.launchPersistentContext(REDDIT_PROFILE, { headless: false });
  try {
    const page = browser.pages()[0] ?? (await browser.newPage());
    const out = await fn(page);
    await browser.close();
    return out;
  } catch (e) {
    await browser.close().catch(() => undefined);
    throw e;
  }
}

function loggedIn(url: string): boolean {
  return !url.includes("/login");
}

export const rbRead = (sub = "all", sort = "hot", limit = 5) =>
  withPage(async (p) => {
    await p.goto(`https://old.reddit.com/r/${encodeURIComponent(sub)}/${sort}/`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(3000);
    const items = await p.$$eval(".thing.link", (els) =>
      els.slice(0, 12).map((e) => {
        const a = e.querySelector("a.title") as HTMLAnchorElement | null;
        const s = e.querySelector(".score")?.textContent ?? "?";
        return `[${s}] ${a?.innerText ?? "?"} (${a?.href ?? ""})`;
      })
    ).catch(() => [] as string[]);
    if (items.length === 0) return "Sin posts (login o layout).";
    return items.slice(0, limit).map((t, i) => `${i + 1}. ${t}`).join("\n");
  });

export const rbSubmit = (subreddit: string, title: string, text: string) =>
  withPage(async (p) => {
    await p.goto(`https://old.reddit.com/r/${encodeURIComponent(subreddit)}/submit`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(3000);
    if (!loggedIn(p.url())) throw new Error("Reddit pide login: hacerlo 1 vez en perfil ~/.social-hub/chrome-reddit.");
    await p.fill('textarea[name="title"]', title).catch(() => undefined);
    await p.fill('input[name="title"]', title).catch(() => undefined);
    const selfTab = p.locator('a[href="#"]').first();
    await selfTab.click({ timeout: 8000 }).catch(() => undefined);
    await p.fill('textarea[name="text"]', text).catch(() => undefined);
    await p.click('button[type="submit"]').catch(() => undefined);
    await p.waitForTimeout(3000);
    return "Submit enviado (verificar: karma/edad del sub pueden filtrarlo).";
  });

export const rbComment = (target: string, text: string) =>
  withPage(async (p) => {
    const url = target.startsWith("http") ? target : `https://old.reddit.com/comments/${target.replace(/^t3_/, "")}/`;
    await p.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(3000);
    if (!loggedIn(p.url())) throw new Error("Reddit pide login para comentar.");
    await p.fill('textarea[name="text"]', text, { timeout: 15000 });
    await p.click('button[type="submit"]', { timeout: 15000 }).catch(() => undefined);
    await p.waitForTimeout(2000);
    return "Comentario enviado.";
  });
