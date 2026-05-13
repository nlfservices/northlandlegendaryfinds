/**
 * Fix article links - convert relative URLs to absolute URLs
 * The Streamdown component's rehype-harden plugin blocks relative URLs
 * because defaultOrigin is undefined. Absolute URLs work fine.
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const SITE_URL = "https://northlandlegendaryfinds.com";

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Fix the overview article - convert relative deep-dive links to absolute
  const [rows] = await conn.execute(
    "SELECT id, slug, contentMarkdown FROM articles WHERE slug = ?",
    ["marvels-greatest-families-bloodlines-shape-universe-doomsday"]
  );

  if (rows.length === 0) {
    console.error("Overview article not found");
    await conn.end();
    return;
  }

  let content = rows[0].contentMarkdown;
  
  // Replace all relative /mcu-news/ links with absolute URLs
  content = content.replace(/\]\(\/mcu-news\//g, `](${SITE_URL}/mcu-news/`);
  // Replace all relative /cards links
  content = content.replace(/\]\(\/cards\)/g, `](${SITE_URL}/cards)`);
  // Replace all relative /characters links
  content = content.replace(/\]\(\/characters\)/g, `](${SITE_URL}/characters)`);
  // Replace all relative /mcu-spotlight links
  content = content.replace(/\]\(\/mcu-spotlight\)/g, `](${SITE_URL}/mcu-spotlight)`);
  // Replace all relative /shop links
  content = content.replace(/\]\(\/shop\)/g, `](${SITE_URL}/shop)`);
  // Replace all relative /whatnot links
  content = content.replace(/\]\(\/whatnot\)/g, `](${SITE_URL}/whatnot)`);
  // Replace all relative /ebay-comps links
  content = content.replace(/\]\(\/ebay-comps\)/g, `](${SITE_URL}/ebay-comps)`);

  await conn.execute(
    "UPDATE articles SET contentMarkdown = ? WHERE id = ?",
    [content, rows[0].id]
  );
  console.log(`✅ Fixed links in overview article (id: ${rows[0].id})`);

  // Now fix all 6 deep-dive articles too
  const deepDiveSlugs = [
    "richards-family-marvels-first-family-doom-secret-wars",
    "summers-grey-dynasty-most-powerful-mutant-family",
    "house-of-magnus-magneto-family-legacy",
    "parker-family-great-power-great-responsibility",
    "wakanda-royal-family-tchalla-legacy-doom",
    "wolverine-family-claws-clones-chosen-family"
  ];

  for (const slug of deepDiveSlugs) {
    const [articleRows] = await conn.execute(
      "SELECT id, contentMarkdown FROM articles WHERE slug = ?",
      [slug]
    );
    if (articleRows.length === 0) {
      console.log(`⚠️ Article not found: ${slug}`);
      continue;
    }

    let articleContent = articleRows[0].contentMarkdown;
    
    // Replace all relative links with absolute
    articleContent = articleContent.replace(/\]\(\/mcu-news\//g, `](${SITE_URL}/mcu-news/`);
    articleContent = articleContent.replace(/\]\(\/cards\)/g, `](${SITE_URL}/cards)`);
    articleContent = articleContent.replace(/\]\(\/cards\b/g, `](${SITE_URL}/cards`);
    articleContent = articleContent.replace(/\]\(\/characters\)/g, `](${SITE_URL}/characters)`);
    articleContent = articleContent.replace(/\]\(\/characters\b/g, `](${SITE_URL}/characters`);
    articleContent = articleContent.replace(/\]\(\/mcu-spotlight\)/g, `](${SITE_URL}/mcu-spotlight)`);
    articleContent = articleContent.replace(/\]\(\/shop\)/g, `](${SITE_URL}/shop)`);
    articleContent = articleContent.replace(/\]\(\/whatnot\)/g, `](${SITE_URL}/whatnot)`);
    articleContent = articleContent.replace(/\]\(\/ebay-comps\)/g, `](${SITE_URL}/ebay-comps)`);

    await conn.execute(
      "UPDATE articles SET contentMarkdown = ? WHERE id = ?",
      [articleContent, articleRows[0].id]
    );
    console.log(`✅ Fixed links in: ${slug}`);
  }

  await conn.end();
  console.log("\nDone! All article links converted to absolute URLs.");
}

main().catch(console.error);
