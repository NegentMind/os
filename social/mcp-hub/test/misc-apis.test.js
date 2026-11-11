import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { dcSlashRegister, dcForumPost } from "../dist/providers/discord.js";
import { devOrg, devReadingList } from "../dist/providers/devto.js";
import { hashSeries, hashScheduleCheck } from "../dist/providers/hashnode.js";
import { medPublications, medImageUpload, medPublishPub } from "../dist/providers/medium.js";
import { hnFlag } from "../dist/providers/hn.js";

const ENV_KEYS = ["DISCORD_APP_ID", "DISCORD_BOT_TOKEN", "DEVTO_API_KEY", "HASHNODE_TOKEN", "MEDIUM_TOKEN"];
const savedEnv = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
const origFetch = globalThis.fetch;

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
  globalThis.fetch = async (url, opts) => ({
    ok: true,
    status: 200,
    headers: { get: () => null },
    json: async () => handler(String(url), opts ?? {}),
    text: async () => "",
  });
}

describe("validaciones sin red", () => {
  it("dcSlashRegister rechaza nombres inválidos", async () => {
    noNet();
    await assert.rejects(() => dcSlashRegister([{ name: "ConMayus", description: "d" }]), /minúsculas/);
    await assert.rejects(() => dcSlashRegister([{ name: "con espacio", description: "d" }]), /solo letras/);
    await assert.rejects(() => dcSlashRegister([{ name: "", description: "d" }]), /1-32/);
    await assert.rejects(() => dcSlashRegister([{ name: "a".repeat(33), description: "d" }]), /1-32/);
    await assert.rejects(() => dcSlashRegister([]), /vacío/);
  });
  it("dcForumPost rechaza sin título", async () => {
    noNet();
    await assert.rejects(() => dcForumPost("123", "", "hola"), /sin título/i);
    await assert.rejects(() => dcForumPost("123", "   ", "hola"), /sin título/i);
    await assert.rejects(() => dcForumPost("", "t", "hola"), /channelId/);
  });
  it("devReadingList sin key rechaza", async () => {
    delete process.env.DEVTO_API_KEY;
    noNet();
    await assert.rejects(() => devReadingList(), /DEVTO_API_KEY/);
  });
  it("medImageUpload archivo inexistente rechaza", async () => {
    noNet();
    await assert.rejects(() => medImageUpload("C:/tmp/no-existe-xyz.png"), /no existe el archivo/);
  });
  it("hnFlag id no numérico rechaza", async () => {
    noNet();
    await assert.rejects(() => hnFlag("abc"), /numérico/);
    await assert.rejects(() => hnFlag(""), /numérico/);
  });
  it("hashScheduleCheck explica que es solo dashboard", async () => {
    noNet();
    await assert.rejects(() => hashScheduleCheck(), /dashboard/);
  });
  it("medPublishPub exige publicationId", async () => {
    noNet();
    await assert.rejects(() => medPublishPub("", "t", "c"), /publicationId/);
  });
});

describe("fetch-mock", () => {
  it("dcSlashRegister usa PUT /applications/{id}/commands", async () => {
    process.env.DISCORD_APP_ID = "APP123";
    process.env.DISCORD_BOT_TOKEN = "TOK";
    let seen = {};
    mockJson((url, opts) => {
      seen = { url, method: opts.method, auth: opts.headers?.authorization, body: JSON.parse(opts.body) };
      return [{ name: "hola" }];
    });
    const out = await dcSlashRegister([{ name: "hola", description: "saluda" }]);
    assert.equal(seen.url, "https://discord.com/api/v10/applications/APP123/commands");
    assert.equal(seen.method, "PUT");
    assert.equal(seen.auth, "Bot TOK");
    assert.deepEqual(seen.body, [{ name: "hola", description: "saluda", type: 1 }]);
    assert.match(out, /1/);
  });
  it("dcForumPost usa POST /channels/{id}/threads con name+message", async () => {
    process.env.DISCORD_BOT_TOKEN = "TOK";
    let seen = {};
    mockJson((url, opts) => {
      seen = { url, method: opts.method, body: JSON.parse(opts.body) };
      return { id: "thread1" };
    });
    const out = await dcForumPost("999", "Título", "contenido");
    assert.equal(seen.url, "https://discord.com/api/v10/channels/999/threads");
    assert.equal(seen.method, "POST");
    assert.equal(seen.body.name, "Título");
    assert.equal(seen.body.message.content, "contenido");
    assert.match(out, /thread1/);
  });
  it("hashSeries parsea id/título/slug", async () => {
    process.env.HASHNODE_TOKEN = "TOK";
    mockJson((url, opts) => {
      assert.equal(url, "https://gql-beta.hashnode.com/");
      assert.equal(opts.method, "POST");
      assert.ok(JSON.parse(opts.body).query.includes("seriesList"));
      return {
        data: {
          publication: {
            seriesList: { edges: [{ node: { id: "s1", name: "Serie Uno", slug: "serie-uno" } }] },
          },
        },
      };
    });
    const out = await hashSeries("PUB1");
    assert.match(out, /Serie Uno/);
    assert.match(out, /s1/);
    assert.match(out, /serie-uno/);
  });
  it("medPublications parsea lista (vía /v1/me)", async () => {
    process.env.MEDIUM_TOKEN = "TOK";
    const urls = [];
    mockJson((url) => {
      urls.push(url);
      if (url.endsWith("/v1/me")) return { data: { id: "auth1" } };
      return { data: [{ id: "pub1", name: "Mi Pub", url: "https://medium.com/mi-pub" }] };
    });
    const out = await medPublications();
    assert.ok(urls.some((u) => u === "https://api.medium.com/v1/me"));
    assert.ok(urls.some((u) => u === "https://api.medium.com/v1/users/auth1/publications"));
    assert.match(out, /Mi Pub/);
    assert.match(out, /pub1/);
  });
  it("devOrg usa endpoint verificado /api/organizations/{slug}/articles", async () => {
    let seen = "";
    mockJson((url, opts) => {
      seen = url;
      assert.ok(!opts.headers?.["api-key"], "devOrg es lectura pública sin key");
      return [{ title: "Post Org", url: "https://dev.to/x", tag_list: [], user: { username: "acme" } }];
    });
    const out = await devOrg("acme", 5);
    assert.ok(seen.includes("/api/organizations/acme/articles"), seen);
    assert.match(out, /Post Org/);
  });
  it("devReadingList usa GET /api/readinglist con key", async () => {
    process.env.DEVTO_API_KEY = "KEY";
    let seen = {};
    mockJson((url, opts) => {
      seen = { url, key: opts.headers?.["api-key"] };
      return [{ title: "Guardado", url: "https://dev.to/y", tag_list: [], user: { username: "yo" } }];
    });
    const out = await devReadingList();
    assert.ok(seen.url.includes("/api/readinglist"), seen.url);
    assert.equal(seen.key, "KEY");
    assert.match(out, /Guardado/);
  });
  it("medPublishPub usa POST /v1/publications/{id}/posts", async () => {
    process.env.MEDIUM_TOKEN = "TOK";
    let seen = {};
    mockJson((url, opts) => {
      seen = { url, method: opts.method, body: JSON.parse(opts.body) };
      return { data: { url: "https://medium.com/p/abc" } };
    });
    const out = await medPublishPub("pub1", "Título", "contenido");
    assert.equal(seen.url, "https://api.medium.com/v1/publications/pub1/posts");
    assert.equal(seen.method, "POST");
    assert.equal(seen.body.title, "Título");
    assert.match(out, /pub1/);
  });
});
