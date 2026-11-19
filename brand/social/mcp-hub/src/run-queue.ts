// CLI para Task Scheduler / cron: publica lo vencido de la cola.
// Uso: node dist/run-queue.js
import { ensureDirs } from "./session.js";
import { runDue } from "./scheduler.js";

ensureDirs();
runDue()
  .then((s) => {
    console.log(s);
    process.exit(0);
  })
  .catch((e: unknown) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
