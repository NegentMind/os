# social-hub — MCP autonomo (dentro de `social/`)

17 redes full leer+interactuar+publicar + scheduler + inbox + media + compose + tests (`npm test`).

## Tools (19)
- `social_search` bluesky|x|reddit|linkedin-jobs|wattpad|devto|medium|dailydev|hn
- `social_feed` reddit|x-home|x-bookmarks|x-notifs|x-lists|linkedin-inbox|telegram|discord|devto|devto-saved|hackernews(+sort)|dailydev|dailydev-saved|medium|hashnode|facebook|facebook-insights|bluesky-notifs|youtube-playlists|tiktok
- `social_user` bluesky|x|reddit|reddit-flair|linkedin|linkedin-company|telegram|wattpad|devto|devto-org|hn|hashnode|hashnode-series|medium|instagram-limit|threads-limit|tiktok
- `social_article` dev.to por id
- `social_xtweets` user|trending
- `social_comments` reddit|hackernews
- `social_transcript` meta|transcript
- `social_open` url LinkedIn
- `social_inbox` telegram+discord+bluesky+linkedin
- `social_post` bluesky|x|x-poll|x-media|reddit|reddit-crosspost|telegram|discord|discord-forum|devto|hashnode|medium|medium-pub|facebook|facebook-photo|facebook-video|hn|linkedin|linkedin-company|instagram|instagram-dm|tiktok|threads|dailydev-squad|youtube-upload|buffer (confirm)
- `social_media` telegram-photo|telegram-mediagroup|telegram-poll|telegram-buttons|discord-embed|discord-thread|discord-slash|bluesky-image|upload|hashnode-image|threads-carousel|medium-image (confirm)
- `social_edit` telegram-edit|telegram-delete|telegram-pin|discord-delete|devto-update|devto-delete|hashnode-update|instagram-hide (confirm)
- `social_reply` bluesky|x|reddit|telegram|facebook|hn|devto|youtube|medium|instagram|threads (confirm)
- `social_react` 26 acciones (confirm)
- `social_channels` buffer|bluesky-dms
- `social_schedule` 15 redes + auto-split (confirm)
- `social_run_due`
- `social_compose` preview split/adapt sin publicar
- `social_status`

## Scheduler
`social_schedule enqueue` (confirm) con text + networks[] + scheduledAt ISO futuro.
Adapta por red (hilos auto-split X/Bluesky/Threads; dev/hashnode/medium/hn exigen
title; reddit exige subreddit; IG/TikTok exigen asset). `social_run_due` publica
vencidos con pausas anti-bloqueo por proveedor. Daemon: Task Scheduler cada
5-15 min con `node C:\Users\Eros\Negent Mind\social\mcp-hub\dist\run-queue.js`.
Keepalive sesion HN (headless, sin ventana): Task Scheduler 1 vez/dia con
`node C:\Users\Eros\Negent Mind\social\mcp-hub\dist\keepalive.js`.
Primer login HN (1 vez, ventana visible): `python mcp-hub/tools/hn-first-login.py`.

## Auth
Ver `.env.example` (raiz de `social/`). Lectura mayormente sin key (HN, Dev.to,
Medium RSS, YouTube). Escritura: tokens por red o login browser 1 vez en
perfiles `~/.social-hub/chrome-*`. Nunca commitear secretos.

## Comandos
```powershell
cd mcp-hub
npm install
npm run typecheck
npm run build
npm test   # 9/9
# navegadores (una vez):
npx playwright install chromium
```

## Reglas
Solo lectura por defecto. Escritura exige `confirm:true`. Una escritura por vez
con pausas por proveedor (X 30s, Hashnode 60s, Reddit 11s...). Sin spam.
