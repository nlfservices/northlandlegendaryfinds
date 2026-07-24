/**
 * Update SDCC 2026 Doomsday Roundup — Add inline images to all sections
 * Run from project root: node update-sdcc-images.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const SLUG = "sdcc-2026-avengers-doomsday-roundup-trailer-tickets-topps-marvel-mint-exclusive";

// Image URLs
const IMG_HEROES = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/sdcc-trailer-heroes-assembling-7uv2m3rRkirhAPYvoM3AV5.png";
const IMG_BOOTH = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/sdcc-booth-convention-floor-axWUJcTvUcNZ4pGxNBFdps.png";
const IMG_CARDS = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/sdcc-topps-marvel-cards-v2-JA6ePcWP8QDWyCYGtv4ARu.png";
const IMG_HALL_H = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/sdcc-hall-h-panel-stage-BeZ9qp3a4jdKRikkq3dfen.png";
const IMG_FIGURES = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/sdcc-marvel-legends-figures-j9YZgT6jE9Pvyg6hvCgNmo.png";
const IMG_COLLECTOR = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/sdcc-collector-market-cards-4JosqViiQ8YDVcqMtmx2E7.png";

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Get current article
  const [rows] = await conn.execute(
    "SELECT id, contentMarkdown FROM articles WHERE slug = ?",
    [SLUG]
  );

  if (rows.length === 0) {
    console.error("Article not found:", SLUG);
    await conn.end();
    process.exit(1);
  }

  let content = rows[0].contentMarkdown;
  const articleId = rows[0].id;

  // Add image after section 1 heading (Trailer)
  content = content.replace(
    "## The Trailer That Broke the Internet (503 Million Views)\n",
    `## The Trailer That Broke the Internet (503 Million Views)\n\n<img src="${IMG_HEROES}" alt="Heroes assembling for Avengers Doomsday — Thor, Captain America, and Cyclops prepare for battle" style="width:100%;border-radius:8px;margin:1rem 0;" />\n\n`
  );

  // Add image after section 2 heading (Ticket Sales) — skip, use for booth instead
  
  // Add image after section 3 heading (SDCC Booth)
  content = content.replace(
    "## The SDCC Booth Takeover: Costumes, Sentinels, and a Mystery\n",
    `## The SDCC Booth Takeover: Costumes, Sentinels, and a Mystery\n\n<img src="${IMG_BOOTH}" alt="SDCC 2026 convention floor with massive superhero displays and excited fans" style="width:100%;border-radius:8px;margin:1rem 0;" />\n\n`
  );

  // Add image after section 4 heading (Topps Marvel Mint)
  content = content.replace(
    "## 2026 Topps Marvel Mint SDCC Exclusive Box: The Collector's Holy Grail\n",
    `## 2026 Topps Marvel Mint SDCC Exclusive Box: The Collector's Holy Grail\n\n<img src="${IMG_CARDS}" alt="Premium holographic Marvel trading cards featuring Spider-Man and Wolverine with chrome parallels" style="width:100%;border-radius:8px;margin:1rem 0;" />\n\n`
  );

  // Add image after section 5 heading (Hall H)
  content = content.replace(
    "## Hall H Saturday: Kevin Feige's MCU Through 2042\n",
    `## Hall H Saturday: Kevin Feige's MCU Through 2042\n\n<img src="${IMG_HALL_H}" alt="Massive Hall H panel stage with cosmic portal on screen and thousands of fans in audience" style="width:100%;border-radius:8px;margin:1rem 0;" />\n\n`
  );

  // Add image after section 6 heading (Marvel Legends)
  content = content.replace(
    "## Marvel Legends and Hot Toys: The Figure Reveals\n",
    `## Marvel Legends and Hot Toys: The Figure Reveals\n\n<img src="${IMG_FIGURES}" alt="Marvel Legends Avengers Doomsday action figures on display — Shang-Chi, Thor, Gambit, Invisible Woman, Thing, Human Torch" style="width:100%;border-radius:8px;margin:1rem 0;" />\n\n`
  );

  // Add image after section 7 heading (Collector Market)
  content = content.replace(
    "## What This All Means for Your Collection\n",
    `## What This All Means for Your Collection\n\n<img src="${IMG_COLLECTOR}" alt="Marvel trading cards spread on collector's desk with price charts showing upward trends" style="width:100%;border-radius:8px;margin:1rem 0;" />\n\n`
  );

  // Update the article
  await conn.execute(
    "UPDATE articles SET contentMarkdown = ? WHERE id = ?",
    [content, articleId]
  );

  console.log(`✅ Updated article ${articleId} with 6 inline images`);
  
  // Verify images are in the content
  const imgCount = (content.match(/<img /g) || []).length;
  console.log(`   Total inline images in article: ${imgCount}`);

  await conn.end();
  console.log("Done!");
}

main().catch(console.error);
