# Content operations

## MCU News

Source of truth is the `articles` table via tRPC:

- Public: `articles.list`, `articles.featured`, `articles.getBySlug`, votes, `articles.getRelated`
- Admin: `adminArticles.create` / `update` / `togglePublished` / … (`server/routers/articles.ts`)
- Routes: `/mcu-news`, `/mcu-news/:slug` (`MCUNews.tsx`, `MCUNewsArticle.tsx`)
- Old `/mcu-intel` URLs redirect to `/mcu-news`

Admin writes go through the Matrix PIN gate (`/admin`, `/matrix`). Do not publish by editing markdown in Manus storage. On read, featured images and markdown/HTML `src` / `](url)` are rewritten from `/manus-storage` and CloudFront to the public R2 prefix. After deploy, MCU News must not show `/manus-storage` URLs.

Known content bug: garbled dashes in MCU News (mojibake of en-dash). Mint 2025 seeds already repair CP850/CP1252 dash mojibake in `cardType`; article bodies need the same care — use a real Unicode dash, do not invent copy.

## Card odds and checklists

Official Topps checklists and odds from Pat are primary. Seeds in `server/*Seed.ts` run **after** `server.listen` and **hard-lock `setId`** (and usually slug). They must not write other sets’ photos or odds.

Parallel format for the live parser (`parseParallels` in `server/db.ts`):

```
Name · 1:x
```

Use middle dot **U+00B7**, not a hyphen or bullet. Keep thousands commas tight so `1:3,303` is one token. Example from 2025 Chrome hobby: `Refractor · 1:2`.

Odds are **pull rates**, never prices. Do not put dollar values in `parallels`.

Print-run rarity (`/5`) and pack odds (`1:629`) can both appear on the same named parallel (`Red Shimmer /5 · 1:629`). They are not the same thing — see [`CARD_RESEARCH_GOVERNANCE.md`](./CARD_RESEARCH_GOVERNANCE.md).

## Card of the Day

COTD is **Super Grok** (`CardOfTheDay.tsx`, `cardOfTheDay` tRPC router, homepage modules). Jarvis does not own the COTD picker. Current known issue: COTD Wolverine blank — Grok to fix.

## Official Topps only

Do not invent cards, inserts, print runs, or ladders. Do not copy another set’s parallel ladder. 2026 Chrome Sapphire has **no official checklist yet** — leave it unpublished; do not invent.

Seed modules started from `server/_core/index.ts` (after listen):

| File | setId | Slug |
| --- | --- | --- |
| `chrome2025MetaSeed.ts` | 1 | `2025-topps-chrome` |
| `cbhPhotosSeed.ts` | 2 | `2025-topps-comic-book-heroes` |
| `mint2025MetaSeed.ts` / backs seed | 3 | `2025-topps-marvel-mint` |
| `mcsPhotosSeed.ts` | 4 | `2025-topps-marvel-sapphire` (Chrome Sapphire; **not** set 6) |
| `studiosPhotosSeed.ts` / `studios2025MetaSeed.ts` | 5 | `2025-topps-marvel-studios` |
| `studiosSapphire2025MetaSeed.ts` | 6 | `2025-topps-marvel-studios-sapphire` (pack rates; **not** set 4) |
| `collector2025MetaSeed.ts` | 30001 | `2025-marvel-the-collector` |
| `chrome2024MetaSeed.ts` | 90001 | `2024-topps-chrome-marvel` |
| `sapphire2024MetaSeed.ts` | 90002 | `2024-topps-chrome-sapphire-marvel` |
| `deadpool2025MetaSeed.ts` | 90003 | `2025-topps-chrome-deadpool` |
| `cap85thMetaSeed.ts` | 90004 | `2026-topps-brooklyn-captain-america-85th` |
| `chrome2026MetaSeed.ts` | 90005 | `2026-topps-chrome-marvel-comics` |
| `mint2026PhotosSeed.ts` / `mint2026MetaSeed.ts` | 90006 | `2026-topps-marvel-mint` |
| `vault2026Seed.ts` | 90007 | `2026-topps-marvel-vault` |
| `finestXMen97Seed.ts` | 90008 | `2025-topps-finest-x-men-97` |
| `finestFF2026MetaSeed.ts` | 60001 | `2026-topps-finest-fantastic-four` |

Bump `SEED_VERSION` inside a seed when official odds change so it re-runs once per process.
