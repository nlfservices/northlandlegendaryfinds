import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/northland-legendary-finds/.env' });

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const [sets] = await conn.query('SELECT id FROM marvel_sets WHERE slug = ?', ['2025-topps-marvel-sapphire']);
  const setId = sets[0].id;
  
  const [cards] = await conn.query(
    'SELECT id, cardNumber, characterName, cardType, imageUrl FROM marvel_cards WHERE setId = ? ORDER BY sortOrder',
    [setId]
  );
  
  let aiCount = 0, cardPhotoCount = 0, placeholderCount = 0, noImageCount = 0;
  let cardPhotos = [];
  
  for (const c of cards) {
    if (c.imageUrl === null || c.imageUrl === undefined) { noImageCount++; continue; }
    if (c.imageUrl.includes('marvel-ai-')) { aiCount++; continue; }
    if (c.imageUrl.includes('CBH-')) { aiCount++; continue; }
    if (c.imageUrl.includes('placeholder') || c.imageUrl.includes('hulk-comic')) { placeholderCount++; continue; }
    
    const filename = c.imageUrl.split('/').pop();
    cardPhotoCount++;
    cardPhotos.push({ id: c.id, num: c.cardNumber, name: c.characterName, type: c.cardType, filename: filename.substring(0, 80) });
  }
  
  console.log('Total cards:', cards.length);
  console.log('AI images:', aiCount);
  console.log('Non-AI images (need checking):', cardPhotoCount);
  console.log('Placeholders:', placeholderCount);
  console.log('No image:', noImageCount);
  console.log('---');
  console.log('Non-AI image cards:');
  for (const c of cardPhotos) {
    console.log(JSON.stringify(c));
  }
  
  await conn.end();
}
main().catch(console.error);
