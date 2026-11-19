// Telegram como USUARIO (MTProto via teleproto, fork mantenido de gramjs).
// Lee grupos/canales/historial y envia como tu, no como bot.
// Requiere: TG_API_ID + TG_API_HASH (https://my.telegram.org > API development tools)
// + primer login con codigo (node dist/tg-user-login.js).
// Sesion persistente en ~/.social-hub/tg-user.session.
// RIESGO: es tu cuenta personal; ritmo humano o ban. Nunca spam.
import fs from "node:fs";
import path from "node:path";
import { TelegramClient } from "teleproto";
import { StringSession } from "teleproto/sessions";
import { HUB_DIR, ensureDirs, env, missingCreds } from "../session.js";

const SESS_FILE = path.join(HUB_DIR, "tg-user.session");

function creds(): { apiId: number; apiHash: string } {
  const m = missingCreds(["TG_API_ID", "TG_API_HASH"]);
  if (m.length > 0) throw new Error(`Falta ${m.join("/")} (crear app en https://my.telegram.org > API development tools).`);
  const id = Number(env("TG_API_ID"));
  if (!Number.isInteger(id)) throw new Error("TG_API_ID debe ser numerico (solo digitos).");
  return { apiId: id, apiHash: env("TG_API_HASH") };
}

let client: TelegramClient | null = null;

export async function tuClient(): Promise<TelegramClient> {
  if (client) return client;
  const { apiId, apiHash } = creds();
  let saved = "";
  try {
    saved = fs.readFileSync(SESS_FILE, "utf8").trim();
  } catch { /* primer login: sesion vacia */ }
  const c = new TelegramClient(new StringSession(saved), apiId, apiHash, { connectionRetries: 3 });
  await c.connect();
  if (!(await c.isUserAuthorized())) {
    await c.disconnect();
    throw new Error("Telegram-user sin sesion: correr node dist/tg-user-login.js (codigo por SMS/Telegram) una vez.");
  }
  client = c;
  try {
    ensureDirs();
    fs.writeFileSync(SESS_FILE, (c.session as unknown as { save: () => string }).save());
  } catch { /* no fatal */ }
  return client;
}

export function tuSessionFile(): string {
  return SESS_FILE;
}

export async function tuMe(): Promise<string> {
  const c = await tuClient();
  const me = (await c.getMe()) as { username?: string; firstName?: string; id?: unknown };
  return `Tu cuenta: @${me.username ?? "?"} (${me.firstName ?? ""}) id=${String(me.id ?? "?")}`;
}

export function formatDialogTitle(d: { title?: string; id?: unknown; entity?: { className?: string } }): string {
  const kind = d.entity?.className ?? "?";
  return `[${kind}] ${d.title ?? "?"} id=${String(d.id ?? "?")}`;
}

export async function tuDialogs(limit = 10): Promise<string> {
  const c = await tuClient();
  const dialogs = (await c.getDialogs({ limit })) as Array<{ title?: string; id?: unknown; entity?: { className?: string } }>;
  if (dialogs.length === 0) return "Sin dialogos.";
  return dialogs.map((d, i) => `${i + 1}. ${formatDialogTitle(d)}`).join("\n");
}

export async function tuHistory(target: string, limit = 5): Promise<string> {
  if (!target) throw new Error("tuHistory requiere target (@usuario, id o invite).");
  const c = await tuClient();
  const msgs = (await c.getMessages(target, { limit })) as Array<{
    message?: string; date?: number;
    sender?: { username?: string; firstName?: string } | null;
    senderId?: unknown;
  }>;
  if (msgs.length === 0) return "Sin mensajes (grupo vacio o sin acceso).";
  return msgs.map((m, i) => {
    const who = m.sender ? `@${m.sender.username ?? m.sender.firstName ?? "?"}` : `id=${String(m.senderId ?? "?")}`;
    const when = m.date ? new Date(m.date * 1000).toISOString().slice(0, 16).replace("T", " ") : "";
    return `${i + 1}. ${who} [${when}]: ${(m.message ?? "[media]").slice(0, 200)}`;
  }).join("\n");
}

export async function tuSend(target: string, text: string): Promise<string> {
  if (!target) throw new Error("tuSend requiere target (@usuario, id o grupo).");
  if (!text) throw new Error("Texto vacio.");
  if (text.length > 4096) throw new Error("Telegram max 4096 chars por mensaje.");
  const c = await tuClient();
  await c.sendMessage(target, { message: text });
  return "Mensaje enviado como tu (cuenta personal: ritmo humano, nada de spam).";
}
