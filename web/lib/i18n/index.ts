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
