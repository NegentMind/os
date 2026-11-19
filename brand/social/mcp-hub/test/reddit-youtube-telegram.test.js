import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { redditFlairLink, redditSelectFlair, redditMod } from "../dist/providers/reddit.js";
import { ytPlaylists, ytUpload } from "../dist/providers/youtube.js";
import { tgButtons, tgBan, tgUnban } from "../dist/providers/telegram.js";

const origFetch = globalThis.fetch;

function setFetch(handler) {
  globalThis.fetch = handler;
}
function restoreFetch() {
  globalThis.fetch = origFetch;
}

function setEnv(vars) {
  const saved = {};
  for (const k of Object.keys(vars)) {
    saved[k] = process.env[k];
    if (vars[k] === undefined) delete process.env[k];
    else process.env[k] = vars[k];
  }
  return saved;
}
function restoreEnv(saved) {
  for (const k of Object.keys(saved)) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
}

const REDDIT_ENV = {
  REDDIT_CLIENT_ID: "test-id",
  REDDIT_CLIENT_SECRET: "test-secret",
  REDDIT_USERNAME: "test-user",
  REDDIT_PASSWORD: "test-pass",
};

function redditMock(calls, flairPayload) {
  return async (url, opts = {}) => {
    calls.push({ url: String(url), method: opts.method ?? "GET", body: opts.body });
    if (String(url).includes("access_token")) {
      return { ok: true, status: 200, json: async () => ({ access_token: "tok-test", expires_in: 3600 }) };
    }
    if (String(url).includes("link_flair")) {
      return { ok: true, status: 200, json: async () => flairPayload };
    }
    return { ok: true, status: 200, json: async () => ({}) };
  };
}

describe("reddit flair/mod (nuevas)", () => {
  it("redditFlairLink parsea lista id/texto", async () => {
    const saved = setEnv(REDDIT_ENV);
    const calls = [];
    setFetch(redditMock(calls, [{ id: "t1", text: "Noticia" }, { id: "t2", text: "Debate" }]));
    try {
      const out = await redditFlairLink("testsub");
      assert.match(out, /t1/);
      assert.match(out, /Noticia/);
      assert.match(out, /t2/);
      assert.match(out, /Debate/);
      const api = calls.find((c) => c.url.includes("link_flair"));
      assert.ok(api, "debe llamar a link_flair");
      assert.match(api.url, /\/r\/testsub\/api\/link_flair/);
    } finally {
      restoreFetch();
      restoreEnv(saved);
    }
  });

  it("redditSelectFlair sin thingId rechaza (antes de red)", async () => {
    const saved = setEnv(REDDIT_ENV);
    setFetch(() => { throw new Error("no debe haber red"); });
    try {
      await assert.rejects(() => redditSelectFlair("", "abc12345"), /thingId/);
    } finally {
      restoreFetch();
      restoreEnv(saved);
    }
  });

  it("redditMod action inválida rechaza", async () => {
    const saved = setEnv(REDDIT_ENV);
    setFetch(() => { throw new Error("no debe haber red"); });
    try {
      await assert.rejects(() => redditMod("t3_abc", "ban"), /inválida/);
    } finally {
      restoreFetch();
      restoreEnv(saved);
    }
  });
});

describe("youtube playlists/upload (nuevas)", () => {
  it("ytPlaylists sin key rechaza con pasos GCP", async () => {
    const saved = setEnv({ YT_API_KEY: undefined });
    setFetch(() => { throw new Error("no debe haber red"); });
    try {
      await assert.rejects(() => ytPlaylists("UCxxxxxxxxxxxxxxxxxxxxxx"), /console\.cloud\.google|YT_API_KEY/);
    } finally {
      restoreFetch();
      restoreEnv(saved);
    }
  });

  it("ytUpload sin archivo rechaza antes de red", async () => {
    const saved = setEnv({ YT_CLIENT_ID: "id", YT_CLIENT_SECRET: "sec", YT_REFRESH_TOKEN: "rt" });
    setFetch(() => { throw new Error("no debe haber red"); });
    try {
      await assert.rejects(() => ytUpload("/ruta/inexistente-xyz-12345.mp4", "titulo"), /no encontrado/i);
    } finally {
      restoreFetch();
      restoreEnv(saved);
    }
  });
});

describe("telegram buttons/ban (nuevas)", () => {
  it("tgButtons con 0 filas rechaza", async () => {
    await assert.rejects(() => tgButtons("123", "hola", []), /1-8 filas/);
  });

  it("tgButtons request con inline_keyboard correcto", async () => {
    const saved = setEnv({ TELEGRAM_BOT_TOKEN: "tok-test", TELEGRAM_CHAT_ID: undefined });
    const calls = [];
    setFetch(async (url, opts = {}) => {
      calls.push({ url: String(url), method: opts.method, body: JSON.parse(opts.body) });
      return { ok: true, status: 200, json: async () => ({ ok: true, result: {} }), text: async () => "" };
    });
    try {
      const out = await tgButtons("123", "hola", [["A", "B"], ["C"]]);
      assert.match(out, /botones/);
      assert.equal(calls.length, 1);
      assert.match(calls[0].url, /\/sendMessage$/);
      assert.equal(calls[0].method, "POST");
      assert.equal(calls[0].body.chat_id, "123");
      assert.equal(calls[0].body.text, "hola");
      assert.deepEqual(calls[0].body.reply_markup, {
        inline_keyboard: [
          [{ text: "A", callback_data: "A" }, { text: "B", callback_data: "B" }],
          [{ text: "C", callback_data: "C" }],
        ],
      });
    } finally {
      restoreFetch();
      restoreEnv(saved);
    }
  });

  it("tgBan/tgUnban validan userId antes de red", async () => {
    setFetch(() => { throw new Error("no debe haber red"); });
    try {
      await assert.rejects(() => tgBan("123", 0), /userId inválido/);
      await assert.rejects(() => tgUnban("123", -5), /userId inválido/);
    } finally {
      restoreFetch();
    }
  });

  it("tgBan llama a banChatMember", async () => {
    const saved = setEnv({ TELEGRAM_BOT_TOKEN: "tok-test", TELEGRAM_CHAT_ID: undefined });
    const calls = [];
    setFetch(async (url, opts = {}) => {
      calls.push({ url: String(url), method: opts.method, body: JSON.parse(opts.body) });
      return { ok: true, status: 200, json: async () => ({ ok: true, result: true }), text: async () => "" };
    });
    try {
      await tgBan("123", 456);
      await tgUnban("123", 456);
      assert.match(calls[0].url, /\/banChatMember$/);
      assert.deepEqual(calls[0].body, { chat_id: "123", user_id: 456 });
      assert.match(calls[1].url, /\/unbanChatMember$/);
      assert.deepEqual(calls[1].body, { chat_id: "123", user_id: 456 });
    } finally {
      restoreFetch();
      restoreEnv(saved);
    }
  });
});
