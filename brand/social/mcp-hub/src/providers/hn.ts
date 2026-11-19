// Hacker News API oficial (Firebase, sin key) + busqueda Algolia (sin key).
// Solo lectura por API. Escritura (submit/comment) por browser con login.
// Riesgo: hellban/shadowban en cuentas nuevas; usar cuenta añeja, ritmo humano.
import { chromium, type Page } from "playwright";
import { HN_PROFILE, ensureDirs, env } from "../session.js";
const FB = "https://hacker-news.firebaseio.com/v0";

type Item = { id?: number; title?: string; url?: string; by?: string; score?: number; descendants?: number; text?: string; kids?: number[]; type?: string };

async function item(id: number): Promise<Item> {
  const res = await fetch(`${FB}/item/${id}.json`);
  if (!res.ok) throw new Error(`HN item HTTP ${res.status}.`);
  return (await res.json()) as Item;
}

const FEEDS: Record<string, string> = {
  top: "topstories", new: "newstories", best: "beststories",
  ask: "askstories", show: "showstories", jobs: "jobstories",
};

export async function hnTop(limit = 5, sort = "top"): Promise<string> {
  const feed = FEEDS[sort] ?? "topstories";
  const ids = ((await (await fetch(`${FB}/${feed}.json`)).json()) as number[]).slice(0, limit);
  const items = await Promise.all(ids.map(item));
  return items.map((t, i) => `${i + 1}. ${t.title ?? "?"} (${t.score ?? 0}pts, ${t.descendants ?? 0}c)\n   id=${t.id} ${t.url ?? ""}`).join("\n");
}

export async function hnSearch(query: string, limit = 5): Promise<string> {
  const res = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&hitsPerPage=${limit}`);
  if (!res.ok) throw new Error(`HN search HTTP ${res.status}.`);
  const j = (await res.json()) as { hits?: Array<{ title?: string; url?: string; objectID?: string; points?: number; author?: string }> };
  const hits = j.hits ?? [];
  if (hits.length === 0) return "Sin resultados.";
  return hits.map((h, i) => `${i + 1}. ${h.title ?? "?"} (${h.points ?? 0}pts @${h.author ?? "?"})\n   id=${h.objectID} ${h.url ?? ""}`).join("\n");
}

export async function hnComments(id: string, limit = 5): Promise<string> {
  // Algolia items/:id trae el arbol completo en 1 llamada (<10k/h por IP)
  try {
    const res = await fetch(`https://hn.algolia.com/api/v1/items/${encodeURIComponent(id)}`);
    if (res.ok) {
      const j = (await res.json()) as { title?: string; author?: string; children?: Array<{ author?: string; text?: string }> };
      const kids = (j.children ?? []).slice(0, limit);
      const head = `# ${j.title ?? id} (@${j.author ?? "?"})`;
      if (kids.length === 0) return `${head}\nSin comentarios.`;
      return [head, ...kids.map((c, i) => `${i + 1}. @${c.author ?? "?"}: ${(c.text ?? "").replace(/<[^>]+>/g, "").slice(0, 300)}`)].join("\n");
    }
  } catch { /* fallback Firebase */ }
  const root = await item(Number(id));
  const kids = (root.kids ?? []).slice(0, limit);
  if (kids.length === 0) return "Sin comentarios visibles.";
  const cs = await Promise.all(kids.map(item));
  return [`# ${root.title ?? id} (@${root.by ?? "?"})`, ...cs.map((c, i) =>
    `${i + 1}. @${c.by ?? "?"}: ${(c.text ?? "").replace(/<[^>]+>/g, "").slice(0, 300)}`)].join("\n");
}

export async function hnUser(username: string): Promise<string> {
  const res = await fetch(`${FB}/user/${encodeURIComponent(username)}.json`);
  if (!res.ok) throw new Error(`HN user HTTP ${res.status}.`);
  const u = (await res.json()) as { id?: string; karma?: number; about?: string; submitted?: number[] } | null;
  if (!u?.id) return "Usuario no existe.";
  return `@${u.id} karma=${u.karma ?? "?"}\n${(u.about ?? "").replace(/<[^>]+>/g, "").slice(0, 300)}`;
}

async function hnPage<T>(fn: (page: Page) => Promise<T>): Promise<T> {
  ensureDirs();
  const browser = await chromium.launchPersistentContext(HN_PROFILE, { headless: false });
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

async function hnLogin(page: Page): Promise<void> {
  await page.goto("https://news.ycombinator.com/login", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(2000);
  const user = env("HN_USERNAME");
  const pass = env("HN_PASSWORD");
  if (!user || !pass) throw new Error("HN pide login: definir HN_USERNAME/HN_PASSWORD en .env o logear 1 vez en perfil chrome-hn.");
  // La pagina tiene 2 forms (login + crear cuenta): scope exacto al de login
  const form = page.locator('form:has(input[value="login"])');
  await form.locator('input[name="acct"]').fill(user, { timeout: 15000 });
  await form.locator('input[name="pw"]').fill(pass);
  await form.locator('input[value="login"]').click();
  await page.waitForTimeout(3000);
}

export async function hnSubmit(title: string, urlOrText: string): Promise<string> {
  return hnPage(async (p) => {
    await p.goto("https://news.ycombinator.com/submit", { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(2000);
    if (p.url().includes("login")) await hnLogin(p);
    await p.fill('input[name="title"]', title, { timeout: 15000 });
    if (/^https?:\/\//.test(urlOrText)) await p.fill('input[name="url"]', urlOrText);
    else await p.fill('textarea[name="text"]', urlOrText);
    await p.click('input[value="submit"]');
    await p.waitForTimeout(3000);
    return "Submit enviado a HN (si no aparece: espera de moderacion o flag). NO autopromocion ni repost.";
  });
}

async function isLoggedIn(page: Page): Promise<boolean> {
  // HN no redirige a /login en items: la señal real es el link de logout.
  return (await page.locator('a[href^="logout"]').count().catch(() => 0)) > 0;
}

// Keepalive: visita ligera con la sesion guardada para que no caduque.
// Headless vale (no intenta loguear, solo reutiliza cookies). Si la sesion
// cayo, indica correr tools/hn-first-login.py (login OS-level una vez).
export async function hnKeepalive(): Promise<string> {
  // Headless propio sin ventana: solo reutiliza cookies, no intenta loguear.
  ensureDirs();
  const browser = await chromium.launchPersistentContext(HN_PROFILE, { headless: true });
  try {
    const page = browser.pages()[0] ?? (await browser.newPage());
    await page.goto("https://news.ycombinator.com/", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2000);
    const ok = await isLoggedIn(page);
    await browser.close();
    if (!ok) throw new Error("HN sesion caida: correr python mcp-hub/tools/hn-first-login.py (una vez) y reintentar.");
    return "HN sesion activa (keepalive ok).";
  } catch (e) {
    await browser.close().catch(() => undefined);
    throw e;
  }
}

export async function hnReply(parentId: string, text: string): Promise<string> {
  return hnPage(async (p) => {
    const url = `https://news.ycombinator.com/item?id=${encodeURIComponent(parentId)}`;
    await p.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(2000);
    if (!(await isLoggedIn(p))) {
      await hnLogin(p);
      await p.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await p.waitForTimeout(2000);
    }
    if (!(await isLoggedIn(p))) throw new Error("HN: login fallo (credenciales invalidas o captcha). Revisar HN_USERNAME/HN_PASSWORD o logear 1 vez en perfil chrome-hn.");
    await p.fill('textarea[name="text"]', text, { timeout: 15000 });
    // El submit del form action=comment dice "add comment" (verificado en vivo)
    const submit = p.locator('form[action="comment"] input[type="submit"]');
    if ((await submit.count().catch(() => 0)) === 0) throw new Error("HN: formulario de reply no encontrado (hilo cerrado o layout cambio).");
    await submit.first().click({ timeout: 15000 });
    await p.waitForTimeout(2000);
    return "Comentario enviado a HN.";
  });
}

// AVISO: votar en HN con cuentas nuevas o a ritmo de bot = hellban/shadowban.
// Usar cuenta añeja, votar esporadicamente y nunca votar los propios submits.
// El upvote es click en la flecha <a id="up_<itemId>"> con perfil logueado.
export async function hnUpvote(itemId: string): Promise<string> {
  const id = itemId.trim();
  if (!/^\d+$/.test(id)) throw new Error("HN upvote: itemId debe ser numerico (ver hnTop/hnSearch: id=...).");
  return hnPage(async (p) => {
    await p.goto(`https://news.ycombinator.com/item?id=${encodeURIComponent(id)}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(2000);
    if (p.url().includes("login")) {
      await hnLogin(p);
      await p.goto(`https://news.ycombinator.com/item?id=${encodeURIComponent(id)}`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await p.waitForTimeout(2000);
    }
    if (p.url().includes("login")) throw new Error("HN pide login: definir HN_USERNAME/HN_PASSWORD en .env o logear 1 vez en perfil chrome-hn.");
    const arrow = p.locator(`a[id="up_${id}"]`);
    if ((await arrow.count().catch(() => 0)) === 0) {
      throw new Error("HN: flecha de voto no encontrada (ya votado, item muerto/flagged o login sin karma suficiente).");
    }
    await arrow.first().click({ timeout: 15000 }).catch(() => {
      throw new Error("HN: click de voto fallo (rate-limit o cambio de layout). Esperar y reintentar a ritmo humano.");
    });
    await p.waitForTimeout(2000);
    return `Upvote enviado a HN item id=${id} (si el score no sube: flag de moderacion o hellban).`;
  });
}

// AVISO: flag es una acción de moderación. Usar solo ante spam real o abuso
// evidente, nunca contra competidores ni en masa (riesgo de hellban/shadowban).
// El flag es click en el enlace <a href="flag?id=<itemId>&auth=..."> con perfil logueado.
export async function hnFlag(itemId: string): Promise<string> {
  const id = (itemId ?? "").trim();
  if (!/^\d+$/.test(id)) throw new Error("HN flag: itemId debe ser numérico (ver hnTop/hnSearch: id=...).");
  return hnPage(async (p) => {
    await p.goto(`https://news.ycombinator.com/item?id=${encodeURIComponent(id)}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(2000);
    if (p.url().includes("login")) {
      await hnLogin(p);
      await p.goto(`https://news.ycombinator.com/item?id=${encodeURIComponent(id)}`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await p.waitForTimeout(2000);
    }
    if (p.url().includes("login")) throw new Error("HN pide login: definir HN_USERNAME/HN_PASSWORD en .env o logear 1 vez en perfil chrome-hn.");
    const flag = p.locator(`a[href*="flag?id=${id}"]`).first();
    if ((await flag.count().catch(() => 0)) === 0) {
      throw new Error("HN: enlace flag no encontrado (ya flaggeado, sin karma suficiente o cambio de layout).");
    }
    await flag.click({ timeout: 15000 }).catch(() => {
      throw new Error("HN: click en flag falló (rate-limit o cambio de layout). Esperar y reintentar a ritmo humano.");
    });
    await p.waitForTimeout(2000);
    return `Flag enviado a HN item id=${id} (uso legítimo: solo spam/abuso real).`;
  });
}
