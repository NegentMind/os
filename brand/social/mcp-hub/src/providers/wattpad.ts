// Wattpad: SIN API publica. Solo lectura por browser (headless).
// Fragil ante cambios de layout; escritura automatizada NO soportada (ToS).
import { chromium } from "playwright";

async function withPage<T>(fn: (page: import("playwright").Page) => Promise<T>): Promise<T> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) social-hub/0.2" });
    const out = await fn(page);
    await browser.close();
    return out;
  } catch (e) {
    await browser.close().catch(() => undefined);
    throw e;
  }
}

export const wattSearch = (query: string, limit = 5) =>
  withPage(async (p) => {
    await p.goto(`https://www.wattpad.com/search/${encodeURIComponent(query)}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(4000);
    const items = await p.$$eval("a", (els) =>
      [...new Set(els.map((e) => ({ t: (e as HTMLElement).innerText.trim(), h: (e as HTMLAnchorElement).href })))]
        .filter((x) => x.h.includes("/story/") && x.t.length > 5)
        .slice(0, 12)
    );
    if (items.length === 0) return "Sin historias (layout cambio o bloqueo).";
    return items.slice(0, limit).map((x, i) => `${i + 1}. ${x.t.split("\n")[0].slice(0, 120)}\n   ${x.h}`).join("\n");
  });

export const wattStory = (url: string) =>
  withPage(async (p) => {
    await p.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(3000);
    const title = await p.title();
    const snippet = await p.$$eval("main", (els) => els[0]?.textContent?.slice(0, 600) ?? "").catch(() => "");
    return `${title.slice(0, 200)}\n${snippet.replace(/\s+/g, " ").slice(0, 500)}`;
  });

// Lee un capitulo (extracto minimo, respeta ToS: sin redistribucion).
// Navega la pagina de la historia, toma el enlace del capitulo N y devuelve
// un snippet de hasta ~1500 caracteres + aviso de no-redistribucion.
// Solo lectura por ToS: la escritura automatizada NO esta soportada.
export async function wattChapter(storyUrl: string, chapterIndex = 1): Promise<string> {
  const url = (storyUrl ?? "").trim();
  if (!/^https?:\/\/(www\.)?wattpad\.com\//i.test(url)) {
    throw new Error("wattChapter necesita una URL de Wattpad (https://www.wattpad.com/...).");
  }
  if (!Number.isInteger(chapterIndex) || chapterIndex < 1) {
    throw new Error("wattChapter: chapterIndex debe ser entero >= 1.");
  }
  return withPage(async (p) => {
    await p.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(2500);
    const links = await p
      .$$eval("a", (els) =>
        [...new Set(els.map((e) => (e as HTMLAnchorElement).href))].filter(
          (h) => /wattpad\.com\//.test(h) && !h.includes("/search") && !h.includes("/user/")
        ).slice(0, 40)
      )
      .catch(() => [] as string[]);
    const target = links[chapterIndex - 1];
    if (target && target !== url) {
      await p.goto(target, { waitUntil: "domcontentloaded", timeout: 45000 });
      await p.waitForTimeout(2500);
    }
    const raw = await p
      .$$eval("main, article", (els) => (els[0]?.textContent ?? "").slice(0, 2000))
      .catch(() => "");
    const snippet = raw.replace(/\s+/g, " ").trim().slice(0, 1500);
    if (!snippet) return "Sin contenido extraible (layout cambio o bloqueo).";
    return `${snippet}\n\nAviso: extracto minimo solo para consulta personal; no redistribuir (respeta los ToS de Wattpad).`;
  });
};
