/*
 * Locale contract of the live site (`LOCALES`, `isLocale`, `Locale`) plus the
 * `Dict` type kept for the restored V1 library (`_archive/nm-v1/`).
 * `Dict` is sourced from the archived V1 dictionary (`_archive/nm-v1/en.ts`).
 * The copy served by the site lives in `lib/content/{es,en}.ts`.
 */
import type { Dict } from "@/_archive/nm-v1/en";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

export type { Dict };
