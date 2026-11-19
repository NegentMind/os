import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { dailyBookmarkAdd, dailySquadPost } from "../dist/providers/dailydev.js";
import { igDM } from "../dist/providers/instagram-direct.js";
import { ttUserInfo, ttVideoList } from "../dist/providers/tiktok-direct.js";
import { thCarousel, thReply } from "../dist/providers/threads-direct.js";
import { wattChapter } from "../dist/providers/wattpad.js";

const ENV_KEYS = ["DAILYDEV_TOKEN", "IG_USER_ID", "IG_TOKEN", "TIKTOK_TOKEN", "THREADS_USER_ID", "THREADS_TOKEN"];
let savedEnv;
let origFetch;

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
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

describe("validaciones previas (sin red ni browser)", () => {
  it("dailySquadPost sin titulo rechaza antes del browser", async () => {
    await assert.rejects(() => dailySquadPost("mi-squad", "", "https://example.com/x"), /titulo/);
  });
  it("dailySquadPost sin squadHandle rechaza", async () => {
    await assert.rejects(() => dailySquadPost("", "Titulo", "texto"), /squadHandle/);
  });
  it("dailyBookmarkAdd sin postId rechaza", async () => {
    await assert.rejects(() => dailyBookmarkAdd(""), /postId/);
  });
  it("igDM sin recipient rechaza", async () => {
    await assert.rejects(() => igDM("", "hola"), /recipientId/);
  });
  it("igDM sin texto rechaza", async () => {
    await assert.rejects(() => igDM("12345", ""), /texto/);
  });
  it("thCarousel con 0 imgs rechaza", async () => {
    await assert.rejects(() => thCarousel([], "hola"), /al menos 2/);
  });
  it("thCarousel con 1 img rechaza", async () => {
    await assert.rejects(() => thCarousel(["https://example.com/a.jpg"]), /al menos 2/);
  });
  it("thReply sin parentId rechaza", async () => {
    await assert.rejects(() => thReply("", "hola"), /parentId/);
  });
  it("ttUserInfo sin token rechaza", async () => {
    delete process.env.TIKTOK_TOKEN;
    await assert.rejects(() => ttUserInfo(), /TIKTOK_TOKEN/);
  });
  it("ttVideoList con max fuera de rango rechaza", async () => {
    await assert.rejects(() => ttVideoList(0, 99), /1-20/);
  });
  it("wattChapter URL invalida rechaza sin abrir browser", async () => {
    await assert.rejects(() => wattChapter("no-es-url", 1), /Wattpad/);
  });
  it("wattChapter chapterIndex invalido rechaza", async () => {
    await assert.rejects(() => wattChapter("https://www.wattpad.com/story/123", 0), /chapterIndex/);
  });
});

describe("fetch mock (red simulada)", () => {
  it("dailyBookmarkAdd POST /bookmarks/ parseo", async () => {
    process.env.DAILYDEV_TOKEN = "dummy";
    let seen = {};
    globalThis.fetch = async (url, init) => {
      seen = { url: String(url), method: init?.method, body: JSON.parse(String(init?.body)) };
      return jsonResponse({ data: [{ postId: "abc123", createdAt: "2026-01-01T00:00:00Z", listId: null }] });
    };
    const out = await dailyBookmarkAdd("abc123");
    assert.match(out, /Bookmark guardado/);
    assert.match(out, /abc123/);
    assert.match(seen.url, /\/bookmarks\/$/);
    assert.equal(seen.method, "POST");
    assert.deepEqual(seen.body, { postIds: ["abc123"] });
  });

  it("igDM POST messages parseo", async () => {
    process.env.IG_USER_ID = "111";
    process.env.IG_TOKEN = "dummy";
    let seen = {};
    globalThis.fetch = async (url, init) => {
      seen = { url: String(url), method: init?.method, body: JSON.parse(String(init?.body)) };
      return jsonResponse({ recipient_id: "999", message_id: "mid.123" });
    };
    const out = await igDM("999", "hola");
    assert.match(out, /DM enviado/);
    assert.match(out, /mid\.123/);
    assert.match(seen.url, /\/111\/messages$/);
    assert.equal(seen.method, "POST");
    assert.deepEqual(seen.body.recipient, { id: "999" });
    assert.deepEqual(seen.body.message, { text: "hola" });
  });

  it("ttUserInfo parseo", async () => {
    process.env.TIKTOK_TOKEN = "dummy";
    globalThis.fetch = async (url) => {
      assert.match(String(url), /\/v2\/user\/info\//);
      return jsonResponse({
        data: {
          user: {
            open_id: "oid",
            username: "testuser",
            display_name: "Test User",
            follower_count: 10,
            following_count: 5,
            likes_count: 7,
            video_count: 3,
            is_verified: false,
            bio_description: "bio",
          },
        },
        error: { code: "ok", message: "", log_id: "x" },
      });
    };
    const out = await ttUserInfo();
    assert.match(out, /@testuser/);
    assert.match(out, /seguidores=10/);
    assert.match(out, /videos=3/);
  });

  it("ttVideoList parseo", async () => {
    process.env.TIKTOK_TOKEN = "dummy";
    let seen = {};
    globalThis.fetch = async (url, init) => {
      seen = { url: String(url), body: JSON.parse(String(init?.body)) };
      return jsonResponse({
        data: { videos: [{ id: "v1", title: "Mi video" }], cursor: 0, has_more: false },
        error: { code: "ok", message: "", log_id: "x" },
      });
    };
    const out = await ttVideoList(0, 10);
    assert.match(out, /Mi video/);
    assert.match(out, /v1/);
    assert.match(seen.url, /\/v2\/video\/list\//);
    assert.equal(seen.body.max_count, 10);
  });

  it("ttVideoList error de scope es accionable", async () => {
    process.env.TIKTOK_TOKEN = "dummy";
    globalThis.fetch = async () =>
      jsonResponse({
        data: {},
        error: { code: "access_token_invalid", message: "scope not authorized", log_id: "x" },
      });
    await assert.rejects(() => ttVideoList(), /scope/i);
  });

  it("thReply usa reply_to_id (documentado) parseo", async () => {
    process.env.THREADS_USER_ID = "42";
    process.env.THREADS_TOKEN = "dummy";
    const calls = [];
    globalThis.fetch = async (url, init) => {
      calls.push({ url: String(url), body: JSON.parse(String(init?.body)) });
      if (String(url).endsWith("/threads_publish")) return jsonResponse({ id: "media789" });
      return jsonResponse({ id: "cont123" });
    };
    const out = await thReply("padre1", "respuesta!");
    assert.match(out, /Respuesta publicada/);
    assert.match(out, /media789/);
    assert.equal(calls[0].body.reply_to_id, "padre1");
    assert.equal(calls[0].body.media_type, "TEXT");
    assert.equal(calls[1].body.creation_id, "cont123");
  });

  it("thCarousel hijos + CAROUSEL con children parseo", async () => {
    process.env.THREADS_USER_ID = "42";
    process.env.THREADS_TOKEN = "dummy";
    const calls = [];
    let n = 0;
    globalThis.fetch = async (url, init) => {
      const body = JSON.parse(String(init?.body));
      calls.push({ url: String(url), body });
      n += 1;
      if (String(url).endsWith("/threads_publish")) return jsonResponse({ id: "pub1" });
      return jsonResponse({ id: `c${n}` });
    };
    const out = await thCarousel(["https://example.com/a.jpg", "https://example.com/b.mp4"], "pie");
    assert.match(out, /Carrusel publicado/);
    assert.match(out, /2 hijos/);
    assert.equal(calls[0].body.media_type, "IMAGE");
    assert.equal(calls[0].body.is_carousel_item, true);
    assert.equal(calls[1].body.media_type, "VIDEO");
    assert.equal(calls[2].body.media_type, "CAROUSEL");
    assert.equal(calls[2].body.children, "c1,c2");
    assert.equal(calls[2].body.text, "pie");
    assert.equal(calls[3].body.creation_id, "c3");
  });
});
