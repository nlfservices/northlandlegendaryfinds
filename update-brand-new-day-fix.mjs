/**
 * Fix Brand New Day article:
 * 1. Remove duplicate hero image from inline content (same image as featuredImageUrl)
 * 2. Change template from 'listicle' to 'spotlight' (proper round-robin)
 * Run from project root: node update-brand-new-day-fix.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const SLUG = 'spider-man-brand-new-day-presale-records-2026-marvel-collector-guide';

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Fetch current article
  const [rows] = await conn.execute(
    'SELECT id, contentMarkdown, templateLayout FROM articles WHERE slug = ?',
    [SLUG]
  );
  if (!rows.length) {
    console.error('Article not found!');
    process.exit(1);
  }

  let content = rows[0].contentMarkdown;
  const id = rows[0].id;

  console.log(`Found article ID: ${id}, current template: ${rows[0].templateLayout}`);

  // Remove the duplicate hero image (the inline img tag that uses the same URL as featuredImageUrl)
  const heroImgTag = `<img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/brand-new-day-presales-hero-LhH5VMAeP4VjoQtZLmKfEL.webp" alt="Spider-Man Brand New Day sold out theater marquee with massive crowds" style="width:100%;border-radius:8px;margin:1.5rem 0;" />`;
  
  if (content.includes(heroImgTag)) {
    content = content.replace(heroImgTag, '');
    // Clean up any double newlines left behind
    content = content.replace(/\n\n\n+/g, '\n\n');
    console.log('✅ Removed duplicate hero image from inline content');
  } else {
    console.log('⚠️ Hero image tag not found in content (may have different formatting)');
    // Try a regex approach to find the hero image
    const heroRegex = /<img[^>]*brand-new-day-presales-hero[^>]*\/>/;
    if (heroRegex.test(content)) {
      content = content.replace(heroRegex, '');
      content = content.replace(/\n\n\n+/g, '\n\n');
      console.log('✅ Removed duplicate hero image (regex match)');
    }
  }

  // Update content and change template to 'spotlight'
  // Round-robin: recent was magazine → classic → cinematic → dossier → ... 
  // 'spotlight' hasn't been used since article 2100007 (much older)
  await conn.execute(
    'UPDATE articles SET contentMarkdown = ?, templateLayout = ? WHERE id = ?',
    [content, 'spotlight', id]
  );
  console.log(`✅ Updated template: listicle → spotlight`);
  console.log(`✅ Article fixed: ${SLUG}`);

  // Verify
  const [verify] = await conn.execute(
    'SELECT id, templateLayout, LEFT(contentMarkdown, 200) as preview FROM articles WHERE id = ?',
    [id]
  );
  console.log(`\nVerification:`);
  console.log(`  Template: ${verify[0].templateLayout}`);
  console.log(`  Content starts with: ${verify[0].preview.substring(0, 100)}...`);

  // Show recent template rotation
  const [recent] = await conn.execute(
    "SELECT CONCAT(id, ' | ', templateLayout) as info FROM articles ORDER BY publishedAt DESC LIMIT 5"
  );
  console.log(`\n--- Recent Template Rotation ---`);
  recent.forEach(r => console.log(`  ${r.info}`));

  await conn.end();
  console.log('\nDone!');
}

main().catch(console.error);
