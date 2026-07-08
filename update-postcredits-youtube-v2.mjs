/**
 * Update "Every MCU Post-Credits Scene Is Secretly Building Toward Avengers: Doomsday"
 * Replace raw HTML iframes with proper {{youtube:ID|Title}} syntax
 * Run from project root: node update-postcredits-youtube-v2.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const SLUG = 'mcu-post-credits-scenes-building-avengers-doomsday';

// YouTube embed tags using the site's {{youtube:ID|Title}} syntax
const EMBEDS = {
  farFromHome: '{{youtube:jIB9w50IQEg|Spider-Man: Far From Home — Post-Credits Scene}}',
  noWayHome: '{{youtube:OkAL7cqkb_I|Spider-Man: No Way Home — Venom Post-Credits Scene}}',
  multiverseOfMadness: '{{youtube:kDly_a1BuN8|Doctor Strange in the Multiverse of Madness — Clea Post-Credits Scene}}',
  quantumania: '{{youtube:0LmJPSULBMc|Ant-Man Quantumania — Council of Kangs Post-Credits Scene}}',
  loveAndThunder: '{{youtube:JlUSDcO59zQ|Thor: Love and Thunder — Hercules Post-Credits Scene}}',
  wakandaForever: '{{youtube:AYbJBehmqRc|Black Panther: Wakanda Forever — Toussaint Post-Credits Scene}}',
  deadpoolWolverine: '{{youtube:Lc-xdGIjzpU|Deadpool & Wolverine — Gambit TVA Post-Credits Scene}}',
  endgame: '{{youtube:EG4Ny1d3NF4|Avengers: Endgame — Post-Credits Hammer Sound Explained}}',
  sourceVideo: '{{youtube:QKF9Q0Tf2ms|Every MCU Post-Credits Scene Building to Doomsday — New Rockstars}}'
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

  // First, remove any raw HTML iframe divs that were previously inserted
  content = content.replace(/<div style="position:relative;padding-bottom:56\.25%.*?<\/div>\n?/gs, '');

  // Now insert YouTube embeds using the correct syntax at appropriate locations

  // 1. Add source video embed at the very top (after the first paragraph)
  content = content.replace(
    "Erik Voss of New Rockstars recently published a film-by-film breakdown",
    EMBEDS.sourceVideo + "\n\nErik Voss of New Rockstars recently published a film-by-film breakdown"
  );

  // 2. Far From Home + No Way Home after the Spider-Man section
  content = content.replace(
    "Something crossed over. Something stayed. The multiverse isn't sealed — it's leaking.",
    "Something crossed over. Something stayed. The multiverse isn't sealed — it's leaking.\n\n" + EMBEDS.farFromHome + "\n\n" + EMBEDS.noWayHome
  );

  // 3. Multiverse of Madness after "He opens his third eye and jumps through."
  content = content.replace(
    "Strange doesn't hesitate. He opens his third eye and jumps through.",
    "Strange doesn't hesitate. He opens his third eye and jumps through.\n\n" + EMBEDS.multiverseOfMadness
  );

  // 4. Quantumania after "He just needed to be Doctor Doom."
  content = content.replace(
    "He just needed to be Doctor Doom.",
    "He just needed to be Doctor Doom.\n\n" + EMBEDS.quantumania
  );

  // 5. Love and Thunder after "Even divine beings can feel the multiverse breaking."
  content = content.replace(
    "Even divine beings can feel the multiverse breaking.",
    "Even divine beings can feel the multiverse breaking.\n\n" + EMBEDS.loveAndThunder
  );

  // 6. Wakanda Forever after Toussaint mention
  content = content.replace(
    "- **Toussaint** — T'Challa's secret son, revealed in Wakanda Forever",
    "- **Toussaint** — T'Challa's secret son, revealed in Wakanda Forever\n\n" + EMBEDS.wakandaForever
  );

  // 7. Endgame hammer sound after "That's the kind of long-game storytelling that would break the internet."
  content = content.replace(
    "That's the kind of long-game storytelling that would break the internet.",
    "That's the kind of long-game storytelling that would break the internet.\n\n" + EMBEDS.endgame
  );

  // Update the article
  await conn.execute(
    'UPDATE articles SET contentMarkdown = ? WHERE id = ?',
    [content, id]
  );
  
  // Verify embeds are in the content
  const embedCount = (content.match(/\{\{youtube:/g) || []).length;
  console.log(`✅ Updated article with ${embedCount} YouTube embeds: ${SLUG} (ID: ${id})`);
  console.log(`   Embeds: source video, Far From Home, No Way Home, Multiverse of Madness, Quantumania, Love and Thunder, Wakanda Forever, Endgame`);

  await conn.end();
}

main().catch(console.error);
