// Discord: envio por webhook (gratis, 1 URL) + lectura por bot token.
// Webhook: canal > Editar canal > Integraciones > Webhooks -> DISCORD_WEBHOOK_URL.
// Bot: discord.com/developers > app > Bot > token -> DISCORD_BOT_TOKEN.
import { env, missingCreds } from "../session.js";

function webhook(): string {
  const m = missingCreds(["DISCORD_WEBHOOK_URL"]);
  if (m.length > 0) throw new Error("Falta DISCORD_WEBHOOK_URL (canal > Integraciones > Webhooks).");
  return env("DISCORD_WEBHOOK_URL");
}

export async function dcSend(text: string, username?: string): Promise<string> {
  if (!text) throw new Error("Texto vacio.");
  const body: Record<string, unknown> = { content: text.slice(0, 2000) };
  if (username) body.username = username;
  const post = () =>
    fetch(webhook(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  let res = await post();
  if (res.status === 429) {
    // Webhook ~30/min: respetar retry_after una vez
    let wait = 5000;
    try {
      const j = (await res.json()) as { retry_after?: number };
      if (j.retry_after) wait = j.retry_after * 1000 + 1000;
    } catch { /* default */ }
    await new Promise((r) => setTimeout(r, wait));
    res = await post();
  }
  if (!res.ok) throw new Error(`Discord webhook HTTP ${res.status}. Revisar URL.`);
  return "Mensaje Discord enviado.";
}

export async function dcRead(channelId: string, limit = 5): Promise<string> {
  const m = missingCreds(["DISCORD_BOT_TOKEN"]);
  if (m.length > 0) throw new Error("Falta DISCORD_BOT_TOKEN (discord.com/developers > Bot).");
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=${Math.min(limit, 20)}`, {
    headers: { authorization: `Bot ${env("DISCORD_BOT_TOKEN")}` },
  });
  if (!res.ok) throw new Error(`Discord read HTTP ${res.status}. (bot debe estar en el servidor con permiso leer).`);
  const j = (await res.json()) as Array<{ author?: { username?: string }; content?: string; id?: string }>;
  if (j.length === 0) return "Sin mensajes.";
  return j.map((x, i) => `${i + 1}. @${x.author?.username ?? "?"}: ${(x.content ?? "").slice(0, 200)}`).join("\n");
}

function botToken(): string {
  const m = missingCreds(["DISCORD_BOT_TOKEN"]);
  if (m.length > 0) throw new Error("Falta DISCORD_BOT_TOKEN (discord.com/developers > Bot).");
  return env("DISCORD_BOT_TOKEN");
}

// POST al webhook con el mismo manejo 429/retry_after de dcSend.
async function postWebhook(body: Record<string, unknown>): Promise<void> {
  const post = () =>
    fetch(webhook(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  let res = await post();
  if (res.status === 429) {
    let wait = 5000;
    try {
      const j = (await res.json()) as { retry_after?: number };
      if (j.retry_after) wait = j.retry_after * 1000 + 1000;
    } catch { /* default */ }
    await new Promise((r) => setTimeout(r, wait));
    res = await post();
  }
  if (!res.ok) throw new Error(`Discord webhook HTTP ${res.status}. Revisar URL.`);
}

export async function dcEmbed(
  opts: { title?: string; description: string; url?: string; fields?: Array<{ name: string; value: string }> },
  username?: string,
): Promise<string> {
  if (!opts || !opts.description) throw new Error("Embed sin description.");
  const embed: Record<string, unknown> = { description: opts.description.slice(0, 4096) };
  if (opts.title) embed.title = opts.title.slice(0, 256);
  if (opts.url) embed.url = opts.url;
  if (opts.fields && opts.fields.length > 0) {
    embed.fields = opts.fields
      .slice(0, 25)
      .map((f) => ({ name: f.name.slice(0, 256), value: f.value.slice(0, 1024) }));
  }
  const body: Record<string, unknown> = { embeds: [embed] };
  if (username) body.username = username;
  await postWebhook(body);
  return "Embed Discord enviado.";
}

// Llamada a la API REST con bot token, respetando 429+retry_after una vez.
async function discordBot(path: string, method: string): Promise<Response> {
  const call = () =>
    fetch(`https://discord.com/api/v10${path}`, {
      method,
      headers: { authorization: `Bot ${botToken()}` },
    });
  let res = await call();
  if (res.status === 429) {
    let wait = 5000;
    try {
      const j = (await res.json()) as { retry_after?: number };
      if (j.retry_after) wait = j.retry_after * 1000 + 1000;
    } catch { /* default */ }
    await new Promise((r) => setTimeout(r, wait));
    res = await call();
  }
  return res;
}

export async function dcReact(channelId: string, messageId: string, emoji: string): Promise<string> {
  if (!channelId || !messageId || !emoji) throw new Error("Faltan channelId/messageId/emoji.");
  const res = await discordBot(
    `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`,
    "PUT",
  );
  if (!res.ok) throw new Error(`Discord react HTTP ${res.status}. (bot debe ver el canal y tener permiso de reaccion).`);
  return "Reaccion Discord añadida.";
}

export async function dcDelete(channelId: string, messageId: string): Promise<string> {
  if (!channelId || !messageId) throw new Error("Faltan channelId/messageId.");
  const res = await discordBot(`/channels/${channelId}/messages/${messageId}`, "DELETE");
  if (!res.ok) throw new Error(`Discord delete HTTP ${res.status}. (solo mensajes propios o permiso gestionar mensajes).`);
  return "Mensaje Discord eliminado.";
}

export async function dcThread(channelId: string, messageId: string, name: string): Promise<string> {
  if (!channelId || !messageId || !name) throw new Error("Faltan channelId/messageId/name.");
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/threads`, {
    method: "POST",
    headers: { authorization: `Bot ${botToken()}`, "content-type": "application/json" },
    body: JSON.stringify({ name: name.slice(0, 100) }),
  });
  if (!res.ok) throw new Error(`Discord thread HTTP ${res.status}. (requiere Create Public Threads)`);
  const j = (await res.json()) as { id?: string };
  return `Hilo Discord creado id=${j.id ?? "ok"}.`;
}

// Slash commands globales (bulk overwrite).
// Doc: PUT /applications/{application.id}/commands con bot token
// (https://discord.com/developers/docs/interactions/application-commands).
// Nombre CHAT_INPUT: 1-32 chars, regex ^[-_\p{L}\p{N}...]{1,32}$ y minúsculas
// obligatorias si la letra tiene variante; description 1-100.
const SLASH_NAME_RE = /^[-_\p{L}\p{N}]+$/u;

export async function dcSlashRegister(commands: Array<{ name: string; description: string }>): Promise<string> {
  if (!Array.isArray(commands) || commands.length === 0)
    throw new Error("commands vacío: indicar al menos un {name, description}.");
  if (commands.length > 100) throw new Error("Discord admite max 100 comandos globales por app.");
  for (const c of commands) {
    const name = c?.name ?? "";
    const desc = c?.description ?? "";
    if (name.length < 1 || name.length > 32) throw new Error(`Slash "${name}": nombre 1-32 caracteres.`);
    if (name !== name.toLowerCase()) throw new Error(`Slash "${name}": usar minúsculas (sin mayúsculas).`);
    if (!SLASH_NAME_RE.test(name)) throw new Error(`Slash "${name}": solo letras minúsculas, números, _ y -.`);
    if (desc.length < 1 || desc.length > 100) throw new Error(`Slash "${name}": description 1-100 caracteres.`);
  }
  const m = missingCreds(["DISCORD_APP_ID", "DISCORD_BOT_TOKEN"]);
  if (m.length > 0) throw new Error(`Falta ${m.join(", ")} (discord.com/developers > app: Application ID + Bot token).`);
  const appId = env("DISCORD_APP_ID");
  const payload = commands.map((c) => ({ name: c.name, description: c.description, type: 1 }));
  const call = () =>
    fetch(`https://discord.com/api/v10/applications/${appId}/commands`, {
      method: "PUT",
      headers: { authorization: `Bot ${env("DISCORD_BOT_TOKEN")}`, "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  let res = await call();
  if (res.status === 429) {
    let wait = 5000;
    try {
      const j = (await res.json()) as { retry_after?: number };
      if (j.retry_after) wait = j.retry_after * 1000 + 1000;
    } catch { /* default */ }
    await new Promise((r) => setTimeout(r, wait));
    res = await call();
  }
  if (!res.ok) throw new Error(`Discord slash PUT HTTP ${res.status}. (appId válido y bot con scope applications.commands).`);
  const j = (await res.json()) as Array<{ name?: string }>;
  const n = Array.isArray(j) ? j.length : commands.length;
  return `Slash commands registrados: ${n} (PUT /applications/{appId}/commands).`;
}

// Post en canal foro/media.
// Doc: POST /channels/{channel.id}/threads con {name, message:{content...}}
// (https://docs.discord.com/developers/resources/channel#start-thread-in-forum-or-media-channel).
// El hilo creado es tipo PUBLIC_THREAD. 400 = el canal no es foro/media
// (o faltan tags requeridos por el canal).
export async function dcForumPost(channelId: string, title: string, content: string): Promise<string> {
  if (!channelId) throw new Error("Falta channelId del foro.");
  if (!title || !title.trim()) throw new Error("Forum sin título: indicar title 1-100 caracteres.");
  if (title.length > 100) throw new Error("Forum title max 100 caracteres.");
  if (!content || !content.trim()) throw new Error("Forum sin contenido.");
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/threads`, {
    method: "POST",
    headers: { authorization: `Bot ${botToken()}`, "content-type": "application/json" },
    body: JSON.stringify({
      name: title.slice(0, 100),
      message: { content: content.slice(0, 2000) },
      auto_archive_duration: 1440,
    }),
  });
  if (res.status === 400)
    throw new Error("Discord forum HTTP 400: el canal no es foro/media o faltan tags requeridos (canal tipo GUILD_FORUM/GUILD_MEDIA).");
  if (!res.ok) throw new Error(`Discord forum HTTP ${res.status}. (bot con permiso SEND_MESSAGES en el foro).`);
  const j = (await res.json()) as { id?: string };
  return `Post foro Discord creado id=${j.id ?? "ok"}.`;
}
