const mysql = require('mysql2/promise');
require('dotenv').config();

const BOX_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/collector_box_073b607c.webp";

// MCU Perfection parallels
const MCU_PARALLELS = "Base, Orange /17, Purple /28, Black /42, Red /83, Gold /406";
const MT_PARALLELS = "Base, Orange /57, Purple /94, Black /141, Red /279, Gold /1347";
const VILLAINY_PARALLELS = "Base, Orange /57, Purple /94, Black /141, Red /279, Gold /1347";
const SS_PARALLELS = "Base, Orange /57, Purple /94, Black /141, Red /279, Gold /1347";
const IG_PARALLELS = "Base, Purple /1683, Blue /5610, Red /8415, Orange /11220, Green /16830, Yellow /33660";

// Autograph parallels
const AUTO_PARALLELS = "Base /5, Orange /35, Purple /58, Black /87, Red /172, Gold /842";
const MUSEUM_PARALLELS = "Base /12, Orange /46, Purple /77, Black /119, Red /229, Gold /1122";
const DUAL_AUTO_PARALLELS = "Base /274, Purple /455, Black /687, Red /1347, Gold /6732";
const ASGARD_PARALLELS = "Base /138, Purple /229, Black /344, Red /687, Gold /3366";
const IG_AUTO_PARALLELS = "Purple /5610, Blue /6732, Red /8415, Orange /11220, Green /16830, Yellow /33660";

// MCU Perfection cards (1-85)
const mcuPerfection = [
  [1, "Mister Fantastic", "The Fantastic Four: First Steps"],
  [2, "Invisible Woman", "The Fantastic Four: First Steps"],
  [3, "Human Torch", "The Fantastic Four: First Steps"],
  [4, "The Thing", "The Fantastic Four: First Steps"],
  [5, "Yelena Belova", "Thunderbolts*"],
  [6, "Bucky Barnes", "Thunderbolts*"],
  [7, "John F. Walker", "Thunderbolts*"],
  [8, "Ghost", "Thunderbolts*"],
  [9, "Taskmaster", "Thunderbolts*"],
  [10, "Sentry", "Thunderbolts*"],
  [11, "Valentina Allegra de Fontaine", "Thunderbolts*"],
  [12, "Captain America", "Captain America: Brave New World"],
  [13, "Red Hulk", "Captain America: Brave New World"],
  [14, "Falcon", "Captain America: Brave New World"],
  [15, "Sidewinder", "Captain America: Brave New World"],
  [16, "The Leader", "Captain America: Brave New World"],
  [17, "Agatha Harkness", "Agatha All Along"],
  [18, "Rio Vidal", "Agatha All Along"],
  [19, "G'iah", "Secret Invasion"],
  [20, "Moon Knight", "Moon Knight"],
  [21, "She-Hulk", "She-Hulk"],
  [22, "Wilson Fisk", "Daredevil: Born Again"],
  [23, "Namor", "Black Panther: Wakanda Forever"],
  [24, "Ironheart", "Black Panther: Wakanda Forever"],
  [25, "Zuri", "Black Panther"],
  [26, "Erik Killmonger", "Black Panther"],
  [27, "Star-Lord", "Guardians of the Galaxy"],
  [28, "Rocket", "Guardians of the Galaxy"],
  [29, "Groot", "Guardians of the Galaxy"],
  [30, "Drax", "Guardians of the Galaxy"],
  [31, "Nebula", "Guardians of the Galaxy"],
  [32, "Yondu", "Guardians of the Galaxy"],
  [33, "The Collector", "Guardians of the Galaxy"],
  [34, "Ego", "Guardians of the Galaxy Vol. 2"],
  [35, "The High Evolutionary", "Guardians of the Galaxy Vol. 3"],
  [36, "Thor", "Thor: Love and Thunder"],
  [37, "The Mighty Thor", "Thor: Love and Thunder"],
  [38, "Odin", "Thor"],
  [39, "Grandmaster", "Thor: Ragnarok"],
  [40, "Frigga", "Thor"],
  [41, "Korg", "Thor: Love and Thunder"],
  [42, "Loki", "Marvel's The Avengers"],
  [43, "Hela", "Thor: Ragnarok"],
  [44, "Sif", "Thor"],
  [45, "Valkyrie", "Thor: Ragnarok"],
  [46, "Captain Marvel", "Captain Marvel"],
  [47, "Talos", "Captain Marvel"],
  [48, "Yon-Rogg", "Captain Marvel"],
  [49, "Ms. Marvel", "The Marvels"],
  [50, "Monica Rambeau", "The Marvels"],
  [51, "Dar-Benn", "The Marvels"],
  [52, "Shang-Chi", "Shang-Chi and the Legend of the Ten Rings"],
  [53, "Ikaris", "Eternals"],
  [54, "Druig", "Eternals"],
  [55, "Thena", "Eternals"],
  [56, "Ant-Man", "Ant-Man"],
  [57, "Hope van Dyne", "Ant-Man"],
  [58, "Dr. Christine Palmer", "Doctor Strange"],
  [59, "Wong", "Doctor Strange"],
  [60, "The Ancient One", "Doctor Strange"],
  [61, "Kaecilius", "Doctor Strange"],
  [62, "Mordo", "Doctor Strange"],
  [63, "Doctor Strange", "Doctor Strange in the Multiverse of Madness"],
  [64, "America Chavez", "Doctor Strange in the Multiverse of Madness"],
  [65, "Clea", "Doctor Strange in the Multiverse of Madness"],
  [66, "Silver Surfer", "The Fantastic Four: First Steps"],
  [67, "Galactus", "The Fantastic Four: First Steps"],
  [68, "Nick Fury", "Avengers: Endgame"],
  [69, "Maria Hill", "Marvel's The Avengers"],
  [70, "Pepper Potts", "Avengers: Endgame"],
  [71, "Aldrich Killian", "Iron Man 3"],
  [72, "Trevor Slattery", "Iron Man 3"],
  [73, "War Machine", "Captain America: Civil War"],
  [74, "Vision", "Avengers: Age of Ultron"],
  [75, "Wanda Maximoff", "Avengers: Infinity War"],
  [76, "Pietro Maximoff", "Avengers: Age of Ultron"],
  [77, "Black Widow", "Avengers: Endgame"],
  [78, "Hawkeye", "Avengers: Endgame"],
  [79, "Kate Bishop", "Hawkeye"],
  [80, "Peggy Carter", "Captain America: The First Avenger"],
  [81, "Captain America", "Avengers: Endgame"],
  [82, "Hulk", "Avengers: Endgame"],
  [83, "Iron Man", "Avengers: Endgame"],
  [84, "Spider-Man", "Avengers: Infinity War"],
  [85, "Thanos", "Avengers: Endgame"],
];

// Marvel Tomorrow (MT-1 to MT-25)
const marvelTomorrow = [
  ["MT-1", "Mister Fantastic", "The Fantastic Four: First Steps"],
  ["MT-2", "M'Baku", "Black Panther: Wakanda Forever"],
  ["MT-3", "Shang-Chi", "Shang-Chi and the Legend of the Ten Rings"],
  ["MT-4", "Black Panther", "Black Panther: Wakanda Forever"],
  ["MT-5", "Namor", "Black Panther: Wakanda Forever"],
  ["MT-6", "Falcon", "Captain America: Brave New World"],
  ["MT-7", "Ms. Marvel", "The Marvels"],
  ["MT-8", "Ghost", "Thunderbolts*"],
  ["MT-9", "Yelena Belova", "Thunderbolts*"],
  ["MT-10", "Captain America", "Captain America: Brave New World"],
  ["MT-11", "John F. Walker", "Thunderbolts*"],
  ["MT-12", "The Vision", "WandaVision"],
  ["MT-13", "Adam Warlock", "Guardians of the Galaxy Vol. 3"],
  ["MT-14", "Moon Knight", "Moon Knight"],
  ["MT-15", "Red Guardian", "Thunderbolts*"],
  ["MT-16", "Cassie Lang", "Ant-Man and the Wasp: Quantumania"],
  ["MT-17", "She-Hulk", "She-Hulk"],
  ["MT-18", "Riri Williams", "Black Panther: Wakanda Forever"],
  ["MT-19", "Monica Rambeau", "The Marvels"],
  ["MT-20", "Human Torch", "The Fantastic Four: First Steps"],
  ["MT-21", "The Thing", "The Fantastic Four: First Steps"],
  ["MT-22", "Invisible Woman", "The Fantastic Four: First Steps"],
  ["MT-23", "Sylvie", "Loki"],
  ["MT-24", "Kate Bishop", "Hawkeye"],
  ["MT-25", "Sentry", "Thunderbolts*"],
];

// Villainy (V-01 to V-25)
const villainy = [
  ["V-01", "Thanos"],
  ["V-02", "Galactus"],
  ["V-03", "Ultron"],
  ["V-04", "Namor"],
  ["V-05", "Malekith"],
  ["V-06", "Aldrich Killian"],
  ["V-07", "Erik Killmonger"],
  ["V-08", "Ronan"],
  ["V-09", "Ego"],
  ["V-10", "Justin Hammer"],
  ["V-11", "Iron Monger"],
  ["V-12", "Crossbones"],
  ["V-13", "Yellowjacket"],
  ["V-14", "Baron Zemo"],
  ["V-15", "Wilson Fisk"],
  ["V-16", "Kaecilius"],
  ["V-17", "Hela"],
  ["V-18", "Dar-Benn"],
  ["V-19", "Grandmaster"],
  ["V-20", "Agatha Harkness"],
  ["V-21", "Wenwu"],
  ["V-22", "M.O.D.O.K."],
  ["V-23", "Yon-Rogg"],
  ["V-24", "Red Hulk"],
  ["V-25", "The Void"],
];

// Show Stoppers (ST-1 to ST-25)
const showStoppers = [
  ["ST-1", "Avengers Assembled"],
  ["ST-2", "Tony Tests His Mark"],
  ["ST-3", "An Explosive Escape"],
  ["ST-4", "A Universal Threat Emerges"],
  ["ST-5", "Mayhem in Monaco"],
  ["ST-6", "The Battle of Wakanda"],
  ["ST-7", "Strength of the Winter Soldier"],
  ["ST-8", "Black Widow Emerges Victorious"],
  ["ST-9", "Swinging Into Action"],
  ["ST-10", "Reaching For Infinity"],
  ["ST-11", "Wanda's Sacrifice"],
  ["ST-12", "Suiting Up For Battle"],
  ["ST-13", "Thor Confronts Gorr"],
  ["ST-14", "The Marvels United"],
  ["ST-15", "Shuri Takes Up The Mantle"],
  ["ST-16", "Rocket Leads The Charge"],
  ["ST-17", "Rumble on the Runway"],
  ["ST-18", "Bargaining with Dormammu"],
  ["ST-19", "Ego's Secrets Revealed"],
  ["ST-20", "Fending Off Fenris"],
  ["ST-21", "Upgrades Unleashed"],
  ["ST-22", "Tony Stark's Final Stand"],
  ["ST-23", "Earth's Last Hope"],
  ["ST-24", "A Legacy Lives On"],
  ["ST-25", "Introducing The New Avengers"],
];

// Infinity Gauntlet (IG-1 to IG-6) - all Thanos
const infinityGauntlet = [
  ["IG-1", "Thanos"],
  ["IG-2", "Thanos"],
  ["IG-3", "Thanos"],
  ["IG-4", "Thanos"],
  ["IG-5", "Thanos"],
  ["IG-6", "Thanos"],
];

// MCU Perfection Autograph Variation
const mcuAutoVariation = [
  ["MP-AO", "Aaron Taylor-Johnson", "Pietro Maximoff"],
  ["MP-BL", "Brie Larson", "Captain Marvel"],
  ["MP-CG", "Clark Gregg", "Phil Coulson"],
  ["MP-CL", "Corey Stoll", "Yellowjacket"],
  ["MP-CS", "Cobie Smulders", "Maria Hill"],
  ["MP-CT", "Charlize Theron", "Clea"],
  ["MP-DC", "Don Cheadle", "War Machine"],
  ["MP-DR", "Danny Ramirez", "Falcon"],
  ["MP-DT", "Dominique Thorne", "Ironheart"],
  ["MP-EC", "Emilia Clarke", "G'iah"],
  ["MP-EL", "Evangeline Lilly", "Hope van Dyne"],
  ["MP-EMB", "Ebon Moss-Bachrach", "The Thing"],
  ["MP-EO", "Elizabeth Olsen", "Wanda Maximoff"],
  ["MP-FW", "Forest Whitaker", "Zuri"],
  ["MP-GE", "Giancarlo Esposito", "Sidewinder"],
  ["MP-GP", "Gwyneth Paltrow", "Pepper Potts"],
  ["MP-HA", "Hayley Atwell", "Peggy Carter"],
  ["MP-IV", "Iman Vellani", "Ms. Marvel"],
  ["MP-JA", "Jaimie Alexander", "Sif"],
  ["MP-JLD", "Julia Louis-Dreyfus", "Valentina Allegra de Fontaine"],
  ["MP-JQ", "Joseph Quinn", "Human Torch"],
  ["MP-JR", "Jeremy Renner", "Hawkeye"],
  ["MP-KG", "Karen Gillan", "Nebula"],
  ["MP-KH", "Kathryn Hahn", "Agatha Harkness"],
  ["MP-LP", "Lewis Pullman", "Sentry"],
  ["MP-MJ", "Michael B. Jordan", "Erik Killmonger"],
  ["MP-MR", "Michael Rooker", "Yondu"],
  ["MP-PB", "Paul Bettany", "Vision"],
  ["MP-PK", "Pom Klementieff", "Mantis"],
  ["MP-PR", "Paul Rudd", "Ant-Man"],
  ["MP-SK", "Stellan Skarsgård", "Dr. Erik Selvig"],
  ["MP-SL", "Simu Liu", "Shang-Chi"],
  ["MP-SS", "Sebastian Stan", "Bucky Barnes"],
  ["MP-THM", "Tenoch Huerta", "Namor"],
  ["MP-TM", "Tatiana Maslany", "She-Hulk"],
  ["MP-TP", "Teyonah Parris", "Monica Rambeau"],
  ["MP-TS", "Tilda Swinton", "The Ancient One"],
  ["MP-TW", "Taika Waititi", "Korg"],
  ["MP-VK", "Vanessa Kirby", "Invisible Woman"],
  ["MP-WR", "Wyatt Russell", "John F. Walker"],
];

// Dual Autographs
const dualAutos = [
  ["DA-CJ", "Chris Evans & Jeremy Renner", "Captain America & Hawkeye"],
  ["DA-EJ", "Ebon Moss-Bachrach & Joseph Quinn", "The Thing & Human Torch"],
  ["DA-JE", "Josh Brolin & Elizabeth Olsen", "Thanos & Wanda Maximoff"],
  ["DA-PE", "Paul Rudd & Evangeline Lilly", "Ant-Man & The Wasp"],
  ["DA-PV", "Pedro Pascal & Vanessa Kirby", "Mister Fantastic & Invisible Woman"],
];

// Treasures of Asgard
const treasuresOfAsgard = [
  ["TA-AH", "Anthony Hopkins", "Odin"],
  ["TA-CB", "Cate Blanchett", "Hela"],
  ["TA-CE", "Christopher Eccleston", "Malekith"],
  ["TA-CF", "Colm Feore", "King Laufey"],
  ["TA-JA", "Jaimie Alexander", "Sif"],
  ["TA-JD", "Josh Dallas", "Fandral"],
  ["TA-NP", "Natalie Portman", "Dr. Jane Foster"],
  ["TA-RR", "Rene Russo", "Frigga"],
  ["TA-TT", "Tessa Thompson", "Valkyrie"],
  ["TA-TW", "Taika Waititi", "Korg"],
];

// Infinity Gauntlet Autograph Variation
const igAutoVariation = [
  ["IG-JB1", "Josh Brolin", "Thanos"],
  ["IG-JB2", "Josh Brolin", "Thanos"],
  ["IG-JB3", "Josh Brolin", "Thanos"],
  ["IG-JB4", "Josh Brolin", "Thanos"],
  ["IG-JB5", "Josh Brolin", "Thanos"],
  ["IG-JB6", "Josh Brolin", "Thanos"],
];

// The Collector's Museum
const collectorsMuseum = [
  ["TM-AS", "Angela Bassett", "Ramonda"],
  ["TM-BK", "Barry Keoghan", "Druig"],
  ["TM-BL", "Brie Larson", "Captain Marvel"],
  ["TM-BT", "Benicio Del Toro", "The Collector"],
  ["TM-CB", "Cate Blanchett", "Hela"],
  ["TM-DC", "Don Cheadle", "War Machine"],
  ["TM-DT", "Dominique Thorne", "Riri Williams"],
  ["TM-EC", "Emilia Clarke", "G'iah"],
  ["TM-ED", "Elizabeth Debicki", "Ayesha"],
  ["TM-EL", "Evangeline Lilly", "The Wasp"],
  ["TM-EMB", "Ebon Moss-Bachrach", "The Thing"],
  ["TM-EO", "Elizabeth Olsen", "Wanda Maximoff"],
  ["TM-FW", "Forest Whitaker", "Zuri"],
  ["TM-HA", "Hayley Atwell", "Peggy Carter"],
  ["TM-IV", "Iman Vellani", "Ms. Marvel"],
  ["TM-JQ", "Joseph Quinn", "Human Torch"],
  ["TM-JR", "Jeremy Renner", "Hawkeye"],
  ["TM-KG", "Karen Gillan", "Nebula"],
  ["TM-KH", "Kathryn Hahn", "Agatha Harkness"],
  ["TM-LP", "Lee Pace", "Ronan"],
  ["TM-MB", "Maria Bakalova", "Cosmo"],
  ["TM-MJ", "Michael B. Jordan", "Erik Killmonger"],
  ["TM-PB", "Paul Bettany", "Vision"],
  ["TM-PK", "Pom Klementieff", "Mantis"],
  ["TM-SDM", "Sophia Di Martino", "Sylvie"],
  ["TM-THM", "Tenoch Huerta", "Namor"],
  ["TM-TM", "Tatiana Maslany", "She-Hulk"],
  ["TM-TP", "Teyonah Parris", "Monica Rambeau"],
  ["TM-VK", "Vanessa Kirby", "Invisible Woman"],
  ["TM-WR", "Wyatt Russell", "John F. Walker"],
];

(async () => {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    // 1. Create the set
    const setDesc = "2025 Topps Marvel Studios: The Collector features MCU Perfection base cards, Marvel Tomorrow inserts, Villainy villains, Show Stoppers action scenes, Infinity Gauntlet Thanos cards, plus autographs from top MCU actors including Treasures of Asgard and The Collector's Museum relic cards. 3 packs per box, 1 card per pack.";
    
    const [setResult] = await conn.query(
      `INSERT INTO marvel_sets (name, shortName, slug, releaseYear, totalCards, description, imageUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ["2025 Topps Marvel Studios: The Collector", "The Collector", "2025-marvel-the-collector", 2025, 0, setDesc, BOX_IMAGE]
    );
    const setId = setResult.insertId;
    console.log(`Created set with ID: ${setId}`);
    
    let totalCards = 0;
    
    // 2. Insert MCU Perfection cards
    for (const [num, name, property] of mcuPerfection) {
      await conn.query(
        `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, description, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [setId, String(num), name, "MCU Perfection", MCU_PARALLELS, property, num]
      );
      totalCards++;
    }
    console.log(`Inserted ${mcuPerfection.length} MCU Perfection cards`);
    
    // 3. Insert Marvel Tomorrow cards
    for (let i = 0; i < marvelTomorrow.length; i++) {
      const [num, name, property] = marvelTomorrow[i];
      await conn.query(
        `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, description, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [setId, num, name, "Marvel Tomorrow", MT_PARALLELS, property, 100 + i]
      );
      totalCards++;
    }
    console.log(`Inserted ${marvelTomorrow.length} Marvel Tomorrow cards`);
    
    // 4. Insert Villainy cards
    for (let i = 0; i < villainy.length; i++) {
      const [num, name] = villainy[i];
      await conn.query(
        `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [setId, num, name, "Villainy", VILLAINY_PARALLELS, 200 + i]
      );
      totalCards++;
    }
    console.log(`Inserted ${villainy.length} Villainy cards`);
    
    // 5. Insert Show Stoppers cards
    for (let i = 0; i < showStoppers.length; i++) {
      const [num, name] = showStoppers[i];
      await conn.query(
        `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [setId, num, name, "Show Stoppers", SS_PARALLELS, 300 + i]
      );
      totalCards++;
    }
    console.log(`Inserted ${showStoppers.length} Show Stoppers cards`);
    
    // 6. Insert Infinity Gauntlet cards
    for (let i = 0; i < infinityGauntlet.length; i++) {
      const [num, name] = infinityGauntlet[i];
      await conn.query(
        `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [setId, num, name, "Infinity Gauntlet", IG_PARALLELS, 400 + i]
      );
      totalCards++;
    }
    console.log(`Inserted ${infinityGauntlet.length} Infinity Gauntlet cards`);
    
    // 7. Insert MCU Perfection Autograph Variation
    for (let i = 0; i < mcuAutoVariation.length; i++) {
      const [num, actor, character] = mcuAutoVariation[i];
      await conn.query(
        `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, description, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [setId, num, `${character} (${actor})`, "MCU Perfection Autograph", AUTO_PARALLELS, `Autograph card signed by ${actor}`, 500 + i]
      );
      totalCards++;
    }
    console.log(`Inserted ${mcuAutoVariation.length} MCU Perfection Autograph cards`);
    
    // 8. Insert Dual Autographs
    for (let i = 0; i < dualAutos.length; i++) {
      const [num, actors, characters] = dualAutos[i];
      await conn.query(
        `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, description, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [setId, num, characters, "Dual Autographs", DUAL_AUTO_PARALLELS, `Dual autograph card signed by ${actors}`, 600 + i]
      );
      totalCards++;
    }
    console.log(`Inserted ${dualAutos.length} Dual Autograph cards`);
    
    // 9. Insert Treasures of Asgard
    for (let i = 0; i < treasuresOfAsgard.length; i++) {
      const [num, actor, character] = treasuresOfAsgard[i];
      await conn.query(
        `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, description, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [setId, num, `${character} (${actor})`, "Treasures of Asgard", ASGARD_PARALLELS, `Treasures of Asgard autograph signed by ${actor}`, 700 + i]
      );
      totalCards++;
    }
    console.log(`Inserted ${treasuresOfAsgard.length} Treasures of Asgard cards`);
    
    // 10. Insert Infinity Gauntlet Autograph Variation
    for (let i = 0; i < igAutoVariation.length; i++) {
      const [num, actor, character] = igAutoVariation[i];
      await conn.query(
        `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, description, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [setId, num, `${character} (${actor})`, "Infinity Gauntlet Autograph", IG_AUTO_PARALLELS, `Infinity Gauntlet autograph signed by ${actor}`, 800 + i]
      );
      totalCards++;
    }
    console.log(`Inserted ${igAutoVariation.length} Infinity Gauntlet Autograph cards`);
    
    // 11. Insert The Collector's Museum
    for (let i = 0; i < collectorsMuseum.length; i++) {
      const [num, actor, character] = collectorsMuseum[i];
      await conn.query(
        `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, description, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [setId, num, `${character} (${actor})`, "The Collector's Museum", MUSEUM_PARALLELS, `The Collector's Museum autograph signed by ${actor}`, 900 + i]
      );
      totalCards++;
    }
    console.log(`Inserted ${collectorsMuseum.length} Collector's Museum cards`);
    
    // Update total card count
    await conn.query(`UPDATE marvel_sets SET totalCards = ? WHERE id = ?`, [totalCards, setId]);
    console.log(`\nTotal cards inserted: ${totalCards}`);
    console.log(`Set ID: ${setId}`);
    
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await conn.end();
  }
})();
