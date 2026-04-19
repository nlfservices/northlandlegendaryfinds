import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT contentMarkdown FROM articles WHERE id = 300046');
let content = rows[0].contentMarkdown;

const oldSection = `## Why This Matters for the Card Market
Whether the clips are real or fake, the effect is identical: **Doomsday hype just went nuclear.** Every major social media platform is saturated with Doomsday content, and the movie is still eight months away.
For card collectors, this level of sustained viral buzz is exactly what drives demand. The characters confirmed in the trailer — Doctor Doom, Gambit, Magneto, the Fantastic Four, Steve Rogers — are all seeing increased search volume on trading card platforms. The belt buckle revelation alone sent Doom card interest spiking.
When the official trailer drops publicly — rumored to be within the next few days — expect another massive demand spike. The leak controversy is free marketing for Marvel, and free marketing for Marvel is free fuel for the card market.
**The NLF take:** If you're collecting Doom, Gambit, or Cap cards, the window before the public trailer drop is your last chance to buy at pre-hype prices. Once that trailer hits YouTube, it's over.
*Avengers: Doomsday opens December 18, 2026.*`;

const newSection = `## Why This Matters for the Card Market

Whether the clips are real or fake, the effect is identical: **Doomsday hype just went nuclear.** Every major social media platform is saturated with Doomsday content, and the movie is still eight months away.

For card collectors, this level of sustained viral buzz is exactly what drives demand. The characters confirmed in the trailer — Doctor Doom, Gambit, Magneto, the Fantastic Four, Steve Rogers — are all seeing increased search volume on trading card platforms. The belt buckle revelation alone sent Doom card interest spiking.

When the official trailer drops publicly — rumored to be within the next few days — expect another massive demand spike. The leak controversy is free marketing for Marvel, and free marketing for Marvel is free fuel for the card market.

## Where to Find Doomsday-Era Cards Right Now

If you're looking to get ahead of the hype, here are the best places to start building your collection before the public trailer sends prices through the roof:

- **[Rise of Doom](https://riseofdoom.com/)** — Dedicated to all things Doctor Doom. If you're chasing Doom cards, variants, and Doomsday-era collectibles, this is ground zero.
- **[Mint Comic Cards](https://mintcomiccards.com/)** — Premium graded comic cards including Marvel keys. Great source for high-grade Doom, Gambit, and Avengers cards before the movie hype hits full force.
- **[Comic Book Card](https://comicbookcard.com/)** — Deep inventory of comic book trading cards spanning every era. Perfect for hunting down vintage Doom and X-Men cards that are about to get a lot more expensive.

**The NLF take:** If you're collecting Doom, Gambit, or Cap cards, the window before the public trailer drop is your last chance to buy at pre-hype prices. Once that trailer hits YouTube, it's over.

*Avengers: Doomsday opens December 18, 2026.*`;

content = content.replace(oldSection, newSection);

await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = 300046', [content]);

// Verify
const [verify] = await conn.execute('SELECT contentMarkdown FROM articles WHERE id = 300046');
const updated = verify[0].contentMarkdown;
console.log('Has riseofdoom:', updated.includes('riseofdoom.com'));
console.log('Has mintcomiccards:', updated.includes('mintcomiccards.com'));
console.log('Has comicbookcard:', updated.includes('comicbookcard.com'));
console.log('Content length:', updated.length);
console.log('SUCCESS: Card site links added to article');

await conn.end();
