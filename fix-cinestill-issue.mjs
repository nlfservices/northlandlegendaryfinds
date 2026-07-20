/**
 * Fix the CineStill issue in the Doomsday Trailer article:
 * 
 * Problem: extractImages() matches HTML <img> tags, so the Doom card becomes inlineImages[0]
 * and CineStill renders it at 16:7 with object-fit:cover (cropping the card).
 * 
 * Solution: Replace <img> tags with <picture> elements using <source> + <img> where the
 * src is in a data attribute. Actually simplest: just use a different element approach.
 * 
 * REAL solution: The extractImages regex is: /<img[^>]+src=["']([^"']+)["'][^>]*>/g
 * If we encode the card images using a <div> with background-image, they won't be matched.
 * 
 * Also fix: duplicate caption text appearing twice for Doom card.
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 5040001");

let content = rows[0].contentMarkdown;
console.log('Original length:', content.length);

// Strategy: Replace all card <img> tags wrapped in <div> containers with 
// background-image divs that won't be matched by extractImages regex.
// The regex looks for: <img[^>]+src=["']([^"']+)["'][^>]*>

// Replace the Doom card image container
const doomCardOld = `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<div style="width:300px;max-width:100%;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);"><img src="/manus-storage/1000043826_c2ad3c69.jpg" alt="Doctor Doom - 2025 Topps Marvel Mint PSA 10" style="width:100%;height:auto;display:block;" /></div>
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;text-align:center;">Doctor Doom — 2025 Topps Marvel Mint PSA 10. The SDCC exclusive everyone's chasing.</p>
</div>`;

const doomCardNew = `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<div style="width:300px;max-width:100%;aspect-ratio:2/3;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);background:url('/manus-storage/1000043826_c2ad3c69.jpg') center/contain no-repeat;" role="img" aria-label="Doctor Doom - 2025 Topps Marvel Mint PSA 10"></div>
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;text-align:center;">Doctor Doom — 2025 Topps Marvel Mint PSA 10. The SDCC exclusive everyone's chasing.</p>
</div>`;

// Replace Spider-Man card
const spiderOld = `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<div style="width:300px;max-width:100%;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);"><img src="/manus-storage/Spider-Man-Front_504aec2f.JPG" alt="Spider-Man - 2025 Topps Marvel Mint Red Refractor /5 CGC 8.5" style="width:100%;height:auto;display:block;" /></div>
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;text-align:center;">Spider-Man Red Refractor /5 — CGC 8.5. The 2026 Marvel Mint theme revealed at SDCC.</p>
</div>`;

const spiderNew = `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<div style="width:300px;max-width:100%;aspect-ratio:2/3;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);background:url('/manus-storage/Spider-Man-Front_504aec2f.JPG') center/contain no-repeat;" role="img" aria-label="Spider-Man - 2025 Topps Marvel Mint Red Refractor /5 CGC 8.5"></div>
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;text-align:center;">Spider-Man Red Refractor /5 — CGC 8.5. The 2026 Marvel Mint theme revealed at SDCC.</p>
</div>`;

// Replace Gambit card
const gambitOld = `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<div style="width:300px;max-width:100%;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);"><img src="/manus-storage/Gambit-front_97d1d245.jpg" alt="Gambit - 2025 Topps Marvel Mint" style="width:100%;height:auto;display:block;" /></div>
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;text-align:center;">Gambit — 2025 Topps Marvel Mint. Channing Tatum confirmed for Doomsday.</p>
</div>`;

const gambitNew = `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<div style="width:300px;max-width:100%;aspect-ratio:2/3;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);background:url('/manus-storage/Gambit-front_97d1d245.jpg') center/contain no-repeat;" role="img" aria-label="Gambit - 2025 Topps Marvel Mint"></div>
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;text-align:center;">Gambit — 2025 Topps Marvel Mint. Channing Tatum confirmed for Doomsday.</p>
</div>`;

// Replace Magneto card
const magnetoOld = `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<div style="width:300px;max-width:100%;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);"><img src="/manus-storage/1000043854_34ddb7b7.jpg" alt="Magneto - 2025 Topps Marvel Mint PSA 10" style="width:100%;height:auto;display:block;" /></div>
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;text-align:center;">Magneto — 2025 Topps Marvel Mint PSA 10. Ian McKellen returns for Doomsday.</p>
</div>`;

const magnetoNew = `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<div style="width:300px;max-width:100%;aspect-ratio:2/3;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);background:url('/manus-storage/1000043854_34ddb7b7.jpg') center/contain no-repeat;" role="img" aria-label="Magneto - 2025 Topps Marvel Mint PSA 10"></div>
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;text-align:center;">Magneto — 2025 Topps Marvel Mint PSA 10. Ian McKellen returns for Doomsday.</p>
</div>`;

let replaced = 0;

if (content.includes(doomCardOld)) { content = content.replace(doomCardOld, doomCardNew); replaced++; console.log('✓ Doom card replaced'); }
else console.log('✗ Doom card not found (checking if already fixed or different format)');

if (content.includes(spiderOld)) { content = content.replace(spiderOld, spiderNew); replaced++; console.log('✓ Spider-Man card replaced'); }
else console.log('✗ Spider-Man card not found');

if (content.includes(gambitOld)) { content = content.replace(gambitOld, gambitNew); replaced++; console.log('✓ Gambit card replaced'); }
else console.log('✗ Gambit card not found');

if (content.includes(magnetoOld)) { content = content.replace(magnetoOld, magnetoNew); replaced++; console.log('✓ Magneto card replaced'); }
else console.log('✗ Magneto card not found');

// Also fix duplicate caption: check if "Doctor Doom — 2025 Topps Marvel Mint PSA 10. The SDCC exclusive everyone's chasing." appears as plain text OUTSIDE our div container
// This would be leftover text from the original article
const doomCaptionText = "Doctor Doom — 2025 Topps Marvel Mint PSA 10.\nThe SDCC exclusive everyone's chasing.";
const doomCaptionText2 = "Doctor Doom — 2025 Topps Marvel Mint PSA 10. The SDCC exclusive everyone's chasing.";

// Count occurrences of the caption text (outside of HTML tags)
const captionCount = (content.match(/Doctor Doom — 2025 Topps Marvel Mint PSA 10\./g) || []).length;
console.log(`\nCaption text occurrences: ${captionCount}`);

// The duplicate is likely from the original article content that had the caption as plain text
// Remove standalone lines that just have the caption text (not inside <p> tags)
content = content.replace(/\n\nDoctor Doom — 2025 Topps Marvel Mint PSA 10\.\nThe SDCC exclusive everyone's chasing\.\n/g, '\n');
content = content.replace(/\n\nDoctor Doom — 2025 Topps Marvel Mint PSA 10\. The SDCC exclusive everyone's chasing\.\n/g, '\n');

const captionCountAfter = (content.match(/Doctor Doom — 2025 Topps Marvel Mint PSA 10\./g) || []).length;
console.log(`Caption text after cleanup: ${captionCountAfter}`);

console.log(`\nTotal cards replaced: ${replaced}/4`);
console.log('New length:', content.length);

await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = 5040001', [content]);
console.log('\n✅ Article updated! CineStill will no longer show cropped card.');
await conn.end();
process.exit(0);
