/**
 * One-shot seed: attach 2025 Topps Marvel Chrome Studios scans.
 * setId=5 only (slug 2025-topps-marvel-studios). Numeric cardNumber 1-200 only.
 *
 * Photos: static JPEGs at client/public/studios/25Studios-{n}F.jpg and 25Studios-{n}B.jpg
 * served at /studios/25Studios-{n}F.jpg and /studios/25Studios-{n}B.jpg.
 * Pairing comes from the printed card number on the back, top center.
 * Does NOT depend on storagePut / Manus forge.
 *
 * Hard-lock: setId=5 only. Never writes set 2 (CBH), set 3 (Mint),
 * set 4 (Sapphire /mcs), set 6 (Studios Sapphire), or set 90006.
 * Never writes insert cardNumbers (non-numeric).
 * Never touches client/public/mcs.
 * Writes /studios/ URLs only when the corresponding JPEG exists.
 * If a JPEG is missing and the current URL starts with /studios/, clear it.
 * Existing non-/studios/ URLs stay until a matching JPEG is present.
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

const STUDIOS_SET_ID = 5;
const CBH_SET_ID = 2;
const MINT_SET_ID = 3;
const SAPPHIRE_SET_ID = 4;
const STUDIOS_SAPPHIRE_SET_ID = 6;
const FORBIDDEN_SET_ID = 90006;
const FIRST_CARD = 1;
const LAST_CARD = 200;

const SEED_VERSION = "studios-chrome-scans-v1";

let startedVersion: string | null = null;

function frontStaticUrl(n: number): string {
  return `/studios/25Studios-${n}F.jpg`;
}

function backStaticUrl(n: number): string {
  return `/studios/25Studios-${n}B.jpg`;
}

function isStudiosUrl(url: string | null | undefined): boolean {
  return typeof url === "string" && url.startsWith("/studios/");
}

function dirCandidates(): string[] {
  return [
    path.resolve(process.cwd(), "client", "public", "studios"),
    path.resolve(process.cwd(), "dist", "public", "studios"),
    path.resolve(process.cwd(), "dist", "studios"),
    path.resolve(process.cwd(), "public", "studios"),
    path.resolve(import.meta.dirname, "public", "studios"),
    path.resolve(import.meta.dirname, "..", "public", "studios"),
    path.resolve(import.meta.dirname, "..", "..", "client", "public", "studios"),
  ];
}

function dirHasJpeg(dir: string): boolean {
  if (!fs.existsSync(dir)) return false;
  try {
    if (!fs.statSync(dir).isDirectory()) return false;
  } catch {
    return false;
  }
  if (fs.existsSync(path.join(dir, "25Studios-1F.jpg"))) return true;
  try {
    return fs.readdirSync(dir).some((name) => /^25Studios-\d+[FB]\.jpg$/i.test(name));
  } catch {
    return false;
  }
}

function resolveStudiosDir(): string | null {
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
    setId !== STUDIOS_SET_ID ||
    setId === FORBIDDEN_SET_ID ||
    setId === CBH_SET_ID ||
    setId === MINT_SET_ID ||
    setId === SAPPHIRE_SET_ID ||
    setId === STUDIOS_SAPPHIRE_SET_ID
  );
}

function isNumericBaseNumber(cardNumber: string, n: number): boolean {
  if (!/^\d+$/.test(cardNumber)) return false;
  return parseInt(cardNumber, 10) === n;
}

async function seedOne(n: number, studiosDir: string | null): Promise<string> {
  if (n < FIRST_CARD || n > LAST_CARD) return `refuse: card ${n} outside 1-200`;
  if (isLockedSet(STUDIOS_SET_ID)) return "refuse: forbidden set";

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
    .where(and(eq(marvelCards.setId, STUDIOS_SET_ID), eq(marvelCards.cardNumber, String(n))));

  const allowed = rows.filter(
    (row) => !isLockedSet(row.setId) && isNumericBaseNumber(row.cardNumber, n)
  );
  if (!allowed.length) return `skip: no setId=${STUDIOS_SET_ID} numeric card ${n}`;

  const hasFront = filePresent(studiosDir, `25Studios-${n}F.jpg`);
  const hasBack = filePresent(studiosDir, `25Studios-${n}B.jpg`);

  let updated = 0;
  for (const row of allowed) {
    if (isLockedSet(row.setId)) continue;
    if (!isNumericBaseNumber(row.cardNumber, n)) continue;

    const patch: { imageUrl?: string | null; backImageUrl?: string | null } = {};

    if (hasFront) {
      const nextFront = frontStaticUrl(n);
      if (row.imageUrl !== nextFront) patch.imageUrl = nextFront;
    } else if (isStudiosUrl(row.imageUrl)) {
      patch.imageUrl = null;
    }

    if (hasBack) {
      const nextBack = backStaticUrl(n);
      if (row.backImageUrl !== nextBack) patch.backImageUrl = nextBack;
    } else if (isStudiosUrl(row.backImageUrl)) {
      patch.backImageUrl = null;
    }

    if (Object.keys(patch).length === 0) continue;

    await db
      .update(marvelCards)
      .set(patch)
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, STUDIOS_SET_ID)));
    updated += 1;
  }

  if (updated === 0) return "skip: already current";
  const bits = [hasFront ? "front" : "keep-front", hasBack ? "back" : "keep-back"];
  return `updated ${updated} (${bits.join(", ")})`;
}

async function seedStudiosPhotos(): Promise<void> {
  if (isLockedSet(STUDIOS_SET_ID)) {
    console.error("[studiosPhotosSeed] refuse: forbidden set");
    return;
  }

  const studiosDir = resolveStudiosDir();
  console.log(
    `[studiosPhotosSeed] ${SEED_VERSION} starting setId=5 cards 1-200 numeric only (static /studios, dir=${studiosDir ?? "missing"})`
  );

  let attached = 0;
  let skipped = 0;

  for (let n = FIRST_CARD; n <= LAST_CARD; n++) {
    try {
      const result = await seedOne(n, studiosDir);
      if (result.startsWith("updated")) {
        attached += 1;
      } else {
        skipped += 1;
      }
      console.log(`[studiosPhotosSeed] #${n}: ${result}`);
    } catch (err) {
      skipped += 1;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[studiosPhotosSeed] #${n} error: ${message}`);
    }
  }

  console.log(
    `[studiosPhotosSeed] done version=${SEED_VERSION} setId=${STUDIOS_SET_ID} updated=${attached} skipped=${skipped}`
  );
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startStudiosPhotosSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[studiosPhotosSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedStudiosPhotos().catch((err) => {
      console.error("[studiosPhotosSeed] fatal", err);
    });
  });
}
