# web/ — sitio de Negent Mind (Next.js + Cloudflare Workers vía OpenNext)

Marketing bilingüe público en `/en` y `/es`. La superficie de producto (`/app`,
`/login`, magic link Supabase) existe en código pero está **desactivada en el
lanzamiento** (`NEXT_PUBLIC_APP_ENABLED=false` → 404).

## Setup

```powershell
cd web
npm install
Copy-Item .env.example .env.local   # flags del sitio; Supabase solo si APP_ENABLED=true
npm run dev
```

## Configuración

Todas las URLs y flags viven en `lib/site.ts` (`SITE_URL`, `ORG_URL`,
`VANTADB_REPO`, `SPECS_REPO`, `HANDBOOK_URL`, `APP_ENABLED`, `CONTACT_EMAIL`,
`CONTACT_EMAIL_ENABLED`). No hardcodear URLs en componentes ni diccionarios.

## Estructura

- `app/(marketing)/[lang]/` home EN/ES (`lib/i18n/{en,es}.ts`, `Dict = typeof en`).
- `app/(product)/` `/login` y `/app` (gate `notFound()` si `APP_ENABLED` es false).
- `app/robots.ts`, `app/sitemap.ts`, `app/icon.svg`, `public/og.png`.
- `middleware.ts` negocia `/` → `/en` | `/es` por `Accept-Language`.
- `.env.local` nunca se commitea.

## Deploy

Ver `DEPLOY.md` (dominio, OpenNext/Cloudflare, variables, Supabase, flags).
