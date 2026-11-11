// Daily.dev: API publica REST primero (gratis, token propio), browser fallback.
// API: https://api.daily.dev/public/v1 — feeds, posts, search, bookmarks.
// Token en app.daily.dev/settings/api -> DAILYDEV_TOKEN. Limites: 300 IP/min + 60 user/min.
import { env } from "../session.js";
import { chromium } from "playwright";
import { DAILY_PROFILE, ensureDirs } from "../session.js";

const API = "https://api.daily.dev/public/v1";

function headers(): Record<string, string> {
  const h: Record<string, string> = { accept: "application/json", "user-agent": "social-hub/0.4" };
  if (env("DAILYDEV_TOKEN")) h.authorization = `Bearer ${env("DAILYDEV_TOKEN")}`;
  return h;
}

type Post = { id?: string; title?: string; url?: string; permalink?: string; numUpvotes?: number };

function fmt(posts: Post[], limit: number): string {
  const items = posts.slice(0, limit);
  if (items.length === 0) return "Sin posts.";
  return items.map((p, i) => `${i + 1}. ${p.title ?? "?"} (${p.numUpvotes ?? 0} up)\n   ${p.permalink ?? p.url ?? ""}`).join("\n");
}

async function api<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { headers: headers() });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function dailyTrending(limit = 5, kind = "popular"): Promise<string> {
  const feeds: Record<string, string> = { popular: "/feeds/popular", discussed: "/feeds/discussed", foryou: "/feeds/foryou" };
  const j = await api<{ data?: Post[] } | Post[]>(feeds[kind] ?? feeds.popular);
  const posts = Array.isArray(j) ? j : (j?.data ?? []);
  if (posts.length > 0) return fmt(posts, limit);
  return browserFeed("https://app.daily.dev/", limit);
}

export async function dailySearch(query: string, limit = 5): Promise<string> {
  const j = await api<{ data?: Post[] } | Post[]>(`/search/posts?q=${encodeURIComponent(query)}&limit=${limit}`);
  const posts = Array.isArray(j) ? j : (j?.data ?? []);
  if (posts.length > 0) return fmt(posts, limit);
  return browserFeed(`https://app.daily.dev/search?q=${encodeURIComponent(query)}`, limit);
}

export async function dailyTag(tag: string, limit = 5): Promise<string> {
  const j = await api<{ data?: Post[] } | Post[]>(`/feeds/tag/${encodeURIComponent(tag)}`);
  const posts = Array.isArray(j) ? j : (j?.data ?? []);
  if (posts.length > 0) return fmt(posts, limit);
  return `Sin posts para tag ${tag} (API sin token o tag inexistente).`;
}

// Fallback browser con perfil persistente (login 1 vez -> feed personalizado)
async function browserFeed(url: string, limit: number): Promise<string> {
  ensureDirs();
  const browser = await chromium.launchPersistentContext(DAILY_PROFILE, { headless: false });
  try {
    const page = browser.pages()[0] ?? (await browser.newPage());
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(5000);
    if (page.url().includes("login") || page.url().includes("onboarding")) {
      throw new Error("Daily.dev pide login: hacerlo 1 vez en perfil ~/.social-hub/chrome-daily, o configurar DAILYDEV_TOKEN.");
    }
    const items = await page.$$eval("a", (els) =>
      [...new Set(els.map((e) => ({ t: (e as HTMLElement).innerText.trim(), h: (e as HTMLAnchorElement).href })))]
        .filter((x) => x.t.length > 20 && x.t.length < 200 && !x.h.includes("daily.dev"))
        .slice(0, 12)
    ).catch(() => [] as Array<{ t: string; h: string }>);
    await browser.close();
    if (items.length === 0) return "Sin titulares (configurar DAILYDEV_TOKEN).";
    return items.slice(0, limit).map((x, i) => `${i + 1}. ${x.t.split("\n")[0]}\n   ${x.h}`).join("\n");
  } catch (e) {
    await browser.close().catch(() => undefined);
    throw e;
  }
}

// Bookmarks: la API publica SI expone escritura (ver OpenAPI
// https://api.daily.dev/public/v1/docs/json, operationId postBookmarks):
// POST /bookmarks/ con { postIds: [...] }. Requiere DAILYDEV_TOKEN.
export async function dailyBookmarkAdd(postId: string, listId?: string): Promise<string> {
  const id = (postId ?? "").trim();
  if (!id) throw new Error("dailyBookmarkAdd necesita un postId (ver dailySearch).");
  const token = env("DAILYDEV_TOKEN");
  if (!token) throw new Error("Daily.dev bookmarks requiere DAILYDEV_TOKEN (app.daily.dev/settings/api).");
  let res: Response;
  try {
    res = await fetch(`${API}/bookmarks/`, {
      method: "POST",
      headers: { ...headers(), "content-type": "application/json" },
      body: JSON.stringify(listId ? { postIds: [id], listId } : { postIds: [id] }),
    });
  } catch {
    throw new Error("Daily.dev bookmarks: fallo de red hacia api.daily.dev.");
  }
  if (res.status === 401 || res.status === 403) throw new Error("Daily.dev: DAILYDEV_TOKEN invalido o sin permiso (401/403). Regenerar en app.daily.dev/settings/api.");
  if (res.status === 400) throw new Error(`Daily.dev: postId invalido (${(await res.text()).slice(0, 150)}). Usa el id del post (ver dailySearch).`);
  if (res.status === 429) throw new Error("Daily.dev 429: limite 60 req/min por usuario. Esperar y reintentar.");
  if (!res.ok) throw new Error(`Daily.dev bookmarks HTTP ${res.status}.`);
  return `Bookmark guardado en Daily.dev (postId=${id}).`;
}

// Publicar en una Squad via browser con perfil logueado (best-effort):
// la API publica NO expone posts en Squads (solo feeds/posts/search/bookmarks),
// asi que se usa el flujo New Post de la Squad en app.daily.dev.
// Si el DOM cambia o pide login, error honesto en vez de click a ciegas.
export async function dailySquadPost(squadHandle: string, title: string, linkOrText: string): Promise<string> {
  const handle = (squadHandle ?? "").trim().replace(/^@/, "");
  if (!handle) throw new Error("dailySquadPost necesita squadHandle (ej: mi-squad).");
  if (!(title ?? "").trim()) throw new Error("dailySquadPost necesita un titulo.");
  if (!(linkOrText ?? "").trim()) throw new Error("dailySquadPost necesita linkOrText (URL o texto del post).");
  ensureDirs();
  const url = `https://app.daily.dev/squads/${encodeURIComponent(handle)}`;
  const text = linkOrText.trim();
  const browser = await chromium.launchPersistentContext(DAILY_PROFILE, { headless: false });
  try {
    const page = browser.pages()[0] ?? (await browser.newPage());
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(5000);
    if (page.url().includes("login") || page.url().includes("onboarding")) {
      throw new Error("Daily.dev pide login: hacerlo 1 vez en perfil ~/.social-hub/chrome-daily.");
    }
    const newPost = page.getByRole("button", { name: /new post|create post|nuevo post|crear/i }).first();
    if ((await newPost.count().catch(() => 0)) === 0) {
      throw new Error("Daily.dev: boton New Post no encontrado en la Squad (squad inexistente/sin acceso o layout cambiado).");
    }
    await newPost.click({ timeout: 15000 }).catch(() => {
      throw new Error("Daily.dev: click en New Post fallo (rate-limit o layout cambiado).");
    });
    await page.waitForTimeout(2000);
    const titleInput = page.locator('input[name="title"], input[placeholder*="title" i], input[placeholder*="tulo" i]').first();
    if ((await titleInput.count().catch(() => 0)) > 0) {
      await titleInput.fill(title.trim(), { timeout: 15000 });
    } else {
      const firstBox = page.getByRole("textbox").first();
      if ((await firstBox.count().catch(() => 0)) === 0) throw new Error("Daily.dev: campo de titulo no encontrado (layout cambiado). Publicar a mano en " + url);
      await firstBox.fill(title.trim(), { timeout: 15000 });
    }
    if (/^https?:\/\//i.test(text)) {
      const urlInput = page.locator('input[type="url"], input[placeholder*="link" i], input[placeholder*="url" i], input[placeholder*="enlace" i]').first();
      if ((await urlInput.count().catch(() => 0)) > 0) {
        await urlInput.fill(text, { timeout: 15000 });
      } else {
        const boxes = page.getByRole("textbox");
        if ((await boxes.count().catch(() => 0)) > 1) await boxes.nth(1).fill(text, { timeout: 15000 });
      }
    } else {
      const boxes = page.getByRole("textbox");
      if ((await boxes.count().catch(() => 0)) > 1) await boxes.nth(1).fill(text, { timeout: 15000 });
    }
    await page.waitForTimeout(1000);
    const submit = page.getByRole("button", { name: /^(post|postear|publicar|submit|share|compartir)$/i }).first();
    if ((await submit.count().catch(() => 0)) === 0) throw new Error("Daily.dev: boton Publicar no encontrado (layout cambiado). Revisar y publicar a mano en " + url);
    await submit.click({ timeout: 15000 }).catch(() => {
      throw new Error("Daily.dev: click en Publicar fallo (pide login o rate-limit).");
    });
    await page.waitForTimeout(2000);
    await browser.close();
    return `Post enviado a la Squad ${handle} en Daily.dev (verificar en ${url}).`;
  } catch (e) {
    await browser.close().catch(() => undefined);
    throw e;
  }
}

// Bookmarks del usuario via API publica (GET /bookmarks/). Requiere DAILYDEV_TOKEN
// (app.daily.dev/settings/api). Si la API publica no expone el endpoint,
// error honesto en vez de inventar datos.
export async function dailyBookmarks(limit = 5): Promise<string> {
  const token = env("DAILYDEV_TOKEN");
  if (!token) throw new Error("Daily.dev bookmarks requiere DAILYDEV_TOKEN (app.daily.dev/settings/api).");
  let res: Response;
  try {
    res = await fetch(`${API}/bookmarks?limit=${limit}`, { headers: headers() });
  } catch {
    throw new Error("Daily.dev bookmarks: fallo de red hacia api.daily.dev.");
  }
  if (res.status === 404) throw new Error("Daily.dev: la API publica no expone GET /bookmarks (ver https://api.daily.dev/public/v1). Ver bookmarks en https://app.daily.dev/bookmarks.");
  if (res.status === 401 || res.status === 403) throw new Error("Daily.dev: DAILYDEV_TOKEN invalido o sin permiso (401/403). Regenerar en app.daily.dev/settings/api.");
  if (!res.ok) throw new Error(`Daily.dev bookmarks HTTP ${res.status}.`);
  const j = (await res.json()) as { data?: Post[] } | Post[];
  const posts = Array.isArray(j) ? j : (j?.data ?? []);
  if (posts.length === 0) return "Sin bookmarks.";
  return fmt(posts, limit);
}

function dailyPostUrl(postIdOrUrl: string): string {
  const t = postIdOrUrl.trim();
  if (/^https?:\/\//.test(t)) return t;
  return `https://app.daily.dev/posts/${encodeURIComponent(t)}`;
}

// Upvote best-effort con perfil logueado (login 1 vez en chrome-daily).
export async function dailyUpvote(postIdOrUrl: string): Promise<string> {
  ensureDirs();
  const url = dailyPostUrl(postIdOrUrl);
  const browser = await chromium.launchPersistentContext(DAILY_PROFILE, { headless: false });
  try {
    const page = browser.pages()[0] ?? (await browser.newPage());
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(5000);
    if (page.url().includes("login") || page.url().includes("onboarding")) {
      throw new Error("Daily.dev pide login: hacerlo 1 vez en perfil ~/.social-hub/chrome-daily.");
    }
    const up = page.getByRole("button", { name: /upvote|up vote|votar/i }).first();
    if ((await up.count().catch(() => 0)) === 0) throw new Error("Daily.dev: boton upvote no encontrado (post inexistente o layout cambiado).");
    await up.click({ timeout: 15000 }).catch(() => {
      throw new Error("Daily.dev: click de upvote fallo (pide login o rate-limit).");
    });
    await page.waitForTimeout(1500);
    await browser.close();
    return "Upvote enviado en Daily.dev.";
  } catch (e) {
    await browser.close().catch(() => undefined);
    throw e;
  }
}
