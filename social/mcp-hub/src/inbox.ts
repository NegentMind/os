// Bandeja unificada de solo lectura: agrega Telegram, Discord, Bluesky DMs y LinkedIn.
// Lee en paralelo con Promise.allSettled: si una fuente falla, las demas siguen
// y el fallo queda marcado en su seccion en vez de romper todo.
import { env } from "./session.js";
import { tgUpdates } from "./providers/telegram.js";
import { dcRead } from "./providers/discord.js";
import { bskyDMs } from "./providers/bluesky.js";
import { liInbox } from "./providers/linkedin-browser.js";

type Source = { name: string; run: () => Promise<string> };

export async function readInbox(): Promise<string> {
  const dcChannel = env("DISCORD_CHANNEL_ID");
  const sources: Source[] = [{ name: "Telegram", run: tgUpdates }];
  if (dcChannel) sources.push({ name: "Discord", run: () => dcRead(dcChannel, 5) });
  sources.push({ name: "Bluesky DMs", run: bskyDMs });
  sources.push({ name: "LinkedIn", run: liInbox });

  const results = await Promise.allSettled(sources.map((s) => s.run()));
  const out = results.map((r, i) => {
    const head = `--- ${sources[i].name} ---`;
    if (r.status === "fulfilled") return `${head}\n${r.value}`;
    const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
    return `${head}\nNo disponible: ${msg}`;
  });
  if (!dcChannel) {
    out.splice(1, 0, "--- Discord ---\nOmitido: falta DISCORD_CHANNEL_ID en .env (ID del canal a leer).");
  }
  return out.join("\n\n");
}
