// Facebook Pages via Graph API directa (gratis, sin tope 35/dia de Buffer).
// Solo Paginas (perfiles personales murieron con publish_actions 2018).
// Requiere: Meta App + Pagina + permiso pages_manage_posts + Page token larga vida.
// Token: FB_PAGE_ID + FB_PAGE_TOKEN (System User o canje fb_exchange_token).
import { env, missingCreds } from "../session.js";

const G = "https://graph.facebook.com/v21.0";

function creds(): { page: string; token: string } {
  const m = missingCreds(["FB_PAGE_ID", "FB_PAGE_TOKEN"]);
  if (m.length > 0) throw new Error(`Falta ${m.join("/")} (Meta App + Pagina + pages_manage_posts).`);
  return { page: env("FB_PAGE_ID"), token: env("FB_PAGE_TOKEN") };
}

export async function fbPost(text: string, link?: string, scheduledAt?: string): Promise<string> {
  const { page, token } = creds();
  const body: Record<string, unknown> = { message: text, access_token: token };
  if (link) body.link = link;
  if (scheduledAt) {
    const ts = Math.floor(new Date(scheduledAt).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);
    if (ts < now + 600) throw new Error("Facebook programa minimo 10 min en futuro.");
    body.published = false;
    body.scheduled_publish_time = ts;
  }
  const res = await fetch(`${G}/${page}/feed`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Facebook post HTTP ${res.status}: ${t.slice(0, 150)}`);
  }
  const j = (await res.json()) as { id?: string };
  return scheduledAt ? `Programado en Facebook id=${j.id}` : `Publicado en Facebook id=${j.id}`;
}

export async function fbPhoto(imageUrl: string, caption?: string): Promise<string> {
  const { page, token } = creds();
  const res = await fetch(`${G}/${page}/photos`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: imageUrl, caption, access_token: token }),
  });
  if (!res.ok) throw new Error(`Facebook photo HTTP ${res.status}.`);
  const j = (await res.json()) as { id?: string };
  return `Foto publicada id=${j.id}`;
}

export async function fbFeed(limit = 5): Promise<string> {
  const { page, token } = creds();
  const res = await fetch(`${G}/${page}/posts?limit=${limit}&fields=message,created_time&access_token=${token}`);
  if (!res.ok) throw new Error(`Facebook feed HTTP ${res.status}.`);
  const j = (await res.json()) as { data?: Array<{ message?: string; created_time?: string; id?: string }> };
  const items = j.data ?? [];
  if (items.length === 0) return "Sin posts.";
  return items.map((p, i) => `${i + 1}. [${p.created_time ?? ""}] ${(p.message ?? "").slice(0, 150)}`).join("\n");
}

export async function fbComment(objectId: string, text: string): Promise<string> {
  const { token } = creds();
  const res = await fetch(`${G}/${objectId}/comments`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: text, access_token: token }),
  });
  if (!res.ok) throw new Error(`Facebook comment HTTP ${res.status}.`);
  return "Comentario publicado.";
}

// Video por URL remota (file_url) a /{page-id}/videos.
// El video debe ser URL publica directa (mp4). Caption opcional = description.
export async function fbVideo(videoUrl: string, caption?: string): Promise<string> {
  const { page, token } = creds();
  if (!/^https?:\/\//.test(videoUrl)) throw new Error("Facebook video requiere videoUrl publica (https).");
  const body: Record<string, unknown> = { file_url: videoUrl, access_token: token };
  if (caption) body.description = caption;
  const res = await fetch(`${G}/${page}/videos`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Facebook video HTTP ${res.status}: ${t.slice(0, 150)}`);
  }
  const j = (await res.json()) as { id?: string };
  return `Video publicado id=${j.id}`;
}

// Insights de pagina. Requiere permiso read_insights en el Page token;
// sin el, Graph devuelve 403 (#10) y se reporta accionable.
export async function fbInsights(metric = "page_views_total"): Promise<string> {
  const { page, token } = creds();
  const res = await fetch(`${G}/${page}/insights?metric=${encodeURIComponent(metric)}&access_token=${token}`);
  if (res.status === 403) {
    const t = await res.text().catch(() => "");
    throw new Error(`Facebook insights 403: falta permiso read_insights en el Page token. ${t.slice(0, 120)}`);
  }
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Facebook insights HTTP ${res.status}: ${t.slice(0, 150)}`);
  }
  const j = (await res.json()) as { data?: Array<{ name?: string; values?: Array<{ value?: number | Record<string, number>; end_time?: string }> }> };
  const rows = j.data ?? [];
  if (rows.length === 0) return "Sin datos de insights (pagina nueva o metrica sin trafico).";
  return rows.map((r) => {
    const last = r.values?.[r.values.length - 1];
    const v = typeof last?.value === "object" ? JSON.stringify(last.value) : String(last?.value ?? "?");
    return `${r.name ?? metric}: ${v} (${last?.end_time ?? ""})`;
  }).join("\n");
}

// Posts programados de la Página — edge verificado en:
// https://developers.facebook.com/docs/graph-api/reference/page/scheduled_posts/
// GET /{page-id}/scheduled_posts (devuelve nodos PagePost; requiere
// pages_read_engagement y/o pages_manage_posts según el caso).
export async function fbScheduled(limit = 10): Promise<string> {
  const { page, token } = creds();
  const n = Math.min(Math.max(limit, 1), 25);
  const res = await fetch(
    `${G}/${page}/scheduled_posts?limit=${n}&fields=id,message,scheduled_publish_time,created_time&access_token=${token}`
  );
  if (res.status === 403) {
    const t = await res.text().catch(() => "");
    throw new Error(`Facebook scheduled 403: falta permiso pages_read_engagement o pages_manage_posts en el Page token. ${t.slice(0, 120)}`);
  }
  if (!res.ok) throw new Error(`Facebook scheduled HTTP ${res.status}.`);
  const j = (await res.json()) as {
    data?: Array<{ id?: string; message?: string; scheduled_publish_time?: string; created_time?: string }>;
  };
  const items = j.data ?? [];
  if (items.length === 0) return "Sin posts programados.";
  return items
    .map((p, i) => `${i + 1}. [prog: ${p.scheduled_publish_time ?? "?"}] ${(p.message ?? "(sin texto)").slice(0, 150)} (id=${p.id ?? "?"})`)
    .join("\n");
}

// Borra un post/objeto de la Página — DELETE /{object-id}.
// Solo funciona con objetos creados por la misma app (mismo App ID);
// Graph responde 403/400 si el objeto es de otra app o ya no existe.
export async function fbDeletePost(objectId: string): Promise<string> {
  if (!(objectId ?? "").trim()) throw new Error("Falta objectId (id del post a borrar, ver fbFeed).");
  const { token } = creds();
  const id = objectId.trim();
  const res = await fetch(`${G}/${encodeURIComponent(id)}?access_token=${encodeURIComponent(token)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Facebook delete HTTP ${res.status}: ${t.slice(0, 150)} (solo posts creados por la app).`);
  }
  return `Post eliminado id=${id}.`;
}
