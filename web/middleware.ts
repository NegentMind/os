import { NextResponse, type NextRequest } from "next/server";

/*
 * Locale negotiation for the bare root: `/` → `/es` when the browser's
 * primary Accept-Language is Spanish, else `/en`. All other paths pass
 * through untouched.
 */
export function middleware(req: NextRequest) {
  const primary = (req.headers.get("accept-language") ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  const locale = primary.startsWith("es") ? "es" : "en";
  const res = NextResponse.redirect(new URL(`/${locale}`, req.url));
  // The redirect varies on the request language: without Vary a shared
  // cache could pin every visitor to whichever locale was cached first.
  res.headers.set("Vary", "Accept-Language");
  return res;
}

export const config = { matcher: "/" };
