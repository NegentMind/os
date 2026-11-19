// Programador sincronizado: cola en ~/.social-hub/queue.json.
// social_schedule (enqueue/list/cancel, enqueue exige confirm) +
// social_run_due (publica vencidos) + CLI dist/run-queue.js para Task Scheduler/cron.
import fs from "node:fs";
import { HUB_DIR } from "./session.js";
import { writeGateFor } from "./rate-limit.js";
import { bskyPost, bskyThread } from "./providers/bluesky.js";
import { xPost, xThread } from "./providers/x-browser.js";
import { redditSubmit } from "./providers/reddit.js";
import { tgSend } from "./providers/telegram.js";
import { dcSend } from "./providers/discord.js";
import { devPublish } from "./providers/devto.js";
import { hashPublish } from "./providers/hashnode.js";
import { medPublish } from "./providers/medium.js";
import { fbPost } from "./providers/facebook.js";
import { bufferPublish } from "./providers/buffer-direct.js";
import { liShare } from "./providers/linkedin-post.js";
import { igPublish } from "./providers/instagram-direct.js";
import { ttPost } from "./providers/tiktok-direct.js";
import { thPost } from "./providers/threads-direct.js";
import { hnSubmit } from "./providers/hn.js";
import { splitThread } from "./compose.js";

const QFILE = `${HUB_DIR}/queue.json`;

export type QItem = {
  id: string;
  text: string;
  title?: string;
  networks: string[];
  scheduledAt: string;
  status: "queued" | "sent" | "partial" | "failed" | "cancelled";
  createdAt: string;
  params?: { subreddit?: string; profileIds?: string[]; chatId?: string; publicationId?: string; tags?: string; canonical?: string; link?: string; imageUrl?: string; videoUrl?: string };
  results?: string[];
};

function load(): QItem[] {
  try {
    return JSON.parse(fs.readFileSync(QFILE, "utf8")) as QItem[];
  } catch {
    return [];
  }
}

function save(q: QItem[]): void {
  fs.mkdirSync(HUB_DIR, { recursive: true });
  fs.writeFileSync(QFILE, JSON.stringify(q, null, 2));
}

// Limites 2026 por red. Hilos auto-split en X/Bluesky/Threads.
// IG/TikTok exigen asset; articulos (dev/hashnode/medium) exigen title.
export function adapt(network: string, text: string, title?: string, params?: QItem["params"]): { text: string; skip?: string; thread?: string[] } {
  const cut = (n: number) => (text.length > n ? { text: text.slice(0, n - 1) + "…" } : { text });
  switch (network) {
    case "x": return text.length > 280 ? { text, thread: splitThread(text, 270) } : { text };
    case "bluesky": return text.length > 300 ? { text, thread: splitThread(text, 290) } : { text };
    case "threads": return text.length > 500 ? { text, thread: splitThread(text, 490) } : { text };
    case "telegram": return cut(4096);
    case "discord": return cut(2000);
    case "linkedin": return cut(3000);
    case "instagram":
      if (!params?.imageUrl) return { text, skip: "instagram exige imageUrl." };
      return { text };
    case "tiktok":
      if (!params?.videoUrl) return { text, skip: "tiktok exige videoUrl o path." };
      return { text };
    case "hn":
      if (!title) return { text, skip: "hn exige title." };
      return { text };
    case "devto":
    case "hashnode":
    case "medium":
      if (!title) return { text, skip: `${network} exige title (articulo).` };
      return { text };
    default: return { text };
  }
}

async function dispatch(network: string, item: QItem, text: string, thread?: string[]): Promise<string> {
  const p = item.params ?? {};
  const run = (): Promise<string> => {
    switch (network) {
      case "bluesky": return thread?.length ? bskyThread(thread) : bskyPost(text);
      case "x": return thread?.length ? xThread(thread) : xPost(text);
      case "threads": return thread?.length ? thPost(thread.join("\n\n")) : thPost(text, p.link);
      case "telegram": return tgSend(text, p.chatId);
      case "discord": return dcSend(text);
      case "reddit":
        if (!p.subreddit || !item.title) throw new Error("reddit exige subreddit + title.");
        return redditSubmit(p.subreddit, item.title, text);
      case "devto": return devPublish(item.title ?? "", text, p.tags, true);
      case "hashnode":
        if (!p.publicationId) throw new Error("hashnode exige publicationId.");
        return hashPublish(p.publicationId, item.title ?? "", text, { tagsCsv: p.tags, canonical: p.canonical });
      case "medium": return medPublish(item.title ?? "", text, p.tags, p.canonical);
      case "facebook": return fbPost(text, p.link, item.scheduledAt);
      case "linkedin": return liShare(text, p.link);
      case "instagram": return igPublish(p.imageUrl ?? "", text);
      case "tiktok": return ttPost(p.videoUrl ?? "", text);
      case "threads": return thPost(text, p.link);
      case "hn":
        if (!item.title) throw new Error("hn exige title.");
        return hnSubmit(item.title, p.link || text);
      case "buffer":
        if (!p.profileIds?.length) throw new Error("buffer exige profileIds.");
        return bufferPublish(p.profileIds, text, item.scheduledAt);
      default: throw new Error(`Red desconocida: ${network}`);
    }
  };
  return writeGateFor(network, run);
}

export function enqueue(args: {
  text: string; networks: string[]; scheduledAt: string; title?: string;
  params?: QItem["params"];
}): string {
  const at = new Date(args.scheduledAt);
  if (isNaN(at.getTime())) throw new Error("scheduledAt ISO invalido.");
  if (at.getTime() < Date.now() - 60000) throw new Error("scheduledAt debe ser futuro.");
  const valid = ["bluesky", "x", "telegram", "discord", "reddit", "devto", "hashnode", "medium", "facebook", "buffer", "linkedin", "instagram", "tiktok", "threads", "hn"];
  const bad = args.networks.filter((n) => !valid.includes(n));
  if (bad.length) throw new Error(`Redes no soportadas: ${bad.join(",")}. Valid: ${valid.join(",")}`);
  const q = load();
  const id = `q${Date.now().toString(36)}`;
  q.push({ id, text: args.text, title: args.title, networks: args.networks, scheduledAt: at.toISOString(), status: "queued", createdAt: new Date().toISOString(), params: args.params });
  save(q);
  return `Encolado ${id} -> ${args.networks.join(",")} @ ${at.toISOString()}. Ejecutar con social_run_due o Task Scheduler.`;
}

export function listQueue(): string {
  const q = load().filter((i) => i.status === "queued");
  if (q.length === 0) return "Cola vacia.";
  return q.map((i) => `${i.id} [${i.status}] ${i.networks.join(",")} @ ${i.scheduledAt}\n  ${(i.title ? i.title + " | " : "")}${i.text.slice(0, 100)}`).join("\n");
}

export function cancel(id: string): string {
  const q = load();
  const it = q.find((i) => i.id === id);
  if (!it) throw new Error(`ID no existe: ${id}`);
  it.status = "cancelled";
  save(q);
  return `Cancelado ${id}.`;
}

export async function runDue(): Promise<string> {
  const q = load();
  const now = Date.now();
  const due = q.filter((i) => i.status === "queued" && new Date(i.scheduledAt).getTime() <= now);
  if (due.length === 0) return "Nada vencido en cola.";
  const lines: string[] = [];
  for (const item of due) {
    item.results = [];
    let ok = 0;
    for (const n of item.networks) {
      try {
        const a = adapt(n, item.text, item.title, item.params);
        if (a.skip) {
          item.results.push(`${n}: SKIP (${a.skip})`);
          continue;
        }
        const r = await dispatch(n, item, a.text, a.thread);
        item.results.push(`${n}: OK (${r.slice(0, 80)})`);
        ok++;
      } catch (e) {
        item.results.push(`${n}: FAIL (${e instanceof Error ? e.message.slice(0, 120) : e})`);
      }
    }
    item.status = ok === item.networks.length ? "sent" : ok > 0 ? "partial" : "failed";
    lines.push(`${item.id} -> ${item.status}\n  ` + (item.results ?? []).join("\n  "));
  }
  save(q);
  return lines.join("\n");
}
