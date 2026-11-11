// Tests SIN red ni browser: validacion de args (rechazan antes de abrir
// browser o red) + liShare con fetch mockeado (stub + restore).
import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { xPoll, xMediaPost, xLists } from "../dist/providers/x-browser.js";
import { liShare, liCompanyPost, liInvite, liMessage } from "../dist/providers/linkedin-post.js";

const OLD_TOKEN = process.env.LINKEDIN_TOKEN;
const OLD_AUTHOR = process.env.LINKEDIN_AUTHOR_URN;

function setLiEnv(token, author) {
  if (token === undefined) delete process.env.LINKEDIN_TOKEN;
  else process.env.LINKEDIN_TOKEN = token;
  if (author === undefined) delete process.env.LINKEDIN_AUTHOR_URN;
  else process.env.LINKEDIN_AUTHOR_URN = author;
}

after(() => {
  setLiEnv(OLD_TOKEN, OLD_AUTHOR);
  // globalThis.fetch se restaura en cada test con finally; seguridad extra:
  // no se toca aqui porque otros archivos de test podrian haberlo mockeado.
});

describe("exports existen", () => {
  it("funciones nuevas exportadas", () => {
    for (const fn of [xPoll, xMediaPost, xLists, liShare, liCompanyPost, liInvite, liMessage]) {
      assert.equal(typeof fn, "function");
    }
  });
});

describe("validacion de args sin red ni browser", () => {
  it("xPoll('', []) rechaza", async () => {
    await assert.rejects(() => xPoll("", []), /question vacia/);
  });
  it("xPoll exige 2-4 opciones", async () => {
    await assert.rejects(() => xPoll("pregunta?", ["solo-una"]), /2-4 opciones/);
    await assert.rejects(() => xPoll("pregunta?", ["a", "b", "c", "d", "e"]), /2-4 opciones/);
  });
  it("xPoll rechaza opcion larga", async () => {
    await assert.rejects(() => xPoll("q?", ["ok", "x".repeat(26)]), /25 caracteres/);
  });
  it("xMediaPost('notaurl') rechaza", async () => {
    await assert.rejects(() => xMediaPost("notaurl"), /http\(s\)/);
  });
  it("liShare con URN invalida rechaza", async () => {
    setLiEnv("tok-test", "no-es-urn");
    try {
      await assert.rejects(() => liShare("hola"), /URN/);
    } finally {
      setLiEnv(OLD_TOKEN, OLD_AUTHOR);
    }
  });
  it("liCompanyPost con URN de persona rechaza", async () => {
    setLiEnv("tok-test", "urn:li:person:abc");
    try {
      await assert.rejects(() => liCompanyPost("urn:li:person:abc", "hola"), /organization/);
    } finally {
      setLiEnv(OLD_TOKEN, OLD_AUTHOR);
    }
  });
  it("liInvite sin perfil rechaza", async () => {
    await assert.rejects(() => liInvite(""), /perfil/);
  });
  it("liMessage vacio rechaza", async () => {
    await assert.rejects(() => liMessage("", ""), /destinatario/);
    await assert.rejects(() => liMessage("alguien", ""), /1-8000/);
  });
});

describe("liShare con fetch mockeado", () => {
  it("POST a ugcPosts con headers y parseo OK", async () => {
    const realFetch = globalThis.fetch;
    let got = null;
    globalThis.fetch = async (url, init) => {
      got = { url, init };
      return new Response("{}", { status: 201, headers: { "x-restli-id": "urn:li:share:999" } });
    };
    setLiEnv("tok-test", "urn:li:person:abc123");
    try {
      const out = await liShare("hola mundo");
      assert.equal(got.url, "https://api.linkedin.com/v2/ugcPosts");
      assert.equal(got.init.method, "POST");
      assert.equal(got.init.headers.authorization, "Bearer tok-test");
      assert.equal(got.init.headers["content-type"], "application/json");
      assert.equal(got.init.headers["X-Restli-Protocol-Version"], "2.0.0");
      const body = JSON.parse(got.init.body);
      assert.equal(body.author, "urn:li:person:abc123");
      assert.equal(body.lifecycleState, "PUBLISHED");
      assert.match(out, /urn:li:share:999/);
    } finally {
      globalThis.fetch = realFetch;
      setLiEnv(OLD_TOKEN, OLD_AUTHOR);
    }
  });
  it("401 rechaza con mensaje de reautorizacion", async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response("denied", { status: 401 });
    setLiEnv("tok-test", "urn:li:person:abc123");
    try {
      await assert.rejects(() => liShare("hola"), /401/);
    } finally {
      globalThis.fetch = realFetch;
      setLiEnv(OLD_TOKEN, OLD_AUTHOR);
    }
  });
  it("liCompanyPost usa author organizacion", async () => {
    const realFetch = globalThis.fetch;
    let got = null;
    globalThis.fetch = async (url, init) => {
      got = { url, init };
      return new Response("{}", { status: 201, headers: { "x-restli-id": "urn:li:share:555" } });
    };
    setLiEnv("tok-test", "urn:li:person:abc123");
    try {
      const out = await liCompanyPost("urn:li:organization:777", "noticia", "https://example.com/n");
      const body = JSON.parse(got.init.body);
      assert.equal(body.author, "urn:li:organization:777");
      assert.equal(body.specificContent["com.linkedin.ugc.ShareContent"].shareMediaCategory, "ARTICLE");
      assert.match(out, /empresa/);
    } finally {
      globalThis.fetch = realFetch;
      setLiEnv(OLD_TOKEN, OLD_AUTHOR);
    }
  });
});
