/**
 * Fix the vintage cards image in Doompendance Day Part 2 (had duplicate characters)
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  const [rows] = await conn.execute(
    "SELECT id, contentMarkdown FROM articles WHERE slug = 'doompendance-day-doom-vs-captain-america'"
  );
  if (!rows.length) { console.error("Article not found!"); process.exit(1); }

  let content = rows[0].contentMarkdown;
  const oldUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doompendance2-vintage-cards-Ntm42GjUh79ydf66fAiuSd.webp";
  const newUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doompendance2-vintage-cards-v2-Zy6jfUJYksaWunpzp79nSZ.webp";

  if (content.includes(oldUrl)) {
    content = content.replace(oldUrl, newUrl);
    await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = ?', [content, rows[0].id]);
    console.log(`✅ Fixed vintage cards image in Part 2 (ID: ${rows[0].id})`);
  } else {
    console.log("ℹ️ Old URL not found in article");
  }

  await conn.end();
}

main().catch(console.error);
