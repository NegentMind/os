// TikTok Content Posting API v2 (oficial). Sube videos via FILE_UPLOAD (path local por chunks)
// o intenta URL https directa via PULL_FROM_URL.
// Requiere: app en developers.tiktok.com con scopes video.upload + video.publish autorizados.
// Env: TIKTOK_TOKEN (Bearer). TIKTOK_OPEN_ID opcional (la API no lo exige en estos endpoints).
// Aviso: sin auditoria aprobada por TikTok todo sale privado (SELF_ONLY); pedir PUBLIC_TO_EVERYONE
// sin auditoria da error de la API.
import fs from "node:fs";
import path from "node:path";
import { env, missingCreds } from "../session.js";
import { sleep } from "../http.js";

const API = "https://open.tiktokapis.com/v2";

const SETUP =
  "Setup: app en developers.tiktok.com con scopes video.upload + video.publish, " +
  "token OAuth valido. Sin auditoria aprobada solo se permite SELF_ONLY.";

const PRIVACY = ["SELF_ONLY", "MUTUAL_FOLLOW_FRIENDS", "PUBLIC_TO_EVERYONE"] as const;

function token(): string {
  const m = missingCreds(["TIKTOK_TOKEN"]);
  if (m.length > 0) throw new Error(`Falta TIKTOK_TOKEN en .env. ${SETUP}`);
  return env("TIKTOK_TOKEN");
}

type ApiErr = { error: { code: string; message: string; log_id: string } };

function apiError(ctx: string, j: ApiErr): never {
  throw new Error(`TikTok ${ctx}: [${j.error.code}] ${j.error.message.slice(0, 200)}. ${SETUP}`);
}

async function postJson(p: string, body: unknown): Promise<ApiErr & { data?: Record<string, unknown> }> {
  const res = await fetch(`${API}${p}`, {
    method: "POST",
    headers: { authorization: `Bearer ${token()}`, "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`TikTok HTTP ${res.status} en ${p}. Revisa token y scopes. ${SETUP}`);
  return (await res.json()) as ApiErr & { data?: Record<string, unknown> };
}

function mimeOf(file: string): string {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".mov") return "video/quicktime";
  if (ext === ".webm") return "video/webm";
  if (ext === ".m4v") return "video/x-m4v";
  return "video/mp4";
}

// input: path local (.mp4/.mov/.webm/.m4v) o URL https directa (intenta PULL_FROM_URL).
export async function ttPost(videoPathOrUrl: string, caption?: string, privacy = "SELF_ONLY"): Promise<string> {
  if (!videoPathOrUrl) throw new Error("ttPost necesita un path local o una URL https del video.");
  if (!(PRIVACY as readonly string[]).includes(privacy)) {
    throw new Error(`privacy invalido "${privacy}". Usa: ${PRIVACY.join(" | ")}.`);
  }
  if (caption && caption.length > 2200) throw new Error("TikTok permite max 2200 caracteres en el titulo.");
  const postInfo: Record<string, unknown> = { title: caption ?? "", privacy_level: privacy };
  if (/^https:\/\//i.test(videoPathOrUrl)) return postFromUrl(videoPathOrUrl, postInfo);
  return postFromFile(videoPathOrUrl, postInfo);
}

async function postFromUrl(videoUrl: string, postInfo: Record<string, unknown>): Promise<string> {
  // PULL_FROM_URL: TikTok descarga el video desde la URL. Si el endpoint/app lo rechaza,
  // error honesto pidiendo path local.
  const j = await postJson("/post/publish/video/init/", {
    post_info: postInfo,
    source_info: { source: "PULL_FROM_URL", video_url: videoUrl },
  });
  if (j.error.code !== "ok" || !j.data?.publish_id) {
    throw new Error(
      `TikTok rechazo la URL directa ([${j.error.code}] ${j.error.message.slice(0, 150)}). ` +
        "Usa un path local .mp4 (flujo FILE_UPLOAD)."
    );
  }
  await waitStatus(j.data.publish_id as string);
  return `Video TikTok publicado (PULL_FROM_URL) publish_id=${j.data.publish_id}`;
}

async function postFromFile(localPath: string, postInfo: Record<string, unknown>): Promise<string> {
  if (!fs.existsSync(localPath)) throw new Error(`Archivo no encontrado: ${localPath}. Usa un path local valido.`);
  const ext = path.extname(localPath).toLowerCase();
  if (![".mp4", ".mov", ".webm", ".m4v"].includes(ext)) {
    throw new Error(`Extension no soportada "${ext}". Usa .mp4/.mov/.webm/.m4v.`);
  }
  const size = fs.statSync(localPath).size;
  if (size === 0) throw new Error("El archivo esta vacio.");
  const chunkSize = 10_000_000; // 10MB por chunk (documentado)
  const totalChunks = Math.max(1, Math.ceil(size / chunkSize));
  const init = await postJson("/post/publish/video/init/", {
    post_info: postInfo,
    source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: chunkSize, total_chunk_count: totalChunks },
  });
  if (init.error.code !== "ok" || !init.data?.upload_url || !init.data?.publish_id) apiError("init FILE_UPLOAD", init as ApiErr);
  const uploadUrl = init.data?.upload_url as string;
  const publishId = init.data?.publish_id as string;
  const fd = fs.openSync(localPath, "r");
  try {
    const buf = Buffer.alloc(Math.min(chunkSize, size));
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const len = Math.min(chunkSize, size - start);
      fs.readSync(fd, buf, 0, len, start);
      const end = start + len - 1;
      const put = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "content-type": mimeOf(localPath),
          "content-length": String(len),
          "content-range": `bytes ${start}-${end}/${size}`,
        },
        body: buf.subarray(0, len),
      });
      if (!put.ok) {
        const t = await put.text().catch(() => "");
        throw new Error(`TikTok subida chunk ${i + 1}/${totalChunks} HTTP ${put.status}: ${t.slice(0, 150)}. Reintenta ttPost.`);
      }
    }
  } finally {
    fs.closeSync(fd);
  }
  await waitStatus(publishId);
  return `Video TikTok publicado publish_id=${publishId}`;
}

const DISPLAY_SETUP =
  "Setup Display API: app en developers.tiktok.com con scopes user.info.basic " +
  "(+ user.info.profile / user.info.stats para perfil extendido, video.list para videos) " +
  "autorizados por el usuario. Guia: developers.tiktok.com/docs/en/display-api-overview.";

type DisplayErr = { error: { code: string; message: string; log_id: string } };

function displayError(ctx: string, j: DisplayErr): never {
  const hint = /scope|permission|unauthori|forbidden|access/i.test(`${j.error.code} ${j.error.message}`)
    ? " Revisa que el token tenga los scopes aprobados (user.info.basic/profile/stats, video.list)."
    : "";
  throw new Error(`TikTok ${ctx}: [${j.error.code}] ${j.error.message.slice(0, 200)}.${hint} ${DISPLAY_SETUP}`);
}

// Campos documentados en developers.tiktok.com/docs/en/tiktok-api-v2-get-user-info
const USER_FIELDS =
  "open_id,union_id,avatar_url,avatar_url_100,avatar_large_url,display_name,username," +
  "bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count";

// Perfil del usuario conectado via Display API: GET /v2/user/info/ con Bearer.
export async function ttUserInfo(): Promise<string> {
  const t = token();
  let res: Response;
  try {
    res = await fetch(`${API}/v2/user/info/?fields=${USER_FIELDS}`, {
      headers: { authorization: `Bearer ${t}` },
    });
  } catch {
    throw new Error("TikTok user/info: fallo de red hacia open.tiktokapis.com.");
  }
  if (!res.ok) throw new Error(`TikTok user/info HTTP ${res.status}. Revisa token y scopes. ${DISPLAY_SETUP}`);
  const j = (await res.json()) as DisplayErr & { data?: { user?: Record<string, unknown> } };
  const u = j.data?.user;
  if (j.error.code !== "ok" || !u) displayError("user/info", j);
  const name = (u.display_name as string) ?? (u.username as string) ?? "?";
  const bio = u.bio_description ? ` bio=${String(u.bio_description).slice(0, 120)}` : "";
  return (
    `TikTok @${String(u.username ?? "?")} (${String(name)}): ` +
    `seguidores=${String(u.follower_count ?? "?")} seguidos=${String(u.following_count ?? "?")} ` +
    `likes=${String(u.likes_count ?? "?")} videos=${String(u.video_count ?? "?")} ` +
    `verificado=${String(u.is_verified ?? "?")}${bio}`
  );
}

// Videos publicos del usuario: POST /v2/video/list/ con access_token.
// cursor: timestamp ms de paginacion (0 = primera pagina). max: 1-20.
export async function ttVideoList(cursor = 0, max = 10): Promise<string> {
  if (!Number.isInteger(cursor) || cursor < 0) throw new Error("ttVideoList: cursor debe ser entero >= 0 (timestamp ms).");
  if (!Number.isInteger(max) || max < 1 || max > 20) throw new Error("ttVideoList: max debe ser entero 1-20.");
  const body: Record<string, unknown> = { max_count: max };
  if (cursor > 0) body.cursor = cursor;
  let res: Response;
  try {
    res = await fetch(`${API}/v2/video/list/?fields=cover_image_url,id,title`, {
      method: "POST",
      headers: { authorization: `Bearer ${token()}`, "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("TikTok video/list: fallo de red hacia open.tiktokapis.com.");
  }
  if (!res.ok) throw new Error(`TikTok video/list HTTP ${res.status}. Revisa token y scope video.list. ${DISPLAY_SETUP}`);
  const j = (await res.json()) as DisplayErr & {
    data?: { videos?: Array<{ id?: string; title?: string }>; cursor?: number; has_more?: boolean };
  };
  const videos = j.data?.videos;
  if (j.error.code !== "ok" || !videos) displayError("video/list", j);
  if (videos.length === 0) return "Sin videos publicos.";
  const lines = videos.map((v, i) => `${i + 1}. ${v.title || "(sin titulo)"} [${v.id ?? "?"}]`);
  const more = j.data?.has_more ? `\nMas videos: reintentar con cursor=${j.data?.cursor ?? 0}` : "";
  return lines.join("\n") + more;
}

async function waitStatus(publishId: string): Promise<void> {
  // Sondeo ~5min (30 x 10s) hasta PUBLISH_COMPLETE o FAILED.
  for (let i = 0; i < 30; i++) {
    await sleep(10000);
    const j = await postJson("/post/publish/status/fetch/", { publish_id: publishId });
    if (j.error.code !== "ok") continue;
    const st = j.data?.status as string | undefined;
    if (st === "PUBLISH_COMPLETE") return;
    if (st === "FAILED") {
      throw new Error(`TikTok fallo la publicacion (FAILED). Revisa formato/duracion del video y scopes. ${SETUP}`);
    }
  }
  throw new Error("TikTok sigue procesando tras ~5min. Consulta luego el estado del publish_id.");
}
