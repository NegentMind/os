# DATA_MODELS.md — tipos, esquemas y contratos de API

> **Estado:** las rutas de producto (`/login`, `/app`) están **desactivadas en el
> lanzamiento** (`NEXT_PUBLIC_APP_ENABLED=false` → `notFound()`). Estos contratos
> aplican cuando se activen; ver `DEPLOY.md` §6 para Site URL / Redirect URLs.

## Fuente de verdad

Supabase Postgres. Tipos generados con `supabase gen types` cuando haya tablas
propias (hoy solo `auth.users`). Mientras tanto, estos tipos mandan:

```ts
/** Usuario autenticado (Supabase Auth, magic link passwordless). */
type SessionUser = {
  id: string;      // auth.users.id (UUID)
  email: string;
};

/** Perfil público futuro (tabla `profiles`, FK auth.users.id). */
type Profile = {
  id: string;      // = auth.users.id
  handle: string;  // único, [a-z0-9_], 3–24
  created_at: string; // ISO 8601
};
```

## Contratos

| Flujo | Método | Entrada | Salida | Notas |
|---|---|---|---|---|
| Login | `supabase.auth.signInWithOtp({ email })` | email válido | `{ error }` / email enviado | `emailRedirectTo: ${origin}/app` |
| Sesión (server) | `supabase.auth.getUser()` | cookies | `{ user } \| null` | Sin usuario → `redirect("/login")` |
| Logout | `supabase.auth.signOut()` | — | — | Limpiar y redirigir a `/` |

## Mock data

Sin backend propio todavía: para desarrollar UI sin Supabase, mocks co-ubicados
(`*.mock.ts` junto al componente) con la **misma forma** de los tipos de arriba.
Borrar el mock cuando el dato real exista. Prohibido inventar campos fuera de
estos tipos.

## Reglas

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` solo en `.env.local`
  (nunca commitear). `service_role` jamás en cliente.
- Sin `any` en tipos de datos. Validar en el borde (forms, Route Handlers).
- RLS activado en toda tabla futura; políticas versionadas en `supabase/` cuando exista.
