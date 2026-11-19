import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ensureDirs, env } from "./session.js";
import { readGate, writeGate, writeGateFor } from "./rate-limit.js";
import { bskySearch, bskyProfile, bskyPost, bskyReply, bskyLike, bskyFollow, bskyDMs, bskyDMSend, bskyUploadImage, bskyPostImage, bskyRepost, bskyThread, bskyNotifs } from "./providers/bluesky.js";
import { redditHot, redditSearch, redditComments, redditUser, redditSubmit, redditComment, redditVote, redditSave, redditCrosspost, redditFlairLink, redditSelectFlair, redditMod } from "./providers/reddit.js";
import { youtubeMeta, youtubeTranscript, ytComment, ytLike, ytSubscribe, ytPlaylists, ytUpload, ytVideoUpdate, ytVideoDelete } from "./providers/youtube.js";
import { xSearch, xFeed, xBookmarks, xNotifications, xUser, xUserTweets, xTrending, xPost, xReply, xLike, xRetweet, xBookmark, xThread, xDMSend, xPoll, xMediaPost, xLists, xQuote } from "./providers/x-browser.js";
import { liOpen, liProfile, liCompany, liJobs, liInbox } from "./providers/linkedin-browser.js";
import { liShare, liCompanyPost, liInvite, liMessage } from "./providers/linkedin-post.js";
import { bufferProfiles, bufferPublish } from "./providers/buffer-direct.js";
import { tgMe, tgSend, tgUpdates, tgPhoto, tgPoll, tgEdit, tgDelete, tgPin, tgMediaGroup, tgButtons, tgBan, tgUnban } from "./providers/telegram.js";
import { dcSend, dcRead, dcEmbed, dcReact, dcDelete, dcThread, dcSlashRegister, dcForumPost } from "./providers/discord.js";
import { wattSearch, wattStory, wattChapter } from "./providers/wattpad.js";
import { devLatest, devSearch, devShow, devUser, devPublish, devComment, devUpdate, devFollow, devReact, devDelete, devOrg, devReadingList, devAnalytics, devMe, devMyArticles, devComments, devTags, devFollowedTags, devFollowers, devReactToggle, devVideos, devTrends, devUnpublish } from "./providers/devto.js";
import { tuMe, tuDialogs, tuHistory, tuSend } from "./providers/telegram-user.js";
import { hnTop, hnSearch, hnComments, hnUser, hnSubmit, hnReply, hnUpvote, hnFlag } from "./providers/hn.js";
import { hashMe, hashLatest, hashPublish, hashUpdate, hashDraftFlow, hashImageUpload, hashSeries } from "./providers/hashnode.js";
import { medTag, medUser, medPublish, medRespond, medPublications, medImageUpload, medPublishPub } from "./providers/medium.js";
import { dailyTrending, dailySearch, dailyBookmarks, dailyUpvote, dailyBookmarkAdd, dailySquadPost } from "./providers/dailydev.js";
import { fbPost, fbPhoto, fbFeed, fbComment, fbVideo, fbInsights, fbScheduled, fbDeletePost } from "./providers/facebook.js";
import { igPublish, igCommentReply, igCommentHide, igLimit, igDM } from "./providers/instagram-direct.js";
import { ttPost, ttUserInfo, ttVideoList } from "./providers/tiktok-direct.js";
import { thPost, thLimit, thCarousel, thReply, thPoll } from "./providers/threads-direct.js";
import { splitThread, uploadMedia } from "./compose.js";
import { readInbox } from "./inbox.js";
import { enqueue, listQueue, cancel, runDue, adapt } from "./scheduler.js";

const server = new McpServer({ name: "social-hub", version: "0.7.0" });
ensureDirs();

const T = (s: string) => ({ content: [{ type: "text" as const, text: s }] });
const err = (e: unknown) => `Error: ${e instanceof Error ? e.message : e}`;
const CONFIRM = "true solo si el usuario confirmo el texto final";

async function read(fn: () => Promise<string>) {
  await readGate();
  try { return T(await fn()); } catch (e) { return T(err(e)); }
}
async function write(confirm: boolean, provider: string, fn: () => Promise<string>) {
  if (!confirm) return T("Bloqueado: falta confirm:true del usuario.");
  try { return T(await writeGateFor(provider, fn)); } catch (e) { return T(err(e)); }
}

server.registerTool("social_search", {
  title: "Buscar", description: "Bluesky / X / Reddit / LinkedIn jobs / Wattpad / Dev.to / Medium / Daily.dev / HN.",
  inputSchema: {
    provider: z.enum(["bluesky", "x", "reddit", "linkedin-jobs", "wattpad", "devto", "medium", "dailydev", "hn"]),
    query: z.string().min(1), sub: z.string().optional(), limit: z.number().min(1).max(10).default(5),
  },
}, async ({ provider, query, sub, limit }) => read(() =>
  provider === "bluesky" ? bskySearch(query, limit)
  : provider === "x" ? xSearch(query)
  : provider === "reddit" ? redditSearch(query, limit, sub)
  : provider === "wattpad" ? wattSearch(query, limit)
  : provider === "devto" ? devSearch(query, limit)
  : provider === "medium" ? medTag(query, limit)
  : provider === "dailydev" ? dailySearch(query, limit)
  : provider === "hn" ? hnSearch(query, limit)
  : liJobs(query, limit)));

server.registerTool("social_feed", {
  title: "Feeds", description: "Reddit / X(+listas) / LinkedIn / Telegram / Discord / Dev.to(+saved/analytics) / HN(+sort) / Daily.dev / Medium / Hashnode / Facebook(+insights/scheduled) / Bluesky notifs / YouTube playlists / TikTok.",
  inputSchema: {
    provider: z.enum(["reddit", "x-home", "x-bookmarks", "x-notifs", "x-lists", "linkedin-inbox", "telegram", "telegram-user", "telegram-history", "discord", "devto", "devto-saved", "devto-analytics", "devto-videos", "devto-trends", "devto-myarticles", "hackernews", "dailydev", "dailydev-saved", "medium", "hashnode", "facebook", "facebook-insights", "facebook-scheduled", "bluesky-notifs", "youtube-playlists", "tiktok"]),
    sub: z.string().default("all"), limit: z.number().min(1).max(10).default(5), channelId: z.string().optional(), publicationId: z.string().optional(),
  },
}, async ({ provider, sub, limit, channelId, publicationId }) => read(() =>
  provider === "reddit" ? redditHot(sub, limit)
  : provider === "x-home" ? xFeed()
  : provider === "x-bookmarks" ? xBookmarks()
  : provider === "x-notifs" ? xNotifications()
  : provider === "x-lists" ? xLists()
  : provider === "telegram" ? tgUpdates()
  : provider === "telegram-user" ? tuDialogs(limit)
  : provider === "telegram-history" ? tuHistory(sub, limit)
  : provider === "discord" ? dcRead(channelId ?? "", limit)
  : provider === "devto" ? devLatest(sub, limit)
  : provider === "devto-saved" ? devReadingList(limit)
  : provider === "devto-videos" ? devVideos(limit)
  : provider === "devto-trends" ? devTrends(limit)
  : provider === "devto-myarticles" ? devMyArticles((sub === "published" || sub === "unpublished") ? sub : "all", limit)
  : provider === "devto-analytics" ? devAnalytics(sub === "history" ? "history" : "totals")
  : provider === "hackernews" ? hnTop(limit, sub === "all" ? "top" : sub)
  : provider === "dailydev" ? dailyTrending(limit)
  : provider === "dailydev-saved" ? dailyBookmarks(limit)
  : provider === "medium" ? medTag(sub === "all" ? "programming" : sub, limit)
  : provider === "hashnode" ? hashLatest(publicationId ?? "", limit)
  : provider === "facebook" ? fbFeed(limit)
  : provider === "facebook-insights" ? fbInsights()
  : provider === "facebook-scheduled" ? fbScheduled(limit)
  : provider === "youtube-playlists" ? ytPlaylists(sub === "all" ? "mine" : sub)
  : provider === "tiktok" ? ttVideoList(0, limit)
  : bskyNotifs(limit)));

server.registerTool("social_metrics", {
  title: "Métricas agregadas",
  description: "Agrega en paralelo (allSettled) facebook-insights + tiktok-perfil + hackernews-usuario + devto-analytics; cada fuente se reporta por separado y una puede fallar sin romper las demás. Sin confirm.",
  inputSchema: { hnUser: z.string().optional().describe("usuario HN (por defecto HN_USERNAME)") },
}, async ({ hnUser: hnParam }) => read(async () => {
  const user = (hnParam ?? "").trim() || env("HN_USERNAME");
  const jobs: Array<[string, () => Promise<string>]> = [
    ["facebook", () => fbInsights()],
    ["tiktok", () => ttUserInfo()],
    ["devto", () => devAnalytics()],
    ["hackernews",
      user ? () => hnUser(user) : () => Promise.reject(new Error("Falta hnUser o HN_USERNAME en .env para métricas de HN."))],
  ];
  const results = await Promise.allSettled(jobs.map(([, fn]) => fn()));
  return jobs.map(([name], i) => {
    const r = results[i];
    return `## ${name}\n${r.status === "fulfilled" ? r.value : `FALLO: ${r.reason instanceof Error ? r.reason.message : String(r.reason)}`}`;
  }).join("\n\n");
}));

server.registerTool("social_user", {
  title: "Usuario/perfil", description: "Bluesky / X / Reddit(+flair) / LinkedIn / Telegram / Wattpad+capitulo / Dev.to(+org) / HN / Hashnode(+series) / Medium / IG-Threads limits / TikTok.",
  inputSchema: { provider: z.enum(["bluesky", "x", "reddit", "reddit-flair", "linkedin", "linkedin-company", "telegram", "telegram-user", "wattpad", "devto", "devto-org", "devto-me", "devto-followers", "devto-followed-tags", "hn", "hashnode", "hashnode-series", "medium", "instagram-limit", "threads-limit", "tiktok"]), id: z.string().default(""), limit: z.number().min(1).max(10).default(5) },
}, async ({ provider, id, limit }) => read(() =>
  provider === "bluesky" ? bskyProfile(id)
  : provider === "x" ? xUser(id)
  : provider === "reddit" ? redditUser(id, limit)
  : provider === "reddit-flair" ? redditFlairLink(id)
  : provider === "linkedin" ? liProfile(id)
  : provider === "linkedin-company" ? liCompany(id)
  : provider === "telegram" ? tgMe()
  : provider === "telegram-user" ? tuMe()
  : provider === "devto" ? devUser(id, limit)
  : provider === "devto-org" ? devOrg(id, limit)
  : provider === "devto-me" ? devMe()
  : provider === "devto-followers" ? devFollowers(limit)
  : provider === "devto-followed-tags" ? devFollowedTags()
  : provider === "hn" ? hnUser(id)
  : provider === "hashnode" ? hashMe()
  : provider === "hashnode-series" ? hashSeries(id)
  : provider === "medium" ? medUser(id, limit)
  : provider === "instagram-limit" ? igLimit()
  : provider === "threads-limit" ? thLimit()
  : provider === "tiktok" ? ttUserInfo()
  : wattStory(id)));

server.registerTool("social_xtweets", {
  title: "Tweets de usuario / trending", description: "X user tweets o trending.",
  inputSchema: { kind: z.enum(["user", "trending"]), handle: z.string().optional() },
}, async ({ kind, handle }) => read(() => (kind === "trending" ? xTrending() : xUserTweets(handle ?? ""))));

server.registerTool("social_article", {
  title: "Articulo/capitulo", description: "Dev.to por id, o capitulo Wattpad por URL.",
  inputSchema: { kind: z.enum(["devto", "wattpad"]).default("devto"), id: z.string().min(1), url: z.string().optional(), chapter: z.number().optional() },
}, async ({ kind, id, url, chapter }) => read(() => (kind === "wattpad" ? wattChapter(url ?? id, chapter ?? 1) : devShow(id))));

server.registerTool("social_comments", {
  title: "Comentarios", description: "Reddit (t3_), Hacker News (id numerico) o Dev.to (a_id numerico, arbol aplanado).",
  inputSchema: { provider: z.enum(["reddit", "hackernews", "devto"]).default("reddit"), postId: z.string().min(1), sub: z.string().optional(), limit: z.number().min(1).max(10).default(5) },
}, async ({ provider, postId, sub, limit }) => read(() =>
  provider === "hackernews" ? hnComments(postId, limit)
  : provider === "devto" ? devComments(postId, limit)
  : redditComments(postId, sub, limit)));

server.registerTool("social_transcript", {
  title: "YouTube", description: "Metadata oEmbed o transcript via captions.",
  inputSchema: { kind: z.enum(["meta", "transcript"]), url: z.string().min(1), lang: z.string().optional() },
}, async ({ kind, url, lang }) => read(() => (kind === "meta" ? youtubeMeta(url) : youtubeTranscript(url, lang ?? ""))));

server.registerTool("social_open", {
  title: "Abrir LinkedIn", description: "Abre URL LinkedIn con perfil persistente.",
  inputSchema: { url: z.string().url() },
}, async ({ url }) => read(() => liOpen(url)));

server.registerTool("social_inbox", {
  title: "Bandeja unificada", description: "Telegram updates + Discord canal + Bluesky DMs + LinkedIn inbox.",
  inputSchema: { channelId: z.string().optional().describe("canal Discord (o DISCORD_CHANNEL_ID)") },
}, async ({ channelId }) => read(() => {
  if (channelId) process.env.DISCORD_CHANNEL_ID = channelId;
  return readInbox();
}));

server.registerTool("social_post", {
  title: "Publicar",
  description: "Bluesky(+thread[]/image) / X(+thread[]) / Reddit / Telegram / Discord / Dev.to / Hashnode(+draft) / Medium-draft / Facebook(+photo/video) / HN / LinkedIn / Instagram / TikTok / Threads(+poll) / Buffer / YouTube-upload(+programado/tags). Requiere confirm.",
  inputSchema: {
    provider: z.enum(["bluesky", "x", "x-poll", "x-media", "reddit", "reddit-crosspost", "telegram", "telegram-user", "discord", "discord-forum", "devto", "hashnode", "medium", "medium-pub", "facebook", "facebook-photo", "facebook-video", "hn", "linkedin", "linkedin-company", "instagram", "instagram-dm", "tiktok", "threads", "threads-poll", "dailydev-squad", "youtube-upload", "buffer"]),
    text: z.string().min(1).max(10000), confirm: z.boolean().describe(CONFIRM),
    subreddit: z.string().optional(), title: z.string().optional(),
    profileIds: z.array(z.string()).optional(), scheduledAt: z.string().optional(),
    chatId: z.string().optional(), replyTo: z.number().optional(), username: z.string().optional(),
    content: z.string().optional(), tags: z.string().optional(), canonical: z.string().optional(),
    publicationId: z.string().optional(), slug: z.string().optional(), subtitle: z.string().optional(),
    link: z.string().optional(), imageUrl: z.string().optional(), videoUrl: z.string().optional(),
    thread: z.array(z.string()).optional(), draft: z.boolean().optional(), alt: z.string().optional(),
    format: z.enum(["feed", "story", "reel"]).optional(), series: z.string().optional(),
    question: z.string().optional(), options: z.string().optional(), orgUrn: z.string().optional(),
    localPath: z.string().optional(), squadHandle: z.string().optional(), channelId: z.string().optional(),
  },
}, async (a) => write(a.confirm, a.provider, () => {
  const { provider, text } = a;
  if (provider === "bluesky") {
    if (a.thread?.length) return bskyThread(a.thread);
    if (a.imageUrl) return bskyPostImage(text, a.imageUrl, a.alt);
    return bskyPost(text);
  }
  if (provider === "x") return a.thread?.length ? xThread(a.thread) : xPost(text);
  if (provider === "x-poll") {
    if (!a.question || !a.options) throw new Error("x-poll requiere question + options (csv 2-4).");
    return xPoll(a.question, a.options.split(",").map((o) => o.trim()).filter(Boolean));
  }
  if (provider === "x-media") {
    if (!a.imageUrl) throw new Error("x-media requiere imageUrl.");
    return xMediaPost(a.imageUrl, text);
  }
  if (provider === "telegram") return tgSend(text, a.chatId, a.replyTo);
  if (provider === "telegram-user") {
    if (!a.chatId) throw new Error("telegram-user requiere chatId (target: @usuario, id o grupo).");
    return tuSend(a.chatId, text);
  }
  if (provider === "discord") return dcSend(text, a.username);
  if (provider === "devto") {
    if (!a.title || !a.content) throw new Error("Dev.to requiere title + content (markdown).");
    return devPublish(a.title, a.content, a.tags, false, a.series);
  }
  if (provider === "hashnode") {
    if (!a.publicationId || !a.title || !a.content) throw new Error("Hashnode requiere publicationId + title + content.");
    const opts = { slug: a.slug, subtitle: a.subtitle, tagsCsv: a.tags, canonical: a.canonical };
    return a.draft ? hashDraftFlow(a.publicationId, a.title, a.content, opts) : hashPublish(a.publicationId, a.title, a.content, opts);
  }
  if (provider === "medium") {
    if (!a.title || !a.content) throw new Error("Medium requiere title + content. Se crea como draft.");
    return medPublish(a.title, a.content, a.tags, a.canonical);
  }
  if (provider === "facebook") return fbPost(text, a.link, a.scheduledAt);
  if (provider === "facebook-photo") {
    if (!a.imageUrl) throw new Error("facebook-photo requiere imageUrl publica.");
    return fbPhoto(a.imageUrl, text);
  }
  if (provider === "facebook-video") {
    if (!a.videoUrl) throw new Error("facebook-video requiere videoUrl publica.");
    return fbVideo(a.videoUrl, text);
  }
  if (provider === "hn") {
    if (!a.title) throw new Error("HN submit requiere title (+ link o text).");
    return hnSubmit(a.title, a.link || text);
  }
  if (provider === "linkedin") return liShare(text, a.link);
  if (provider === "linkedin-company") {
    if (!a.orgUrn) throw new Error("linkedin-company requiere orgUrn (urn:li:organization:...).");
    return liCompanyPost(a.orgUrn, text, a.link);
  }
  if (provider === "discord-forum") {
    if (!a.channelId || !a.title) throw new Error("discord-forum requiere channelId + title.");
    return dcForumPost(a.channelId, a.title, text);
  }
  if (provider === "medium-pub") {
    if (!a.publicationId || !a.title || !a.content) throw new Error("medium-pub requiere publicationId + title + content.");
    return medPublishPub(a.publicationId, a.title, a.content, a.tags, a.canonical);
  }
  if (provider === "dailydev-squad") {
    if (!a.squadHandle || !a.title) throw new Error("dailydev-squad requiere squadHandle + title.");
    return dailySquadPost(a.squadHandle, a.title, a.link || text);
  }
  if (provider === "youtube-upload") {
    if (!a.localPath || !a.title) throw new Error("youtube-upload requiere localPath + title.");
    const hasOpts = Boolean(a.scheduledAt || a.tags);
    return ytUpload(a.localPath, a.title, text, "unlisted", hasOpts ? { publishAt: a.scheduledAt, tags: a.tags } : undefined);
  }
  if (provider === "instagram-dm") {
    if (!a.chatId) throw new Error("instagram-dm requiere chatId (recipient id).");
    return igDM(a.chatId, text);
  }
  if (provider === "instagram") {
    if (!a.imageUrl) throw new Error("Instagram requiere imageUrl publica (foto o video).");
    const fmt = a.format === "story" ? true : false;
    return igPublish(a.imageUrl, text, a.format === "reel", fmt);
  }
  if (provider === "tiktok") {
    if (!a.videoUrl) throw new Error("TikTok requiere videoUrl o path local.");
    return ttPost(a.videoUrl, text);
  }
  if (provider === "threads") return thPost(text, a.link);
  if (provider === "threads-poll") {
    if (!a.question || !a.options) throw new Error("threads-poll requiere question + options (csv 2-4, max 25 chars c/u).");
    return thPoll(a.question, a.options.split(",").map((o) => o.trim()).filter(Boolean));
  }
  if (provider === "reddit") {
    if (!a.subreddit || !a.title) throw new Error("Reddit submit requiere subreddit + title.");
    return redditSubmit(a.subreddit, a.title, text);
  }
  if (provider === "reddit-crosspost") {
    if (!a.subreddit) throw new Error("reddit-crosspost requiere subreddit + link (URL del post) o text con id.");
    return redditCrosspost(a.subreddit, a.link || text);
  }
  if (!a.profileIds?.length) throw new Error("Buffer requiere profileIds (ver social_channels).");
  return bufferPublish(a.profileIds, text, a.scheduledAt);
}));

server.registerTool("social_media", {
  title: "Media y utilidades",
  description: "Foto/poll Telegram, embed Discord, imagen Bluesky, subir archivo a URL, imagen Hashnode.",
  inputSchema: {
    kind: z.enum(["telegram-photo", "telegram-poll", "telegram-mediagroup", "telegram-buttons", "discord-embed", "discord-thread", "discord-slash", "bluesky-image", "upload", "hashnode-image", "threads-carousel", "medium-image"]),
    confirm: z.boolean().describe(CONFIRM),
    imageUrl: z.string().optional(), imageUrls: z.array(z.string()).optional(), localPath: z.string().optional(), caption: z.string().optional(),
    chatId: z.string().optional(), channelId: z.string().optional(), question: z.string().optional(), options: z.string().optional(),
    title: z.string().optional(), description: z.string().optional(), url: z.string().optional(),
    username: z.string().optional(), text: z.string().optional(), alt: z.string().optional(),
  },
}, async (a) => write(a.confirm, "media", () => {
  switch (a.kind) {
    case "telegram-photo":
      if (!a.imageUrl) throw new Error("telegram-photo requiere imageUrl.");
      return tgPhoto(a.chatId, a.imageUrl, a.caption);
    case "telegram-mediagroup": {
      const urls = a.imageUrls ?? (a.imageUrl ? a.imageUrl.split(",").map((u) => u.trim()) : []);
      if (urls.length < 2) throw new Error("telegram-mediagroup requiere imageUrls[] (2-10).");
      return tgMediaGroup(a.chatId, urls, a.caption);
    }
    case "telegram-poll": {
      if (!a.question || !a.options) throw new Error("telegram-poll requiere question + options (csv).");
      const opts = a.options.split(",").map((o) => o.trim()).filter(Boolean);
      return tgPoll(a.chatId, a.question, opts);
    }
    case "telegram-buttons": {
      if (!a.question || !a.options) throw new Error("telegram-buttons requiere question + options (csv, filas separadas por ;).");
      const rows = a.options.split(";").map((r) => r.split(",").map((o) => o.trim()).filter(Boolean)).filter((r) => r.length);
      return tgButtons(a.chatId, a.question, rows);
    }
    case "discord-slash": {
      if (!a.text) throw new Error("discord-slash requiere text con JSON [{name,description}].");
      const cmds = JSON.parse(a.text) as Array<{ name: string; description: string }>;
      return dcSlashRegister(cmds);
    }
    case "threads-carousel": {
      const urls = a.imageUrls ?? (a.imageUrl ? a.imageUrl.split(",").map((u) => u.trim()) : []);
      if (urls.length < 2) throw new Error("threads-carousel requiere imageUrls[] (2+).");
      return thCarousel(urls, a.caption);
    }
    case "medium-image": {
      if (!a.localPath) throw new Error("medium-image requiere localPath.");
      return medImageUpload(a.localPath);
    }
    case "discord-thread": {
      if (!a.channelId || !a.text || !a.title) throw new Error("discord-thread requiere channelId + text(messageId) + title.");
      return dcThread(a.channelId, a.text, a.title);
    }
    case "discord-embed":
      if (!a.description) throw new Error("discord-embed requiere description.");
      return dcEmbed({ title: a.title, description: a.description, url: a.url }, a.username);
    case "bluesky-image":
      if (!a.imageUrl || !a.text) throw new Error("bluesky-image requiere imageUrl + text.");
      return bskyPostImage(a.text, a.imageUrl, a.alt);
    case "upload":
      if (!a.localPath) throw new Error("upload requiere localPath.");
      return uploadMedia(a.localPath);
    case "hashnode-image":
      if (!a.localPath) throw new Error("hashnode-image requiere localPath.");
      return hashImageUpload(a.localPath);
  }
}));

server.registerTool("social_edit", {
  title: "Editar/borrar/actualizar",
  description: "Telegram edit/delete, Discord delete, Dev.to update, Hashnode update, YouTube video update/delete, Facebook delete, Instagram hide.",
  inputSchema: {
    kind: z.enum(["telegram-edit", "telegram-delete", "telegram-pin", "discord-delete", "devto-update", "devto-delete", "devto-unpublish", "hashnode-update", "instagram-hide", "youtube-video", "youtube-delete", "facebook-delete"]),
    confirm: z.boolean().describe(CONFIRM),
    target: z.string().min(1).describe("telegram: chatId | discord: channelId/messageId | devto/hashnode: article/post id | instagram: commentId"),
    text: z.string().optional(), chatId: z.string().optional(), messageId: z.number().optional(),
    title: z.string().optional(), content: z.string().optional(), tags: z.string().optional(),
    subtitle: z.string().optional(),
  },
}, async (a) => write(a.confirm, "edit", () => {
  switch (a.kind) {
    case "telegram-edit":
      if (a.messageId === undefined) throw new Error("telegram-edit requiere messageId.");
      return tgEdit(a.chatId ?? a.target, a.messageId, a.text ?? "");
    case "telegram-delete":
      if (a.messageId === undefined) throw new Error("telegram-delete requiere messageId.");
      return tgDelete(a.chatId ?? a.target, a.messageId);
    case "telegram-pin":
      if (a.messageId === undefined) throw new Error("telegram-pin requiere messageId (+ chatId).");
      return tgPin(a.chatId, a.messageId);
    case "instagram-hide": return igCommentHide(a.target);
    case "discord-delete": {
      const [ch, msg] = a.target.split("/");
      if (!ch || !msg) throw new Error("discord-delete: target = channelId/messageId.");
      return dcDelete(ch, msg);
    }
    case "devto-update":
      if (!a.title && !a.content && !a.tags) throw new Error("devto-update requiere title/content/tags.");
      return devUpdate(a.target, { title: a.title, body: a.content, tagsCsv: a.tags });
    case "devto-delete": return devDelete(a.target);
    case "devto-unpublish": return devUnpublish(a.target, a.text);
    case "hashnode-update":
      return hashUpdate(a.target, { title: a.title, contentMarkdown: a.content, subtitle: a.subtitle });
    case "youtube-video":
      if (!a.title && !a.content) throw new Error("youtube-video requiere title o content (uno al menos) para actualizar.");
      return ytVideoUpdate(a.target, { title: a.title, description: a.content });
    case "youtube-delete": return ytVideoDelete(a.target);
    case "facebook-delete": return fbDeletePost(a.target);
  }
}));

server.registerTool("social_reply", {
  title: "Responder", description: "Bluesky / X / Reddit / Telegram / Facebook / HN / Dev.to / YouTube / Medium-riesgo / Instagram / Threads. Requiere confirm.",
  inputSchema: {
    provider: z.enum(["bluesky", "x", "reddit", "telegram", "facebook", "hn", "devto", "youtube", "medium", "instagram", "threads"]), target: z.string().min(1), text: z.string().min(1).max(2000),
    confirm: z.boolean().describe(CONFIRM), cid: z.string().optional(), rootUri: z.string().optional(), rootCid: z.string().optional(),
    chatId: z.string().optional(),
  },
}, async ({ provider, target, text, confirm, cid, rootUri, rootCid, chatId }) => write(confirm, provider, () => {
  if (provider === "bluesky") return bskyReply(text, target, cid ?? "", rootUri, rootCid);
  if (provider === "x") return xReply(target, text);
  if (provider === "facebook") return fbComment(target, text);
  if (provider === "instagram") return igCommentReply(target, text);
  if (provider === "threads") return thReply(target, text);
  if (provider === "hn") return hnReply(target, text);
  if (provider === "devto") return devComment(target, text);
  if (provider === "youtube") return ytComment(target, text);
  if (provider === "medium") return medRespond(target, text);
  if (provider === "telegram") {
    const n = Number(target);
    if (!Number.isInteger(n)) throw new Error("Telegram reply: target = message_id numerico.");
    return tgSend(text, chatId, n);
  }
  return redditComment(target, text);
}));

server.registerTool("social_react", {
  title: "Reacciones", description: "26 acciones: Bluesky(4) / X(5: +quote) / Reddit(4) / Telegram(3) / Discord / Dev.to(2) / HN(2) / Daily.dev(2) / YT(2) / LinkedIn(2). Requiere confirm.",
  inputSchema: {
    action: z.enum(["bluesky-like", "bluesky-follow", "bluesky-dm", "bluesky-repost", "x-like", "x-retweet", "x-quote", "x-bookmark", "x-dm", "reddit-vote", "reddit-save", "reddit-flair", "reddit-mod", "discord-react", "devto-react", "devto-react-toggle", "devto-follow", "hn-upvote", "hn-flag", "dailydev-upvote", "dailydev-bookmark", "youtube-like", "youtube-subscribe", "telegram-pin", "telegram-ban", "telegram-unban", "linkedin-invite", "linkedin-message"]),
    target: z.string().min(1), confirm: z.boolean().describe(CONFIRM), cid: z.string().optional(), text: z.string().optional(),
    vote: z.number().optional(), emoji: z.string().optional(), channelId: z.string().optional(),
    category: z.string().optional(), chatId: z.string().optional(), messageId: z.number().optional(),
    flair: z.string().optional(), mod: z.enum(["approve", "remove", "lock"]).optional(),
  },
}, async (a) => write(a.confirm, "react", () => {
  switch (a.action) {
    case "bluesky-like": return bskyLike(a.target, a.cid ?? "");
    case "bluesky-follow": return bskyFollow(a.target);
    case "bluesky-repost": return bskyRepost(a.target, a.cid ?? "");
    case "bluesky-dm":
      if (!a.text) throw new Error("DM requiere text.");
      return bskyDMSend(a.target, a.text);
    case "x-like": return xLike(a.target);
    case "x-retweet": return xRetweet(a.target);
    case "x-quote":
      if (!a.text) throw new Error("x-quote requiere text (comentario de la cita).");
      return xQuote(a.target, a.text);
    case "x-bookmark": return xBookmark(a.target);
    case "x-dm":
      if (!a.text) throw new Error("x-dm requiere handle (target) + text.");
      return xDMSend(a.target, a.text);
    case "reddit-vote": return redditVote(a.target, (a.vote ?? 1) as 1 | -1 | 0);
    case "reddit-save": return redditSave(a.target, a.vote !== 0);
    case "reddit-flair": return redditSelectFlair(a.target, a.flair ?? "");
    case "reddit-mod":
      if (a.mod !== "approve" && a.mod !== "remove" && a.mod !== "lock") throw new Error("reddit-mod requiere mod = approve|remove|lock.");
      return redditMod(a.target, a.mod);
    case "discord-react":
      if (!a.channelId || !a.emoji) throw new Error("discord-react requiere channelId + emoji.");
      return dcReact(a.channelId, a.target, a.emoji);
    case "devto-react": return devReact(a.category ?? "like", Number(a.target), "Article");
    case "devto-react-toggle": return devReactToggle(a.category ?? "like", Number(a.target), "Article");
    case "devto-follow": return devFollow("User", a.target);
    case "hn-upvote": return hnUpvote(a.target);
    case "hn-flag": return hnFlag(a.target);
    case "dailydev-upvote": return dailyUpvote(a.target);
    case "dailydev-bookmark": return dailyBookmarkAdd(a.target);
    case "telegram-pin": {
      if (a.messageId === undefined) throw new Error("telegram-pin requiere messageId (+ chatId).");
      return tgPin(a.chatId, a.messageId);
    }
    case "telegram-ban": {
      const uid = Number(a.messageId ?? NaN);
      if (!Number.isInteger(uid) || uid <= 0) throw new Error("telegram-ban requiere messageId = userId numerico (+ chatId).");
      return tgBan(a.chatId ?? "", uid);
    }
    case "telegram-unban": {
      const uid = Number(a.messageId ?? NaN);
      if (!Number.isInteger(uid) || uid <= 0) throw new Error("telegram-unban requiere messageId = userId numerico (+ chatId).");
      return tgUnban(a.chatId ?? "", uid);
    }
    case "linkedin-invite": return liInvite(a.target, a.text);
    case "linkedin-message": {
      if (!a.text) throw new Error("linkedin-message requiere target + text.");
      return liMessage(a.target, a.text);
    }
    case "youtube-like": return ytLike(a.target);
    case "youtube-subscribe": return ytSubscribe(a.target);
  }
}));

server.registerTool("social_channels", {
  title: "Canales y pubs", description: "Perfiles Buffer, DMs Bluesky o publications Medium.",
  inputSchema: { kind: z.enum(["buffer", "bluesky-dms", "medium-pubs"]) },
}, async ({ kind }) => read(() => (kind === "buffer" ? bufferProfiles() : kind === "medium-pubs" ? medPublications() : bskyDMs())));

server.registerTool("social_schedule", {
  title: "Programar multi-red",
  description: "Encola un texto para N redes a una hora (threads: X/Bluesky/Threads auto-split; articulos exigen title). Enqueue exige confirm; se ejecuta con social_run_due o Task Scheduler.",
  inputSchema: {
    action: z.enum(["enqueue", "list", "cancel"]),
    text: z.string().max(10000).optional(),
    networks: z.array(z.enum(["bluesky", "x", "telegram", "discord", "reddit", "devto", "hashnode", "medium", "facebook", "buffer", "linkedin", "instagram", "tiktok", "threads", "hn"])).optional(),
    scheduledAt: z.string().optional().describe("ISO futuro"),
    title: z.string().optional(),
    confirm: z.boolean().default(false).describe(CONFIRM),
    id: z.string().optional(),
    subreddit: z.string().optional(), profileIds: z.array(z.string()).optional(),
    chatId: z.string().optional(), publicationId: z.string().optional(),
    tags: z.string().optional(), canonical: z.string().optional(), link: z.string().optional(),
    imageUrl: z.string().optional(), videoUrl: z.string().optional(),
  },
}, async (a) => {
  if (a.action === "list") return read(() => Promise.resolve(listQueue()));
  if (a.action === "cancel") {
    if (!a.id) return T("cancel exige id (ver list).");
    if (!a.confirm) return T("Bloqueado: falta confirm:true.");
    try { return T(cancel(a.id)); } catch (e) { return T(err(e)); }
  }
  if (!a.confirm) return T("Bloqueado: falta confirm:true del usuario.");
  try {
    if (!a.text || !a.networks?.length || !a.scheduledAt) throw new Error("enqueue exige text + networks + scheduledAt.");
    return T(enqueue({
      text: a.text, networks: a.networks, scheduledAt: a.scheduledAt, title: a.title,
      params: { subreddit: a.subreddit, profileIds: a.profileIds, chatId: a.chatId, publicationId: a.publicationId, tags: a.tags, canonical: a.canonical, link: a.link, imageUrl: a.imageUrl, videoUrl: a.videoUrl },
    }));
  } catch (e) { return T(err(e)); }
});

server.registerTool("social_run_due", {
  title: "Ejecutar vencidos",
  description: "Publica lo encolado con hora vencida (ya confirmado al encolar).",
  inputSchema: {},
}, async () => {
  try { return T(await runDue()); } catch (e) { return T(err(e)); }
});

server.registerTool("social_compose", {
  title: "Previsualizar adaptacion",
  description: "Muestra como quedaria un texto en cada red (cortes, hilos auto-split, skips) sin publicar. Sin confirm.",
  inputSchema: {
    text: z.string().min(1).max(10000),
    networks: z.array(z.string()).default(["x", "bluesky", "threads", "telegram", "discord", "linkedin"]),
    title: z.string().optional(),
  },
}, async ({ text, networks, title }) => read(async () => {
  const valid = ["bluesky", "x", "telegram", "discord", "reddit", "devto", "hashnode", "medium", "facebook", "buffer", "linkedin", "instagram", "tiktok", "threads", "hn"];
  return networks.map((n) => {
    if (!valid.includes(n)) return `${n}: red desconocida`;
    const a = adapt(n, text, title);
    if (a.skip) return `${n}: SKIP (${a.skip})`;
    if (a.thread) return `${n}: HILO ${a.thread.length} partes\n  ` + a.thread.map((p, i) => `[${i + 1}] ${p.slice(0, 80)}`).join("\n  ");
    const cut = a.text !== text ? ` (corte ${text.length}->${a.text.length})` : " (integro)";
    return `${n}:${cut} ${a.text.slice(0, 100)}`;
  }).join("\n");
}));

server.registerTool("social_status", {
  title: "Estado", description: "Credenciales pendientes (sin valores) y perfiles browser.",
  inputSchema: {},
}, async () => read(async () => {
  const need: string[] = [];
  if (!process.env.BLUESKY_IDENTIFIER || !process.env.BLUESKY_APP_PASSWORD) need.push("BLUESKY_*");
  if (!process.env.REDDIT_CLIENT_ID) need.push("REDDIT_* (o browser)");
  if (!process.env.BUFFER_ACCESS_TOKEN) need.push("BUFFER_ACCESS_TOKEN");
  if (!process.env.TELEGRAM_BOT_TOKEN) need.push("TELEGRAM_BOT_TOKEN");
  if (!process.env.DISCORD_WEBHOOK_URL && !process.env.DISCORD_BOT_TOKEN) need.push("DISCORD_*");
  if (!process.env.DEVTO_API_KEY) need.push("DEVTO_API_KEY");
  if (!process.env.HASHNODE_TOKEN) need.push("HASHNODE_TOKEN");
  if (!process.env.MEDIUM_TOKEN) need.push("MEDIUM_TOKEN (legacy)");
  if (!process.env.FB_PAGE_ID || !process.env.FB_PAGE_TOKEN) need.push("FB_*");
  if (!process.env.LINKEDIN_TOKEN) need.push("LINKEDIN_TOKEN (post directo)");
  if (!process.env.IG_USER_ID || !process.env.IG_TOKEN) need.push("IG_* (directo)");
  if (!process.env.TIKTOK_TOKEN) need.push("TIKTOK_TOKEN");
  if (!process.env.THREADS_USER_ID || !process.env.THREADS_TOKEN) need.push("THREADS_*");
  if (!process.env.YT_API_KEY && !process.env.YT_CLIENT_ID) need.push("YT_* (playlists/upload)");
  if (!process.env.DAILYDEV_TOKEN) need.push("DAILYDEV_TOKEN (o browser)");
  if (!process.env.DISCORD_APP_ID) need.push("DISCORD_APP_ID (slash)");
  return `Hub v0.9 full (17 redes + scheduler + inbox + media + compose). Browsers: 8 perfiles chrome-*. Pendiente: ${need.length ? need.join(" | ") : "ninguno"}.`;
}));

await server.connect(new StdioServerTransport());
