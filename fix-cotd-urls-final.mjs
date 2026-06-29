import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net";

// Map: date -> clean CDN URL (no # in filename)
// Hashes from the renamed upload batch output
const DATE_URL_MAP = {
  // CBH50 Black & Gold Refractor /10
  "2026-06-29": `${CDN}/manus-storage/card13_dc424b10.webp`,
  "2026-06-30": `${CDN}/manus-storage/card10_34815ef1.webp`,
  "2026-07-01": `${CDN}/manus-storage/card31_420b1252.webp`,
  "2026-07-02": `${CDN}/manus-storage/card32_cedacd2f.webp`,
  "2026-07-03": `${CDN}/manus-storage/card37_c26c292e.webp`,
  "2026-07-04": `${CDN}/manus-storage/card51_117a27c5.webp`,
  "2026-07-05": `${CDN}/manus-storage/card93_45daab26.webp`,
  "2026-07-06": `${CDN}/manus-storage/card108b_48008752.webp`,
  "2026-07-07": `${CDN}/manus-storage/img_cbh_doom_purple_ec543382.webp`,
  "2026-07-08": `${CDN}/manus-storage/img_cbh_doom_green_aaf22d81.webp`,
  "2026-07-09": `${CDN}/manus-storage/img_cbh_doom_red_15f33b1b.webp`,
  "2026-07-10": `${CDN}/manus-storage/img_cbh_spiderman_nlf_b1a688ad.webp`,
  // Marvel Studios Chrome Black /10
  "2026-07-11": `${CDN}/manus-storage/card1_e8a5f123.webp`,
  "2026-07-12": `${CDN}/manus-storage/card3b_bedb9b20.webp`,
  "2026-07-13": `${CDN}/manus-storage/card6_9f2b71f6.webp`,
  "2026-07-14": `${CDN}/manus-storage/card22a_cd42f3b8.webp`,
  "2026-07-15": `${CDN}/manus-storage/card25b_e09c5c22.webp`,
  "2026-07-16": `${CDN}/manus-storage/card29_181675aa.webp`,
  "2026-07-17": `${CDN}/manus-storage/card44_aa2ce6ad.webp`,
  "2026-07-18": `${CDN}/manus-storage/card45a_01de895c.webp`,
  "2026-07-19": `${CDN}/manus-storage/card51c_4951b22a.webp`,
  "2026-07-20": `${CDN}/manus-storage/card54b_28ddbeef.webp`,
  "2026-07-21": `${CDN}/manus-storage/card71_5467dce6.webp`,
  "2026-07-22": `${CDN}/manus-storage/card73_38eb67de.webp`,
  "2026-07-23": `${CDN}/manus-storage/card81_407bce6b.webp`,
  "2026-07-24": `${CDN}/manus-storage/card97a_0c6d65b5.webp`,
  "2026-07-25": `${CDN}/manus-storage/card99_c2515dab.webp`,
  "2026-07-26": `${CDN}/manus-storage/card121b_c2373547.webp`,
  "2026-07-27": `${CDN}/manus-storage/card148a_975aab3f.webp`,
  // Marvel Studios Chrome Gold /50 and Orange /25 and Red /5
  "2026-07-28": `${CDN}/manus-storage/img_studios_blackpanther_gold_21885598.webp`,
  "2026-07-29": `${CDN}/manus-storage/img_studios_mrfantastic_goldwave_4b81e763.webp`,
  "2026-07-30": `${CDN}/manus-storage/img_studios_spiderman_gold_47977a64.webp`,
  "2026-07-31": `${CDN}/manus-storage/img_studios_mrfantastic_orange_116275e1.webp`,
  "2026-08-01": `${CDN}/manus-storage/img_studios_invisiblewoman_goldwave_9561728a.webp`,
  "2026-08-02": `${CDN}/manus-storage/img_studios_blackpanther_orange_0c0f72ce.webp`,
  "2026-08-03": `${CDN}/manus-storage/img_studios_thor_red_1699e8db.webp`,
  "2026-08-04": `${CDN}/manus-storage/img_studios_blackwidow_gold_86580e8b.webp`,
  "2026-08-05": `${CDN}/manus-storage/img_studios_hulk_gold_cfd31359.webp`,
  "2026-08-06": `${CDN}/manus-storage/img_studios_spiderman_gold_47977a64.webp`,
  "2026-08-07": `${CDN}/manus-storage/img_studios_invisiblewoman_orange_00c9e4e5.webp`,
  // Marvel Mint Black Chrome /10 and Red Chrome /5
  "2026-08-08": `${CDN}/manus-storage/card103a_9de29825.webp`,   // Iron Man Mint #103
  "2026-08-09": `${CDN}/manus-storage/card105c_e15998c3.webp`,   // Thor Mint #105
  "2026-08-10": `${CDN}/manus-storage/card106_2155555b.webp`,    // Mister Fantastic Red Mint #106
  "2026-08-11": `${CDN}/manus-storage/card108_ca56d510.webp`,    // Rogue Mint #108
  "2026-08-12": `${CDN}/manus-storage/card109a_4342efc1.webp`,   // Hulk Mint #109
  "2026-08-13": `${CDN}/manus-storage/card110a_a4b037f8.webp`,   // Doctor Strange Mint #110
  "2026-08-14": `${CDN}/manus-storage/card111_7b5f9021.webp`,    // Blade Mint #111
  "2026-08-15": `${CDN}/manus-storage/card112_47286424.webp`,    // Storm Mint #112
  "2026-08-16": `${CDN}/manus-storage/card113_385d36a0.webp`,    // Black Widow Mint #113
  "2026-08-17": `${CDN}/manus-storage/card114_a7433443.webp`,    // Venom Mint #114
  "2026-08-18": `${CDN}/manus-storage/card115_9f894b7f.webp`,    // Magneto Mint #115
  "2026-08-19": `${CDN}/manus-storage/card116_842988a6.webp`,    // Daredevil Mint #116
  "2026-08-20": `${CDN}/manus-storage/card117b_39718db7.webp`,   // Professor X Mint #117
  "2026-08-21": `${CDN}/manus-storage/card119_front_d7738a3d.webp`, // Gambit Mint #119
};

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  const [rows] = await conn.execute(
    "SELECT id, date FROM card_of_the_day_entries ORDER BY date"
  );

  console.log(`Found ${rows.length} entries to update`);

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    const dateStr = typeof row.date === "string"
      ? row.date.slice(0, 10)
      : new Date(row.date).toISOString().slice(0, 10);

    const newUrl = DATE_URL_MAP[dateStr];

    if (newUrl) {
      await conn.execute(
        "UPDATE card_of_the_day_entries SET frontImageUrl = ? WHERE id = ?",
        [newUrl, row.id]
      );
      console.log(`✓ ${dateStr} -> ${newUrl.slice(-40)}`);
      updated++;
    } else {
      console.log(`  Skipped ${dateStr} - no URL mapping`);
      skipped++;
    }
  }

  await conn.end();
  console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
}

main().catch(console.error);
