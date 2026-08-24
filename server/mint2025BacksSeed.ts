/**
 * One-shot seed: copy 2025 Topps Marvel Mint BACK images (setId=3, cards 1-100)
 * from the public Hugging Face dataset into storage + backImageUrl.
 *
 * Hard-lock: setId=3 only. cardNumber 1-100 only. Never writes set 90006.
 * Never writes imageUrl / fronts. storagePut failures are logged and skipped.
 *
 * Runs at most once per process (in-memory flag). Must be started AFTER
 * server.listen so it never blocks bind.
 *
 * Source: https://huggingface.co/datasets/pulljack/nlf-2025-marvel-mint-backs
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards } from "../drizzle/schema";
import { storagePut } from "./storage";

const MINT_2025_SET_ID = 3;
const FORBIDDEN_SET_ID = 90006;
const FIRST_CARD = 1;
const LAST_CARD = 100;

const HF_REPO = "pulljack/nlf-2025-marvel-mint-backs";
const R2_PUBLIC_BASE =
  "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi";

const FETCH_TIMEOUT_MS = 20_000;
const HEAD_TIMEOUT_MS = 8_000;
const MAX_JPEG_BYTES = 2 * 1024 * 1024;

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

function publicR2Url(n: number): string {
  return `${R2_PUBLIC_BASE}/${backObjectKey(n)}`;
}

function hfCandidateUrls(n: number): string[] {
  const key = backObjectKey(n);
  return [
    `https://huggingface.co/datasets/${HF_REPO}/resolve/main/${key}`,
    `https://huggingface.co/datasets/${HF_REPO}/resolve/main/${key}?download=true`,
    `https://cdn-lfs.huggingface.co/datasets/${HF_REPO}/${key}`,
  ];
}

function isJpegBuffer(buf: Buffer): boolean {
  return buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
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

async function fetchJpeg(url: string): Promise<Buffer | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
    if (!res.ok) return null;
    const ab = await res.arrayBuffer();
    const buf = Buffer.from(ab);
    if (!buf.length || buf.length > MAX_JPEG_BYTES) return null;
    if (!isJpegBuffer(buf)) return null;
    return buf;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchHfJpeg(n: number): Promise<Buffer | null> {
  for (const url of hfCandidateUrls(n)) {
    const buf = await fetchJpeg(url);
    if (buf) return buf;
  }
  return null;
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

  const alreadySet = allowed.every((row) => typeof row.backImageUrl === "string" && row.backImageUrl.trim());
  if (alreadySet) return "skip: backImageUrl already set";

  const key = backObjectKey(n);
  const backImageUrl = backManusUrl(n);
  const r2Ready = await headOk(publicR2Url(n));

  if (!r2Ready) {
    const jpeg = await fetchHfJpeg(n);
    if (!jpeg) return `skip: HF jpeg not reachable for ${key}`;
    try {
      await storagePut(key, jpeg, "image/jpeg");
    } catch (err) {
      const message = err instanceof Error ? err.message : "storagePut failed";
      console.error(`[mint2025BacksSeed] storagePut failed for ${key}: ${message}`);
      return `skip: storagePut failed (${message})`;
    }
  }

  let attached = 0;
  for (const row of allowed) {
    if (row.setId !== MINT_2025_SET_ID || row.setId === FORBIDDEN_SET_ID) continue;
    if (typeof row.backImageUrl === "string" && row.backImageUrl.trim()) continue;
    const ok = await attachBackUrl(row.id, n, backImageUrl);
    if (ok) attached += 1;
  }
  return r2Ready ? `attached existing R2 (${attached})` : `uploaded+attached (${attached})`;
}

async function seedMint2025Backs(): Promise<void> {
  if (MINT_2025_SET_ID === FORBIDDEN_SET_ID) {
    console.error("[mint2025BacksSeed] refuse: set 90006 is forbidden");
    return;
  }

  console.log("[mint2025BacksSeed] starting setId=3 cards 1-100");
  let uploaded = 0;
  let attached = 0;
  let skipped = 0;

  for (let n = FIRST_CARD; n <= LAST_CARD; n++) {
    try {
      const result = await seedOne(n);
      if (result.startsWith("uploaded")) {
        uploaded += 1;
        attached += 1;
      } else if (result.startsWith("attached")) {
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
    `[mint2025BacksSeed] done setId=${MINT_2025_SET_ID} uploaded=${uploaded} attached=${attached} skipped=${skipped}`
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
