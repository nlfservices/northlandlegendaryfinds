/**
 * One-shot seed: attach 2025 Topps Marvel Mint BACK image URLs (setId=3, cards 1-100).
 *
 * Does NOT depend on storagePut / Manus forge. Static JPEGs live at
 * client/public/mint-backs/mint-topps-NNN_back.jpg and are served by Vite/Railway
 * at /mint-backs/mint-topps-NNN_back.jpg.
 *
 * Hard-lock: setId=3 only. cardNumber 1-100 only. Never writes set 90006.
 * Never writes imageUrl / fronts.
 *
 * URL choice per card:
 *   - If public R2 HEAD is 200, may use /manus-storage/mint-topps-NNN_back.jpg
 *   - Otherwise set site-relative /mint-backs/mint-topps-NNN_back.jpg
 *
 * Runs at most once per process (in-memory flag). Must be started AFTER
 * server.listen so it never blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards } from "../drizzle/schema";

const MINT_2025_SET_ID = 3;
const FORBIDDEN_SET_ID = 90006;
const FIRST_CARD = 1;
const LAST_CARD = 100;

const R2_PUBLIC_BASE =
  "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi";

const HEAD_TIMEOUT_MS = 8_000;

let started = false;

function paddedCard(n: number): string {
  return String(n).padStart(3, "0");
}

function backObjectKey(n: number): string {
  return `mint-topps-${paddedCard(n)}_back.jpg`;
}

function backManusUrl(n: number): string {
  return `/manus-storage/${backObjectKey(n)}`;
}

function backStaticUrl(n: number): string {
  return `/mint-backs/${backObjectKey(n)}`;
}

function publicR2Url(n: number): string {
  return `${R2_PUBLIC_BASE}/${backObjectKey(n)}`;
}

async function headOk(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEAD_TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
    return res.status === 200;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function attachBackUrl(cardId: number, n: number, backImageUrl: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  if (MINT_2025_SET_ID === FORBIDDEN_SET_ID) return false;
  if (n < FIRST_CARD || n > LAST_CARD) return false;

  await db
    .update(marvelCards)
    .set({ backImageUrl } as { backImageUrl: string })
    .where(
      and(
        eq(marvelCards.id, cardId),
        eq(marvelCards.setId, MINT_2025_SET_ID)
      )
    );
  return true;
}

function isUsableExisting(url: string | null | undefined, r2Ready: boolean, n: number): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed === backStaticUrl(n)) return true;
  if (trimmed === backManusUrl(n) && r2Ready) return true;
  return false;
}

async function seedOne(n: number): Promise<string> {
  if (n < FIRST_CARD || n > LAST_CARD) return `refuse: card ${n} outside 1-100`;
  if (MINT_2025_SET_ID === FORBIDDEN_SET_ID) return "refuse: forbidden set";

  const db = await getDb();
  if (!db) return "skip: database unavailable";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      backImageUrl: marvelCards.backImageUrl,
    })
    .from(marvelCards)
    .where(and(eq(marvelCards.setId, MINT_2025_SET_ID), eq(marvelCards.cardNumber, String(n))));

  const allowed = rows.filter((row) => row.setId === MINT_2025_SET_ID && row.setId !== FORBIDDEN_SET_ID);
  if (!allowed.length) return `skip: no setId=${MINT_2025_SET_ID} card ${n}`;

  const r2Ready = await headOk(publicR2Url(n));
  const backImageUrl = r2Ready ? backManusUrl(n) : backStaticUrl(n);

  const alreadySet = allowed.every((row) => isUsableExisting(row.backImageUrl, r2Ready, n));
  if (alreadySet) return "skip: backImageUrl already set";

  let attached = 0;
  for (const row of allowed) {
    if (row.setId !== MINT_2025_SET_ID || row.setId === FORBIDDEN_SET_ID) continue;
    if (isUsableExisting(row.backImageUrl, r2Ready, n)) continue;
    const ok = await attachBackUrl(row.id, n, backImageUrl);
    if (ok) attached += 1;
  }
  return r2Ready ? `attached existing R2 (${attached})` : `attached static (${attached})`;
}

async function seedMint2025Backs(): Promise<void> {
  if (MINT_2025_SET_ID === FORBIDDEN_SET_ID) {
    console.error("[mint2025BacksSeed] refuse: set 90006 is forbidden");
    return;
  }

  console.log("[mint2025BacksSeed] starting setId=3 cards 1-100 (static /mint-backs fallback, no storagePut)");
  let attached = 0;
  let skipped = 0;

  for (let n = FIRST_CARD; n <= LAST_CARD; n++) {
    try {
      const result = await seedOne(n);
      if (result.startsWith("attached")) {
        attached += 1;
      } else {
        skipped += 1;
      }
      console.log(`[mint2025BacksSeed] #${n}: ${result}`);
    } catch (err) {
      skipped += 1;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[mint2025BacksSeed] #${n} error: ${message}`);
    }
  }

  console.log(
    `[mint2025BacksSeed] done setId=${MINT_2025_SET_ID} attached=${attached} skipped=${skipped}`
  );
}

/** Fire-and-forget. Safe to call more than once; only the first call per process runs. */
export function startMint2025BacksSeed(): void {
  if (started) {
    console.log("[mint2025BacksSeed] already started this process");
    return;
  }
  started = true;
  setImmediate(() => {
    void seedMint2025Backs().catch((err) => {
      console.error("[mint2025BacksSeed] fatal", err);
    });
  });
}
