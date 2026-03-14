import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Map of card numbers to their new image URLs (setId=5 = Marvel Studios)
const fixes = [
  { cardNumber: '5', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-5-pepper-3eJLdFwfXxPXBhvwqvxzDo.webp' },
  { cardNumber: '7', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-7-black-widow-Gg8vfKjJxUKGFXQhDRCqnY.webp' },
  { cardNumber: '10', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-10-sentry-3BLLZUEgBpC8hkewjwHiJC.webp' },
  { cardNumber: '11', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-11-odin-2Rh2nHZJfqmqKnwJfQPPYo.webp' },
  { cardNumber: '12', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-12-cap-america-GgUVe9ADA6qhyUiBCusR9E.webp' },
  { cardNumber: '13', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-13-red-hulk-UFd5cxCgX7ouBunvSzg3S8.webp' },
  { cardNumber: '18', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-18-lady-sif-4gESZRYw5yrcetXiXZzboB.webp' },
  { cardNumber: '19', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-19-loki-NYrWJVXNwDccbxbxKk6Pht.webp' },
  { cardNumber: '25', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-25-zola-ZcpiK4PvDtzNDHaoRaYnuY.webp' },
  { cardNumber: '30', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-30-maria-hill-WkkUH6eVRZA7HPgsjyBLqC.webp' },
  { cardNumber: '31', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-31-iron-patriot-U6kK9WkNYfzm2jpGdAMrVS.webp' },
  { cardNumber: '35', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-35-eric-savin-WkRBF3Bksj3hqtbjnZSUh3.webp' },
  { cardNumber: '44', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-44-drax-LozLdetDsxWS3g9fsi9UeB.webp' },
  { cardNumber: '48', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-48-gamora-HhzzFCkManSfRYtPc2GMcq.webp' },
  { cardNumber: '51', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-51-nova-prime-BCBQXExvbFsU8mduFyYXV6.webp' },
  { cardNumber: '54', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-54-ultron-9NvJ8y9fmD9rceGjqTXtGp.webp' },
  { cardNumber: '58', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-58-hank-pym-XEFiqBECh8ViQC2YuaL4NQ.webp' },
  { cardNumber: '61', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-61-spider-man-SSg6WrsfqbPQgEbXFvPPUe.webp' },
  { cardNumber: '65', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-65-dr-strange-NgemcvFxPrioLKS7HdYEMy.webp' },
  { cardNumber: '71', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-71-nebula-HTFCWUPKGK2j6CTs56isy3.webp' },
  { cardNumber: '72', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-72-yondu-6qjdqkkdYXVXvFmfa585Qd.webp' },
  { cardNumber: '73', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-73-baby-groot-8jZgosKLXSJTQFzZzXoiJ6.webp' },
];

let updated = 0;

// Update base cards by cardNumber and setId=5 (Studios) and cardType=Base
for (const fix of fixes) {
  const [result] = await conn.execute(
    `UPDATE marvel_cards SET imageUrl = ? WHERE cardNumber = ? AND setId = 5 AND cardType = 'Base'`,
    [fix.url, fix.cardNumber]
  );
  console.log(`Card #${fix.cardNumber}: ${result.affectedRows} rows updated`);
  updated += result.affectedRows;
}

// Fix Invisible Woman across ALL sets (was showing Drax)
const invisibleWomanUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-invisible-woman-4SBShEanQnwnfxzxvKuSr5.webp';
const [iwCards] = await conn.execute(
  `SELECT id, cardNumber, setId, characterName, imageUrl FROM marvel_cards WHERE characterName LIKE '%Invisible Woman%' OR characterName LIKE '%Sue Storm%'`
);
console.log(`\nFound ${iwCards.length} Invisible Woman cards:`);
for (const card of iwCards) {
  console.log(`  ID ${card.id}: #${card.cardNumber} set=${card.setId} "${card.characterName}"`);
  if (card.imageUrl && card.imageUrl.includes('Drax')) {
    const [result] = await conn.execute(
      `UPDATE marvel_cards SET imageUrl = ? WHERE id = ?`,
      [invisibleWomanUrl, card.id]
    );
    console.log(`    -> Fixed Drax image! ${result.affectedRows} rows`);
    updated += result.affectedRows;
  }
}

// Also fix Frigga base card in Studios set
const friggaUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fix-studios-13-frigga-RoCYHmPKtoivwgqd9iEejy.webp';
const [friggaCards] = await conn.execute(
  `SELECT id, cardNumber, characterName, cardType, imageUrl FROM marvel_cards WHERE characterName LIKE '%Frigga%' AND setId = 5`
);
console.log(`\nFrigga cards in Studios:`);
for (const card of friggaCards) {
  console.log(`  ID ${card.id}: #${card.cardNumber} "${card.characterName}" type=${card.cardType}`);
  if (card.cardType === 'Base') {
    const [result] = await conn.execute(
      `UPDATE marvel_cards SET imageUrl = ? WHERE id = ?`,
      [friggaUrl, card.id]
    );
    console.log(`    -> Updated Frigga: ${result.affectedRows} rows`);
    updated += result.affectedRows;
  }
}

console.log(`\nTotal rows updated: ${updated}`);
await conn.end();
