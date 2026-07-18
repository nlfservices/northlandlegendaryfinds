import mysql from 'mysql2/promise';
import { writeFileSync } from 'fs';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await conn.execute(
  "SELECT id, slug, contentMarkdown, featuredImageUrl FROM articles WHERE slug = 'marvel-week-recap-july-14-18-sdcc-countdown-2026' LIMIT 1"
);

if (rows[0]) {
  console.log('Article ID:', rows[0].id);
  console.log('Featured Image:', rows[0].featuredImageUrl);
  writeFileSync('/home/ubuntu/article-content.md', rows[0].contentMarkdown);
  console.log('Saved markdown to /home/ubuntu/article-content.md');
  
  const md = rows[0].contentMarkdown;
  const re = /!\[[^\]]*\]\([^)]+\)/g;
  const matches = md.match(re) || [];
  console.log('Total images:', matches.length);
  matches.forEach((m, i) => console.log(`Image ${i+1}: ${m.substring(0, 120)}`));
}

await conn.end();
