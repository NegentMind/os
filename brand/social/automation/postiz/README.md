# social/automation/postiz — programador principal (7/7 redes)

Postiz (`gitroomhq/postiz-app`, AGPL-3.0, ~41k ⭐): scheduling, calendario, cross-posting, aprobaciones, API. Licencia $0, funciones sin gateo.

## Infra local
Docker Compose: Postgres + Redis + Temporal + app. Pesado pero todo local.

```powershell
cd social\automation\postiz
# docker compose up -d  (compose propio, pendiente de crear)
```

## Cuentas necesarias (crear 1 vez, gratis salvo X)
| Red | Qué crear | Costo |
|---|---|---|
| LinkedIn | App developers + Share on LinkedIn | $0 |
| TikTok | Developer app + Content Posting API + **auditoría** | $0 |
| Instagram/Threads | Meta App propia (Standard Access, cuentas propias) | $0 |
| X | App developers | **~$0.015/post, $0.20 con link** |
| Reddit | App OAuth | $0 |
| Discord | Webhook/bot | $0 |

## Reglas
- IA (copilot/imágenes) solo con tus propias API keys.
- AGPL: si se expone modificado como servicio, publicar cambios.
- Ver `../<red>/README.md` por red para el estado de cada una.
