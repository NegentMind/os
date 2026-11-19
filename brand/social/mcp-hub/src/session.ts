import os from "node:os";
import path from "node:path";
import fs from "node:fs";

export const HUB_DIR = path.join(os.homedir(), ".social-hub");
export const X_PROFILE = path.join(HUB_DIR, "chrome-x");
export const LINKEDIN_PROFILE = path.join(HUB_DIR, "chrome-linkedin");
export const REDDIT_PROFILE = path.join(HUB_DIR, "chrome-reddit");
export const DAILY_PROFILE = path.join(HUB_DIR, "chrome-daily");
export const HN_PROFILE = path.join(HUB_DIR, "chrome-hn");
export const DEVTO_PROFILE = path.join(HUB_DIR, "chrome-devto");
export const YT_PROFILE = path.join(HUB_DIR, "chrome-yt");
export const MEDIUM_PROFILE = path.join(HUB_DIR, "chrome-medium");

export function ensureDirs(): void {
  for (const d of [HUB_DIR, X_PROFILE, LINKEDIN_PROFILE, REDDIT_PROFILE, DAILY_PROFILE, HN_PROFILE, DEVTO_PROFILE, YT_PROFILE, MEDIUM_PROFILE]) {
    fs.mkdirSync(d, { recursive: true });
  }
}

// Lee env sin imprimir valores. Devuelve "" si falta.
export function env(name: string): string {
  return process.env[name] ?? "";
}

export function missingCreds(names: string[]): string[] {
  return names.filter((n) => !env(n));
}
