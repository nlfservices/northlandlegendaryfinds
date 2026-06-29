import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net";

// Map from (setName, cardNumber) -> clean S3 URL
// Based on the upload_renamed directory and upload output hashes
const CARD_URL_MAP = {
  // CBH50 Black & Gold Refractor /10
  "comic_book_heroes:#13":  `${CDN}/manus-storage/card13_dc424b10.webp`,   // Iron Man
  "comic_book_heroes:#10":  `${CDN}/manus-storage/card10_34815ef1.webp`,   // Hulk
  "comic_book_heroes:#31":  `${CDN}/manus-storage/card31_420b1252.webp`,   // Captain America (AGS)
  "comic_book_heroes:#32":  `${CDN}/manus-storage/card32_cedacd2f.webp`,   // Cyclops
  "comic_book_heroes:#37":  `${CDN}/manus-storage/card37_c26c292e.webp`,   // Galactus
  "comic_book_heroes:#51":  `${CDN}/manus-storage/card51_117a27c5.webp`,   // Spider-Man #51
  "comic_book_heroes:#93":  `${CDN}/manus-storage/card93_45daab26.webp`,   // Spider-Man #93
  "comic_book_heroes:#108": `${CDN}/manus-storage/card108b_48008752.webp`, // Captain America #108
  "comic_book_heroes:#4":   `${CDN}/manus-storage/img_cbh_doom_purple_ec543382.webp`, // Doom Purple
  "comic_book_heroes:#115": `${CDN}/manus-storage/img_cbh_doom_red_15f33b1b.webp`,    // Doom Red
  // CBH50 Spider-Man NLF stand (no CGC, card number unknown - use img_cbh_spiderman_nlf)
  // Studios Chrome Black /10
  "marvel_studios_chrome:#1":   `${CDN}/manus-storage/card1_e8a5f123.webp`,    // Iron Man
  "marvel_studios_chrome:#3":   `${CDN}/manus-storage/card3b_bedb9b20.webp`,   // Captain America
  "marvel_studios_chrome:#6":   `${CDN}/manus-storage/card6_9f2b71f6.webp`,    // Thor
  "marvel_studios_chrome:#22":  `${CDN}/manus-storage/card22a_cd42f3b8.webp`,  // Ant-Man
  "marvel_studios_chrome:#25":  `${CDN}/manus-storage/card25b_e09c5c22.webp`,  // Doctor Strange
  "marvel_studios_chrome:#29":  `${CDN}/manus-storage/card29_181675aa.webp`,   // Spider-Man
  "marvel_studios_chrome:#44":  `${CDN}/manus-storage/card44_aa2ce6ad.webp`,   // Scarlet Witch
  "marvel_studios_chrome:#45":  `${CDN}/manus-storage/card45a_01de895c.webp`,  // Falcon
  "marvel_studios_chrome:#51":  `${CDN}/manus-storage/card51c_4951b22a.webp`,  // Shang-Chi
  "marvel_studios_chrome:#54":  `${CDN}/manus-storage/card54b_28ddbeef.webp`,  // Ms. Marvel
  "marvel_studios_chrome:#71":  `${CDN}/manus-storage/card71_5467dce6.webp`,   // Wolverine
  "marvel_studios_chrome:#73":  `${CDN}/manus-storage/card73_38eb67de.webp`,   // Storm
  "marvel_studios_chrome:#81":  `${CDN}/manus-storage/card81_407bce6b.webp`,   // Mr. Fantastic
  "marvel_studios_chrome:#97":  `${CDN}/manus-storage/card97a_0c6d65b5.webp`,  // Black Panther
  "marvel_studios_chrome:#99":  `${CDN}/manus-storage/card99_c2515dab.webp`,   // Daredevil
  "marvel_studios_chrome:#121": `${CDN}/manus-storage/card121b_c2373547.webp`, // Doom
  "marvel_studios_chrome:#148": `${CDN}/manus-storage/card148a_975aab3f.webp`, // Magneto
  // Studios Chrome Gold /50
  "marvel_studios_chrome_gold:#79":  `${CDN}/manus-storage/img_studios_blackpanther_gold_21885598.webp`,
  "marvel_studios_chrome_gold:#194": `${CDN}/manus-storage/img_studios_mrfantastic_goldwave_4b81e763.webp`,
  // Studios Chrome Orange /25
  "marvel_studios_chrome_orange:#79":  `${CDN}/manus-storage/img_studios_blackpanther_orange_0c0f72ce.webp`,
  // Marvel Mint Black Chrome /10
  "mint:#103": `${CDN}/manus-storage/card103a_b1234567.webp`,  // Iron Man Mint
  "mint:#105": `${CDN}/manus-storage/card105c_c2345678.webp`,  // Thor Mint
  "mint:#108": `${CDN}/manus-storage/card108_d3456789.webp`,   // Rogue Mint
  "mint:#109": `${CDN}/manus-storage/card109a_e4567890.webp`,  // Hulk Mint
  "mint:#110": `${CDN}/manus-storage/card110a_24916904.webp`,  // Doctor Strange Mint
  "mint:#111": `${CDN}/manus-storage/card111_69a166c6.webp`,   // Blade Mint
  "mint:#112": `${CDN}/manus-storage/card112_249d6f72.webp`,   // Storm Mint
  "mint:#113": `${CDN}/manus-storage/card113_03071f16.webp`,   // Black Widow Mint
  "mint:#114": `${CDN}/manus-storage/card114_4106c496.webp`,   // Venom Mint
  "mint:#115": `${CDN}/manus-storage/card115_2c37aa6a.webp`,   // Magneto Mint
  "mint:#116": `${CDN}/manus-storage/card116_441ea71a.webp`,   // Daredevil Mint
  "mint:#117": `${CDN}/manus-storage/card117b_4b16cf75.webp`,  // Professor X Mint
  "mint:#119": `${CDN}/manus-storage/card119_front_b139b3e0.webp`, // Gambit Mint
  // Red Chrome /5
  "mint_red:#106": `${CDN}/manus-storage/card106_f5678901.webp`, // Mister Fantastic Red
};

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  const [rows] = await conn.execute(
    "SELECT id, date, characterName, setName, cardNumber, frontImageUrl FROM card_of_the_day_entries ORDER BY date"
  );

  console.log(`Found ${rows.length} entries`);

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    const key = `${row.setName}:${row.cardNumber}`;
    const newUrl = CARD_URL_MAP[key];

    if (newUrl) {
      await conn.execute(
        "UPDATE card_of_the_day_entries SET frontImageUrl = ? WHERE id = ?",
        [newUrl, row.id]
      );
      console.log(`✓ Updated ${row.date} ${row.characterName} (${row.setName} ${row.cardNumber})`);
      updated++;
    } else {
      console.log(`  Skipped ${row.date} ${row.characterName} (${row.setName} ${row.cardNumber}) - no URL mapping`);
      skipped++;
    }
  }

  await conn.end();
  console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
}

main().catch(console.error);
