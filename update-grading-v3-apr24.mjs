/**
 * Update Grading Articles v3 — April 24, 2026
 * 1. Replace ALL images with new Marvel-only comic-style images
 * 2. Set PSA Monopoly to May 1 draft, Grading Arbitrage to May 8 draft
 * 3. Keep "Does Grading Matter" published today
 * Run from project root: node update-grading-v3-apr24.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

// NEW v3 Marvel-only comic-style image URLs
const IMG = {
  marvelHero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-marvel-hero-v3-TvFQBexbsuxrwk9mZ6W6Ve.webp",
  norad: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-norad-v3-bM53Vd59qM2i6Es4BEgimf.webp",
  volume: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-volume-v3-8gwKV7JFFLQTRYaCeSU8bN.webp",
  crossover: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-crossover-v3-KKsd7LgSeuBTTURRifQtAp.webp",
  auth: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-auth-v3-XpAnjDRRkgCMgH3KqqoUx3.webp",
};

// May 1 and May 8 timestamps
const MAY_1 = new Date('2026-05-01T12:00:00Z').getTime();
const MAY_8 = new Date('2026-05-08T12:00:00Z').getTime();

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Helper: replace ALL image src URLs in content with new ones
  function replaceAllImages(content, newImages) {
    // Match all img src URLs (cloudfront pattern)
    let updated = content;
    const imgRegex = /<img\s+src="(https:\/\/d2xsxph8kpxj0f\.cloudfront\.net[^"]+)"/g;
    const matches = [...content.matchAll(imgRegex)];
    
    // Replace images in order of appearance with the new images
    for (let i = 0; i < matches.length && i < newImages.length; i++) {
      updated = updated.replace(matches[i][1], newImages[i].url);
      // Also update the alt text
      const oldAltRegex = new RegExp(`alt="[^"]*"`, '');
      const afterSrc = updated.indexOf(newImages[i].url);
      const altStart = updated.indexOf('alt="', afterSrc);
      if (altStart > -1 && altStart < afterSrc + 300) {
        const altEnd = updated.indexOf('"', altStart + 5);
        updated = updated.substring(0, altStart) + `alt="${newImages[i].alt}"` + updated.substring(altEnd + 1);
      }
    }
    return updated;
  }

  // ===== ARTICLE 1: PSA's Monopoly Play =====
  {
    const slug = "psa-monopoly-collectors-holdings-grading-industry-acquisitions-2026";
    const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE slug = ?", [slug]);
    if (rows.length === 0) { console.error(`❌ Not found: ${slug}`); }
    else {
      let content = rows[0].contentMarkdown;
      
      // Replace all existing cloudfront image URLs with new ones
      const imgRegex = /<img\s+src="https:\/\/d2xsxph8kpxj0f\.cloudfront\.net[^"]+"\s+alt="[^"]*"\s+style="[^"]*"\s*\/>/g;
      const existingImages = content.match(imgRegex) || [];
      
      // Remove all existing inline images first
      for (const img of existingImages) {
        content = content.replace(img, '');
      }
      
      // Clean up any double blank lines left behind
      content = content.replace(/\n{3,}/g, '\n\n');
      
      // Now insert new images at strategic locations
      // Image 1: Volume/factory after the opening paragraph about GemRate data
      content = content.replace(
        '## The Acquisition Timeline',
        `<img src="${IMG.volume}" alt="Comic book illustration of a massive grading factory with workers examining Marvel trading cards on conveyor belts under bright lights" style="width:100%;border-radius:12px;margin:16px 0;" />\n\n## The Acquisition Timeline`
      );
      
      // Image 2: NORAD vault before "The Price of Monopoly"
      content = content.replace(
        '## The Price of Monopoly',
        `<img src="${IMG.norad}" alt="Comic book illustration of a classified grading facility built into a mountain — massive vault door reads CLASSIFIED CLOSED TO PUBLIC with armed guards" style="width:100%;border-radius:12px;margin:16px 0;" />\n\n## The Price of Monopoly`
      );
      
      // Image 3: Crossover before "What This Means for Collectors"
      content = content.replace(
        '## What This Means for Collectors',
        `<img src="${IMG.crossover}" alt="Comic book before-and-after showing a trading card transforming from a cheap slab to a premium gold-trimmed slab with value skyrocketing" style="width:100%;border-radius:12px;margin:16px 0;" />\n\n## What This Means for Collectors`
      );
      
      await conn.execute(
        "UPDATE articles SET contentMarkdown = ?, featuredImageUrl = ?, isPublished = 0, publishedAt = ? WHERE slug = ?",
        [content, IMG.marvelHero, MAY_1, slug]
      );
      console.log(`✅ Updated PSA Monopoly — new images, draft for May 1`);
    }
  }

  // ===== ARTICLE 2: The Grading Arbitrage =====
  {
    const slug = "grading-arbitrage-crack-slab-crossover-psa-sgc-bgc-strategy-guide";
    const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE slug = ?", [slug]);
    if (rows.length === 0) { console.error(`❌ Not found: ${slug}`); }
    else {
      let content = rows[0].contentMarkdown;
      
      // Remove all existing inline images
      const imgRegex = /<img\s+src="https:\/\/d2xsxph8kpxj0f\.cloudfront\.net[^"]+"\s+alt="[^"]*"\s+style="[^"]*"\s*\/>/g;
      const existingImages = content.match(imgRegex) || [];
      for (const img of existingImages) {
        content = content.replace(img, '');
      }
      content = content.replace(/\n{3,}/g, '\n\n');
      
      // Image 1: Crossover before/after at the top after intro
      content = content.replace(
        '## How the Price Gap Works',
        `<img src="${IMG.crossover}" alt="Comic book before-and-after showing a trading card transforming from a cheap slab to a premium gold-trimmed slab with value skyrocketing" style="width:100%;border-radius:12px;margin:16px 0;" />\n\n## How the Price Gap Works`
      );
      
      // Image 2: Marvel hero cards before "A Practical Example"
      content = content.replace(
        '## A Practical Example with Marvel Cards',
        `<img src="${IMG.marvelHero}" alt="Comic book illustration of Marvel trading cards featuring Spider-Man, Wolverine, Iron Man, and Captain America in grading slabs on a collector's desk" style="width:100%;border-radius:12px;margin:16px 0;" />\n\n## A Practical Example with Marvel Cards`
      );
      
      await conn.execute(
        "UPDATE articles SET contentMarkdown = ?, featuredImageUrl = ?, isPublished = 0, publishedAt = ? WHERE slug = ?",
        [content, IMG.crossover, MAY_8, slug]
      );
      console.log(`✅ Updated Grading Arbitrage — new images, draft for May 8`);
    }
  }

  // ===== ARTICLE 3: Does Grading Even Matter? =====
  {
    const slug = "does-card-grading-matter-authentication-vs-premium-slabs-2026";
    const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE slug = ?", [slug]);
    if (rows.length === 0) { console.error(`❌ Not found: ${slug}`); }
    else {
      let content = rows[0].contentMarkdown;
      
      // Remove all existing inline images
      const imgRegex = /<img\s+src="https:\/\/d2xsxph8kpxj0f\.cloudfront\.net[^"]+"\s+alt="[^"]*"\s+style="[^"]*"\s*\/>/g;
      const existingImages = content.match(imgRegex) || [];
      for (const img of existingImages) {
        content = content.replace(img, '');
      }
      content = content.replace(/\n{3,}/g, '\n\n');
      
      // Image 1: Volume/factory after intro about grading volume
      content = content.replace(
        '## The Pokemon Problem (or Opportunity)',
        `<img src="${IMG.volume}" alt="Comic book illustration of a massive grading factory with workers examining Marvel trading cards on conveyor belts" style="width:100%;border-radius:12px;margin:16px 0;" />\n\n## The Pokemon Problem (or Opportunity)`
      );
      
      // Image 2: NORAD vault before "The Grading Industry Serves Itself"
      content = content.replace(
        '## The Grading Industry Serves Itself',
        `<img src="${IMG.norad}" alt="Comic book illustration of a classified grading facility built into a mountain — massive vault door reads CLASSIFIED CLOSED TO PUBLIC" style="width:100%;border-radius:12px;margin:16px 0;" />\n\n## The Grading Industry Serves Itself`
      );
      
      // Image 3: Auth crossroads before "The Smart Collector's Approach"
      content = content.replace(
        '## The Smart Collector\'s Approach',
        `<img src="${IMG.auth}" alt="Comic book illustration showing a collector's crossroads — simple and fast authentication path vs complex and slow premium grading path" style="width:100%;border-radius:12px;margin:16px 0;" />\n\n## The Smart Collector's Approach`
      );
      
      // This one stays published (today)
      await conn.execute(
        "UPDATE articles SET contentMarkdown = ?, featuredImageUrl = ? WHERE slug = ?",
        [content, IMG.auth, slug]
      );
      console.log(`✅ Updated Does Grading Matter — new images, stays published today`);
    }
  }

  // Verify
  const [verify] = await conn.execute(
    "SELECT id, title, slug, isPublished, publishedAt, featuredImageUrl FROM articles WHERE slug IN (?, ?, ?)",
    [
      "psa-monopoly-collectors-holdings-grading-industry-acquisitions-2026",
      "grading-arbitrage-crack-slab-crossover-psa-sgc-bgc-strategy-guide",
      "does-card-grading-matter-authentication-vs-premium-slabs-2026",
    ]
  );
  console.log("\n--- Updated Articles ---");
  verify.forEach((r) => {
    const date = new Date(Number(r.publishedAt));
    console.log(`  ${r.id}: [${r.isPublished ? 'PUBLISHED' : 'DRAFT'}] ${r.title}`);
    console.log(`    Date: ${date.toISOString().split('T')[0]} | Hero: ${r.featuredImageUrl.substring(0, 80)}...`);
  });

  await conn.end();
  console.log("\nDone! All 3 grading articles updated with Marvel-only images.");
}

main().catch(console.error);
