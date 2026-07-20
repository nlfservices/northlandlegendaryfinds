/**
 * Remove the second duplicate caption paragraph.
 * The first one is inside our styled div container (correct).
 * The second one is a standalone <p> tag that's a leftover duplicate.
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 5040001");

let content = rows[0].contentMarkdown;

// The duplicate is this standalone paragraph that appears right after our styled container closes:
// </div>\n<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;">Doctor Doom — 2025 Topps Marvel Mint PSA 10. The SDCC exclusive everyone's chasing.</p>\n</div>
// 
// Our correct one ends with: text-align:center;">Doctor Doom...
// The duplicate has: font-style:italic;">Doctor Doom... (no text-align:center)

// Remove the standalone duplicate paragraph (the one WITHOUT text-align:center)
const duplicate = `\n<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;">Doctor Doom — 2025 Topps Marvel Mint PSA 10. The SDCC exclusive everyone's chasing.</p>\n</div>`;

if (content.includes(duplicate)) {
  content = content.replace(duplicate, '');
  console.log('✓ Removed duplicate caption paragraph');
} else {
  // Try a different approach - find the second </div> after our card container
  // Look for the pattern: our card div closes, then there's another <p> with the same text
  const pattern = /<p style="margin-top:0\.75rem;font-size:0\.85rem;color:#a0a0a0;font-style:italic;">Doctor Doom — 2025 Topps Marvel Mint PSA 10\. The SDCC exclusive everyone's chasing\.<\/p>\n<\/div>/;
  if (pattern.test(content)) {
    content = content.replace(pattern, '');
    console.log('✓ Removed duplicate caption (pattern match)');
  } else {
    console.log('✗ Could not find duplicate to remove');
    // Show what's around position 3039
    console.log('Content around pos 3000-3200:', JSON.stringify(content.substring(3000, 3200)));
  }
}

// Verify
const captionCount = (content.match(/Doctor Doom — 2025 Topps Marvel Mint PSA 10\./g) || []).length;
console.log(`Caption occurrences after fix: ${captionCount}`);

await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = 5040001', [content]);
console.log('✅ Done');
await conn.end();
process.exit(0);
