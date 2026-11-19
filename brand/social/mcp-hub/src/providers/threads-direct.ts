// Threads API (Meta, graph.threads.net/v1.0). Publicacion de texto en 2 pasos
// (contenedor -> espera -> publish) + consulta de cuota.
// Requiere: app Meta con producto Threads, usuario que acepto los permisos y App Review.
// Env: THREADS_USER_ID (ID numerico del usuario), THREADS_TOKEN.
import { env, missingCreds } from "../session.js";
import { sleep } from "../http.js";

const API = "https://graph.threads.net/v1.0";

const SETUP =
  "Setup: app Meta con producto Threads + permisos threads_basic, threads_content_publish " +
  "autorizados por el usuario. Guia: developers.facebook.com/docs/threads.";

function creds(): { userId: string; token: string } {
  const m = missingCreds(["THREADS_USER_ID", "THREADS_TOKEN"]);
  if (m.length > 0) throw new Error(`Falta ${m.join("/")} en .env. ${SETUP}`);
  return { userId: env("THREADS_USER_ID"), token: env("THREADS_TOKEN") };
}

type ThreadsErr = { error?: { message?: string; code?: number; error_subcode?: number } };

async function threadsErr(res: Response, ctx: string): Promise<never> {
  let msg = "";
  try {
    const j = (await res.json()) as ThreadsErr;
    msg = j.error?.message ?? JSON.stringify(j).slice(0, 200);
  } catch {
    msg = await res.text().catch(() => "");
  }
  throw new Error(`Threads ${ctx} HTTP ${res.status}: ${msg.slice(0, 200)}. ${SETUP}`);
}

export async function thPost(text: string, link?: string): Promise<string> {
  const { userId, token } = creds();
  if (!text) throw new Error("thPost necesita texto.");
  // v1.0 no documenta un param separado de link-attachment para posts TEXT:
  // la URL incluida en el texto genera la tarjeta de vista previa.
  const full = link ? `${text}\n${link}` : text;
  if (full.length > 500) throw new Error(`Threads max 500 caracteres (van ${full.length}). Acorta con splitThread.`);
  const create = await fetch(`${API}/${userId}/threads`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ media_type: "TEXT", text: full, access_token: token }),
  });
  if (!create.ok) await threadsErr(create, "crear contenedor");
  const c = (await create.json()) as { id?: string };
  if (!c.id) throw new Error("Threads no devolvio id de contenedor. Revisa permisos.");
  await sleep(30000); // el contenedor tarda ~30s en estar publicable
  const pub = await fetch(`${API}/${c.id}/threads_publish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ access_token: token }),
  });
  if (!pub.ok) await threadsErr(pub, "publicar");
  const p = (await pub.json()) as { id?: string };
  return `Publicado en Threads id=${p.id ?? "?"}`;
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov)(\?|#|$)/i.test(url.split("?")[0]);
}

// Crea un contenedor (hijo o carrusel) via POST /{userId}/threads.
// Documentado en developers.facebook.com/docs/threads/posts y
// developers.facebook.com/docs/threads/reference/publishing.
async function createContainer(userId: string, token: string, body: Record<string, unknown>): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API}/${userId}/threads`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ access_token: token, ...body }),
    });
  } catch {
    throw new Error("Threads: fallo de red hacia graph.threads.net.");
  }
  if (!res.ok) await threadsErr(res, "crear contenedor");
  const c = (await res.json()) as { id?: string };
  if (!c.id) throw new Error("Threads no devolvio id de contenedor. Revisa permisos.");
  return c.id;
}

// Publica un contenedor via POST /{userId}/threads_publish con creation_id
// (flujo documentado; esperar ~30s a que el contenedor este publicable).
async function publishContainer(userId: string, token: string, creationId: string): Promise<string> {
  await sleep(30000);
  let pub: Response;
  try {
    pub = await fetch(`${API}/${userId}/threads_publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ creation_id: creationId, access_token: token }),
    });
  } catch {
    throw new Error("Threads: fallo de red al publicar en graph.threads.net.");
  }
  if (!pub.ok) await threadsErr(pub, "publicar");
  const p = (await pub.json()) as { id?: string };
  return p.id ?? "?";
}

// Carrusel: 1) un contenedor hijo por imagen/video (is_carousel_item=true),
// 2) un contenedor CAROUSEL con children=ids separados por coma,
// 3) publish del contenedor carrusel. Min 2 / max 20 hijos (cuenta como 1 post).
export async function thCarousel(imageUrls: string[], caption?: string): Promise<string> {
  if (!Array.isArray(imageUrls) || imageUrls.length < 2) {
    throw new Error("thCarousel necesita al menos 2 imageUrls (minimo del carrusel).");
  }
  if (imageUrls.length > 20) throw new Error(`thCarousel max 20 hijos (van ${imageUrls.length}).`);
  for (const u of imageUrls) {
    if (!/^https?:\/\//i.test(u ?? "")) {
      throw new Error(`thCarousel necesita URLs publicas http(s): "${String(u ?? "").slice(0, 80)}". Sube el archivo primero con uploadMedia.`);
    }
  }
  if (caption && caption.length > 500) throw new Error(`Threads max 500 caracteres (van ${caption.length}). Acorta con splitThread.`);
  const { userId, token } = creds();
  const ids: string[] = [];
  for (const u of imageUrls) {
    ids.push(
      await createContainer(
        userId,
        token,
        isVideoUrl(u)
          ? { media_type: "VIDEO", video_url: u, is_carousel_item: true }
          : { media_type: "IMAGE", image_url: u, is_carousel_item: true }
      )
    );
  }
  const carouselId = await createContainer(userId, token, {
    media_type: "CAROUSEL",
    children: ids.join(","),
    ...(caption ? { text: caption } : {}),
  });
  const id = await publishContainer(userId, token, carouselId);
  return `Carrusel publicado en Threads id=${id} (${ids.length} hijos).`;
}

// Respuesta a un post: el parametro documentado es reply_to_id
// (developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies).
// No existe reply_to_parent_id en la API: se usa reply_to_id.
export async function thReply(parentId: string, text: string): Promise<string> {
  if (!(parentId ?? "").trim()) throw new Error("thReply necesita parentId (id del post a responder).");
  if (!(text ?? "").trim()) throw new Error("thReply necesita texto.");
  if (text.length > 500) throw new Error(`Threads max 500 caracteres (van ${text.length}). Acorta con splitThread.`);
  const { userId, token } = creds();
  const containerId = await createContainer(userId, token, {
    media_type: "TEXT",
    text,
    reply_to_id: parentId.trim(),
  });
  const id = await publishContainer(userId, token, containerId);
  return `Respuesta publicada en Threads id=${id} (padre=${parentId.trim()}).`;
}

// Encuesta en un post de texto — endpoint verificado en:
// https://developers.facebook.com/documentation/threads/create-posts/polls
// POST /{threads-user-id}/threads con media_type=TEXT + text=pregunta +
// poll_attachment={option_a..option_d} (2-4 opciones, 1-25 chars c/u;
// solo posts de texto), luego publish del contenedor. La lectura de votos
// se hace con GET /{media-id}?fields=...poll_attachment{...} (no se expone
// votar por API: los votos son de usuarios en app/web).
export async function thPoll(question: string, options: string[]): Promise<string> {
  const q = (question ?? "").trim();
  if (!q) throw new Error("thPoll necesita question (1-500 caracteres).");
  if (q.length > 500) throw new Error(`Threads max 500 caracteres (van ${q.length}). Acorta con splitThread.`);
  if (!Array.isArray(options) || options.length < 2 || options.length > 4)
    throw new Error("thPoll necesita 2-4 opciones.");
  const clean = options.map((o) => (o ?? "").trim());
  if (clean.some((o) => !o)) throw new Error("thPoll: hay opciones vacías (cada opción 1-25 caracteres).");
  if (clean.some((o) => o.length > 25)) throw new Error("thPoll: cada opción admite máximo 25 caracteres.");
  const { userId, token } = creds();
  const keys = ["option_a", "option_b", "option_c", "option_d"];
  const poll: Record<string, string> = {};
  clean.forEach((opt, i) => {
    poll[keys[i]] = opt;
  });
  const containerId = await createContainer(userId, token, {
    media_type: "TEXT",
    text: q,
    poll_attachment: poll,
  });
  const id = await publishContainer(userId, token, containerId);
  return `Encuesta publicada en Threads id=${id} (${clean.length} opciones).`;
}

export async function thLimit(): Promise<string> {
  const { userId, token } = creds();
  const res = await fetch(
    `${API}/${userId}/threads_publishing_limit?fields=quota_usage,reply_quota_usage,rate_limit_settings&access_token=${token}`
  );
  if (!res.ok) await threadsErr(res, "consultar cuota");
  const j = (await res.json()) as { quota_usage?: unknown; reply_quota_usage?: unknown; rate_limit_settings?: unknown };
  return `Cuota Threads: quota=${JSON.stringify(j.quota_usage)} replies=${JSON.stringify(j.reply_quota_usage)} limits=${JSON.stringify(j.rate_limit_settings)}`;
}
