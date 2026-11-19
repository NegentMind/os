// Reddit: lectura publica JSON + escritura con app script (OAuth password grant).
// Cubre: hot, search, comments, user, post, comment/reply.
import { env, missingCreds } from "../session.js";
import { rbRead, rbSubmit, rbComment } from "./reddit-browser.js";

// User-Agent descriptivo obligatorio. JSON anonimo muerto (403 desde may-2026):
// con creds se lee por OAuth (100 QPM), sin creds se intenta publico con aviso.
function ua(): Record<string, string> {
  const u = env("REDDIT_USERNAME") || "social-hub";
  return { "user-agent": `node:social-hub:0.4 (by /u/${u})`, accept: "application/json" };
}

type Listing = { data?: { children?: Array<{ data?: { title?: string; score?: number; permalink?: string; body?: string; author?: string; name?: string } }> } };

function fmtPosts(j: Listing, limit: number): string {
  const items = (j.data?.children ?? []).slice(0, limit);
  if (items.length === 0) return "Sin resultados (posible 403 anti-bot: usar app Reddit).";
  return items
    .map((c, i) => `${i + 1}. [${c.data?.score ?? 0}] ${c.data?.title ?? c.data?.body?.slice(0, 120) ?? "?"} (${c.data?.permalink ?? c.data?.name ?? ""})`)
    .join("\n");
}

async function pub(path: string): Promise<Listing> {
  // 1) OAuth (100 QPM, fiable); 2) JSON publico; 3) browser old.reddit logueado
  if (env("REDDIT_CLIENT_ID")) {
    try {
      const t = await token();
      const res = await fetch(`https://oauth.reddit.com${path}`, {
        headers: { ...ua(), authorization: `Bearer ${t}` },
      });
      if (res.ok) return (await res.json()) as Listing;
    } catch { /* cae a publico */ }
  }
  try {
    const res = await fetch(`https://www.reddit.com${path}`, { headers: ua() });
    if (res.ok) return (await res.json()) as Listing;
    if (res.status !== 403) throw new Error(`Reddit HTTP ${res.status}.`);
  } catch { /* cae a browser */ }
  const m = path.match(/^\/r\/([^/]+)\/(hot|new|top|rising)\.json/);
  if (m) {
    const txt = await rbRead(m[1], m[2], 10);
    if (!txt.startsWith("Sin posts")) {
      const lines = txt.split("\n");
      return { data: { children: lines.map((l) => ({ data: { title: l.replace(/^\d+\. /, ""), score: 0, permalink: "" } })) } };
    }
  }
  throw new Error("Reddit 403 anonimo + browser sin login. Opciones: configurar REDDIT_* o login 1 vez en perfil chrome-reddit.");
}

export const redditHot = (sub = "all", limit = 5) => pub(`/r/${encodeURIComponent(sub)}/hot.json?limit=${limit}`).then((j) => fmtPosts(j, limit));

export const redditSearch = (query: string, limit = 5, sub?: string) => {
  const scope = sub ? `/r/${encodeURIComponent(sub)}` : "";
  return pub(`${scope}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&restrict_sr=${sub ? "on" : "off"}&sort=relevance`).then((j) => fmtPosts(j, limit));
};

export async function redditComments(postId: string, sub?: string, limit = 5): Promise<string> {
  const id = postId.replace(/^t3_/, "");
  const scope = sub ? `/r/${encodeURIComponent(sub)}` : "";
  const res = await fetch(`https://www.reddit.com${scope}/comments/${id}.json?limit=20`, { headers: ua() });
  if (res.status === 403) throw new Error("Reddit 403 anti-bot en comments.");
  if (!res.ok) throw new Error(`Reddit comments HTTP ${res.status}.`);
  const j = (await res.json()) as [unknown, Listing];
  return fmtPosts(j[1] ?? {}, limit);
}

export const redditUser = (username: string, limit = 5) =>
  pub(`/user/${encodeURIComponent(username.replace(/^u\//, ""))}/submitted.json?limit=${limit}`).then((j) => fmtPosts(j, limit));

let tokenCache = { token: "", exp: 0 };

async function token(): Promise<string> {
  if (Date.now() < tokenCache.exp && tokenCache.token) return tokenCache.token;
  const missing = missingCreds(["REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET", "REDDIT_USERNAME", "REDDIT_PASSWORD"]);
  if (missing.length > 0) throw new Error(`Falta ${missing.join("/")} (reddit.com/prefs/apps > create app > script).`);
  const basic = Buffer.from(`${env("REDDIT_CLIENT_ID")}:${env("REDDIT_CLIENT_SECRET")}`).toString("base64");
  const body = new URLSearchParams({ grant_type: "password", username: env("REDDIT_USERNAME"), password: env("REDDIT_PASSWORD") });
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: { authorization: `Basic ${basic}`, "user-agent": "social-hub/0.1", "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Reddit OAuth HTTP ${res.status}. Revisar app/creds.`);
  const j = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!j.access_token) throw new Error("Reddit OAuth sin access_token.");
  tokenCache = { token: j.access_token, exp: Date.now() + (j.expires_in ?? 3600) * 1000 - 60000 };
  return tokenCache.token;
}

export async function redditSubmit(subreddit: string, title: string, text: string): Promise<string> {
  if (!env("REDDIT_CLIENT_ID")) return rbSubmit(subreddit, title, text);
  const t = await token();
  const body = new URLSearchParams({ sr: subreddit, kind: "self", title, text, api_type: "json" });
  const res = await fetch("https://oauth.reddit.com/api/submit", {
    method: "POST",
    headers: { authorization: `Bearer ${t}`, "user-agent": "social-hub/0.1", "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Reddit submit HTTP ${res.status}.`);
  return "Post enviado a Reddit (revisar errores de moderacion en la respuesta del sub).";
}

export async function redditComment(parent: string, text: string): Promise<string> {
  if (!env("REDDIT_CLIENT_ID")) return rbComment(parent, text);
  const t = await token();
  const body = new URLSearchParams({ thing_id: parent, text, api_type: "json" });
  const res = await fetch("https://oauth.reddit.com/api/comment", {
    method: "POST",
    headers: { authorization: `Bearer ${t}`, "user-agent": "social-hub/0.1", "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Reddit comment HTTP ${res.status}.`);
  return "Comentario enviado.";
}

export async function redditCrosspost(subreddit: string, crosspostIdOrUrl: string): Promise<string> {
  const t = await token();
  const m = crosspostIdOrUrl.match(/comments\/([a-z0-9]+)/i) ?? crosspostIdOrUrl.match(/^(t3_[a-z0-9]+|[a-z0-9]+)$/i);
  if (!m) throw new Error("crosspost: id t3_ o URL /comments/ no reconocida.");
  const fullId = m[1].startsWith("t3_") ? m[1] : `t3_${m[1]}`;
  const body = new URLSearchParams({ sr: subreddit, kind: "crosspost", crosspost_id: fullId, api_type: "json" });
  const res = await fetch("https://oauth.reddit.com/api/submit", {
    method: "POST",
    headers: { authorization: `Bearer ${t}`, "user-agent": "social-hub/0.1", "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Reddit crosspost HTTP ${res.status}. (algunos subs lo bloquean)`);
  return "Crosspost enviado.";
}

const REDDIT_CREDS = ["REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET", "REDDIT_USERNAME", "REDDIT_PASSWORD"];

function requireOAuth(): void {
  const missing = missingCreds(REDDIT_CREDS);
  if (missing.length > 0) {
    throw new Error(`Falta ${missing.join("/")} (reddit.com/prefs/apps > create app > script). Solo OAuth, sin fallback browser.`);
  }
}

async function oauthPost(path: string, params: Record<string, string>): Promise<void> {
  requireOAuth();
  const t = await token();
  const body = new URLSearchParams({ ...params, api_type: "json" });
  const res = await fetch(`https://oauth.reddit.com${path}`, {
    method: "POST",
    headers: { ...ua(), authorization: `Bearer ${t}`, "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Reddit ${path} HTTP ${res.status}. (revisar scopes vote/save y que el thingId exista).`);
}

export async function redditVote(thingId: string, dir: 1 | -1 | 0): Promise<string> {
  if (!thingId) throw new Error("Falta thingId (ej. t3_abc123 o t1_xyz).");
  if (dir !== 1 && dir !== -1 && dir !== 0) throw new Error("dir debe ser 1 (up), -1 (down) o 0 (quitar voto).");
  await oauthPost("/api/vote", { id: thingId, dir: String(dir) });
  return dir === 0 ? `Voto retirado en ${thingId}.` : `Voto ${dir === 1 ? "positivo" : "negativo"} registrado en ${thingId}.`;
}

export async function redditSave(thingId: string, save = true): Promise<string> {
  if (!thingId) throw new Error("Falta thingId (ej. t3_abc123).");
  await oauthPost(save ? "/api/save" : "/api/unsave", { id: thingId });
  return save ? `Guardado ${thingId} en Reddit.` : `Liberado ${thingId} (unsave) en Reddit.`;
}

// POST OAuth con hint de error propio (mod/flair: el 403 casi siempre es falta de permisos mod).
async function oauthPostHint(path: string, params: Record<string, string>, hint: string): Promise<void> {
  requireOAuth();
  const t = await token();
  const body = new URLSearchParams({ ...params, api_type: "json" });
  const res = await fetch(`https://oauth.reddit.com${path}`, {
    method: "POST",
    headers: { ...ua(), authorization: `Bearer ${t}`, "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (res.status === 403) throw new Error(`Reddit ${path} 403: sin permisos mod en ese sub.`);
  if (!res.ok) throw new Error(`Reddit ${path} HTTP ${res.status}. (${hint})`);
}

type FlairTemplate = { id?: string; text?: string; name?: string };

// GET oauth.reddit.com/r/{sr}/api/link_flair (docs: reddit.com/dev/api > flair > GET link_flair).
export async function redditFlairLink(subreddit: string): Promise<string> {
  const sr = (subreddit ?? "").trim().replace(/^r\//i, "");
  if (!sr) throw new Error("Falta subreddit (ej. askreddit).");
  requireOAuth();
  const t = await token();
  const res = await fetch(`https://oauth.reddit.com/r/${encodeURIComponent(sr)}/api/link_flair`, {
    headers: { ...ua(), authorization: `Bearer ${t}` },
  });
  if (res.status === 403) throw new Error("Reddit link_flair 403: sin permisos mod o flair desactivado en ese sub.");
  if (!res.ok) throw new Error(`Reddit link_flair HTTP ${res.status}. (revisar que el sub exista y permisos mod).`);
  const j = (await res.json()) as FlairTemplate[] | { choices?: FlairTemplate[] };
  const list: FlairTemplate[] = Array.isArray(j) ? j : (j.choices ?? []);
  if (list.length === 0) return `Sin flairs disponibles en r/${sr}.`;
  return list.map((f) => `${f.id ?? "?"}: ${f.text ?? f.name ?? "(sin texto)"}`).join("\n");
}

// POST /api/selectflair (docs: flair_template_id o text + link=fullname del post).
export async function redditSelectFlair(thingId: string, flairIdOrText: string): Promise<string> {
  if (!thingId) throw new Error("Falta thingId (ej. t3_abc123).");
  if (!flairIdOrText) throw new Error("Falta flairIdOrText (id de plantilla o texto del flair).");
  const params: Record<string, string> = { link: thingId };
  const looksTemplate = /^[0-9a-f-]{8,64}$/i.test(flairIdOrText) && !flairIdOrText.includes(" ");
  if (looksTemplate) params.flair_template_id = flairIdOrText;
  else params.text = flairIdOrText.slice(0, 64);
  await oauthPostHint("/api/selectflair", params, "revisar permisos mod/flair en ese sub y que el thingId exista");
  return looksTemplate ? `Flair ${flairIdOrText} aplicado a ${thingId}.` : `Texto de flair aplicado a ${thingId}.`;
}

// POST /api/{approve,remove,lock} con id=fullname (docs: moderation > modposts).
export async function redditMod(thingId: string, action: "approve" | "remove" | "lock"): Promise<string> {
  if (!thingId) throw new Error("Falta thingId (ej. t3_abc123).");
  if (action !== "approve" && action !== "remove" && action !== "lock") {
    throw new Error("action inválida: usar 'approve', 'remove' o 'lock'.");
  }
  await oauthPostHint(`/api/${action}`, { id: thingId }, "revisar permisos mod en ese sub y que el thingId exista");
  const msg = action === "approve" ? "aprobado" : action === "remove" ? "eliminado" : "bloqueado (lock)";
  return `Contenido ${thingId} ${msg} en Reddit.`;
}
