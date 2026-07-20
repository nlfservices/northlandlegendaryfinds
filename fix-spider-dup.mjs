/**
 * Remove duplicate Spider-Man caption and any other duplicate captions
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 5040001");

let content = rows[0].contentMarkdown;

// Find Spider-Man duplicate caption - the standalone one says "set theme" vs "Marvel Mint theme"
// First occurrence (inside div): "Spider-Man Red Refractor /5 — CGC 8.5. The 2026 Marvel Mint theme revealed at SDCC."
// Second occurrence (standalone): "Spider-Man Red Refractor /5 — CGC 8.5. The 2026 set theme revealed at SDCC."

// Remove the standalone duplicate paragraph
const spiderDup = `\n<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;">Spider-Man Red Refractor /5 — CGC 8.5. The 2026 set theme revealed at SDCC.</p>\n</div>`;
if (content.includes(spiderDup)) {
  content = content.replace(spiderDup, '');
  console.log('✓ Removed Spider-Man duplicate caption (styled paragraph)');
} else {
  // Try other patterns
  const spiderDup2 = `\nSpider-Man Red Refractor /5 — CGC 8.5. The 2026 set theme revealed at SDCC.\n`;
  if (content.includes(spiderDup2)) {
    content = content.replace(spiderDup2, '\n');
    console.log('✓ Removed Spider-Man duplicate caption (plain text)');
  } else {
    // Search for it
    const idx = content.indexOf('The 2026 set theme revealed at SDCC');
    if (idx > -1) {
      console.log('Found at position', idx);
      console.log('Context:', JSON.stringify(content.substring(idx - 100, idx + 100)));
    } else {
      console.log('Spider-Man duplicate not found - checking markdown text');
      // Check for "Spider-Man Red Refractor" occurrences
      const matches = content.match(/Spider-Man Red Refractor/g);
      console.log(`"Spider-Man Red Refractor" occurrences: ${matches ? matches.length : 0}`);
    }
  }
}

// Check for Gambit duplicate
const gambitMatches = content.match(/Gambit — 2025 Topps Marvel Mint/g);
console.log(`\nGambit caption occurrences: ${gambitMatches ? gambitMatches.length : 0}`);

// Check for Magneto duplicate
const magnetoMatches = content.match(/Magneto — 2025 Topps Marvel Mint/g);
console.log(`Magneto caption occurrences: ${magnetoMatches ? magnetoMatches.length : 0}`);

// Also check for any remaining standalone <p> captions that are duplicates
const gambitDup = `\n<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;">Gambit — 2025 Topps Marvel Mint. Channing Tatum confirmed for Doomsday.</p>\n</div>`;
if (content.includes(gambitDup)) {
  content = content.replace(gambitDup, '');
  console.log('✓ Removed Gambit duplicate caption');
}

const magnetoDup = `\n<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;">Magneto — 2025 Topps Marvel Mint PSA 10. Ian McKellen returns for Doomsday.</p>\n</div>`;
if (content.includes(magnetoDup)) {
  content = content.replace(magnetoDup, '');
  console.log('✓ Removed Magneto duplicate caption');
}

await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = 5040001', [content]);
console.log('\n✅ Done');
await conn.end();
process.exit(0);
