// Medium: lectura por RSS publico (sin key) + publicar con Integration Token legacy.
// Respuestas por browser: POSIBLE pero Medium Rules lo prohibe explicitamente
// (automatizado = suspension). Solo usar puntual y manual, jamas masivo.
import fs from "node:fs";
import path from "node:path";
import { env, missingCreds } from "../session.js";
import { chromium } from "playwright";
import { MEDIUM_PROFILE, ensureDirs } from "../session.js";

const MED_API = "https://api.medium.com/v1";

function rssItems(xml: string, limit: number): string {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, limit);
  if (items.length === 0) return "Sin articulos.";
  const clean = (s: string) => s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").trim();
  const pick = (block: string, tag: string) => clean((block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)) ?? [])[1] ?? "");
  return items.map((m, i) => `${i + 1}. ${pick(m[1], "title").slice(0, 120)}\n   ${pick(m[1], "link").split("?")[0]}`).join("\n");
}

async function feed(url: string, limit: number): Promise<string> {
  const res = await fetch(url, { headers: { "user-agent": "social-hub/0.3", accept: "application/rss+xml" } });
  if (!res.ok) throw new Error(`Medium RSS HTTP ${res.status}.`);
  return rssItems(await res.text(), limit);
}

export const medTag = (tag: string, limit = 5) => feed(`https://medium.com/feed/tag/${encodeURIComponent(tag)}`, limit);

export const medUser = (username: string, limit = 5) => {
  const u = username.replace(/^@/, "");
  return feed(`https://medium.com/feed/@${encodeURIComponent(u)}`, limit);
};

export async function medPublish(title: string, contentMarkdown: string, tagsCsv?: string, canonicalUrl?: string): Promise<string> {
  const m = missingCreds(["MEDIUM_TOKEN"]);
  // API congelada 2023: no se emiten tokens nuevos; solo legacy
  if (m.length > 0) throw new Error("Falta MEDIUM_TOKEN legacy (Medium ya no emite nuevos; Settings > Security solo si lo tienes).");
  if (title.length > 100) throw new Error("Medium title max 100 chars.");
  const tags = (tagsCsv ?? "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 3);
  for (const t of tags) if (t.length > 25) throw new Error(`Medium tag max 25 chars: "${t}".`);
  const H = { accept: "application/json", "content-type": "application/json", authorization: `Bearer ${env("MEDIUM_TOKEN")}` };
  const me = (await (await fetch("https://api.medium.com/v1/me", { headers: H })).json()) as { data?: { id?: string } };
  const authorId = me.data?.id;
  if (!authorId) throw new Error("Medium /me sin authorId. Revisar token.");
  const body: Record<string, unknown> = { title, contentFormat: "markdown", content: contentMarkdown, publishStatus: "draft" };
  if (tags.length) body.tags = tags;
  if (canonicalUrl) body.canonicalUrl = canonicalUrl;
  const res = await fetch(`https://api.medium.com/v1/users/${authorId}/posts`, { method: "POST", headers: H, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Medium publish HTTP ${res.status}: ${(await res.text()).slice(0, 150)}`);
  const j = (await res.json()) as { data?: { url?: string } };
  return `Borrador en Medium: ${j.data?.url ?? "ok"} (publishStatus=draft por seguridad).`;
}

export async function medRespond(storyUrl: string, text: string): Promise<string> {
  ensureDirs();
  const browser = await chromium.launchPersistentContext(MEDIUM_PROFILE, { headless: false });
  try {
    const page = browser.pages()[0] ?? (await browser.newPage());
    await page.goto(storyUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(4000);
    const respond = page.locator('button:has-text("Respond"), a:has-text("Respond")').first();
    await respond.click({ timeout: 15000 }).catch(() => undefined);
    const editor = page.locator('div[role="textbox"]').first();
    await editor.fill(text, { timeout: 15000 });
    await page.locator('button:has-text("Publish")').first().click({ timeout: 15000 }).catch(() => undefined);
    await page.waitForTimeout(2000);
    await browser.close();
    return "Respuesta enviada (AVISO: Medium prohibe interacciones automatizadas; uso puntual o ban).";
  } catch (e) {
    await browser.close().catch(() => undefined);
    throw e;
  }
}

function medToken(): string {
  const m = missingCreds(["MEDIUM_TOKEN"]);
  // API congelada 2023: no se emiten tokens nuevos; solo legacy
  if (m.length > 0) throw new Error("Falta MEDIUM_TOKEN legacy (Medium ya no emite nuevos; Settings > Security solo si lo tienes).");
  return env("MEDIUM_TOKEN");
}

// authorId vía GET /v1/me (doc oficial Medium/medium-api-docs).
async function medAuthorId(): Promise<{ authorId: string; headers: Record<string, string> }> {
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    authorization: `Bearer ${medToken()}`,
  };
  const res = await fetch(`${MED_API}/me`, { headers });
  if (!res.ok) throw new Error(`Medium /me HTTP ${res.status}. Revisar token.`);
  const me = (await res.json()) as { data?: { id?: string } };
  if (!me.data?.id) throw new Error("Medium /me sin authorId. Revisar token.");
  return { authorId: me.data.id, headers };
}

// Publicaciones del usuario.
// Doc oficial: GET /v1/users/{authorId}/publications (lista editor/writer + seguidas).
export async function medPublications(): Promise<string> {
  const { authorId, headers } = await medAuthorId();
  const res = await fetch(`${MED_API}/users/${encodeURIComponent(authorId)}/publications`, { headers });
  if (!res.ok) throw new Error(`Medium publications HTTP ${res.status}.`);
  const j = (await res.json()) as { data?: Array<{ id?: string; name?: string; url?: string }> };
  const pubs = j.data ?? [];
  if (pubs.length === 0) return "Sin publicaciones.";
  return pubs.map((p, i) => `${i + 1}. ${p.name ?? "?"} id=${p.id ?? "?"} ${p.url ?? ""}`).join("\n");
}

const MED_IMG_MAX = 10 * 1024 * 1024;
const MED_IMG_MIMES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".tiff": "image/tiff",
  ".tif": "image/tiff",
};

// Subida de imagen local.
// Doc oficial: POST /v1/images multipart form-encoded, campo "image"
// (solo jpeg/png/gif/tiff, una imagen por request). Devuelve url.
export async function medImageUpload(localPath: string): Promise<string> {
  const ext = path.extname(localPath).toLowerCase();
  const mime = MED_IMG_MIMES[ext] ?? "";
  if (!mime) throw new Error(`Medium: extensión "${ext || "?"}": solo jpeg/png/gif/tiff.`);
  let size = 0;
  try {
    const st = await fs.promises.stat(localPath);
    if (!st.isFile()) throw new Error(`Medium: "${localPath}" no es un archivo.`);
    size = st.size;
  } catch (e) {
    if (e instanceof Error && e.message.includes("no es un archivo")) throw e;
    throw new Error(`Medium: no existe el archivo "${localPath}".`);
  }
  if (size > MED_IMG_MAX)
    throw new Error(`Medium: ${(size / 1048576).toFixed(1)}MB excede 10MB. Comprimir antes de subir.`);
  const bytes = await fs.promises.readFile(localPath);
  const form = new FormData();
  form.append("image", new Blob([bytes], { type: mime }), path.basename(localPath));
  const res = await fetch(`${MED_API}/images`, {
    method: "POST",
    headers: { authorization: `Bearer ${medToken()}`, accept: "application/json" },
    body: form,
  });
  if (!res.ok) throw new Error(`Medium image HTTP ${res.status}: ${(await res.text()).slice(0, 150)}`);
  const j = (await res.json()) as { data?: { url?: string } };
  if (!j.data?.url) throw new Error("Medium image sin url en respuesta.");
  return j.data.url;
}

// Publicar directamente en una publication.
// Doc oficial: POST /v1/publications/{publicationId}/posts con el mismo body
// que el post de usuario (aquí publishStatus=draft por seguridad; un writer
// solo puede crear draft pendiente de aprobación del editor).
export async function medPublishPub(
  publicationId: string,
  title: string,
  contentMarkdown: string,
  tagsCsv?: string,
  canonicalUrl?: string,
): Promise<string> {
  if (!publicationId) throw new Error("Falta publicationId (ver medPublications).");
  if (!title) throw new Error("Título vacío.");
  if (title.length > 100) throw new Error("Medium title max 100 chars.");
  if (!contentMarkdown) throw new Error("Contenido vacío.");
  const tags = (tagsCsv ?? "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 3);
  for (const t of tags) if (t.length > 25) throw new Error(`Medium tag max 25 chars: "${t}".`);
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    authorization: `Bearer ${medToken()}`,
  };
  const body: Record<string, unknown> = {
    title,
    contentFormat: "markdown",
    content: contentMarkdown,
    publishStatus: "draft",
  };
  if (tags.length) body.tags = tags;
  if (canonicalUrl) body.canonicalUrl = canonicalUrl;
  const res = await fetch(`${MED_API}/publications/${encodeURIComponent(publicationId)}/posts`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Medium publishPub HTTP ${res.status}: ${(await res.text()).slice(0, 150)}`);
  const j = (await res.json()) as { data?: { url?: string } };
  return `Borrador en publication ${publicationId}: ${j.data?.url ?? "ok"} (publishStatus=draft por seguridad).`;
}
