/**
 * Fix Doom Throne article:
 * 1. Replace featuredImageUrl with the real Shanghai booth photo
 * 2. Remove the duplicate inline image (the one after "Release day." that repeats the featured image)
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const NEW_FEATURED_IMAGE = "/manus-storage/doom-throne-shanghai-real_3d45ac6f.jpg";
const OLD_FEATURED_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-throne-shanghai-featured-nm52VBT68wMji4mrLt6bPG.webp";

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Get the article
  const [rows] = await conn.execute(
    "SELECT id, contentMarkdown, featuredImageUrl FROM articles WHERE slug = ?",
    ["doom-throne-revealed-shanghai-expo-avengers-doomsday"]
  );

  if (rows.length === 0) {
    console.error("Article not found!");
    await conn.end();
    process.exit(1);
  }

  const article = rows[0];
  console.log(`Found article ID: ${article.id}`);
  console.log(`Current featured image: ${article.featuredImageUrl}`);

  // Remove the duplicate inline image that shows the featured image again
  // This is the <img> tag after "A countdown clock mounted beside the display ticks down to December 18, 2026. Release day."
  let content = article.contentMarkdown;
  
  // Remove the inline image that uses the featured/old image
  const inlineImageRegex = /<img src="[^"]*doom-throne-shanghai-featured[^"]*"[^>]*\/?\s*>/g;
  const matches = content.match(inlineImageRegex);
  console.log(`Found ${matches ? matches.length : 0} inline featured image references`);
  
  if (matches && matches.length > 0) {
    // Remove the first occurrence (the duplicate one after "Release day.")
    content = content.replace(inlineImageRegex, '');
    // Also clean up any double newlines left behind
    content = content.replace(/\n\n\n+/g, '\n\n');
  }

  // Update the article
  await conn.execute(
    "UPDATE articles SET featuredImageUrl = ?, contentMarkdown = ? WHERE id = ?",
    [NEW_FEATURED_IMAGE, content, article.id]
  );

  console.log(`✅ Updated featured image to: ${NEW_FEATURED_IMAGE}`);
  console.log(`✅ Removed duplicate inline image`);

  await conn.end();
}

main().catch(console.error);
