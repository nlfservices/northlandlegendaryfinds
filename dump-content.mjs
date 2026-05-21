import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  const [rows] = await connection.execute(
    "SELECT id, contentMarkdown FROM articles WHERE slug = 'memorial-day-marvel-fallen-son-captain-america'"
  );
  
  if (rows.length === 0) {
    console.log("Article not found!");
  } else {
    fs.writeFileSync('/home/ubuntu/article_content_dump.txt', rows[0].contentMarkdown);
    console.log("Content dumped to /home/ubuntu/article_content_dump.txt");
    console.log("Length:", rows[0].contentMarkdown.length);
  }
  
  await connection.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
