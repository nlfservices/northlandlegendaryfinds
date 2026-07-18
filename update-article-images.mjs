import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Article ID: 4800001
// Current images in order (sections top to bottom):
// 1. Spider-Man Brand New Day section -> currently Wolverine card -> replace with Spider-Man
// 2. Avengers Doomsday section -> currently Doctor Doom card -> replace with Captain America
// 3. Adam Driver X-Men section -> currently Storm card -> replace with Magneto
// 4. Wolverine PS5 section -> currently Beast card -> replace with Wolverine
// 5. Marvel Rivals section -> currently Thor card -> replace with Gambit
// 6. X-Men '97 S2 section -> currently Hulk card -> replace with Cyclops
// 7. SDCC Preview section -> currently Loki card -> replace with Doctor Doom

const replacements = [
  // [old_url, new_url, new_alt]
  [
    'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/C-A_front_175ac9e0.webp',
    '/manus-storage/Spider-Man-Front_504aec2f.JPG',
    'Spider-Man'
  ],
  [
    'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/C-K_front_e6aa9dc5.webp',
    '/manus-storage/CaptainAMerica-Front_2fd2e4ac.JPG',
    'Captain America'
  ],
  [
    'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/C-Q_front_0d8f0dcd.webp',
    '/manus-storage/1000043854_34ddb7b7.jpg',
    'Magneto'
  ],
  [
    'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/C-J_front_513c0568.webp',
    '/manus-storage/Wolverine-Front_41835aa1.JPG',
    'Wolverine'
  ],
  [
    'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/C-10_front_0ebad520.webp',
    '/manus-storage/Gambit-front_97d1d245.jpg',
    'Gambit'
  ],
  [
    'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/C-9_front_4bbe8bc3.webp',
    '/manus-storage/1000043852_5cef1c1f.jpg',
    'Cyclops'
  ],
  [
    'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/C-8_front_cc057977.webp',
    '/manus-storage/1000043826_c2ad3c69.jpg',
    'Doctor Doom'
  ],
];

// Fetch current markdown
const [rows] = await conn.execute(
  "SELECT id, contentMarkdown FROM articles WHERE id = 4800001 LIMIT 1"
);

let md = rows[0].contentMarkdown;

for (const [oldUrl, newUrl, newAlt] of replacements) {
  // Replace the full image markdown: ![old_alt](old_url) -> ![new_alt](new_url)
  const oldPattern = `![${md.match(new RegExp(`!\\[([^\\]]*)\\]\\(${oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`))?.[1] || ''}](${oldUrl})`;
  const newPattern = `![${newAlt}](${newUrl})`;
  
  if (md.includes(oldUrl)) {
    md = md.replace(oldUrl, newUrl);
    // Also update the alt text
    const altRegex = new RegExp(`!\\[[^\\]]*\\]\\(${newUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`);
    md = md.replace(altRegex, `![${newAlt}](${newUrl})`);
    console.log(`Replaced: ${newAlt} image updated`);
  } else {
    console.log(`WARNING: Could not find URL for ${newAlt}`);
  }
}

// Update the database
await conn.execute(
  "UPDATE articles SET contentMarkdown = ? WHERE id = 4800001",
  [md]
);

console.log('\nArticle updated successfully!');

// Verify
const [verify] = await conn.execute(
  "SELECT contentMarkdown FROM articles WHERE id = 4800001 LIMIT 1"
);
const verifyMd = verify[0].contentMarkdown;
const re = /!\[[^\]]*\]\([^)]+\)/g;
const matches = verifyMd.match(re) || [];
console.log('\nVerification - images in updated article:');
matches.forEach((m, i) => console.log(`  ${i+1}: ${m}`));

await conn.end();
