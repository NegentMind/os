/*
 * Single source of truth for site URLs and launch flags.
 *
 * NEXT_PUBLIC_* values are inlined at build time: changing a flag in the
 * deploy environment requires a rebuild to take effect. Safe to import
 * from Server and Client Components (no secrets here).
 */

/** Canonical origin. Used by metadataBase, robots.txt and sitemap.xml. */
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://negentmind.com";

/** GitHub organization. */
export const ORG_URL = "https://github.com/NegentMind";

/**
 * VantaDB repository. Still under the founder's account.
 * TODO: switch to "https://github.com/NegentMind/vantadb" after the transfer.
 */
export const VANTADB_REPO = "https://github.com/ness-e/Vantadb";


/** Public Handbook. `null` until published: render as non-link text. */
export const HANDBOOK_URL: string | null =
  process.env.NEXT_PUBLIC_HANDBOOK_URL || null;

/** Product surface (/app, /login). Disabled at launch: both routes 404. */
export const APP_ENABLED = process.env.NEXT_PUBLIC_APP_ENABLED === "true";

/** Contact inbox. Not deliverable until negentmind.com is registered. */
export const CONTACT_EMAIL = "negent@negentmind.com";

/** When false, the email is shown as text (marked pending), never as mailto. */
export const CONTACT_EMAIL_ENABLED =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL_ENABLED === "true";

/** "https://github.com/ness-e/Vantadb" → "github.com/ness-e/Vantadb". */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "");
}
