import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get Brooklyn Collection cards still with NULL imageUrl
  const [brooklynNull] = await conn.execute(
    "SELECT id, cardNumber, characterName, cardType FROM marvel_cards WHERE setId = 90004 AND (imageUrl IS NULL OR imageUrl = '')"
  );
  console.log('Brooklyn cards still with NO image:', brooklynNull.length);
  
  // Get character images from other sets
  const [otherImages] = await conn.execute(
    "SELECT characterName, imageUrl FROM marvel_cards WHERE setId != 90004 AND imageUrl IS NOT NULL AND imageUrl != '' GROUP BY characterName, imageUrl"
  );
  const charMap = {};
  for (const row of otherImages) {
    if (!charMap[row.characterName]) {
      charMap[row.characterName] = row.imageUrl;
    }
  }
  
  // Extended actor to character mapping
  const actorToChar = {
    'Andy Serkis': 'Ulysses Klaue',
    'Aaron Taylor-Johnson': 'Quicksilver',
    'Bradley Cooper': 'Rocket Raccoon',
    'Brie Larson': 'Captain Marvel',
    'Bruno Ricci': 'Captain America',
    'Clark Gregg': 'Agent Coulson',
    'Carl Lumbly': 'Captain America',
    'Dominic Cooper': 'Howard Stark',
    'Don Cheadle': 'War Machine',
    'Derek Luke': 'Captain America',
    'Danny Ramirez': 'Falcon',
    'Erin Kellyman': 'Captain America',
    'Evangeline Lilly': 'Wasp',
    'Giancarlo Esposito': 'Captain America',
    'Harrison Ford': 'Thunderbolt Ross',
    'Hugh Jackman': 'Wolverine',
    'Josh Brolin': 'Thanos',
    'JJ Feild': 'Captain America',
    'Julia Louis-Dreyfus': 'Captain America',
    'Kenneth Choi': 'Captain America',
    'Karen Gillan': 'Nebula',
    'Lewis Pullman': 'Captain America',
    'Michael B. Jordan': 'Killmonger',
    'Natalie Dormer': 'Captain America',
    'Neal McDonough': 'Dum Dum Dugan',
    'Paul Bettany': 'Vision',
    'Pom Klementieff': 'Mantis',
    'Richard Armitage': 'Captain America',
    'Shira Haas': 'Captain America',
    'Shaun Toub': 'Iron Man',
    'Stellan Skarsgard': 'Thor',
    'Wyatt Russell': 'U.S. Agent',
    'Colonel Chester Phillips': 'Captain America',
    'Thaddeus Ross': 'Thunderbolt Ross',
    'Dum Dum Dugan': 'Captain America',
    'Agent Coulson': 'Captain America',
    'Beta Ray Bill': 'Thor',
    'Steve Rogers': 'Captain America',
    'Arnim Zola': 'Captain America',
    'Sharon Carter': 'Captain America',
    'Batroc The Leaper': 'Captain America',
    'Madame Hydra': 'Captain America',
    'Diamondback': 'Captain America',
    'Baron Strucker': 'Captain America',
    'U.S. Agent': 'Captain America',
    'Battlestar': 'Captain America',
    'Kang The Conqueror': 'Kang',
    'Doctor Faustus': 'Captain America',
    'Misty Knight': 'Captain America',
    'Cloak & Dagger': 'Captain America',
    'Flash Thompson': 'Spider-Man',
    'Firestar': 'Captain America',
  };
  
  // Get Captain America image as fallback
  const capImage = charMap['Captain America'];
  console.log('Captain America fallback image:', capImage?.substring(0, 60));
  
  let updated = 0;
  let fallbackUsed = 0;
  
  for (const card of brooklynNull) {
    let newImage = null;
    
    // Try actor/character mapping
    if (actorToChar[card.characterName]) {
      const mappedChar = actorToChar[card.characterName];
      newImage = charMap[mappedChar];
    }
    
    // For dual/triple autographs, use Captain America
    if (!newImage && (card.cardType === 'MCU Dual Autograph' || card.cardType === 'MCU Triple Autograph')) {
      newImage = capImage;
      fallbackUsed++;
    }
    
    // For Brooklyn neighborhood cards, comic issue cards, and remaining - use Cap as fallback
    if (!newImage) {
      newImage = capImage;
      fallbackUsed++;
    }
    
    if (newImage) {
      await conn.execute(
        "UPDATE marvel_cards SET imageUrl = ? WHERE id = ?",
        [newImage, card.id]
      );
      updated++;
    }
  }
  
  console.log(`\nUpdated ${updated} cards total`);
  console.log(`Used Captain America fallback for ${fallbackUsed} cards (neighborhoods, comic issues, unmapped actors)`);
  
  // Final check
  const [remaining] = await conn.execute(
    "SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = 90004 AND (imageUrl IS NULL OR imageUrl = '')"
  );
  console.log(`\nRemaining cards with no image: ${remaining[0].cnt}`);
  
  await conn.end();
}

main().catch(console.error);
