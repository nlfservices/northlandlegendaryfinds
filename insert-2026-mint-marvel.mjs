import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Use next available ID in the 90000 range
const MINT_2026_ID = 90006;

// First, create the set entry
await conn.execute(
  `INSERT INTO marvel_sets (id, name, shortName, slug, releaseYear, totalCards, description, imageUrl)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE name=VALUES(name), totalCards=VALUES(totalCards), description=VALUES(description)`,
  [
    MINT_2026_ID,
    '2026 Topps Marvel Mint',
    'Marvel Mint',
    '2026-topps-marvel-mint',
    2026,
    125,
    'Year two of the premium trading card set featuring minted-style thick foil stock cards split into Bronze, Silver, Gold, and Platinum tiers. 125-card base set with Chrome parallels, Cerebro inserts (55 cards), Mass Symbiote Takeover inserts (30 cards), Chrome Autographs from Marvel Studios actors and comic creators, Stan Lee Cut Signature, Spider-Man Comic Cuts (1/1), and Sketch Cards. SDCC exclusive Black & Yellow Electric Dots Foil (/10) and Ian McDonald original art cards. 10 cards per box, 1 encased card per box. Pre-order July 28, 2026.',
    null
  ]
);
console.log('✅ Created 2026 Topps Marvel Mint set entry');

// Clear any existing cards for this set
await conn.execute('DELETE FROM marvel_cards WHERE setId = ?', [MINT_2026_ID]);
console.log('Cleared existing cards');

// ========== BASE SET - BRONZE (1-50) ==========
const bronze = [
  [1,'The Thing'],[2,'Eternity'],[3,'Colossus'],[4,'Baron Zemo'],[5,'Groot'],
  [6,'Elektra'],[7,'Man-Thing'],[8,'Squirrel Girl'],[9,'Nick Fury'],[10,'Thena'],
  [11,'Corruption'],[12,'Lockjaw'],[13,'Ghost-Spider'],[14,'Phoenix'],[15,'Dormammu'],
  [16,'Bishop'],[17,'Winter Soldier'],[18,'Mr. Sinister'],[19,'Spider-Ham'],[20,'Scarlet Witch'],
  [21,'Black Knight'],[22,'Kraven the Hunter'],[23,'Red Hulk'],[24,'Enchantress'],[25,'Spider-Man 2099'],
  [26,'Infinity'],[27,'Luke Cage'],[28,'Scarlet Spider'],[29,'Drax'],[30,'Green Goblin'],
  [31,'Mysterio'],[32,'Dazzler'],[33,'Wiccan'],[34,'Beta Ray Bill'],[35,'Carnage'],
  [36,'Spider-Punk'],[37,'Juggernaut'],[38,'Cable'],[39,'Doomasaur'],[40,'Ant-Man'],
  [41,'Mephisto'],[42,'Wasp'],[43,'Hobgoblin'],[44,'Rocket Raccoon'],[45,'Black Winter'],
  [46,'Iron Fist'],[47,'Jubilee'],[48,'Gwenpool'],[49,'Ms. Marvel'],[50,'She-Hulk']
];

// ========== BASE SET - SILVER (51-75) ==========
const silver = [
  [51,'Blue Marvel'],[52,'Cloak & Dagger'],[53,'Major League Venom'],[54,'Mighty Thor'],[55,'The Prowler'],
  [56,'Blade'],[57,'Emma Frost'],[58,'Black Bolt'],[59,'Gambit'],[60,'Vision'],
  [61,'Iceman'],[62,'Taskmaster'],[63,'Magik'],[64,'Silver Sable'],[65,'Ultron'],
  [66,'Black Widow'],[67,'Spider-Man Noir'],[68,'Black Cat'],[69,'Mister Fantastic'],[70,'Kate Bishop'],
  [71,'Phantom Rider'],[72,'Hawkeye'],[73,'Spider-Girl'],[74,'Invisible Woman'],[75,'Captain America (Sam Wilson)']
];

// ========== BASE SET - GOLD (76-100) ==========
const gold = [
  [76,'Daredevil'],[77,'Shang-Chi'],[78,'Bullseye'],[79,'Sentry'],[80,'Howard the Duck'],
  [81,'Beast'],[82,'Iron Patriot'],[83,'Gamora'],[84,'Killmonger'],[85,'Rogue'],
  [86,'Wonder Man'],[87,'Human Torch'],[88,'Kitty Pryde'],[89,'Nova'],[90,'Doctor Strange'],
  [91,'Adam Warlock'],[92,'Doctor Octopus'],[93,'Kingpin'],[94,'Captain Marvel'],[95,'Odin'],
  [96,'Star-Lord'],[97,'Nightcrawler'],[98,'Annihilus'],[99,'Ghost Rider'],[100,'Electro']
];

// ========== BASE SET - PLATINUM (101-125) ==========
const platinum = [
  [101,'Black Panther'],[102,'Venom'],[103,'Spider-Man'],[104,'Cyclops'],[105,'Sabretooth'],
  [106,'Loki'],[107,'Storm'],[108,'Jean Grey'],[109,'Silver Surfer'],[110,'Captain America'],
  [111,'Miles Morales'],[112,'Hulk'],[113,'Thor'],[114,'Apocalypse'],[115,'Moon Knight'],
  [116,'Galactus'],[117,'Thanos'],[118,'Iron Man'],[119,'Namor'],[120,'Spider-Woman'],
  [121,'Wolverine'],[122,'Doctor Doom'],[123,'Jeff the Land Shark'],[124,'Professor X'],[125,'Magneto']
];

// ========== INSERTS - CEREBRO (55 cards, /99) ==========
// X-Men themed, 90s-styled art, Chrome, encased, numbered /99
const cerebro = [
  ['CB-1','Professor X'],['CB-2','Wolverine'],['CB-3','Cyclops'],['CB-4','Storm'],['CB-5','Jean Grey'],
  ['CB-6','Beast'],['CB-7','Rogue'],['CB-8','Gambit'],['CB-9','Nightcrawler'],['CB-10','Colossus'],
  ['CB-11','Iceman'],['CB-12','Jubilee'],['CB-13','Bishop'],['CB-14','Cable'],['CB-15','Psylocke'],
  ['CB-16','Magneto'],['CB-17','Mystique'],['CB-18','Sabretooth'],['CB-19','Apocalypse'],['CB-20','Mr. Sinister'],
  ['CB-21','Emma Frost'],['CB-22','Kitty Pryde'],['CB-23','Angel'],['CB-24','Havok'],['CB-25','Polaris'],
  ['CB-26','Banshee'],['CB-27','Forge'],['CB-28','Dazzler'],['CB-29','Magik'],['CB-30','Sunfire'],
  ['CB-31','Cannonball'],['CB-32','Domino'],['CB-33','X-23'],['CB-34','Warpath'],['CB-35','Thunderbird'],
  ['CB-36','Multiple Man'],['CB-37','Longshot'],['CB-38','Omega Red'],['CB-39','Sentinel'],['CB-40','Juggernaut'],
  ['CB-41','Mojo'],['CB-42','Shadow King'],['CB-43','Stryfe'],['CB-44','Dark Phoenix'],['CB-45','Exodus'],
  ['CB-46','Callisto'],['CB-47','Moira MacTaggert'],['CB-48','Legion'],['CB-49','Armor'],['CB-50','Sunspot'],
  ['CB-51','Wolfsbane'],['CB-52','Mimic'],['CB-53','Corsair'],['CB-54','Vulcan'],['CB-55','Hope Summers']
];

// ========== INSERTS - MASS SYMBIOTE TAKEOVER (30 cards, Chrome) ==========
const symbiote = [
  ['ST-1','Venom'],[' ST-2','Carnage'],['ST-3','Anti-Venom'],['ST-4','Toxin'],['ST-5','Scream'],
  ['ST-6','Riot'],['ST-7','Phage'],['ST-8','Agony'],['ST-9','Lasher'],['ST-10','Hybrid'],
  ['ST-11','Mania'],['ST-12','Sleeper'],['ST-13','Knull'],['ST-14','All-Black'],['ST-15','Grendel'],
  ['ST-16','Spider-Man (Symbiote)'],['ST-17','Wolverine (Symbiote)'],['ST-18','Captain America (Symbiote)'],['ST-19','Hulk (Symbiote)'],['ST-20','Thor (Symbiote)'],
  ['ST-21','Deadpool (Symbiote)'],['ST-22','Ghost Rider (Symbiote)'],['ST-23','Iron Fist (Symbiote)'],['ST-24','Red Goblin'],['ST-25','She-Venom'],
  ['ST-26','Gwenom'],['ST-27','Agent Venom'],['ST-28','Absolute Carnage'],['ST-29','Venom Rex'],['ST-30','King in Black']
];

// ========== SDCC EXCLUSIVE INSERTS (3 cards, Ian McDonald art) ==========
const sdccExclusive = [
  ['SDCC-1','Spider-Man (Ian McDonald Art)'],
  ['SDCC-2','Hulk (Ian McDonald Art)'],
  ['SDCC-3','Punisher (Ian McDonald Art)']
];

// ========== CHROME AUTOGRAPHS - MARVEL STUDIOS ==========
const studioAutos = [
  ['MSA-BC','Bradley Cooper'],['MSA-HJ','Hugh Jackman'],['MSA-SJ','Samuel L. Jackson'],
  ['MSA-RD','Robert Downey Jr.'],['MSA-CE','Chris Evans'],['MSA-SJ2','Scarlett Johansson'],
  ['MSA-TC','Tom Holland'],['MSA-CH','Chris Hemsworth']
];

// ========== CHROME AUTOGRAPHS - COMIC CREATORS ==========
const creatorAutos = [
  ['CCA-JR','John Romita Jr.'],['CCA-TP','Todd McFarlane'],['CCA-JL','Jim Lee'],
  ['CCA-RS','Ryan Stegman'],['CCA-AK','Adam Kubert'],['CCA-FM','Frank Miller']
];

// ========== SPECIAL HITS ==========
const specialHits = [
  ['SL-CUT','Stan Lee Cut Signature'],
  ['SC-1','Spider-Man Comic Cut (Amazing Spider-Man)'],
  ['SC-2','Spider-Man Comic Cut (Spectacular Spider-Man)'],
  ['SC-3','Spider-Man Comic Cut (Web of Spider-Man)']
];

// Build all cards
const allCards = [];

// Base Bronze
for (const [num, name] of bronze) {
  allCards.push({
    cardNumber: String(num),
    name,
    cardType: 'Base - Bronze',
    rarity: 'Bronze (4 per box)',
    parallels: 'Chrome, Green Mint Foil, Orange Foil /25, Black & Yellow Electric Dots /10 (SDCC), Foilfractor 1/1, SuperFractor 1/1'
  });
}

// Base Silver
for (const [num, name] of silver) {
  allCards.push({
    cardNumber: String(num),
    name,
    cardType: 'Base - Silver',
    rarity: 'Silver (3 per box)',
    parallels: 'Chrome, Green Mint Foil, Orange Foil /25, Black & Yellow Electric Dots /10 (SDCC), Foilfractor 1/1, SuperFractor 1/1'
  });
}

// Base Gold
for (const [num, name] of gold) {
  allCards.push({
    cardNumber: String(num),
    name,
    cardType: 'Base - Gold',
    rarity: 'Gold (2 per box)',
    parallels: 'Chrome, Green Mint Foil, Orange Foil /25, Black & Yellow Electric Dots /10 (SDCC), Foilfractor 1/1, SuperFractor 1/1'
  });
}

// Base Platinum
for (const [num, name] of platinum) {
  allCards.push({
    cardNumber: String(num),
    name,
    cardType: 'Base - Platinum',
    rarity: 'Platinum /99 (Encased)',
    parallels: 'Chrome, Green Mint Foil, Orange Foil /25, Black & Yellow Electric Dots /10 (SDCC), Foilfractor 1/1, SuperFractor 1/1'
  });
}

// Cerebro Insert
for (const [code, name] of cerebro) {
  allCards.push({
    cardNumber: code,
    name,
    cardType: 'Cerebro',
    rarity: 'Insert /99 (Chrome, Encased)',
    parallels: 'Refractor, Gold Refractor /50, Red Refractor /10, SuperFractor 1/1'
  });
}

// Mass Symbiote Takeover
for (const [code, name] of symbiote) {
  allCards.push({
    cardNumber: code.trim(),
    name,
    cardType: 'Mass Symbiote Takeover',
    rarity: 'Insert (Chrome)',
    parallels: 'Refractor, Gold Refractor /50, Red Refractor /10, SuperFractor 1/1'
  });
}

// SDCC Exclusive Art
for (const [code, name] of sdccExclusive) {
  allCards.push({
    cardNumber: code,
    name,
    cardType: 'SDCC Exclusive (Ian McDonald Art)',
    rarity: 'SDCC Box Exclusive',
    parallels: 'Numbered /10'
  });
}

// Marvel Studios Autographs
for (const [code, name] of studioAutos) {
  allCards.push({
    cardNumber: code,
    name,
    cardType: 'Chrome Autograph - Marvel Studios',
    rarity: 'Autograph',
    parallels: 'Gold /50, Red /10, SuperFractor 1/1'
  });
}

// Comic Creator Autographs
for (const [code, name] of creatorAutos) {
  allCards.push({
    cardNumber: code,
    name,
    cardType: 'Chrome Autograph - Comic Creator',
    rarity: 'Autograph',
    parallels: 'Gold /50, Red /10, SuperFractor 1/1'
  });
}

// Special Hits
for (const [code, name] of specialHits) {
  allCards.push({
    cardNumber: code,
    name,
    cardType: name.includes('Cut') ? 'Cut Signature' : 'Comic Cut Relic',
    rarity: '1/1',
    parallels: null
  });
}

// Sketch Cards (generic entry)
allCards.push({
  cardNumber: 'SK',
  name: 'Sketch Card (Various Artists)',
  cardType: 'Sketch Card',
  rarity: '1/1 (Nearly 100 artists)',
  parallels: null
});

allCards.push({
  cardNumber: 'SK-SV',
  name: 'Spider-Man Villain Edition Sketch',
  cardType: 'Sketch Card - Spider-Man Villain Edition',
  rarity: '1/1',
  parallels: null
});

// Insert all cards
console.log(`\nInserting ${allCards.length} cards for 2026 Topps Marvel Mint...`);
const values = allCards.map(c => [MINT_2026_ID, c.cardNumber, c.name, c.cardType, c.rarity, c.parallels, null]);
const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(',');
const flat = values.flat();

await conn.execute(
  `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, rarity, parallels, imageUrl) VALUES ${placeholders}`,
  flat
);
console.log(`✅ Inserted ${allCards.length} cards`);

// Update total card count
const [countResult] = await conn.execute('SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = ?', [MINT_2026_ID]);
await conn.execute('UPDATE marvel_sets SET totalCards = ? WHERE id = ?', [countResult[0].cnt, MINT_2026_ID]);

console.log(`\n📊 Final count: ${countResult[0].cnt} cards in 2026 Topps Marvel Mint`);
console.log('\n✅ Done! Set available at /cards/2026-topps-marvel-mint');

await conn.end();
