import mysql from 'mysql2/promise';
import 'dotenv/config';

const SLUG = 'top-10-marvel-characters-collectors-chasing-cards-2026';

// eBay sold comps for each character
const comps = [
  {
    heading: '## 1. Spider-Man — The Undisputed King',
    insertAfter: 'Browse Spider-Man cards in our [Card Database](https://northlandlegendaryfinds.com/cards) — we track over 1,709 Marvel cards with real-time pricing data.',
    comp: `> **Recent Sold Comp:** [2025 Topps Mint Marvel Spider-Man — Gambit's Deck Ace of Hearts /99](https://www.ebay.com/itm/236722459537) — **SOLD: $2,500.00** (April 22, 2026). This encased Gambit's Deck insert from the Topps Mint set is one of the most iconic Spider-Man cards in the modern era. Numbered to just 99 copies, the Ace of Hearts features stunning artwork and commands premium prices from serious collectors.`
  },
  {
    heading: '## 2. Doctor Doom — The Doomsday Effect',
    insertAfter: 'Check out our [Doctor Doom character page](https://northlandlegendaryfinds.com/characters) to see every Doom card we track, with parallel breakdowns and market data.',
    comp: `> **Recent Sold Comp:** [2025 Topps Chrome Marvel DR Doom Scope Reflections SSP 8/25](https://www.ebay.com/itm/277826230856) — **SOLD: $1,350.00** (March 28, 2026). The Scope Reflections insert is one of the hardest pulls in Chrome Marvel — numbered to just 25 copies. This Doom card combines the premium Chrome finish with SSP scarcity, and it sold before the Doomsday trailer even dropped online.`
  },
  {
    heading: '## 3. Wolverine — The X-Men Crossover Play',
    insertAfter: '**Why he is hot right now:** Channing Tatum as Gambit, the full X-Men roster confirmed for Doomsday, and X-Men \'97 Season 2 all converge in 2026. Wolverine is the face of that wave.',
    comp: `> **Recent Sold Comp:** [2025 Topps Marvel Sapphire Dual Auto — Deadpool (Ryan Reynolds) / Wolverine (Hugh Jackman)](https://www.ebay.com/itm/177933298941) — **SOLD: £10,000 (~$12,600 USD)** (March 12, 2026). Read that number again. A dual on-card autograph of Ryan Reynolds and Hugh Jackman from the Sapphire set. This is the kind of card that defines an entire product line — and it proves that Wolverine cards at the top end are competing with sports card prices.`
  },
  {
    heading: '## 4. Ghost Rider — The Sleeper Pick',
    insertAfter: '**Why he is hot right now:** Rumors of a Ghost Rider MCU project continue to circulate, and the character\'s visual appeal makes his cards hold value regardless of movie announcements. This is a long-term hold.',
    comp: `> **Recent Sold Comp:** [2025 Topps Chrome Marvel Studios Ghost Rider Hand Drawn Sketch Card 1/1 by Duke](https://www.ebay.com/itm/188271819196) — **SOLD: $1,033.33** (April 6, 2026). A one-of-one hand-drawn sketch card featuring Ghost Rider's flaming skull. Sketch cards are the ultimate chase in any Chrome set — there is literally only one in existence. This sale proves Ghost Rider's premium card market is very real.`
  },
  {
    heading: '## 5. Captain America — The Blue Chip',
    insertAfter: '**Why he is hot right now:** Chris Evans is confirmed to return in *Doomsday* as Steve Rogers. Every Cap card just became a reunion play.',
    comp: `> **Recent Sold Comp:** [2025 Topps Chrome Marvel Sapphire Captain America Auto Black /10 PSA 9](https://www.ebay.com/itm/137169106299) — **SOLD: $1,720.00** (March 26, 2026). A PSA 9 graded Sapphire Auto numbered to just 10 copies. The Black parallel is the second-rarest auto tier in the Sapphire set, and Cap's blue chip status means graded copies command serious premiums. With Chris Evans returning, this card is only going up.`
  },
  {
    heading: '## 6. Silver Surfer — The Metallic Marvel',
    insertAfter: '**Why he is hot right now:** The Fantastic Four are officially in the MCU, and Silver Surfer is part of that cosmic package. His cards are a bet on the entire cosmic Marvel future.',
    comp: `> **Recent Sold Comp:** [2025 Topps Chrome Marvel Studios Shalla-bal Silver Surfer 1/1 Printing Plate](https://www.ebay.com/itm/187918702551) — **SOLD: £900 (~$1,135 USD)** (February 7, 2026). A true one-of-one printing plate from the Chrome Marvel Studios set. Printing plates are the rawest form of card production — literally the metal plate used to print the card. For a character who is literally made of silver, a metallic printing plate is the perfect chase.`
  },
  {
    heading: '## 7. Venom — The Anti-Hero Powerhouse',
    insertAfter: '**Why he is hot right now:** With the multiverse in full swing and symbiote storylines potentially crossing into Doomsday, Venom cards are a speculative play with strong floor value.',
    comp: `> **Recent Sold Comp:** [2025 Topps Marvel Studios Chrome Reflections Spider-Man & Venom R-2 PSA 10 POP 1](https://www.ebay.com/itm/127670324934) — **SOLD: $1,225.00** (February 13, 2026). The Reflections SSP insert is a case hit — you might rip an entire case and only pull one. This PSA 10 was the first graded copy (POP 1), which means the buyer got the only gem mint example in existence at the time. The Spider-Man and Venom dual image on a Chrome Reflections card is pure fire.`
  },
  {
    heading: '## 8. Thanos — The Big Bad Investment',
    insertAfter: '**Why he is hot right now:** With Doctor Doom taking the villain spotlight, some collectors are sleeping on Thanos — which means now is the time to buy before the inevitable "greatest Marvel villains" conversation brings him back to the forefront.',
    comp: `> **Recent Sold Comp:** [2025 Topps Marvel Chrome Sapphire Thanos Auto Black /10 Inscription Josh Brolin](https://www.ebay.com/itm/137060642321) — **SOLD: £1,500 (~$1,890 USD)** (March 21, 2026). An on-card autograph with inscription from Josh Brolin himself, numbered to just 10 copies in the Black Sapphire tier. When the actor who played the most iconic villain in MCU history signs a card and adds an inscription, you hold it forever.`
  },
  {
    heading: '## 9. Punisher — When He Hits, He Hits HARD',
    insertAfter: '**Why he is hot right now:** *Daredevil: Born Again* Season 2 is confirmed, and Bernthal\'s Punisher is a fan favorite. Every appearance drives card demand.',
    comp: `> **Recent Sold Comp:** [2025 Topps Chrome Marvel Studios Sapphire Jon Bernthal as Frank Castle Auto /10](https://www.ebay.com/itm/358446047423) — **SOLD: £800 (~$1,010 USD)** (April 15, 2026). Jon Bernthal's on-card autograph as Frank Castle in the Sapphire /10 tier. This is a rookie card for the MCU version of Punisher, and with Born Again Season 2 confirmed, Bernthal Punisher autos are only going to get more expensive. Similar Black /10 copies are currently listed at nearly $2,000.`
  },
  {
    heading: '## 10. Cyclops — The X-Men Dark Horse',
    insertAfter: '**Why he is hot right now:** X-Men are officially in the MCU. Cyclops is the leader. His cards are undervalued compared to Wolverine, which means there is room to run.',
    comp: `> **Recent Sold Comp:** [2025 Topps Marvel Mint Cyclops King of Diamonds — Gambit's Deck Encased /99](https://www.ebay.com/itm/287118422806) — **SOLD: $555.00** (March 17, 2026). The Gambit's Deck playing card inserts from Topps Mint are some of the most unique cards in the hobby — actual playing card designs encased and numbered to 99. Cyclops as the King of Diamonds is a fitting choice, and at $555 this is one of the more accessible high-end cards on this list. Compare that to the Wolverine dual auto at $12,600 and you see the value gap.`
  }
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get current content
  const [rows] = await conn.execute(
    'SELECT id, contentMarkdown FROM articles WHERE slug = ?',
    [SLUG]
  );
  
  if (rows.length === 0) {
    console.error('Article not found!');
    await conn.end();
    return;
  }
  
  let content = rows[0].contentMarkdown;
  const articleId = rows[0].id;
  
  // Insert each comp after its target line
  for (const comp of comps) {
    const idx = content.indexOf(comp.insertAfter);
    if (idx === -1) {
      console.warn(`WARNING: Could not find insertion point for ${comp.heading}`);
      console.warn(`Looking for: "${comp.insertAfter.substring(0, 80)}..."`);
      continue;
    }
    
    const insertPos = idx + comp.insertAfter.length;
    content = content.substring(0, insertPos) + '\n\n' + comp.comp + content.substring(insertPos);
    console.log(`✅ Added comp for ${comp.heading}`);
  }
  
  // Also update the Hot Cards to Watch section with real prices
  const hotCardsOld = `### Hot Cards to Watch

- **Spider-Man 2025 Topps Chrome Refractor** — The benchmark Spider-Man card of the modern era. PSA 10 copies are climbing weekly.
- **Doctor Doom 2025 Topps Chrome #1** — The flagship Doom card. Buy before the Doomsday trailer drops online.
- **Wolverine 2025 Topps Finest X-Men '97 Auto** — If you can find one, hold it. X-Men MCU crossover hype is just getting started.
- **Captain America 2026 Brooklyn Collection /25** — Limited numbered parallel from the 85th anniversary set. Blue chip long-term hold.
- **Ghost Rider 2025 Topps Chrome Refractor** — The sleeper pick. Visually stunning and undervalued compared to the top-tier characters.`;

  const hotCardsNew = `### Hot Cards to Watch (With Real Sold Prices)

- **Spider-Man Topps Mint Gambit's Deck /99** — Sold for $2,500. The Ace of Hearts encased insert is the crown jewel of the Mint set.
- **Wolverine/Deadpool Sapphire Dual Auto** — Sold for $12,600. Reynolds and Jackman on one card. The most expensive Marvel card sale on this list.
- **Thanos Sapphire Auto Black /10 Josh Brolin** — Sold for $1,890. On-card inscription auto from the Mad Titan himself.
- **Captain America Sapphire Auto Black /10 PSA 9** — Sold for $1,720. Graded blue chip with Chris Evans return hype.
- **Doctor Doom Chrome Scope Reflections /25** — Sold for $1,350. Pre-trailer pricing — expect this to climb after the Doomsday trailer drops online.`;

  if (content.includes(hotCardsOld)) {
    content = content.replace(hotCardsOld, hotCardsNew);
    console.log('✅ Updated Hot Cards to Watch with real prices');
  } else {
    console.warn('WARNING: Could not find Hot Cards to Watch section to update');
  }
  
  // Update the article
  await conn.execute(
    'UPDATE articles SET contentMarkdown = ?, updatedAt = NOW() WHERE id = ?',
    [content, articleId]
  );
  
  console.log(`\n✅ Article ${articleId} updated successfully!`);
  console.log(`New content length: ${content.length} chars (was ${rows[0].contentMarkdown.length})`);
  
  await conn.end();
}

main().catch(console.error);
