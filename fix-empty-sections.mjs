import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
const conn = await mysql.createConnection(DATABASE_URL);

const CYBERPUNK_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom2099-cyberpunk-president-mBZk2vXKnQPifTMSSMYVZT.webp";

const [rows] = await conn.execute("SELECT contentMarkdown FROM articles WHERE slug = 'doompendance-day-doom-2099-president'");
let content = rows[0].contentMarkdown;

// Split by ## headings
const parts = content.split(/^(## .+)$/m);
// parts = [intro, "## heading1", body1, "## heading2", body2, ...]

let modified = parts[0]; // intro
for (let i = 1; i < parts.length; i += 2) {
  const heading = parts[i];
  const body = parts[i + 1] || '';
  
  const hasImg = body.includes('<img') || /!\[.*?\]\(.*?\)/.test(body);
  
  if (!hasImg) {
    // Add the cyberpunk image at the start of this section body
    const imgTag = `\n\n<img src="${CYBERPUNK_IMG}" alt="Doom 2099 — Cyberpunk President" style="max-width: 500px; width: 100%; border-radius: 8px; margin: 1.5rem auto; display: block;" />\n`;
    modified += heading + imgTag + body;
    console.log(`Added image to: ${heading.trim()}`);
  } else {
    modified += heading + body;
  }
}

await conn.execute(
  "UPDATE articles SET contentMarkdown = ? WHERE slug = ?",
  [modified, 'doompendance-day-doom-2099-president']
);

console.log("\n✅ Updated article with fallback images for empty sections");
await conn.end();
process.exit(0);
