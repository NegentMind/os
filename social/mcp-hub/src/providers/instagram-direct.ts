// Instagram via Graph API oficial (Meta). Publicacion de fotos, videos y reels en 2 pasos,
// mas respuestas a comentarios y consulta de cuota.
// Requiere: cuenta Instagram Business/Creator vinculada a una Pagina de Facebook +
// Meta App con permisos instagram_basic + instagram_content_publish y App Review aprobada.
// Env: IG_USER_ID (ID numerico de la cuenta IG), IG_TOKEN (token valido con esos permisos).
import { env, missingCreds } from "../session.js";
import { sleep } from "../http.js";

const G = "https://graph.facebook.com/v21.0";

const SETUP =
  "Requisitos: cuenta Instagram Business/Creator vinculada a una Pagina de Facebook + " +
  "Meta App con App Review aprobada (permisos instagram_basic, instagram_content_publish). " +
  "Guia: developers.facebook.com/docs/instagram-platform/content-publishing.";

function creds(): { userId: string; token: string } {
  const m = missingCreds(["IG_USER_ID", "IG_TOKEN"]);
  if (m.length > 0) throw new Error(`Falta ${m.join("/")} en .env. ${SETUP}`);
  return { userId: env("IG_USER_ID"), token: env("IG_TOKEN") };
}

type GraphErr = { error?: { message?: string; type?: string; code?: number; error_subcode?: number } };

async function graphErr(res: Response, ctx: string): Promise<never> {
  let msg = "";
  try {
    const j = (await res.json()) as GraphErr;
    msg = j.error?.message ?? JSON.stringify(j).slice(0, 200);
  } catch {
    msg = await res.text().catch(() => "");
  }
  throw new Error(`Instagram ${ctx} HTTP ${res.status}: ${msg.slice(0, 200)}. ${SETUP}`);
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov)(\?|#|$)/i.test(url.split("?")[0]);
}

// Crea el contenedor de media y lo publica. imageUrl: URL publica http(s) de la imagen o video.
export async function igPublish(imageUrl: string, caption?: string, isReel = false, asStory = false): Promise<string> {
  const { userId, token } = creds();
  if (!/^https?:\/\//i.test(imageUrl)) throw new Error("igPublish necesita una URL publica http(s) (sube el archivo primero con uploadMedia).");
  const video = isVideoUrl(imageUrl);
  if (isReel && !video) throw new Error("Un reel necesita video (.mp4/.mov); para foto usa isReel=false.");
  const body: Record<string, unknown> = { access_token: token };
  if (caption && !asStory) body.caption = caption;
  if (video) {
    body.video_url = imageUrl;
    body.media_type = asStory ? "STORIES" : isReel ? "REELS" : "VIDEOS";
  } else {
    body.image_url = imageUrl;
    if (asStory) body.media_type = "STORIES";
  }
  const create = await fetch(`${G}/${userId}/media`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!create.ok) await graphErr(create, "crear contenedor");
  const c = (await create.json()) as { id?: string };
  if (!c.id) throw new Error("Instagram no devolvio id de contenedor. Revisa permisos.");
  // Fotos: el contenedor queda FINISHED de inmediato; videos/reels hay que esperar el procesado.
  if (video) await waitFinished(c.id, token);
  const pub = await fetch(`${G}/${userId}/media_publish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ creation_id: c.id, access_token: token }),
  });
  if (!pub.ok) await graphErr(pub, "publicar");
  const p = (await pub.json()) as { id?: string };
  return `Publicado en Instagram id=${p.id ?? "?"}`;
}

async function waitFinished(creationId: string, token: string): Promise<void> {
  // Poll cada 20s, max 10 intentos (~3-4 min). Videos largos pueden tardar mas: reintenta luego.
  for (let i = 0; i < 10; i++) {
    await sleep(20000);
    const res = await fetch(`${G}/${creationId}?fields=status_code,status&access_token=${token}`);
    if (!res.ok) continue;
    const j = (await res.json()) as { status_code?: string; status?: string };
    if (j.status_code === "FINISHED") return;
    if (j.status_code === "ERROR" || j.status_code === "EXPIRED") {
      throw new Error(`Instagram procesado fallo (${j.status_code}): ${(j.status ?? "").slice(0, 200)}. Revisa formato/duracion del video.`);
    }
  }
  throw new Error("Instagram sigue procesando el video tras ~3min. Espera y publica luego con el mismo flujo (o revisa el estado del contenedor).");
}

// Responde a un comentario; si text viene vacio, oculta el comentario en su lugar.
export async function igCommentReply(commentId: string, text: string): Promise<string> {
  const { token } = creds();
  if (!commentId) throw new Error("igCommentReply necesita commentId.");
  if (!text) return igCommentHide(commentId, true);
  const res = await fetch(`${G}/${commentId}/replies`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: text, access_token: token }),
  });
  if (!res.ok) await graphErr(res, "responder comentario");
  return "Respuesta publicada en Instagram.";
}

export async function igCommentHide(commentId: string, hide = true): Promise<string> {
  const { token } = creds();
  if (!commentId) throw new Error("igCommentHide necesita commentId.");
  const res = await fetch(`${G}/${commentId}/hide`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ hide, access_token: token }),
  });
  if (!res.ok) await graphErr(res, "ocultar comentario");
  return hide ? "Comentario ocultado." : "Comentario visible de nuevo.";
}

const DM_NOTE =
  "Nota: responder solo funciona dentro de la ventana de 24h del ultimo mensaje del usuario; " +
  "escribir a no-propios sin conversacion previa exige App Review aprobada (permiso instagram_manage_messages). " +
  "Guia: developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api.";

// DM via Instagram Messaging API: POST /{IG_USER_ID}/messages con
// { recipient: { id }, message: { text } }. El recipientId es el IGSID que
// llega por webhook de mensajeria (no es el username).
export async function igDM(recipientId: string, text: string): Promise<string> {
  if (!(recipientId ?? "").trim()) throw new Error("igDM necesita recipientId (IGSID del destinatario, llega por webhook de mensajeria).");
  if (!(text ?? "").trim()) throw new Error("igDM necesita texto.");
  if (Buffer.byteLength(text, "utf8") > 1000) {
    throw new Error(`igDM max 1000 bytes UTF-8 (van ${Buffer.byteLength(text, "utf8")}). Acorta el texto.`);
  }
  const { userId, token } = creds();
  let res: Response;
  try {
    res = await fetch(`${G}/${userId}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ recipient: { id: recipientId.trim() }, message: { text }, access_token: token }),
    });
  } catch {
    throw new Error(`Instagram enviar DM: fallo de red. ${DM_NOTE}`);
  }
  if (!res.ok) await graphErr(res, `enviar DM. ${DM_NOTE}`);
  const j = (await res.json()) as { message_id?: string };
  return `DM enviado en Instagram a ${recipientId.trim()} (message_id=${j.message_id ?? "?"}). ${DM_NOTE}`;
}

export async function igLimit(): Promise<string> {
  const { userId, token } = creds();
  const res = await fetch(`${G}/${userId}/content_publishing_limit?fields=quota_usage,rate_limit_settings&access_token=${token}`);
  if (!res.ok) await graphErr(res, "consultar cuota");
  const j = (await res.json()) as { quota_usage?: unknown; rate_limit_settings?: unknown };
  return `Cuota IG: quota_usage=${JSON.stringify(j.quota_usage)} rate_limit=${JSON.stringify(j.rate_limit_settings)}`;
}
