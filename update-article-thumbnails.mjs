import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  const [rows] = await conn.execute(
    `SELECT id, contentMarkdown FROM articles WHERE slug = ?`,
    ['top-10-marvel-characters-collectors-chasing-cards-2026']
  );

  if (!rows.length) {
    console.error('Article not found!');
    process.exit(1);
  }

  let content = rows[0].contentMarkdown;
  const articleId = rows[0].id;

  // Replace each markdown image with an HTML img tag at thumbnail size (150px)
  // Pattern: ![Alt](url)
  const imageRegex = /!\[(Spider-Man|Doctor Doom|Wolverine|Ghost Rider|Captain America|Silver Surfer|Venom|Thanos|Punisher|Cyclops)\]\((https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/[^\)]+)\)/g;

  let count = 0;
  content = content.replace(imageRegex, (match, alt, url) => {
    count++;
    return `<img src="${url}" alt="${alt}" style="width:150px;height:150px;border-radius:12px;float:left;margin:0 16px 12px 0;object-fit:cover;" />`;
  });

  if (count === 0) {
    console.log('No images found to resize.');
    await conn.end();
    return;
  }

  await conn.execute(
    `UPDATE articles SET contentMarkdown = ? WHERE id = ?`,
    [content, articleId]
  );

  console.log(`✅ Resized ${count} character images to 150x150 thumbnails (float left)`);
  await conn.end();
}

main().catch(console.error);
