// LOTE FINAL: validación previa sin red/browser + fetch mockeado.
// Importa de ../dist/*.js (requiere `npm run build`). La red se mockea
// con stub de globalThis.fetch + restore; el browser nunca se abre porque
// todas las validaciones rechazan antes de withPage/red.
import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { xQuote, xMediaPost } from "../dist/providers/x-browser.js";
import { ytVideoUpdate, ytVideoDelete } from "../dist/providers/youtube.js";
import { thPoll } from "../dist/providers/threads-direct.js";
import { fbScheduled, fbDeletePost } from "../dist/providers/facebook.js";
import { devAnalytics } from "../dist/providers/devto.js";

const ENV_KEYS = [
  "YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN",
  "THREADS_USER_ID", "THREADS_TOKEN",
  "FB_PAGE_ID", "FB_PAGE_TOKEN",
  "DEVTO_API_KEY",
];
let savedEnv;
let origFetch;

const VID = "dQw4w9WgXcQ"; // id YT válido (11 chars)
const TWEET_URL = "https://x.com/alguien/status/1234567890123456789";

function noNet() {
  globalThis.fetch = () => {
    throw new Error("no debe tocar red");
  };
}

function mockJson(handler) {
  globalThis.fetch = async (url, opts = {}) => ({
    ok: true,
    status: 200,
    headers: { get: () => null },
    json: async () => handler(String(url), opts),
    text: async () => "",
  });
}

beforeEach(() => {
  savedEnv = {};
  for (const k of ENV_KEYS) savedEnv[k] = process.env[k];
  origFetch = globalThis.fetch;
});

afterEach(() => {
  globalThis.fetch = origFetch;
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
});

describe("lote-final: validación sin red ni browser", () => {
  it("xQuote sin comment rechaza antes del browser", async () => {
    noNet();
    await assert.rejects(() => xQuote(TWEET_URL, ""), /comment vac[ií]o/);
    await assert.rejects(() => xQuote(TWEET_URL, "   "), /comment vac[ií]o/);
  });
  it("xQuote con target inválido rechaza antes del browser", async () => {
    noNet();
    await assert.rejects(() => xQuote("no-es-id", "buen comentario"), /ID o URL/);
  });
  it("xQuote con comment >280 rechaza", async () => {
    noNet();
    await assert.rejects(() => xQuote(TWEET_URL, "x".repeat(281)), /280/);
  });
  it("xMediaPost URL no-http rechaza", async () => {
    noNet();
    await assert.rejects(() => xMediaPost("notaurl"), /http\(s\)/);
    await assert.rejects(() => xMediaPost("ftp://example.com/a.mp4"), /http\(s\)/);
  });
  it("xMediaPost caption >280 rechaza antes de descargar", async () => {
    noNet();
    await assert.rejects(() => xMediaPost("https://example.com/a.mp4", "x".repeat(281)), /280/);
  });
  it("ytVideoUpdate sin patch rechaza antes de red", async () => {
    noNet();
    await assert.rejects(() => ytVideoUpdate(VID, {}), /Patch vac[ií]o/);
  });
  it("ytVideoUpdate sin videoId rechaza", async () => {
    noNet();
    await assert.rejects(() => ytVideoUpdate("", { title: "x" }), /videoId/);
  });
  it("ytVideoUpdate privacy inválida rechaza", async () => {
    noNet();
    await assert.rejects(() => ytVideoUpdate(VID, { privacy: "everyone" }), /privacy inv[aá]lida/);
  });
  it("ytVideoDelete sin id rechaza antes de red", async () => {
    noNet();
    await assert.rejects(() => ytVideoDelete(""), /videoId/);
    await assert.rejects(() => ytVideoDelete("   "), /videoId/);
  });
  it("thPoll sin question rechaza", async () => {
    noNet();
    await assert.rejects(() => thPoll("", ["a", "b"]), /question/);
  });
  it("thPoll exige 2-4 opciones", async () => {
    noNet();
    await assert.rejects(() => thPoll("¿pregunta?", ["solo-una"]), /2-4/);
    await assert.rejects(() => thPoll("¿pregunta?", ["a", "b", "c", "d", "e"]), /2-4/);
  });
  it("thPoll rechaza opción vacía o larga", async () => {
    noNet();
    await assert.rejects(() => thPoll("¿q?", ["ok", "  "]), /vacías/);
    await assert.rejects(() => thPoll("¿q?", ["ok", "x".repeat(26)]), /25 caracteres/);
  });
  it("thPoll pregunta >500 rechaza", async () => {
    noNet();
    await assert.rejects(() => thPoll("x".repeat(501), ["a", "b"]), /500/);
  });
  it("fbDeletePost sin id rechaza antes de red", async () => {
    noNet();
    await assert.rejects(() => fbDeletePost(""), /objectId/);
    await assert.rejects(() => fbDeletePost("   "), /objectId/);
  });
  it("fbScheduled sin creds rechaza sin red", async () => {
    delete process.env.FB_PAGE_ID;
    delete process.env.FB_PAGE_TOKEN;
    noNet();
    await assert.rejects(() => fbScheduled(), /FB_PAGE_ID|Falta/);
  });
  it("devAnalytics sin key rechaza con mensaje claro", async () => {
    delete process.env.DEVTO_API_KEY;
    noNet();
    await assert.rejects(() => devAnalytics(), /DEVTO_API_KEY/);
    await assert.rejects(() => devAnalytics("history"), /DEVTO_API_KEY/);
  });
  it("devAnalytics kind inválido rechaza", async () => {
    noNet();
    await assert.rejects(() => devAnalytics("semanal"), /kind inválido/);
  });
});

describe("lote-final: fetch mock (solo lo nuevo)", () => {
  it("ytVideoUpdate hace GET + PUT videos?part=snippet,status con body fusionado", async () => {
    process.env.YT_CLIENT_ID = "id";
    process.env.YT_CLIENT_SECRET = "sec";
    process.env.YT_REFRESH_TOKEN = "rt";
    const calls = [];
    const parseBody = (b) => {
      const s = String(b);
      return s.startsWith("{") ? JSON.parse(s) : s;
    };
    globalThis.fetch = async (url, opts = {}) => {
      calls.push({ url: String(url), method: opts.method ?? "GET", body: opts.body ? parseBody(opts.body) : undefined });
      if (String(url).includes("oauth2.googleapis.com/token")) {
        return { ok: true, status: 200, headers: { get: () => null }, json: async () => ({ access_token: "tok" }), text: async () => "" };
      }
      if ((opts.method ?? "GET") === "GET" && String(url).includes("/youtube/v3/videos")) {
        return {
          ok: true, status: 200, headers: { get: () => null },
          json: async () => ({ items: [{ id: VID, snippet: { title: "Viejo", description: "Vieja", categoryId: "22" }, status: { privacyStatus: "unlisted" } }] }),
          text: async () => "",
        };
      }
      return { ok: true, status: 200, headers: { get: () => null }, json: async () => ({ id: VID }), text: async () => "" };
    };
    const out = await ytVideoUpdate(VID, { title: "Nuevo", privacy: "private" });
    assert.match(out, /actualizado/);
    assert.match(out, new RegExp(VID));
    const put = calls.find((c) => c.method === "PUT");
    assert.ok(put, "debe hacer PUT");
    assert.match(put.url, /youtube\/v3\/videos\?part=snippet,status/);
    assert.equal(put.body.id, VID);
    assert.equal(put.body.snippet.title, "Nuevo");
    assert.equal(put.body.snippet.description, "Vieja");
    assert.equal(put.body.snippet.categoryId, "22");
    assert.equal(put.body.status.privacyStatus, "private");
  });

  it("ytVideoDelete usa método DELETE con id", async () => {
    process.env.YT_CLIENT_ID = "id";
    process.env.YT_CLIENT_SECRET = "sec";
    process.env.YT_REFRESH_TOKEN = "rt";
    let seen = {};
    globalThis.fetch = async (url, opts = {}) => {
      if (String(url).includes("oauth2.googleapis.com/token")) {
        return { ok: true, status: 200, headers: { get: () => null }, json: async () => ({ access_token: "tok" }), text: async () => "" };
      }
      seen = { url: String(url), method: opts.method };
      return { ok: true, status: 204, headers: { get: () => null }, json: async () => ({}), text: async () => "" };
    };
    const out = await ytVideoDelete(VID);
    assert.match(out, /eliminado/);
    assert.equal(seen.method, "DELETE");
    assert.match(seen.url, /youtube\/v3\/videos\?id=/);
    assert.match(seen.url, new RegExp(VID));
  });

  it("fbDeletePost usa método DELETE sobre object-id", async () => {
    process.env.FB_PAGE_ID = "123";
    process.env.FB_PAGE_TOKEN = "tok";
    let seen = {};
    // Ojo: fbDeletePost no lee res.json(); capturar en el stub, no en el handler.
    globalThis.fetch = async (url, opts = {}) => {
      seen = { url: String(url), method: opts.method };
      return { ok: true, status: 200, headers: { get: () => null }, json: async () => ({ success: true }), text: async () => "" };
    };
    const out = await fbDeletePost("123_456");
    assert.match(out, /eliminado/);
    assert.match(out, /123_456/);
    assert.equal(seen.method, "DELETE");
    assert.match(seen.url, /123_456/);
  });

  it("fbScheduled usa edge GET /{page-id}/scheduled_posts", async () => {
    process.env.FB_PAGE_ID = "123";
    process.env.FB_PAGE_TOKEN = "tok";
    let seen = "";
    mockJson((url) => {
      seen = url;
      return { data: [{ id: "123_789", message: "Promo", scheduled_publish_time: "2026-02-01T10:00:00+0000" }] };
    });
    const out = await fbScheduled();
    assert.match(seen, /\/123\/scheduled_posts/);
    assert.match(seen, /scheduled_publish_time/);
    assert.match(out, /Promo/);
    assert.match(out, /123_789/);
  });

  it("devAnalytics totals usa GET /api/analytics/totals con key", async () => {
    process.env.DEVTO_API_KEY = "KEY";
    let seen = {};
    mockJson((url, opts) => {
      seen = { url, key: opts.headers?.["api-key"] };
      return { page_views: { total: 42 }, reactions: { total: 7 } };
    });
    const out = await devAnalytics();
    assert.match(seen.url, /\/api\/analytics\/totals/);
    assert.equal(seen.key, "KEY");
    assert.match(out, /totals/);
    assert.match(out, /42/);
  });

  it("devAnalytics history usa GET /api/analytics/historical con rango", async () => {
    process.env.DEVTO_API_KEY = "KEY";
    let seen = "";
    mockJson((url) => {
      seen = url;
      return [{ date: "2026-09-01", page_views: 5 }];
    });
    const out = await devAnalytics("history");
    assert.match(seen, /\/api\/analytics\/historical\?start=\d{4}-\d{2}-\d{2}&end=\d{4}-\d{2}-\d{2}/);
    assert.match(out, /history/);
  });
});
