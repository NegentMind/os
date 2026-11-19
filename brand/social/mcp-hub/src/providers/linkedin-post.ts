// LinkedIn API oficial (ugcPosts) con OAuth de miembro. Publica como miembro;
// lectura social sigue por browser (linkedin-browser.ts). Ritmo: 1 post por vez.
import { chromium, type Page } from "playwright";
import { env, missingCreds, ensureDirs, LINKEDIN_PROFILE } from "../session.js";

function creds(): { token: string; author: string } {
  const m = missingCreds(["LINKEDIN_TOKEN", "LINKEDIN_AUTHOR_URN"]);
  if (m.length > 0)
    throw new Error(
      `Falta ${m.join("/")} para publicar en LinkedIn. Pasos: 1) crear app en developer.linkedin.com > Products > agregar "Share on LinkedIn" y "Sign In with LinkedIn"; 2) en Auth > OAuth 2.0 scopes pedir openid + profile + w_member_social; 3) generar token OAuth con esos scopes (LINKEDIN_TOKEN); 4) obtener tu URN con GET https://api.linkedin.com/v2/userinfo (campo sub) y guardarlo como LINKEDIN_AUTHOR_URN=urn:li:person:xxx.`
    );
  return { token: env("LINKEDIN_TOKEN"), author: env("LINKEDIN_AUTHOR_URN") };
}

export async function liShare(text: string, link?: string): Promise<string> {
  if (!text || text.length > 3000) throw new Error("LinkedIn: texto de 1-3000 caracteres.");
  const { token, author } = creds();
  if (!author.startsWith("urn:li:person:") && !author.startsWith("urn:li:organization:"))
    throw new Error("LinkedIn: LINKEDIN_AUTHOR_URN debe ser ej urn:li:person:xxx (u urn:li:organization:xxx).");
  if (link && !/^https:\/\//i.test(link)) throw new Error("LinkedIn: link debe ser URL https.");
  return postUgc(token, author, text, link, "Publicado en LinkedIn");
}

// Publica como empresa (author = organizacion). Requiere token con
// w_organization_social y rol ADMINISTRATOR o DIRECT_SPONSORED_CONTENT_POSTER.
export async function liCompanyPost(orgUrn: string, text: string, link?: string): Promise<string> {
  if (!orgUrn || !orgUrn.startsWith("urn:li:organization:"))
    throw new Error("LinkedIn: orgUrn debe ser urn:li:organization:xxx (se recibio URN de persona u otro formato; el author de empresa exige organizacion).");
  if (!text || text.length > 3000) throw new Error("LinkedIn: texto de 1-3000 caracteres.");
  if (link && !/^https:\/\//i.test(link)) throw new Error("LinkedIn: link debe ser URL https.");
  const m = missingCreds(["LINKEDIN_TOKEN"]);
  if (m.length > 0)
    throw new Error(
      "Falta LINKEDIN_TOKEN para publicar como empresa. Requiere app con permiso w_organization_social y rol ADMINISTRATOR o DIRECT_SPONSORED_CONTENT_POSTER en la pagina (ver developer.linkedin.com)."
    );
  return postUgc(env("LINKEDIN_TOKEN"), orgUrn, text, link, "Publicado como empresa en LinkedIn");
}

async function postUgc(token: string, author: string, text: string, link: string | undefined, label: string): Promise<string> {
  const content: Record<string, unknown> = { shareCommentary: { text }, shareMediaCategory: link ? "ARTICLE" : "NONE" };
  if (link) {
    content.media = [{ status: "READY", originalUrl: link }];
  }
  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author,
      lifecycleState: "PUBLISHED",
      specificContent: { "com.linkedin.ugc.ShareContent": content },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });
  if (res.status === 401 || res.status === 403)
    throw new Error("LinkedIn HTTP 401/403: token sin permiso w_member_social (o w_organization_social para empresa) o expirado. Reautorizar en developer.linkedin.com con scopes openid+profile+w_member_social.");
  if (!res.ok) throw new Error(`LinkedIn HTTP ${res.status}: ${(await res.text()).slice(0, 150)}`);
  const id = res.headers.get("x-restli-id") ?? "";
  return id ? `${label}: ${id}` : `${label}.`;
}

async function withLinkedInPage<T>(fn: (page: Page) => Promise<T>): Promise<T> {
  ensureDirs();
  const browser = await chromium.launchPersistentContext(LINKEDIN_PROFILE, { headless: false });
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

function liLoginCheck(url: string): void {
  if (url.includes("/login") || url.includes("/checkpoint"))
    throw new Error("LinkedIn pide login: hacerlo 1 vez en perfil ~/.social-hub/chrome-linkedin.");
}

// Invitacion a conectar. Browser best-effort: usa el boton Connect del perfil
// (o el menu Mas). LinkedIn limita a ~100 invitaciones/semana y la
// automatizacion viola sus ToS: ritmo bajo, cuenta propia, riesgo de restriccion.
export async function liInvite(profileUrnOrUrl: string, message?: string): Promise<string> {
  const raw = (profileUrnOrUrl ?? "").trim();
  if (!raw) throw new Error("LinkedIn: se requiere perfil (URL linkedin.com/in/xxx o slug).");
  if (raw.startsWith("urn:li:")) throw new Error("LinkedIn: para invitar se requiere URL o slug de perfil (los URN no son navegables).");
  if (message && message.length > 300) throw new Error("LinkedIn: mensaje de invitacion maximo 300 caracteres.");
  const url = raw.startsWith("http") ? raw : `https://www.linkedin.com/in/${raw.replace(/^\/+|\/+$/g, "")}/`;
  if (!/^https:\/\/(www\.)?linkedin\.com\/in\//i.test(url))
    throw new Error("LinkedIn: URL de perfil no valida (ej https://www.linkedin.com/in/xxx).");
  return withLinkedInPage(async (p) => {
    await p.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(4500);
    liLoginCheck(p.url());
    let opened = false;
    const direct = p.getByRole("button", { name: /connect|conectar/i }).first();
    if ((await direct.count().catch(() => 0)) > 0) {
      await direct.click({ timeout: 15000 });
      opened = true;
    } else {
      const more = p.getByRole("button", { name: /more|m\u00e1s/i }).first();
      if ((await more.count().catch(() => 0)) > 0) {
        await more.click({ timeout: 10000 }).catch(() => undefined);
        await p.waitForTimeout(1500);
        const item = p.getByRole("menuitem", { name: /connect|conectar/i }).first();
        if ((await item.count().catch(() => 0)) > 0) {
          await item.click({ timeout: 10000 });
          opened = true;
        } else {
          const btn2 = p.getByRole("button", { name: /connect|conectar/i }).first();
          if ((await btn2.count().catch(() => 0)) > 0) {
            await btn2.click({ timeout: 10000 });
            opened = true;
          }
        }
      }
    }
    if (!opened)
      throw new Error("LinkedIn: boton Connect no encontrado (perfil con solo Follow, ya invitado, o LinkedIn cambio el DOM).");
    await p.waitForTimeout(2000);
    if (message) {
      const note = p.getByRole("button", { name: /add a note|agregar nota|a\u00f1adir nota/i }).first();
      if ((await note.count().catch(() => 0)) > 0) {
        await note.click({ timeout: 10000 });
        await p.waitForTimeout(1000);
        await p.locator("textarea").first().fill(message, { timeout: 10000 }).catch(() => {
          throw new Error("LinkedIn: no se pudo escribir la nota (LinkedIn cambio el DOM).");
        });
      }
    }
    const send = p.getByRole("button", { name: /^send|enviar/i }).first();
    if ((await send.count().catch(() => 0)) > 0) await send.click({ timeout: 10000 });
    await p.waitForTimeout(2000);
    return "Invitacion enviada (verificar en Mi red). Advertencia: LinkedIn limita a ~100 invitaciones/semana y la automatizacion viola sus ToS: ritmo bajo, cuenta propia, riesgo de restriccion de cuenta.";
  });
}

// Mensaje por /messaging. Browser best-effort: la Messages API oficial exige
// partnership de LinkedIn, por eso se usa el perfil persistente.
export async function liMessage(target: string, text: string): Promise<string> {
  const t = (target ?? "").trim();
  if (!t) throw new Error("LinkedIn: se requiere destinatario (nombre o URL de perfil).");
  const msg = (text ?? "").trim();
  if (!msg || msg.length > 8000) throw new Error("LinkedIn: texto de 1-8000 caracteres.");
  let query = t;
  const slug = t.match(/linkedin\.com\/in\/([^/?#]+)/i);
  if (slug) query = decodeURIComponent(slug[1]).replace(/-/g, " ");
  return withLinkedInPage(async (p) => {
    await p.goto("https://www.linkedin.com/messaging/", { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(4500);
    liLoginCheck(p.url());
    const search = p.getByPlaceholder(/search messages|buscar mensajes/i).first();
    if ((await search.count().catch(() => 0)) > 0) {
      await search.fill(query, { timeout: 15000 });
      await p.waitForTimeout(2500);
      await p.locator('[role="option"], ul li button').first().click({ timeout: 15000 }).catch(() => {
        throw new Error(`LinkedIn: conversacion con "${query}" no encontrada (sin historial previo o LinkedIn cambio el DOM).`);
      });
      await p.waitForTimeout(2000);
    }
    let composer = p.getByRole("textbox", { name: /write a message|escribe un mensaje|message|mensaje/i }).last();
    if ((await composer.count().catch(() => 0)) === 0) composer = p.locator('div[role="textbox"]').last();
    if ((await composer.count().catch(() => 0)) === 0)
      throw new Error("LinkedIn: composer de mensajes no encontrado (abrir la conversacion a mano o LinkedIn cambio el DOM).");
    await composer.fill(msg, { timeout: 15000 }).catch(() => {
      throw new Error("LinkedIn: no se pudo escribir el mensaje (LinkedIn cambio el DOM).");
    });
    const send = p.getByRole("button", { name: /^send|enviar/i }).first();
    if ((await send.count().catch(() => 0)) > 0) await send.click({ timeout: 10000 });
    else await p.keyboard.press("Enter");
    await p.waitForTimeout(2000);
    return `Mensaje enviado a "${query}" (verificar en /messaging). Nota: la Messages API oficial exige partnership de LinkedIn; este envio es browser best-effort y puede fallar por anti-bot o cambios del DOM.`;
  });
}
