// Keepalive de sesiones browser: visita ligera que mantiene vivas las cookies.
// Uso: node dist/keepalive.js  (Task Scheduler 1 vez/dia)
// Si una sesion cayo, el mensaje indica como re-loguear (una vez, manual/OS-level).
import { ensureDirs } from "./session.js";
import { hnKeepalive } from "./providers/hn.js";

ensureDirs();
try {
  console.log(await hnKeepalive());
  process.exit(0);
} catch (e: unknown) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
}
