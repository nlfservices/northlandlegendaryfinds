import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const SET_ID = 90004;

// Card data organized by subset
const cards = [
  // === BASE CARDS (50) ===
  ...Array.from({length: 50}, (_, i) => ({
    cardNumber: String(i + 1),
    characterName: [
      'Captain America', 'Bucky Barnes', 'Nick Fury', 'Union Jack', 'Namor',
      'Arnim Zola', 'Crossbones', 'Thor', 'Iron Man', 'Ant-Man',
      'Wasp', 'Hawkeye', 'Sharon Carter', 'Black Widow', 'Hulk',
      'Falcon', 'Batroc The Leaper', 'Baron Zemo', 'Madame Hydra', 'Diamondback',
      'Iron Fist', 'Taskmaster', 'Spider-Man', 'Black Panther', 'Loki',
      'Thanos', 'Red Guardian', 'Baron Strucker', 'U.S. Agent', 'Wolverine',
      'Scarlet Witch', 'Battlestar', 'Vision', 'Quicksilver', 'Doctor Doom',
      'Ultron', 'Kang The Conqueror', 'Cyclops', 'Human Torch', 'M.O.D.O.K.',
      'Doctor Strange', 'Doctor Faustus', 'War Machine', 'Flag-Smasher', 'Luke Cage',
      'Mephisto', 'The Thing', 'Daredevil', 'Beast', 'Wonder Man'
    ][i],
    cardType: 'Base',
    parallels: 'Chartreuse /199, Black /150, Gold /99, Blue and Silver /75, Orange /50, Purple /25, Red /10, Foilfractor 1/1',
    rarity: 'Common'
  })),

  // === NEW YORK'S HEROES (25) ===
  ...['Captain America', 'Spider-Man', 'Daredevil', 'Luke Cage', 'Doctor Strange',
    'The Thing', 'Jessica Jones', 'Moon Knight', 'Iron Man', 'Hawkeye',
    'Wasp', 'Iron Fist', 'Invisible Woman', 'Misty Knight', 'Miles Morales',
    'Cloak & Dagger', 'Flash Thompson', 'Mister Fantastic', 'Nick Fury', 'Human Torch',
    'Prowler', 'Firestar', 'Professor X', 'Kate Bishop', 'Ghost-Spider'
  ].map((name, i) => ({
    cardNumber: `NYF-${i + 1}`,
    characterName: name,
    cardType: "New York's Heroes",
    parallels: 'Gold /99, Orange /50, Purple /25, Red /10, Foilfractor 1/1',
    rarity: 'Insert'
  })),

  // === WELCOME TO BROOKLYN POSTCARD (25) ===
  ...['Bay Ridge', 'Bed-Stuy', 'Brooklyn Heights', 'Navy Yard', 'Bushwick',
    'Canarsie', 'Carroll Gardens', 'Cobble Hill', 'Coney Island', 'Crown Heights',
    'Dumbo', 'Downtown Brooklyn', 'Dyker Heights', 'Williamsburg', 'Flatbush',
    'Fort Greene', 'Gowanus', 'Greenpoint', 'Manhattan Beach', 'Park Slope',
    'Prospect Heights', 'Prospect Park', 'Bensonhurst', 'Sheepshead Bay', 'Sunset Park'
  ].map((name, i) => ({
    cardNumber: `WB-${i + 1}`,
    characterName: name,
    cardType: 'Welcome to Brooklyn',
    parallels: 'Gold /99, Orange /50, Purple /25, Red /10, Foilfractor 1/1',
    rarity: 'Insert'
  })),

  // === TEAM CAP (25) ===
  ...['Winter Soldier', 'Falcon', 'Iron Fist', 'Thor', 'Black Widow',
    'Namor', 'Captain Marvel', 'Hawkeye', 'Hercules', 'Luke Cage',
    'Wolverine', 'Spider-Man', 'Cable', 'Black Panther', 'Human Torch',
    'Nick Fury', 'Cyclops', 'Daredevil', 'Doctor Strange', 'Professor X',
    'Ghost Rider', 'Beast', 'Scarlet Witch', 'Jessica Jones', 'Vision'
  ].map((name, i) => ({
    cardNumber: `TC-${i + 1}`,
    characterName: name,
    cardType: 'Team Cap',
    parallels: 'Orange /50, Purple /25, Red /10, Foilfractor 1/1',
    rarity: 'Insert'
  })),

  // === LIVING LEGEND (25) ===
  ...['Avengers (1963) #4', 'Captain America (1968) #117', 'Captain America (1968) #332',
    'Captain America (1968) #109', 'Captain America (1968) #354', 'Thor (1966) #390',
    'Strange Tales (1951) #114', 'Captain America (1968) #110', 'Captain America (1968) #208',
    'Captain America (1968) #100', 'Invaders (1975) #3', 'Captain America (1968) #230',
    'Captain America (1968) #218', 'Captain America (1968) #251', 'Fear Itself (2010) #7',
    'All Winners (1941) #2', 'Marvel Mystery Comics (1939) #84', 'Avengers (1963) #117',
    'Amazing Spider-Man (1963) #187', 'Defenders (1972) #106', 'Tales of Suspense (1959) #63',
    'Captain America (1968) #337', 'Captain America (1968) #171', 'Captain America (1968) #137',
    'Uncanny X-Men (1963) #268'
  ].map((name, i) => ({
    cardNumber: `NH-${i + 1}`,
    characterName: name,
    cardType: 'Living Legend',
    parallels: 'Orange /50, Purple /25, Red /10, Foilfractor 1/1',
    rarity: 'Insert'
  })),

  // === TOPPS DISTINGUISHED SERVICE (25) ===
  ...['Captain America', 'Bucky Barnes', 'War Machine', 'Captain Marvel', 'Peggy Carter',
    'Yelena Belova', 'Colonel Chester Phillips', 'Captain America', 'Nick Fury', 'Thaddeus Ross',
    'Moon Knight', 'Wolverine', 'Black Widow', 'John F. Walker', 'Falcon',
    'Hawkeye', 'Isaiah Bradley', 'Abomination', 'Bullseye', 'Red Guardian',
    'Maria Hill', 'The Thing', 'Sharon Carter', 'Dum Dum Dugan', 'Agent Coulson'
  ].map((name, i) => ({
    cardNumber: `DS-${i + 1}`,
    characterName: name,
    cardType: 'Distinguished Service',
    parallels: 'Gold /99, Orange /50, Purple /25, Red /10, Foilfractor 1/1',
    rarity: 'Insert'
  })),

  // === YOU ARE WORTHY PETG (10) ===
  ...['Thor', 'Thor', 'Mighty Thor', 'Mighty Thor', 'Beta Ray Bill',
    'Captain America', 'Captain America', 'Captain America', 'Captain America', 'Captain America'
  ].map((name, i) => ({
    cardNumber: `AW-${i + 1}`,
    characterName: name,
    cardType: 'You Are Worthy',
    parallels: '',
    rarity: 'Premium Insert'
  })),

  // === BORN ON THE 4TH OF JULY (10) ===
  ...Array.from({length: 10}, (_, i) => ({
    cardNumber: `FOJ-${i + 1}`,
    characterName: 'Captain America',
    cardType: 'Born on the 4th of July',
    parallels: '',
    rarity: 'Premium Insert'
  })),

  // === BROOKLYN STATUE (5) ===
  ...['Steve Rogers', 'Steve Rogers', 'Steve Rogers', 'Bucky Barnes', 'Sam Wilson'
  ].map((name, i) => ({
    cardNumber: `CBS-${i + 1}`,
    characterName: name,
    cardType: 'Brooklyn Statue',
    parallels: 'Purple /25, Red /10, Foilfractor 1/1',
    rarity: 'Super Premium Insert'
  })),

  // === MCU AUTOGRAPHS (41) ===
  ...[
    ['MUA-AM', 'Anthony Mackie'], ['MUA-AS', 'Andy Serkis'], ['MUA-ATJ', 'Aaron Taylor-Johnson'],
    ['MUA-BC', 'Bradley Cooper'], ['MUA-BL', 'Brie Larson'], ['MUA-BR', 'Bruno Ricci'],
    ['MUA-CE', 'Chris Evans'], ['MUA-CG', 'Clark Gregg'], ['MUA-CL', 'Carl Lumbly'],
    ['MUA-CS', 'Cobie Smulders'], ['MUA-DC', 'Dominic Cooper'], ['MUA-DCH', 'Don Cheadle'],
    ['MUA-DL', 'Derek Luke'], ['MUA-DR', 'Danny Ramirez'], ['MUA-EK', 'Erin Kellyman'],
    ['MUA-EL', 'Evangeline Lilly'], ['MUA-EO', 'Elizabeth Olsen'], ['MUA-FG', 'Frank Grillo'],
    ['MUA-GE', 'Giancarlo Esposito'], ['MUA-HA', 'Hayley Atwell'], ['MUA-HF', 'Harrison Ford'],
    ['MUA-HJ', 'Hugh Jackman'], ['MUA-JB', 'Josh Brolin'], ['MUA-JJF', 'JJ Feild'],
    ['MUA-JLD', 'Julia Louis-Dreyfus'], ['MUA-JR', 'Jeremy Renner'], ['MUA-KC', 'Kenneth Choi'],
    ['MUA-KG', 'Karen Gillan'], ['MUA-LP', 'Lewis Pullman'], ['MUA-MBJ', 'Michael B. Jordan'],
    ['MUA-ND', 'Natalie Dormer'], ['MUA-NM', 'Neal McDonough'], ['MUA-PB', 'Paul Bettany'],
    ['MUA-PK', 'Pom Klementieff'], ['MUA-PR', 'Paul Rudd'], ['MUA-RA', 'Richard Armitage'],
    ['MUA-SH', 'Shira Haas'], ['MUA-SLJ', 'Samuel L. Jackson'], ['MUA-SS', 'Sebastian Stan'],
    ['MUA-STB', 'Shaun Toub'], ['MUA-STS', 'Stellan Skarsgard'], ['MUA-WR', 'Wyatt Russell']
  ].map(([num, name]) => ({
    cardNumber: num,
    characterName: name,
    cardType: 'MCU Autograph',
    parallels: 'Orange /25, Purple /10, Red /5, Foilfractor 1/1',
    rarity: 'Autograph'
  })),

  // === MCU DUAL AUTOGRAPHS (9 unique cards) ===
  ...[
    ['MDA-EA', 'Hayley Atwell / Chris Evans'],
    ['MDA-EM', 'Anthony Mackie / Chris Evans'],
    ['MDA-HR', 'Wyatt Russell / David Harbour'],
    ['MDA-JG', 'Clark Gregg / Samuel L. Jackson'],
    ['MDA-LJM', 'Cobie Smulders / Samuel L. Jackson'],
    ['MDA-ML', 'Carl Lumbly / Anthony Mackie'],
    ['MDA-MR', 'Danny Ramirez / Anthony Mackie'],
    ['MDA-MS', 'Sebastian Stan / Anthony Mackie'],
    ['MDA-SM', 'Chris Evans / Sebastian Stan']
  ].map(([num, name]) => ({
    cardNumber: num,
    characterName: name,
    cardType: 'MCU Dual Autograph',
    parallels: 'Red /5, Foilfractor 1/1',
    rarity: 'Dual Autograph'
  })),

  // === MCU TRIPLE AUTOGRAPHS (6 unique cards) ===
  ...[
    ['MTA-AEC', 'Hayley Atwell / Dominic Cooper / Chris Evans'],
    ['MTA-ESM', 'Chris Evans / Anthony Mackie / Sebastian Stan'],
    ['MTA-MLR', 'Anthony Mackie / Carl Lumbly / Danny Ramirez'],
    ['MTA-MRO', 'Elizabeth Olsen / Paul Rudd / Anthony Mackie'],
    ['MTA-MST', 'Don Cheadle / Sebastian Stan / Anthony Mackie'],
    ['MTA-SRH', 'Sebastian Stan / David Harbour / Wyatt Russell']
  ].map(([num, name]) => ({
    cardNumber: num,
    characterName: name,
    cardType: 'MCU Triple Autograph',
    parallels: 'Red /5, Foilfractor 1/1',
    rarity: 'Triple Autograph'
  })),

  // === COMIC CREATOR AUTOGRAPHS (10) ===
  ...[
    ['CCA-AK', 'Adam Kubert'], ['CCA-ER', 'Esad Ribic'], ['CCA-LP', 'Lucio Parrillo'],
    ['CCA-MD', 'Mike Deodato'], ['CCA-MK', 'Mike McKone'], ['CCA-MS', 'Marc Silvestri'],
    ['CCA-PM', 'Paco Medina'], ['CCA-RB', 'Ryan Brown'], ['CCA-RS', 'Ryan Stegman'],
    ['CCA-SM', 'Steve McNiven']
  ].map(([num, name]) => ({
    cardNumber: num,
    characterName: name,
    cardType: 'Comic Creator Autograph',
    parallels: 'Orange /25, Purple /10, Red /5, Foilfractor 1/1',
    rarity: 'Autograph'
  }))
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // First, delete any existing cards for this set (in case of re-run)
  await conn.query('DELETE FROM marvel_cards WHERE setId = ?', [SET_ID]);
  console.log('Cleared existing cards for set', SET_ID);

  // Get image URLs from Marvel Mint for characters that match
  const [mintCards] = await conn.query(
    "SELECT characterName, imageUrl FROM marvel_cards WHERE setId = (SELECT id FROM marvel_sets WHERE slug = '2025-topps-marvel-mint') AND imageUrl IS NOT NULL"
  );
  const mintImageMap = {};
  mintCards.forEach(c => {
    if (c.imageUrl && !mintImageMap[c.characterName]) {
      mintImageMap[c.characterName] = c.imageUrl;
    }
  });
  console.log(`Found ${Object.keys(mintImageMap).length} character images from Marvel Mint`);

  // Insert in batches of 50
  let sortOrder = 1;
  const batchSize = 50;
  for (let i = 0; i < cards.length; i += batchSize) {
    const batch = cards.slice(i, i + batchSize);
    const values = batch.map(card => [
      SET_ID,
      card.cardNumber,
      card.characterName,
      card.cardType,
      card.parallels || null,
      card.rarity,
      mintImageMap[card.characterName] || null,
      sortOrder++,
      null // sourceId
    ]);
    
    await conn.query(
      'INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, rarity, imageUrl, sortOrder, sourceId) VALUES ?',
      [values]
    );
    console.log(`Inserted batch ${Math.floor(i/batchSize) + 1} (${batch.length} cards)`);
  }

  // Update totalCards count on the set
  const [countResult] = await conn.query('SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = ?', [SET_ID]);
  const totalCards = countResult[0].cnt;
  await conn.query('UPDATE marvel_sets SET totalCards = ? WHERE id = ?', [totalCards, SET_ID]);
  console.log(`\nDone! Inserted ${totalCards} cards into Brooklyn Collection set.`);
  
  // Show breakdown by cardType
  const [breakdown] = await conn.query('SELECT cardType, COUNT(*) as cnt FROM marvel_cards WHERE setId = ? GROUP BY cardType ORDER BY cnt DESC', [SET_ID]);
  console.log('\nBreakdown by card type:');
  breakdown.forEach(r => console.log(`  ${r.cardType}: ${r.cnt}`));

  await conn.end();
}

main().catch(console.error);
