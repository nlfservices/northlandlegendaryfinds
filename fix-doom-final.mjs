import 'dotenv/config';
import mysql from 'mysql2/promise';

const c = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await c.execute("SELECT contentMarkdown FROM articles WHERE slug = 'doctor-doom-destroyed-multiverse-secret-wars-lore-avengers-doomsday'");
let content = rows[0].contentMarkdown;

const imgTag = '<img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/miZaOXobwrtrOEkH.jpeg" alt="Doctor Doom Comic Cut #56 - God Emperor Doom Kills Thanos" style="max-width: 350px; margin: 1rem auto; display: block; border-radius: 8px;" />';

// Remove ALL instances
content = content.replaceAll(imgTag, '');
// Clean up extra newlines
content = content.replace(/\n{3,}/g, '\n\n');

// Add back ONE instance after the Rise of Doom text
const anchor = 'That single card captures the moment Doom stood atop Battleworld as a god.';
content = content.replace(anchor, anchor + '\n\n' + imgTag);

await c.execute("UPDATE articles SET contentMarkdown = ? WHERE slug = 'doctor-doom-destroyed-multiverse-secret-wars-lore-avengers-doomsday'", [content]);

// Verify
const [verify] = await c.execute("SELECT contentMarkdown FROM articles WHERE slug = 'doctor-doom-destroyed-multiverse-secret-wars-lore-avengers-doomsday'");
const count = verify[0].contentMarkdown.split(imgTag).length - 1;
console.log('Image now appears', count, 'time(s)');

await c.end();
