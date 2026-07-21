import 'dotenv/config';
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT `key`, value FROM site_settings WHERE `key` = 'template_rotation_index'");
console.log('Rotation:', rows[0]?.value || 'not set');
const [recent] = await conn.execute('SELECT id, title, slug, category FROM articles ORDER BY publishedAt DESC LIMIT 5');
recent.forEach(r => console.log(r.id, r.category, r.title?.slice(0,60)));
await conn.end();
process.exit(0);
