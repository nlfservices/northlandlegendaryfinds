/**
 * Seed Events Migration Script
 * Migrates static card shows and comic cons data into the events database table
 * Run: node server/seedEvents.mjs
 */

import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// We'll read the static data files and parse them
// Since they're TypeScript, we'll extract the data manually

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const db = drizzle(dbUrl);

  // Check if events already exist
  const [existing] = await db.execute(sql`SELECT COUNT(*) as cnt FROM events`);
  const count = existing.cnt;
  if (count > 0) {
    console.log(`Events table already has ${count} rows. Skipping seed.`);
    console.log("To re-seed, run: DELETE FROM events; first");
    process.exit(0);
  }

  console.log("Seeding events from static data files...");

  // Parse card shows data
  const cardShowsPath = path.join(__dirname, "..", "client", "src", "lib", "cardShowsData.ts");
  const cardShowsContent = fs.readFileSync(cardShowsPath, "utf-8");
  
  // Extract the JSON array from the TypeScript file
  const showsMatch = cardShowsContent.match(/export const ALL_SHOWS:\s*CardShow\[\]\s*=\s*(\[[\s\S]*?\]);?\s*$/m);
  if (!showsMatch) {
    // Try a different approach - find the array start and parse it
    const arrayStart = cardShowsContent.indexOf("export const ALL_SHOWS");
    const bracketStart = cardShowsContent.indexOf("[", arrayStart);
    // Find the matching closing bracket
    let depth = 0;
    let bracketEnd = -1;
    for (let i = bracketStart; i < cardShowsContent.length; i++) {
      if (cardShowsContent[i] === "[") depth++;
      if (cardShowsContent[i] === "]") {
        depth--;
        if (depth === 0) {
          bracketEnd = i;
          break;
        }
      }
    }
    if (bracketEnd === -1) {
      console.error("Could not parse card shows data");
      process.exit(1);
    }
    var cardShowsJson = cardShowsContent.substring(bracketStart, bracketEnd + 1);
  } else {
    var cardShowsJson = showsMatch[1];
  }
  
  // Clean up the JSON (remove trailing commas, convert to valid JSON)
  cardShowsJson = cardShowsJson
    .replace(/\/\/.*$/gm, "") // Remove comments
    .replace(/,\s*([}\]])/g, "$1") // Remove trailing commas
    .replace(/(\w+):/g, '"$1":') // Quote keys
    .replace(/"null"/g, "null"); // Fix null values that got quoted

  let cardShows;
  try {
    cardShows = JSON.parse(cardShowsJson);
  } catch (e) {
    console.error("Failed to parse card shows JSON:", e.message);
    // Try eval as fallback (safe since we control the data)
    try {
      cardShows = eval(`(${cardShowsJson})`);
    } catch (e2) {
      console.error("Eval also failed:", e2.message);
      process.exit(1);
    }
  }
  console.log(`Parsed ${cardShows.length} card shows`);

  // Parse comic cons data
  const comicConsPath = path.join(__dirname, "..", "client", "src", "lib", "comicCons.ts");
  const comicConsContent = fs.readFileSync(comicConsPath, "utf-8");
  
  const consArrayStart = comicConsContent.indexOf("export const comicConEvents");
  const consBracketStart = comicConsContent.indexOf("[", consArrayStart);
  let consDepth = 0;
  let consBracketEnd = -1;
  for (let i = consBracketStart; i < comicConsContent.length; i++) {
    if (comicConsContent[i] === "[") consDepth++;
    if (comicConsContent[i] === "]") {
      consDepth--;
      if (consDepth === 0) {
        consBracketEnd = i;
        break;
      }
    }
  }
  
  let comicConsJson = comicConsContent.substring(consBracketStart, consBracketEnd + 1);
  // Clean up TypeScript-specific syntax
  comicConsJson = comicConsJson
    .replace(/\/\/.*$/gm, "") // Remove comments
    .replace(/,\s*([}\]])/g, "$1") // Remove trailing commas
    .replace(/(\w+)\s*:/g, '"$1":') // Quote keys
    .replace(/"(1|2|3|4)" as const/g, "$1"); // Remove "as const" type assertions

  let comicCons;
  try {
    comicCons = JSON.parse(comicConsJson);
  } catch (e) {
    console.error("Failed to parse comic cons JSON:", e.message);
    try {
      comicCons = eval(`(${comicConsJson})`);
    } catch (e2) {
      console.error("Eval also failed:", e2.message);
      process.exit(1);
    }
  }
  console.log(`Parsed ${comicCons.length} comic cons`);

  // Insert card shows
  console.log("Inserting card shows...");
  let cardShowInserted = 0;
  for (let i = 0; i < cardShows.length; i += 50) {
    const batch = cardShows.slice(i, i + 50).map(show => ({
      name: show.name,
      eventType: "card-show",
      tier: null,
      dateDisplay: show.dateDisplay,
      startDate: show.startDate,
      endDate: show.endDate,
      month: show.month,
      venue: show.venue || null,
      address: show.address || null,
      city: show.city,
      state: show.state,
      stateName: show.stateName || null,
      hours: show.hours || null,
      tableCount: show.tableCount || null,
      admission: show.admission || null,
      isFree: show.isFree || false,
      email: show.email || null,
      phone: show.phone || null,
      website: show.website || null,
      description: null,
      highlights: null,
      featured: show.featured || false,
      recurring: false,
      source: "seed",
      sourceId: `seed-cardshow-${i + cardShows.indexOf(show) - (i)}`,
      sourceUrl: null,
      status: "approved",
    }));
    
    await db.execute(sql.raw(
      `INSERT INTO events (name, eventType, tier, dateDisplay, startDate, endDate, month, venue, address, city, state, stateName, hours, tableCount, admission, isFree, email, phone, website, description, highlights, featured, recurring, source, sourceId, sourceUrl, eventStatus) VALUES ` +
      batch.map(e => 
        `(${esc(e.name)}, ${esc(e.eventType)}, ${e.tier === null ? 'NULL' : e.tier}, ${esc(e.dateDisplay)}, ${esc(e.startDate)}, ${esc(e.endDate)}, ${e.month}, ${esc(e.venue)}, ${esc(e.address)}, ${esc(e.city)}, ${esc(e.state)}, ${esc(e.stateName)}, ${esc(e.hours)}, ${e.tableCount === null ? 'NULL' : e.tableCount}, ${esc(e.admission)}, ${e.isFree ? 1 : 0}, ${esc(e.email)}, ${esc(e.phone)}, ${esc(e.website)}, ${esc(e.description)}, ${esc(e.highlights)}, ${e.featured ? 1 : 0}, ${e.recurring ? 1 : 0}, ${esc(e.source)}, ${esc(e.sourceId)}, ${esc(e.sourceUrl)}, ${esc(e.status)})`
      ).join(", ")
    ));
    cardShowInserted += batch.length;
    process.stdout.write(`\r  Card shows: ${cardShowInserted}/${cardShows.length}`);
  }
  console.log(`\n  ✅ Inserted ${cardShowInserted} card shows`);

  // Insert comic cons
  console.log("Inserting comic cons...");
  let comicConInserted = 0;
  for (let i = 0; i < comicCons.length; i += 50) {
    const batch = comicCons.slice(i, i + 50).map((con, idx) => ({
      name: con.name,
      eventType: con.type || "comic-con",
      tier: con.tier || null,
      dateDisplay: con.dates,
      startDate: con.startDate,
      endDate: con.endDate,
      month: parseInt(con.startDate.split("-")[1]),
      venue: null,
      address: null,
      city: con.city,
      state: con.stateAbbr || con.state,
      stateName: con.state || null,
      hours: null,
      tableCount: null,
      admission: null,
      isFree: null,
      email: null,
      phone: null,
      website: con.website || null,
      description: con.description || null,
      highlights: con.highlights ? JSON.stringify(con.highlights) : null,
      featured: false,
      recurring: con.recurring || false,
      source: "seed",
      sourceId: `seed-comiccon-${i + idx}`,
      sourceUrl: null,
      status: "approved",
    }));
    
    await db.execute(sql.raw(
      `INSERT INTO events (name, eventType, tier, dateDisplay, startDate, endDate, month, venue, address, city, state, stateName, hours, tableCount, admission, isFree, email, phone, website, description, highlights, featured, recurring, source, sourceId, sourceUrl, eventStatus) VALUES ` +
      batch.map(e => 
        `(${esc(e.name)}, ${esc(e.eventType)}, ${e.tier === null ? 'NULL' : e.tier}, ${esc(e.dateDisplay)}, ${esc(e.startDate)}, ${esc(e.endDate)}, ${e.month}, ${esc(e.venue)}, ${esc(e.address)}, ${esc(e.city)}, ${esc(e.state)}, ${esc(e.stateName)}, ${esc(e.hours)}, ${e.tableCount === null ? 'NULL' : e.tableCount}, ${esc(e.admission)}, ${e.isFree === null ? 'NULL' : (e.isFree ? 1 : 0)}, ${esc(e.email)}, ${esc(e.phone)}, ${esc(e.website)}, ${esc(e.description)}, ${esc(e.highlights)}, ${e.featured ? 1 : 0}, ${e.recurring ? 1 : 0}, ${esc(e.source)}, ${esc(e.sourceId)}, ${esc(e.sourceUrl)}, ${esc(e.status)})`
      ).join(", ")
    ));
    comicConInserted += batch.length;
    process.stdout.write(`\r  Comic cons: ${comicConInserted}/${comicCons.length}`);
  }
  console.log(`\n  ✅ Inserted ${comicConInserted} comic cons`);

  // Verify
  const [verify] = await db.execute(sql`SELECT COUNT(*) as cnt, 
    SUM(CASE WHEN eventType = 'card-show' THEN 1 ELSE 0 END) as cardShows,
    SUM(CASE WHEN eventType != 'card-show' THEN 1 ELSE 0 END) as comicCons,
    COUNT(DISTINCT state) as states
    FROM events`);
  console.log(`\n✅ Seed complete!`);
  console.log(`  Total events: ${verify.cnt}`);
  console.log(`  Card shows: ${verify.cardShows}`);
  console.log(`  Comic cons: ${verify.comicCons}`);
  console.log(`  States: ${verify.states}`);

  process.exit(0);
}

function esc(val) {
  if (val === null || val === undefined) return "NULL";
  return "'" + String(val).replace(/'/g, "''").replace(/\\/g, "\\\\") + "'";
}

main().catch(e => {
  console.error("Seed failed:", e);
  process.exit(1);
});
