# Agent handbook — Northland Legendary Finds

**Repo:** [nlfservices/northlandlegendaryfinds](https://github.com/nlfservices/northlandlegendaryfinds)  
**Production branch:** `main`  
**Site:** https://www.northlandlegendaryfinds.com (apex `northlandlegendaryfinds.com` 301s here)

This file is the operating agreement for every model that touches this product. Read it before changing anything. After work, update [`CURRENT_WORK.md`](./CURRENT_WORK.md). Card research rules live in [`docs/CARD_RESEARCH_GOVERNANCE.md`](./docs/CARD_RESEARCH_GOVERNANCE.md).

## Who owns what

**Pat has complete control.** No agent ships product without a reviewed PR. No unreviewed pushes to `main`. Do not merge this docs PR as part of the handoff task.

| Agent | Mandate | May push / deploy? |
| --- | --- | --- |
| **Jarvis** | Live official set layer: set info, official Topps odds/checklists, MCU News, `mediaUrl()` / R2 media | Only via GitHub PRs into `main` after review. |
| **Super Grok** | Home (`client/src/pages/Home.tsx` plus `HomeHero.tsx` / `HomeStory.tsx` / `HomeExplore.tsx` / `HomeRest.tsx`), site header (`client/src/components/Navigation.tsx`), Card Database (`client/src/pages/CardDatabase.tsx`, route `/cards`), Card of the Day (`client/src/pages/CardOfTheDay.tsx`, `/card-of-the-day` and `/card-of-the-day/:date`) | Only via GitHub PRs into `main` after review. |
| **Manus / ChatGPT** | Read the repo and advise. Structured tables, research, and checklists. | **No.** Do not push, merge, deploy, host the site on Manus, or restore media from `/manus-storage`. |

## How changes ship

1. Branch off `main`.
2. Open a pull request into `main`.
3. Pat (or a designated reviewer) reviews.
4. Merge to `main` is the production trigger (Railway). See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

A preview branch is not production.

## Forbidden

- Manus jobs that host, restore, or republish the live site.
- Restoring card or article images from `/manus-storage` as the public URL (rewrite through `mediaUrl()` / R2 instead).
- Deleting Cloudflare R2 objects or encyclopedia rows to “fix” a bad image or odds line.
- Inventing cards, checklists, odds, print runs, or prices.
- DC characters or DC sets on this Marvel product.
- Secrets, PINs, tokens, or environment **values** in git, chat, or docs. Env **names** only.
- Unreviewed product pushes to `main`.
- Granting Manus (or any advisory agent) Railway / GitHub deploy tokens.

## Local test (no deploy)

From `package.json` (package manager `pnpm@10.4.1`):

```bash
pnpm install
pnpm run dev      # NODE_ENV=development tsx watch server/_core/index.ts
pnpm run build    # vite build + esbuild server/_core/index.ts
pnpm start        # NODE_ENV=production node dist/index.js
pnpm test         # vitest run
```

Smoke-check a live set slug after start, for example `/cards/2025-topps-chrome` (setId `1`). Confirm MCU News at `/mcu-news` and that article images are not `/manus-storage` URLs.

## After every session

Update [`CURRENT_WORK.md`](./CURRENT_WORK.md) with date (America/Chicago), what changed, what is still blocked, and which agent owns the next step.

## Related docs

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)
- [`docs/DATA_AND_MEDIA.md`](./docs/DATA_AND_MEDIA.md)
- [`docs/CONTENT_OPERATIONS.md`](./docs/CONTENT_OPERATIONS.md)
- [`docs/CARD_RESEARCH_GOVERNANCE.md`](./docs/CARD_RESEARCH_GOVERNANCE.md)
