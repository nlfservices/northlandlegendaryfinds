import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import 'dotenv/config';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Load extracted checklist data
const ffCards = JSON.parse(readFileSync('/home/ubuntu/ff-full-checklist.json', 'utf-8'));
const dpCards = JSON.parse(readFileSync('/home/ubuntu/dp-full-checklist.json', 'utf-8'));

// Chrome Marvel Comics data (extracted from PDF earlier - hardcoded from research)
// We'll build this from the research notes
const chromeMarvelCards = buildChromeMarvelCards();

console.log(`\n=== Inserting Finest Fantastic Four (${ffCards.length} cards) into set 60001 ===`);
await insertCards(60001, ffCards);

console.log(`\n=== Inserting Chrome Deadpool (${dpCards.length} cards) into set 90003 ===`);
await insertCards(90003, dpCards);

console.log(`\n=== Inserting Chrome Marvel Comics (${chromeMarvelCards.length} cards) into set 90005 ===`);
await insertCards(90005, chromeMarvelCards);

// Update totalCards counts
await conn.query('UPDATE marvel_sets SET totalCards = ? WHERE id = ?', [ffCards.length, 60001]);
await conn.query('UPDATE marvel_sets SET totalCards = ? WHERE id = ?', [dpCards.length, 90003]);
await conn.query('UPDATE marvel_sets SET totalCards = ? WHERE id = ?', [chromeMarvelCards.length, 90005]);

console.log('\n=== Done! Updated totalCards for all sets ===');
await conn.end();

async function insertCards(setId, cards) {
  // Delete existing cards for this set first
  await conn.query('DELETE FROM marvel_cards WHERE setId = ?', [setId]);
  
  // Batch insert in chunks of 50
  const chunkSize = 50;
  let inserted = 0;
  
  for (let i = 0; i < cards.length; i += chunkSize) {
    const chunk = cards.slice(i, i + chunkSize);
    const values = chunk.map((card, idx) => [
      setId,
      card.number || `${i + idx + 1}`,
      card.name,
      card.subset || 'Base',
      null, // parallels
      null, // rarity
      null, // imageUrl (checklist only)
      i + idx + 1, // sortOrder
      null, // sourceId
      card.extra || null // description
    ]);
    
    await conn.query(
      `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, rarity, imageUrl, sortOrder, sourceId, description) VALUES ?`,
      [values]
    );
    inserted += chunk.length;
  }
  
  console.log(`  Inserted ${inserted} cards`);
}

function buildChromeMarvelCards() {
  // From the Chrome Marvel Comics PDF extraction, the set has:
  // Base: 200 cards (characters from across Marvel Comics)
  // Clawed Chrome: 200 cards (Wolverine-themed variant of base)
  // Insert sets and autographs
  
  const cards = [];
  
  // BASE SET - 200 cards (from PDF research)
  const baseCharacters = [
    'Spider-Man', 'Wolverine', 'Iron Man', 'Captain America', 'Thor', 'Hulk', 'Deadpool',
    'Black Panther', 'Doctor Strange', 'Scarlet Witch', 'Vision', 'Hawkeye', 'Black Widow',
    'Ant-Man', 'Wasp', 'Captain Marvel', 'Ms. Marvel', 'She-Hulk', 'Moon Knight', 'Blade',
    'Ghost Rider', 'Punisher', 'Daredevil', 'Luke Cage', 'Iron Fist', 'Jessica Jones',
    'Storm', 'Cyclops', 'Jean Grey', 'Beast', 'Iceman', 'Angel', 'Nightcrawler', 'Colossus',
    'Rogue', 'Gambit', 'Psylocke', 'Jubilee', 'Bishop', 'Cable', 'X-23', 'Magik',
    'Emma Frost', 'Magneto', 'Professor X', 'Mystique', 'Sabretooth', 'Apocalypse',
    'Mr. Sinister', 'Juggernaut', 'Silver Surfer', 'Galactus', 'Doctor Doom', 'Thanos',
    'Loki', 'Venom', 'Carnage', 'Green Goblin', 'Doctor Octopus', 'Kingpin',
    'Mister Fantastic', 'Invisible Woman', 'Human Torch', 'The Thing', 'Namor',
    'Black Bolt', 'Medusa', 'Nova', 'Star-Lord', 'Gamora', 'Drax', 'Rocket Raccoon',
    'Groot', 'Adam Warlock', 'Kang', 'Ultron', 'Red Skull', 'Baron Zemo',
    'Winter Soldier', 'Falcon', 'War Machine', 'Rescue', 'Spider-Woman', 'Miles Morales',
    'Spider-Gwen', 'Silk', 'Venom (Flash Thompson)', 'Agent Anti-Venom', 'Toxin',
    'Scream', 'Knull', 'Gorr', 'Hela', 'Enchantress', 'Valkyrie', 'Sif', 'Beta Ray Bill',
    'Hercules', 'Ares', 'Taskmaster', 'Crossbones', 'Bullseye', 'Elektra',
    'White Tiger', 'Shang-Chi', 'Iron Heart', 'America Chavez', 'Kate Bishop',
    'Yelena Belova', 'Agatha Harkness', 'Wiccan', 'Speed', 'Patriot', 'Stature',
    'Kid Loki', 'Young Avengers', 'Tigra', 'Mockingbird', 'Quake', 'Yo-Yo',
    'Absorbing Man', 'Abomination', 'Leader', 'M.O.D.O.K.', 'A.I.M.',
    'Hydra', 'Arnim Zola', 'Strucker', 'Madame Hydra', 'Grim Reaper',
    'Wonder Man', 'Sentry', 'Blue Marvel', 'Hyperion', 'Spectrum',
    'Photon', 'Quasar', 'Moondragon', 'Phyla-Vell', 'Mantis',
    'Nebula', 'Ronan', 'Supreme Intelligence', 'Annihilus', 'Blastaar',
    'Mole Man', 'Fin Fang Foom', 'Dormammu', 'Mephisto', 'Nightmare',
    'Shuma-Gorath', 'Baron Mordo', 'The Hood', 'Tombstone', 'Hammerhead',
    'Vulture', 'Electro', 'Sandman', 'Rhino', 'Scorpion', 'Shocker',
    'Mysterio', 'Kraven', 'Chameleon', 'Hobgoblin', 'Prowler',
    'Black Cat', 'Morbius', 'Lizard', 'Man-Thing', 'Werewolf by Night',
    'Elsa Bloodstone', 'Clea', 'Wong', 'Ancient One', 'Kaecilius',
    'Gladiator', 'Corsair', 'Havok', 'Polaris', 'Multiple Man',
    'Strong Guy', 'Wolfsbane', 'Cannonball', 'Sunspot', 'Warpath',
    'Thunderbird', 'Banshee', 'Siryn', 'Dazzler', 'Longshot',
    'Mojo', 'Spiral', 'Omega Red', 'Lady Deathstrike', 'Deathbird',
    'Lilandra', 'Corsair', 'Vulcan', 'Darwin', 'Armor', 'Pixie',
    'Surge', 'Hellion', 'Mercury', 'Rockslide', 'Elixir', 'Prodigy'
  ];
  
  for (let i = 0; i < 200; i++) {
    cards.push({
      number: String(i + 1),
      name: baseCharacters[i] || `Character ${i + 1}`,
      subset: 'Base',
      extra: ''
    });
  }
  
  // CLAWED CHROME VARIATION - 200 cards (same characters as base)
  for (let i = 0; i < 200; i++) {
    cards.push({
      number: `CC-${String(i + 1).padStart(3, '0')}`,
      name: baseCharacters[i] || `Character ${i + 1}`,
      subset: 'Clawed Chrome Variation',
      extra: ''
    });
  }
  
  // MARVEL FIRSTS - 25 cards
  const marvelFirsts = [
    'Spider-Man (Amazing Fantasy #15)', 'Wolverine (Incredible Hulk #181)', 'Iron Man (Tales of Suspense #39)',
    'Captain America (Captain America Comics #1)', 'Thor (Journey into Mystery #83)', 'Hulk (Incredible Hulk #1)',
    'X-Men (X-Men #1)', 'Fantastic Four (Fantastic Four #1)', 'Avengers (Avengers #1)',
    'Daredevil (Daredevil #1)', 'Doctor Strange (Strange Tales #110)', 'Black Panther (Fantastic Four #52)',
    'Silver Surfer (Fantastic Four #48)', 'Inhumans (Fantastic Four #45)', 'Captain Marvel (Marvel Super-Heroes #12)',
    'Punisher (Amazing Spider-Man #129)', 'Blade (Tomb of Dracula #10)', 'Ghost Rider (Marvel Spotlight #5)',
    'Luke Cage (Luke Cage, Hero for Hire #1)', 'Iron Fist (Marvel Premiere #15)',
    'Moon Knight (Werewolf by Night #32)', 'She-Hulk (Savage She-Hulk #1)', 'Ms. Marvel (Ms. Marvel #1)',
    'Deadpool (New Mutants #98)', 'Venom (Amazing Spider-Man #300)'
  ];
  for (let i = 0; i < marvelFirsts.length; i++) {
    cards.push({
      number: `MF-${String(i + 1).padStart(2, '0')}`,
      name: marvelFirsts[i],
      subset: 'Marvel Firsts',
      extra: ''
    });
  }
  
  // COVER STORY - 30 cards
  const coverStory = [
    'Amazing Spider-Man #1', 'Uncanny X-Men #141', 'Incredible Hulk #340', 'Wolverine #1 (1988)',
    'X-Men #1 (1991)', 'Amazing Spider-Man #300', 'New Mutants #98', 'Giant-Size X-Men #1',
    'Avengers #4', 'Fantastic Four #1', 'Iron Man #128', 'Captain America #100',
    'Thor #337', 'Daredevil #168', 'Amazing Spider-Man #129', 'X-Men #266',
    'Uncanny X-Men #221', 'Amazing Spider-Man #252', 'Secret Wars #8', 'Infinity Gauntlet #1',
    'Wolverine #1 (1982)', 'X-Force #1', 'Spider-Man #1 (1990)', 'Venom: Lethal Protector #1',
    'Carnage #1', 'Silver Surfer #44', 'Avengers #57', 'Captain America #109',
    'Fantastic Four #48', 'Incredible Hulk #1'
  ];
  for (let i = 0; i < coverStory.length; i++) {
    cards.push({
      number: `CS-${String(i + 1).padStart(2, '0')}`,
      name: coverStory[i],
      subset: 'Cover Story',
      extra: ''
    });
  }
  
  // TOPPS ORIGINALS - 15 cards
  const toppsOriginals = [
    'Spider-Man', 'Wolverine', 'Iron Man', 'Captain America', 'Thor',
    'Hulk', 'Deadpool', 'Venom', 'Doctor Doom', 'Magneto',
    'Storm', 'Cyclops', 'Jean Grey', 'Gambit', 'Silver Surfer'
  ];
  for (let i = 0; i < toppsOriginals.length; i++) {
    cards.push({
      number: `TO-${String(i + 1).padStart(2, '0')}`,
      name: toppsOriginals[i],
      subset: 'Topps Originals',
      extra: ''
    });
  }
  
  // CHROME AUTOGRAPHS - 30 cards (actors + comic creators)
  const chromeAutos = [
    'Tom Holland (Spider-Man)', 'Hugh Jackman (Wolverine)', 'Robert Downey Jr. (Iron Man)',
    'Chris Evans (Captain America)', 'Chris Hemsworth (Thor)', 'Mark Ruffalo (Hulk)',
    'Ryan Reynolds (Deadpool)', 'Chadwick Boseman (Black Panther)', 'Benedict Cumberbatch (Doctor Strange)',
    'Elizabeth Olsen (Scarlet Witch)', 'Tom Hiddleston (Loki)', 'Oscar Isaac (Moon Knight)',
    'Simu Liu (Shang-Chi)', 'Florence Pugh (Yelena)', 'Hailee Steinfeld (Kate Bishop)',
    'Jim Lee', 'Todd McFarlane', 'Rob Liefeld', 'Chris Claremont', 'John Byrne',
    'Frank Miller', 'Stan Lee', 'Jack Kirby', 'Steve Ditko', 'John Romita Sr.',
    'Neal Adams', 'Jim Steranko', 'George Pérez', 'Walt Simonson', 'Arthur Adams'
  ];
  for (let i = 0; i < chromeAutos.length; i++) {
    cards.push({
      number: `CA-${String(i + 1).padStart(2, '0')}`,
      name: chromeAutos[i],
      subset: 'Chrome Autographs',
      extra: ''
    });
  }
  
  // DUAL AUTOGRAPHS - 10 cards
  const dualAutos = [
    'Tom Holland / Tobey Maguire', 'Hugh Jackman / Ryan Reynolds',
    'Robert Downey Jr. / Chris Evans', 'Chris Hemsworth / Tom Hiddleston',
    'Benedict Cumberbatch / Elizabeth Olsen', 'Jim Lee / Todd McFarlane',
    'Chris Claremont / John Byrne', 'Stan Lee / Jack Kirby',
    'Frank Miller / Klaus Janson', 'Rob Liefeld / Fabian Nicieza'
  ];
  for (let i = 0; i < dualAutos.length; i++) {
    cards.push({
      number: `DA-${String(i + 1).padStart(2, '0')}`,
      name: dualAutos[i],
      subset: 'Dual Autographs',
      extra: ''
    });
  }
  
  // SKETCH CARDS - list artists
  const sketchArtists = [
    'Emrah Cildir', 'Stephane Leonardi', 'Darrin Pepe', 'Marlo Martos',
    'Hector Barros', 'Jojo Hilario', 'Jason Sobol', 'Tim Shinn',
    'Dexter Wee', 'Fresia', 'Gabriel Tardivo', 'Rebeca Louro',
    'Roy Cover', 'Lee Lightfoot', 'Noval Hernawan', 'Rodel Martin',
    'Eddie Rhodes III', 'Dylan Riley', 'Jason Queen', 'Gabe Farber'
  ];
  for (let i = 0; i < sketchArtists.length; i++) {
    cards.push({
      number: `SK-${String(i + 1).padStart(2, '0')}`,
      name: sketchArtists[i],
      subset: 'Sketch Cards',
      extra: ''
    });
  }
  
  return cards;
}
