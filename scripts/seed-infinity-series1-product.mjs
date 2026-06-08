/**
 * Seed NLF Infinity Series #1 as a proper database product with all 165 checklist items
 * This connects the static checklist page to the live pull tracking system
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { config } from "dotenv";
config();

const { drizzle } = await import("drizzle-orm/mysql2");
const mysql = await import("mysql2/promise");
const schema = await import("../drizzle/schema.js");
const { eq } = await import("drizzle-orm");

const { repackProducts, checklistItems } = schema;

const connection = await mysql.default.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

// ─── All 165 cards from the CSV ───────────────────────────────────────────────
const ALL_CARDS = [
  // TOPPS MARVEL MINT ENCASED - RAW (cards 1-43)
  { no: 1,  desc: "2025 TOPPS MARVEL MINT ENCASED #2 EXODUS 55/100 RAW" },
  { no: 2,  desc: "2025 TOPPS MARVEL MINT ENCASED #4 KILLMONGER 84/100 RAW" },
  { no: 3,  desc: "2025 TOPPS MARVEL MINT ENCASED #6 RED HULK 41/100 RAW" },
  { no: 4,  desc: "2025 TOPPS MARVEL MINT ENCASED #10 KATE BISHOP 97/100 RAW" },
  { no: 5,  desc: "2025 TOPPS MARVEL MINT ENCASED #12 SPIDER-MAN 2099 63/100 RAW" },
  { no: 6,  desc: "2025 TOPPS MARVEL MINT ENCASED #13 IRON MAN 2020 88/100 RAW" },
  { no: 7,  desc: "2025 TOPPS MARVEL MINT ENCASED #14 MOON KNIGHT 55/100 RAW" },
  { no: 8,  desc: "2025 TOPPS MARVEL MINT ENCASED #15 CAPTAIN AMERICA 2099 63/100 RAW" },
  { no: 9,  desc: "2025 TOPPS MARVEL MINT ENCASED #17 WOLVERINE 51/100 RAW" },
  { no: 10, desc: "2025 TOPPS MARVEL MINT ENCASED #18 DAREDEVIL 77/100 RAW" },
  { no: 11, desc: "2025 TOPPS MARVEL MINT ENCASED #19 STORM 91/100 RAW" },
  { no: 12, desc: "2025 TOPPS MARVEL MINT ENCASED #20 MAGNETO 72/100 RAW" },
  { no: 13, desc: "2025 TOPPS MARVEL MINT ENCASED #21 CYCLOPS 83/100 RAW" },
  { no: 14, desc: "2025 TOPPS MARVEL MINT ENCASED #22 JEAN GREY 41/100 RAW" },
  { no: 15, desc: "2025 TOPPS MARVEL MINT ENCASED #23 ROGUE 44/100 RAW" },
  { no: 16, desc: "2025 TOPPS MARVEL MINT ENCASED #24 GAMBIT 35/100 RAW" },
  { no: 17, desc: "2025 TOPPS MARVEL MINT ENCASED #25 PSYLOCKE 61/100 RAW" },
  { no: 18, desc: "2025 TOPPS MARVEL MINT ENCASED #26 BISHOP 78/100 RAW" },
  { no: 19, desc: "2025 TOPPS MARVEL MINT ENCASED #27 JUBILEE 89/100 RAW" },
  { no: 20, desc: "2025 TOPPS MARVEL MINT ENCASED #28 BEAST 92/100 RAW" },
  { no: 21, desc: "2025 TOPPS MARVEL MINT ENCASED #29 ARCHANGEL 47/100 RAW" },
  { no: 22, desc: "2025 TOPPS MARVEL MINT ENCASED #30 ICEMAN 56/100 RAW" },
  { no: 23, desc: "2025 TOPPS MARVEL MINT ENCASED #31 COLOSSUS 73/100 RAW" },
  { no: 24, desc: "2025 TOPPS MARVEL MINT ENCASED #32 NIGHTCRAWLER 82/100 RAW" },
  { no: 25, desc: "2025 TOPPS MARVEL MINT ENCASED #33 BANSHEE 90/100 RAW" },
  { no: 26, desc: "2025 TOPPS MARVEL MINT ENCASED #34 HAVOK 38/100 RAW" },
  { no: 27, desc: "2025 TOPPS MARVEL MINT ENCASED #35 POLARIS 49/100 RAW" },
  { no: 28, desc: "2025 TOPPS MARVEL MINT ENCASED #36 SUNFIRE 67/100 RAW" },
  { no: 29, desc: "2025 TOPPS MARVEL MINT ENCASED #37 THUNDERBIRD 74/100 RAW" },
  { no: 30, desc: "2025 TOPPS MARVEL MINT ENCASED #38 WOLVERINE GOLD /75 RAW" },
  { no: 31, desc: "2025 TOPPS MARVEL MINT ENCASED #39 CYCLOPS GOLD /75 RAW" },
  { no: 32, desc: "2025 TOPPS MARVEL MINT ENCASED #40 STORM GOLD /75 RAW" },
  { no: 33, desc: "2025 TOPPS MARVEL MINT ENCASED #41 MAGNETO GOLD /75 RAW" },
  { no: 34, desc: "2025 TOPPS MARVEL MINT ENCASED #42 JEAN GREY GOLD /75 RAW" },
  { no: 35, desc: "2025 TOPPS MARVEL MINT ENCASED #43 ROGUE GOLD /75 RAW" },
  { no: 36, desc: "2025 TOPPS MARVEL MINT ENCASED #44 GAMBIT GOLD /75 RAW" },
  { no: 37, desc: "2025 TOPPS MARVEL MINT ENCASED #45 PSYLOCKE GOLD /75 RAW" },
  { no: 38, desc: "2025 TOPPS MARVEL MINT ENCASED #46 BISHOP GOLD /75 RAW" },
  { no: 39, desc: "2025 TOPPS MARVEL MINT ENCASED #47 JUBILEE GOLD /75 RAW" },
  { no: 40, desc: "2025 TOPPS MARVEL MINT ENCASED #48 BEAST GOLD /75 RAW" },
  { no: 41, desc: "2025 TOPPS MARVEL MINT ENCASED #49 ICEMAN GOLD /50 RAW" },
  { no: 42, desc: "2025 TOPPS MARVEL MINT ENCASED #50 COLOSSUS GOLD /50 RAW" },
  { no: 43, desc: "2025 TOPPS MARVEL MINT ENCASED #51 NIGHTCRAWLER GOLD /50 RAW" },
  // TOPPS MARVEL THE COLLECTOR - RAW (cards 44-109)
  { no: 44, desc: "2025 TOPPS MARVEL THE COLLECTOR #1 IRON MAN RAW" },
  { no: 45, desc: "2025 TOPPS MARVEL THE COLLECTOR #2 CAPTAIN AMERICA RAW" },
  { no: 46, desc: "2025 TOPPS MARVEL THE COLLECTOR #3 THOR RAW" },
  { no: 47, desc: "2025 TOPPS MARVEL THE COLLECTOR #4 HULK RAW" },
  { no: 48, desc: "2025 TOPPS MARVEL THE COLLECTOR #5 BLACK WIDOW RAW" },
  { no: 49, desc: "2025 TOPPS MARVEL THE COLLECTOR #6 HAWKEYE RAW" },
  { no: 50, desc: "2025 TOPPS MARVEL THE COLLECTOR #7 SPIDER-MAN RAW" },
  { no: 51, desc: "2025 TOPPS MARVEL THE COLLECTOR #8 BLACK PANTHER RAW" },
  { no: 52, desc: "2025 TOPPS MARVEL THE COLLECTOR #9 DOCTOR STRANGE RAW" },
  { no: 53, desc: "2025 TOPPS MARVEL THE COLLECTOR #10 SCARLET WITCH RAW" },
  { no: 54, desc: "2025 TOPPS MARVEL THE COLLECTOR #11 VISION RAW" },
  { no: 55, desc: "2025 TOPPS MARVEL THE COLLECTOR #12 ANT-MAN RAW" },
  { no: 56, desc: "2025 TOPPS MARVEL THE COLLECTOR #13 WASP RAW" },
  { no: 57, desc: "2025 TOPPS MARVEL THE COLLECTOR #14 WAR MACHINE RAW" },
  { no: 58, desc: "2025 TOPPS MARVEL THE COLLECTOR #15 FALCON RAW" },
  { no: 59, desc: "2025 TOPPS MARVEL THE COLLECTOR #16 WINTER SOLDIER RAW" },
  { no: 60, desc: "2025 TOPPS MARVEL THE COLLECTOR #17 CAPTAIN MARVEL RAW" },
  { no: 61, desc: "2025 TOPPS MARVEL THE COLLECTOR #18 SHANG-CHI RAW" },
  { no: 62, desc: "2025 TOPPS MARVEL THE COLLECTOR #19 ETERNALS SERSI RAW" },
  { no: 63, desc: "2025 TOPPS MARVEL THE COLLECTOR #20 MOON KNIGHT RAW" },
  { no: 64, desc: "2025 TOPPS MARVEL THE COLLECTOR #21 MS. MARVEL RAW" },
  { no: 65, desc: "2025 TOPPS MARVEL THE COLLECTOR #22 SHE-HULK RAW" },
  { no: 66, desc: "2025 TOPPS MARVEL THE COLLECTOR #23 WOLVERINE RAW" },
  { no: 67, desc: "2025 TOPPS MARVEL THE COLLECTOR #24 CYCLOPS RAW" },
  { no: 68, desc: "2025 TOPPS MARVEL THE COLLECTOR #25 STORM RAW" },
  { no: 69, desc: "2025 TOPPS MARVEL THE COLLECTOR #26 JEAN GREY RAW" },
  { no: 70, desc: "2025 TOPPS MARVEL THE COLLECTOR #27 ROGUE RAW" },
  { no: 71, desc: "2025 TOPPS MARVEL THE COLLECTOR #28 GAMBIT RAW" },
  { no: 72, desc: "2025 TOPPS MARVEL THE COLLECTOR #29 MAGNETO RAW" },
  { no: 73, desc: "2025 TOPPS MARVEL THE COLLECTOR #30 DEADPOOL RAW" },
  { no: 74, desc: "2025 TOPPS MARVEL THE COLLECTOR #31 PSYLOCKE RAW" },
  { no: 75, desc: "2025 TOPPS MARVEL THE COLLECTOR #32 BISHOP RAW" },
  { no: 76, desc: "2025 TOPPS MARVEL THE COLLECTOR #33 JUBILEE RAW" },
  { no: 77, desc: "2025 TOPPS MARVEL THE COLLECTOR #34 BEAST RAW" },
  { no: 78, desc: "2025 TOPPS MARVEL THE COLLECTOR #35 ARCHANGEL RAW" },
  { no: 79, desc: "2025 TOPPS MARVEL THE COLLECTOR #36 ICEMAN RAW" },
  { no: 80, desc: "2025 TOPPS MARVEL THE COLLECTOR #37 COLOSSUS RAW" },
  { no: 81, desc: "2025 TOPPS MARVEL THE COLLECTOR #38 NIGHTCRAWLER RAW" },
  { no: 82, desc: "2025 TOPPS MARVEL THE COLLECTOR #39 DAREDEVIL RAW" },
  { no: 83, desc: "2025 TOPPS MARVEL THE COLLECTOR #40 PUNISHER RAW" },
  { no: 84, desc: "2025 TOPPS MARVEL THE COLLECTOR #41 GHOST RIDER RAW" },
  { no: 85, desc: "2025 TOPPS MARVEL THE COLLECTOR #42 BLADE RAW" },
  { no: 86, desc: "2025 TOPPS MARVEL THE COLLECTOR #43 SILVER SURFER RAW" },
  { no: 87, desc: "2025 TOPPS MARVEL THE COLLECTOR #44 GALACTUS RAW" },
  { no: 88, desc: "2025 TOPPS MARVEL THE COLLECTOR #45 DOCTOR DOOM RAW" },
  { no: 89, desc: "2025 TOPPS MARVEL THE COLLECTOR #46 THANOS RAW" },
  { no: 90, desc: "2025 TOPPS MARVEL THE COLLECTOR #47 LOKI RAW" },
  { no: 91, desc: "2025 TOPPS MARVEL THE COLLECTOR #48 RED SKULL RAW" },
  { no: 92, desc: "2025 TOPPS MARVEL THE COLLECTOR #49 ULTRON RAW" },
  { no: 93, desc: "2025 TOPPS MARVEL THE COLLECTOR #50 MODOK RAW" },
  { no: 94, desc: "2025 TOPPS MARVEL THE COLLECTOR #51 VENOM RAW" },
  { no: 95, desc: "2025 TOPPS MARVEL THE COLLECTOR #52 CARNAGE RAW" },
  { no: 96, desc: "2025 TOPPS MARVEL THE COLLECTOR #53 GREEN GOBLIN RAW" },
  { no: 97, desc: "2025 TOPPS MARVEL THE COLLECTOR #54 DOCTOR OCTOPUS RAW" },
  { no: 98, desc: "2025 TOPPS MARVEL THE COLLECTOR #55 SANDMAN RAW" },
  { no: 99, desc: "2025 TOPPS MARVEL THE COLLECTOR #56 ELECTRO RAW" },
  { no: 100, desc: "2025 TOPPS MARVEL THE COLLECTOR #57 VULTURE RAW" },
  { no: 101, desc: "2025 TOPPS MARVEL THE COLLECTOR #58 MYSTERIO RAW" },
  { no: 102, desc: "2025 TOPPS MARVEL THE COLLECTOR #59 SCORPION RAW" },
  { no: 103, desc: "2025 TOPPS MARVEL THE COLLECTOR #60 RHINO RAW" },
  { no: 104, desc: "2025 TOPPS MARVEL THE COLLECTOR #61 SHOCKER RAW" },
  { no: 105, desc: "2025 TOPPS MARVEL THE COLLECTOR #62 KINGPIN RAW" },
  { no: 106, desc: "2025 TOPPS MARVEL THE COLLECTOR #63 BULLSEYE RAW" },
  { no: 107, desc: "2025 TOPPS MARVEL THE COLLECTOR #64 TASKMASTER RAW" },
  { no: 108, desc: "2025 TOPPS MARVEL THE COLLECTOR #65 ABOMINATION RAW" },
  { no: 109, desc: "2025 TOPPS MARVEL THE COLLECTOR #66 LEADER RAW" },
  // GRADED SLABS (cards 110-164)
  { no: 110, desc: "2025 TOPPS MARVEL MINT #1-C IRON MAN 45/99 AGS 10" },
  { no: 111, desc: "2025 TOPPS MARVEL MINT #2-C CAPTAIN AMERICA 67/99 AGS 10" },
  { no: 112, desc: "2025 TOPPS MARVEL MINT #3-C THOR 23/99 CGC 10" },
  { no: 113, desc: "2025 TOPPS MARVEL MINT #4-C HULK 88/99 AGS 9.5" },
  { no: 114, desc: "2025 TOPPS MARVEL MINT #5-C BLACK WIDOW 12/99 AGS 9.5" },
  { no: 115, desc: "2025 TOPPS MARVEL MINT #6-C HAWKEYE 56/99 PSA 10" },
  { no: 116, desc: "2025 TOPPS MARVEL MINT #7-C SPIDER-MAN 34/99 CGC 9.5" },
  { no: 117, desc: "2025 TOPPS MARVEL MINT #8-C BLACK PANTHER 78/99 AGS 10" },
  { no: 118, desc: "2025 TOPPS MARVEL MINT #9-C DOCTOR STRANGE 91/99 AGS 9" },
  { no: 119, desc: "2025 TOPPS MARVEL MINT #10-C THOR 72/99 CGC 10" },
  { no: 120, desc: "2025 TOPPS MARVEL MINT ENCASED #1-C WOLVERINE 15/50 AGS 10" },
  { no: 121, desc: "2025 TOPPS MARVEL MINT ENCASED #2-C CYCLOPS 28/50 AGS 9.5" },
  { no: 122, desc: "2025 TOPPS MARVEL MINT ENCASED #3-C STORM 33/50 CGC 10" },
  { no: 123, desc: "2025 TOPPS MARVEL MINT ENCASED #4-C JEAN GREY 7/50 AGS 10" },
  { no: 124, desc: "2025 TOPPS MARVEL MINT ENCASED #5-C ROGUE 42/50 PSA 10" },
  { no: 125, desc: "2025 TOPPS MARVEL MINT ENCASED #6-C GAMBIT 19/50 AGS 9.5" },
  { no: 126, desc: "2025 TOPPS MARVEL MINT ENCASED #7-C MAGNETO 38/50 CGC 9.5" },
  { no: 127, desc: "2025 TOPPS MARVEL MINT ENCASED #8-C DEADPOOL 11/50 AGS 10" },
  { no: 128, desc: "2025 TOPPS MARVEL MINT ENCASED #9-C PSYLOCKE 46/50 AGS 9" },
  { no: 129, desc: "2025 TOPPS MARVEL MINT ENCASED #10-C BISHOP 25/50 PSA 9" },
  { no: 130, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD WOLVERINE 1/1 AGS AUTH" },
  { no: 131, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD SPIDER-MAN 1/1 AGS AUTH" },
  { no: 132, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD IRON MAN 1/1 CGC AUTH" },
  { no: 133, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD CAPTAIN AMERICA 1/1 AGS AUTH" },
  { no: 134, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD DEADPOOL 1/1 AGS AUTH" },
  { no: 135, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD STORM 1/1 AGS AUTH" },
  { no: 136, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD JEAN GREY 1/1 AGS AUTH" },
  { no: 137, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD ROGUE 1/1 AGS AUTH" },
  { no: 138, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD GAMBIT 1/1 AGS AUTH" },
  { no: 139, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD MAGNETO 1/1 AGS AUTH" },
  { no: 140, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD CYCLOPS 1/1 AGS AUTH" },
  { no: 141, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD PSYLOCKE 1/1 AGS AUTH" },
  { no: 142, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD BISHOP 1/1 AGS AUTH" },
  { no: 143, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD JUBILEE 1/1 AGS AUTH" },
  { no: 144, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD BEAST 1/1 AGS AUTH" },
  { no: 145, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD ARCHANGEL 1/1 AGS AUTH" },
  { no: 146, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD ICEMAN 1/1 AGS AUTH" },
  { no: 147, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD COLOSSUS 1/1 AGS AUTH" },
  { no: 148, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD NIGHTCRAWLER 1/1 AGS AUTH" },
  { no: 149, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD DAREDEVIL 1/1 AGS AUTH" },
  { no: 150, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD PUNISHER 1/1 AGS AUTH" },
  { no: 151, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD GHOST RIDER 1/1 AGS AUTH" },
  { no: 152, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD BLADE 1/1 AGS AUTH" },
  { no: 153, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD SILVER SURFER 1/1 AGS AUTH" },
  { no: 154, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD GALACTUS 1/1 AGS AUTH" },
  { no: 155, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD DOCTOR DOOM 1/1 AGS AUTH" },
  { no: 156, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD THANOS 1/1 AGS AUTH" },
  { no: 157, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD LOKI 1/1 AGS AUTH" },
  { no: 158, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD RED SKULL 1/1 AGS AUTH" },
  { no: 159, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD ULTRON 1/1 AGS AUTH" },
  { no: 160, desc: "2025 TOPPS MARVEL MINT ENCASED SKETCH CARD VENOM 1/1 AGS AUTH" },
  { no: 161, desc: "2025 TOPPS MARVEL MINT #10-C THOR 72/99 CGC 10" },
  { no: 162, desc: "2025 TOPPS MARVEL MINT SILVER FOIL #104 CAPTAIN AMERICA 29/99 AGS 8" },
  { no: 163, desc: "2025 TOPPS MARVEL MINT SILVER FOIL #113 BLACK WIDOW 74/99 AGS 9" },
  { no: 164, desc: "2025 TOPPS MARVEL MINT SILVER FOIL #11 DAREDEVIL 14/99 AGS 9.5" },
  // PLATINUM REFRACTOR (card 165)
  { no: 165, desc: "2025 TOPPS MARVEL MINT ENCASED PLATINUM REFRACTOR #119 GAMBIT 10/25 AGS 9.5" },
];

// Parse card description into structured fields
function parseCard(no, desc) {
  const upper = desc.toUpperCase();
  
  // Determine tier
  let tier = "base";
  if (desc.includes("1/1") || desc.includes("SKETCH CARD") || desc.includes("PLATINUM REFRACTOR")) {
    tier = "chase";
  } else if (desc.includes("AGS 10") || desc.includes("CGC 10") || desc.includes("PSA 10") || 
             desc.includes("AGS 9.5") || desc.includes("CGC 9.5") || desc.includes("PSA 9")) {
    tier = "hit";
  } else if (desc.includes("GOLD /75") || desc.includes("GOLD /50")) {
    tier = "hit";
  }
  
  // Determine condition
  let cardCondition = "RAW";
  if (desc.includes("AGS 10")) cardCondition = "AGS 10";
  else if (desc.includes("AGS 9.5")) cardCondition = "AGS 9.5";
  else if (desc.includes("AGS 9")) cardCondition = "AGS 9";
  else if (desc.includes("AGS 8")) cardCondition = "AGS 8";
  else if (desc.includes("AGS AUTH")) cardCondition = "AGS AUTH";
  else if (desc.includes("CGC 10")) cardCondition = "CGC 10";
  else if (desc.includes("CGC 9.5")) cardCondition = "CGC 9.5";
  else if (desc.includes("PSA 10")) cardCondition = "PSA 10";
  else if (desc.includes("PSA 9")) cardCondition = "PSA 9";
  
  // Extract card set
  let cardSet = "2025 Topps Marvel";
  if (desc.includes("MINT ENCASED PLATINUM REFRACTOR")) cardSet = "2025 Topps Marvel Mint Encased Platinum Refractor";
  else if (desc.includes("MINT ENCASED SKETCH")) cardSet = "2025 Topps Marvel Mint Encased Sketch";
  else if (desc.includes("MINT ENCASED")) cardSet = "2025 Topps Marvel Mint Encased";
  else if (desc.includes("MINT SILVER FOIL")) cardSet = "2025 Topps Marvel Mint Silver Foil";
  else if (desc.includes("MINT #")) cardSet = "2025 Topps Marvel Mint";
  else if (desc.includes("THE COLLECTOR")) cardSet = "2025 Topps Marvel The Collector";
  
  // Extract card number
  const numMatch = desc.match(/#([\w-]+)/);
  const cardNumber = numMatch ? numMatch[1] : String(no);
  
  // Extract parallel/print run
  let parallel = null;
  const printMatch = desc.match(/(\d+\/\d+)/);
  if (printMatch) parallel = printMatch[1];
  if (desc.includes("GOLD /75")) parallel = "Gold /75";
  if (desc.includes("GOLD /50")) parallel = "Gold /50";
  if (desc.includes("PLATINUM REFRACTOR")) parallel = "Platinum Refractor";
  if (desc.includes("SILVER FOIL")) parallel = "Silver Foil";
  if (desc.includes("1/1")) parallel = "1/1";
  
  // Extract character name (the main subject)
  // Remove the set prefix and card number, get the character
  let cardName = desc;
  cardName = cardName.replace(/^2025 TOPPS MARVEL MINT ENCASED PLATINUM REFRACTOR #[\w-]+ /, "");
  cardName = cardName.replace(/^2025 TOPPS MARVEL MINT ENCASED SKETCH CARD /, "");
  cardName = cardName.replace(/^2025 TOPPS MARVEL MINT ENCASED #[\w-]+ /, "");
  cardName = cardName.replace(/^2025 TOPPS MARVEL MINT SILVER FOIL #[\w-]+ /, "");
  cardName = cardName.replace(/^2025 TOPPS MARVEL MINT #[\w-]+ /, "");
  cardName = cardName.replace(/^2025 TOPPS MARVEL THE COLLECTOR #[\w-]+ /, "");
  // Remove trailing print run, grade, condition
  cardName = cardName.replace(/\s+\d+\/\d+.*$/, "");
  cardName = cardName.replace(/\s+(RAW|AGS \d+[\.\d]*|CGC \d+[\.\d]*|PSA \d+[\.\d]*|AGS AUTH).*$/, "");
  cardName = cardName.replace(/\s+(GOLD|PLATINUM REFRACTOR|SILVER FOIL).*$/, "");
  cardName = cardName.trim();
  // Title case
  cardName = cardName.split(" ").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
  
  return {
    cardName,
    cardSet,
    cardYear: "2025",
    cardNumber,
    parallel,
    tier,
    cardCondition,
    sortOrder: no,
    isPulled: false,
  };
}

async function main() {
  console.log("🚀 Seeding NLF Infinity Series #1...");
  
  // Check if product already exists
  const existing = await db.select().from(repackProducts)
    .where(eq(repackProducts.slug, "nlf-infinity-series-1"));
  
  let productId;
  
  if (existing.length > 0) {
    productId = existing[0].id;
    console.log(`✅ Product already exists with ID ${productId}, updating checklist items...`);
    // Delete existing checklist items to re-seed fresh
    const { sql } = await import("drizzle-orm");
    await db.delete(checklistItems).where(eq(checklistItems.productId, productId));
    console.log("🗑️  Cleared existing checklist items");
  } else {
    // Create the product
    const [result] = await db.insert(repackProducts).values({
      name: "NLF Infinity Series #1",
      slug: "nlf-infinity-series-1",
      description: "165-card sealed set featuring Topps Marvel Mint Encased, The Collector, and graded slabs. Finalized on 5/27/2026. Available exclusively on Whatnot.",
      totalPacks: 165,
      packsRemaining: 165,
      category: "marvel",
      status: "active",
      isWhatnotExclusive: true,
      whatnotSeriesName: "NLF Infinity Series #1",
      checklistFinalizedAt: new Date("2026-05-27"),
      checklistStatement: "Individual items in this series have been sealed and will not be changed.",
      sortOrder: 100,
    });
    productId = result.insertId;
    console.log(`✅ Created product with ID ${productId}`);
  }
  
  // Insert all 165 checklist items
  const items = ALL_CARDS.map(({ no, desc }) => ({
    productId,
    ...parseCard(no, desc),
  }));
  
  // Insert in batches of 50
  for (let i = 0; i < items.length; i += 50) {
    const batch = items.slice(i, i + 50);
    await db.insert(checklistItems).values(batch);
    console.log(`  Inserted cards ${i + 1}–${Math.min(i + 50, items.length)}`);
  }
  
  console.log(`\n✅ Done! Seeded ${items.length} checklist items for NLF Infinity Series #1 (product ID: ${productId})`);
  console.log(`\n📋 Tier breakdown:`);
  const chase = items.filter(i => i.tier === "chase").length;
  const hit = items.filter(i => i.tier === "hit").length;
  const base = items.filter(i => i.tier === "base").length;
  console.log(`  Chase: ${chase} | Hit: ${hit} | Base: ${base}`);
  
  await connection.end();
}

main().catch(e => { console.error(e); process.exit(1); });
