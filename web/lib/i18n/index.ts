/*
 * Partially retired: `LOCALES`, `isLocale`, `Locale` and the `Dict` type
 * are still the locale contract of the live site and the restored V1
 * library (`components/nm/v1/`). The dictionary CONTENT (`en.ts`/`es.ts`,
 * `getDictionary`) is dead — the copy served by the current site lives in
 * `lib/content/{es,en}.ts`; do not edit these dicts expecting visible
 * changes on the site.
 */
import { en, type Dict } from "./en";
import { es } from "./es";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

const DICTS: Record<Locale, Dict> = { en, es };

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

export function getDictionary(locale: Locale): Dict {
  return DICTS[locale];
}

export type { Dict };
