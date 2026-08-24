/**
 * One-shot seed: attach 2025 Topps Marvel Chrome Sapphire photos + official odds.
 * setId=4 only. Numeric cardNumber 1-200 only.
 *
 * Photos: static JPEGs at client/public/mcs/MCS-{n}F.jpg and MCS-{n}B.jpg
 * served by Vite/Railway at /mcs/MCS-{n}F.jpg and /mcs/MCS-{n}B.jpg.
 * Does NOT depend on storagePut / Manus forge.
 *
 * Hard-lock: setId=4 only. Never writes set 2 (CBH), set 3 (Mint), or set 90006.
 * Never writes insert cardNumbers (IS-*, MM-*, SS-*).
 * Never writes imageUrl/backImageUrl when the corresponding JPEG was not shipped.
 * Leaves cardType as-is (Base) so the set page grouping stays unchanged.
 *
 * Official Sapphire names + print runs + hobby pull odds are stored in
 * `parallels` for the existing CBH-style odds parser (name + /printRun + 1:odds).
 * These are odds, never prices.
 *
 * Runs at most once per process (in-memory flag). Must be started AFTER
 * server.listen so it never blocks bind.
 */
import fs from "fs";
import path from "path";
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const MCS_SET_ID = 4;
const CBH_SET_ID = 2;
const MINT_SET_ID = 3;
const FORBIDDEN_SET_ID = 90006;
const FIRST_CARD = 1;
const LAST_CARD = 200;

const OFFICIAL_PARALLELS =
  "Blue Sapphire · 1:1, Green Sapphire /99 · 1:5, Aqua Sapphire /75 · 1:7, Gold Sapphire /50 · 1:10, Orange Sapphire /25 · 1:20, Purple Sapphire /15 · 1:34, Black Sapphire /10 · 1:50, Red Sapphire /5 · 1:101, Padparadscha Sapphire 1/1 · 1:505";

const SET_DESCRIPTION =
  "200-card 2025 Topps Marvel Chrome Sapphire base (Blue Sapphire) with official hobby pull odds — Green Sapphire /99 1:5, Aqua Sapphire /75 1:7, Gold Sapphire /50 1:10, Orange Sapphire /25 1:20, Purple Sapphire /15 1:34, Black Sapphire /10 1:50, Red Sapphire /5 1:101, Padparadscha Sapphire 1/1 1:505. Inserts already on the checklist: Sapphire Selections (Blue 1:80, Black /10 1:1,015, Red /5 1:2,008, Padparadscha 1/1 1:9,640), Infinite Sapphire (Blue 1:320), Merry Marvel Marching Society 60th (Blue /60 1:168, Padparadscha 1/1 1:9,640), and artist/writer autographs (Blue 1:330 through Padparadscha 1:9,640).";

let started = false;

function frontStaticUrl(n: number): string {
  return `/mcs/MCS-${n}F.jpg`;
}

function backStaticUrl(n: number): string {
  return `/mcs/MCS-${n}B.jpg`;
}

function mcsDirCandidates(): string[] {
  return [
    path.resolve(process.cwd(), "client", "public", "mcs"),
    path.resolve(process.cwd(), "dist", "public", "mcs"),
    path.resolve(process.cwd(), "dist", "mcs"),
    path.resolve(process.cwd(), "public", "mcs"),
    path.resolve(import.meta.dirname, "public", "mcs"),
    path.resolve(import.meta.dirname, "..", "public", "mcs"),
    path.resolve(import.meta.dirname, "..", "..", "client", "public", "mcs"),
  ];
}

function resolveMcsDir(): string | null {
  for (const dir of mcsDirCandidates()) {
    if (fs.existsSync(path.join(dir, "MCS-1F.jpg"))) return dir;
  }
  return null;
}

function filePresent(dir: string | null, filename: string): boolean {
  if (!dir) return false;
  return fs.existsSync(path.join(dir, filename));
}

function isLockedSet(setId: number): boolean {
  return setId !== MCS_SET_ID || setId === FORBIDDEN_SET_ID || setId === CBH_SET_ID || setId === MINT_SET_ID;
}

function isNumericBaseNumber(cardNumber: string, n: number): boolean {
  if (!/^\d+$/.test(cardNumber)) return false;
  return parseInt(cardNumber, 10) === n;
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(MCS_SET_ID)) {
    return "refuse: forbidden set";
  }

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, MCS_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 4 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, MCS_SET_ID));
  return "attached set description";
}

async function seedOne(n: number, mcsDir: string | null): Promise<string> {
  if (n < FIRST_CARD || n > LAST_CARD) return `refuse: card ${n} outside 1-200`;
  if (isLockedSet(MCS_SET_ID)) return "refuse: forbidden set";

  const db = await getDb();
  if (!db) return "skip: database unavailable";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      parallels: marvelCards.parallels,
      imageUrl: marvelCards.imageUrl,
      backImageUrl: marvelCards.backImageUrl,
    })
    .from(marvelCards)
    .where(and(eq(marvelCards.setId, MCS_SET_ID), eq(marvelCards.cardNumber, String(n))));

  const allowed = rows.filter(
    (row) => !isLockedSet(row.setId) && isNumericBaseNumber(row.cardNumber, n)
  );
  if (!allowed.length) return `skip: no setId=${MCS_SET_ID} numeric card ${n}`;

  const hasFront = filePresent(mcsDir, `MCS-${n}F.jpg`);
  const hasBack = filePresent(mcsDir, `MCS-${n}B.jpg`);
  const nextFront = hasFront ? frontStaticUrl(n) : undefined;
  const nextBack = hasBack ? backStaticUrl(n) : undefined;

  let updated = 0;
  for (const row of allowed) {
    if (isLockedSet(row.setId)) continue;
    if (!isNumericBaseNumber(row.cardNumber, n)) continue;

    const patch: {
      imageUrl?: string;
      backImageUrl?: string;
      parallels?: string;
    } = {};

    if (nextFront && row.imageUrl !== nextFront) patch.imageUrl = nextFront;
    if (nextBack && row.backImageUrl !== nextBack) patch.backImageUrl = nextBack;
    if (row.parallels !== OFFICIAL_PARALLELS) patch.parallels = OFFICIAL_PARALLELS;

    if (Object.keys(patch).length === 0) continue;

    await db
      .update(marvelCards)
      .set(patch)
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, MCS_SET_ID)));
    updated += 1;
  }

  if (updated === 0) return "skip: already current";
  const bits = [
    nextFront ? "front" : "keep-front",
    nextBack ? "back" : "keep-back",
    "odds",
  ];
  return `updated ${updated} (${bits.join(", ")})`;
}

async function seedMcsPhotos(): Promise<void> {
  if (isLockedSet(MCS_SET_ID)) {
    console.error("[mcsPhotosSeed] refuse: forbidden set");
    return;
  }

  const mcsDir = resolveMcsDir();
  console.log(
    `[mcsPhotosSeed] starting setId=4 cards 1-200 numeric only (static /mcs, dir=${mcsDir ?? "missing"})`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[mcsPhotosSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[mcsPhotosSeed] set description error: ${message}`);
  }

  let attached = 0;
  let skipped = 0;

  for (let n = FIRST_CARD; n <= LAST_CARD; n++) {
    try {
      const result = await seedOne(n, mcsDir);
      if (result.startsWith("updated")) {
        attached += 1;
      } else {
        skipped += 1;
      }
      console.log(`[mcsPhotosSeed] #${n}: ${result}`);
    } catch (err) {
      skipped += 1;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[mcsPhotosSeed] #${n} error: ${message}`);
    }
  }

  console.log(`[mcsPhotosSeed] done setId=${MCS_SET_ID} updated=${attached} skipped=${skipped}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per process runs. */
export function startMcsPhotosSeed(): void {
  if (started) {
    console.log("[mcsPhotosSeed] already started this process");
    return;
  }
  started = true;
  setImmediate(() => {
    void seedMcsPhotos().catch((err) => {
      console.error("[mcsPhotosSeed] fatal", err);
    });
  });
}
