// Publicacion multi-red via Buffer REST API directa (sin MCP buffer remoto).
// Token en: https://publish.buffer.com/settings/api -> BUFFER_ACCESS_TOKEN.
// Cubre: perfiles + crear/programar post. IG/TikTok requieren asset segun Buffer.
import { env, missingCreds } from "../session.js";

const API = "https://api.bufferapp.com/1";

function token(): string {
  const m = missingCreds(["BUFFER_ACCESS_TOKEN"]);
  if (m.length > 0) throw new Error("Falta BUFFER_ACCESS_TOKEN (publish.buffer.com > Settings > API).");
  return env("BUFFER_ACCESS_TOKEN");
}

export async function bufferProfiles(): Promise<string> {
  const res = await fetch(`${API}/profiles.json?access_token=${token()}`);
  if (!res.ok) throw new Error(`Buffer profiles HTTP ${res.status}. Revisar token.`);
  const j = (await res.json()) as Array<{ id?: string; service?: string; service_username?: string; disconnected?: boolean }>;
  if (!Array.isArray(j) || j.length === 0) return "Sin perfiles.";
  return j.map((p) => `${p.service}: ${p.service_username} id=${p.id}${p.disconnected ? " (desconectado)" : ""}`).join("\n");
}

export async function bufferPublish(profileIds: string[], text: string, scheduledAt?: string): Promise<string> {
  const body: Record<string, unknown> = { profile_ids: profileIds, text, shorten: false };
  if (scheduledAt) body.scheduled_at = scheduledAt;
  const res = await fetch(`${API}/updates/create.json?access_token=${token()}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Buffer publish HTTP ${res.status}. Verificar perfiles y formato.`);
  return scheduledAt ? `Programado para ${scheduledAt}.` : "Encolado/publicado via Buffer.";
}
