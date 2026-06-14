// Update script: swap ONLY the featuredImageUrl (hero/banner image) with the Infinity Grail 4-card display
// The inline images in the article body remain unchanged
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const NEW_HERO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/KuGcLXAdLLaVSHVR.jpg";

const [result] = await conn.execute(
  'UPDATE articles SET featuredImageUrl = ? WHERE slug = ?',
  [NEW_HERO, 'comic-art-vs-actor-portrayal-marvel-card-collector-types-2025']
);

console.log('✅ Hero image updated! Rows affected:', result.affectedRows);
console.log('   New hero → Doctor Doom Infinity Grail 4-card display');

await conn.end();
process.exit(0);
