// LinkedIn via Playwright con perfil persistente + Voyager API con cookies de sesion.
// Voyager da datos estructurados (perfil/empresa/jobs); browser es fallback.
// Login manual 1 vez. Automatizacion viola ToS: ritmo bajo, cuenta propia.
import { chromium, type Page } from "playwright";
import { LINKEDIN_PROFILE, ensureDirs } from "../session.js";

async function withPage<T>(fn: (page: Page) => Promise<T>): Promise<T> {
  ensureDirs();
  const browser = await chromium.launchPersistentContext(LINKEDIN_PROFILE, { headless: false });
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

// Voyager con cookies li_at + JSESSIONID del perfil persistente (datos estructurados)
async function voyager(path: string): Promise<unknown | null> {
  const ctx = await chromium.launchPersistentContext(LINKEDIN_PROFILE, { headless: false });
  let cookie = "";
  try {
    const all = await ctx.cookies("https://www.linkedin.com");
    const liAt = all.find((c: { name: string }) => c.name === "li_at")?.value;
    const jsession = all.find((c: { name: string }) => c.name === "JSESSIONID")?.value?.replace(/"/g, "");
    await ctx.close();
    if (!liAt || !jsession) return null;
    cookie = `li_at=${liAt}; JSESSIONID="${jsession}"`;
  } catch {
    await ctx.close().catch(() => undefined);
    return null;
  }
  try {
    const res = await fetch(`https://www.linkedin.com/voyager/api/${path}`, {
      headers: {
        cookie,
        "csrf-token": jsessionOf(cookie),
        "x-restli-protocol-version": "2.0.0",
        accept: "application/json",
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch {
    return null;
  }
}

function jsessionOf(cookie: string): string {
  return (cookie.match(/JSESSIONID="([^"]+)"/) ?? [])[1] ?? "";
}

async function open(page: Page, url: string): Promise<{ title: string; snippet: string }> {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(4500);
  if (page.url().includes("/login") || page.url().includes("/checkpoint")) {
    throw new Error("LinkedIn pide login: hacerlo 1 vez en perfil ~/.social-hub/chrome-linkedin.");
  }
  const title = await page.title();
  const snippet = await page.$$eval("main", (els) => els[0]?.textContent?.slice(0, 600) ?? "").catch(() => "");
  return { title, snippet: snippet.replace(/\s+/g, " ").slice(0, 500) };
}

export const liOpen = (url: string) =>
  withPage(async (p) => {
    const r = await open(p, url);
    return `${r.title}\n${r.snippet}`;
  });

export const liProfile = (slug: string) =>
  withPage(async (p) => {
    // Voyager primero (estructurado); browser fallback
    if (!slug.startsWith("http")) {
      const v = (await voyager(
        `identity/dash/profiles?q=memberIdentity&memberIdentity=${encodeURIComponent(slug)}&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-103`
      )) as { elements?: Array<{ firstName?: string; lastName?: string; headline?: string; summary?: string }> } | null;
      const el = v?.elements?.[0];
      if (el) return `Perfil: ${el.firstName ?? ""} ${el.lastName ?? ""}\n${(el.headline ?? "").slice(0, 200)}\n${(el.summary ?? "").slice(0, 400)}`;
    }
    const url = slug.startsWith("http") ? slug : `https://www.linkedin.com/in/${slug}/`;
    const r = await open(p, url);
    return `Perfil: ${r.title}\n${r.snippet}`;
  });

export const liCompany = (slug: string) =>
  withPage(async (p) => {
    const url = slug.startsWith("http") ? slug : `https://www.linkedin.com/company/${slug}/`;
    const r = await open(p, url);
    return `Empresa: ${r.title}\n${r.snippet}`;
  });

export const liJobs = (query: string, limit = 5) =>
  withPage(async (p) => {
    const r = await open(p, `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}`);
    const cards = await p.$$eval("a", (els) =>
      els.map((e) => (e as HTMLElement).innerText).filter((t) => t && t.length > 10 && t.length < 160).slice(0, 12)
    ).catch(() => [] as string[]);
    const head = `Jobs "${query}": ${r.title}`;
    return cards.length ? `${head}\n${cards.slice(0, limit).map((t, i) => `${i + 1}. ${t.split("\n")[0]}`).join("\n")}` : `${head}\nSin lista extraible (ver pagina abierta).`;
  });

export const liInbox = () =>
  withPage(async (p) => {
    const r = await open(p, "https://www.linkedin.com/messaging/");
    return `Inbox: ${r.title}. Lectura completa limitada por anti-bot; se muestra conteo/titulo.\n${r.snippet}`;
  });
