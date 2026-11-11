# web/ — sitio + app (Next.js + Supabase + Cloudflare Pages)

Marketing `/` público + app `/app` con login (magic link Supabase). $0 hasta ~50k MAU.

## Setup

```powershell
cd web
npm install
Copy-Item .env.example .env.local   # rellenar con proyecto Supabase
npm run dev
```

1. Crear proyecto en Supabase Free → copiar URL + anon key.
2. Auth → habilitar Email (magic link) + Google/GitHub OAuth si se quiere.
3. Deploy: conectar repo a Cloudflare Pages (`npm run build` como build command).
   Para SSR en Pages se usa `@cloudflare/next-on-pages` (añadir cuando se despliegue).

## Estructura

- `app/page.tsx` marketing, `app/login/` auth, `app/app/` privada (redirect si no hay sesión).
- `lib/` clientes Supabase (browser/server). `legacy/exp-web03.html` prueba anterior preservada.
- `.env.local` nunca se commitea.
