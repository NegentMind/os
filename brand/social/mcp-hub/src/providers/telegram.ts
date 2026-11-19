// Telegram via Bot API (gratis). Crear bot con @BotFather -> TELEGRAM_BOT_TOKEN.
// Chat: TELEGRAM_CHAT_ID (ver getUpdates o @userinfobot). Cubre: me, send, updates.
import { env, missingCreds } from "../session.js";

function api(token: string, method: string): string {
  return `https://api.telegram.org/bot${token}/${method}`;
}

function token(): string {
  const m = missingCreds(["TELEGRAM_BOT_TOKEN"]);
  if (m.length > 0) throw new Error("Falta TELEGRAM_BOT_TOKEN (crear bot con @BotFather).");
  return env("TELEGRAM_BOT_TOKEN");
}

export async function tgMe(): Promise<string> {
  const res = await fetch(api(token(), "getMe"));
  if (!res.ok) throw new Error(`Telegram getMe HTTP ${res.status}. Revisar token.`);
  const j = (await res.json()) as { result?: { username?: string; first_name?: string } };
  return `Bot: @${j.result?.username ?? "?"} (${j.result?.first_name ?? ""})`;
}

export async function tgSend(text: string, chatId?: string, replyTo?: number): Promise<string> {
  const chat = chatId || env("TELEGRAM_CHAT_ID");
  if (!chat) throw new Error("Falta destino: param chatId o TELEGRAM_CHAT_ID.");
  if (text.length > 4096) throw new Error("Telegram max 4096 chars por mensaje.");
  const body: Record<string, unknown> = { chat_id: chat, text };
  if (replyTo) body.reply_parameters = { message_id: replyTo };
  const post = () =>
    fetch(api(token(), "sendMessage"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  let res = await post();
  if (res.status === 429) {
    // Flood control: dormir retry_after una vez y reintentar
    let wait = 5000;
    try {
      const j = (await res.json()) as { parameters?: { retry_after?: number } };
      if (j.parameters?.retry_after) wait = j.parameters.retry_after * 1000 + 1000;
    } catch { /* default */ }
    await new Promise((r) => setTimeout(r, wait));
    res = await post();
  }
  if (res.status === 403) throw new Error("Telegram 403: bot bloqueado o sin /start en ese chat. No reintentar.");
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Telegram send HTTP ${res.status}: ${t.slice(0, 150)} (bot debe estar en el chat/canal).`);
  }
  return "Mensaje Telegram enviado.";
}

export async function tgUpdates(): Promise<string> {
  const res = await fetch(api(token(), "getUpdates?limit=10&timeout=0"));
  if (!res.ok) throw new Error(`Telegram updates HTTP ${res.status}.`);
  const j = (await res.json()) as { result?: Array<{ message?: { message_id?: number; chat?: { id?: number }; from?: { username?: string }; text?: string } }> };
  const items = (j.result ?? []).slice(-10);
  if (items.length === 0) return "Sin mensajes recientes (el bot solo ve mensajes tras /start o mencion).";
  return items.map((u, i) => `${i + 1}. [${u.message?.message_id}] @${u.message?.from?.username ?? "?"} chat=${u.message?.chat?.id}: ${(u.message?.text ?? "").slice(0, 150)}`).join("\n");
}

// POST generico al Bot API con el mismo manejo 429/retry_after de tgSend.
async function postMethod(method: string, body: Record<string, unknown>): Promise<unknown> {
  const post = () =>
    fetch(api(token(), method), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  let res = await post();
  if (res.status === 429) {
    let wait = 5000;
    try {
      const j = (await res.json()) as { parameters?: { retry_after?: number } };
      if (j.parameters?.retry_after) wait = j.parameters.retry_after * 1000 + 1000;
    } catch { /* default */ }
    await new Promise((r) => setTimeout(r, wait));
    res = await post();
  }
  if (res.status === 403) throw new Error("Telegram 403: bot bloqueado o sin /start en ese chat. No reintentar.");
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Telegram ${method} HTTP ${res.status}: ${t.slice(0, 150)}`);
  }
  return res.json().catch(() => ({}));
}

function resolveChat(chatId: string | undefined): string {
  const chat = chatId || env("TELEGRAM_CHAT_ID");
  if (!chat) throw new Error("Falta destino: param chatId o TELEGRAM_CHAT_ID.");
  return chat;
}

export async function tgPhoto(chatId: string | undefined, photoUrl: string, caption?: string): Promise<string> {
  if (!photoUrl) throw new Error("Falta photoUrl (URL publica http(s) de la imagen).");
  const body: Record<string, unknown> = { chat_id: resolveChat(chatId), photo: photoUrl };
  if (caption) body.caption = caption.slice(0, 1024);
  await postMethod("sendPhoto", body);
  return "Foto Telegram enviada.";
}

export async function tgPoll(chatId: string | undefined, question: string, options: string[]): Promise<string> {
  if (!question || question.length > 300) throw new Error("Pregunta invalida: 1-300 chars.");
  if (!options || options.length < 2 || options.length > 10) throw new Error("Poll requiere 2-10 opciones.");
  await postMethod("sendPoll", { chat_id: resolveChat(chatId), question, options });
  return "Encuesta Telegram enviada.";
}

export async function tgEdit(chatId: string, messageId: number, text: string): Promise<string> {
  if (text.length > 4096) throw new Error("Telegram max 4096 chars por mensaje.");
  await postMethod("editMessageText", { chat_id: chatId, message_id: messageId, text });
  return "Mensaje Telegram editado.";
}

export async function tgDelete(chatId: string, messageId: number): Promise<string> {
  await postMethod("deleteMessage", { chat_id: chatId, message_id: messageId });
  return "Mensaje Telegram eliminado.";
}

export async function tgPin(chatId: string | undefined, messageId: number): Promise<string> {
  const chat = chatId || env("TELEGRAM_CHAT_ID");
  if (!chat) throw new Error("Falta destino: param chatId o TELEGRAM_CHAT_ID.");
  await postMethod("pinChatMessage", { chat_id: chat, message_id: messageId, disable_notification: true });
  return "Mensaje fijado. (bot debe ser admin)";
}

export async function tgMediaGroup(chatId: string | undefined, photoUrls: string[], caption?: string): Promise<string> {
  const chat = chatId || env("TELEGRAM_CHAT_ID");
  if (!chat) throw new Error("Falta destino: param chatId o TELEGRAM_CHAT_ID.");
  if (photoUrls.length < 2 || photoUrls.length > 10) throw new Error("Media group: 2-10 fotos.");
  const media = photoUrls.map((u, i) => ({ type: "photo", media: u, ...(i === 0 && caption ? { caption: caption.slice(0, 1024) } : {}) }));
  await postMethod("sendMediaGroup", { chat_id: chat, media });
  return `Grupo de ${photoUrls.length} fotos enviado.`;
}

// sendMessage con botones inline (docs: core.telegram.org/bots/api#sendmessage,
// reply_markup.inline_keyboard: [[{text, callback_data}]]).
export async function tgButtons(chatId: string | undefined, text: string, rows: string[][]): Promise<string> {
  if (!text) throw new Error("Falta text del mensaje.");
  if (text.length > 4096) throw new Error("Telegram max 4096 chars por mensaje.");
  if (!rows || rows.length < 1 || rows.length > 8) throw new Error("Botones inválidos: 1-8 filas (rows).");
  rows.forEach((r, i) => {
    if (!r || r.length < 1 || r.length > 8) throw new Error(`Fila ${i + 1} inválida: 1-8 botones por fila.`);
    r.forEach((b) => {
      if (!b || b.length > 64) throw new Error("Cada botón: 1-64 chars (callback_data máx 64 bytes).");
    });
  });
  const inline_keyboard = rows.map((r) => r.map((t) => ({ text: t, callback_data: t })));
  await postMethod("sendMessage", { chat_id: resolveChat(chatId), text, reply_markup: { inline_keyboard } });
  return "Mensaje con botones enviado.";
}

// banChatMember / unbanChatMember (docs: core.telegram.org/bots/api#banchatmember).
// El bot debe ser admin con can_restrict_members.
export async function tgBan(chatId: string | undefined, userId: number): Promise<string> {
  if (!Number.isInteger(userId) || userId <= 0) throw new Error("userId inválido (entero positivo de Telegram).");
  await postMethod("banChatMember", { chat_id: resolveChat(chatId), user_id: userId });
  return "Usuario baneado. (bot debe ser admin con can_restrict_members)";
}

export async function tgUnban(chatId: string | undefined, userId: number): Promise<string> {
  if (!Number.isInteger(userId) || userId <= 0) throw new Error("userId inválido (entero positivo de Telegram).");
  await postMethod("unbanChatMember", { chat_id: resolveChat(chatId), user_id: userId });
  return "Usuario desbaneado. (bot debe ser admin con can_restrict_members)";
}
