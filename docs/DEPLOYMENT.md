# Deployment

Production is GitHub `main` → Railway. This repository has **no** `railway.toml`, `nixpacks.toml`, or `Procfile`. Railway uses `package.json`:

- Build: `pnpm run build`
- Start: `pnpm start` → `NODE_ENV=production node dist/index.js`

There is no README and no `.env.example`. Configure env **names** in Railway. Never paste values into git.

## Production trigger

1. Open a PR into `main`.
2. Review. Do not merge unreviewed product work.
3. **Merge to `main`** starts the Railway deploy from GitHub.
4. Railway serves Express behind Cloudflare.

**This docs PR is preview only. Do not merge it as part of the handoff task.** Merging later is a human decision; merging is what would deploy these markdown files (docs-only, still a production deploy of the current app plus docs).

Rollback = revert to the previous `main` commit (Railway redeploys that commit). Do not “fix” production by deleting R2 objects or encyclopedia rows.

## Domain and edge (verified 2026-08-29 CT)

- Canonical host: **https://www.northlandlegendaryfinds.com**
- Apex `https://northlandlegendaryfinds.com` → **301** to `https://www.northlandlegendaryfinds.com/`
- Home `/`: **HTTP 200**, `server: cloudflare`, `x-powered-by: Express`, `x-railway-edge: iad1`
- Set page `/cards/2025-topps-chrome`: **HTTP 200**, same Railway/Cloudflare headers
- MCU News `/mcu-news`: **HTTP 200**

GitHub → Railway is confirmed by live `x-railway-edge` / `x-railway-request-id` on the www origin. Cloudflare sits in front (`server: cloudflare`, `cf-ray`). Public card/article objects are on Cloudflare R2 (see [`DATA_AND_MEDIA.md`](./DATA_AND_MEDIA.md)).

Manus must not receive Railway deploy tokens, GitHub write tokens, or R2 delete credentials. Manus/ChatGPT read and advise only.

## Environment names only

Names observed in application code (`server/_core/env.ts`, `drizzle.config.ts`, `server/stripe-webhook.ts`, `server/_core/index.ts`, `client/src/lib/mediaUrl.ts`). **Do not document or commit values.**

- `DATABASE_URL`
- `NODE_ENV`
- `PORT`
- `JWT_SECRET`
- `VITE_APP_ID`
- `VITE_MEDIA_PUBLIC_BASE`
- `OAUTH_SERVER_URL`
- `OWNER_OPEN_ID`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`
- `EBAY_CLIENT_ID`
- `EBAY_CLIENT_SECRET`
- `EBAY_SANDBOX_CLIENT_ID`
- `EBAY_SANDBOX_CLIENT_SECRET`
- `EBAY_VERIFICATION_TOKEN`
- `EBAY_DELETION_ENDPOINT_URL`
- `GHL_API_KEY`
- `GHL_LOCATION_ID`
- `ADMIN_NOTIFICATION_EMAIL`
- `ADMIN_ACCESS_CODE`
- `META_PIXEL_ID`
- `META_CAPI_ACCESS_TOKEN`
- `META_TEST_EVENT_CODE`
- `FB_PAGE_ID`
- `FB_PAGE_ACCESS_TOKEN`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

`.gitignore` already excludes `.env*` and `.project-config.json`. Never commit PINs, tokens, or connection strings.

## Post-deploy checks

1. `https://www.northlandlegendaryfinds.com/` returns **200** (not only the apex 301).
2. One set page returns **200**, e.g. `/cards/2025-topps-chrome`.
3. `/mcu-news` returns **200**, and article/featured images are R2 (or other public) URLs — **not** `/manus-storage`.
4. Confirm Cloudflare still fronts Railway (`server: cloudflare` plus `x-railway-edge`).

SPA caveat: unknown paths such as `/card-hub` still return HTTP 200 then render the client `NotFound` page. That is a soft 404, not a successful product page.
