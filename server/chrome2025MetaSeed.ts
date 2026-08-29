/**
 * One-shot seed: official 2025 Topps Marvel Chrome hobby pull odds.
 * setId=1 only (slug 2025-topps-chrome). Updates existing cards only.
 * Never writes imageUrl or backImageUrl. Never inserts cards.
 *
 * Numeric Base (cardType Base, cardNumber 1-200 that already exist; live
 * is 197, not 200): replace the fake "/399, /299, ..." list with named
 * hobby odds. Skip numbers that do not exist.
 *
 * Inserts: match existing rows by cardNumber prefix (MA-, MI-, FS-, ...).
 * Does not add facsimile / auto / sketch / relic cards that are not already
 * in the DB. Leave unmatched existing inserts as-is.
 *
 * Odds are pull odds, never prices. Parser keeps thousands commas tight
 * so "1:3,303" stays one token (middle-dot U+00B7).
 *
 * Does not touch set 2 (CBH), 3 (Mint 2025), 4 (Sapphire), 5 (Chrome Studios),
 * or 90006. Versioned in-memory once-flag so a bump re-runs after a prior
 * seed in this process. Must be started AFTER server.listen so it never
 * blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const CHROME_SET_ID = 1;
const CBH_SET_ID = 2;
const MINT_2025_SET_ID = 3;
const SAPPHIRE_SET_ID = 4;
const STUDIOS_SET_ID = 5;
const FORBIDDEN_SET_ID = 90006;

/** Bump when official Chrome hobby odds change so the seed re-runs. */
const SEED_VERSION = "chrome-2025-official-hobby-odds-v1";

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

const BASE_PARALLELS = oddsLine([
  ["Refractor", "1:2"],
  ["Spider Web Refractor /399", "1:13"],
  ["Blue Refractor /299", "1:17"],
  ["Blue and Green Shimmer /199", "1:25"],
  ["Iron Man Red and Gold Lazer /100", "1:40"],
  ["Hulk Green Lazer /99", "1:40"],
  ["Purple Shimmer /75", "1:45"],
  ["Blue and Red Spider Web Refractor /62", "1:54"],
  ["Gold Wave /50", "1:66"],
  ["Rose Gold Mini Diamonds /40", "1:79"],
  ["Human Torch Refractor /39", "1:85"],
  ["Orange Refractor /25", "1:126"],
  ["Black Refractor /10", "1:347"],
  ["Red Shimmer /5", "1:629"],
  ["Red Wave /5", "1:835"],
  ["Superfractor 1/1", "1:3,303"],
  ["Clawed Chrome Variation Stainless Steel /20", "1:157"],
  ["Clawed Chrome Variation Black Stainless Steel /10", "1:315"],
  ["Clawed Chrome Variation Red Stainless Steel /5", "1:629"],
  ["Clawed Chrome Variation Superfractor 1/1", "1:3,147"],
]);

const MA_PARALLELS = oddsLine([
  ["Base", "5 per box"],
  ["Gold Wave /50", "1:602"],
  ["Orange Refractor /25", "1:839"],
  ["Black Refractor /10", "1:2,395"],
  ["Red Wave /5", "1:4,588"],
  ["Superfractor 1/1", "1:24,042"],
]);

const MI_PARALLELS = oddsLine([
  ["Base", "2 per box"],
  ["Gold Wave /50", "1:1,408"],
  ["Orange Refractor /25", "1:2,515"],
  ["Black Refractor /10", "1:6,830"],
  ["Red Wave /5", "1:13,357"],
  ["Superfractor 1/1", "1:66,784"],
]);

const FS_PARALLELS = oddsLine([
  ["Base", "1 per box"],
  ["Gold Wave /50", "1:1,849"],
  ["Orange Refractor /25", "1:3,147"],
  ["Black Refractor /10", "1:9,247"],
  ["Red Wave /5", "1:18,783"],
  ["Superfractor 1/1", "1:85,865"],
]);

const XM_PARALLELS = oddsLine([
  ["Base", "1 per box"],
  ["Gold Wave /50", "1:1,441"],
  ["Orange Refractor /25", "1:2,514"],
  ["Black Refractor /10", "1:7,420"],
  ["Red Wave /5", "1:15,026"],
  ["Superfractor 1/1", "1:66,784"],
]);

const AV_PARALLELS = oddsLine([
  ["Base", "1 per box"],
  ["Gold Wave /50", "1:1,502"],
  ["Orange Refractor /25", "1:2,514"],
  ["Black Refractor /10", "1:7,513"],
  ["Red Wave /5", "1:14,659"],
  ["Superfractor 1/1", "1:66,784"],
]);

const GA_PARALLELS = oddsLine([
  ["Gold Wave /50", "1:3,556"],
  ["Superfractor 1/1", "1:150,264"],
]);

const AI_PARALLELS = oddsLine([
  ["Mini Diamonds /20", "1:6,678"],
  ["Black Refractor /10", "1:12,266"],
  ["Red Wave /5", "1:24,042"],
  ["Superfractor 1/1", "1:100,176"],
]);

const TP_PARALLELS = oddsLine([
  ["Mini Diamonds /20", "1:7,513"],
  ["Black Refractor /10", "1:15,026"],
  ["Red Wave /5", "1:30,052"],
  ["Superfractor 1/1", "1:120,211"],
]);

const I_PARALLELS = oddsLine([
  ["Black Lazer /10", "1:7,071"],
  ["Red Lazer /5", "1:15,026"],
  ["Superfractor 1/1", "1:66,784"],
]);

const TS_PARALLELS = oddsLine([
  ["Mini Diamonds /20", "1:35,356"],
  ["Black Refractor /10", "1:66,784"],
  ["Red Wave /5", "1:120,211"],
  ["Superfractor 1/1", "1:601,056"],
]);

const CC_PARALLELS = oddsLine([
  ["Mini Diamonds /20", "1:3,146"],
  ["Black Refractor /10", "1:6,326"],
  ["Red Wave /5", "1:12,522"],
  ["Superfractor 1/1", "1:60,105"],
]);

const AM_PARALLELS = oddsLine([
  ["Mini Diamonds /20", "1:3,146"],
  ["Black Refractor /10", "1:6,326"],
  ["Red Wave /5", "1:12,522"],
  ["Superfractor 1/1", "1:60,105"],
]);

const NC_PARALLELS = oddsLine([
  ["Mini Diamonds /20", "1:6,326"],
  ["Black Refractor /10", "1:12,522"],
  ["Red Wave /5", "1:25,044"],
  ["Superfractor 1/1", "1:120,211"],
]);

const GR_PARALLELS = NC_PARALLELS;

const MR_PARALLELS = oddsLine([
  ["Refractor", "1:925"],
  ["Kaleidoscope /25", "1:5,050"],
  ["Shimmer /10", "1:12,522"],
  ["Raywave /5", "1:25,044"],
  ["Superfractor + Scodix 1/1", "1:120,211"],
]);

const TO_PARALLELS = oddsLine([["Superfractor 1/1", "1:150,264"]]);

const IM_PARALLELS = oddsLine([
  ["Base", "1 per value box"],
  ["Gold Wave /50", "1:2,368"],
  ["Orange Lava /25", "1:4,727"],
  ["Black Refractor /10", "1:11,892"],
  ["Red Wave /5", "1:23,537"],
  ["Superfractor 1/1", "1:112,980"],
]);

const GL_PARALLELS = oddsLine([
  ["Base", "1:280"],
  ["Gold Wave /50", "1:2,368"],
  ["Orange Lava /25", "1:4,727"],
  ["Black Refractor /10", "1:11,892"],
  ["Red Wave /5", "1:23,537"],
  ["Superfractor 1/1", "1:112,980"],
]);

const AR_PARALLELS = oddsLine([
  ["Gold Wave /50", "1:12,266"],
  ["Orange Refractor /25", "1:25,044"],
  ["Black Refractor /10", "1:60,105"],
  ["Red Wave /5", "1:120,211"],
  ["Superfractor 1/1", "1:601,056"],
]);

const MZ_PARALLELS = oddsLine([
  ["Gold Wave /50", "1:12,522"],
  ["Orange Refractor /25", "1:25,044"],
  ["Black Refractor /10", "1:60,105"],
  ["Red Wave /5", "1:120,211"],
  ["Superfractor 1/1", "1:601,056"],
]);

const XGS_PARALLELS = oddsLine([
  ["X-Fractor /50", "1:12,522"],
  ["Gold Wave /50", "1:12,522"],
  ["Orange Refractor /25", "1:25,044"],
  ["Black Refractor /10", "1:60,105"],
  ["Red Wave /5", "1:120,211"],
  ["Superfractor 1/1", "1:601,056"],
]);

const SET_DESCRIPTION =
  "200-card 2025 Topps Marvel Chrome base with official hobby pull odds: Refractor 1:2, Spider Web Refractor /399 1:13, through Superfractor 1/1 1:3,303, plus Clawed Chrome hobby variations (Stainless Steel /20 1:157 through Superfractor 1/1 1:3,147). Hobby inserts on this page include Marvel Anniversaries (5 per box), Marvel Icons (2 per box), and Future Stars, X-Men Giant-Size 50th, and New Avengers 20th (1 per box). Value-box exclusives: Yellow Lava Refractor (2 per value box), Orange Lava /25, Iron Man Gold, and Galactic Legends. Artist/writer autographs 1:439, Black Foil Sketch 1:1,525, Frank Miller Originals 1:12,522.";

const TS_CARD_TYPE = "60 YEARS OF S.H.I.E.L.D.";
const NC_CARD_TYPE = "50 YEARS OF NIGHTCRAWLER";
const GR_CARD_TYPE = "35 YEARS OF GHOST RIDER";

let startedVersion: string | null = null;

function isLockedSet(setId: number): boolean {
  return (
    setId !== CHROME_SET_ID ||
    setId === CBH_SET_ID ||
    setId === MINT_2025_SET_ID ||
    setId === SAPPHIRE_SET_ID ||
    setId === STUDIOS_SET_ID ||
    setId === FORBIDDEN_SET_ID
  );
}

function numberPrefix(cardNumber: string): string | null {
  const match = cardNumber.match(/^([A-Za-z]+)-\d+$/);
  return match ? match[1].toUpperCase() : null;
}

function metaForCard(
  cardNumber: string,
  cardType: string | null | undefined
): { parallels: string; cardType?: string } | null {
  if (/^\d+$/.test(cardNumber) && cardType === "Base") {
    const n = parseInt(cardNumber, 10);
    if (n >= 1 && n <= 200) return { parallels: BASE_PARALLELS };
    return null;
  }

  const prefix = numberPrefix(cardNumber);
  if (prefix === "MA") return { parallels: MA_PARALLELS };
  if (prefix === "MI") return { parallels: MI_PARALLELS };
  if (prefix === "FS") return { parallels: FS_PARALLELS };
  if (prefix === "XM") return { parallels: XM_PARALLELS };
  if (prefix === "AV") return { parallels: AV_PARALLELS };
  if (prefix === "GA") return { parallels: GA_PARALLELS };
  if (prefix === "AI") return { parallels: AI_PARALLELS };
  if (prefix === "TP") return { parallels: TP_PARALLELS };
  if (prefix === "I") return { parallels: I_PARALLELS };
  if (prefix === "TS") return { parallels: TS_PARALLELS, cardType: TS_CARD_TYPE };
  if (prefix === "CC") return { parallels: CC_PARALLELS };
  if (prefix === "AM") return { parallels: AM_PARALLELS };
  if (prefix === "NC") return { parallels: NC_PARALLELS, cardType: NC_CARD_TYPE };
  if (prefix === "GR") return { parallels: GR_PARALLELS, cardType: GR_CARD_TYPE };
  if (prefix === "MR") return { parallels: MR_PARALLELS };
  if (prefix === "TO") return { parallels: TO_PARALLELS };
  if (prefix === "IM") return { parallels: IM_PARALLELS };
  if (prefix === "GL") return { parallels: GL_PARALLELS };
  if (prefix === "AR") return { parallels: AR_PARALLELS };
  if (prefix === "MZ") return { parallels: MZ_PARALLELS };
  if (prefix === "XGS") return { parallels: XGS_PARALLELS };
  return null;
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(CHROME_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, CHROME_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 1 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, CHROME_SET_ID));
  return "attached set description";
}

async function seedExistingCards(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(CHROME_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, CHROME_SET_ID));

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

    const patch: { parallels?: string; cardType?: string } = {};
    if (row.parallels !== meta.parallels) patch.parallels = meta.parallels;
    if (meta.cardType && row.cardType !== meta.cardType) patch.cardType = meta.cardType;
    if (Object.keys(patch).length === 0) {
      skipped += 1;
      continue;
    }

    await db
      .update(marvelCards)
      .set(patch)
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, CHROME_SET_ID)));
    updated += 1;
    if (/^\d+$/.test(row.cardNumber) && row.cardType === "Base") baseUpdated += 1;
    else insertUpdated += 1;
  }

  return `updated ${updated} (base ${baseUpdated}, inserts ${insertUpdated}) skipped ${skipped}`;
}

async function seedChrome2025Meta(): Promise<void> {
  if (isLockedSet(CHROME_SET_ID)) {
    console.error("[chrome2025MetaSeed] refuse: forbidden set");
    return;
  }

  console.log(
    `[chrome2025MetaSeed] ${SEED_VERSION} starting setId=1 (odds only, photos untouched, no new cards)`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[chrome2025MetaSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[chrome2025MetaSeed] set description error: ${message}`);
  }

  try {
    const cards = await seedExistingCards();
    console.log(`[chrome2025MetaSeed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[chrome2025MetaSeed] cards error: ${message}`);
  }

  console.log(`[chrome2025MetaSeed] done version=${SEED_VERSION} setId=${CHROME_SET_ID}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startChrome2025MetaSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[chrome2025MetaSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedChrome2025Meta().catch((err) => {
      console.error("[chrome2025MetaSeed] fatal", err);
    });
  });
}
