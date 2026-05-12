import 'dotenv/config';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(
  "SELECT contentMarkdown FROM articles WHERE slug = 'doctor-doom-destroyed-multiverse-secret-wars-lore-avengers-doomsday'"
);

let content = rows[0].contentMarkdown;

// Find the riseofdoom line and add image right after it
const oldText = 'The [Rise of Doom card #56](https://riseofdoom.com/cards/56) — a 1/1 Comic Cut showing **God Emperor Doom killing Thanos** from Secret Wars #8 — is the ultimate representation of where this storyline ends. That single card captures the moment Doom stood atop Battleworld as a god.';

const newText = 'The [Rise of Doom card #56](https://riseofdoom.com/cards/56) — a 1/1 Comic Cut showing **God Emperor Doom killing Thanos** from Secret Wars #8 — is the ultimate representation of where this storyline ends. That single card captures the moment Doom stood atop Battleworld as a god.\n\n![Doctor Doom Comic Cut #56 - God Emperor Doom Kills Thanos](https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/miZaOXobwrtrOEkH.jpeg)';

content = content.replace(oldText, newText);

await connection.execute(
  "UPDATE articles SET contentMarkdown = ? WHERE slug = 'doctor-doom-destroyed-multiverse-secret-wars-lore-avengers-doomsday'",
  [content]
);

console.log('Article updated with image!');
await connection.end();
