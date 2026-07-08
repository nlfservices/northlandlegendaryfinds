/**
 * Update "Every MCU Post-Credits Scene Is Secretly Building Toward Avengers: Doomsday"
 * Add YouTube embeds for each movie's post-credits scene
 * Run from project root: node update-postcredits-youtube-embeds.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const SLUG = 'mcu-post-credits-scenes-building-avengers-doomsday';

// YouTube embed helper
function youtubeEmbed(videoId, title) {
  return `\n<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:2rem 0;">
  <iframe
    src="https://www.youtube.com/embed/${videoId}"
    title="${title}"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    style="position:absolute;top:0;left:0;width:100%;height:100%;"
  ></iframe>
</div>\n`;
}

// YouTube video IDs for each post-credits scene
const EMBEDS = {
  farFromHome: { id: "jIB9w50IQEg", title: "Spider-Man: Far From Home — Post-Credits Scene" },
  noWayHome: { id: "OkAL7cqkb_I", title: "Spider-Man: No Way Home — Venom Post-Credits Scene" },
  multiverseOfMadness: { id: "kDly_a1BuN8", title: "Doctor Strange in the Multiverse of Madness — Clea Post-Credits Scene" },
  quantumania: { id: "0LmJPSULBMc", title: "Ant-Man and the Wasp: Quantumania — Council of Kangs Post-Credits Scene" },
  loveAndThunder: { id: "JlUSDcO59zQ", title: "Thor: Love and Thunder — Hercules Post-Credits Scene" },
  wakandaForever: { id: "AYbJBehmqRc", title: "Black Panther: Wakanda Forever — T'Challa's Son Post-Credits Scene" },
  guardiansVol3: { id: "tVvlWACPy2A", title: "Guardians of the Galaxy Vol. 3 — Star-Lord Will Return Post-Credits Scene" },
  deadpoolWolverine: { id: "Lc-xdGIjzpU", title: "Deadpool & Wolverine — Gambit TVA Post-Credits Scene" },
  endgame: { id: "EG4Ny1d3NF4", title: "Avengers: Endgame — Post-Credits Hammer Sound Explained" },
};

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Fetch current article
  const [rows] = await conn.execute(
    'SELECT id, contentMarkdown FROM articles WHERE slug = ?',
    [SLUG]
  );
  if (!rows.length) {
    console.error('Article not found!');
    process.exit(1);
  }

  let content = rows[0].contentMarkdown;
  const id = rows[0].id;

  // Add Far From Home embed after the first paragraph about it
  content = content.replace(
    "Strange's botched spell in No Way Home didn't just bring in villains from other universes.",
    youtubeEmbed(EMBEDS.farFromHome.id, EMBEDS.farFromHome.title) + "Strange's botched spell in No Way Home didn't just bring in villains from other universes."
  );

  // Add No Way Home Venom embed after the symbiote paragraph
  content = content.replace(
    "Something crossed over. Something stayed. The multiverse isn't sealed — it's leaking.",
    "Something crossed over. Something stayed. The multiverse isn't sealed — it's leaking." + youtubeEmbed(EMBEDS.noWayHome.id, EMBEDS.noWayHome.title)
  );

  // Add Multiverse of Madness embed after "Strange doesn't hesitate. He opens his third eye and jumps through."
  content = content.replace(
    "Strange doesn't hesitate. He opens his third eye and jumps through.",
    "Strange doesn't hesitate. He opens his third eye and jumps through." + youtubeEmbed(EMBEDS.multiverseOfMadness.id, EMBEDS.multiverseOfMadness.title)
  );

  // Add Quantumania embed after "He just needed to be Doctor Doom."
  content = content.replace(
    "He just needed to be Doctor Doom.",
    "He just needed to be Doctor Doom." + youtubeEmbed(EMBEDS.quantumania.id, EMBEDS.quantumania.title)
  );

  // Add Thor Love and Thunder embed after the Zeus/Hercules paragraph
  content = content.replace(
    "Even divine beings can feel the multiverse breaking.",
    "Even divine beings can feel the multiverse breaking." + youtubeEmbed(EMBEDS.loveAndThunder.id, EMBEDS.loveAndThunder.title)
  );

  // Add Wakanda Forever embed after T'Challa's son mention in the children section
  content = content.replace(
    "- **Toussaint** — T'Challa's secret son, revealed in Wakanda Forever",
    "- **Toussaint** — T'Challa's secret son, revealed in Wakanda Forever" + youtubeEmbed(EMBEDS.wakandaForever.id, EMBEDS.wakandaForever.title)
  );

  // Add Endgame hammer sound embed after "That's the kind of long-game storytelling that would break the internet."
  content = content.replace(
    "That's the kind of long-game storytelling that would break the internet.",
    "That's the kind of long-game storytelling that would break the internet." + youtubeEmbed(EMBEDS.endgame.id, EMBEDS.endgame.title)
  );

  // Update the article
  await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE id = ?',
    [content, id]
  );
  console.log(`✅ Updated article with YouTube embeds: ${SLUG} (ID: ${id})`);
  console.log(`   Added 7 YouTube embeds for post-credits scenes`);

  await conn.end();
}

main().catch(console.error);
