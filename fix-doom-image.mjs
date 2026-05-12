import 'dotenv/config';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(
  "SELECT contentMarkdown FROM articles WHERE slug = 'doctor-doom-destroyed-multiverse-secret-wars-lore-avengers-doomsday'"
);

let content = rows[0].contentMarkdown;

// Count how many times the image appears
const imageTag = '![Doctor Doom Comic Cut #56 - God Emperor Doom Kills Thanos](https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/miZaOXobwrtrOEkH.jpeg)';
const count = content.split(imageTag).length - 1;
console.log('Image appears', count, 'times');

// Remove ALL instances of the old image tag
content = content.replaceAll(imageTag, '');
content = content.replaceAll('\n\n\n\n', '\n\n');

// Now add it back ONCE with a smaller size using HTML img tag
const riseOfDoomText = 'That single card captures the moment Doom stood atop Battleworld as a god.';
const smallImage = '\n\n<img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/miZaOXobwrtrOEkH.jpeg" alt="Doctor Doom Comic Cut #56 - God Emperor Doom Kills Thanos" style="max-width: 350px; margin: 1rem auto; display: block; border-radius: 8px;" />';

content = content.replace(riseOfDoomText, riseOfDoomText + smallImage);

await connection.execute(
  "UPDATE articles SET contentMarkdown = ? WHERE slug = 'doctor-doom-destroyed-multiverse-secret-wars-lore-avengers-doomsday'",
  [content]
);

console.log('Fixed! Removed duplicates and added single smaller image.');
await connection.end();
