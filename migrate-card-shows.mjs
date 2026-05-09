/**
 * Migration script: Move card shows from static cardShowsData.ts into the database
 * Run with: node migrate-card-shows.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

// Parse the static data file to extract the shows array
const dataFile = readFileSync(resolve('./client/src/lib/cardShowsData.ts'), 'utf-8');

// Extract the ALL_SHOWS array content
const arrayMatch = dataFile.match(/export const ALL_SHOWS: CardShow\[\] = (\[[\s\S]*?\n\];)/);
if (!arrayMatch) {
  console.error('Could not find ALL_SHOWS array in cardShowsData.ts');
  process.exit(1);
}

// Parse the JSON-like array (it's valid JSON since the data uses double quotes)
const rawArray = arrayMatch[1].replace(/;\s*$/, '');
let shows;
try {
  shows = JSON.parse(rawArray);
} catch (e) {
  console.error('Failed to parse shows array:', e.message);
  process.exit(1);
}

console.log(`Found ${shows.length} shows to migrate`);

// Generate SEO-friendly slugs with city and state
function generateSlug(show) {
  const parts = [
    show.city.toLowerCase(),
    show.state.toLowerCase(),
    show.name.toLowerCase()
  ];
  return parts
    .join('-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 490);
}

// Determine if a show is past (before today)
function getStatus(show) {
  const today = new Date().toISOString().split('T')[0];
  if (show.endDate < today) return 'past';
  return 'upcoming';
}

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL + '&ssl={"rejectUnauthorized":true}');
  
  console.log('Connected to database');
  
  // Check if table already has data
  const [existing] = await connection.execute('SELECT COUNT(*) as count FROM card_shows');
  if (existing[0].count > 0) {
    console.log(`Table already has ${existing[0].count} rows. Skipping migration.`);
    await connection.end();
    return;
  }

  // Track slugs to avoid duplicates
  const usedSlugs = new Set();
  
  // Insert in batches of 50
  const batchSize = 50;
  let inserted = 0;
  
  for (let i = 0; i < shows.length; i += batchSize) {
    const batch = shows.slice(i, i + batchSize);
    
    const values = [];
    const placeholders = [];
    
    for (const show of batch) {
      let slug = generateSlug(show);
      // Ensure unique slug
      let suffix = 1;
      let originalSlug = slug;
      while (usedSlugs.has(slug)) {
        slug = `${originalSlug}-${suffix}`;
        suffix++;
      }
      usedSlugs.add(slug);
      
      const status = getStatus(show);
      
      placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      values.push(
        show.name,
        slug,
        show.dateDisplay,
        show.startDate,
        show.endDate,
        show.month,
        show.venue || null,
        show.address || null,
        (show.city || '').slice(0, 250),
        show.state,
        show.stateName,
        show.hours || null,
        show.tableCount || null,
        show.admission || null,
        show.isFree || false,
        show.email || null,
        show.phone || null,
        show.website || null,
        show.featured || false
      );
    }
    
    const sql = `INSERT INTO card_shows (name, slug, dateDisplay, startDate, endDate, month, venue, address, city, state, stateName, hours, tableCount, admission, isFree, email, phone, website, featured) VALUES ${placeholders.join(', ')}`;
    
    await connection.execute(sql, values);
    inserted += batch.length;
    console.log(`Inserted ${inserted}/${shows.length} shows`);
  }
  
  // Now update status for past shows
  const today = new Date().toISOString().split('T')[0];
  const [updateResult] = await connection.execute(
    'UPDATE card_shows SET show_status = ? WHERE endDate < ?',
    ['past', today]
  );
  console.log(`Marked ${updateResult.affectedRows} shows as "past"`);
  
  console.log(`\nMigration complete! ${inserted} shows inserted.`);
  await connection.end();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
