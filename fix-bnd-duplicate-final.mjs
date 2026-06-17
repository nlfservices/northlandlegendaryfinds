/**
 * Fix: Remove the first inline <img> from contentMarkdown because the article template
 * already renders featuredImageUrl as a hero banner at the top.
 * Having the same image as both featuredImageUrl AND the first inline img = duplicate.
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

  // Remove the first <img> tag (which is the hero cityscape duplicate)
  // It appears right after <div class="cinematic-article">\n\n
  const firstImgRegex = /<img src="https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/310419663027009739\/SGHqXeh8PZJcCDnFiAMuFi\/spiderman-bnd-hero-2SvZo9VQWjbH4MrMzSVsV5\.webp"[^>]*\/>/;
  
  if (firstImgRegex.test(content)) {
    content = content.replace(firstImgRegex, '');
    // Clean up any double newlines left behind
    content = content.replace(/\n{3,}/g, '\n\n');
    console.log("✅ Removed duplicate hero image from content body");
  } else {
    console.log("⚠️ First hero image not found in content — may already be removed");
  }

  const [result] = await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE slug = ?',
    [content, 'spiderman-brand-new-day-trailer-record-breaking-card-market']
  );

  console.log(`Updated: ${result.affectedRows} row(s)`);

  // Verify remaining images
  const imgMatches = content.match(/src="https:\/\/d2xsxph8kpxj0f[^"]+"/g);
  console.log("\nRemaining images in content body:");
  imgMatches?.forEach((m, i) => console.log(`  ${i+1}: ${m}`));

  await conn.end();
  console.log("\nDone! Article now shows: featured banner (template) → trailer → villain img → cards img");
}

main().catch(console.error);
