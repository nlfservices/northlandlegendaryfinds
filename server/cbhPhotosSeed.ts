/**
 * One-shot seed: attach 2025 Topps Comic Book Heroes photos + official metadata.
 * setId=2 only. Cards 1-150 only.
 *
 * Photos: static JPEGs at client/public/cbh/CBH-{n}F.jpg and CBH-{n}B.jpg
 * served by Vite/Railway at /cbh/CBH-{n}F.jpg and /cbh/CBH-{n}B.jpg.
 * Does NOT depend on storagePut / Manus forge.
 *
 * Hard-lock: setId=2 only. Never writes set 90006. Never writes set 3 (Mint).
 * Never writes imageUrl/backImageUrl when the corresponding JPEG was not shipped.
 *
 * Also sets official era cardType, official base pull-odds (not fake print runs),
 * and the set description. Does not change characterName.
 *
 * Runs at most once per process (in-memory flag). Must be started AFTER
 * server.listen so it never blocks bind.
 */
import fs from "fs";
import path from "path";
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const CBH_SET_ID = 2;
const MINT_SET_ID = 3;
const FORBIDDEN_SET_ID = 90006;
const FIRST_CARD = 1;
const LAST_CARD = 150;

/** Front JPEGs not in Pat's folder — leave existing imageUrl. */
const MISSING_FRONTS = new Set([137, 140, 141, 142, 143, 144, 149, 150]);
/** Back JPEGs not in Pat's folder — leave existing backImageUrl. */
const MISSING_BACKS = new Set([138, 140, 141, 142, 143, 144, 149, 150]);

const OFFICIAL_PARALLELS =
  "Base · 1:1, Refractor · 1:1, Gold Mini Diamonds · 1:8, Gold RayWave · 1:10, Gold Atomic · 1:12, Electrum Refractor · 1:15, Purple and Gold Lava · 1:19, Gold Refractor · 1:29, Gold Flake Shimmer · 1:59, Black and Gold Refractor · 1:141, Red and Gold · 1:282, Rose Gold Refractor · 1:706, Superfractor · 1:1,412";

const SET_DESCRIPTION =
  "150-card Marvel base across four eras (1975, 1976, 2000s, and 2025), plus Marvel Comic Book Artist Autograph cards and Silver, Gold, and Black foil sketch cards. Official hobby pull odds — base parallels: Base 1:1, Refractor 1:1, Gold Mini Diamonds 1:8, Gold RayWave 1:10, Gold Atomic 1:12, Electrum Refractor 1:15, Purple and Gold Lava 1:19, Gold Refractor 1:29, Gold Flake Shimmer 1:59, Black and Gold Refractor 1:141, Red and Gold 1:282, Rose Gold Refractor 1:706, Superfractor 1:1,412. Artist autographs from base refractor 1:69 through Superfractor 1:20,185. Sketch cards: Silver 1:90, Gold 1:748, Black 1:3,204.";

let started = false;

function eraForCard(n: number): string | null {
  if (n >= 1 && n <= 25) return "COMIC BOOK HEROES 1975";
  if (n >= 26 && n <= 56) return "COMIC BOOK HEROES 1976";
  if (n >= 57 && n <= 99) return "COMIC BOOK HEROES 2000's";
  if (n >= 100 && n <= 150) return "COMIC BOOK HEROES 2025";
  return null;
}

function frontStaticUrl(n: number): string {
  return `/cbh/CBH-${n}F.jpg`;
}

function backStaticUrl(n: number): string {
  return `/cbh/CBH-${n}B.jpg`;
}

function cbhDirCandidates(): string[] {
  return [
    path.resolve(process.cwd(), "client", "public", "cbh"),
    path.resolve(process.cwd(), "dist", "public", "cbh"),
    path.resolve(process.cwd(), "dist", "cbh"),
    path.resolve(process.cwd(), "public", "cbh"),
    path.resolve(import.meta.dirname, "public", "cbh"),
    path.resolve(import.meta.dirname, "..", "public", "cbh"),
    path.resolve(import.meta.dirname, "..", "..", "client", "public", "cbh"),
  ];
}

function resolveCbhDir(): string | null {
  for (const dir of cbhDirCandidates()) {
    if (fs.existsSync(path.join(dir, "CBH-1F.jpg"))) return dir;
  }
  return null;
}

function filePresent(dir: string | null, filename: string, fallback: boolean): boolean {
  if (dir) return fs.existsSync(path.join(dir, filename));
  return fallback;
}

function isLockedSet(setId: number): boolean {
  return setId !== CBH_SET_ID || setId === FORBIDDEN_SET_ID || setId === MINT_SET_ID;
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (CBH_SET_ID === FORBIDDEN_SET_ID || CBH_SET_ID === MINT_SET_ID) {
    return "refuse: forbidden set";
  }

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, CBH_SET_ID));

  const allowed = rows.filter((row) => row.id === CBH_SET_ID && row.id !== FORBIDDEN_SET_ID && row.id !== MINT_SET_ID);
  if (!allowed.length) return "skip: set 2 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, CBH_SET_ID));
  return "attached set description";
}

async function seedOne(n: number, cbhDir: string | null): Promise<string> {
  if (n < FIRST_CARD || n > LAST_CARD) return `refuse: card ${n} outside 1-150`;
  if (isLockedSet(CBH_SET_ID)) return "refuse: forbidden set";

  const db = await getDb();
  if (!db) return "skip: database unavailable";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
      imageUrl: marvelCards.imageUrl,
      backImageUrl: marvelCards.backImageUrl,
    })
    .from(marvelCards)
    .where(and(eq(marvelCards.setId, CBH_SET_ID), eq(marvelCards.cardNumber, String(n))));

  const allowed = rows.filter((row) => !isLockedSet(row.setId));
  if (!allowed.length) return `skip: no setId=${CBH_SET_ID} card ${n}`;

  const hasFront = filePresent(cbhDir, `CBH-${n}F.jpg`, !MISSING_FRONTS.has(n));
  const hasBack = filePresent(cbhDir, `CBH-${n}B.jpg`, !MISSING_BACKS.has(n));
  const era = eraForCard(n);
  const nextFront = hasFront ? frontStaticUrl(n) : undefined;
  const nextBack = hasBack ? backStaticUrl(n) : undefined;

  let updated = 0;
  for (const row of allowed) {
    if (isLockedSet(row.setId)) continue;

    const patch: {
      imageUrl?: string;
      backImageUrl?: string;
      cardType?: string;
      parallels?: string;
    } = {};

    if (nextFront && row.imageUrl !== nextFront) patch.imageUrl = nextFront;
    if (nextBack && row.backImageUrl !== nextBack) patch.backImageUrl = nextBack;
    if (era && row.cardType !== era) patch.cardType = era;
    if (row.parallels !== OFFICIAL_PARALLELS) patch.parallels = OFFICIAL_PARALLELS;

    if (Object.keys(patch).length === 0) continue;

    await db
      .update(marvelCards)
      .set(patch)
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, CBH_SET_ID)));
    updated += 1;
  }

  if (updated === 0) return "skip: already current";
  const bits = [
    nextFront ? "front" : "keep-front",
    nextBack ? "back" : "keep-back",
    era || "no-era",
  ];
  return `updated ${updated} (${bits.join(", ")})`;
}

async function seedCbhPhotos(): Promise<void> {
  if (isLockedSet(CBH_SET_ID)) {
    console.error("[cbhPhotosSeed] refuse: forbidden set");
    return;
  }

  const cbhDir = resolveCbhDir();
  console.log(
    `[cbhPhotosSeed] starting setId=2 cards 1-150 (static /cbh, dir=${cbhDir ?? "fallback-list"})`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[cbhPhotosSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[cbhPhotosSeed] set description error: ${message}`);
  }

  let attached = 0;
  let skipped = 0;

  for (let n = FIRST_CARD; n <= LAST_CARD; n++) {
    try {
      const result = await seedOne(n, cbhDir);
      if (result.startsWith("updated")) {
        attached += 1;
      } else {
        skipped += 1;
      }
      console.log(`[cbhPhotosSeed] #${n}: ${result}`);
    } catch (err) {
      skipped += 1;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[cbhPhotosSeed] #${n} error: ${message}`);
    }
  }

  console.log(`[cbhPhotosSeed] done setId=${CBH_SET_ID} updated=${attached} skipped=${skipped}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per process runs. */
export function startCbhPhotosSeed(): void {
  if (started) {
    console.log("[cbhPhotosSeed] already started this process");
    return;
  }
  started = true;
  setImmediate(() => {
    void seedCbhPhotos().catch((err) => {
      console.error("[cbhPhotosSeed] fatal", err);
    });
  });
}
