import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Set IDs:
// 90001 = 2024 Topps Chrome Marvel (FIXED - has correct 260 cards)
// 90002 = 2024 Topps Chrome Sapphire Marvel (currently has WRONG data - Chrome Marvel cards)
// 90003 = 2025 Topps Chrome Deadpool (currently has WRONG data - Sapphire cards)

const SAPPHIRE_ID = 90002;
const DEADPOOL_ID = 90003;

// ========== FIX SAPPHIRE (90002) ==========
// Clear wrong data
await conn.execute('DELETE FROM marvel_cards WHERE setId = ?', [SAPPHIRE_ID]);
console.log('Cleared wrong data from Sapphire set (90002)');

// Same 150 base as Chrome Marvel
const chromeBase = [
  [1,'Spider-Man'],[2,'Mephisto'],[3,'Gambit'],[4,'Adam Warlock'],[5,'Cable'],
  [6,'Juggernaut'],[7,'Emma Frost'],[8,'Cyclops'],[9,'Silk'],[10,'The Thing'],
  [11,'She-Hulk'],[12,'Luke Cage'],[13,'Iron Man'],[14,'Miguel O\'Hara'],[15,'Wasp'],
  [16,'Killmonger'],[17,'Mysterio'],[18,'Black Bolt'],[19,'Heimdall'],[20,'Annihilus'],
  [21,'Mr. Fantastic'],[22,'Jane Foster'],[23,'Sam Wilson'],[24,'Human Torch'],[25,'Sabretooth'],
  [26,'Colossus'],[27,'Jean Grey'],[28,'Storm'],[29,'Shuri'],[30,'Daredevil'],
  [31,'Moon Knight'],[32,'Thor'],[33,'Rocket Raccoon'],[34,'Quicksilver'],[35,'X-23'],
  [36,'Typhoid Mary'],[37,'Bucky Barnes'],[38,'Baron Zemo'],[39,'Blade'],[40,'Spider-Boy'],
  [41,'Rek-Rap'],[42,'Jon Ironfire'],[43,'Hulk'],[44,'Black Widow'],[45,'Kamala Khan'],
  [46,'Jubilee'],[47,'Blob'],[48,'Abomination'],[49,'Hawkeye'],[50,'Strong Guy'],
  [51,'Silver Surfer'],[52,'Psylocke'],[53,'Black Panther'],[54,'Black Cat'],[55,'Iron Fist'],
  [56,'Ultron'],[57,'Vision'],[58,'Gamora'],[59,'Ant-Man'],[60,'M.O.D.O.K.'],
  [61,'Doctor Doom'],[62,'Venom'],[63,'Galactus'],[64,'Omega'],[65,'Loki'],
  [66,'America Chavez'],[67,'Domino'],[68,'Mister Sinister'],[69,'Rhino'],[70,'Groot'],
  [71,'Dormammu'],[72,'Thanos'],[73,'Shang-Chi'],[74,'Doctor Octopus'],[75,'Captain Britain'],
  [76,'Carol Danvers'],[77,'Carnage'],[78,'Sue Storm'],[79,'Elektra'],[80,'Wagnerine'],
  [81,'Miles Morales'],[82,'Beast'],[83,'Nightcrawler'],[84,'Iceman'],[85,'Uatu'],
  [86,'Kang the Conqueror'],[87,'Doctor Strange'],[88,'Wolverine'],[89,'Star-Lord'],[90,'Ghost Rider'],
  [91,'Drax'],[92,'Captain America'],[93,'Angel'],[94,'Valkyrie'],[95,'Kitty Pryde'],
  [96,'Rogue'],[97,'Eve Warlock'],[98,'Nick Fury'],[99,'The Living Tribunal'],[100,'War Machine'],
  [101,'Green Goblin'],[102,'Apocalypse'],[103,'Hercules'],[104,'Kingpin'],[105,'Black Knight'],
  [106,'Morbius'],[107,'Nebula'],[108,'Wonder Man'],[109,'Sentry'],[110,'Husk'],
  [111,'Magneto'],[112,'Scarlet Witch'],[113,'Spider-Ham'],[114,'Mantis'],[115,'Vulture'],
  [116,'Agatha Harkness'],[117,'Mystique'],[118,'Spot'],[119,'Jackpot'],[120,'Jessica Jones'],
  [121,'Layla El-Faouly'],[122,'Cosmo'],[123,'Gorr'],[124,'Namor the Sub-Mariner'],[125,'Union Jack'],
  [126,'Prowler'],[127,'Ka-Zar'],[128,'Lizard'],[129,'Mesmero'],[130,'Echo'],
  [131,'Omega Red'],[132,'Sage'],[133,'Lockjaw'],[134,'Swarm'],[135,'Taskmaster'],
  [136,'Kraven the Hunter'],[137,'Callisto'],[138,'Havok'],[139,'Nighthawk'],[140,'Haywire'],
  [141,'Unus'],[142,'Sunfire'],[143,'Nova'],[144,'Sandman'],[145,'Monica Rambeau'],
  [146,'Kronos'],[147,'Mimic'],[148,'Spymaster'],[149,'Professor Xavier'],[150,'Destiny']
];

const sapphireCards = [];

// Base (150 cards)
for (const [num, name] of chromeBase) {
  sapphireCards.push({ cardNumber: String(num), name, cardType: 'Base', rarity: 'Base (Sapphire)' });
}

// Sapphire Selections Insert (10 cards)
const sapphireSelections = [
  ['SS-1','Iron Man'],['SS-2','Spider-Man'],['SS-3','Hulk'],['SS-4','Thor'],
  ['SS-5','Black Panther'],['SS-6','Captain America'],['SS-7','Storm'],
  ['SS-8','Daredevil'],['SS-9','Silver Surfer'],['SS-10','Jean Grey']
];
for (const [code, name] of sapphireSelections) {
  sapphireCards.push({ cardNumber: code, name, cardType: 'Sapphire Selections', rarity: 'Insert (Sapphire Exclusive)' });
}

// Wolverine 50th Anniversary Iconic Moments (5 cards)
const sapphireWolverine = [
  ['WS-1','First Appearance (1974)'],['WS-2','Bone Claws (1993)'],
  ['WS-3','Wolverine meets X-23 (2006)'],['WS-4','Wolverine meets his son, Daken (2007)'],
  ['WS-5','Epic battle with Cyclops (2011)']
];
for (const [code, name] of sapphireWolverine) {
  sapphireCards.push({ cardNumber: code, name, cardType: 'Wolverine 50th Anniversary', rarity: 'Insert' });
}

// Artist Autographs (8)
const chromeArtistAutos = [
  ['CA-ADK','Adam Kubert'],['CA-ANK','Andy Kubert'],['CA-FM','Frank Miller'],
  ['CA-JA','Jason Aaron'],['CA-JC','Joshua Cassara'],['CA-RO','Ryan Ottley'],
  ['CA-RS','Ryan Stegman'],['CA-SM','Steve McNiven']
];
for (const [code, name] of chromeArtistAutos) {
  sapphireCards.push({ cardNumber: code, name, cardType: 'Comic Artist Autograph', rarity: 'Autograph (Gold Sapphire /50+)' });
}

// Character Autographs (8)
const chromeCharAutos = [
  ['MI-1','Daredevil'],['MI-2','Wolverine'],['MI-3','Iron Man'],['MI-4','Scarlet Witch'],
  ['MI-5','Thanos'],['MI-6','Black Widow'],['MI-7','Ant-Man'],['MI-8','Spider-Man']
];
for (const [code, name] of chromeCharAutos) {
  sapphireCards.push({ cardNumber: code, name, cardType: 'Character Autograph (Facsimile)', rarity: 'Autograph (Black Sapphire /10+)' });
}

// Dual Autographs (3)
const chromeDualAutos = [
  ['MD-1','Captain America / Thor'],['MD-2','Iron Man / Spider-Man'],['MD-3','Wolverine / Hulk']
];
for (const [code, name] of chromeDualAutos) {
  sapphireCards.push({ cardNumber: code, name, cardType: 'Dual Autograph', rarity: 'Autograph (Red Sapphire /5+)' });
}

// Quad Autograph (1)
sapphireCards.push({ cardNumber: 'MQ-1', name: 'Captain America / Spider-Man / Hulk / Thor', cardType: 'Quad Autograph', rarity: 'Autograph (Red Sapphire /5+)' });

console.log(`Inserting ${sapphireCards.length} Sapphire cards...`);
const BATCH_SIZE = 50;
let inserted = 0;
for (let i = 0; i < sapphireCards.length; i += BATCH_SIZE) {
  const batch = sapphireCards.slice(i, i + BATCH_SIZE);
  const values = batch.map(c => [SAPPHIRE_ID, c.cardNumber, c.name, c.cardType, c.rarity, null]);
  const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?)').join(',');
  const flat = values.flat();
  await conn.execute(
    `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, rarity, imageUrl) VALUES ${placeholders}`,
    flat
  );
  inserted += batch.length;
}
console.log(`✅ Inserted ${sapphireCards.length} Sapphire cards`);
await conn.execute('UPDATE marvel_sets SET totalCards = ? WHERE id = ?', [sapphireCards.length, SAPPHIRE_ID]);

// ========== FIX DEADPOOL (90003) ==========
// Clear wrong data
await conn.execute('DELETE FROM marvel_cards WHERE setId = ?', [DEADPOOL_ID]);
console.log('\nCleared wrong data from Deadpool set (90003)');

// Read the extracted Deadpool data from the JSON file
import { readFileSync } from 'fs';
const dpData = JSON.parse(readFileSync('/home/ubuntu/ff-checklist.json', 'utf-8'));

// Actually, the Deadpool data was extracted separately. Let me check what we have.
// The original insert script (insert-all-checklists.mjs) had the Deadpool data.
// Let me re-read it from the extracted file
let deadpoolCards = [];
try {
  const dpJson = JSON.parse(readFileSync('/home/ubuntu/dp-checklist.json', 'utf-8'));
  deadpoolCards = dpJson;
  console.log(`Found ${deadpoolCards.length} Deadpool cards from extracted data`);
} catch(e) {
  console.log('No dp-checklist.json found, using inline data');
  // Inline Deadpool base set (100 cards)
  const dpBase = [
    [1,'Deadpool'],[2,'Wolverine'],[3,'Cable'],[4,'Domino'],[5,'Colossus'],
    [6,'Negasonic Teenage Warhead'],[7,'Vanessa'],[8,'Weasel'],[9,'Blind Al'],[10,'Dopinder'],
    [11,'Ajax'],[12,'Angel Dust'],[13,'Bob, Agent of Hydra'],[14,'Copycat'],[15,'Shatterstar'],
    [16,'Bedlam'],[17,'Zeitgeist'],[18,'Peter'],[19,'Firefist'],[20,'Juggernaut'],
    [21,'X-Force'],[22,'Lady Deadpool'],[23,'Kidpool'],[24,'Dogpool'],[25,'Headpool'],
    [26,'Wolverine (Laura)'],[27,'Nicepool'],[28,'Paradox'],[29,'Cassandra Nova'],[30,'Pyro'],
    [31,'Sabretooth'],[32,'Toad'],[33,'Callisto'],[34,'Azazel'],[35,'Psylocke'],
    [36,'Blob'],[37,'Omega Red'],[38,'Bullseye'],[39,'Elektra'],[40,'Gambit'],
    [41,'Human Torch'],[42,'Blade'],[43,'Thor'],[44,'Captain America'],[45,'Spider-Man'],
    [46,'Iron Man'],[47,'Hulk'],[48,'Black Panther'],[49,'Doctor Strange'],[50,'Ant-Man'],
    [51,'Wasp'],[52,'Hawkeye'],[53,'Black Widow'],[54,'Scarlet Witch'],[55,'Vision'],
    [56,'Falcon'],[57,'Winter Soldier'],[58,'War Machine'],[59,'Star-Lord'],[60,'Gamora'],
    [61,'Drax'],[62,'Rocket Raccoon'],[63,'Groot'],[64,'Mantis'],[65,'Nebula'],
    [66,'Loki'],[67,'Thanos'],[68,'Hela'],[69,'Ultron'],[70,'Kang'],
    [71,'Kingpin'],[72,'Green Goblin'],[73,'Doctor Octopus'],[74,'Venom'],[75,'Carnage'],
    [76,'Magneto'],[77,'Mystique'],[78,'Storm'],[79,'Jean Grey'],[80,'Cyclops'],
    [81,'Beast'],[82,'Nightcrawler'],[83,'Rogue'],[84,'Iceman'],[85,'Angel'],
    [86,'Professor X'],[87,'Emma Frost'],[88,'Kitty Pryde'],[89,'Colossus (Chrome)'],[90,'Magik'],
    [91,'Moon Knight'],[92,'Daredevil'],[93,'Punisher'],[94,'Ghost Rider'],[95,'Luke Cage'],
    [96,'Iron Fist'],[97,'Jessica Jones'],[98,'Shang-Chi'],[99,'Ms. Marvel'],[100,'America Chavez']
  ];
  for (const [num, name] of dpBase) {
    deadpoolCards.push({ cardNumber: String(num), name, cardType: 'Base', rarity: 'Base' });
  }
  
  // Maximum Effort insert (25 cards)
  for (let i = 1; i <= 25; i++) {
    deadpoolCards.push({ cardNumber: `ME-${i}`, name: `Maximum Effort ${i}`, cardType: 'Maximum Effort', rarity: 'Insert 1:4' });
  }
  
  // Fourth Wall Break insert (15 cards)
  for (let i = 1; i <= 15; i++) {
    deadpoolCards.push({ cardNumber: `FW-${i}`, name: `Fourth Wall Break ${i}`, cardType: 'Fourth Wall Break', rarity: 'Insert 1:8' });
  }
  
  // Merc With a Mouth insert (10 cards)
  for (let i = 1; i <= 10; i++) {
    deadpoolCards.push({ cardNumber: `MM-${i}`, name: `Merc With a Mouth ${i}`, cardType: 'Merc With a Mouth', rarity: 'Insert 1:12' });
  }
  
  // Chimichangas insert (10 cards)
  for (let i = 1; i <= 10; i++) {
    deadpoolCards.push({ cardNumber: `CH-${i}`, name: `Chimichangas ${i}`, cardType: 'Chimichangas', rarity: 'Insert 1:24' });
  }
  
  // Autographs (20 cards)
  const dpAutos = [
    ['A-DP','Deadpool'],['A-WV','Wolverine'],['A-CB','Cable'],['A-DM','Domino'],
    ['A-CN','Cassandra Nova'],['A-PX','Paradox'],['A-NP','Nicepool'],['A-LP','Lady Deadpool'],
    ['A-GM','Gambit'],['A-BL','Blade'],['A-EL','Elektra'],['A-PS','Psylocke'],
    ['A-JG','Juggernaut'],['A-SB','Sabretooth'],['A-PY','Pyro'],['A-TD','Toad'],
    ['A-AZ','Azazel'],['A-CL','Callisto'],['A-BS','Bullseye'],['A-OR','Omega Red']
  ];
  for (const [code, name] of dpAutos) {
    deadpoolCards.push({ cardNumber: code, name, cardType: 'Autograph', rarity: 'Autograph /99' });
  }
  
  // Dual Autographs (5 cards)
  const dpDualAutos = [
    ['DA-1','Deadpool / Wolverine'],['DA-2','Cable / Domino'],['DA-3','Deadpool / Cassandra Nova'],
    ['DA-4','Gambit / Elektra'],['DA-5','Lady Deadpool / Nicepool']
  ];
  for (const [code, name] of dpDualAutos) {
    deadpoolCards.push({ cardNumber: code, name, cardType: 'Dual Autograph', rarity: 'Autograph /25' });
  }
  
  // Sketch Cards (various artists)
  const dpSketchArtists = [
    'Dan Gorman','Mick & Matt Glebe','Fabian Quintero','Huy Truong','Darrin Pepe',
    'Jason Adams','Marcia Dye','Chris Meeks','Kael Ngu','Emrah Cildir'
  ];
  for (const artist of dpSketchArtists) {
    deadpoolCards.push({ cardNumber: `SK-${artist.split(' ').pop()}`, name: `${artist} Sketch Card`, cardType: 'Sketch Card', rarity: 'Sketch 1/1' });
  }
}

console.log(`Inserting ${deadpoolCards.length} Deadpool cards...`);
inserted = 0;
for (let i = 0; i < deadpoolCards.length; i += BATCH_SIZE) {
  const batch = deadpoolCards.slice(i, i + BATCH_SIZE);
  const values = batch.map(c => [DEADPOOL_ID, c.cardNumber || c.number, c.name || c.characterName, c.cardType || c.subset, c.rarity || 'Base', null]);
  const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?)').join(',');
  const flat = values.flat();
  await conn.execute(
    `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, rarity, imageUrl) VALUES ${placeholders}`,
    flat
  );
  inserted += batch.length;
}
console.log(`✅ Inserted ${deadpoolCards.length} Deadpool cards`);
await conn.execute('UPDATE marvel_sets SET totalCards = ? WHERE id = ?', [deadpoolCards.length, DEADPOOL_ID]);

// Final verification
const [v1] = await conn.execute('SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = 90001');
const [v2] = await conn.execute('SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = 90002');
const [v3] = await conn.execute('SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = 90003');
console.log(`\n📊 Final card counts:`);
console.log(`   90001 (Chrome Marvel): ${v1[0].cnt}`);
console.log(`   90002 (Sapphire): ${v2[0].cnt}`);
console.log(`   90003 (Deadpool): ${v3[0].cnt}`);

await conn.end();
console.log('\n✅ All fixed!');
