import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  const [rows] = await connection.execute(
    "SELECT id, contentMarkdown FROM articles WHERE id = 1470001"
  );
  
  if (rows.length === 0) {
    console.log("Article not found!");
  } else {
    fs.writeFileSync('/home/ubuntu/fallen_son_full_content.md', rows[0].contentMarkdown);
    console.log("Content dumped to /home/ubuntu/fallen_son_full_content.md");
    console.log("Length:", rows[0].contentMarkdown.length);
  }
  
  await connection.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
