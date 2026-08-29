/**
 * One-shot seed: official 2026 Topps Chrome Marvel Comics hobby pull odds.
 * setId=90005 only (slug 2026-topps-chrome-marvel-comics). Updates existing cards only.
 * Never writes imageUrl, backImageUrl, characterName, or cardType. Never inserts cards.
 *
 * Numeric Base (cardType Base, cardNumber 1-200): official hobby 1:x rainbow.
 * Do not put RayWave (value exclusive) or X-Fractor (mega exclusive) on hobby base.
 *
 * Clawed Chrome Variation (CC-* / cardType Clawed Chrome Variation): separate 200-card
 * group — not mixed into base parallels.
 * Topps Originals (TO-*) and Sketch Cards (SK-*): named on the official sheet.
 *
 * Cover Story, Marvel Firsts, Chrome Autographs, Dual Autographs: no exact name
 * match on the sheet — leave parallels unchanged (None). Nearby hobby rates go
 * in the set description only.
 *
 * Odds are pull odds, never prices. Parser keeps thousands commas tight
 * so "1:7,356" stays one token (middle-dot U+00B7). Hobby column only.
 *
 * Does not touch set 1 (2025 Chrome), 2, 3, 4, 5, 6, 30001, 60001, 90001-90004,
 * 90006, or 90007. Versioned in-memory once-flag so a bump re-runs after a
 * prior seed in this process. Must be started AFTER server.listen so it
 * never blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const CHROME_2026_SET_ID = 90005;
const CHROME_SET_ID = 1;
const CBH_SET_ID = 2;
const MINT_2025_SET_ID = 3;
const SAPPHIRE_SET_ID = 4;
const STUDIOS_SET_ID = 5;
const STUDIOS_SAPPHIRE_SET_ID = 6;
const COLLECTOR_SET_ID = 30001;
const FORBIDDEN_60001 = 60001;
const FORBIDDEN_90001 = 90001;
const FORBIDDEN_90002 = 90002;
const FORBIDDEN_90003 = 90003;
const FORBIDDEN_90004 = 90004;
const MINT_2026_SET_ID = 90006;
const VAULT_SET_ID = 90007;

/** Bump when official 2026 Chrome Marvel Comics hobby odds change so the seed re-runs. */
const SEED_VERSION = "chrome-2026-official-hobby-odds-v1";

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

const BASE_PARALLELS = oddsLine([
  ["Base", "1:1"],
  ["Refractor", "1:2"],
  ["Storm's Lightning Refractor", "1:3"],
  ["Spider-Web Refractor", "1:19"],
  ["Pink Refractor", "1:30"],
  ["Storm's Green Lightning Refractor", "1:35"],
  ["Aqua Refractor", "1:38"],
  ["Storm's Purple Lightning Refractor", "1:47"],
  ["Blue Refractor", "1:50"],
  ["Marvel Logofractor", "1:57"],
  ["Storm's Gold Lightning Refractor", "1:70"],
  ["Hulk Green Lazer Refractor", "1:75"],
  ["Dazzler's Silver Rhythm Refractor", "1:93"],
  ["Purple Shimmer Refractor", "1:99"],
  ["Spider-Web Red/Blue Refractor", "1:119"],
  ["Storm's Orange Lightning Refractor", "1:139"],
  ["Gold Refractor", "1:148"],
  ["Gold Wave Refractor", "1:148"],
  ["Captain America's Star Refractor", "1:180"],
  ["Human Torch Refractor", "1:190"],
  ["Orange Refractor", "1:295"],
  ["Orange Wave Refractor", "1:295"],
  ["Storm's Black Lightning Refractor", "1:347"],
  ["Storm's Red Lightning Refractor", "1:694"],
  ["Black Refractor", "1:738"],
  ["Black Wave Refractor", "1:738"],
  ["Red Refractor", "1:1,475"],
  ["Red Wave Refractor", "1:1,475"],
  ["Superfractor", "1:7,356"],
]);

const CLAWED_PARALLELS = oddsLine([
  ["Clawed Chrome", "1:174"],
  ["Black Wolverine Adamantium", "1:347"],
  ["Red Wolverine Adamantium", "1:694"],
  ["Superfractor", "1:3,467"],
]);

const TOPPS_ORIGINALS_PARALLELS = oddsLine([
  ["Base", "1:576"],
  ["Orange Refractor", "1:5,859"],
  ["Black Refractor", "1:14,392"],
  ["Red Refractor", "1:28,784"],
  ["Superfractor", "1:132,404"],
]);

const SKETCH_PARALLELS = oddsLine([["Base", "1:135"]]);

const SET_DESCRIPTION =
  "200-card 2026 Topps Chrome Marvel Comics base with official hobby odds (Refractor 1:2, Storm's Lightning 1:3, Superfractor 1:7,356) plus Clawed Chrome 1:174. Inserts already on the page include Cover Story, Marvel Firsts, Chrome autographs, Dual autographs, Topps Originals 1:576, Sketch 1:135. Nearby hobby rates not mapped onto those groups: Classic Comic Book Covers 1:192, Artist Autographs 1:91. Other hobby inserts not listed on this page: Fanfare / Icons / Future Stars / Meanwhile / One World Under Doom / The Beyond 1:6, 60 Years of Black Panther 1:12. Value exclusive RayWave; Mega exclusive X-Fractor. Odds only, never prices.";

const CLAWED_TYPE = "Clawed Chrome Variation";
const TOPPS_ORIGINALS_TYPE = "Topps Originals";
const SKETCH_TYPE = "Sketch Cards";

let startedVersion: string | null = null;

function isLockedSet(setId: number): boolean {
  return (
    setId !== CHROME_2026_SET_ID ||
    setId === CHROME_SET_ID ||
    setId === CBH_SET_ID ||
    setId === MINT_2025_SET_ID ||
    setId === SAPPHIRE_SET_ID ||
    setId === STUDIOS_SET_ID ||
    setId === STUDIOS_SAPPHIRE_SET_ID ||
    setId === COLLECTOR_SET_ID ||
    setId === FORBIDDEN_60001 ||
    setId === FORBIDDEN_90001 ||
    setId === FORBIDDEN_90002 ||
    setId === FORBIDDEN_90003 ||
    setId === FORBIDDEN_90004 ||
    setId === MINT_2026_SET_ID ||
    setId === VAULT_SET_ID
  );
}

function numberPrefix(cardNumber: string): string | null {
  const match = cardNumber.match(/^([A-Za-z]+)-/);
  return match ? match[1].toUpperCase() : null;
}

function metaForCard(
  cardNumber: string,
  cardType: string | null | undefined
): { parallels: string } | null {
  const type = (cardType ?? "").trim();
  const prefix = numberPrefix(cardNumber);

  if (/^\d+$/.test(cardNumber) && type === "Base") {
    const n = parseInt(cardNumber, 10);
    if (n >= 1 && n <= 200) return { parallels: BASE_PARALLELS };
    return null;
  }

  if (type === CLAWED_TYPE || prefix === "CC") return { parallels: CLAWED_PARALLELS };
  if (type === TOPPS_ORIGINALS_TYPE || prefix === "TO") return { parallels: TOPPS_ORIGINALS_PARALLELS };
  if (type === SKETCH_TYPE || prefix === "SK") return { parallels: SKETCH_PARALLELS };

  return null;
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(CHROME_2026_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, CHROME_2026_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 90005 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, CHROME_2026_SET_ID));
  return "attached set description";
}

async function seedExistingCards(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(CHROME_2026_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, CHROME_2026_SET_ID));

  let updated = 0;
  let skipped = 0;
  let baseUpdated = 0;
  let insertUpdated = 0;

  for (const row of rows) {
    if (isLockedSet(row.setId)) {
      skipped += 1;
      continue;
    }
    const meta = metaForCard(row.cardNumber, row.cardType);
    if (!meta) {
      skipped += 1;
      continue;
    }

    if (row.parallels === meta.parallels) {
      skipped += 1;
      continue;
    }

    await db
      .update(marvelCards)
      .set({ parallels: meta.parallels })
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, CHROME_2026_SET_ID)));
    updated += 1;
    if (/^\d+$/.test(row.cardNumber) && row.cardType === "Base") baseUpdated += 1;
    else insertUpdated += 1;
  }

  return `updated ${updated} (base ${baseUpdated}, inserts ${insertUpdated}) skipped ${skipped}`;
}

async function seedChrome2026Meta(): Promise<void> {
  if (isLockedSet(CHROME_2026_SET_ID)) {
    console.error("[chrome2026MetaSeed] refuse: forbidden set");
    return;
  }

  console.log(
    `[chrome2026MetaSeed] ${SEED_VERSION} starting setId=90005 (odds only, photos/cardType/characterName untouched, no new cards)`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[chrome2026MetaSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[chrome2026MetaSeed] set description error: ${message}`);
  }

  try {
    const cards = await seedExistingCards();
    console.log(`[chrome2026MetaSeed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[chrome2026MetaSeed] cards error: ${message}`);
  }

  console.log(`[chrome2026MetaSeed] done version=${SEED_VERSION} setId=${CHROME_2026_SET_ID}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startChrome2026MetaSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[chrome2026MetaSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedChrome2026Meta().catch((err) => {
      console.error("[chrome2026MetaSeed] fatal", err);
    });
  });
}
