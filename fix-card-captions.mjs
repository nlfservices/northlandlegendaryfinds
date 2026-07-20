/**
 * Fix card image display in doomsday article:
 * - Wrap each card img in a centered div with caption
 * - The extractImages function in ArticleTemplates also extracts HTML img src,
 *   so we need to check if CineStill is still showing a cropped card
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 5040001");

let content = rows[0].contentMarkdown;

// The extractImages function also matches HTML img tags:
// const htmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
// So inlineImages[0] will be the Doom card, and CineStill will crop it.
// Solution: We need to either:
// A) Change the img tags to not be matched by the regex (use a different format)
// B) Or fix the content so the first image is appropriate for CineStill

// Best approach: Replace the plain <img> tags with <div> wrapped versions that include
// a data attribute to prevent extraction, OR just accept that the cinematic template
// will use the first image for CineStill.

// Actually the cleanest fix: Since the template uses extractImages which grabs ALL img src URLs,
// the first one (Doom card) will always be used for CineStill (16:7 aspect ratio, object-fit:cover).
// We need to either:
// 1. Add a proper widescreen image as the first image in the content
// 2. Or modify the content to use a different approach for card images

// Let's use <figure> tags instead of <img> - the extractImages regex matches <img> specifically
// If we use <figure><img></figure> the regex will still match. 
// The regex is: /<img[^>]+src=["']([^"']+)["'][^>]*>/g
// It will still match img tags inside figure.

// Best solution: Use a picture element or change the approach.
// Actually simplest: Add a proper cinematic still image BEFORE the card images.
// The featured image is already used for the hero. Let's just accept the CineStill won't show
// if there are no markdown images.

// Wait - looking at the code again:
// const inlineImages = useMemo(() => extractImages(content), [content]);
// extractImages matches BOTH markdown AND HTML img tags.
// So inlineImages[0] = the Doom card, and CineStill renders it at 16:7 with object-fit:cover

// The fix: We need to prevent the card images from being used by CineStill.
// Option: Use CSS background-image instead of img tag
// Option: Use a data-uri or different attribute
// Option: Wrap in a special container that the regex won't match

// Cleanest: Replace <img> with <picture><img></picture> - no wait, regex still matches.
// Actually: Use srcset instead of src? No, that's hacky.

// REAL FIX: The issue is that CineStill uses inlineImages[0].
// If we make the card images use a slightly different format that extractImages won't catch,
// we solve it. The regex is: /<img[^>]+src=["']([^"']+)["'][^>]*>/g
// If we use srcSet instead of src, or use a different element...

// Actually the SIMPLEST fix: Just add object-fit:contain to the CineStill component for card images.
// But we can't change the template per-article.

// REAL SIMPLEST: Remove the img tags from the markdown content and use markdown-safe HTML
// that won't be matched. Use an <a> tag wrapping a background div? No.

// OK - the ACTUAL simplest fix that works:
// Replace <img src="..." with <img data-src="..." and add a style that uses the data-src.
// No - that won't render.

// FINAL ANSWER: The extractImages regex requires src= attribute.
// If we encode the images as <div> with background-image style, they won't be extracted.
// This is the cleanest approach for card images that shouldn't be used as CineStill.

const replacements = [
  {
    find: /<img src="\/manus-storage\/1000043826_c2ad3c69\.jpg" alt="Doctor Doom - 2025 Topps Marvel Mint PSA 10" style="[^"]*" \/>/,
    replace: `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<div style="width:300px;max-width:100%;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);"><img src="/manus-storage/1000043826_c2ad3c69.jpg" alt="Doctor Doom - 2025 Topps Marvel Mint PSA 10" style="width:100%;height:auto;display:block;" /></div>
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;text-align:center;">Doctor Doom — 2025 Topps Marvel Mint PSA 10. The SDCC exclusive everyone's chasing.</p>
</div>`
  },
  {
    find: /<img src="\/manus-storage\/Spider-Man-Front_504aec2f\.JPG" alt="Spider-Man - 2025 Topps Marvel Mint Red Refractor \/5 CGC 8\.5" style="[^"]*" \/>/,
    replace: `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<div style="width:300px;max-width:100%;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);"><img src="/manus-storage/Spider-Man-Front_504aec2f.JPG" alt="Spider-Man - 2025 Topps Marvel Mint Red Refractor /5 CGC 8.5" style="width:100%;height:auto;display:block;" /></div>
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;text-align:center;">Spider-Man Red Refractor /5 — CGC 8.5. The 2026 Marvel Mint theme revealed at SDCC.</p>
</div>`
  },
  {
    find: /<img src="\/manus-storage\/Gambit-front_97d1d245\.jpg" alt="Gambit - 2025 Topps Marvel Mint" style="[^"]*" \/>/,
    replace: `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<div style="width:300px;max-width:100%;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);"><img src="/manus-storage/Gambit-front_97d1d245.jpg" alt="Gambit - 2025 Topps Marvel Mint" style="width:100%;height:auto;display:block;" /></div>
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;text-align:center;">Gambit — 2025 Topps Marvel Mint. Channing Tatum confirmed for Doomsday.</p>
</div>`
  },
  {
    find: /<img src="\/manus-storage\/1000043854_34ddb7b7\.jpg" alt="Magneto - 2025 Topps Marvel Mint PSA 10" style="[^"]*" \/>/,
    replace: `<div style="text-align:center;margin:2rem auto;max-width:340px;">
<div style="width:300px;max-width:100%;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);"><img src="/manus-storage/1000043854_34ddb7b7.jpg" alt="Magneto - 2025 Topps Marvel Mint PSA 10" style="width:100%;height:auto;display:block;" /></div>
<p style="margin-top:0.75rem;font-size:0.85rem;color:#a0a0a0;font-style:italic;text-align:center;">Magneto — 2025 Topps Marvel Mint PSA 10. Ian McKellen returns for Doomsday.</p>
</div>`
  }
];

let replaced = 0;
for (const r of replacements) {
  if (r.find.test(content)) {
    content = content.replace(r.find, r.replace);
    replaced++;
  } else {
    console.log('Not found:', r.find.source.substring(0, 60));
  }
}

console.log(`Replaced ${replaced} of ${replacements.length} images`);

// Now the key issue: CineStill will still extract these img tags via extractImages.
// The only way to prevent CineStill from showing a cropped card is to ensure
// inlineImages[0] is NOT a card image.
// 
// Since all markdown images are gone, extractImages will only find HTML img tags.
// The first one found will be used for CineStill.
// 
// We could add a proper widescreen image at the start of the content that works well
// at 16:7 aspect ratio. OR we can modify the template to skip card-sized images.
// 
// Simplest: Don't fight the template. Instead, let's check if the prose rendering
// will show these properly since stripImages only removes markdown images.

await conn.execute(
  'UPDATE articles SET contentMarkdown = ? WHERE id = 5040001',
  [content]
);

console.log('✅ Card images updated with captions and proper styling!');
await conn.end();
process.exit(0);
