// Dev.to (forem) API publica. Lectura sin key; publicar con API key gratis
// (dev.to > Settings > Extensions). Comentarios solo por browser (sin POST en API).
import { env, missingCreds } from "../session.js";
import { chromium } from "playwright";
import { DEVTO_PROFILE, ensureDirs } from "../session.js";

const API = "https://dev.to/api";
const H = { accept: "application/vnd.forem.api-v1+json" };

type Article = { id?: number; title?: string; description?: string; url?: string; tag_list?: string[]; user?: { username?: string } };

function fmt(list: Article[], limit: number): string {
  const items = list.slice(0, limit);
  if (items.length === 0) return "Sin articulos.";
  return items.map((a, i) => `${i + 1}. ${a.title ?? "?"} — @${a.user?.username ?? "?"} [${(a.tag_list ?? []).join(",")}]\n   ${a.url ?? ""}`).join("\n");
}

export async function devLatest(tag: string, limit = 5): Promise<string> {
  const q = tag && tag !== "all" ? `&tag=${encodeURIComponent(tag)}` : "";
  const res = await fetch(`${API}/articles?per_page=${limit}${q}`, { headers: H });
  if (!res.ok) throw new Error(`Dev.to HTTP ${res.status}.`);
  return fmt((await res.json()) as Article[], limit);
}

export async function devSearch(query: string, limit = 5): Promise<string> {
  // Busqueda full-text oficial V1 (titulo/tags/cuerpo)
  const res = await fetch(`${API}/articles/search?q=${encodeURIComponent(query)}&per_page=${limit}`, { headers: H });
  if (!res.ok) throw new Error(`Dev.to search HTTP ${res.status}.`);
  const j = (await res.json()) as { result?: Article[] } | Article[];
  const list = Array.isArray(j) ? j : (j.result ?? []);
  return fmt(list, limit);
}

export async function devShow(id: string): Promise<string> {
  const res = await fetch(`${API}/articles/${encodeURIComponent(id)}`, { headers: H });
  if (!res.ok) throw new Error(`Dev.to show HTTP ${res.status}.`);
  const a = (await res.json()) as Article & { body_markdown?: string };
  return `${a.title ?? "?"}\n${(a.description ?? "").slice(0, 300)}\n${a.url ?? ""}\n---\n${(a.body_markdown ?? "").slice(0, 2000)}`;
}

export async function devUser(username: string, limit = 5): Promise<string> {
  const res = await fetch(`${API}/articles?username=${encodeURIComponent(username.replace(/^@/, ""))}&per_page=${limit}`, { headers: H });
  if (!res.ok) throw new Error(`Dev.to user HTTP ${res.status}.`);
  return fmt((await res.json()) as Article[], limit);
}

export async function devPublish(title: string, bodyMarkdown: string, tagsCsv?: string, published = false, series?: string): Promise<string> {
  const m = missingCreds(["DEVTO_API_KEY"]);
  if (m.length > 0) throw new Error("Falta DEVTO_API_KEY (dev.to > Settings > Extensions).");
  const tags = (tagsCsv ?? "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 4);
  // Draft primero por seguridad (POST 10/30s); publicar con PUT despues de revisar
  const article: Record<string, unknown> = { title, body_markdown: bodyMarkdown, published, tags };
  if (series) article.series = series;
  const res = await fetch(`${API}/articles`, {
    method: "POST",
    headers: { ...H, "content-type": "application/json", "api-key": env("DEVTO_API_KEY") },
    body: JSON.stringify({ article }),
  });
  if (res.status === 429) throw new Error("Dev.to 429: max 10 posts/30s. Esperar y reintentar.");
  if (!res.ok) throw new Error(`Dev.to publish HTTP ${res.status}: ${(await res.text()).slice(0, 150)}`);
  const a = (await res.json()) as { url?: string };
  return published ? `Publicado en Dev.to: ${a.url ?? "ok"}` : `Borrador en Dev.to: ${a.url ?? "ok"} (revisar y publicar con PUT).`;
}

export async function devDelete(id: string): Promise<string> {
  const m = missingCreds(["DEVTO_API_KEY"]);
  if (m.length > 0) throw new Error("Falta DEVTO_API_KEY.");
  const res = await fetch(`${API}/articles/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...H, "api-key": env("DEVTO_API_KEY") },
  });
  // Verificado en vivo (oct-2026): la API publica NO borra articulos (404).
  // Alternativa: despublicar con devUpdate({published:false}) o borrar en web.
  if (res.status === 404) {
    throw new Error(
      "Dev.to API no soporta borrar articulos (DELETE da 404). Opciones: devto-update con published=false (queda draft), o borrar desde https://dev.to/dashboard."
    );
  }
  if (!res.ok) throw new Error(`Dev.to delete HTTP ${res.status}.`);
  return "Articulo eliminado.";
}

export async function devComment(articleIdOrUrl: string, body: string): Promise<string> {
  ensureDirs();
  const browser = await chromium.launchPersistentContext(DEVTO_PROFILE, { headless: false });
  try {
    const page = browser.pages()[0] ?? (await browser.newPage());
    const url = articleIdOrUrl.startsWith("http") ? articleIdOrUrl : `https://dev.to/a/${encodeURIComponent(articleIdOrUrl)}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(3000);
    if (page.url().includes("/enter")) throw new Error("Dev.to pide login: hacerlo 1 vez en perfil ~/.social-hub/chrome-devto.");
    const area = page.locator('textarea[name="comment[body_markdown]"]').first();
    await area.click({ timeout: 15000 }).catch(() => undefined);
    await area.fill(body, { timeout: 15000 });
    await page.click('button:has-text("Submit")', { timeout: 15000 }).catch(() => undefined);
    await page.waitForTimeout(2000);
    await browser.close();
    return "Comentario enviado a Dev.to (prohibidos bots de comentarios masivos).";
  } catch (e) {
    await browser.close().catch(() => undefined);
    throw e;
  }
}

function devKey(): string {
  const m = missingCreds(["DEVTO_API_KEY"]);
  if (m.length > 0) throw new Error("Falta DEVTO_API_KEY (dev.to > Settings > Extensions).");
  return env("DEVTO_API_KEY");
}

// Escritura V1 con un reintento tras espera ante 429 (POST 10/30s, PUT 30/30s).
async function devWrite(path: string, method: "POST" | "PUT", payload?: unknown): Promise<Response> {
  const call = () =>
    fetch(`${API}${path}`, {
      method,
      headers: { ...H, "content-type": "application/json", "api-key": devKey() },
      body: payload === undefined ? undefined : JSON.stringify(payload),
    });
  let res = await call();
  if (res.status === 429) {
    const hdr = res.headers.get("retry-after");
    const secs = hdr ? Number(hdr) : NaN;
    const wait = Number.isFinite(secs) && secs > 0 ? Math.min(secs * 1000 + 500, 35000) : method === "PUT" ? 30000 : 10000;
    await new Promise((r) => setTimeout(r, wait));
    res = await call();
    if (res.status === 429) {
      throw new Error(`Dev.to 429 persistente en ${method} ${path}: limite ${method === "PUT" ? "30/30s" : "10/30s"}. Esperar y reintentar.`);
    }
  }
  return res;
}

export async function devUpdate(
  id: string,
  patch: { title?: string; body?: string; tagsCsv?: string; published?: boolean },
): Promise<string> {
  if (!id) throw new Error("Falta id del articulo.");
  const article: Record<string, unknown> = {};
  if (patch.title !== undefined) article.title = patch.title;
  if (patch.body !== undefined) article.body_markdown = patch.body;
  if (patch.tagsCsv !== undefined) {
    article.tags = patch.tagsCsv.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 4);
  }
  if (patch.published !== undefined) article.published = patch.published;
  if (Object.keys(article).length === 0) throw new Error("Patch vacio: indicar title/body/tagsCsv/published.");
  const res = await devWrite(`/articles/${encodeURIComponent(id)}`, "PUT", { article });
  if (!res.ok) throw new Error(`Dev.to update HTTP ${res.status}: ${(await res.text()).slice(0, 150)} (la key debe ser del autor).`);
  const a = (await res.json()) as { url?: string };
  return `Articulo Dev.to actualizado: ${a.url ?? id}`;
}

export async function devFollow(kind: "Tag" | "User", value: string): Promise<string> {
  if (!value) throw new Error("Falta value (username o id numerico).");
  if (kind === "Tag") {
    throw new Error("Dev.to V1 no expone seguir tags (solo lista GET /api/follows/tags). Seguir el tag en web: dev.to/t/" + encodeURIComponent(value));
  }
  // User: resolver username -> id (GET /api/users/{id} acepta username) y POST /api/follows {user_ids}.
  let userId: number;
  if (/^\d+$/.test(value)) {
    userId = Number(value);
  } else {
    const res = await fetch(`${API}/users/${encodeURIComponent(value.replace(/^@/, ""))}`, { headers: H });
    if (res.status === 404) throw new Error(`Dev.to: usuario @${value} no existe.`);
    if (!res.ok) throw new Error(`Dev.to user HTTP ${res.status}.`);
    const u = (await res.json()) as { id?: number };
    if (!u.id) throw new Error(`Dev.to: sin id para @${value}.`);
    userId = u.id;
  }
  const res = await devWrite("/follows", "POST", { user_ids: [userId] });
  if (!res.ok) throw new Error(`Dev.to follow HTTP ${res.status}: ${(await res.text()).slice(0, 150)}`);
  return `Siguiendo a @${value} en Dev.to.`;
}

export async function devReact(category: string, reactableId: number, reactableType: "Article" | "Comment"): Promise<string> {
  const valid = ["like", "unicorn", "exploding_head", "raised_hands", "fire"];
  if (!valid.includes(category)) throw new Error(`category invalida: usar ${valid.join("/")}.`);
  if (!reactableId) throw new Error("Falta reactableId (id numerico del articulo/comentario).");
  const q = `?category=${encodeURIComponent(category)}&reactable_id=${reactableId}&reactable_type=${reactableType}`;
  const res = await devWrite(`/reactions${q}`, "POST");
  if (!res.ok) throw new Error(`Dev.to react HTTP ${res.status}: ${(await res.text()).slice(0, 150)}`);
  return `Reaccion ${category} registrada en ${reactableType} ${reactableId}.`;
}

// Artículos de una organización.
// Endpoint verificado en developers.forem.com/api/v1 ("Organization's Articles"):
//   GET /api/organizations/{organization_id_or_username}/articles
// (NO existe /api/articles?organization_id ni /api/organization/articles.)
export async function devOrg(slug: string, limit = 5): Promise<string> {
  const org = (slug ?? "").trim().replace(/^@/, "");
  if (!org) throw new Error("Falta slug de la organización (ej: devteam).");
  const n = Math.min(Math.max(limit, 1), 30);
  const res = await fetch(`${API}/organizations/${encodeURIComponent(org)}/articles?per_page=${n}`, { headers: H });
  if (res.status === 404) throw new Error(`Dev.to: organización @${org} no existe.`);
  if (!res.ok) throw new Error(`Dev.to org HTTP ${res.status}.`);
  return fmt((await res.json()) as Article[], n);
}

// Reading list del usuario autenticado.
// Endpoint verificado en developers.forem.com/api/v1 ("readinglist: get Readinglist"):
//   GET /api/readinglist (requiere api-key del usuario).
export async function devReadingList(limit = 5): Promise<string> {
  const key = devKey();
  const n = Math.min(Math.max(limit, 1), 30);
  const res = await fetch(`${API}/readinglist?per_page=${n}`, {
    headers: { ...H, "api-key": key },
  });
  if (!res.ok) throw new Error(`Dev.to readinglist HTTP ${res.status}. (la key debe ser del usuario).`);
  return fmt((await res.json()) as Article[], n);
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Analytics del usuario autenticado — endpoints verificados en
// developers.forem.com/api/v1 (sección "analytics"):
//   totals, historical (start requerido), past_day, referrers,
//   top_contributors, follower_engagement, dashboard, heatmap.
// Todos requieren api-key del usuario.
export type DevAnalyticsKind =
  | "totals" | "history" | "past_day" | "referrers"
  | "top_contributors" | "follower_engagement" | "dashboard" | "heatmap";

export async function devAnalytics(
  kind: DevAnalyticsKind = "totals",
  opts?: { articleId?: number; organizationId?: number; start?: string; end?: string },
): Promise<string> {
  const valid: DevAnalyticsKind[] = ["totals", "history", "past_day", "referrers", "top_contributors", "follower_engagement", "dashboard", "heatmap"];
  if (!valid.includes(kind)) throw new Error(`kind inválido: usar ${valid.join("|")}.`);
  const key = devKey();
  const path = kind === "history" ? "historical" : kind;
  const q = new URLSearchParams();
  const withRange: DevAnalyticsKind[] = ["history", "referrers", "top_contributors", "dashboard", "follower_engagement"];
  if (withRange.includes(kind)) {
    q.set("start", opts?.start ?? ymd(new Date(Date.now() - 30 * 86400000)));
    q.set("end", opts?.end ?? ymd(new Date()));
  }
  if (kind === "heatmap") q.set("end", opts?.end ?? ymd(new Date()));
  if (opts?.articleId) q.set("article_id", String(opts.articleId));
  if (opts?.organizationId) q.set("organization_id", String(opts.organizationId));
  const qs = q.toString();
  const res = await fetch(`${API}/analytics/${path}${qs ? `?${qs}` : ""}`, { headers: { ...H, "api-key": key } });
  if (res.status === 401) throw new Error("Dev.to analytics 401: api-key inválida o revocada (dev.to > Settings > Extensions).");
  if (!res.ok) throw new Error(`Dev.to analytics HTTP ${res.status}.`);
  const j: unknown = await res.json();
  const s = JSON.stringify(j);
  if (!s || s === "null" || s === "{}" || s === "[]")
    return "Sin datos de analytics (cuenta nueva o sin artículos).";
  return `Dev.to analytics (${kind}): ${s.slice(0, 2000)}`;
}

// Perfil del usuario autenticado (GET /api/users/me, api-key).
export async function devMe(): Promise<string> {
  const key = devKey();
  const res = await fetch(`${API}/users/me`, { headers: { ...H, "api-key": key } });
  if (res.status === 401) throw new Error("Dev.to /users/me 401: api-key inválida.");
  if (!res.ok) throw new Error(`Dev.to me HTTP ${res.status}.`);
  const u = (await res.json()) as { username?: string; name?: string; summary?: string; followers_count?: number };
  return `@${u.username ?? "?"} (${u.name ?? ""})\nSeguidores: ${u.followers_count ?? "?"}\n${(u.summary ?? "").slice(0, 300)}`;
}

// Mis articulos: GET /api/articles/me/{kind} (api-key). kind: all|published|unpublished.
export async function devMyArticles(kind: "all" | "published" | "unpublished" = "all", limit = 10): Promise<string> {
  const key = devKey();
  const n = Math.min(Math.max(limit, 1), 30);
  const path = kind === "all" ? "me/all" : kind === "published" ? "me/published" : "me/unpublished";
  const res = await fetch(`${API}/articles/${path}?per_page=${n}`, { headers: { ...H, "api-key": key } });
  if (!res.ok) throw new Error(`Dev.to ${path} HTTP ${res.status}. (la key debe ser del usuario)`);
  const list = (await res.json()) as Article[];
  if (list.length === 0) return `Sin articulos (${kind}).`;
  return list.map((a, i) => `${i + 1}. ${a.title ?? "?"} ${a.url ? `\n   ${a.url}` : ""}`).join("\n");
}

// Comentarios de un articulo (GET /api/comments?a_id=, publico sin key).
// Devuelve arbol aplanado con indentacion.
export async function devComments(articleId: string, limit = 10): Promise<string> {
  const id = (articleId ?? "").trim();
  if (!/^\d+$/.test(id)) throw new Error("devComments requiere a_id numerico (ver social_article devto: id).");
  const res = await fetch(`${API}/comments?a_id=${id}`, { headers: H });
  if (res.status === 404) throw new Error("Dev.to: articulo sin comentarios o no existe.");
  if (!res.ok) throw new Error(`Dev.to comments HTTP ${res.status}.`);
  type C = { id_code?: string; body_html?: string; user?: { username?: string }; children?: C[] };
  const tree = (await res.json()) as C[];
  const flat: string[] = [];
  const walk = (nodes: C[], depth: number): void => {
    for (const c of nodes) {
      if (flat.length >= limit) return;
      const body = (c.body_html ?? "").replace(/<[^>]+>/g, "").trim().slice(0, 200);
      flat.push(`${"  ".repeat(depth)}@${c.user?.username ?? "?"}: ${body}`);
      if (c.children?.length) walk(c.children, depth + 1);
    }
  };
  walk(tree, 0);
  if (flat.length === 0) return "Sin comentarios.";
  return `# Comentarios articulo ${id}\n` + flat.join("\n");
}

// Tags populares (GET /api/tags, publico).
export async function devTags(limit = 10): Promise<string> {
  const n = Math.min(Math.max(limit, 1), 30);
  const res = await fetch(`${API}/tags?per_page=${n}`, { headers: H });
  if (!res.ok) throw new Error(`Dev.to tags HTTP ${res.status}.`);
  const list = (await res.json()) as Array<{ name?: string }>;
  if (list.length === 0) return "Sin tags.";
  return list.map((t, i) => `${i + 1}. #${t.name ?? "?"}`).join("\n");
}

// Tags que sigo (GET /api/follows/tags, api-key).
export async function devFollowedTags(): Promise<string> {
  const key = devKey();
  const res = await fetch(`${API}/follows/tags`, { headers: { ...H, "api-key": key } });
  if (!res.ok) throw new Error(`Dev.to followed tags HTTP ${res.status}.`);
  const list = (await res.json()) as Array<{ name?: string; points?: number }>;
  if (list.length === 0) return "No sigues ningun tag.";
  return list.map((t, i) => `${i + 1}. #${t.name ?? "?"} (${t.points ?? 0} pts)`).join("\n");
}

// Mis seguidores (GET /api/followers/users, api-key).
export async function devFollowers(limit = 10, sort = "-created_at"): Promise<string> {
  const key = devKey();
  const n = Math.min(Math.max(limit, 1), 30);
  const res = await fetch(`${API}/followers/users?per_page=${n}&sort=${encodeURIComponent(sort)}`, { headers: { ...H, "api-key": key } });
  if (!res.ok) throw new Error(`Dev.to followers HTTP ${res.status}.`);
  const list = (await res.json()) as Array<{ username?: string; name?: string }>;
  if (list.length === 0) return "Sin seguidores.";
  return list.map((u, i) => `${i + 1}. @${u.username ?? "?"} (${u.name ?? ""})`).join("\n");
}

// Toggle reaccion (POST /api/reactions/toggle) — quita si ya existe.
export async function devReactToggle(category: string, reactableId: number, reactableType: "Article" | "Comment"): Promise<string> {
  const valid = ["like", "unicorn", "exploding_head", "raised_hands", "fire"];
  if (!valid.includes(category)) throw new Error(`category invalida: usar ${valid.join("/")}.`);
  if (!reactableId) throw new Error("Falta reactableId (id numerico).");
  const q = `?category=${encodeURIComponent(category)}&reactable_id=${reactableId}&reactable_type=${reactableType}`;
  const res = await devWrite(`/reactions/toggle${q}`, "POST");
  if (!res.ok) throw new Error(`Dev.to react toggle HTTP ${res.status}: ${(await res.text()).slice(0, 150)}`);
  return `Reaccion ${category} alternada (toggle) en ${reactableType} ${reactableId}.`;
}

// Articulos con video (GET /api/videos, publico).
export async function devVideos(limit = 5): Promise<string> {
  const n = Math.min(Math.max(limit, 1), 24);
  const res = await fetch(`${API}/videos?per_page=${n}`, { headers: H });
  if (!res.ok) throw new Error(`Dev.to videos HTTP ${res.status}.`);
  return fmt((await res.json()) as Article[], n);
}

// Tendencias (GET /api/trends, publico).
export async function devTrends(limit = 10): Promise<string> {
  const n = Math.min(Math.max(limit, 1), 30);
  const res = await fetch(`${API}/trends?per_page=${n}`, { headers: H });
  if (!res.ok) throw new Error(`Dev.to trends HTTP ${res.status}.`);
  const list = (await res.json()) as Array<{ name?: string; slug?: string; articles_count?: number; description?: string }>;
  if (list.length === 0) return "Sin tendencias.";
  return list.map((t, i) => `${i + 1}. ${t.name ?? t.slug ?? "?"} (${t.articles_count ?? 0} articulos)\n   ${(t.description ?? "").slice(0, 120)}`).join("\n");
}

// Despublicar articulo (PUT /api/articles/:id/unpublish) — solo admin/moderador.
export async function devUnpublish(id: string, note?: string): Promise<string> {
  if (!/^\d+$/.test(id ?? "")) throw new Error("devUnpublish requiere id numerico del articulo.");
  const q = note ? `?note=${encodeURIComponent(note)}` : "";
  const res = await devWrite(`/articles/${id}/unpublish${q}`, "PUT");
  if (res.status === 401) throw new Error("Dev.to unpublish 401: requiere api-key con rol admin/moderador.");
  if (!res.ok) throw new Error(`Dev.to unpublish HTTP ${res.status}.`);
  return `Articulo ${id} despublicado (vuelve a draft del autor).`;
}
