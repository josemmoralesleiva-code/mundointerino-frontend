# AGENTS.md — mundointerino-frontend

Vite 8 + React 19 + Tailwind 4, repo git propio. SSR apagado (SPA pura con rewrite a `index.html` en Vercel).

## Comandos

- `npm run dev` — Vite, puerto 5173 por defecto (sin `--port` en `vite.config.ts`).
- `npm run build` — build a `dist/`.
- `npm run preview` — preview del build.
- `npm run lint` — flat config (`eslint.config.js`). **No existe `typecheck` script**; tipeo solo verifica TS en el editor / build.

No hay test runner configurado.

## ESLint (`eslint.config.js`, flat config) — quirks

- `no-useless-catch` es **error** (no reenvolver errores que solo se re-throwan).
- `@typescript-eslint/no-explicit-any` warn; `no-unused-vars` ignore args `^_`.
- `react-hooks/set-state-in-effect` off; `react-refresh/only-export-components` warn.
- `dist` globalmente ignorado.

## Env por modo (Vite)

- `.env.development` → `VITE_API_URL=http://localhost:8080`.
- `.env.production`  → `VITE_API_URL=https://api.mundointerino.com`.
- Fallback en `src/infrastructure/http/axiosClient.ts` = URL prod por si falta el env.

## Arquitectura en capas (no obvia por nombres)

- `src/domain/models/` — tipos/models (`User`, `Property`, `Anuncio`, `City`), barrel `index.ts`.
- `src/application/useCases/<feature>/` — un use case por archivo + barrel `index.ts`. Features: `admin, anuncios, auth, cities, properties, users`.
- `src/infrastructure/`
  - `http/axiosClient.ts` — **única** instancia axios, `withCredentials: true`, interceptor 401 → `POST /auth/refresh` con cola de retries y logout vía `window.dispatchEvent('auth:logout')`.
  - `repositories/<feature>.repository.ts` — implementación concreta de cada repositorio, llama a `axiosClient`.
  - `dto/*.dto.ts` — DTOs del frontend. **Deben matchear exactamente** con los DTOs del backend (`mundointerino-backend/src/modules/<feature>/dto/`), porque el `ValidationPipe` del backend rechaza campos no whitelisteados. Editar en pares cuando se cambien contratos.
  - `storage/localStorage.ts` — helpers de persistencia local.
- `src/presentation/`
  - `pages/` — rutas/pantallas.
  - `components/{layout,ui}` — layout y componentes sueltos.
  - `hooks/use<Feature>.ts` — hooks por feature que consumen use cases.
  - `router/{AppRouter,PrivateRoute}.tsx` — react-router-dom v7.
  - `store/auth.store.ts` — Zustand (única store global).

## Stack notable

- Estado: **Zustand** (`store/auth.store.ts`). No agregar Redux ni Context para estado global nuevo sin discusión.
- Routing: `react-router-dom@7`.
- Mapas: `react-leaflet` + `leaflet` (arrays de tipos en `@types/leaflet`).
- HTTP: `axios` vía `axiosClient.ts` central; no crear otras instancias axios (rompe el interceptor de refresh).

## Tailwind 4 — config-less

- Tailwind 4 vía `@tailwindcss/vite` + `@tailwindcss/postcss` (`postcss.config.js`, `vite.config.ts`).
- **No agregar `tailwind.config.js`** por defecto: Tailwind 4 es config-less. Si se necesita customizar, usar `@theme` en CSS.
- CSS入口 `src/index.css`.

## Deploy Vercel (`vercel.json`)

- Rewrite `{ source: "/(.*)", destination: "/index.html" }` — SPA fallback. La build incluye `dist/`.
- `.vercel` en `.gitignore`. Outputs a `dist/`.

## Convenios

- `import.meta.env.VITE_API_URL` para base URL. No hardcodear URLs del backend.
- Al cambiar un endpoint o DTO, coordinar con el backend (raíz `AGENTS.md` sección "Cómo trabajar aquí").

## Skills opencode relevantes (`.agents/skills/`)

- `tailwind-css-patterns` — patrones y config Tailwind 4.
- `vite` — config y build Vite.
- `frontend-design`, `accessibility`, `seo` — UI/A11y/SEO.

Cargá `tailwind-css-patterns` antes de cambiar el sistema de estilos.