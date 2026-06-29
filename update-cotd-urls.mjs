/**
 * Update all Card of the Day DB entries with clean S3 URLs (no # in filename)
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net";

// Map: date -> new clean S3 URL
// Based on the seed-cotd-full.mjs data + new upload paths
const URL_MAP = {
  // CBH50 Black & Gold Refractor /10
  "2026-06-29": `${CDN}/manus-storage/card13_dc424b10.webp`,       // Iron Man #13
  "2026-06-30": `${CDN}/manus-storage/card10_34815ef1.webp`,       // Hulk #10 (wait - this was uploaded with # originally)
  "2026-07-01": `${CDN}/manus-storage/card31_420b1252.webp`,       // Captain America #31
  "2026-07-02": `${CDN}/manus-storage/card32_cedacd2f.webp`,       // Cyclops #32
  "2026-07-03": `${CDN}/manus-storage/card37_c26c292e.webp`,       // Galactus #37
  "2026-07-04": `${CDN}/manus-storage/card51_117a27c5.webp`,       // Spider-Man #51
  "2026-07-05": `${CDN}/manus-storage/card93_45daab26.webp`,       // Spider-Man #93
  "2026-07-06": `${CDN}/manus-storage/card108b_48008752.webp`,     // Captain America #108
  "2026-07-07": `${CDN}/manus-storage/img_cbh_spiderman_nlf_b1a688ad.webp`, // Spider-Man NLF stand
  "2026-07-08": `${CDN}/manus-storage/img_cbh_doom_purple_ec543382.webp`,   // Doctor Doom Purple #4
  "2026-07-09": `${CDN}/manus-storage/img_cbh_doom_green_aaf22d81.webp`,    // Doctor Doom Green
  "2026-07-10": `${CDN}/manus-storage/img_cbh_doom_red_15f33b1b.webp`,      // Doctor Doom Red #115
  // CBH50 cards from the first batch (numbered with card prefix)
  "2026-07-11": `${CDN}/manus-storage/card1_e8a5f123.webp`,        // Iron Man #1 (Studios Chrome Black)
  "2026-07-12": `${CDN}/manus-storage/card3b_bedb9b20.webp`,       // Captain America #3
  "2026-07-13": `${CDN}/manus-storage/card6_9f2b71f6.webp`,        // Thor #6
  "2026-07-14": `${CDN}/manus-storage/card10_34815ef1.webp`,       // Black Widow #10 -- wait need to check
};

// Better approach: query the DB and update each row by matching character+set
async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  // Get all entries
  const [rows] = await conn.execute(
    "SELECT id, date, characterName, setName, cardNumber, frontImageUrl FROM card_of_the_day_entries ORDER BY date"
  );

  console.log(`Found ${rows.length} entries to update`);

  // Build the URL map based on the actual upload output
  // Key: original filename pattern -> new CDN URL
  const fileMap = {
    // CBH50 cards (card number based)
    "cbh_ironman_13": `${CDN}/manus-storage/card13_dc424b10.webp`,
    "cbh_hulk_10": `${CDN}/manus-storage/card10_34815ef1.webp`,
    "cbh_captainamerica_31": `${CDN}/manus-storage/card31_420b1252.webp`,
    "cbh_cyclops_32": `${CDN}/manus-storage/card32_cedacd2f.webp`,
    "cbh_galactus_37": `${CDN}/manus-storage/card37_c26c292e.webp`,
    "cbh_spiderman_51": `${CDN}/manus-storage/card51_117a27c5.webp`,
    "cbh_spiderman_93": `${CDN}/manus-storage/card93_45daab26.webp`,
    "cbh_captainamerica_108": `${CDN}/manus-storage/card108b_48008752.webp`,
    "cbh_spiderman_nlf": `${CDN}/manus-storage/img_cbh_spiderman_nlf_b1a688ad.webp`,
    "cbh_doom_purple": `${CDN}/manus-storage/img_cbh_doom_purple_ec543382.webp`,
    "cbh_doom_green": `${CDN}/manus-storage/img_cbh_doom_green_aaf22d81.webp`,
    "cbh_doom_red": `${CDN}/manus-storage/img_cbh_doom_red_15f33b1b.webp`,
    // Studios Chrome Black /10
    "studios_ironman_1": `${CDN}/manus-storage/card1_e8a5f123.webp`,
    "studios_captainamerica_3": `${CDN}/manus-storage/card3b_bedb9b20.webp`,
    "studios_thor_6": `${CDN}/manus-storage/card6_9f2b71f6.webp`,
    "studios_blackwidow_10": null, // #10 in studios is Black Widow? No - #10 in CBH is Hulk
    "studios_hulk_13": `${CDN}/manus-storage/card13_dc424b10.webp`, // wait - #13 in CBH is Iron Man
    // Need to re-check the mapping
  };

  // The correct mapping based on what we know:
  // CBH50: #10=Hulk, #13=Iron Man, #31=Cap, #32=Cyclops, #37=Galactus, #51=Spider-Man, #93=Spider-Man, #108=Cap
  // Studios Chrome: #1=Iron Man, #3=Cap, #6=Thor, #10=Black Widow, #13=Hulk, #22=Ant-Man, #25=Doctor Strange
  //                 #29=Spider-Man, #44=Scarlet Witch, #45=Falcon, #51=Shang-Chi, #54=Ms Marvel
  //                 #71=Wolverine, #73=Storm, #81=Mr Fantastic, #97=Black Panther, #99=Daredevil
  //                 #121=Doom, #148=Magneto

  // Direct date->URL mapping based on seed script order
  const dateUrlMap = {
    // CBH50 entries (first 12 rotation slots)
    "2026-06-29": `${CDN}/manus-storage/card13_dc424b10.webp`,      // Iron Man CBH #13
    "2026-06-30": `${CDN}/manus-storage/card10_34815ef1.webp`,      // Hulk CBH #10 -- need to verify this hash
    "2026-07-01": `${CDN}/manus-storage/card31_420b1252.webp`,      // Captain America CBH #31
    "2026-07-02": `${CDN}/manus-storage/card32_cedacd2f.webp`,      // Cyclops CBH #32
    "2026-07-03": `${CDN}/manus-storage/card37_c26c292e.webp`,      // Galactus CBH #37
    "2026-07-04": `${CDN}/manus-storage/card51_117a27c5.webp`,      // Spider-Man CBH #51
    "2026-07-05": `${CDN}/manus-storage/card93_45daab26.webp`,      // Spider-Man CBH #93
    "2026-07-06": `${CDN}/manus-storage/card108b_48008752.webp`,    // Captain America CBH #108
    "2026-07-07": `${CDN}/manus-storage/img_cbh_spiderman_nlf_b1a688ad.webp`, // Spider-Man NLF
    "2026-07-08": `${CDN}/manus-storage/img_cbh_doom_purple_ec543382.webp`,   // Doom Purple CBH #4
    "2026-07-09": `${CDN}/manus-storage/img_cbh_doom_green_aaf22d81.webp`,    // Doom Green CBH
    "2026-07-10": `${CDN}/manus-storage/img_cbh_doom_red_15f33b1b.webp`,      // Doom Red CBH #115
    // Studios Chrome Black /10
    "2026-07-11": `${CDN}/manus-storage/card1_e8a5f123.webp`,       // Iron Man Studios #1
    "2026-07-12": `${CDN}/manus-storage/card3b_bedb9b20.webp`,      // Captain America Studios #3
    "2026-07-13": `${CDN}/manus-storage/card6_9f2b71f6.webp`,       // Thor Studios #6
    "2026-07-14": `${CDN}/manus-storage/card10_34815ef1.webp`,      // Black Widow Studios #10 -- same hash as CBH Hulk? No...
  };

  // Actually the card10 hash from the renamed upload is for CBH Hulk #10
  // Studios Black Widow #10 was uploaded as card10.webp too - same filename collision!
  // Let me just use the actual upload output hashes

  await conn.end();
  console.log("Done - need to check hashes from upload output");
}

main().catch(console.error);
