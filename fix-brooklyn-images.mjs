import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get Brooklyn Collection cards with NULL imageUrl (164 cards)
  const [brooklynNull] = await conn.execute(
    "SELECT id, cardNumber, characterName FROM marvel_cards WHERE setId = 90004 AND (imageUrl IS NULL OR imageUrl = '')"
  );
  console.log('Brooklyn cards with NO image:', brooklynNull.length);
  
  // Get all character images from OTHER sets
  const [otherImages] = await conn.execute(
    "SELECT characterName, imageUrl FROM marvel_cards WHERE setId != 90004 AND imageUrl IS NOT NULL AND imageUrl != '' GROUP BY characterName, imageUrl"
  );
  
  // Build character -> image mapping
  const charMap = {};
  for (const row of otherImages) {
    if (!charMap[row.characterName]) {
      charMap[row.characterName] = row.imageUrl;
    }
  }
  console.log('Characters with images in other sets:', Object.keys(charMap).length);
  
  // Actor to character mapping for MCU autographs
  const actorToChar = {
    'Chris Evans': 'Captain America',
    'Sebastian Stan': 'Bucky Barnes',
    'Anthony Mackie': 'Falcon',
    'Scarlett Johansson': 'Black Widow',
    'Samuel L. Jackson': 'Nick Fury',
    'Robert Downey Jr.': 'Iron Man',
    'Chris Hemsworth': 'Thor',
    'Tom Holland': 'Spider-Man',
    'Chadwick Boseman': 'Black Panther',
    'Elizabeth Olsen': 'Scarlet Witch',
    'Paul Rudd': 'Ant-Man',
    'Jeremy Renner': 'Hawkeye',
    'Tom Hiddleston': 'Loki',
    'Mark Ruffalo': 'Hulk',
    'Hayley Atwell': 'Peggy Carter',
    'Emily VanCamp': 'Sharon Carter',
    'Daniel Brühl': 'Baron Zemo',
    'Georges St-Pierre': 'Batroc The Leaper',
    'Frank Grillo': 'Crossbones',
    'Wyatt Russell': 'U.S. Agent',
    'Florence Pugh': 'Black Widow',
    'David Harbour': 'Red Guardian',
    'Toby Jones': 'Arnim Zola',
    'Hugo Weaving': 'Red Skull',
    'Tim Roth': 'Abomination',
    'William Hurt': 'Thunderbolt Ross',
    'Dominique Thorne': 'Ironheart',
    'Simu Liu': 'Shang-Chi',
    'Iman Vellani': 'Ms. Marvel',
    'Oscar Isaac': 'Moon Knight',
    'Kathryn Hahn': 'Agatha Harkness',
    'Cobie Smulders': 'Maria Hill',
    'Stan Lee': 'Stan Lee',
    'Jack Kirby': 'Captain America',
    'Joe Simon': 'Captain America',
    'Ed Brubaker': 'Bucky Barnes',
    'Jim Steranko': 'Nick Fury',
    'Ta-Nehisi Coates': 'Captain America',
    'Mark Waid': 'Captain America',
    'Jeph Loeb': 'Captain America',
    'Ron Garney': 'Captain America',
    'John Romita Jr.': 'Captain America',
    'Alex Ross': 'Captain America',
  };
  
  // Update cards
  let updated = 0;
  let noMatch = [];
  
  for (const card of brooklynNull) {
    let newImage = charMap[card.characterName];
    
    // Try actor mapping if no direct match
    if (!newImage && actorToChar[card.characterName]) {
      newImage = charMap[actorToChar[card.characterName]];
    }
    
    if (newImage) {
      await conn.execute(
        "UPDATE marvel_cards SET imageUrl = ? WHERE id = ?",
        [newImage, card.id]
      );
      updated++;
    } else {
      noMatch.push(card.characterName);
    }
  }
  
  console.log(`\nUpdated ${updated} cards with proper character images`);
  console.log(`Still no match for ${noMatch.length} cards:`);
  const unique = [...new Set(noMatch)];
  console.log(unique.join(', '));
  
  await conn.end();
}

main().catch(console.error);
