import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { hrefFor, PUBLIC_PAGES } from "@/lib/site-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PAGES.flatMap((page) => {
    const languages = Object.fromEntries(
      LOCALES.map((lang) => [lang, new URL(hrefFor(lang, page), SITE_URL).href]),
    );

    return LOCALES.map((lang) => ({
      url: new URL(hrefFor(lang, page), SITE_URL).href,
      changeFrequency: "monthly" as const,
      priority: page === "home" ? 1 : 0.8,
      alternates: {
        languages: {
          ...languages,
          "x-default": new URL(hrefFor("en", page), SITE_URL).href,
        },
      },
    }));
  });
}
