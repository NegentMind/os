// Primer login Telegram-user (interactivo, una vez).
// Uso: node dist/tg-user-login.js
// Pide: telefono (+codigo pais) -> codigo (SMS/Telegram) -> clave 2FA (si hay).
// Guarda sesion en ~/.social-hub/tg-user.session. Nunca imprime secretos.
import fs from "node:fs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { TelegramClient } from "teleproto";
import { StringSession } from "teleproto/sessions";
import { ensureDirs, env } from "./session.js";
import { tuSessionFile } from "./providers/telegram-user.js";

const rl = readline.createInterface({ input, output });
const ask = (q: string) => rl.question(q);

const apiId = Number(env("TG_API_ID"));
const apiHash = env("TG_API_HASH");
if (!Number.isInteger(apiId) || !apiHash) {
  console.error("Falta TG_API_ID (numerico) / TG_API_HASH en .env (my.telegram.org).");
  process.exit(1);
}

ensureDirs();
const client = new TelegramClient(new StringSession(""), apiId, apiHash, { connectionRetries: 3 });
await client.start({
  phoneNumber: async () => ask("Telefono con codigo pais (ej +58412...): "),
  phoneCode: async () => ask("Codigo recibido: "),
  password: async () => ask("Clave 2FA (vacio si no hay): "),
  onError: (err: Error) => console.error("Auth: " + err.message.slice(0, 200)),
});
const me = (await client.getMe()) as { username?: string };
console.log(`OK sesion guardada (@${me.username ?? "?"}). Ya puedes usar telegram-user sin loguear.`);
fs.writeFileSync(tuSessionFile(), (client.session as unknown as { save: () => string }).save());
await client.disconnect();
rl.close();
process.exit(0);
