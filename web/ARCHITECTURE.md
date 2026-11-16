# ARCHITECTURE.md — estructura, patrones y decisiones

## Estructura de directorios

```text
web/
├── middleware.ts             # Solo matcher "/": redirige a /en o /es (Accept-Language)
├── app/                      # App Router. Sin app/layout.tsx: dos root layouts por route group
│   ├── globals.css           # Tailwind v4 + @theme + vars shadcn
│   ├── icon.svg              # Favicon (copia de brand/exports/mark-dark.svg)
│   ├── robots.ts             # /robots.txt (Disallow /app, /login)
│   ├── sitemap.ts            # /sitemap.xml (/en, /es + alternates hreflang)
│   ├── (marketing)/[lang]/
│   │   ├── layout.tsx        # Root layout <html lang={lang}>; metadataBase, hreflang (+x-default), OG
│   │   └── page.tsx          # Home EN/ES (Server Component)
│   └── (product)/            # Superficie de producto — DESACTIVADA en lanzamiento
│       ├── layout.tsx        # Root layout lang="en"; metadataBase; noindex
│       ├── login/page.tsx    # Gate server: notFound() si !APP_ENABLED
│       ├── login/login-form.tsx  # Client Component (magic link)
│       └── app/page.tsx      # Gate notFound() + sesión obligatoria (redirect /login)
├── components/
│   ├── nm/                   # Componentes de la home (HolonGrid, RoadmapRail, WorkSection…)
│   └── ui/                   # shadcn — NO editar a mano; `npx shadcn add <x>`
├── lib/
│   ├── site.ts               # ÚNICA fuente de URLs y flags (ver abajo)
│   ├── i18n/                 # en.ts (forma canónica, Dict = typeof en) + es.ts (espejo)
│   ├── fonts.ts              # next/font
│   ├── utils.ts              # cn()
│   ├── supabaseClient.ts     # Browser client
│   └── supabaseServer.ts     # Server client (cookies)
├── public/og.png             # OG image (copia de brand/exports/hero-dark.png)
└── hooks/
```

## Flags (`lib/site.ts`)

| Constante | Origen | Por defecto |
|---|---|---|
| `SITE_URL` | `NEXT_PUBLIC_SITE_URL` | `https://negentmind.com` |
| `HANDBOOK_URL` | `NEXT_PUBLIC_HANDBOOK_URL` | `null` → texto sin enlace |
| `APP_ENABLED` | `NEXT_PUBLIC_APP_ENABLED === "true"` | `false` → `/app`, `/login` 404 |
| `CONTACT_EMAIL_ENABLED` | `NEXT_PUBLIC_CONTACT_EMAIL_ENABLED === "true"` | `false` → sin `mailto` |
| `ORG_URL`, `VANTADB_REPO`, `SPECS_REPO`, `CONTACT_EMAIL` | constantes | — |

`NEXT_PUBLIC_*` se incrustan en build: cambiar un flag exige rebuild.

## Patrones obligatorios

1. **Server Components por defecto.** `"use client"` solo donde haya interactividad.
   Un gate (`notFound()`) nunca vive en un Client Component: se separa en `page.tsx`
   server + componente cliente (patrón de `/login`).
2. **Auth en el servidor.** `/app/*` verifica sesión con `lib/supabaseServer.ts` y
   redirige a `/login` si no hay usuario. Nunca confiar en checks solo-cliente.
3. **URLs centralizadas.** Ningún `https://github.com/...` ni email literal fuera de `lib/site.ts`.
4. **i18n estructuralmente idéntico.** `es.ts` está tipado como `Dict`; toda clave nueva
   se añade en ambos.
5. **Animación por capas:** `motion/react` micro-interacciones; `gsap` timelines/scroll.
   No mezclar en el mismo componente. Respetar `prefers-reduced-motion`.
6. **Estilos:** solo Tailwind + tokens `@theme` (ver `DESIGN_SYSTEM.md`).

## Decisiones (ADR resumidos)

| Decisión | Por qué | Prohibido |
|---|---|---|
| Next.js App Router con route groups | Dos root layouts: marketing con `lang` dinámico, producto aparte | `pages/`, `getServerSideProps` |
| Supabase Auth magic link (desactivado al lanzar) | Sin passwords que custodiar | Auth casera con JWT propio |
| Tailwind v4 (`@theme`) | Tokens como utilidades | tailwind.config.js, hex sueltos |
| shadcn new-york | Primitivas accesibles copiadas al repo | Editar `components/ui/*` a mano |
| Cloudflare Workers vía `@opennextjs/cloudflare` | $0, SSR + middleware; ver `DEPLOY.md` | VPS propio; `@cloudflare/next-on-pages` (OpenNext es la vía documentada) |
