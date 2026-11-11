# ARCHITECTURE.md — estructura, patrones y decisiones

## Estructura de directorios

```text
web/
├── app/                    # App Router (rutas = carpetas)
│   ├── layout.tsx          # Root layout: fuentes (next/font), <html lang="en">
│   ├── globals.css         # Tailwind v4 + @theme + vars shadcn
│   ├── page.tsx            # / — marketing público (Server Component)
│   ├── login/page.tsx      # /login — Client Component (magic link)
│   └── app/page.tsx        # /app — Server Component, exige sesión
├── components/
│   └── ui/                 # shadcn (button, card, input, label) — NO editar a mano;
│                           # se regeneran con `npx shadcn add <x>`
├── lib/
│   ├── utils.ts            # cn() — único helper de clases
│   ├── supabaseClient.ts   # Browser client (Client Components)
│   └── supabaseServer.ts   # Server client (Server Components, cookies)
├── hooks/                  # Hooks compartidos (vacío inicial)
└── legacy/                 # Prototipo previo, excluido de tsconfig. No importar.
```

## Patrones obligatorios

1. **Server Components por defecto.** `"use client"` solo donde haya interactividad
   (forms, animación, estado local). La página de marketing nunca es cliente.
2. **Auth en el servidor.** `/app/*` verifica sesión con `lib/supabaseServer.ts` y
   redirige a `/login` si no hay usuario. Nunca confiar en checks solo-cliente.
3. **Datos vía Supabase.** Sin API routes propias salvo que un secreto deba quedarse
   en servidor; entonces Route Handler bajo `app/api/` con validación de sesión.
4. **Animación por capas:** `motion/react` para micro-interacciones y estados;
   `gsap` para timelines y choreography con scroll. No mezclar ambos en el mismo
   componente. Respetar `prefers-reduced-motion`.
5. **Estilos:** solo Tailwind + tokens `@theme` (ver `DESIGN_SYSTEM.md`). Prohibido
   CSS suelto salvo `globals.css`. Prohibido `style={{}}` inline para layout en
   código nuevo (el login legacy se migra cuando se toque).

## Decisiones (ADR resumidos)

| Decisión | Por qué | Prohibido |
|---|---|---|
| Next.js App Router (no Pages) | Estándar actual, RSC, Supabase SSR first-class | `pages/`, `getServerSideProps` |
| Supabase Auth magic link | Sin passwords que custodiar; email ya es el canal de contacto | Auth casera con JWT propio |
| Tailwind v4 (`@theme`) | Tokens como utilidades (`bg-void`, `font-display`) | tailwind.config.js, valores hex sueltos |
| shadcn new-york | Primitivas accesibles (Radix) copiadas al repo, personalizables | Editar `components/ui/*` a mano (se pisan con `add`) |
| Cloudflare Pages (futuro deploy) | $0, estático + SSR ligero | VPS propio para un marketing |
