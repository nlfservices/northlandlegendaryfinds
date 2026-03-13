import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

dotenv.config({ path: '/home/ubuntu/northland-legendary-finds/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL + '&ssl={"rejectUnauthorized":true}');

const [cards] = await conn.execute(`
  SELECT mc.id, mc.cardNumber, mc.characterName, mc.cardType, ms.slug
  FROM marvel_cards mc 
  JOIN marvel_sets ms ON mc.setId = ms.id 
  WHERE (mc.imageUrl LIKE '%-front%' OR mc.imageUrl LIKE '%mintcomic%')
  AND mc.cardType NOT LIKE '%GAMBIT%'
  ORDER BY mc.characterName, ms.id
`);

// Group by simplified character name
const charMap = {};
cards.forEach(c => {
  let simple = c.characterName
    .split(' Phase ')[0]
    .split(' Doctor Strange in')[0]
    .split(' Hawkeye')[0]
    .split(' Ms. Marvel')[0]
    .split(' The Marvels')[0]
    .split(' Captain America:')[0]
    .split(' Iron Man')[0]
    .split(' Guardians')[0]
    .split(' Fantastic Four')[0]
    .split(' Avengers:')[0]
    .split(' Kamala Khan')[0]
    .split(' James Rhodes')[0]
    .split(' Dr. Stephen')[0]
    .split(' Sue Storm')[0]
    .split(' President Thaddeus')[0]
    .split(' Leaps at')[0]
    .split(' and Captain')[0]
    .trim();
  
  if (!charMap[simple]) charMap[simple] = [];
  charMap[simple].push({ id: c.id, num: c.cardNumber, name: c.characterName, type: c.cardType, set: c.slug });
});

const chars = Object.keys(charMap).sort();
const result = { characters: chars, charMap, totalCards: cards.length, uniqueChars: chars.length };

writeFileSync('/home/ubuntu/cards_to_replace.json', JSON.stringify(result, null, 2));
console.log(`Total cards to replace: ${cards.length}`);
console.log(`Unique characters: ${chars.length}`);
console.log('\nCharacters:');
chars.forEach(c => {
  const count = charMap[c].length;
  console.log(`  ${c} (${count} cards)`);
});

await conn.end();
