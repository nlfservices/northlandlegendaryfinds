/**
 * One-shot seed: attach 2026 Topps Marvel Mint base scans.
 * setId=90006 only (slug 2026-topps-marvel-mint). Numeric cardNumber 1-125 only.
 *
 * Photos: static JPEGs at client/public/mint2026/26TMM-{n}F.jpg and 26TMM-{n}B.jpg
 * served at /mint2026/26TMM-{n}F.jpg and /mint2026/26TMM-{n}B.jpg.
 * Pairing comes from the printed card number on the back, top center.
 * Does NOT depend on storagePut / Manus forge.
 *
 * Hard-lock: setId=90006 only. Never writes set 2 (CBH), set 3 (2025 Mint),
 * set 4 (Sapphire /mcs), set 5 (Studios /studios), or set 6 (Studios Sapphire).
 * Never writes insert cardNumbers (CB-*, ST-*, SDCC-*, MSA-*, CCA-*, SL-*, SC-*, SK*).
 * Never touches client/public/mcs, /studios, or /mint-backs (2025 Mint).
 * Writes /mint2026/ URLs only when the corresponding JPEG exists.
 * If a JPEG is missing and the current URL starts with /mint2026/, clear it.
 * Existing non-/mint2026/ URLs stay until a matching JPEG is present.
 * Leaves cardType, parallels, and characterName as-is.
 *
 * Versioned in-memory once-flag so a remap re-run executes after a prior
 * seed already ran in this process. Must be started AFTER server.listen so
 * it never blocks bind.
 */
import fs from "fs";
import path from "path";
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards } from "../drizzle/schema";

const MINT2026_SET_ID = 90006;
const CBH_SET_ID = 2;
const MINT2025_SET_ID = 3;
const SAPPHIRE_SET_ID = 4;
const STUDIOS_SET_ID = 5;
const STUDIOS_SAPPHIRE_SET_ID = 6;
const FIRST_CARD = 1;
const LAST_CARD = 125;

const SEED_VERSION = "mint2026-base-scans-v1";

let startedVersion: string | null = null;

function frontStaticUrl(n: number): string {
  return `/mint2026/26TMM-${n}F.jpg`;
}

function backStaticUrl(n: number): string {
  return `/mint2026/26TMM-${n}B.jpg`;
}

function isMint2026Url(url: string | null | undefined): boolean {
  return typeof url === "string" && url.startsWith("/mint2026/");
}

function dirCandidates(): string[] {
  return [
    path.resolve(process.cwd(), "client", "public", "mint2026"),
    path.resolve(process.cwd(), "dist", "public", "mint2026"),
    path.resolve(process.cwd(), "dist", "mint2026"),
    path.resolve(process.cwd(), "public", "mint2026"),
    path.resolve(import.meta.dirname, "public", "mint2026"),
    path.resolve(import.meta.dirname, "..", "public", "mint2026"),
    path.resolve(import.meta.dirname, "..", "..", "client", "public", "mint2026"),
  ];
}

function dirHasJpeg(dir: string): boolean {
  if (!fs.existsSync(dir)) return false;
  try {
    if (!fs.statSync(dir).isDirectory()) return false;
  } catch {
    return false;
  }
  if (fs.existsSync(path.join(dir, "26TMM-1F.jpg"))) return true;
  try {
    return fs.readdirSync(dir).some((name) => /^26TMM-\d+[FB]\.jpg$/i.test(name));
  } catch {
    return false;
  }
}

function resolveMint2026Dir(): string | null {
  for (const dir of dirCandidates()) {
    if (dirHasJpeg(dir)) return dir;
  }
  return null;
}

function filePresent(dir: string | null, filename: string): boolean {
  if (!dir) return false;
  return fs.existsSync(path.join(dir, filename));
}

function isLockedSet(setId: number): boolean {
  return (
    setId !== MINT2026_SET_ID ||
    setId === CBH_SET_ID ||
    setId === MINT2025_SET_ID ||
    setId === SAPPHIRE_SET_ID ||
    setId === STUDIOS_SET_ID ||
    setId === STUDIOS_SAPPHIRE_SET_ID
  );
}

function isNumericBaseNumber(cardNumber: string, n: number): boolean {
  if (!/^\d+$/.test(cardNumber)) return false;
  return parseInt(cardNumber, 10) === n;
}

async function seedOne(n: number, mintDir: string | null): Promise<string> {
  if (n < FIRST_CARD || n > LAST_CARD) return `refuse: card ${n} outside 1-125`;
  if (isLockedSet(MINT2026_SET_ID)) return "refuse: forbidden set";

  const db = await getDb();
  if (!db) return "skip: database unavailable";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      imageUrl: marvelCards.imageUrl,
      backImageUrl: marvelCards.backImageUrl,
    })
    .from(marvelCards)
    .where(and(eq(marvelCards.setId, MINT2026_SET_ID), eq(marvelCards.cardNumber, String(n))));

  const allowed = rows.filter(
    (row) => !isLockedSet(row.setId) && isNumericBaseNumber(row.cardNumber, n)
  );
  if (!allowed.length) return `skip: no setId=${MINT2026_SET_ID} numeric card ${n}`;

  const hasFront = filePresent(mintDir, `26TMM-${n}F.jpg`);
  const hasBack = filePresent(mintDir, `26TMM-${n}B.jpg`);

  let updated = 0;
  for (const row of allowed) {
    if (isLockedSet(row.setId)) continue;
    if (!isNumericBaseNumber(row.cardNumber, n)) continue;

    const patch: { imageUrl?: string | null; backImageUrl?: string | null } = {};

    if (hasFront) {
      const nextFront = frontStaticUrl(n);
      if (row.imageUrl !== nextFront) patch.imageUrl = nextFront;
    } else if (isMint2026Url(row.imageUrl)) {
      patch.imageUrl = null;
    }

    if (hasBack) {
      const nextBack = backStaticUrl(n);
      if (row.backImageUrl !== nextBack) patch.backImageUrl = nextBack;
    } else if (isMint2026Url(row.backImageUrl)) {
      patch.backImageUrl = null;
    }

    if (Object.keys(patch).length === 0) continue;

    await db
      .update(marvelCards)
      .set(patch)
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, MINT2026_SET_ID)));
    updated += 1;
  }

  if (updated === 0) return "skip: already current";
  const bits = [hasFront ? "front" : "keep-front", hasBack ? "back" : "keep-back"];
  return `updated ${updated} (${bits.join(", ")})`;
}

async function seedMint2026Photos(): Promise<void> {
  if (isLockedSet(MINT2026_SET_ID)) {
    console.error("[mint2026PhotosSeed] refuse: forbidden set");
    return;
  }

  const mintDir = resolveMint2026Dir();
  console.log(
    `[mint2026PhotosSeed] ${SEED_VERSION} starting setId=90006 cards 1-125 numeric only (static /mint2026, dir=${mintDir ?? "missing"})`
  );

  let attached = 0;
  let skipped = 0;

  for (let n = FIRST_CARD; n <= LAST_CARD; n++) {
    try {
      const result = await seedOne(n, mintDir);
      if (result.startsWith("updated")) {
        attached += 1;
      } else {
        skipped += 1;
      }
      console.log(`[mint2026PhotosSeed] #${n}: ${result}`);
    } catch (err) {
      skipped += 1;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[mint2026PhotosSeed] #${n} error: ${message}`);
    }
  }

  console.log(
    `[mint2026PhotosSeed] done version=${SEED_VERSION} setId=${MINT2026_SET_ID} updated=${attached} skipped=${skipped}`
  );
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startMint2026PhotosSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[mint2026PhotosSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedMint2026Photos().catch((err) => {
      console.error("[mint2026PhotosSeed] fatal", err);
    });
  });
}
