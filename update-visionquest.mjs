import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// 1. Update the trailer note — it was shown at Disney Upfront, not publicly released yet
// 2. Update the cast list with Marvel.com's official list
// 3. Add Wiccan & Hulkling: Raid of Ultron comic tie-in section

const articleId = 1290001;

// Get current content
const [rows] = await conn.execute('SELECT contentMarkdown FROM articles WHERE id = ?', [articleId]);
let content = rows[0].contentMarkdown;

// FIX 1: Update the trailer reference to note it was shown at Upfront, not publicly released
content = content.replace(
  'What we saw in that trailer changes everything we thought we knew about where this story is going.\n\n{{youtube:dLg7kj6Wkw4|VisionQuest Official Trailer — Marvel Studios}}',
  `What we saw in that trailer changes everything we thought we knew about where this story is going.

**Note:** The official VisionQuest trailer was shown exclusively at Disney's 2026 Upfronts presentation in New York City on May 13, 2026. As of publication, Marvel has not released the trailer publicly online. The video below is the closest available footage breakdown — we will update this article with the official trailer the moment it drops.

{{youtube:dLg7kj6Wkw4|VisionQuest Official Trailer — Marvel Studios}}`
);

// FIX 2: Update the cast list with Marvel.com's official announcement
content = content.replace(
  `Marvel has assembled a deep supporting cast around Bettany and Spader:

- **Paul Bettany** — Vision / White Vision / Human Vision
- **James Spader** — Ultron (robot and human manifestation)
- **Ruaridh Mollica** — Tommy Maximoff / Speed
- **James D'Arcy** — Edwin Jarvis (returning from Agent Carter)
- **Emily Hampshire** — Undisclosed role
- **Diane Morgan** — Undisclosed role
- **T'Nia Miller** — Undisclosed role
- **Lauren Morais** — Undisclosed role

The return of **James D'Arcy as Jarvis** is particularly intriguing.`,
  `Marvel has assembled a deep supporting cast around Bettany and Spader. The official cast confirmed by Marvel.com at the Disney 2026 Upfronts includes:

- **Paul Bettany** — Vision / White Vision
- **James Spader** — Ultron (reprising from Avengers: Age of Ultron)
- **Ruaridh Mollica** — Tommy Maximoff / Speed
- **James D'Arcy** — Edwin Jarvis (returning from Agent Carter)
- **Henry Lewis** — Undisclosed role
- **Jonathan Sayer** — Undisclosed role
- **Orla Brady** — Undisclosed role
- **Emily Hampshire** — Undisclosed role

The return of **James D'Arcy as Jarvis** is particularly intriguing.`
);

// FIX 3: Add the Wickan & Hulkling: Raid of Ultron comic tie-in as a new section before Collector's Corner
content = content.replace(
  "## Collector's Corner",
  `## Comic Tie-In: Wiccan & Hulkling — Raid of Ultron

Marvel is not just building VisionQuest hype on screen — the comics are amplifying it. Marvel recently announced **Wiccan & Hulkling: Raid of Ultron**, a new comic series that directly ties into the Ultron storyline running through VisionQuest. Billy Maximoff (Wiccan) and Teddy Altman (Hulkling) — both key Young Avengers — must protect their family from Ultron's rage in what promises to be a crossover event connecting the page and the screen.

For collectors, this is a double catalyst. The comic series will drive demand for both Wiccan and Hulkling cards, while simultaneously keeping Ultron in the spotlight heading into VisionQuest's premiere. If you are collecting the full WandaVision family tree — Vision, Scarlet Witch, Speed, Wiccan — this comic adds another layer of value to every card in that ecosystem.

Watch for first-appearance Wiccan and Hulkling cards from sets like 2022 Upper Deck Marvel Beginnings and 2024 Topps Chrome Marvel to start moving as the comic release date approaches.

## Collector's Corner`
);

// Update the article
await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = ?', [content, articleId]);

console.log('VisionQuest article updated successfully!');
console.log('Changes made:');
console.log('1. Added trailer availability note (shown at Upfront, not public yet)');
console.log('2. Updated cast list to match Marvel.com official announcement');
console.log('3. Added Wiccan & Hulkling: Raid of Ultron comic tie-in section');

await conn.end();
process.exit(0);
