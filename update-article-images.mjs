import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const IMAGE_MAP = {
  '## 1. Spider-Man': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/char-spiderman-mcu-ahoCTFmZx7mPtbERUVCnVc.webp',
  '## 2. Doctor Doom': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/char-doom-mcu-4kf4ZYBazcXkEicSgrwq5N.webp',
  '## 3. Wolverine': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/char-wolverine-mcu-RPG5ggsm7murUcScvBtPpz.webp',
  '## 4. Ghost Rider': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/char-ghostrider-mcu-QHWguGFjDaTazFuMaPPetU.webp',
  '## 5. Captain America': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/char-captainamerica-mcu-K2deB4TKbfpjfQ99DNjx6M.webp',
  '## 6. Silver Surfer': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/char-silversurfer-mcu-LhVBU4R95k2BmhhPCmWJ6Q.webp',
  '## 7. Venom': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/char-venom-mcu-gwJDZaponTxm3RxMyF5SVZ.webp',
  '## 8. Thanos': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/char-thanos-mcu-hpb8bxFiHtasfNAQTrnJ99.webp',
  '## 9. Punisher': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/char-punisher-mcu-NzWnmT3pdZ4xcTx3hBbkBr.webp',
  '## 10. Cyclops': 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/char-cyclops-mcu-MJn5nNQzFa9J5kCC7NgwgS.webp',
};

const ALT_MAP = {
  '## 1. Spider-Man': 'Spider-Man',
  '## 2. Doctor Doom': 'Doctor Doom',
  '## 3. Wolverine': 'Wolverine',
  '## 4. Ghost Rider': 'Ghost Rider',
  '## 5. Captain America': 'Captain America',
  '## 6. Silver Surfer': 'Silver Surfer',
  '## 7. Venom': 'Venom',
  '## 8. Thanos': 'Thanos',
  '## 9. Punisher': 'Punisher',
  '## 10. Cyclops': 'Cyclops',
};

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  const [rows] = await conn.execute(
    `SELECT id, contentMarkdown FROM articles WHERE slug = ?`,
    ['top-10-marvel-characters-collectors-chasing-cards-2026']
  );

  if (!rows.length) {
    console.error('Article not found!');
    process.exit(1);
  }

  let content = rows[0].contentMarkdown;
  const articleId = rows[0].id;
  let addedCount = 0;

  for (const [heading, imageUrl] of Object.entries(IMAGE_MAP)) {
    const alt = ALT_MAP[heading];
    const imageMarkdown = `\n\n![${alt}](${imageUrl})\n`;

    // Check if image already exists for this section
    if (content.includes(imageUrl)) {
      console.log(`⏭️  Image already exists for ${heading}`);
      continue;
    }

    // Find the heading and insert the image right after it (after the heading line)
    const headingIndex = content.indexOf(heading);
    if (headingIndex === -1) {
      console.log(`⚠️  Heading not found: ${heading}`);
      continue;
    }

    // Find the end of the heading line
    const headingLineEnd = content.indexOf('\n', headingIndex);
    if (headingLineEnd === -1) {
      console.log(`⚠️  Could not find end of heading line: ${heading}`);
      continue;
    }

    // Insert image right after the heading
    content = content.slice(0, headingLineEnd) + imageMarkdown + content.slice(headingLineEnd);
    addedCount++;
    console.log(`✅ Added image for ${heading}`);
  }

  if (addedCount === 0) {
    console.log('No images needed to be added.');
    await conn.end();
    return;
  }

  await conn.execute(
    `UPDATE articles SET contentMarkdown = ? WHERE id = ?`,
    [content, articleId]
  );

  console.log(`\n✅ Article ${articleId} updated with ${addedCount} character images!`);
  console.log(`New content length: ${content.length} chars`);

  await conn.end();
}

main().catch(console.error);
