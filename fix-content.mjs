import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  // Get current content
  const [rows] = await connection.execute(
    "SELECT id, contentMarkdown FROM articles WHERE slug = 'memorial-day-marvel-fallen-son-captain-america'"
  );
  
  if (rows.length === 0) {
    console.log("Article not found!");
    await connection.end();
    return;
  }
  
  let content = rows[0].contentMarkdown;
  console.log("Original content length:", content.length);
  
  // Remove "[Image blocked: ...]" lines
  content = content.replace(/\[Image blocked:.*?\]\n?/g, '');
  
  // Fix the blockquote - replace the card data quote with a real quote from the article
  content = content.replace(
    /> "Captain America Topps Chrome Marvel 2024 Base Chrome"/g,
    '> "It is not about how he died. It is about how he lived."'
  );
  
  // Remove any double blank lines that resulted from removals
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // Update the article
  await connection.execute(
    "UPDATE articles SET contentMarkdown = ? WHERE id = ?",
    [content, rows[0].id]
  );
  
  console.log("Updated content length:", content.length);
  console.log("Article content fixed successfully!");
  
  await connection.end();
}

main().catch(console.error);
