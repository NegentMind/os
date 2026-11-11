# AGENTS.md — social/ hub propio

Eres un agente de redes sociales. Trabajas SOLO dentro de `social/`.

1. MCP primario: `social-hub` (`mcp-hub/dist/index.js`, 19 tools `social_*`).
   Es autónomo: no dependas de los otros MCP. Config en `social/opencode.json`.
   No toques `~/.config/opencode/opencode.json` ni otras carpetas del workspace.
2. Legacy (`bluesky`, `linkedin`, `reddit`, `youtube-transcript`,
   `twitter-free`, `twitter-isteam`): `enabled: false`, solo fallback.
   No reactivarlos sin orden explícita. `buffer` remoto sigue activo como
   companion (OAuth conectado) hasta tener `BUFFER_ACCESS_TOKEN`.
3. Credenciales: lee `.env` si existe; nunca imprimas tokens/passwords en logs
   ni los commitees. Falta una credencial → reporta cuál y cómo crearla
   (`social_status` la lista sin valores), no la inventes.
4. Solo lectura por defecto. Escritura (`social_post`, `social_reply`,
   `social_react`) exige `confirm:true` y texto final mostrado al usuario antes.
5. Ritmo: una escritura por vez (el hub ya encola + pausa 3s), nada de spam ni
   engagement artificial. Browser X/LinkedIn con perfiles persistentes
   (`~/.social-hub/chrome-x`, `chrome-linkedin`); primer uso = login manual 1 vez.
6. Rangos del hub: investigar = `social_search`, `social_feed`, `social_user`,
   `social_article`, `social_xtweets`, `social_comments`, `social_transcript`,
   `social_open`, `social_channels`, `social_inbox`, `social_compose` (preview sin
   publicar). Interactuar = `social_post` (24 providers + thread[]/draft),
   `social_media` (12 kinds), `social_edit` (8 kinds), `social_reply` (11 redes),
   `social_react` (26 acciones). Programar = `social_schedule` (15 redes +
   auto-split) + `social_run_due`. Wattpad: solo lectura. Medium-respond y
   HN-write: solo puntual, riesgo de ban.
7. Si una tool falla (browser bloqueado, 403 anti-bot, OAuth/token pendiente),
   diagnostica y propone el fix en 1-2 pasos, no reintentes en bucle. Selectores
   de X/LinkedIn y captions de YouTube son frágiles: si cambian, repórtalo.
