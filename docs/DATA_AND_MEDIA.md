# Data and media

## Ownership

| Store | Owns |
| --- | --- |
| **MySQL (Drizzle)** | Cards, sets, articles, inventory, orders, loyalty, COTD rows, character content. Tables `marvel_sets` and `marvel_cards` are the encyclopedia. Table `articles` is MCU News. |
| **Cloudflare R2** | Public image bytes. The database stores URLs; R2 (or static `client/public` paths) stores files. |
| **Google Drive** | Photo **source** only. Copy scans out of Drive, then upload to R2 or ship JPEGs in `client/public/{cbh,mcs,studios,mint2026,mint-backs}`. Drive is not served to browsers. |
| **Manus `/manus-storage`** | Legacy. Not the public CDN. Rewrite, do not restore as the live URL. |

Research is not inventory. `inventory_cards` / graded tables are stock. `marvel_cards` is the public checklist encyclopedia.

## `mediaUrl()` public prefix

From `client/src/lib/mediaUrl.ts` (not the shorter hypothesis):

```
DEFAULT_BASE = https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev
R2_PREFIX    = 310419663027009739/SGHqXeh8PZJcCDnFiAMuFi
```

Rewritten `/manus-storage/{file}` URLs become:

`https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/{file}`

Optional override env **name:** `VITE_MEDIA_PUBLIC_BASE` (defaults to the `pub-*.r2.dev` host above). CloudFront hosts are rewritten to that base, **keeping the rest of the path**. MCU News uses the same prefix in `server/routers/articles.ts` (`rewriteMedia` / `rewriteBodyMedia`) so list/detail payloads never emit `/manus-storage`.

Existing R2 object keys and public paths stay compatible. Do not rename the prefix or shuffle keys.

Some set photos are **static app files**, not R2 keys:

- CBH: `/cbh/CBH-{n}F.jpg` (setId 2)
- Chrome Sapphire: `/mcs/MCS-{n}F.jpg` (setId 4)
- Studios: `/studios/...` (setId 5)
- 2026 Mint: `/mint2026/26TMM-{n}F.jpg` (setId 90006, numeric 1–125)
- 2025 Mint backs: `/mint-backs` plus bundled `.b64` in the production build

## Replace, never delete

To replace an image:

1. Upload a **new** R2 object (new key) or a new static file.
2. Retarget `imageUrl` / `backImageUrl` / `featuredImageUrl` / markdown `src` to the new URL.
3. Leave the old object in place.

Never delete R2 objects to fix a bad crop, wrong card, or broken URL. Hide broken images in the UI (`onError` hide / empty `src`) and/or null out the URL in MySQL. Photo seeds already refuse to leave dead `/mcs/` URLs: missing files clear the path or keep a known good URL (see `server/mcsPhotosSeed.ts`). CBH missing fronts stay unset rather than pointing at files that were never shipped.

## Never-delete list

Do not delete:

- Cloudflare R2 objects already referenced (or previously referenced) by production URLs
- The public R2 prefix `310419663027009739/SGHqXeh8PZJcCDnFiAMuFi`
- `marvel_sets` / `marvel_cards` rows for live official sets
- Official odds strings in `parallels` (replace via a versioned `*Seed.ts` after listen, hard-locked `setId`)
- MCU News article rows to “clean up” media; rewrite URLs instead
- Git history on `main`
- Secrets, PINs, tokens, or `.env` files

Forbidden restore path: `/manus-storage` as a public image host.
