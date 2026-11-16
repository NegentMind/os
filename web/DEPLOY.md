# DEPLOY.md — puesta en producción de `web/`

Runbook para el fundador. Ningún paso lo ejecuta un agente. Los `NEXT_PUBLIC_*`
se **incrustan en build**: cambiar un flag exige un nuevo build/deploy.

> **Corrección de premisa:** `@opennextjs/cloudflare` despliega en **Cloudflare
> Workers** (con assets estáticos), no en Cloudflare Pages. El reemplazo de
> `@cloudflare/next-on-pages` es este adaptador sobre Workers. Fuente:
> <https://opennext.js.org/cloudflare/get-started>. El sitio necesita runtime
> (usa `middleware.ts` para negociar `/` → `/en|/es`), así que no vale un export estático.

## 0. Estado de lanzamiento (por defecto)

| Flag | Valor inicial | Efecto |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://negentmind.com` | `metadataBase`, canonical, `robots.txt`, `sitemap.xml` |
| `NEXT_PUBLIC_HANDBOOK_URL` | vacío | Footer muestra "Handbook — publishing December 2026" sin enlace |
| `NEXT_PUBLIC_APP_ENABLED` | `false` | `/app` y `/login` devuelven 404 (código intacto) |
| `NEXT_PUBLIC_CONTACT_EMAIL_ENABLED` | `false` | Email como texto "(available once negentmind.com is live)" + enlace a GitHub; sin `mailto` |

Todos se leen en un único módulo: `lib/site.ts`.

## 1. Comprar el dominio

1. Registrar `negentmind.com` (recomendado: Cloudflare Registrar, deja DNS ya en Cloudflare).
2. Si se compra fuera: añadir el sitio en Cloudflare y cambiar los nameservers en el registrador.

## 2. Adaptador OpenNext (una vez, en `web/`)

```powershell
cd "C:\Users\Eros\Negent Mind\os\web"
npm install @opennextjs/cloudflare@latest
npm install --save-dev wrangler@latest
npx @opennextjs/cloudflare migrate   # crea wrangler.jsonc, open-next.config.ts, scripts
```

Revisar tras `migrate`:

- `wrangler.jsonc`: `"name": "negentmind-web"`, `compatibility_flags` incluye `nodejs_compat`,
  `compatibility_date` ≥ `2024-09-23`.
- `package.json` debe tener `preview` / `deploy` (`opennextjs-cloudflare build && … deploy`).
- Añadir `.open-next` y `.wrangler` a `web/.gitignore`.
- No hay `export const runtime = "edge"` en el código (verificado: no existe).

Prueba local en runtime Workers:

```powershell
npm run typecheck
npm run build
npm run preview          # opennextjs-cloudflare build && preview
```

## 3. Desplegar

Opción A — manual desde la máquina:

```powershell
npx wrangler login
npm run deploy
```

Opción B — Workers Builds (Git): Cloudflare → Workers & Pages → Create → Import a repository →
`NegentMind/os` (privado; autorizar la GitHub App) → **Root directory: `web`** →
Build command `npx opennextjs-cloudflare build` → Deploy command `npx opennextjs-cloudflare deploy`.

## 4. Variables de entorno

Definirlas como **variables de build** (Workers Builds → Settings → Build → Variables) o en
`.env.production.local` si se despliega manualmente — `NEXT_PUBLIC_*` se resuelven en build,
no en runtime:

```env
NEXT_PUBLIC_SITE_URL=https://negentmind.com
NEXT_PUBLIC_HANDBOOK_URL=
NEXT_PUBLIC_APP_ENABLED=false
NEXT_PUBLIC_CONTACT_EMAIL_ENABLED=false
# Solo cuando APP_ENABLED=true:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

`service_role` de Supabase nunca va en estas variables.

## 5. Dominio personalizado

Worker → Settings → Domains & Routes → Add → Custom domain → `negentmind.com`
(y `www.negentmind.com` con redirección 301 a apex, vía Redirect Rule).
Verificar: `https://negentmind.com/robots.txt` y `/sitemap.xml` muestran el dominio final.

## 6. Supabase (solo al activar el producto)

Supabase → Authentication → URL Configuration:

- **Site URL:** `https://negentmind.com`
- **Redirect URLs:** `https://negentmind.com/app`, `http://localhost:3000/app`
  (y la URL `*.workers.dev` si se prueba allí).

Luego `NEXT_PUBLIC_APP_ENABLED=true` + rebuild. `/app` y `/login` siguen con
`Disallow` en `robots.txt` y `noindex` en su layout.

## 7. Activar el correo (después del dominio)

1. Configurar el buzón de `negent@negentmind.com` (p. ej. Cloudflare Email Routing → destino real)
   y enviar un correo de prueba de ida y vuelta.
2. `NEXT_PUBLIC_CONTACT_EMAIL_ENABLED=true` + rebuild/deploy.
3. Resultado: sección de contacto y footer muestran el `mailto:`.

## 8. Tras transferir VantaDB a la org

Editar una sola constante en `lib/site.ts`:

```ts
export const VANTADB_REPO = "https://github.com/NegentMind/vantadb";
```

Los textos visibles (`github.com/…`, `ctaRepo`) se derivan de la constante. Rebuild/deploy.

## 9. Tras publicar el Public Handbook

`NEXT_PUBLIC_HANDBOOK_URL=<url pública>` + rebuild/deploy. El footer pasa de texto a enlace.
Revisar también la FAQ, que menciona "publishing December 2026" en texto fijo (`lib/i18n/*.ts`).

## Checklist post-deploy

- [ ] `/` redirige a `/en` o `/es` según `Accept-Language`
- [ ] `/en` y `/es` cargan; `<link rel="alternate" hreflang>` incluye `en`, `es`, `x-default`
- [ ] `/app` y `/login` → 404 (con `APP_ENABLED=false`)
- [ ] `/robots.txt`, `/sitemap.xml` con el dominio final
- [ ] Favicon (`/icon.svg`) y OG (`/og.png`) visibles (validar con un inspector de OG)
