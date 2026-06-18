/**
 * Update Spider-Man BND article:
 * Replace the view count comparison grid with side-by-side embedded YouTube trailers
 * - Left: No Way Home trailer (8TZMtslA3UY) with 355.5M views
 * - Right: Brand New Day trailer (62bIsvRcPv0) with 718.6M views
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  const [rows] = await conn.execute(
    'SELECT contentMarkdown FROM articles WHERE slug = ?',
    ['spiderman-brand-new-day-trailer-record-breaking-card-market']
  );

  if (!rows.length) { console.error("Article not found"); process.exit(1); }

  let content = rows[0].contentMarkdown;

  // Find and replace the existing comparison section
  const oldComparison = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin:2rem 0;padding:1.5rem;background:rgba(0,255,100,0.03);border:1px solid rgba(0,255,100,0.15);border-radius:12px;">
  <div style="text-align:center;padding:1.5rem;background:rgba(0,0,0,0.3);border-radius:8px;">
    <div style="font-size:0.85rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Spider-Man: No Way Home (2021)</div>
    <div style="font-size:2.5rem;font-weight:800;color:#ff6b6b;">355.5M</div>
    <div style="font-size:0.8rem;color:#aaa;">views in 24 hours</div>
    <div style="font-size:0.75rem;color:#666;margin-top:0.5rem;">Previous Spider-Man record</div>
  </div>
  <div style="text-align:center;padding:1.5rem;background:rgba(0,0,0,0.3);border-radius:8px;border:1px solid rgba(0,255,100,0.3);">
    <div style="font-size:0.85rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Spider-Man: Brand New Day (2026)</div>
    <div style="font-size:2.5rem;font-weight:800;color:#00ff64;">718.6M</div>
    <div style="font-size:0.8rem;color:#aaa;">views in 24 hours</div>
    <div style="font-size:0.75rem;color:#00ff64;margin-top:0.5rem;">+102% increase — ALL-TIME RECORD</div>
  </div>
</div>`;

  const newComparison = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin:2rem 0;">
  <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:1rem;border:1px solid rgba(255,107,107,0.2);">
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;">
      <iframe src="https://www.youtube.com/embed/8TZMtslA3UY" title="Spider-Man: No Way Home — Official Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
    </div>
    <div style="text-align:center;padding-top:1rem;">
      <div style="font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">No Way Home (2021)</div>
      <div style="font-size:2rem;font-weight:800;color:#ff6b6b;margin:0.25rem 0;">355.5M</div>
      <div style="font-size:0.75rem;color:#aaa;">views in first 24 hours</div>
    </div>
  </div>
  <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:1rem;border:1px solid rgba(0,255,100,0.3);">
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;">
      <iframe src="https://www.youtube.com/embed/62bIsvRcPv0" title="Spider-Man: Brand New Day — Official Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
    </div>
    <div style="text-align:center;padding-top:1rem;">
      <div style="font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Brand New Day (2026)</div>
      <div style="font-size:2rem;font-weight:800;color:#00ff64;margin:0.25rem 0;">718.6M</div>
      <div style="font-size:0.75rem;color:#00ff64;">views in first 24 hours — ALL-TIME RECORD</div>
    </div>
  </div>
</div>`;

  if (content.includes(oldComparison)) {
    content = content.replace(oldComparison, newComparison);
    console.log("✅ Replaced number-only comparison with side-by-side trailer embeds");
  } else {
    console.log("⚠️ Could not find exact comparison section — trying partial match");
    // Try a simpler match
    const partialOld = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin:2rem 0;padding:1.5rem;background:rgba(0,255,100,0.03);border:1px solid rgba(0,255,100,0.15);border-radius:12px;">`;
    if (content.includes(partialOld)) {
      // Find the full div block
      const startIdx = content.indexOf(partialOld);
      // Find the closing </div> that matches (count nesting)
      let depth = 0;
      let endIdx = startIdx;
      for (let i = startIdx; i < content.length; i++) {
        if (content.substring(i, i + 4) === '<div') depth++;
        if (content.substring(i, i + 6) === '</div>') {
          depth--;
          if (depth === 0) {
            endIdx = i + 6;
            break;
          }
        }
      }
      content = content.substring(0, startIdx) + newComparison + content.substring(endIdx);
      console.log("✅ Replaced comparison section via partial match");
    } else {
      console.log("❌ Could not find comparison section at all");
    }
  }

  // Also remove the standalone trailer embed near the top since we now have it in the comparison
  // Keep the "Watch the Official Trailer" section header but replace with a note pointing to comparison
  const oldTrailerSection = `## Watch the Official Trailer

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:1rem 0 2rem 0;">
  <iframe
    src="https://www.youtube.com/embed/62bIsvRcPv0"
    title="Spider-Man: Brand New Day — Official Trailer"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    style="position:absolute;top:0;left:0;width:100%;height:100%;"
  ></iframe>
</div>`;

  const newTrailerSection = `## Watch the Official Trailer

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:1rem 0 2rem 0;">
  <iframe src="https://www.youtube.com/embed/62bIsvRcPv0" title="Spider-Man: Brand New Day — Official Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
</div>`;

  // Keep the top trailer as-is (it's the main embed), the comparison below shows both side by side
  // No change needed here actually - having the main trailer at top AND the comparison further down is good UX

  const [result] = await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE slug = ?',
    [content, 'spiderman-brand-new-day-trailer-record-breaking-card-market']
  );

  console.log(`Updated: ${result.affectedRows} row(s)`);
  await conn.end();
  console.log("Done! Article now has side-by-side trailers with view counts in the comparison section.");
}

main().catch(console.error);
