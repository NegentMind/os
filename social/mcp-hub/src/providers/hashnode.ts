// Hashnode GraphQL (https://gql.hashnode.com). Token personal gratis
// (dashboard > Developer). Lectura de publicacion + publicar post.
// Ref mutaciones: https://github.com/Hashnode/gql-skill (skills/gql-api/references/).
import fs from "node:fs";
import path from "node:path";
import { env, missingCreds } from "../session.js";

function token(): string {
  const m = missingCreds(["HASHNODE_TOKEN"]);
  if (m.length > 0) throw new Error("Falta HASHNODE_TOKEN (Hashnode dashboard > Developer).");
  return env("HASHNODE_TOKEN");
}

async function gql(query: string, variables: Record<string, unknown>): Promise<unknown> {
  // Endpoint produccion verificado 2026 + client header; writes exigen publication Pro
  const res = await fetch("https://gql-beta.hashnode.com/", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: token(), "x-hashnode-client": "social-hub/0.4" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Hashnode HTTP ${res.status}.`);
  const j = (await res.json()) as { errors?: Array<{ message?: string }>; data?: unknown };
  if (j.errors?.length) {
    const msg = j.errors[0]?.message ?? "";
    if (/FORBIDDEN/i.test(msg)) throw new Error("Hashnode FORBIDDEN: la publication requiere plan Pro ($5/mes).");
    throw new Error(`Hashnode: ${msg.slice(0, 150)}`);
  }
  return j.data;
}

export async function hashMe(): Promise<string> {
  const d = (await gql(`{ me { username publications(first:5){ edges{ node{ id title url } } } } }`, {})) as {
    me?: { username?: string; publications?: { edges?: Array<{ node?: { id?: string; title?: string; url?: string } }> } };
  };
  const pubs = d.me?.publications?.edges ?? [];
  if (pubs.length === 0) return `@${d.me?.username ?? "?"} sin publicaciones.`;
  return `@${d.me?.username}\n` + pubs.map((p, i) => `${i + 1}. ${p.node?.title} id=${p.node?.id}\n   ${p.node?.url ?? ""}`).join("\n");
}

export async function hashLatest(publicationId: string, limit = 5): Promise<string> {
  const d = (await gql(
    `query($id: ID!, $n: Int!){ publication(id:$id){ posts(first:$n){ edges{ node{ title brief url } } } } }`,
    { id: publicationId, n: limit }
  )) as { publication?: { posts?: { edges?: Array<{ node?: { title?: string; brief?: string; url?: string } }> } } };
  const posts = d.publication?.posts?.edges ?? [];
  if (posts.length === 0) return "Sin posts (verificar publicationId con social_user hashnode).";
  return posts.map((p, i) => `${i + 1}. ${p.node?.title}\n   ${(p.node?.brief ?? "").slice(0, 150)}\n   ${p.node?.url ?? ""}`).join("\n");
}

export async function hashPublish(publicationId: string, title: string, contentMarkdown: string, opts?: { slug?: string; subtitle?: string; tagsCsv?: string; canonical?: string; cover?: string }): Promise<string> {
  if (contentMarkdown.length > 100 * 1024) throw new Error("Hashnode body max 100KB.");
  const input: Record<string, unknown> = { publicationId, title, contentMarkdown };
  if (opts?.slug) input.slug = opts.slug;
  if (opts?.subtitle) input.subtitle = opts.subtitle;
  if (opts?.canonical) input.originalArticleURL = opts.canonical;
  if (opts?.cover) input.coverImage = { url: opts.cover };
  const tags = (opts?.tagsCsv ?? "").split(",").map((t) => t.trim().toLowerCase().replace(/\s+/g, "-")).filter(Boolean).slice(0, 15);
  if (tags.length) input.tags = tags.map((slug) => ({ slug }));
  const d = (await gql(
    `mutation($in: PublishPostInput!){ publishPost(input:$in){ post{ url } } }`,
    { in: input }
  )) as { publishPost?: { post?: { url?: string } } };
  return `Publicado en Hashnode: ${d.publishPost?.post?.url ?? "ok"}`;
}

export async function hashUpdate(postId: string, patch: { title?: string; contentMarkdown?: string; subtitle?: string }): Promise<string> {
  if (!postId) throw new Error("Hashnode update requiere postId (ver social_feed hashnode).");
  const input: Record<string, unknown> = { id: postId };
  if (patch.title) input.title = patch.title;
  if (patch.contentMarkdown) {
    if (patch.contentMarkdown.length > 100 * 1024) throw new Error("Hashnode body max 100KB.");
    input.contentMarkdown = patch.contentMarkdown;
  }
  if (patch.subtitle) input.subtitle = patch.subtitle;
  if (Object.keys(input).length === 1) throw new Error("Hashnode update: patch vacio (indicar title, contentMarkdown o subtitle).");
  const d = (await gql(`mutation($in: UpdatePostInput!){ updatePost(input:$in){ post{ url } } }`, { in: input })) as {
    updatePost?: { post?: { url?: string } };
  };
  return `Actualizado en Hashnode: ${d.updatePost?.post?.url ?? "ok"}`;
}

function hashTagsCsv(tagsCsv?: string): Array<{ slug: string }> {
  return (tagsCsv ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/\s+/g, "-"))
    .filter(Boolean)
    .slice(0, 15)
    .map((slug) => ({ slug }));
}

export async function hashDraftFlow(
  publicationId: string,
  title: string,
  contentMarkdown: string,
  opts?: { slug?: string; tagsCsv?: string }
): Promise<string> {
  if (!publicationId) throw new Error("Hashnode draft requiere publicationId (ver social_user hashnode).");
  if (!title) throw new Error("Hashnode draft requiere title.");
  if (contentMarkdown.length > 100 * 1024) throw new Error("Hashnode body max 100KB.");
  const input: Record<string, unknown> = { publicationId, title, contentMarkdown };
  if (opts?.slug) input.slug = opts.slug;
  const tags = hashTagsCsv(opts?.tagsCsv);
  if (tags.length) input.tags = tags;
  const c = (await gql(`mutation($in: CreateDraftInput!){ createDraft(input:$in){ draft{ id } } }`, { in: input })) as {
    createDraft?: { draft?: { id?: string } };
  };
  const draftId = c.createDraft?.draft?.id ?? "";
  if (!draftId) throw new Error("Hashnode createDraft sin draft.id.");
  const p = (await gql(`mutation($in: PublishDraftInput!){ publishDraft(input:$in){ post{ url } } }`, {
    in: { draftId },
  })) as { publishDraft?: { post?: { url?: string } } };
  return `Publicado en Hashnode (via draft): ${p.publishDraft?.post?.url ?? "ok"}`;
}

const HASH_IMG_MAX = 8 * 1024 * 1024;
const HASH_IMG_MIMES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function hashImageUpload(localPath: string): Promise<string> {
  const ext = path.extname(localPath).toLowerCase();
  if (ext === ".svg" || ext === ".svgz") throw new Error("Hashnode: SVG rechazado por la API (usar png/jpg/webp).");
  const mime = HASH_IMG_MIMES[ext] ?? "";
  if (!mime) throw new Error(`Hashnode: extension "${ext || "?"}": solo imagenes image/* (png/jpg/webp/gif/avif), sin SVG.`);
  let size = 0;
  try {
    const st = await fs.promises.stat(localPath);
    if (!st.isFile()) throw new Error(`Hashnode: "${localPath}" no es un archivo.`);
    size = st.size;
  } catch (e) {
    if (e instanceof Error && e.message.includes("no es un archivo")) throw e;
    throw new Error(`Hashnode: no existe el archivo "${localPath}".`);
  }
  if (size > HASH_IMG_MAX)
    throw new Error(`Hashnode: ${(size / 1048576).toFixed(1)}MB excede 8MB. Comprimir antes de subir.`);
  const bytes = await fs.promises.readFile(localPath);
  // 1) URL prefirmada (solo obtiene el destino; los bytes van directo al bucket)
  const c = (await gql(
    `mutation($in: CreateImageUploadInput!){ createImageUploadURL(input:$in){ presignedPut{ url cdnUrl key } } }`,
    { in: { contentType: mime } }
  )) as { createImageUploadURL?: { presignedPut?: { url?: string; cdnUrl?: string; key?: string } } };
  const put = c.createImageUploadURL?.presignedPut;
  if (!put?.url || !put.key) throw new Error("Hashnode createImageUploadURL sin presignedPut.");
  // 2) PUT binario directo al bucket (sin form fields)
  const up = await fetch(put.url, { method: "PUT", headers: { "content-type": mime }, body: new Uint8Array(bytes) });
  if (!up.ok) throw new Error(`Hashnode upload PUT HTTP ${up.status}.`);
  // 3) confirmar (verifica 8MB y fija la URL; obligatorio tras el PUT)
  const k = (await gql(`mutation($in: ConfirmImageUploadInput!){ confirmImageUpload(input:$in){ ok cdnUrl } }`, {
    in: { key: put.key },
  })) as { confirmImageUpload?: { ok?: boolean; cdnUrl?: string } };
  if (!k.confirmImageUpload?.ok) throw new Error("Hashnode: imagen excede 8MB (eliminada por la API). Comprimir y reintentar.");
  return k.confirmImageUpload.cdnUrl ?? put.cdnUrl ?? "ok";
}

// Series de una publicación.
// Campo verificado: publication(id){ seriesList(first:N){ edges{ node{...} } } }
// Ref: apidocs.hashnode.com (seriesList + totalDocuments) y
// Hashnode/gql-skill (publication expone conexiones posts/series/drafts).
export async function hashSeries(publicationId: string): Promise<string> {
  if (!publicationId) throw new Error("Hashnode series requiere publicationId (ver social_user hashnode).");
  const d = (await gql(
    `query($id: ID!, $n: Int!){ publication(id:$id){ seriesList(first:$n){ edges{ node{ id name slug } } } } }`,
    { id: publicationId, n: 10 }
  )) as {
    publication?: {
      seriesList?: { edges?: Array<{ node?: { id?: string; name?: string; title?: string; slug?: string } }> };
    };
  };
  const edges = d.publication?.seriesList?.edges ?? [];
  if (edges.length === 0) return "Sin series en esta publicación.";
  return edges
    .map((e, i) => `${i + 1}. ${e.node?.name ?? e.node?.title ?? "?"} id=${e.node?.id ?? "?"} slug=${e.node?.slug ?? "?"}`)
    .join("\n");
}

// Hashnode NO expone programar posts por API pública: el schema GraphQL no
// tiene ninguna mutation de schedule (solo publishPost/updatePost y flujo de
// drafts). Programar es solo dashboard (editor > Schedule). Esta función no
// implementa schedule a propósito y falla con error honesto en español.
export async function hashScheduleCheck(): Promise<string> {
  throw new Error("Hashnode no soporta programar por API (solo dashboard > Schedule). Sin endpoint de schedule.");
}
