import type { Locale } from "@/lib/i18n";
import { en, type SiteCopy } from "@/lib/content/en";
import { es } from "@/lib/content/es";

const COPY: Record<Locale, SiteCopy> = { en, es };

export function getSiteCopy(lang: Locale): SiteCopy {
  return COPY[lang];
}

export type { SiteCopy };
