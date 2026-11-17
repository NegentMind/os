import type { Locale } from "@/lib/i18n";

export type PageId = "home" | "projects" | "vantadb" | "about" | "contribute";

export const PUBLIC_PAGES: readonly PageId[] = [
  "home",
  "projects",
  "vantadb",
  "about",
  "contribute",
];

const PATHS: Record<PageId, string> = {
  home: "",
  projects: "/projects",
  vantadb: "/projects/vantadb",
  about: "/about",
  contribute: "/contribute",
};

export function hrefFor(lang: Locale, page: PageId): string {
  return `/${lang}${PATHS[page]}`;
}
