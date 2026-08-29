/**
 * One-shot seed: official 2026 Topps Finest Fantastic Four hobby pull odds.
 * setId=60001 only (slug 2026-topps-finest-fantastic-four). Updates existing cards only.
 * Never writes imageUrl, backImageUrl, or characterName. Never inserts cards.
 *
 * Numeric base: BASE CARDS COMMON / UNCOMMON / RARE match sheet
 * "Base Cards - Common/Uncommon/Rare". Each tier has its own hobby rainbow.
 *
 * Inserts: exact live cardType vs sheet name only (case-insensitive, punctuation
 * stripped). No prefix matching — FF- is First Family and Future Foundation ID
 * Cards; FS- is Fantastic Science and Fantastic Science Autographs.
 *
 * Variations: TRIBUTE TO FINEST '96 is named on the sheet. 1960s BLACKLIGHT BASE
 * VARIATION and NEGATIVE ZONE BASE VARIATION are not exact sheet names — leave
 * parallels None and record their hobby rates in the set description.
 *
 * Garbled cardTypes (ÔÇÿ ÔÇÖ mojibake) are repaired to U+2019 when writing
 * cardType. Photos stay empty.
 *
 * Odds are pull odds, never prices. Parser keeps thousands commas tight
 * so "1:7,542" stays one token (middle-dot U+00B7). Hobby column only.
 *
 * Does not touch set 1, 2, 3, 4, 5, 6, 30001, 90001, 90002, 90003, 90004,
 * 90005, 90006, or 90007. Versioned in-memory once-flag so a bump re-runs
 * after a prior seed in this process. Must be started AFTER server.listen
 * so it never blocks bind.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const FINEST_FF_2026_SET_ID = 60001;
const CHROME_SET_ID = 1;
const CBH_SET_ID = 2;
const MINT_2025_SET_ID = 3;
const SAPPHIRE_SET_ID = 4;
const STUDIOS_SET_ID = 5;
const STUDIOS_SAPPHIRE_SET_ID = 6;
const COLLECTOR_SET_ID = 30001;
const FORBIDDEN_90001 = 90001;
const FORBIDDEN_90002 = 90002;
const DEADPOOL_2025_SET_ID = 90003;
const FORBIDDEN_90004 = 90004;
const CHROME_2026_SET_ID = 90005;
const MINT_2026_SET_ID = 90006;
const VAULT_SET_ID = 90007;

/** Bump when official 2026 Finest Fantastic Four hobby odds change so the seed re-runs. */
const SEED_VERSION = "finest-ff-2026-official-hobby-odds-v2";

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

/** Repair ÔÇÿ / ÔÇÖ (UTF-8 apostrophe/quotes misread as Windows-1252) to U+2019. */
function repairCardType(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/\u00D4\u00C7\u00FF/g, "\u2019")
    .replace(/\u00D4\u00C7\u00D6/g, "\u2019")
    .replace(/\u00D4\u00C7\u00B8/g, "\u2019")
    .replace(/[\u2018\u201B\u0091\u0092]/g, "\u2019");
}

function normType(value: string | null | undefined): string {
  return repairCardType(value)
    .toLowerCase()
    .replace(/[\u2018\u2019\u201B'`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const COMMON_PARALLELS = oddsLine([
  ["Common", "1:1"],
  ["Refractor", "1:5"],
  ["Blue Refractor", "1:51"],
  ["Green Refractor", "1:76"],
  ["Purple Refractor", "1:102"],
  ["Cosmic Ray Refractor", "1:117"],
  ["Gold Refractor", "1:152"],
  ["Orange Refractor", "1:304"],
  ["Black Refractor", "1:759"],
  ["Red Refractor", "1:1,515"],
  ["Superfractor", "1:7,542"],
]);

const UNCOMMON_PARALLELS = oddsLine([
  ["Uncommon", "1:2"],
  ["Refractor", "1:20"],
  ["Blue Refractor", "1:73"],
  ["Green Refractor", "1:110"],
  ["Purple Refractor", "1:145"],
  ["Cosmic Ray Refractor", "1:167"],
  ["Gold Refractor", "1:217"],
  ["Orange Refractor", "1:434"],
  ["Black Refractor", "1:1,084"],
  ["Red Refractor", "1:2,168"],
  ["Superfractor", "1:10,648"],
]);

const RARE_PARALLELS = oddsLine([
  ["Rare", "1:10"],
  ["Refractor", "1:100"],
  ["Blue Refractor", "1:169"],
  ["Green Refractor", "1:256"],
  ["Purple Refractor", "1:337"],
  ["Cosmic Ray Refractor", "1:389"],
  ["Gold Refractor", "1:506"],
  ["Orange Refractor", "1:1,012"],
  ["Black Refractor", "1:2,532"],
  ["Red Refractor", "1:5,028"],
  ["Superfractor", "1:24,134"],
]);

const TRIBUTE_PARALLELS = oddsLine([
  ["Base", "1:40"],
  ["Gold Refractor", "1:76"],
  ["Orange Refractor", "1:152"],
  ["Black Refractor", "1:380"],
  ["Red Refractor", "1:759"],
  ["Superfractor", "1:3,811"],
]);

const ADVERSARIES_FAMILY_PARALLELS = oddsLine([
  ["Base", "1:5"],
  ["Gold Refractor", "1:380"],
  ["Orange Refractor", "1:759"],
  ["Black Refractor", "1:1,896"],
  ["Red Refractor", "1:3,811"],
  ["Superfractor", "1:19,053"],
]);

const ALL_FOR_FOUR_PARALLELS = oddsLine([
  ["Base", "1:4,310"],
  ["Superfractor", "1:17,239"],
]);

const POWER_HOUR_PARALLELS = oddsLine([
  ["Base", "1:1,600"],
  ["Black Refractor", "1:3,811"],
  ["Red Refractor", "1:7,542"],
  ["Superfractor", "1:36,200"],
]);

const SCIENCE_TIMELINES_WG_PARALLELS = oddsLine([
  ["Base", "1:80"],
  ["Orange Refractor", "1:1,515"],
  ["Black Refractor", "1:3,811"],
  ["Red Refractor", "1:7,542"],
  ["Superfractor", "1:36,200"],
]);

const TOPPS_ORIGINALS_PARALLELS = oddsLine([
  ["Base", "1:320"],
  ["Orange Refractor", "1:1,515"],
  ["Black Refractor", "1:3,811"],
  ["Red Refractor", "1:7,542"],
  ["Superfractor", "1:36,200"],
]);

const DECADES_POSTERS_PARALLELS = oddsLine([
  ["Base", "1:400"],
  ["Superfractor", "1:51,715"],
]);

const FUTURE_FOUNDATION_PARALLELS = oddsLine([["Base", "1:583"]]);

const ASTONISHING_PARALLELS = oddsLine([
  ["Base", "1:160"],
  ["Orange Wave", "1:1,515"],
  ["Black Wave", "1:3,811"],
  ["Red Wave", "1:7,542"],
  ["Superfractor", "1:36,200"],
]);

const COMIC_EXCERPTS_PARALLELS = oddsLine([["Base", "1:1,232"]]);

const FINEST_AUTO_PARALLELS = oddsLine([
  ["Base", "1:59"],
  ["Green Refractor", "1:413"],
  ["Purple Refractor", "1:409"],
  ["Gold Refractor", "1:613"],
  ["Orange Refractor", "1:1,131"],
  ["Black Refractor", "1:2,828"],
  ["Red Refractor", "1:5,655"],
  ["Superfractor", "1:28,271"],
]);

const FANTASTIC_SCIENCE_AUTO_PARALLELS = oddsLine([
  ["Base", "1:138"],
  ["Orange Refractor", "1:1,226"],
  ["Black Refractor", "1:3,063"],
  ["Red Refractor", "1:6,126"],
  ["Superfractor", "1:30,627"],
]);

const SET_DESCRIPTION =
  "2026 Topps Finest Fantastic Four (Common / Uncommon / Rare base) with official hobby odds (Common Refractor 1:5, Blue 1:51, Superfractor 1:7,542; Rare 1:10). Inserts already on the page include First Family, All For Four, Clobberin' Time, Screen Moments, concept art, Finest autographs. Nearby hobby rates not mapped onto a live cardType: 1960s Blacklight Neon Blue Lava 1:26, Negative Zone Blue Kaleidoscope 1:26, Concept Art 1:5 (live type is The Fantastic Four: First Steps Concept Art), Comic Book Artist Autographs 1:39 (live type is Authentic Marvel Comic Book Artist Autographs), Finest Dual Autographs 1:1,194 (live type is Dual Autographs), Flame Throwers 1:160, Rock Stars 1:160. Odds only, never prices.";

const TYPE_PARALLELS: Record<string, string> = {
  "base cards common": COMMON_PARALLELS,
  "base cards uncommon": UNCOMMON_PARALLELS,
  "base cards rare": RARE_PARALLELS,
  "tribute to finest 96": TRIBUTE_PARALLELS,
  "adversaries": ADVERSARIES_FAMILY_PARALLELS,
  "clobberin time": ADVERSARIES_FAMILY_PARALLELS,
  "first family": ADVERSARIES_FAMILY_PARALLELS,
  "screen moments": ADVERSARIES_FAMILY_PARALLELS,
  "all for four": ALL_FOR_FOUR_PARALLELS,
  "power hour": POWER_HOUR_PARALLELS,
  "fantastic science": SCIENCE_TIMELINES_WG_PARALLELS,
  "finest timelines": SCIENCE_TIMELINES_WG_PARALLELS,
  "worlds greatest comic magazines": SCIENCE_TIMELINES_WG_PARALLELS,
  "topps originals": TOPPS_ORIGINALS_PARALLELS,
  "decades posters": DECADES_POSTERS_PARALLELS,
  "future foundation id cards": FUTURE_FOUNDATION_PARALLELS,
  "astonishing": ASTONISHING_PARALLELS,
  "comic excerpts silver surfer": COMIC_EXCERPTS_PARALLELS,
  "finest autographs": FINEST_AUTO_PARALLELS,
  "fantastic science autographs": FANTASTIC_SCIENCE_AUTO_PARALLELS,
};

let startedVersion: string | null = null;

function isLockedSet(setId: number): boolean {
  return (
    setId !== FINEST_FF_2026_SET_ID ||
    setId === CHROME_SET_ID ||
    setId === CBH_SET_ID ||
    setId === MINT_2025_SET_ID ||
    setId === SAPPHIRE_SET_ID ||
    setId === STUDIOS_SET_ID ||
    setId === STUDIOS_SAPPHIRE_SET_ID ||
    setId === COLLECTOR_SET_ID ||
    setId === FORBIDDEN_90001 ||
    setId === FORBIDDEN_90002 ||
    setId === DEADPOOL_2025_SET_ID ||
    setId === FORBIDDEN_90004 ||
    setId === CHROME_2026_SET_ID ||
    setId === MINT_2026_SET_ID ||
    setId === VAULT_SET_ID
  );
}

function metaForCard(
  _cardNumber: string,
  cardType: string | null | undefined
): { parallels: string } | null {
  const mapped = TYPE_PARALLELS[normType(cardType)];
  if (mapped) return { parallels: mapped };
  return null;
}

async function seedSetDescription(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(FINEST_FF_2026_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({ id: marvelSets.id, description: marvelSets.description })
    .from(marvelSets)
    .where(eq(marvelSets.id, FINEST_FF_2026_SET_ID));

  const allowed = rows.filter((row) => !isLockedSet(row.id));
  if (!allowed.length) return "skip: set 60001 not found";
  if (allowed[0].description === SET_DESCRIPTION) return "skip: description already set";

  await db
    .update(marvelSets)
    .set({ description: SET_DESCRIPTION })
    .where(eq(marvelSets.id, FINEST_FF_2026_SET_ID));
  return "attached set description";
}

async function seedExistingCards(): Promise<string> {
  const db = await getDb();
  if (!db) return "skip: database unavailable";
  if (isLockedSet(FINEST_FF_2026_SET_ID)) return "refuse: forbidden set";

  const rows = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, FINEST_FF_2026_SET_ID));

  let updated = 0;
  let skipped = 0;
  let baseUpdated = 0;
  let insertUpdated = 0;
  let typeRepaired = 0;

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

    const repairedType = repairCardType(row.cardType);
    const typeChanged = repairedType.length > 0 && repairedType !== (row.cardType ?? "");
    if (row.parallels === meta.parallels && !typeChanged) {
      skipped += 1;
      continue;
    }

    const patch: { parallels: string; cardType?: string } = { parallels: meta.parallels };
    if (typeChanged) {
      patch.cardType = repairedType;
      typeRepaired += 1;
    }

    await db
      .update(marvelCards)
      .set(patch)
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, FINEST_FF_2026_SET_ID)));
    updated += 1;
    const typeKey = normType(row.cardType);
    if (
      typeKey === "base cards common" ||
      typeKey === "base cards uncommon" ||
      typeKey === "base cards rare"
    ) {
      baseUpdated += 1;
    } else {
      insertUpdated += 1;
    }
  }

  return `updated ${updated} (base ${baseUpdated}, inserts ${insertUpdated}, cardType repaired ${typeRepaired}) skipped ${skipped}`;
}

async function seedFinestFF2026Meta(): Promise<void> {
  if (isLockedSet(FINEST_FF_2026_SET_ID)) {
    console.error("[finestFF2026MetaSeed] refuse: forbidden set");
    return;
  }

  console.log(
    `[finestFF2026MetaSeed] ${SEED_VERSION} starting setId=60001 (odds only, photos/characterName untouched, garbled cardType repaired, no new cards)`
  );

  try {
    const desc = await seedSetDescription();
    console.log(`[finestFF2026MetaSeed] set: ${desc}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[finestFF2026MetaSeed] set description error: ${message}`);
  }

  try {
    const cards = await seedExistingCards();
    console.log(`[finestFF2026MetaSeed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[finestFF2026MetaSeed] cards error: ${message}`);
  }

  console.log(`[finestFF2026MetaSeed] done version=${SEED_VERSION} setId=${FINEST_FF_2026_SET_ID}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startFinestFF2026MetaSeed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[finestFF2026MetaSeed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedFinestFF2026Meta().catch((err) => {
      console.error("[finestFF2026MetaSeed] fatal", err);
    });
  });
}
