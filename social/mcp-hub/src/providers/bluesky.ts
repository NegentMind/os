// Bluesky via ATProto. Lectura publica con fallback a sesion; escritura con App Password.
// Cubre: search, perfil, post, reply, like, follow, repost, hilos, imagenes, notifs, DMs (list + send).
import fs from "node:fs";
import path from "node:path";
import { env, missingCreds } from "../session.js";

const PDS = process.env.BLUESKY_PDS_URL || "https://bsky.social";
const PUB = "https://public.api.bsky.app";

type Post = { record?: { text?: string }; author?: { handle?: string }; uri?: string; cid?: string };

export type BskyRef = { uri: string; cid: string };
export type BskyBlob = { ref: { $link: string }; mimeType: string; size: number };

function formatPosts(data: unknown, limit: number): string {
  const d = data as { posts?: Post[] };
  const posts = (d.posts ?? []).slice(0, limit);
  if (posts.length === 0) return "Sin resultados.";
  return posts
    .map((p, i) => `${i + 1}. @${p.author?.handle ?? "?"}: ${(p.record?.text ?? "").slice(0, 200)}\n   uri=${p.uri ?? ""} cid=${p.cid ?? ""}`)
    .join("\n");
}

// Sesion cacheada: reusar accessJwt (~minutos), refrescar con refreshJwt,
// solo createSession cuando expira (limite 30/5min, 300/dia).
let sessCache = { token: "", did: "", refresh: "", at: 0 };

async function session(): Promise<{ token: string; did: string }> {
  if (sessCache.token && Date.now() - sessCache.at < 8 * 60 * 1000) return sessCache;
  const missing = missingCreds(["BLUESKY_IDENTIFIER", "BLUESKY_APP_PASSWORD"]);
  if (missing.length > 0) throw new Error(`Falta ${missing.join("/")} (Bluesky > Settings > App passwords).`);
  // Intento refresh primero
  if (sessCache.refresh) {
    try {
      const r = await fetch(`${PDS}/xrpc/com.atproto.server.refreshSession`, {
        method: "POST",
        headers: { authorization: `Bearer ${sessCache.refresh}` },
      });
      if (r.ok) {
        const j = (await r.json()) as { accessJwt: string; refreshJwt: string; did: string };
        sessCache = { token: j.accessJwt, did: j.did, refresh: j.refreshJwt, at: Date.now() };
        return sessCache;
      }
    } catch { /* cae a createSession */ }
  }
  const res = await fetch(`${PDS}/xrpc/com.atproto.server.createSession`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ identifier: env("BLUESKY_IDENTIFIER"), password: env("BLUESKY_APP_PASSWORD") }),
  });
  if (!res.ok) throw new Error(`Bluesky login HTTP ${res.status}.`);
  const j = (await res.json()) as { accessJwt: string; refreshJwt: string; did: string };
  sessCache = { token: j.accessJwt, did: j.did, refresh: j.refreshJwt, at: Date.now() };
  return sessCache;
}

export async function bskySearch(query: string, limit = 5): Promise<string> {
  try {
    const pub = await fetch(`${PUB}/xrpc/app.bsky.feed.searchPosts?q=${encodeURIComponent(query)}&limit=${limit}`, {
      headers: { accept: "application/json" },
    });
    if (pub.ok) return formatPosts(await pub.json(), limit);
  } catch { /* fallback con sesion */ }
  const s = await session();
  const res = await fetch(`${PDS}/xrpc/app.bsky.feed.searchPosts?q=${encodeURIComponent(query)}&limit=${limit}`, {
    headers: { accept: "application/json", authorization: `Bearer ${s.token}` },
  });
  if (!res.ok) throw new Error(`Bluesky search HTTP ${res.status}.`);
  return formatPosts(await res.json(), limit);
}

export async function bskyProfile(handle: string): Promise<string> {
  try {
    const pub = await fetch(`${PUB}/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`);
    if (pub.ok) {
      const p = (await pub.json()) as { displayName?: string; description?: string; followersCount?: number };
      return `${p.displayName ?? handle}\n${(p.description ?? "").slice(0, 300)}\nSeguidores: ${p.followersCount ?? "?"}`;
    }
  } catch { /* fallback */ }
  const s = await session();
  const res = await fetch(`${PDS}/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`, {
    headers: { authorization: `Bearer ${s.token}` },
  });
  if (!res.ok) throw new Error(`Bluesky perfil HTTP ${res.status}.`);
  const p = (await res.json()) as { displayName?: string; description?: string; followersCount?: number };
  return `${p.displayName ?? handle}\n${(p.description ?? "").slice(0, 300)}\nSeguidores: ${p.followersCount ?? "?"}`;
}

async function createRecordRef(collection: string, record: unknown): Promise<BskyRef> {
  const s = await session();
  const res = await fetch(`${PDS}/xrpc/com.atproto.repo.createRecord`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${s.token}` },
    body: JSON.stringify({ repo: s.did, collection, record }),
  });
  if (!res.ok) throw new Error(`Bluesky ${collection} HTTP ${res.status}.`);
  const j = (await res.json()) as { uri?: string; cid?: string };
  if (!j.uri || !j.cid) throw new Error(`Bluesky ${collection}: respuesta sin uri/cid.`);
  return { uri: j.uri, cid: j.cid };
}

async function createRecord(collection: string, record: unknown): Promise<string> {
  await createRecordRef(collection, record);
  return "OK Bluesky.";
}

export const bskyPost = (text: string) =>
  createRecord("app.bsky.feed.post", { text, createdAt: new Date().toISOString() });

export function bskyReply(text: string, parentUri: string, parentCid: string, rootUri?: string, rootCid?: string): Promise<string> {
  if (!parentUri || !parentCid) throw new Error("Reply Bluesky requiere parentUri + parentCid (ver social_search).");
  const root = { uri: rootUri || parentUri, cid: rootCid || parentCid };
  return createRecord("app.bsky.feed.post", {
    text,
    createdAt: new Date().toISOString(),
    reply: { root, parent: { uri: parentUri, cid: parentCid } },
  });
}

export const bskyLike = (uri: string, cid: string) => {
  if (!uri || !cid) throw new Error("Like Bluesky requiere uri + cid.");
  return createRecord("app.bsky.feed.like", { subject: { uri, cid }, createdAt: new Date().toISOString() });
};

export function bskyFollow(did: string): Promise<string> {
  if (!did) throw new Error("Follow Bluesky requiere did del destino.");
  return createRecord("app.bsky.graph.follow", { subject: did, createdAt: new Date().toISOString() });
}

export async function bskyDMs(): Promise<string> {
  const s = await session();
  const res = await fetch(`${PDS}/xrpc/chat.bsky.convo.listConvos?limit=10`, {
    headers: { authorization: `Bearer ${s.token}` },
  });
  if (!res.ok) throw new Error(`Bluesky DMs HTTP ${res.status}.`);
  const j = (await res.json()) as { convos?: Array<{ id?: string; members?: Array<{ handle?: string }> }> };
  const c = j.convos ?? [];
  if (c.length === 0) return "Sin conversaciones.";
  return c.map((x, i) => `${i + 1}. id=${x.id} con ${(x.members ?? []).map((m) => m.handle).join(",")}`).join("\n");
}

export async function bskyDMSend(convoId: string, text: string): Promise<string> {
  const s = await session();
  const res = await fetch(`${PDS}/xrpc/chat.bsky.convo.sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${s.token}` },
    body: JSON.stringify({ convoId, message: { text } }),
  });
  if (!res.ok) throw new Error(`Bluesky DM send HTTP ${res.status}.`);
  return "DM enviado.";
}

// --- Imagenes / repost / hilos / notificaciones ---

const BSKY_IMG_MAX = 2 * 1024 * 1024;
const BSKY_MIMES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function bskyMimeFor(name: string): string {
  const m = BSKY_MIMES[path.extname(name).toLowerCase()] ?? "";
  if (!m) throw new Error(`Imagen Bluesky: solo jpeg/png/webp (archivo "${name}"). Sin redimensionado: convertir antes de subir.`);
  return m;
}

function bskyCheckSize(bytes: number): void {
  if (bytes > BSKY_IMG_MAX)
    throw new Error(`Imagen Bluesky: ${(bytes / 1048576).toFixed(1)}MB excede 2MB. Reducir/comprimir antes (sin redimensionado automatico).`);
}

export async function bskyUploadImage(source: string): Promise<{ blob: BskyBlob; mime: string }> {
  if (!source) throw new Error("Imagen Bluesky: indicar URL https o path local.");
  let bytes: Buffer;
  let name = source;
  if (/^https:\/\//i.test(source)) {
    const r = await fetch(source);
    if (!r.ok) throw new Error(`Imagen Bluesky: descarga HTTP ${r.status} de la URL.`);
    const ct = (r.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    if (ct && !["image/jpeg", "image/png", "image/webp"].includes(ct))
      throw new Error(`Imagen Bluesky: la URL devuelve ${ct}; solo jpeg/png/webp.`);
    bytes = Buffer.from(await r.arrayBuffer());
    try {
      name = new URL(source).pathname.split("/").pop() || source;
    } catch { /* usa source como nombre */ }
  } else {
    let size = 0;
    try {
      const st = await fs.promises.stat(source);
      if (!st.isFile()) throw new Error(`Imagen Bluesky: "${source}" no es un archivo.`);
      size = st.size;
    } catch (e) {
      if (e instanceof Error && e.message.includes("no es un archivo")) throw e;
      throw new Error(`Imagen Bluesky: no existe el archivo local "${source}".`);
    }
    bskyCheckSize(size);
    bytes = await fs.promises.readFile(source);
  }
  const mime = bskyMimeFor(name);
  bskyCheckSize(bytes.length);
  const s = await session();
  const up = await fetch(`${PDS}/xrpc/com.atproto.repo.uploadBlob`, {
    method: "POST",
    headers: { "content-type": mime, authorization: `Bearer ${s.token}` },
    body: new Uint8Array(bytes),
  });
  if (!up.ok) throw new Error(`Bluesky uploadBlob HTTP ${up.status}.`);
  const j = (await up.json()) as { blob?: BskyBlob };
  if (!j.blob?.ref) throw new Error("Bluesky uploadBlob: respuesta sin blob.");
  return { blob: j.blob, mime };
}

export async function bskyPostImage(text: string, imageUrlOrPath: string, alt = ""): Promise<string> {
  if (!text || text.length > 300) throw new Error("Post Bluesky con imagen: texto de 1-300 caracteres.");
  if (!imageUrlOrPath) throw new Error("Post Bluesky con imagen requiere imageUrlOrPath (URL https o path local).");
  const { blob } = await bskyUploadImage(imageUrlOrPath);
  return createRecord("app.bsky.feed.post", {
    text,
    createdAt: new Date().toISOString(),
    embed: { $type: "app.bsky.embed.images", images: [{ alt: alt.slice(0, 1000), image: blob }] },
  });
}

export function bskyRepost(uri: string, cid: string): Promise<string> {
  if (!uri || !cid) throw new Error("Repost Bluesky requiere uri + cid (ver social_search).");
  return createRecord("app.bsky.feed.repost", { subject: { uri, cid }, createdAt: new Date().toISOString() });
}

export async function bskyThread(texts: string[]): Promise<string> {
  if (!texts || texts.length === 0) throw new Error("Hilo Bluesky: lista de textos vacia.");
  if (texts.length > 10) throw new Error("Hilo Bluesky: max 10 posts por hilo.");
  texts.forEach((t, i) => {
    if (!t || t.length > 300) throw new Error(`Hilo Bluesky: post ${i + 1} debe tener 1-300 caracteres.`);
  });
  let root: BskyRef | null = null;
  let parent: BskyRef | null = null;
  for (const text of texts) {
    const record: Record<string, unknown> = { text, createdAt: new Date().toISOString() };
    if (root && parent) record.reply = { root, parent };
    const ref = await createRecordRef("app.bsky.feed.post", record);
    if (!root) root = ref;
    parent = ref;
  }
  return `OK Bluesky: hilo de ${texts.length} posts (root=${root?.uri ?? ""}).`;
}

export async function bskyNotifs(limit = 5): Promise<string> {
  const n = Math.min(Math.max(limit, 1), 50);
  const s = await session();
  const res = await fetch(`${PDS}/xrpc/app.bsky.notification.listNotifications?limit=${n}`, {
    headers: { authorization: `Bearer ${s.token}` },
  });
  if (!res.ok) throw new Error(`Bluesky notificaciones HTTP ${res.status}.`);
  const j = (await res.json()) as {
    notifications?: Array<{ reason?: string; isRead?: boolean; author?: { handle?: string }; record?: { text?: string }; uri?: string }>;
  };
  const list = j.notifications ?? [];
  if (list.length === 0) return "Sin notificaciones.";
  return list
    .map(
      (x, i) =>
        `${i + 1}. [${x.reason ?? "?"}${x.isRead ? "" : " • nueva"}] @${x.author?.handle ?? "?"}: ${(x.record?.text ?? "").slice(0, 160)}\n   uri=${x.uri ?? ""}`
    )
    .join("\n");
}
