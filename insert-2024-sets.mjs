import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Set IDs from the database
const CHROME_MARVEL_ID = 90002; // 2024-topps-chrome-marvel
const SAPPHIRE_ID = 90003; // 2024-topps-chrome-sapphire-marvel

// First clear any existing cards for these sets
await conn.execute('DELETE FROM marvel_cards WHERE setId = ?', [CHROME_MARVEL_ID]);
await conn.execute('DELETE FROM marvel_cards WHERE setId = ?', [SAPPHIRE_ID]);
console.log('Cleared existing cards for both 2024 sets');

// ========== 2024 TOPPS CHROME MARVEL ==========
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

const chromeArtistAutos = [
  ['CA-ADK','Adam Kubert'],['CA-ANK','Andy Kubert'],['CA-FM','Frank Miller'],
  ['CA-JA','Jason Aaron'],['CA-JC','Joshua Cassara'],['CA-RO','Ryan Ottley'],
  ['CA-RS','Ryan Stegman'],['CA-SM','Steve McNiven']
];

const chromeCharAutos = [
  ['MI-1','Daredevil'],['MI-2','Wolverine'],['MI-3','Iron Man'],['MI-4','Scarlet Witch'],
  ['MI-5','Thanos'],['MI-6','Black Widow'],['MI-7','Ant-Man'],['MI-8','Spider-Man']
];

const chromeDualAutos = [
  ['MD-1','Captain America / Thor'],['MD-2','Iron Man / Spider-Man'],['MD-3','Wolverine / Hulk']
];

const chromeQuadAuto = [['MQ-1','Captain America / Spider-Man / Hulk / Thor']];

const chromeDaredevil60th = [
  ['DD-1','Daredevil'],['DD-2','Kingpin'],['DD-3','Bullseye'],['DD-4','Elektra'],
  ['DD-5','Gets Red Suit, Battles Sub-Mariner'],['DD-6','Roulette With Bullseye'],
  ['DD-7','Payback for His Dad\'s Killer'],['DD-8','Secret Identity Revealed'],
  ['DD-9','Escape\'s Doctor Doom\'s Castle'],['DD-10','Battle in Wakanda, Rescues Mom']
];

const chromeMarvel90s = [
  ['MN-1','Iron Man #2'],['MN-2','Morbius: The Living Vampire #1'],['MN-3','Ghost Rider #1'],
  ['MN-4','Namor the Sub-Mariner #15'],['MN-5','Hulk: Future Imperfect #2'],
  ['MN-6','Deathlok #9'],['MN-7','Warlock Chronicles #3'],['MN-8','Darkhawk #7'],
  ['MN-9','Guardians of the Galaxy #5'],['MN-10','Elektra #14']
];

const chromeGiantSized = [
  ['MG-1','Giant-Size Super-Stars #1'],['MG-2','Giant-Size Master of Kung Fu #2'],
  ['MG-3','Giant-Size Avengers #1'],['MG-4','Giant-Size X-Men #1'],
  ['MG-5','Giant-Size Super-Villain Team-Up #2'],['MG-6','Giant-Size Man-Thing #3'],
  ['MG-7','Giant-Size Fantastic Four #4'],['MG-8','Giant-Size Werewolf by Night #4'],
  ['MG-9','Giant-Size Defenders #1'],['MG-10','Giant-Size Avengers #4']
];

const chromeGiantSizedBoxToppers = [
  ['MGG-1','Giant-Size Super-Stars #1'],['MGG-2','Giant-Size Master of Kung Fu #2'],
  ['MGG-3','Giant-Size Avengers #1'],['MGG-4','Giant-Size X-Men #1'],
  ['MGG-5','Giant-Size Super-Villain Team-Up #2'],['MGG-6','Giant-Size Man-Thing #3'],
  ['MGG-7','Giant-Size Fantastic Four #4'],['MGG-8','Giant-Size Werewolf by Night #4'],
  ['MGG-9','Giant-Size Defenders #1'],['MGG-10','Giant-Size Avengers #4']
];

const chromeIcons = [
  ['MI-1','Spider-Man'],['MI-2','Black Panther'],['MI-3','Daredevil'],['MI-4','Scarlet Witch'],
  ['MI-5','Captain America'],['MI-6','Thanos'],['MI-7','Human Torch'],['MI-8','Venom'],
  ['MI-9','Loki'],['MI-10','Ant-Man']
];

const chromeSpiderGold = [
  ['SG-1','Amazing Spider-Man Full Circle #1'],['SG-2','The Spectacular Spider-Man #2'],
  ['SG-3','Savage Spider-Man #1'],['SG-4','The Amazing Spider-Man #1'],
  ['SG-5','The Amazing Spider-Man #2'],['SG-6','Amazing Spider-Man: Renew Your Vows #23'],
  ['SG-7','The Amazing Spider-Man #100'],['SG-8','The Amazing Spider-Man #792'],
  ['SG-9','Monsters Unleashed #3'],['SG-10','The Amazing Spider-Man #29']
];

const chromeAvengersInfinity = [
  ['AI-1','Captain America'],['AI-2','Black Widow'],['AI-3','The Hulk'],
  ['AI-4','Iron Man'],['AI-5','Thor']
];

const chromeIndestructible = [
  ['I-1','Hulk'],['I-2','Jean Grey'],['I-3','Iron Man'],['I-4','Thor'],
  ['I-5','Wolverine'],['I-6','Colossus'],['I-7','Adam Warlock'],
  ['I-8','Juggernaut'],['I-9','Thing'],['I-10','Galactus']
];

const chromeMaskOnOff = [
  ['MO-1','Peter Parker'],['MO-2','Tony Stark'],['MO-3','Scott Lang'],
  ['MO-4','King T\'Challa'],['MO-5','Steve Rogers'],['MO-6','Matthew Murdock'],
  ['MO-7','Janet Van Dyne'],['MO-8','James Howlett'],['MO-9','Marc Spector']
];

const chromeWolverine50th = [
  ['WC-1','Wolverine 1'],['WC-2','Wolverine 2'],['WC-3','Wolverine 3'],
  ['WC-4','Wolverine 4'],['WC-5','Wolverine 5']
];

// Build all Chrome Marvel cards
const chromeCards = [];

// Base set
for (const [num, name] of chromeBase) {
  chromeCards.push({
    cardNumber: String(num),
    name,
    cardType: 'Base',
    rarity: 'Base',
    setId: CHROME_MARVEL_ID
  });
}

// Artist Autographs
for (const [code, name] of chromeArtistAutos) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Comic Artist Autograph', rarity: 'Autograph /99', setId: CHROME_MARVEL_ID });
}

// Frank Miller Sketch
chromeCards.push({ cardNumber: 'FM-SK', name: 'Frank Miller Daredevil 60th Anniversary Sketch', cardType: 'Sketch Card', rarity: 'Sketch 1:14,457', setId: CHROME_MARVEL_ID });

// Character Autographs
for (const [code, name] of chromeCharAutos) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Character Autograph (Facsimile)', rarity: 'Autograph /99', setId: CHROME_MARVEL_ID });
}

// Dual Autographs
for (const [code, name] of chromeDualAutos) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Dual Autograph', rarity: 'Autograph /25', setId: CHROME_MARVEL_ID });
}

// Quad Autograph
for (const [code, name] of chromeQuadAuto) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Quad Autograph', rarity: 'Autograph /10', setId: CHROME_MARVEL_ID });
}

// Daredevil 60th Anniversary Insert
for (const [code, name] of chromeDaredevil60th) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Daredevil 60th Anniversary', rarity: 'Insert 1:12', setId: CHROME_MARVEL_ID });
}

// Marvel 90s Insert
for (const [code, name] of chromeMarvel90s) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Marvel 90s', rarity: 'Insert 1:12', setId: CHROME_MARVEL_ID });
}

// Giant-Sized 50th Anniversary Insert
for (const [code, name] of chromeGiantSized) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Giant-Sized 50th Anniversary', rarity: 'Insert 1:12', setId: CHROME_MARVEL_ID });
}

// Giant-Sized 50th Anniversary Box Toppers
for (const [code, name] of chromeGiantSizedBoxToppers) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Giant-Sized 50th Box Topper', rarity: '1 per Hobby Box', setId: CHROME_MARVEL_ID });
}

// Marvel Icons Insert
for (const [code, name] of chromeIcons) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Marvel Icons', rarity: 'Insert 1:12', setId: CHROME_MARVEL_ID });
}

// Spider-Man Gold Insert
for (const [code, name] of chromeSpiderGold) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Spider-Man Gold', rarity: 'Insert 1:72', setId: CHROME_MARVEL_ID });
}

// Avengers Infinity (Scarce)
for (const [code, name] of chromeAvengersInfinity) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Avengers Infinity', rarity: 'Black Wave /10 - 1:9,036', setId: CHROME_MARVEL_ID });
}

// Indestructible (Scarce)
for (const [code, name] of chromeIndestructible) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Indestructible', rarity: 'Black Lazer /10 - 1:4,566', setId: CHROME_MARVEL_ID });
}

// Mask On, Mask Off (Scarce)
for (const [code, name] of chromeMaskOnOff) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Mask On, Mask Off', rarity: 'Black Wave /10 - 1:5,043', setId: CHROME_MARVEL_ID });
}

// Wolverine 50th Anniversary (Scarce)
for (const [code, name] of chromeWolverine50th) {
  chromeCards.push({ cardNumber: code, name, cardType: 'Wolverine 50th Anniversary', rarity: 'Black Wave /10 - 1:9,036', setId: CHROME_MARVEL_ID });
}

// ========== 2024 TOPPS CHROME SAPPHIRE MARVEL ==========
const sapphireCards = [];

// Same 150 base as Chrome Marvel
for (const [num, name] of chromeBase) {
  sapphireCards.push({
    cardNumber: String(num),
    name,
    cardType: 'Base',
    rarity: 'Base (Sapphire)',
    setId: SAPPHIRE_ID
  });
}

// Sapphire Selections Insert (10 cards)
const sapphireSelections = [
  ['SS-1','Iron Man'],['SS-2','Spider-Man'],['SS-3','Hulk'],['SS-4','Thor'],
  ['SS-5','Black Panther'],['SS-6','Captain America'],['SS-7','Storm'],
  ['SS-8','Daredevil'],['SS-9','Silver Surfer'],['SS-10','Jean Grey']
];
for (const [code, name] of sapphireSelections) {
  sapphireCards.push({ cardNumber: code, name, cardType: 'Sapphire Selections', rarity: 'Insert (Sapphire Exclusive)', setId: SAPPHIRE_ID });
}

// Wolverine 50th Anniversary Iconic Moments (5 cards)
const sapphireWolverine = [
  ['WS-1','First Appearance (1974)'],['WS-2','Bone Claws (1993)'],
  ['WS-3','Wolverine meets X-23 (2006)'],['WS-4','Wolverine meets his son, Daken (2007)'],
  ['WS-5','Epic battle with Cyclops (2011)']
];
for (const [code, name] of sapphireWolverine) {
  sapphireCards.push({ cardNumber: code, name, cardType: 'Wolverine 50th Anniversary', rarity: 'Insert', setId: SAPPHIRE_ID });
}

// Artist Autographs (same 8 as Chrome)
for (const [code, name] of chromeArtistAutos) {
  sapphireCards.push({ cardNumber: code, name, cardType: 'Comic Artist Autograph', rarity: 'Autograph (Gold Sapphire /50+)', setId: SAPPHIRE_ID });
}

// Character Autographs (same 8)
for (const [code, name] of chromeCharAutos) {
  sapphireCards.push({ cardNumber: code, name, cardType: 'Character Autograph (Facsimile)', rarity: 'Autograph (Black Sapphire /10+)', setId: SAPPHIRE_ID });
}

// Dual Autographs (same 3)
for (const [code, name] of chromeDualAutos) {
  sapphireCards.push({ cardNumber: code, name, cardType: 'Dual Autograph', rarity: 'Autograph (Red Sapphire /5+)', setId: SAPPHIRE_ID });
}

// Quad Autograph (same 1)
for (const [code, name] of chromeQuadAuto) {
  sapphireCards.push({ cardNumber: code, name, cardType: 'Quad Autograph', rarity: 'Autograph (Red Sapphire /5+)', setId: SAPPHIRE_ID });
}

// Insert all Chrome Marvel cards
console.log(`Inserting ${chromeCards.length} cards for 2024 Topps Chrome Marvel...`);
const chromeValues = chromeCards.map(c => [c.setId, c.cardNumber, c.name, c.cardType, c.rarity, null]);
const chromePlaceholders = chromeValues.map(() => '(?, ?, ?, ?, ?, ?)').join(',');
const chromeFlat = chromeValues.flat();
await conn.execute(
  `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, rarity, imageUrl) VALUES ${chromePlaceholders}`,
  chromeFlat
);
console.log(`✅ Inserted ${chromeCards.length} Chrome Marvel cards`);

// Insert all Sapphire cards
console.log(`Inserting ${sapphireCards.length} cards for 2024 Topps Chrome Sapphire Marvel...`);
const sapphireValues = sapphireCards.map(c => [c.setId, c.cardNumber, c.name, c.cardType, c.rarity, null]);
const sapphirePlaceholders = sapphireValues.map(() => '(?, ?, ?, ?, ?, ?)').join(',');
const sapphireFlat = sapphireValues.flat();
await conn.execute(
  `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, rarity, imageUrl) VALUES ${sapphirePlaceholders}`,
  sapphireFlat
);
console.log(`✅ Inserted ${sapphireCards.length} Chrome Sapphire Marvel cards`);

// Update set card counts
const [chromeCount] = await conn.execute('SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = ?', [CHROME_MARVEL_ID]);
const [sapphireCount] = await conn.execute('SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = ?', [SAPPHIRE_ID]);
await conn.execute('UPDATE marvel_sets SET totalCards = ? WHERE id = ?', [chromeCount[0].cnt, CHROME_MARVEL_ID]);
await conn.execute('UPDATE marvel_sets SET totalCards = ? WHERE id = ?', [sapphireCount[0].cnt, SAPPHIRE_ID]);

console.log(`\n📊 Final counts:`);
console.log(`   2024 Chrome Marvel: ${chromeCount[0].cnt} cards`);
console.log(`   2024 Chrome Sapphire: ${sapphireCount[0].cnt} cards`);

await conn.end();
console.log('\n✅ Done!');
