// Auditoría dev.to (developers.forem.com/api/v1): funciones nuevas + validación.
// Red mockeada con restore; nunca toca la API real.
import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  devMe, devMyArticles, devComments, devTags, devFollowedTags,
  devFollowers, devReactToggle, devVideos, devTrends, devUnpublish, devAnalytics,
} from "../dist/providers/devto.js";

const ENV_KEYS = ["DEVTO_API_KEY"];
let savedEnv;
let origFetch;

beforeEach(() => {
  savedEnv = {};
  for (const k of ENV_KEYS) savedEnv[k] = process.env[k];
  origFetch = globalThis.fetch;
  process.env.DEVTO_API_KEY = "test-key";
});

afterEach(() => {
  globalThis.fetch = origFetch;
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
});

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

describe("devto-audit: validación sin red", () => {
  it("devComments sin id numérico rechaza", async () => {
    noNet();
    await assert.rejects(() => devComments("abc"), /a_id numerico/);
    await assert.rejects(() => devComments(""), /a_id numerico/);
  });
  it("devUnpublish sin id numérico rechaza", async () => {
    noNet();
    await assert.rejects(() => devUnpublish("xyz"), /id numerico/);
  });
  it("devReactToggle category inválida rechaza", async () => {
    noNet();
    await assert.rejects(() => devReactToggle("clap", 1, "Article"), /category invalida/);
  });
  it("devReactToggle sin id rechaza", async () => {
    noNet();
    await assert.rejects(() => devReactToggle("like", 0, "Article"), /reactableId/);
  });
  it("devAnalytics kind inválido rechaza", async () => {
    noNet();
    await assert.rejects(() => devAnalytics("xxx"), /kind inválido/);
  });
  it("devMyArticles sin key rechaza", async () => {
    noNet();
    delete process.env.DEVTO_API_KEY;
    await assert.rejects(() => devMyArticles("all"), /DEVTO_API_KEY/);
  });
  it("devFollowedTags sin key rechaza", async () => {
    noNet();
    delete process.env.DEVTO_API_KEY;
    await assert.rejects(() => devFollowedTags(), /DEVTO_API_KEY/);
  });
  it("devFollowers sin key rechaza", async () => {
    noNet();
    delete process.env.DEVTO_API_KEY;
    await assert.rejects(() => devFollowers(5), /DEVTO_API_KEY/);
  });
});

describe("devto-audit: fetch mockeado", () => {
  it("devMe pega a /users/me con api-key", async () => {
    let seen = null;
    mockJson((url, opts) => {
      seen = { url, key: opts.headers["api-key"] };
      return { username: "eros", name: "Eros", followers_count: 7 };
    });
    const out = await devMe();
    assert.match(seen.url, /\/api\/users\/me$/);
    assert.equal(seen.key, "test-key");
    assert.match(out, /@eros/);
    assert.match(out, /Seguidores: 7/);
  });

  it("devMyArticles unpublished usa /articles/me/unpublished", async () => {
    let url = "";
    mockJson((u) => {
      url = u;
      return [{ title: "Draft uno", url: "https://dev.to/x/1" }];
    });
    const out = await devMyArticles("unpublished", 5);
    assert.match(url, /\/api\/articles\/me\/unpublished\?per_page=5/);
    assert.match(out, /Draft uno/);
  });

  it("devComments aplana árbol con indentación", async () => {
    mockJson(() => [
      { user: { username: "a" }, body_html: "<p>raiz</p>", children: [{ user: { username: "b" }, body_html: "<p>hija</p>", children: [] }] },
    ]);
    const out = await devComments("123", 10);
    assert.match(out, /@a: raiz/);
    assert.match(out, /  @b: hija/);
  });

  it("devTags parsea lista pública", async () => {
    mockJson(() => [{ name: "javascript" }, { name: "python" }]);
    const out = await devTags(5);
    assert.match(out, /#javascript/);
    assert.match(out, /#python/);
  });

  it("devFollowedTags pega a /follows/tags", async () => {
    let url = "";
    mockJson((u) => {
      url = u;
      return [{ name: "ai", points: 3 }];
    });
    const out = await devFollowedTags();
    assert.match(url, /\/api\/follows\/tags$/);
    assert.match(out, /#ai/);
  });

  it("devFollowers ordena con sort", async () => {
    let url = "";
    mockJson((u) => {
      url = u;
      return [{ username: "fan1", name: "Fan" }];
    });
    const out = await devFollowers(5, "-created_at");
    assert.match(url, /followers\/users\?per_page=5&sort=-created_at/);
    assert.match(out, /@fan1/);
  });

  it("devReactToggle usa POST /reactions/toggle", async () => {
    let seen = null;
    globalThis.fetch = async (url, opts = {}) => {
      seen = { url, method: opts.method };
      return { ok: true, status: 200, headers: { get: () => null }, json: async () => ({}), text: async () => "" };
    };
    const out = await devReactToggle("like", 42, "Article");
    assert.match(seen.url, /\/api\/reactions\/toggle\?category=like&reactable_id=42&reactable_type=Article/);
    assert.equal(seen.method, "POST");
    assert.match(out, /toggle/);
  });

  it("devVideos usa /api/videos", async () => {
    let url = "";
    mockJson((u) => {
      url = u;
      return [{ title: "Video post", user: { username: "v" }, tag_list: [] }];
    });
    const out = await devVideos(3);
    assert.match(url, /\/api\/videos\?per_page=3/);
    assert.match(out, /Video post/);
  });

  it("devTrends usa /api/trends", async () => {
    let url = "";
    mockJson((u) => {
      url = u;
      return [{ name: "Agentes IA", articles_count: 12, description: "tendencia" }];
    });
    const out = await devTrends(5);
    assert.match(url, /\/api\/trends\?per_page=5/);
    assert.match(out, /Agentes IA \(12 articulos\)/);
  });

  it("devUnpublish usa PUT /articles/:id/unpublish con note", async () => {
    let seen = null;
    globalThis.fetch = async (url, opts = {}) => {
      seen = { url, method: opts.method };
      return { ok: true, status: 204, headers: { get: () => null }, json: async () => ({}), text: async () => "" };
    };
    const out = await devUnpublish("99", "prueba");
    assert.match(seen.url, /\/api\/articles\/99\/unpublish\?note=prueba/);
    assert.equal(seen.method, "PUT");
    assert.match(out, /despublicado/);
  });

  it("devAnalytics past_day usa /analytics/past_day sin rango", async () => {
    let url = "";
    mockJson((u) => {
      url = u;
      return { hour: [{ views: 1 }] };
    });
    const out = await devAnalytics("past_day");
    assert.match(url, /\/api\/analytics\/past_day$/);
    assert.match(out, /past_day/);
  });

  it("devAnalytics referrers incluye rango por defecto", async () => {
    let url = "";
    mockJson((u) => {
      url = u;
      return { domains: [] };
    });
    await devAnalytics("referrers");
    assert.match(url, /\/api\/analytics\/referrers\?start=\d{4}-\d{2}-\d{2}&end=\d{4}-\d{2}-\d{2}/);
  });
});
