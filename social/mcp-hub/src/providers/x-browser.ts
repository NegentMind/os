// X/Twitter via Playwright con perfil persistente (sin API $100/mes).
// Cubre las 11 del twitter-mcp: search, feed, bookmarks, user, userTweets,
// trending, notifications, post, reply, like, retweet.
// X bloquea headless: headed (o Xvfb en server). Login manual 1 vez.
import { chromium, type Page } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { X_PROFILE, ensureDirs } from "../session.js";

async function withPage<T>(fn: (page: Page) => Promise<T>): Promise<T> {
  ensureDirs();
  const browser = await chromium.launchPersistentContext(X_PROFILE, {
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  try {
    const page = browser.pages()[0] ?? (await browser.newPage());
    const out = await fn(page);
    await browser.close();
    return out;
  } catch (e) {
    await browser.close().catch(() => undefined);
    throw e;
  }
}

function needLogin(url: string): boolean {
  return url.includes("/login") || url.includes("/i/flow/login");
}

async function articles(page: Page, url: string, n = 5): Promise<string> {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(4500);
  if (needLogin(page.url())) throw new Error("X pide login: abrir perfil ~/.social-hub/chrome-x y logear 1 vez.");
  // Selectores estables 2026: solo data-testid (las clases rotan semanalmente)
  const items = await page.$$eval('article[data-testid="tweet"] [data-testid="tweetText"]', (els) =>
    els.slice(0, 8).map((e) => (e as HTMLElement).innerText.slice(0, 220))
  ).catch(() => [] as string[]);
  const fallback = items.length === 0
    ? await page.$$eval("article", (els) => els.slice(0, 8).map((e) => (e as HTMLElement).innerText.slice(0, 220))).catch(() => [] as string[])
    : [];
  const out = (items.length ? items : fallback).slice(0, n);
  if (out.length === 0) return "Sin resultados.";
  return out.map((t, i) => `${i + 1}. ${t.replace(/\n+/g, " ")}`).join("\n");
}

export const xSearch = (q: string) => withPage((p) => articles(p, `https://x.com/search?q=${encodeURIComponent(q)}&src=typed_query`));
export const xFeed = () => withPage((p) => articles(p, "https://x.com/home"));
export const xBookmarks = () => withPage((p) => articles(p, "https://x.com/i/bookmarks"));
export const xNotifications = () => withPage((p) => articles(p, "https://x.com/notifications"));
export const xUserTweets = (h: string) => withPage((p) => articles(p, `https://x.com/${encodeURIComponent(h.replace(/^@/, ""))}`));

export const xUser = (handle: string) =>
  withPage(async (p) => {
    await p.goto(`https://x.com/${encodeURIComponent(handle.replace(/^@/, ""))}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(4000);
    if (needLogin(p.url())) throw new Error("X pide login.");
    const bio = await p.$$eval("article", () => "").catch(() => "");
    void bio;
    return `Perfil abierto: ${p.url()}. Bio visible en navegador; X limita scraping de cabecera.`;
  });

export const xTrending = () =>
  withPage(async (p) => {
    await p.goto("https://x.com/explore/tabs/trending", { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(4000);
    const items = await p.$$eval("a", (els) =>
      els.map((e) => (e as HTMLElement).innerText).filter((t) => t.startsWith("#") || t.includes(" Tendencia")).slice(0, 10)
    );
    return items.length ? items.map((t, i) => `${i + 1}. ${t.split("\n")[0]}`).join("\n") : "Sin tendencias (login o cambio de layout).";
  });

async function typePost(page: Page, text: string): Promise<void> {
  await page.goto("https://x.com/compose/post", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(3000);
  if (needLogin(page.url())) throw new Error("X pide login para postear.");
  const box = page.getByTestId("tweetTextarea_0").first();
  await box.click({ timeout: 15000 });
  await box.fill(text);
}

export const xPost = (text: string) =>
  withPage(async (p) => {
    await typePost(p, text);
    await p.getByTestId("tweetButton").first().click({ timeout: 15000 });
    await p.waitForTimeout(3000);
    return "Post enviado (verificar en perfil; X puede pedir captcha).";
  });

export function tweetId(input: string): string {
  const m = input.match(/status\/(\d+)/) ?? input.match(/^(\d{6,})$/);
  if (!m) throw new Error("ID o URL /status/ no reconocida.");
  return m[1];
}

export const xReply = (target: string, text: string) =>
  withPage(async (p) => {
    const id = tweetId(target);
    await p.goto(`https://x.com/i/status/${id}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(3000);
    if (needLogin(p.url())) throw new Error("X pide login para responder.");
    const btn = p.getByTestId("reply").first();
    await btn.click({ timeout: 15000 }).catch(() => undefined);
    await typePost(p, text);
    await p.getByTestId("tweetButton").first().click({ timeout: 15000 });
    await p.waitForTimeout(2000);
    return "Reply enviado.";
  });

export const xLike = (target: string) =>
  withPage(async (p) => {
    const id = tweetId(target);
    await p.goto(`https://x.com/i/status/${id}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(3000);
    if (needLogin(p.url())) throw new Error("X pide login para like.");
    await p.getByTestId("like").first().click({ timeout: 15000 });
    return "Like enviado.";
  });

export const xRetweet = (target: string) =>
  withPage(async (p) => {
    const id = tweetId(target);
    await p.goto(`https://x.com/i/status/${id}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(3000);
    if (needLogin(p.url())) throw new Error("X pide login para RT.");
    await p.getByTestId("retweet").first().click({ timeout: 15000 });
    await p.getByTestId("retweetConfirm").first().click({ timeout: 15000 }).catch(() => undefined);
    return "RT enviado.";
  });

export const xBookmark = (target: string) =>
  withPage(async (p) => {
    const id = tweetId(target);
    await p.goto(`https://x.com/i/status/${id}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(3000);
    if (needLogin(p.url())) throw new Error("X pide login para guardar en bookmarks.");
    await p.getByTestId("bookmark").first().click({ timeout: 15000 }).catch(() => {
      throw new Error("X: boton bookmark no encontrado (X cambio el DOM o el tweet no es visible con esta sesion).");
    });
    await p.waitForTimeout(1500);
    return "Bookmark guardado.";
  });

// Quote/Cita: abre /i/status/{id}, click en retweet -> opcion Quote/Citar
// del menu, escribe el comentario y publica. Best-effort: los testids del
// menu de retweet cambian seguido; error honesto si el DOM cambio.
export async function xQuote(target: string, comment: string): Promise<string> {
  const c = (comment ?? "").trim();
  if (!c) throw new Error("X quote: comment vacio (1-280 caracteres).");
  if (c.length > 280) throw new Error("X quote: comment supera 280 caracteres.");
  const id = tweetId(target);
  return withPage(async (p) => {
    await p.goto(`https://x.com/i/status/${id}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(3000);
    if (needLogin(p.url())) throw new Error("X pide login para citar.");
    await p.getByTestId("retweet").first().click({ timeout: 15000 }).catch(() => {
      throw new Error("X quote: boton retweet no encontrado (X cambio el DOM o el tweet no es visible).");
    });
    await p.waitForTimeout(1500);
    const opt1 = p.getByTestId("retweetQuote").first();
    if ((await opt1.count().catch(() => 0)) > 0) {
      await opt1.click({ timeout: 15000 });
    } else {
      const opt2 = p.getByTestId("quoteTweet").first();
      if ((await opt2.count().catch(() => 0)) > 0) {
        await opt2.click({ timeout: 15000 });
      } else {
        await p.getByRole("menuitem", { name: /quote|citar/i }).first().click({ timeout: 15000 }).catch(() => {
          throw new Error(`X quote: opcion Quote/Citar no encontrada (X cambio el DOM). Citar a mano en https://x.com/i/status/${id}`);
        });
      }
    }
    await p.waitForTimeout(2000);
    const box = p.getByTestId("tweetTextarea_0").first();
    await box.click({ timeout: 15000 }).catch(() => {
      throw new Error("X quote: composer de cita no abrio (X cambio el DOM).");
    });
    await box.fill(c);
    await p.getByTestId("tweetButton").first().click({ timeout: 15000 });
    await p.waitForTimeout(3000);
    return "Quote publicado (verificar en perfil; X puede pedir captcha).";
  });
}

function statusIdFromUrl(url: string): string | null {
  const m = url.match(/\/status\/(\d+)/);
  return m ? m[1] : null;
}

// Publica un hilo: primer post via compose, resto como respuestas en cadena.
// Captura cada id desde el cambio de URL (/status/<id>) tras enviar.
export const xThread = (texts: string[]) =>
  withPage(async (p) => {
    if (texts.length === 0) throw new Error("Hilo vacio: se requiere al menos 1 texto.");
    if (texts.some((t) => t.length > 280)) throw new Error("X limita cada post del hilo a 280 caracteres.");
    // 1) Primer post
    await typePost(p, texts[0]);
    await p.getByTestId("tweetButton").first().click({ timeout: 15000 });
    await p.waitForTimeout(5000);
    let lastId = statusIdFromUrl(p.url());
    // Fallback: si compose no redirige al status, ir al perfil y tomar el primer tweet propio.
    if (!lastId) {
      await p.goto("https://x.com/home", { waitUntil: "domcontentloaded", timeout: 45000 });
      await p.waitForTimeout(4000);
      const href = await p
        .locator('a[href*="/status/"]').first()
        .getAttribute("href")
        .catch(() => null);
      lastId = href ? statusIdFromUrl(href) : null;
    }
    if (!lastId) throw new Error("Hilo: no se pudo capturar el id del primer post (X no redirigio a /status/; verificar en perfil).");
    // 2) Respuestas en cadena: navegar a cada status y responder inline
    for (const text of texts.slice(1)) {
      await p.goto(`https://x.com/i/status/${lastId}`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await p.waitForTimeout(3000);
      if (needLogin(p.url())) throw new Error("X pide login para continuar el hilo.");
      await p.getByTestId("reply").first().click({ timeout: 15000 }).catch(() => {
        throw new Error("X: boton reply no encontrado (DOM cambiado o tweet no visible).");
      });
      await p.waitForTimeout(1500);
      const box = p.getByTestId("tweetTextarea_0").first();
      await box.click({ timeout: 15000 }).catch(() => {
        throw new Error("X: composer de respuesta no abrio (DOM cambiado).");
      });
      await box.fill(text);
      const send = p.getByTestId("tweetButtonInline").first();
      if ((await send.count().catch(() => 0)) > 0) await send.click({ timeout: 15000 });
      else await p.getByTestId("tweetButton").first().click({ timeout: 15000 });
      await p.waitForTimeout(5000);
      const nid = statusIdFromUrl(p.url());
      if (nid && nid !== lastId) {
        lastId = nid;
      } else {
        // La respuesta inline suele quedarse en el mismo status: seguir encadenando sobre lastId conocido.
        // Para no romper la cadena, buscar el reply propio mas reciente como nuevo ancla.
        await p.waitForTimeout(2000);
        const href = await p
          .locator('a[href*="/status/"]').first()
          .getAttribute("href")
          .catch(() => null);
        const found = href ? statusIdFromUrl(href) : null;
        if (found && found !== lastId) lastId = found;
        // Si no hay ancla nueva, se continua respondiendo al mismo lastId (hilo plano, verificado a mano).
      }
    }
    return `Hilo publicado: ${texts.length} posts (verificar en perfil; X puede pedir captcha).`;
  });

// DM best-effort: el DOM de mensajes de X cambia seguido; error honesto si falla.
export const xDMSend = (handle: string, text: string) =>
  withPage(async (p) => {
    const h = handle.replace(/^@/, "");
    await p.goto("https://x.com/messages", { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(4000);
    if (needLogin(p.url())) throw new Error("X pide login para DM: logear 1 vez en perfil ~/.social-hub/chrome-x.");
    // 1) Nueva conversacion
    const newConv = p.getByTestId("DM_NewConversation").first();
    if ((await newConv.count().catch(() => 0)) > 0) {
      await newConv.click({ timeout: 15000 });
    } else {
      await p.getByRole("button", { name: /new message|nuevo mensaje/i }).first().click({ timeout: 15000 }).catch(() => {
        throw new Error("X DM: boton de nuevo mensaje no encontrado (X cambio el DOM). Abrir https://x.com/messages a mano.");
      });
    }
    await p.waitForTimeout(2000);
    // 2) Buscar handle
    const search = p.getByRole("combobox", { name: /search|buscar/i }).first();
    if ((await search.count().catch(() => 0)) > 0) await search.fill(h, { timeout: 15000 });
    else await p.locator('input[type="text"]').first().fill(h, { timeout: 15000 }).catch(() => {
      throw new Error("X DM: campo de busqueda no encontrado (X cambio el DOM).");
    });
    await p.waitForTimeout(2500);
    const hit = p.getByRole("option", { name: new RegExp(h, "i") }).first();
    if ((await hit.count().catch(() => 0)) > 0) await hit.click({ timeout: 15000 });
    else {
      // Fallback: primer resultado clicable del typeahead
      await p.locator('[role="option"]').first().click({ timeout: 15000 }).catch(() => {
        throw new Error(`X DM: @${h} no aparece en resultados (cuenta inexistente, privada o sin conversacion permitida).`);
      });
    }
    await p.waitForTimeout(1500);
    // 3) Escribir y enviar (selectores por aria/testid, nunca clases)
    const composer = p.getByTestId("dmComposerTextInput").first();
    if ((await composer.count().catch(() => 0)) > 0) await composer.fill(text, { timeout: 15000 });
    else await p.locator('div[role="textbox"]').last().fill(text, { timeout: 15000 }).catch(() => {
      throw new Error("X DM: composer no encontrado (X cambio el DOM).");
    });
    const send = p.getByTestId("dmComposerSendButton").first();
    if ((await send.count().catch(() => 0)) > 0) await send.click({ timeout: 15000 });
    else await p.getByRole("button", { name: /send|enviar/i }).first().click({ timeout: 15000 }).catch(() => {
      throw new Error("X DM: boton enviar no encontrado (X cambio el DOM).");
    });
    await p.waitForTimeout(2000);
    return `DM enviado a @${h} (verificar en https://x.com/messages).`;
  });

// Encuesta en el composer (2-4 opciones). Best-effort: los data-testid del
// creador de encuestas cambian seguido; error honesto si el DOM cambio.
export async function xPoll(question: string, options: string[]): Promise<string> {
  const q = (question ?? "").trim();
  if (!q) throw new Error("X encuesta: question vacia (1-280 caracteres).");
  if (q.length > 280) throw new Error("X encuesta: question supera 280 caracteres.");
  if (!Array.isArray(options) || options.length < 2 || options.length > 4)
    throw new Error("X encuesta: se requieren 2-4 opciones.");
  const clean = options.map((o) => (o ?? "").trim());
  if (clean.some((o) => !o)) throw new Error("X encuesta: hay opciones vacias.");
  if (clean.some((o) => o.length > 25)) throw new Error("X encuesta: cada opcion admite maximo 25 caracteres.");
  return withPage(async (p) => {
    await p.goto("https://x.com/compose/post", { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(3000);
    if (needLogin(p.url())) throw new Error("X pide login para publicar encuesta.");
    const box = p.getByTestId("tweetTextarea_0").first();
    await box.click({ timeout: 15000 }).catch(() => {
      throw new Error("X encuesta: composer no abrio (X cambio el DOM).");
    });
    await box.fill(q);
    // 1) Abrir creador de encuesta (testid varia segun version web)
    const pollBtn = p.getByTestId("pollIcon").first();
    if ((await pollBtn.count().catch(() => 0)) > 0) {
      await pollBtn.click({ timeout: 15000 });
    } else {
      await p.getByRole("button", { name: /poll|encuesta/i }).first().click({ timeout: 15000 }).catch(() => {
        throw new Error("X encuesta: boton de encuesta no encontrado (X cambio el DOM; crear la encuesta a mano en https://x.com/compose/post).");
      });
    }
    await p.waitForTimeout(2000);
    // 2) Localizar inputs de opciones (testids conocidos; sin clases)
    let inputs = p.getByTestId("pollOptionInput");
    if ((await inputs.count().catch(() => 0)) < 2) inputs = p.getByTestId("pollOption");
    if ((await inputs.count().catch(() => 0)) < 2) {
      throw new Error("X encuesta: inputs de opciones no encontrados (X cambio el DOM del creador de encuestas).");
    }
    // 3) Agregar campos extra para opcion 3-4
    for (let i = 2; i < clean.length; i++) {
      const add = p.getByTestId("addPollOption").first();
      if ((await add.count().catch(() => 0)) > 0) {
        await add.click({ timeout: 10000 });
      } else {
        await p.getByRole("button", { name: /add.*choice|add.*option|a.adir|agregar/i }).first().click({ timeout: 10000 }).catch(() => {
          throw new Error("X encuesta: no se pudo agregar la opcion extra (X cambio el DOM).");
        });
      }
      await p.waitForTimeout(1000);
    }
    const fields = await inputs.all();
    for (let i = 0; i < clean.length && i < fields.length; i++) {
      await fields[i].fill(clean[i], { timeout: 10000 }).catch(() => {
        throw new Error("X encuesta: no se pudo escribir una opcion (X cambio el DOM).");
      });
    }
    await p.getByTestId("tweetButton").first().click({ timeout: 15000 });
    await p.waitForTimeout(3000);
    return "Encuesta publicada (verificar en perfil; X puede pedir captcha).";
  });
}

const X_IMG_MAX = 5 * 1024 * 1024;
const X_VIDEO_MAX = 50 * 1024 * 1024;

function extForMedia(ct: string, pathname: string): string {
  const c = ct.toLowerCase();
  if (c.includes("png")) return ".png";
  if (c.includes("gif")) return ".gif";
  if (c.includes("webp")) return ".webp";
  if (c.includes("jpeg") || c.includes("jpg")) return ".jpg";
  if (c.includes("quicktime")) return ".mov";
  if (c.includes("webm")) return ".webm";
  if (c.includes("mp4")) return ".mp4";
  const ext = path.extname(pathname).toLowerCase();
  if (ext === ".png" || ext === ".gif" || ext === ".webp" || ext === ".jpg") return ext;
  if (ext === ".mp4" || ext === ".mov" || ext === ".webm") return ext;
  return c.startsWith("video/") ? ".mp4" : ".jpg";
}

async function downloadMediaTemp(mediaUrl: string): Promise<{ file: string; dir: string; kind: "image" | "video" }> {
  let res: Response;
  try {
    res = await fetch(mediaUrl);
  } catch {
    throw new Error("X media: no se pudo descargar imageUrl (red o URL inaccesible).");
  }
  if (!res.ok) throw new Error(`X media: descarga HTTP ${res.status}.`);
  const ct = res.headers.get("content-type") ?? "";
  const low = ct.toLowerCase();
  const isVideo = low.startsWith("video/");
  const isGif = low.includes("gif");
  if (!low.startsWith("image/") && !isVideo)
    throw new Error(`X media: content-type no soportado (${ct || "desconocido"}). Solo imagen, gif o video.`);
  const limit = isVideo || isGif ? X_VIDEO_MAX : X_IMG_MAX;
  const label = isVideo || isGif ? "50MB (video/gif)" : "5MB (imagen)";
  if (Number(res.headers.get("content-length") ?? "0") > limit)
    throw new Error(`X media: supera ${label}.`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length === 0) throw new Error("X media: descarga vacia.");
  if (buf.length > limit) throw new Error(`X media: supera ${label}.`);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xmedia-"));
  const file = path.join(dir, `media${extForMedia(ct, new URL(mediaUrl).pathname)}`);
  try {
    fs.writeFileSync(file, buf);
  } catch {
    fs.rmSync(dir, { recursive: true, force: true });
    throw new Error("X media: no se pudo guardar el archivo temporal.");
  }
  return { file, dir, kind: isVideo ? "video" : "image" };
}

// Descarga imagen/video/gif a temp (valida content-type y tamaño:
// imagen <=5MB, video/gif <=50MB) y lo adjunta via input[type=file]
// del composer antes de postear. El video/gif requiere espera extra
// de procesado (10-20s) antes de publicar.
export async function xMediaPost(imageUrl: string, caption?: string): Promise<string> {
  if (!imageUrl || !/^https?:\/\//i.test(imageUrl.trim()))
    throw new Error("X imagen: imageUrl debe ser URL http(s) valida.");
  const cap = (caption ?? "").trim();
  if (cap.length > 280) throw new Error("X imagen: caption supera 280 caracteres.");
  const { file, dir, kind } = await downloadMediaTemp(imageUrl.trim());
  try {
    return await withPage(async (p) => {
      await p.goto("https://x.com/compose/post", { waitUntil: "domcontentloaded", timeout: 45000 });
      await p.waitForTimeout(3000);
      if (needLogin(p.url())) throw new Error("X pide login para postear imagen.");
      // Best-effort: abrir el picker de media si existe (el input suele estar oculto)
      const mediaBtn = p.getByTestId("mediaButton").first();
      if ((await mediaBtn.count().catch(() => 0)) > 0) {
        await mediaBtn.click({ timeout: 10000 }).catch(() => undefined);
        await p.waitForTimeout(1000);
      }
      const input = p.locator('input[type="file"]').first();
      if ((await input.count().catch(() => 0)) === 0)
        throw new Error("X imagen: input[type=file] del composer no encontrado (X cambio el DOM).");
      await input.setInputFiles(file, { timeout: 30000 }).catch(() => {
        throw new Error("X imagen: no se pudo adjuntar el archivo (X cambio el DOM).");
      });
      await p.waitForTimeout(5000);
      // Video/gif: X procesa el archivo en servidor; esperar 10-20s
      // extra antes de publicar o el post sale sin media.
      if (kind === "video") await p.waitForTimeout(15000);
      if (cap) {
        const box = p.getByTestId("tweetTextarea_0").first();
        await box.click({ timeout: 15000 }).catch(() => undefined);
        await box.fill(cap).catch(() => undefined);
      }
      await p.getByTestId("tweetButton").first().click({ timeout: 15000 });
      await p.waitForTimeout(3000);
      return kind === "video"
        ? "Post con video/gif enviado (verificar en perfil; X puede pedir captcha)."
        : "Post con imagen enviado (verificar en perfil; X puede pedir captcha).";
    });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Lee /i/lists y devuelve nombres de listas (solo lectura).
export async function xLists(): Promise<string> {
  return withPage(async (p) => {
    await p.goto("https://x.com/i/lists", { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(4000);
    if (needLogin(p.url())) throw new Error("X pide login para ver listas.");
    const names = await p
      .$$eval('a[href*="/i/lists/"]', (els) =>
        els.map((e) => (e as HTMLElement).innerText.trim()).filter((t) => t.length > 0).slice(0, 20)
      )
      .catch(() => [] as string[]);
    if (names.length === 0) return "Sin listas visibles (cuenta sin listas o X cambio el layout).";
    return names.map((t, i) => `${i + 1}. ${t.split("\n")[0].slice(0, 120)}`).join("\n");
  });
}
