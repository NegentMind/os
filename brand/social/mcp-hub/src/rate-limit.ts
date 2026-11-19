// Una escritura por vez + pausa por proveedor (límites seguros 2026).
// X 30s, Hashnode 60s, Reddit-comments 11s, resto 2-10s.
const WRITE_DELAY: Record<string, number> = {
  x: 30000,
  hashnode: 60000,
  reddit: 11000,
  facebook: 10000,
  bluesky: 5000,
  devto: 5000,
  medium: 5000,
  buffer: 5000,
  discord: 2000,
  telegram: 1500,
  "telegram-user": 10000,
  linkedin: 10000,
  instagram: 15000,
  tiktok: 30000,
  threads: 10000,
  hn: 30000,
  media: 3000,
  edit: 5000,
  react: 5000,
};

let writeQueue: Promise<unknown> = Promise.resolve();
let lastCall = 0;
const READ_GAP_MS = 1500;

export async function readGate(): Promise<void> {
  const now = Date.now();
  const wait = READ_GAP_MS - (now - lastCall);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();
}

export function writeGateFor(provider: string, fn: () => Promise<string>): Promise<string> {
  const gap = WRITE_DELAY[provider] ?? 3000;
  const run = writeQueue.then(async () => {
    const now = Date.now();
    const wait = gap - (now - lastCall);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    const out = await fn();
    lastCall = Date.now();
    return out;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

// Compat: cola genérica 3s.
export function writeGate<T>(fn: () => Promise<T>): Promise<T> {
  return writeGateFor("default", fn as () => Promise<string>) as unknown as Promise<T>;
}
