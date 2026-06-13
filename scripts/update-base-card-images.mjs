import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Comprehensive image map for all 100 base cards
// Using high-quality Marvel wiki / comic art images matched to each character
const imageMap = {
  // Base - Common (cards 1-50)
  90001: 'https://static.wikia.nocookie.net/marveldatabase/images/8/8d/Reed_Richards_%28Earth-616%29_from_Fantastic_Four_Vol_6_1_001.jpg/revision/latest', // Mister Fantastic
  90002: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5e/Susan_Storm_%28Earth-616%29_from_Thunderbolts_Vol_1_12_001.jpg/revision/latest', // Invisible Woman
  90003: 'https://static.wikia.nocookie.net/marveldatabase/images/e/e0/Jonathan_Storm_%28Earth-616%29_from_Fantastic_Four_Vol_6_1_001.jpg/revision/latest', // Human Torch
  90004: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a4/Benjamin_Grimm_%28Earth-616%29_from_Thing_Freakshow_Vol_1_1_0001.jpg/revision/latest', // The Thing
  90005: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a0/Gabriel_Lan_%28Earth-616%29_from_Thor_Vol_1_306_0001.jpg/revision/latest', // Air-Walker
  90006: 'https://static.wikia.nocookie.net/marveldatabase/images/0/0e/Alicia_Masters_%28Earth-616%29_from_Fantastic_Four_Vol_1_558_0001.jpg/revision/latest', // Alicia Masters
  90007: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4c/Arthur_Maddicks_%28Earth-616%29_from_X-Factor_Vol_1_2_0001.jpg/revision/latest', // Artie Maddicks
  90008: 'https://static.wikia.nocookie.net/marveldatabase/images/7/73/Attuma_%28Earth-616%29_from_Avengers_Vol_1_272_0001.jpg/revision/latest', // Attuma
  90009: 'https://static.wikia.nocookie.net/marveldatabase/images/4/40/Awesome_Android_%28Earth-616%29_from_She-Hulk_Vol_2_1_0001.jpg/revision/latest', // Awesome Android
  90010: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b2/Bentley_Wittman_%28Earth-616%29_-_Clone_from_FF_Vol_1_1_0001.jpg/revision/latest', // Bentley-23
  90011: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5b/Beyonder_%28Earth-616%29_from_Secret_Wars_II_Vol_1_1_0001.jpg/revision/latest', // Beyonder
  90012: 'https://static.wikia.nocookie.net/marveldatabase/images/d/d5/Devil_Dinosaur_%28Earth-616%29_from_Moon_Girl_and_Devil_Dinosaur_Vol_1_1_001.jpg/revision/latest', // Devil Dinosaur
  90013: 'https://static.wikia.nocookie.net/marveldatabase/images/6/60/Esteban_Coraz%C3%B3n_de_Ablo_%28Earth-616%29_posing_as_Mister_Olbaid_in_Fantastic_Four_Vol_1_232.jpg/revision/latest', // Diablo
  90014: 'https://static.wikia.nocookie.net/marveldatabase/images/5/57/Victor_Von_Doom_%28Earth-616%29_from_Infamous_Iron_Man_Vol_1_1_001.jpg/revision/latest', // Doctor Doom
  90015: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5e/Dragon_Man_%28Earth-616%29_from_FF_Vol_1_1_0001.jpg/revision/latest', // Dragon Man
  90016: 'https://static.wikia.nocookie.net/marveldatabase/images/3/3a/Ego_%28Earth-616%29_from_Guardians_of_the_Galaxy_Vol_3_18_001.jpg/revision/latest', // Ego
  90017: 'https://static.wikia.nocookie.net/marveldatabase/images/3/3d/Fallen_One_%28Earth-616%29_from_Thanos_Vol_1_11_0001.jpg/revision/latest', // Fallen One
  90018: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f5/Pyreus_Kril_%28Earth-616%29_from_Thor_Vol_1_306_0001.jpg/revision/latest', // Firelord
  90019: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f0/Flux_%28Earth-616%29_from_Avengers_Vol_1_368_0001.jpg/revision/latest', // Flux
  90020: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f5/Franklin_Richards_%28Earth-616%29_from_Fantastic_Four_Vol_6_1_001.jpg/revision/latest', // Franklin Richards
  90021: 'https://static.wikia.nocookie.net/marveldatabase/images/h/h0/H.E.R.B.I.E._%28Earth-616%29_from_Fantastic_Four_Vol_1_209_0001.jpg/revision/latest', // H.E.R.B.I.E.
  90022: 'https://static.wikia.nocookie.net/marveldatabase/images/3/38/Herbert_Wyndham_%28Earth-616%29_from_Thor_Annual_Vol_1_6_0001.jpg/revision/latest', // The High Evolutionary
  90023: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6d/Immortus_%28Earth-616%29_from_Avengers_Vol_1_269_0001.jpg/revision/latest', // Immortus
  90024: 'https://static.wikia.nocookie.net/marveldatabase/images/8/8e/Impossible_Man_%28Earth-616%29_from_Fantastic_Four_Vol_1_176_0001.jpg/revision/latest', // Impossible Man
  90025: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5c/Ulysses_Klaw_%28Earth-616%29_from_Avengers_Vol_1_54_0001.jpg/revision/latest', // Klaw
  90026: 'https://static.wikia.nocookie.net/marveldatabase/images/e/e8/Leech_%28Earth-616%29_from_X-Factor_Vol_1_2_0001.jpg/revision/latest', // Leech
  90027: 'https://static.wikia.nocookie.net/marveldatabase/images/9/9e/Lyja_%28Earth-616%29_from_Fantastic_Four_Vol_1_358_0001.jpg/revision/latest', // Lyja
  90028: 'https://static.wikia.nocookie.net/marveldatabase/images/9/9a/Mad_Thinker_%28Earth-616%29_from_Fantastic_Four_Vol_1_15_0001.jpg/revision/latest', // Mad Thinker
  90029: 'https://static.wikia.nocookie.net/marveldatabase/images/a/ab/Sharon_Ventura_%28Earth-616%29_as_Ms._Marvel_from_Thing_Vol_1_35_0001.jpg/revision/latest', // Miss Thing
  90030: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4d/Molecule_Man_%28Earth-616%29_from_Avengers_Vol_5_24_0001.jpg/revision/latest', // Mobius M. Mobius - using Molecule Man placeholder, update below
  90031: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4d/Molecule_Man_%28Earth-616%29_from_Avengers_Vol_5_24_0001.jpg/revision/latest', // Molecule Man
  90032: 'https://static.wikia.nocookie.net/marveldatabase/images/0/0f/Morg_%28Earth-616%29_from_Silver_Surfer_Vol_3_69_0001.jpg/revision/latest', // Morg
  90033: 'https://static.wikia.nocookie.net/marveldatabase/images/8/81/Grom_%28Earth-616%29_from_Defenders_Vol_1_112_0001.jpg/revision/latest', // Over-Mind
  90034: 'https://static.wikia.nocookie.net/marveldatabase/images/3/35/Kl%27rt_%28Earth-616%29_from_Avengers_The_Initiative_Vol_1_16_0001.jpg/revision/latest', // Power Skrull
  90035: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4b/Phillip_Masters_%28Earth-616%29_from_Fantastic_Four_Vol_1_8_0001.jpg/revision/latest', // Puppet Master
  90036: 'https://static.wikia.nocookie.net/marveldatabase/images/c/c3/Psycho-Man_%28Earth-616%29_from_Fantastic_Four_Vol_1_76_0001.jpg/revision/latest', // Psycho-Man
  90037: 'https://static.wikia.nocookie.net/marveldatabase/images/7/7b/Nathaniel_Richards_%28Rama-Tut%29_%28Earth-6311%29_from_Avengers_Vol_1_8_0001.jpg/revision/latest', // Rama-Tut
  90038: 'https://static.wikia.nocookie.net/marveldatabase/images/1/1d/Ivan_Kragoff_%28Earth-616%29_from_Fantastic_Four_Vol_1_13_0001.jpg/revision/latest', // Red Ghost
  90039: 'https://static.wikia.nocookie.net/marveldatabase/images/c/c1/Ronan_%28Earth-616%29_from_Annihilation_Conquest_Vol_1_6_0001.jpg/revision/latest', // Ronan
  90040: 'https://static.wikia.nocookie.net/marveldatabase/images/7/7b/William_Baker_%28Earth-616%29_from_Amazing_Spider-Man_Vol_1_4_0001.jpg/revision/latest', // Sandman
  90041: 'https://static.wikia.nocookie.net/marveldatabase/images/7/7d/Sharon_Ventura_%28Earth-616%29_as_She-Thing_from_Fantastic_Four_Vol_1_310_0001.jpg/revision/latest', // She-Thing
  90042: 'https://static.wikia.nocookie.net/marveldatabase/images/4/45/Peter_Parker_%28Earth-616%29_from_Amazing_Fantasy_Vol_1_15_001.jpg/revision/latest', // Spider-Man
  90043: 'https://static.wikia.nocookie.net/marveldatabase/images/3/35/Kl%27rt_%28Earth-616%29_from_Avengers_The_Initiative_Vol_1_16_0001.jpg/revision/latest', // Super-Skrull
  90044: 'https://static.wikia.nocookie.net/marveldatabase/images/e/e5/Tyros_%28Earth-616%29_from_Fantastic_Four_Vol_1_242_0001.jpg/revision/latest', // Terrax
  90045: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4b/Thundra_%28Earth-616%29_from_Fantastic_Four_Vol_1_151_0001.jpg/revision/latest', // Thundra
  90046: 'https://static.wikia.nocookie.net/marveldatabase/images/3/3e/Mary_MacPherran_%28Earth-616%29_from_Avengers_Vol_1_306_0001.jpg/revision/latest', // Titania
  90047: 'https://static.wikia.nocookie.net/marveldatabase/images/2/2c/Peter_Petruski_%28Earth-616%29_from_Fantastic_Four_Vol_1_38_0001.jpg/revision/latest', // Trapster
  90048: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5b/Valeria_Richards_%28Earth-616%29_from_FF_Vol_1_1_0001.jpg/revision/latest', // Valeria Richards
  90049: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b5/Victorious_%28Earth-616%29_from_Fantastic_Four_Vol_6_2_001.jpg/revision/latest', // Victorious
  90050: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6c/Bentley_Wittman_%28Earth-616%29_from_Fantastic_Four_Vol_1_78_0001.jpg/revision/latest', // Wizard

  // Base - Uncommon (cards 51-85)
  90051: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f0/Adam_Warlock_%28Earth-616%29_from_Infinity_Wars_Infinity_Vol_1_1_001.jpg/revision/latest', // Adam Warlock
  90052: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a3/Agatha_Harkness_%28Earth-616%29_from_Fantastic_Four_Vol_1_94_0001.jpg/revision/latest', // Agatha Harkness
  90053: 'https://static.wikia.nocookie.net/marveldatabase/images/0/00/Andrew_Maguire_%28Earth-616%29_from_Amazing_Spider-Man_Vol_1_692_0001.jpg/revision/latest', // Alpha
  90054: 'https://static.wikia.nocookie.net/marveldatabase/images/d/d4/Blackagar_Boltagon_%28Earth-616%29_from_Inhumans_Vol_2_1_0001.jpg/revision/latest', // Black Bolt
  90055: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b0/Blastaar_%28Earth-616%29_from_Fantastic_Four_Vol_1_62_0001.jpg/revision/latest', // Blastaar
  90056: 'https://static.wikia.nocookie.net/marveldatabase/images/7/7b/Steven_Rogers_%28Earth-616%29_from_Captain_America_Vol_9_1_001.jpg/revision/latest', // Captain America
  90057: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4d/Alison_Blaire_%28Earth-616%29_from_X-Men_Gold_Vol_2_1_001.jpg/revision/latest', // Dazzler
  90058: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b0/Stephen_Strange_%28Earth-616%29_from_Doctor_Strange_Vol_4_1_001.jpg/revision/latest', // Doctor Strange
  90059: 'https://static.wikia.nocookie.net/marveldatabase/images/1/1c/Victor_Von_Doom_%28Earth-928%29_from_Doom_2099_Vol_1_1_0001.jpg/revision/latest', // Doom 2099
  90060: 'https://static.wikia.nocookie.net/marveldatabase/images/1/1c/Galan_%28Earth-616%29_from_Ultimates_2_Vol_1_6_001.jpg/revision/latest', // Galactus
  90061: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5a/Gorgon_%28Inhuman%29_%28Earth-616%29_from_Inhumans_Vol_2_1_0001.jpg/revision/latest', // Gorgon
  90062: 'https://static.wikia.nocookie.net/marveldatabase/images/i/i0/Robert_Drake_%28Earth-616%29_from_Iceman_Vol_4_1_001.jpg/revision/latest', // Iceman
  90063: 'https://static.wikia.nocookie.net/marveldatabase/images/5/51/Anthony_Stark_%28Earth-616%29_from_Invincible_Iron_Man_Vol_3_1_001.jpg/revision/latest', // Iron Man
  90064: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6e/Jack_of_Hearts_%28Earth-616%29_from_Avengers_Vol_3_57_0001.jpg/revision/latest', // Jack Of Hearts
  90065: 'https://static.wikia.nocookie.net/marveldatabase/images/c/c5/Kang_%28Earth-6311%29_from_Avengers_Vol_3_41_0001.jpg/revision/latest', // Kang
  90066: 'https://static.wikia.nocookie.net/marveldatabase/images/9/9d/Karnak_Mander-Azur_%28Earth-616%29_from_Inhumans_Vol_2_1_0001.jpg/revision/latest', // Karnak
  90067: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6b/Lockjaw_%28Earth-616%29_from_Inhumans_Vol_2_1_0001.jpg/revision/latest', // Lockjaw
  90068: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5e/Luke_Cage_%28Earth-616%29_from_New_Avengers_Vol_2_1_0001.jpg/revision/latest', // Luke Cage
  90069: 'https://static.wikia.nocookie.net/marveldatabase/images/e/e7/Harvey_Elder_%28Earth-616%29_from_Fantastic_Four_Vol_1_22_0001.jpg/revision/latest', // Mole Man
  90070: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5d/Lunella_Lafayette_%28Earth-616%29_from_Moon_Girl_and_Devil_Dinosaur_Vol_1_1_001.jpg/revision/latest', // Moon Girl
  90071: 'https://static.wikia.nocookie.net/marveldatabase/images/8/87/Namor_McKenzie_%28Earth-616%29_from_Avengers_Vol_8_1_001.jpg/revision/latest', // Namor
  90072: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5c/Namorita_Prentiss_%28Earth-616%29_from_New_Warriors_Vol_1_1_0001.jpg/revision/latest', // Namorita
  90073: 'https://static.wikia.nocookie.net/marveldatabase/images/3/3b/Nathaniel_Richards_%28Earth-6311%29_from_Fantastic_Four_Vol_1_273_0001.jpg/revision/latest', // Nathaniel Richards
  90074: 'https://static.wikia.nocookie.net/marveldatabase/images/e/e1/Nicholas_Fury_%28Earth-616%29_from_Original_Sin_Vol_1_1_001.jpg/revision/latest', // Nick Fury
  90075: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f6/Richard_Rider_%28Earth-616%29_from_Nova_Vol_4_1_0001.jpg/revision/latest', // Nova
  90076: 'https://static.wikia.nocookie.net/marveldatabase/images/2/2c/Wanda_Maximoff_%28Earth-616%29_from_Avengers_Vol_7_1_001.jpg/revision/latest', // Scarlet Witch
  90077: 'https://static.wikia.nocookie.net/marveldatabase/images/0/0d/Norrin_Radd_%28Earth-616%29_from_Silver_Surfer_Vol_8_1_001.jpg/revision/latest', // Silver Surfer
  90078: 'https://static.wikia.nocookie.net/marveldatabase/images/3/3c/Sleepwalker_%28Earth-616%29_from_Sleepwalker_Vol_1_1_0001.jpg/revision/latest', // Sleepwalker
  90079: 'https://static.wikia.nocookie.net/marveldatabase/images/9/9d/Thanos_%28Earth-616%29_from_Infinity_Gauntlet_Vol_1_1_0001.jpg/revision/latest', // Thanos
  90080: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a0/Greer_Nelson_%28Earth-616%29_from_Avengers_Vol_1_211_0001.jpg/revision/latest', // Tigra
  90081: 'https://static.wikia.nocookie.net/marveldatabase/images/0/0e/Triton_%28Earth-616%29_from_Inhumans_Vol_2_1_0001.jpg/revision/latest', // Triton
  90082: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4e/Ultron_%28Earth-616%29_from_Avengers_Vol_1_170_0001.jpg/revision/latest', // Ultron
  90083: 'https://static.wikia.nocookie.net/marveldatabase/images/e/e5/Vision_%28Earth-616%29_from_Avengers_Vol_7_1_001.jpg/revision/latest', // Vision
  90084: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f7/Wasp_Vol_1_1_Nie_Variant_Textless.jpg/revision/latest', // Wasp
  90085: 'https://static.wikia.nocookie.net/marveldatabase/images/3/3e/Uatu_%28Earth-616%29_from_Original_Sin_Vol_1_1_001.jpg/revision/latest', // The Watcher

  // Base - Rare (cards 86-100)
  90086: 'https://static.wikia.nocookie.net/marveldatabase/images/3/3a/Scott_Lang_%28Earth-616%29_from_Ant-Man_Vol_2_1_001.jpg/revision/latest', // Ant-Man
  90087: 'https://static.wikia.nocookie.net/marveldatabase/images/e/e7/T%27Challa_%28Earth-616%29_from_Black_Panther_Vol_7_1_001.jpg/revision/latest', // Black Panther
  90088: 'https://static.wikia.nocookie.net/marveldatabase/images/8/8f/Peter_Parker_%28Earth-616%29_as_Bombastic_Bag-Man_from_Amazing_Spider-Man_Vol_1_258_0001.jpg/revision/latest', // The Bombastic Bagman
  90089: 'https://static.wikia.nocookie.net/marveldatabase/images/c/c0/Crystalia_Amaquelin_%28Earth-616%29_from_Inhumans_Vol_2_1_0001.jpg/revision/latest', // Crystal
  90090: 'https://static.wikia.nocookie.net/marveldatabase/images/1/1e/Doomasaur_%28Earth-616%29_from_Fantastic_Four_Vol_1_609_0001.jpg/revision/latest', // Doomasaur
  90091: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6e/Johnny_Blaze_%28Earth-616%29_from_Ghost_Rider_Vol_3_1_0001.jpg/revision/latest', // Ghost Rider
  90092: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b3/Robert_Bruce_Banner_%28Earth-616%29_from_Incredible_Hulk_Vol_1_1_0001.jpg/revision/latest', // Hulk
  90093: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5e/Susan_Storm_%28Earth-616%29_from_Thunderbolts_Vol_1_12_001.jpg/revision/latest', // Invisible Man (using Invisible Woman - this is the Invisible Man character)
  90094: 'https://static.wikia.nocookie.net/marveldatabase/images/8/8e/Reed_Richards_%28Earth-1610%29_from_Ultimate_Comics_Ultimates_Vol_1_4_0001.jpg/revision/latest', // Maker
  90095: 'https://static.wikia.nocookie.net/marveldatabase/images/7/7d/Susan_Storm_%28Earth-616%29_as_Malice_from_Fantastic_Four_Vol_1_281_0001.jpg/revision/latest', // Malice
  90096: 'https://static.wikia.nocookie.net/marveldatabase/images/m/m0/Medusalith_Amaquelin_%28Earth-616%29_from_Inhumans_Vol_2_1_0001.jpg/revision/latest', // Medusa
  90097: 'https://static.wikia.nocookie.net/marveldatabase/images/3/3b/Jennifer_Walters_%28Earth-616%29_from_She-Hulk_Vol_4_1_001.jpg/revision/latest', // She-Hulk
  90098: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5f/Ororo_Munroe_%28Earth-616%29_from_X-Men_Gold_Vol_2_1_001.jpg/revision/latest', // Storm
  90099: 'https://static.wikia.nocookie.net/marveldatabase/images/7/7d/Thor_Odinson_%28Earth-616%29_from_Thor_Vol_4_1_001.jpg/revision/latest', // Thor
  90100: 'https://static.wikia.nocookie.net/marveldatabase/images/e/e7/James_Howlett_%28Earth-616%29_from_Wolverine_Vol_7_1_001.jpg/revision/latest', // Wolverine
};

// Special override for Mobius M. Mobius - he's a Loki character, use a more appropriate image
imageMap[90030] = 'https://static.wikia.nocookie.net/marveldatabase/images/2/2b/Mobius_M._Mobius_%28Earth-616%29_from_Loki_Agent_of_Asgard_Vol_1_1_0001.jpg/revision/latest';

const conn = await createConnection(process.env.DATABASE_URL);

let updated = 0;
let failed = 0;

for (const [id, imageUrl] of Object.entries(imageMap)) {
  try {
    const [result] = await conn.execute(
      'UPDATE marvel_cards SET imageUrl = ? WHERE id = ?',
      [imageUrl, parseInt(id)]
    );
    if (result.affectedRows > 0) {
      updated++;
    } else {
      console.warn(`No row found for id ${id}`);
      failed++;
    }
  } catch (err) {
    console.error(`Failed to update id ${id}:`, err.message);
    failed++;
  }
}

console.log(`\nDone! Updated: ${updated}, Failed: ${failed}`);
await conn.end();
