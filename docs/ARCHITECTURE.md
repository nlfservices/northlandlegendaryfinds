# Architecture

Facts below are taken from the live GitHub tree on `main` (package.json, `client/src/App.tsx`, `server/_core/index.ts`, `server/routers.ts`, `server/routers/public.ts`, `client/src/lib/mediaUrl.ts`). There is no README, `railway.toml`, `nixpacks.toml`, `Procfile`, or `.env.example` in the repo. Deploy config lives in Railway’s dashboard; runtime commands come from `package.json`.

## Stack and versions

From `package.json`:

| Layer | What |
| --- | --- |
| App name | `northland-legendary-finds` `1.0.0` |
| Module | ESM (`"type": "module"`) |
| Package manager | `pnpm@10.4.1` |
| UI | React `^19.2.1`, wouter `^3.3.5`, Tailwind CSS `^4.1.14`, Vite `^7.1.7` |
| Data fetching | tRPC `^11.6.0`, TanStack Query `^5.90.2`, superjson `^1.13.3` |
| Server | Express `^4.21.2`, Node via `tsx` in dev and `esbuild` bundle in prod |
| Language | TypeScript `5.9.3` |
| ORM / DB | drizzle-orm `^0.44.5`, mysql2 `^3.15.0`, dialect **mysql** (`drizzle.config.ts`) |
| Media SDK | `@aws-sdk/client-s3` (uploads); public card/article URLs go through Cloudflare R2 via `mediaUrl()` |
| Payments | stripe `^20.4.0` |
| Tests | vitest `^2.1.4` |
| Auth cookie | `app_session_id` (`shared/const.ts`) |

Dev server entry: `server/_core/index.ts`. Production start serves `dist/index.js` plus Vite’s `dist/public` static build.

## Commands

| Script | Command |
| --- | --- |
| `dev` | `NODE_ENV=development tsx watch server/_core/index.ts` |
| `build` | `vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist` (also copies Mint 2025 back `.b64` files) |
| `start` | `NODE_ENV=production node dist/index.js` |
| `check` | `tsc --noEmit` |
| `test` | `vitest run` |
| `db:push` | `drizzle-kit generate && drizzle-kit migrate` |

Preferred port is `PORT` or `3000`. `.project-config.json` records `build_command` / `dev_command` as `pnpm run build` / `pnpm run dev`. That file is gitignored for a reason — never commit env **values**.

## Folder map

```
client/                 Vite app root (vite.config.ts `root`)
  src/App.tsx           wouter routes
  src/pages/            public pages (Home, CardDatabase, MCUNews, CardOfTheDay, …)
  src/components/       Navigation, Footer, card UI
  src/lib/mediaUrl.ts   public R2 / legacy URL rewrite
  public/               static scans: /cbh, /mcs, /studios, /mint2026, /mint-backs
server/
  _core/index.ts        Express + tRPC + listen, then one-shot seeds
  _core/env.ts          env **names** (no values in docs)
  routers.ts            appRouter
  routers/public.ts     public.marvel.* encyclopedia API
  routers/articles.ts   MCU News (rewrites manus-storage → R2)
  *Seed.ts              official odds / photo attachers (hard-locked setId)
  db.ts                 drizzle helpers
  storage.ts            Manus forge upload helper (do not use as public CDN)
  _core/storageProxy.ts leftover GET /manus-storage/* proxy (not the public media path)
drizzle/schema.ts       MySQL tables (marvel_sets, marvel_cards, articles, …)
shared/                 cookie name, launch dates, types
```

## HTTP surface

Express (`server/_core/index.ts`) mounts:

- `POST /api/stripe/webhook` (raw body, before `express.json`)
- `GET /manus-storage/*` storage proxy (legacy; public media must be R2)
- OAuth `/api/oauth/callback`
- eBay account-deletion endpoint
- Dynamic `sitemap.xml`
- Scheduled-task routes (publish, card shows, backup, bot, FB token, daily article)
- REST API v1 + Mint 2025 backs API
- Facebook webhook
- **tRPC at `/api/trpc`**
- Vite middleware in development; static `dist/public` in production

Default listen port: `3000`.

## Client routes (wouter)

Defined in `client/src/App.tsx`. Standalone (no nav/footer): `/card-display`, `/matrix`, `/free-credit`.

Public layout routes include:

| Path | Page |
| --- | --- |
| `/` | Home |
| `/cards` | Card Database |
| `/cards/:slug` | Set in Card Database |
| `/cards/:setSlug/:cardNumber` | Card detail |
| `/card-of-the-day` and `/card-of-the-day/:date` | COTD |
| `/mcu-news` and `/mcu-news/:slug` | MCU News |
| `/characters` and `/characters/:slug` | Character encyclopedia |
| `/marvel-card-hub` | Marvel card hub |
| `/trending` | Trending cards |
| `/admin` and `/matrix` | Admin PIN gate |

`/mcu-intel` redirects to `/mcu-news`. Unknown paths render `NotFound` **without changing the HTTP status** (SPA soft 404). `/card-hub`, `/trending-cards`, and `/doomsday-box-office` are not routes; they currently 200 then show NotFound. Real routes are `/marvel-card-hub` and `/trending`.

## tRPC `public.marvel.*`

`server/routers.ts` mounts `public: publicRouter`. Encyclopedia procedures in `server/routers/public.ts`:

- `public.marvel.sets`
- `public.marvel.getSetBySlug`
- `public.marvel.getCardsBySet`
- `public.marvel.search`
- `public.marvel.getCharacter` / `generateCharacterContent` / `relatedCharacters` / `allCharacters`
- `public.marvel.cardDetail` / `generateCardContent` / `allCardSlugs` / `randomCard`
- `public.marvel.trendingCharacter` / `featuredCharacterImages`

MCU News is **not** under `public.marvel`. It is `articles.*` (`articlePublicRouter`): `articles.list`, `articles.featured`, `articles.getBySlug`, votes, related. Admin writes go through `adminArticles.*`.

Card of the Day is `cardOfTheDay.*`.

## Platform roles

| System | Role |
| --- | --- |
| **GitHub** | Source of truth for application code. Default branch `main`. PRs required. |
| **Railway** | Production Node host. Confirmed live 2026-08-29 CT via `x-railway-edge` / `x-railway-request-id` / `x-powered-by: Express` on https://www.northlandlegendaryfinds.com. No Railway config file in the repo. |
| **Cloudflare** | DNS + CDN/proxy in front of Railway. Apex 301 → `www`. Response `server: cloudflare`. |
| **Cloudflare R2** | Public image objects. Client rewrite in `mediaUrl.ts`; MCU News rewrite in `server/routers/articles.ts`. |
| **MySQL (Drizzle)** | Cards, sets, articles, inventory, orders, loyalty, etc. |
| **Google Drive** | **Photo source only.** Ingest scans from Drive, then store on R2 or `client/public/*`. Drive is not the public CDN. |
| **Manus forge** | Legacy upload/proxy (`BUILT_IN_FORGE_API_URL` / `BUILT_IN_FORGE_API_KEY`). Must not host the site or serve public MCU News / card images. |

## Seeds after listen

`startServer()` binds the port first, then fires one-shot seeds (`startChrome2025MetaSeed`, `startMint2025MetaSeed`, photo seeds, Vault, Finest X-Men ’97, …). Seeds hard-lock `setId` and must not block bind. See [`CONTENT_OPERATIONS.md`](./CONTENT_OPERATIONS.md).
