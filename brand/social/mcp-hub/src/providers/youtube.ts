// YouTube sin Google key: metadata oEmbed + transcript via Innertube.
// Comentarios por browser con sesion logueada (riesgo medio).
// Subida: via Buffer (Shorts) o Data API con OAuth (no implementado aqui).
import fs from "node:fs";
import { chromium } from "playwright";
import { YT_PROFILE, ensureDirs, env, missingCreds } from "../session.js";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) social-hub/0.1";

const GCP_KEY_STEPS = "Pasos (console.cloud.google.com): crear proyecto > habilitar YouTube Data API v3 > Credenciales > crear API key > export YT_API_KEY=<key>.";

type PlaylistList = { items?: Array<{ id?: string; snippet?: { title?: string; description?: string } }> };

// GET youtube/v3/playlists (docs: developers.google.com/youtube/v3/docs/playlists/list).
// channelId -> playlists del canal; "mine"/"me" -> mine=true (este ultimo exige OAuth, no solo key).
export async function ytPlaylists(channelIdOrMine: string, apiKey?: string): Promise<string> {
  const input = (channelIdOrMine ?? "").trim();
  if (!input) throw new Error("Falta channelIdOrMine (id UC..., playlist PL... o 'mine').");
  const key = (apiKey ?? "").trim() || env("YT_API_KEY");
  if (!key) throw new Error(`Falta YT_API_KEY (o param apiKey). ${GCP_KEY_STEPS}`);
  const params = new URLSearchParams({ part: "snippet,contentDetails", maxResults: "25", key });
  if (input === "mine" || input === "me") params.set("mine", "true");
  else if (/^UC[\w-]{10,}$/.test(input)) params.set("channelId", input);
  else if (/^PL[\w-]{10,}$/.test(input)) params.set("id", input);
  else throw new Error("channelIdOrMine inválido: usar id de canal (UC...), id de playlist (PL...) o 'mine'.");
  const res = await fetch(`https://www.googleapis.com/youtube/v3/playlists?${params.toString()}`, {
    headers: { accept: "application/json" },
  });
  if (res.status === 403) throw new Error("YouTube playlists 403: key sin permiso, cuota agotada o canal restringido.");
  if (!res.ok) throw new Error(`YouTube playlists HTTP ${res.status}. (revisar key, cuota y channelId).`);
  const j = (await res.json()) as PlaylistList;
  const items = j.items ?? [];
  if (items.length === 0) return "Sin playlists en este canal.";
  return items
    .map((p, i) => `${i + 1}. ${p.snippet?.title ?? "?"} (${p.id ?? "?"})${p.snippet?.description ? ` - ${p.snippet.description.slice(0, 100)}` : ""}`)
    .join("\n");
}

const YT_OAUTH_CREDS = ["YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"];
const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024; // 2GB

async function ytAccessToken(): Promise<string> {
  const missing = missingCreds(YT_OAUTH_CREDS);
  if (missing.length > 0) {
    throw new Error(`Falta ${missing.join("/")} (console.cloud.google.com > OAuth client ID > refresh token con scope youtube.upload).`);
  }
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: env("YT_CLIENT_ID"),
    client_secret: env("YT_CLIENT_SECRET"),
    refresh_token: env("YT_REFRESH_TOKEN"),
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`YouTube OAuth HTTP ${res.status}. (revisar client_id/secret y refresh token).`);
  const j = (await res.json()) as { access_token?: string };
  if (!j.access_token) throw new Error("YouTube OAuth sin access_token.");
  return j.access_token;
}

// Subida resumable (docs: .../guides/using_resumable_upload_protocol):
// init POST upload/youtube/v3/videos?uploadType=resumable -> header Location -> PUT bytes.
// opts.publishAt: ISO futuro para estreno programado (status.publishAt).
// opts.tags: csv ("gaming,dev") -> snippet.tags (max 500 chars totales).
export async function ytUpload(
  videoPath: string,
  title: string,
  description = "",
  privacy: "unlisted" | "private" | "public" = "unlisted",
  opts?: { publishAt?: string; tags?: string },
): Promise<string> {
  if (!videoPath) throw new Error("Falta videoPath (ruta local del video).");
  if (!title || !title.trim()) throw new Error("Falta title (1-100 chars).");
  if (title.length > 100) throw new Error("Title max 100 chars (YouTube).");
  if (privacy !== "unlisted" && privacy !== "private" && privacy !== "public") {
    throw new Error("privacy inválida: usar 'unlisted', 'private' o 'public'.");
  }
  let publishAt: string | undefined;
  if (opts?.publishAt !== undefined) {
    const t = opts.publishAt.trim();
    const ms = new Date(t).getTime();
    if (!t || Number.isNaN(ms)) throw new Error("publishAt inválido: usar ISO 8601 futuro (ej: 2026-02-01T10:00:00Z).");
    if (ms <= Date.now()) throw new Error("publishAt debe ser una fecha futura (programar estreno).");
    publishAt = new Date(ms).toISOString();
  }
  let tags: string[] | undefined;
  if (opts?.tags !== undefined) {
    const list = opts.tags.split(",").map((x) => x.trim()).filter(Boolean);
    if (list.join(",").length > 500) throw new Error("tags superan 500 caracteres totales (límite YouTube).");
    if (list.length > 0) tags = list;
  }
  let size: number;
  try {
    const st = fs.statSync(videoPath);
    if (!st.isFile()) throw new Error(`Ruta no es un archivo: ${videoPath}.`);
    size = st.size;
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("Ruta no es un archivo")) throw e;
    throw new Error(`Archivo no encontrado: ${videoPath}.`);
  }
  if (size === 0) throw new Error("Archivo vacío, nada que subir.");
  if (size > MAX_VIDEO_BYTES) throw new Error(`Archivo de ${(size / 1e9).toFixed(2)}GB supera el límite de 2GB.`);
  const access = await ytAccessToken();
  const init = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
    method: "POST",
    headers: {
      authorization: `Bearer ${access}`,
      "content-type": "application/json; charset=UTF-8",
      "X-Upload-Content-Length": String(size),
      "X-Upload-Content-Type": "video/*",
    },
    body: JSON.stringify({
      snippet: { title, description, ...(tags ? { tags } : {}) },
      status: { privacyStatus: privacy, ...(publishAt ? { publishAt } : {}) },
    }),
  });
  if (!init.ok) throw new Error(`YouTube init upload HTTP ${init.status}. (revisar scope youtube.upload y cuota).`);
  const sessionUrl = init.headers.get("location");
  if (!sessionUrl) throw new Error("YouTube no devolvió session URL (reintentar).");
  const data = fs.readFileSync(videoPath);
  const put = await fetch(sessionUrl, {
    method: "PUT",
    headers: { authorization: `Bearer ${access}`, "content-length": String(size), "content-type": "video/*" },
    body: data,
  });
  if (!put.ok) throw new Error(`YouTube upload HTTP ${put.status}. (subida interrumpida: reintentar con resumable).`);
  const j = (await put.json()) as { id?: string };
  if (!j.id) throw new Error("YouTube respondió sin videoId.");
  const extra = publishAt ? ` (estreno programado ${publishAt})` : "";
  return `Video subido: https://youtu.be/${j.id} (privacidad ${privacy})${extra}.`;
}

// Actualiza título/descripción/privacidad de un video propio.
// Docs: PUT https://www.googleapis.com/youtube/v3/videos?part=snippet,status
// con OAuth (scope youtube). Se lee el snippet actual primero porque la API
// exige snippet completo (title + categoryId); luego se fusiona el patch.
export async function ytVideoUpdate(
  videoIdOrUrl: string,
  patch: { title?: string; description?: string; privacy?: "unlisted" | "private" | "public" },
): Promise<string> {
  if (!(videoIdOrUrl ?? "").trim()) throw new Error("Falta videoId (id, URL watch?v=, youtu.be o id).");
  if (!patch || (patch.title === undefined && patch.description === undefined && patch.privacy === undefined))
    throw new Error("Patch vacío: indicar title, description o privacy (al menos uno).");
  if (patch.title !== undefined && (!patch.title.trim() || patch.title.length > 100))
    throw new Error("title inválido: 1-100 caracteres.");
  if (patch.privacy !== undefined && patch.privacy !== "unlisted" && patch.privacy !== "private" && patch.privacy !== "public")
    throw new Error("privacy inválida: usar 'unlisted', 'private' o 'public'.");
  const id = videoId(videoIdOrUrl.trim());
  const access = await ytAccessToken();
  const get = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id=${encodeURIComponent(id)}`, {
    headers: { authorization: `Bearer ${access}`, accept: "application/json" },
  });
  if (!get.ok) throw new Error(`YouTube get video HTTP ${get.status}. (revisar id, cuota y OAuth).`);
  const gj = (await get.json()) as {
    items?: Array<{ snippet?: { title?: string; description?: string; categoryId?: string }; status?: { privacyStatus?: string } }>;
  };
  const cur = gj.items?.[0];
  if (!cur) throw new Error(`YouTube: video ${id} no encontrado o sin acceso (la cuenta OAuth debe ser dueña).`);
  const snippet = {
    title: patch.title ?? cur.snippet?.title ?? "",
    description: patch.description ?? cur.snippet?.description ?? "",
    categoryId: cur.snippet?.categoryId ?? "22",
  };
  if (!snippet.title) throw new Error("YouTube: indicar title (el video no trae título actual).");
  const status = { privacyStatus: patch.privacy ?? cur.status?.privacyStatus ?? "unlisted" };
  const put = await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet,status", {
    method: "PUT",
    headers: { authorization: `Bearer ${access}`, "content-type": "application/json" },
    body: JSON.stringify({ id, snippet, status }),
  });
  if (!put.ok) throw new Error(`YouTube update HTTP ${put.status}: ${(await put.text()).slice(0, 150)} (la cuenta OAuth debe ser dueña del video).`);
  return `Video actualizado: https://youtu.be/${id}`;
}

// Borra un video propio. Docs: DELETE https://www.googleapis.com/youtube/v3/videos?id={id}
// con OAuth (scope youtube). Solo videos de la cuenta OAuth; el resto da 403/404.
export async function ytVideoDelete(videoIdOrUrl: string): Promise<string> {
  if (!(videoIdOrUrl ?? "").trim()) throw new Error("Falta videoId (id, URL watch?v=, youtu.be o id).");
  const id = videoId(videoIdOrUrl.trim());
  const access = await ytAccessToken();
  const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${access}` },
  });
  if (!res.ok) throw new Error(`YouTube delete HTTP ${res.status}: ${(await res.text()).slice(0, 150)} (solo videos propios de la cuenta OAuth).`);
  return `Video eliminado id=${id}.`;
}

export async function youtubeMeta(url: string): Promise<string> {
  const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`YouTube oEmbed HTTP ${res.status}. Verificar URL.`);
  const d = (await res.json()) as { title?: string; author_name?: string };
  return `Titulo: ${d.title ?? "?"} | Canal: ${d.author_name ?? "?"}`;
}

export function videoId(url: string): string {
  const m = url.match(/[?&]v=([\w-]{6,})/) ?? url.match(/youtu\.be\/([\w-]{6,})/) ?? url.match(/^([\w-]{6,})$/);
  if (!m) throw new Error("URL de video no reconocida (watch?v=, youtu.be o id).");
  return m[1];
}

function decode(s: string): string {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

export async function youtubeTranscript(url: string, lang = ""): Promise<string> {
  const id = videoId(url);
  // Via 1 (robusta): Innertube player sin key, server-side, UA browser
  try {
    const pl = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": UA },
      body: JSON.stringify({ videoId: id, context: { client: { clientName: "WEB", clientVersion: "2.20260928" } } }),
    });
    if (pl.ok) {
      const j = (await pl.json()) as { captions?: { playerCaptionsTracklistRenderer?: { captionTracks?: Array<{ baseUrl?: string; languageCode?: string }> } } };
      const tracks = j.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];
      const track = (lang ? tracks.find((t) => t.languageCode === lang) : undefined) ?? tracks[0];
      if (track?.baseUrl) return await timedtext(track.baseUrl);
    }
  } catch { /* via 2 */ }
  // Via 2 (fallback): captionTracks embebidos en el HTML watch
  const html = await (await fetch(`https://www.youtube.com/watch?v=${id}`, { headers: { "user-agent": UA } })).text();
  const m = html.match(/"captionTracks":(\[.*?\])/);
  if (!m) throw new Error("Sin captions (video sin subtitulos, PO_TOKEN/consent o bloqueo IP).");
  const tracks = JSON.parse(m[1]) as Array<{ baseUrl?: string; languageCode?: string }>;
  const track = (lang ? tracks.find((t) => t.languageCode === lang) : undefined) ?? tracks[0];
  if (!track?.baseUrl) throw new Error("Sin pista de subtitulos.");
  return timedtext(track.baseUrl);
}

async function timedtext(baseUrl: string): Promise<string> {
  const sep = baseUrl.includes("?") ? "&" : "?";
  const xml = await (await fetch(`${baseUrl}${sep}fmt=json3`, { headers: { "user-agent": UA } })).text();
  let texts: string[];
  try {
    const j = JSON.parse(xml) as { events?: Array<{ segs?: Array<{ utf8?: string }> }> };
    texts = (j.events ?? []).flatMap((e) => (e.segs ?? []).map((s) => (s.utf8 ?? "").trim())).filter(Boolean);
  } catch {
    texts = [...xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map((x) => decode(x[1].replace(/<[^>]+>/g, "")).trim()).filter(Boolean);
  }
  if (texts.length === 0) throw new Error("Subtitulos vacios.");
  return texts.join("\n").slice(0, 8000);
}

export async function ytComment(videoIdOrUrl: string, text: string): Promise<string> {
  ensureDirs();
  const id = videoId(videoIdOrUrl);
  const browser = await chromium.launchPersistentContext(YT_PROFILE, { headless: false });
  try {
    const page = browser.pages()[0] ?? (await browser.newPage());
    await page.goto(`https://www.youtube.com/watch?v=${id}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(5000);
    if (page.url().includes("accounts.google.com")) throw new Error("YouTube pide login: hacerlo 1 vez en perfil ~/.social-hub/chrome-yt.");
    const box = page.locator("#placeholder-area, #simplebox-placeholder").first();
    await box.click({ timeout: 15000 }).catch(() => undefined);
    const editor = page.locator("#contenteditable-root, div[role='textbox']").first();
    await editor.fill(text, { timeout: 15000 });
    await page.locator("#submit-button button").first().click({ timeout: 15000 }).catch(() => undefined);
    await page.waitForTimeout(2000);
    await browser.close();
    return "Comentario enviado a YouTube.";
  } catch (e) {
    await browser.close().catch(() => undefined);
    throw e;
  }
}

// Like best-effort en watch: selectores por aria-label (el DOM de YouTube rota).
// Requiere sesion logueada en perfil ~/.social-hub/chrome-yt.
export async function ytLike(videoIdOrUrl: string): Promise<string> {
  ensureDirs();
  const id = videoId(videoIdOrUrl);
  const browser = await chromium.launchPersistentContext(YT_PROFILE, { headless: false });
  try {
    const page = browser.pages()[0] ?? (await browser.newPage());
    await page.goto(`https://www.youtube.com/watch?v=${id}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(5000);
    if (page.url().includes("accounts.google.com")) throw new Error("YouTube pide login: hacerlo 1 vez en perfil ~/.social-hub/chrome-yt.");
    const like = page.locator(
      'ytd-toggle-button-renderer button[aria-label*="Like"], ' +
      'button[aria-label*="Like this video"], button[aria-label*="Me gusta"], ' +
      'button[aria-label*="like this video together"]'
    ).first();
    if ((await like.count().catch(() => 0)) === 0) throw new Error("YouTube: boton like no encontrado (layout cambiado o video con likes desactivados).");
    await like.click({ timeout: 15000 }).catch(() => {
      throw new Error("YouTube: click de like fallo (pide login o rate-limit).");
    });
    await page.waitForTimeout(1500);
    await browser.close();
    return "Like enviado en YouTube.";
  } catch (e) {
    await browser.close().catch(() => undefined);
    throw e;
  }
}

function channelUrl(input: string): string {
  const t = input.trim();
  if (/^https?:\/\//.test(t)) return t;
  if (t.startsWith("@")) return `https://www.youtube.com/${t}`;
  if (/^UC[\w-]{10,}$/.test(t)) return `https://www.youtube.com/channel/${t}`;
  return `https://www.youtube.com/@${t.replace(/^@/, "")}`;
}

// Subscribe best-effort en pagina del canal. Requiere login en chrome-yt.
export async function ytSubscribe(channelUrlOrHandle: string): Promise<string> {
  ensureDirs();
  const url = channelUrl(channelUrlOrHandle);
  const browser = await chromium.launchPersistentContext(YT_PROFILE, { headless: false });
  try {
    const page = browser.pages()[0] ?? (await browser.newPage());
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(5000);
    if (page.url().includes("accounts.google.com")) throw new Error("YouTube pide login: hacerlo 1 vez en perfil ~/.social-hub/chrome-yt.");
    const sub = page.getByRole("button", { name: /subscribe|suscribir/i }).first();
    if ((await sub.count().catch(() => 0)) === 0) throw new Error("YouTube: boton subscribe no encontrado (ya suscrito, canal inexistente o layout cambiado).");
    const label = ((await sub.textContent().catch(() => "")) ?? "").toLowerCase();
    if (/subscribed| suscrito/.test(label)) {
      await browser.close();
      return "Ya suscrito a este canal.";
    }
    await sub.click({ timeout: 15000 }).catch(() => {
      throw new Error("YouTube: click de subscribe fallo (pide login).");
    });
    await page.waitForTimeout(1500);
    await browser.close();
    return "Suscripcion enviada en YouTube.";
  } catch (e) {
    await browser.close().catch(() => undefined);
    throw e;
  }
}
