/**
 * Seed Events Migration Script
 * Migrates static card shows and comic cons data into the events database table
 * Run: npx tsx server/seedEvents.ts
 */

import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import the static data directly
import { ALL_SHOWS } from "../client/src/lib/cardShowsData";
import { comicConEvents } from "../client/src/lib/comicCons";

dotenv.config();

function esc(val: any): string {
  if (val === null || val === undefined) return "NULL";
  return "'" + String(val).replace(/'/g, "''").replace(/\\/g, "\\\\") + "'";
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const db = drizzle(dbUrl);

  // Check if events already exist
  const [existing] = await db.execute(sql`SELECT COUNT(*) as cnt FROM events`) as any;
  const count = existing.cnt;
  if (count > 0) {
    console.log(`Events table already has ${count} rows. Skipping seed.`);
    console.log("To re-seed, run: DELETE FROM events; first");
    process.exit(0);
  }

  console.log("Seeding events from static data files...");
  console.log(`  Card shows to import: ${ALL_SHOWS.length}`);
  console.log(`  Comic cons to import: ${comicConEvents.length}`);

  // Insert card shows in batches
  console.log("\nInserting card shows...");
  let cardShowInserted = 0;
  for (let i = 0; i < ALL_SHOWS.length; i += 50) {
    const batch = ALL_SHOWS.slice(i, i + 50);
    const values = batch.map((show, idx) => 
      `(${esc(show.name)}, 'card-show', NULL, ${esc(show.dateDisplay)}, ${esc(show.startDate)}, ${esc(show.endDate)}, ${show.month}, ${esc(show.venue)}, ${esc(show.address)}, ${esc(show.city)}, ${esc(show.state)}, ${esc(show.stateName)}, ${esc(show.hours)}, ${show.tableCount === null ? 'NULL' : show.tableCount}, ${esc(show.admission)}, ${show.isFree ? 1 : 0}, ${esc(show.email)}, ${esc(show.phone)}, ${esc(show.website)}, NULL, NULL, ${show.featured ? 1 : 0}, 0, 'seed', ${esc('seed-cs-' + (i + idx))}, NULL, 'approved')`
    ).join(",\n");
    
    await db.execute(sql.raw(
      `INSERT INTO events (name, eventType, tier, dateDisplay, startDate, endDate, month, venue, address, city, state, stateName, hours, tableCount, admission, isFree, email, phone, website, description, highlights, featured, recurring, source, sourceId, sourceUrl, eventStatus) VALUES ${values}`
    ));
    cardShowInserted += batch.length;
    process.stdout.write(`\r  Progress: ${cardShowInserted}/${ALL_SHOWS.length}`);
  }
  console.log(`\n  ✅ Inserted ${cardShowInserted} card shows`);

  // Insert comic cons in batches
  console.log("\nInserting comic cons...");
  let comicConInserted = 0;
  for (let i = 0; i < comicConEvents.length; i += 50) {
    const batch = comicConEvents.slice(i, i + 50);
    const values = batch.map((con, idx) => {
      const month = parseInt(con.startDate.split("-")[1]);
      const highlights = con.highlights ? JSON.stringify(con.highlights) : null;
      return `(${esc(con.name)}, ${esc(con.type || 'comic-con')}, ${con.tier || 'NULL'}, ${esc(con.dates)}, ${esc(con.startDate)}, ${esc(con.endDate)}, ${month}, NULL, NULL, ${esc(con.city)}, ${esc(con.stateAbbr)}, ${esc(con.state)}, NULL, NULL, NULL, NULL, NULL, NULL, ${esc(con.website || null)}, ${esc(con.description || null)}, ${esc(highlights)}, 0, ${con.recurring ? 1 : 0}, 'seed', ${esc('seed-cc-' + (i + idx))}, NULL, 'approved')`;
    }).join(",\n");
    
    await db.execute(sql.raw(
      `INSERT INTO events (name, eventType, tier, dateDisplay, startDate, endDate, month, venue, address, city, state, stateName, hours, tableCount, admission, isFree, email, phone, website, description, highlights, featured, recurring, source, sourceId, sourceUrl, eventStatus) VALUES ${values}`
    ));
    comicConInserted += batch.length;
    process.stdout.write(`\r  Progress: ${comicConInserted}/${comicConEvents.length}`);
  }
  console.log(`\n  ✅ Inserted ${comicConInserted} comic cons`);

  // Verify
  const [verify] = await db.execute(sql`SELECT COUNT(*) as cnt, 
    SUM(CASE WHEN eventType = 'card-show' THEN 1 ELSE 0 END) as cardShows,
    SUM(CASE WHEN eventType != 'card-show' THEN 1 ELSE 0 END) as comicCons,
    COUNT(DISTINCT state) as states
    FROM events`) as any;
  console.log(`\n✅ Seed complete!`);
  console.log(`  Total events: ${verify.cnt}`);
  console.log(`  Card shows: ${verify.cardShows}`);
  console.log(`  Comic cons: ${verify.comicCons}`);
  console.log(`  States: ${verify.states}`);

  process.exit(0);
}

main().catch(e => {
  console.error("Seed failed:", e);
  process.exit(1);
});
