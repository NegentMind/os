# social/ — hub propio de redes sociales para OpenCode

Carpeta aislada. Su `opencode.json` solo vive aquí: si arrancas `opencode` desde
otra carpeta, estos MCP no se cargan. Si arrancas desde aquí, se suman a tu
config global (`~/.config/opencode/opencode.json`: playwright, metasearch,
websearch, argus, notion, pencil).

## Visión: `social-hub` primero

`mcp-hub/` es el MCP propio y autónomo (19 tools, `social_*`, v0.9). Suma a v0.8:
encuestas/media/listas X, invites/mensajes/company LinkedIn, flair/mod Reddit,
playlists/upload YouTube, botones/ban Telegram, slash/foros Discord, orgs/reading
Dev.to, series Hashnode, publications/imágenes Medium, flag HN, Squads Daily.dev,
DMs IG, perfil/videos TikTok, carrusel/reply Threads, capítulos Wattpad.
Tests: 63/63 en 5 suites (`npm test`). Cubre 17 redes
con leer + interactuar + publicar por la vía que funcione (API, OAuth, browser,
webhook, Graph directa): suma a v0.6 hilos X/Bluesky, imágenes Bluesky, post
LinkedIn directo, Instagram/TikTok/Threads directos, vote/save Reddit,
update/follows/reactions Dev.to, update/drafts/imágenes Hashnode, vote HN,
like/subs YouTube, bookmarks Daily.dev, video/insights Facebook, foto/poll/
edit Telegram, embeds/reactions Discord, bandeja unificada, subida de media y
scheduler con auto-split. Sin depender de los otros MCP. Los MCP
de terceros quedan como fallback legacy deshabilitado; solo se reactivan con
orden explícita.

| Tool `social-hub` | Red | Tipo |
|---|---|---|
| `social_search` | Bluesky / X / Reddit / LinkedIn-jobs / Wattpad / Dev.to / Medium / Daily.dev / HN | lectura |
| `social_feed` | Reddit / X / LinkedIn inbox / Telegram / Discord / Dev.to / HN top / Daily.dev / Medium / Hashnode | lectura |
| `social_user` | Bluesky / X / Reddit / LinkedIn / Telegram / Wattpad / Dev.to / HN / Hashnode / Medium | lectura |
| `social_article` | Dev.to completo | lectura |
| `social_xtweets` | X user / trending | lectura |
| `social_comments` | Reddit | lectura |
| `social_transcript` | YouTube meta / transcript | lectura |
| `social_open` | LinkedIn URL | lectura |
| `social_post` | 17 redes + `thread[]` (X/Bluesky) + `draft` (Hashnode) (`confirm:true`) | escritura |
| `social_media` | foto/poll Telegram, embed Discord, imagen Bluesky, upload, imagen Hashnode | escritura |
| `social_edit` | Telegram edit/delete, Discord delete, Dev.to/Hashnode update | escritura |
| `social_inbox` | Telegram + Discord + Bluesky DMs + LinkedIn | lectura |
| `social_schedule` | enqueue/list/cancel multi-red (X 280, Bluesky 300, Discord 2000; artículos exigen title) | programar |
| `social_run_due` | publica lo vencido de `~/.social-hub/queue.json` | ejecutar |
| `social_reply` | 9 redes: Bluesky / X / Reddit / Telegram / Facebook / HN / Dev.to / YouTube / Medium-riesgo (`confirm:true`) | escritura |
| `social_react` | 16 acciones: Bluesky(4) / X(4) / Reddit(2) / Discord / Dev.to(2) / HN / YT(2) (`confirm:true`) | escritura |
| `social_channels` | Buffer perfiles / Bluesky DMs | lectura |
| `social_status` | estado sin exponer secretos | lectura |

## Auth

| Red | Lectura | Escritura |
|---|---|---|
| Bluesky | pública (con fallback a sesión) | `BLUESKY_IDENTIFIER` + `BLUESKY_APP_PASSWORD` (Settings > App passwords) |
| X | perfil browser `~/.social-hub/chrome-x`, 1 login | mismo perfil, ritmo bajo |
| Telegram | `TELEGRAM_BOT_TOKEN` (@BotFather) | `TELEGRAM_CHAT_ID` destino |
| Discord | webhook o `DISCORD_BOT_TOKEN` | webhook del canal |
| Dev.to | sin key | `DEVTO_API_KEY` (Settings > Extensions) |
| Hashnode | `HASHNODE_TOKEN` (dashboard > Developer) | mismo token (requiere publicationId) |
| Medium | RSS sin key | `MEDIUM_TOKEN` legacy (ya no emiten; publica draft) |
| Facebook | — | `FB_PAGE_ID` + `FB_PAGE_TOKEN` (Graph directo, sin tope Buffer) |
| Hacker News | API sin key | no publica (sin API) |
| Daily.dev | browser (puede pedir login) | no publica |
| Wattpad | browser headless, sin key | no publica (sin API, ToS) |
| Reddit | JSON público (puede dar 403 anti-bot) | app script en `reddit.com/prefs/apps` → `REDDIT_*` |
| YouTube | oEmbed + captions, sin key | no publica |
| LinkedIn | perfil browser `~/.social-hub/chrome-linkedin`, 1 login | no publica (solo lectura) |
| Multi-red | `social_channels` | `BUFFER_ACCESS_TOKEN` (`publish.buffer.com` > Settings > API) |

Instagram / TikTok / Facebook / Threads directo no tienen API gratuita fiable: se
publican vía Buffer-direct (`social_post` provider `buffer` con `profileIds`).

## Uso

```powershell
cd C:\Users\Eros\Negent Mind\social
cd mcp-hub; npm install; npm run build; cd ..
npx playwright install chromium   # una vez, para X/LinkedIn browser
# copiar .env.example -> .env y rellenar solo lo que uses
opencode
```

Pruebas sugeridas para el agente (todo contra `social-hub`):
1. `social_status` → qué credenciales faltan
2. `social_search bluesky "IA"` → top 3
3. `social_feed reddit r/all` → hot ahora
4. `social_transcript <url youtube>` → resumen
5. `social_xtweets trending` → tendencias X (requiere login 1 vez)
6. Borrador `social_post buffer` (mostrar texto, publicar solo con confirmación)

## Fallback legacy (deshabilitado)

`bluesky`, `linkedin`, `reddit`, `youtube-transcript`, `twitter-free`,
`twitter-isteam`: `enabled: false` en `opencode.json`. Solo `buffer` remoto
sigue activo como companion (OAuth ya conectado: Threads) hasta configurar
`BUFFER_ACCESS_TOKEN`. No reactivar legacy sin orden explícita.

## Reglas

- No publicar sin confirmación explícita (`confirm:true` + texto final visible).
- X/LinkedIn por browser: una escritura por vez, ritmo bajo, sin spam. Riesgo de baneo.
- Nunca imprimir ni commitear tokens/passwords.
- `setup.ps1` y `vendors/` son legacy del `twitter-free` Python; el hub usa Playwright npm.
