/**
 * Card of the Day — Rotation Engine
 * 20 Platinum characters (#101–120) from 2025 Topps Marvel Mint
 * rotating across 3 sets, never the same set two days in a row.
 *
 * Rotation rule:
 *   - Characters cycle in order (Day 1 = char[0], Day 2 = char[1], …)
 *   - Sets cycle: mint → comic_book_heroes → marvel_studios → mint → …
 *   - BUT: if today's set is the same as yesterday's, skip to the next set
 *
 * The rotation is deterministic from a fixed epoch date so it never
 * drifts regardless of server restarts or missed days.
 */

export type SetKey = "mint" | "comic_book_heroes" | "marvel_studios";

export interface PlatinumCharacter {
  cardNumber: string;   // e.g. "#101"
  characterName: string;
  characterRealName?: string;
  characterTagline?: string;
  characterBio: string;
  characterFacts: { k: string; v: string }[];
  buzzNote: string;
}

export interface DayRotation {
  characterIndex: number;
  character: PlatinumCharacter;
  setKey: SetKey;
  setLabel: string;
  cardNumber: string;
  dateISO: string;
  dateLabel: string;
}

// ── 20 Platinum Characters ──────────────────────────────────────────────────
export const PLATINUM_CHARACTERS: PlatinumCharacter[] = [
  {
    cardNumber: "#101",
    characterName: "Spider-Man",
    characterRealName: "Peter Parker",
    characterTagline: "Spider-Man · Queens, New York",
    characterBio:
      "Bitten by a radioactive spider as a teenager, Peter Parker became New York City's most beloved wall-crawler. Armed with his web-shooters and spider-sense, he balances life as a student, photographer, and hero — driven by the lesson that with great power comes great responsibility.",
    characterFacts: [
      { k: "First app.", v: "Amazing Fantasy #15 (1962)" },
      { k: "Powers", v: "Wall-crawling · Web-slinging · Spider-sense" },
      { k: "Affiliation", v: "Avengers · Fantastic Four" },
    ],
    buzzNote:
      "Spider-Man remains the top-selling Marvel card character across all 2025 Topps sets. His Platinum parallel consistently commands a premium on the secondary market.",
  },
  {
    cardNumber: "#102",
    characterName: "Wolverine",
    characterRealName: "James 'Logan' Howlett",
    characterTagline: "Wolverine · Weapon X",
    characterBio:
      "With an adamantium skeleton, retractable claws, and a healing factor that borders on immortality, Logan is the best there is at what he does. A century of war, loss, and redemption has forged one of Marvel's most complex heroes.",
    characterFacts: [
      { k: "First app.", v: "Incredible Hulk #181 (1974)" },
      { k: "Powers", v: "Adamantium claws · Healing factor · Enhanced senses" },
      { k: "Affiliation", v: "X-Men · Avengers" },
    ],
    buzzNote:
      "Wolverine's MCU debut is imminent — his Platinum card is one of the most-watched in the entire Mint set.",
  },
  {
    cardNumber: "#103",
    characterName: "Iron Man",
    characterRealName: "Tony Stark",
    characterTagline: "Iron Man · Stark Industries",
    characterBio:
      "Genius, billionaire, philanthropist — Tony Stark built a suit of armor in a cave and changed the world. As Iron Man, he anchored the Avengers and sacrificed everything to protect the universe from Thanos.",
    characterFacts: [
      { k: "First app.", v: "Tales of Suspense #39 (1963)" },
      { k: "Powers", v: "Iron Man armor · Genius intellect · Arc reactor" },
      { k: "Affiliation", v: "Avengers · S.H.I.E.L.D." },
    ],
    buzzNote:
      "Tony Stark's legacy looms large over the MCU's next chapter. Iron Man cards remain perennial blue-chip investments in the Marvel card market.",
  },
  {
    cardNumber: "#104",
    characterName: "Captain America",
    characterRealName: "Steve Rogers",
    characterTagline: "Captain America · Brooklyn, New York",
    characterBio:
      "A scrawny kid from Brooklyn transformed by the Super-Soldier Serum into the living symbol of American ideals. Steve Rogers led the Avengers through their darkest hours and proved that the shield is nothing without the man behind it.",
    characterFacts: [
      { k: "First app.", v: "Captain America Comics #1 (1941)" },
      { k: "Powers", v: "Super-Soldier Serum · Vibranium shield · Peak human" },
      { k: "Affiliation", v: "Avengers · S.H.I.E.L.D." },
    ],
    buzzNote:
      "With Sam Wilson carrying the shield in the MCU, both Rogers and Wilson Cap cards are seeing renewed collector interest heading into 2025.",
  },
  {
    cardNumber: "#105",
    characterName: "Thor",
    characterRealName: "Thor Odinson",
    characterTagline: "Thor · Asgard",
    characterBio:
      "The Asgardian God of Thunder wields Mjolnir and commands lightning itself. Thor has defended both Asgard and Earth across centuries, growing from an arrogant prince into one of the Avengers' most powerful members.",
    characterFacts: [
      { k: "First app.", v: "Journey into Mystery #83 (1962)" },
      { k: "Powers", v: "Mjolnir · Lightning control · Godlike strength" },
      { k: "Affiliation", v: "Avengers · Asgard" },
    ],
    buzzNote:
      "Thor's Platinum parallel is among the most visually striking in the Mint set — the foil treatment on the hammer design is exceptional.",
  },
  {
    cardNumber: "#106",
    characterName: "Black Widow",
    characterRealName: "Natasha Romanoff",
    characterTagline: "Black Widow · Red Room",
    characterBio:
      "Trained from childhood in the Soviet Red Room program, Natasha Romanoff became the world's greatest spy and one of S.H.I.E.L.D.'s most trusted agents. Her skills, wit, and moral evolution make her one of Marvel's most compelling characters.",
    characterFacts: [
      { k: "First app.", v: "Tales of Suspense #52 (1964)" },
      { k: "Powers", v: "Master spy · Martial arts · Widow's Bite gauntlets" },
      { k: "Affiliation", v: "Avengers · S.H.I.E.L.D." },
    ],
    buzzNote:
      "Black Widow cards have seen steady appreciation since her sacrifice in Endgame. Collectors view her Platinum as a tribute card worth holding.",
  },
  {
    cardNumber: "#107",
    characterName: "Doctor Doom",
    characterRealName: "Victor Von Doom",
    characterTagline: "Doctor Doom · Latveria",
    characterBio:
      "Monarch of Latveria, master of science and sorcery, and the greatest villain in Marvel history. Victor Von Doom's iron mask hides a scarred face and an ego that rivals his genius — he genuinely believes he alone can save the world, and he might be right.",
    characterFacts: [
      { k: "First app.", v: "Fantastic Four #5 (1962)" },
      { k: "Powers", v: "Genius intellect · Sorcery · Doom Armor" },
      { k: "Affiliation", v: "Latveria · Cabal" },
    ],
    buzzNote:
      "Doctor Doom is moving to the center of the MCU ahead of Avengers: Doomsday. His Platinum #107 is the most-watched card in the entire Mint set right now.",
  },
  {
    cardNumber: "#108",
    characterName: "Black Panther",
    characterRealName: "T'Challa",
    characterTagline: "Black Panther · Wakanda",
    characterBio:
      "King of Wakanda and protector of the most technologically advanced nation on Earth, T'Challa combines the power of the Heart-Shaped Herb with genius-level intellect. As Black Panther, he is both a symbol of African excellence and a founding Avenger.",
    characterFacts: [
      { k: "First app.", v: "Fantastic Four #52 (1966)" },
      { k: "Powers", v: "Vibranium suit · Enhanced strength · Panther senses" },
      { k: "Affiliation", v: "Avengers · Wakanda" },
    ],
    buzzNote:
      "Black Panther cards remain strong performers. With Wakanda Forever's legacy and the upcoming MCU slate, T'Challa's Platinum holds real long-term value.",
  },
  {
    cardNumber: "#109",
    characterName: "Hulk",
    characterRealName: "Bruce Banner",
    characterTagline: "Hulk · Gamma World",
    characterBio:
      "Gamma radiation transformed mild-mannered scientist Bruce Banner into the Hulk — the strongest there is. Their complex relationship has evolved from pure rage to a merged Smart Hulk, making Banner one of Marvel's most scientifically fascinating characters.",
    characterFacts: [
      { k: "First app.", v: "Incredible Hulk #1 (1962)" },
      { k: "Powers", v: "Limitless strength · Gamma healing · Rage amplification" },
      { k: "Affiliation", v: "Avengers · Defenders" },
    ],
    buzzNote:
      "The Hulk's Platinum card features one of the most dynamic action poses in the set. World War Hulk rumors are keeping collector interest high.",
  },
  {
    cardNumber: "#110",
    characterName: "Scarlet Witch",
    characterRealName: "Wanda Maximoff",
    characterTagline: "Scarlet Witch · Sokovia",
    characterBio:
      "Wanda Maximoff's chaos magic makes her one of the most powerful beings in the Marvel universe. From Hydra experiment to Avenger to the Scarlet Witch of prophecy, her journey is one of Marvel's most emotionally resonant arcs.",
    characterFacts: [
      { k: "First app.", v: "X-Men #4 (1964)" },
      { k: "Powers", v: "Chaos magic · Reality warping · Hex bolts" },
      { k: "Affiliation", v: "Avengers · X-Men" },
    ],
    buzzNote:
      "Scarlet Witch's role in the multiverse saga keeps her cards in high demand. Her Platinum parallel is a fan favorite for its striking red-and-gold design.",
  },
  {
    cardNumber: "#111",
    characterName: "Loki",
    characterRealName: "Loki Laufeyson",
    characterTagline: "Loki · Asgard / TVA",
    characterBio:
      "The God of Mischief and Asgard's most cunning trickster, Loki has been villain, anti-hero, and ultimately hero across his long arc. His Disney+ series cemented him as one of the MCU's most beloved characters.",
    characterFacts: [
      { k: "First app.", v: "Journey into Mystery #85 (1962)" },
      { k: "Powers", v: "Sorcery · Shapeshifting · Illusion casting" },
      { k: "Affiliation", v: "Asgard · TVA" },
    ],
    buzzNote:
      "Loki cards are consistently strong sellers. His Platinum is one of the top-performing cards in the Mint set's secondary market.",
  },
  {
    cardNumber: "#112",
    characterName: "Captain Marvel",
    characterRealName: "Carol Danvers",
    characterTagline: "Captain Marvel · Kree-Skrull War",
    characterBio:
      "Carol Danvers absorbed the power of the Tesseract and became one of the most powerful beings in the universe. As Captain Marvel, she serves as Earth's first line of cosmic defense.",
    characterFacts: [
      { k: "First app.", v: "Marvel Super-Heroes #13 (1968)" },
      { k: "Powers", v: "Binary form · Photon blasts · Flight · Near invulnerability" },
      { k: "Affiliation", v: "Avengers · S.H.I.E.L.D." },
    ],
    buzzNote:
      "Captain Marvel's cosmic power level makes her one of the most sought-after cards in any Topps Marvel set. Her Platinum parallel is a strong pull.",
  },
  {
    cardNumber: "#113",
    characterName: "Doctor Strange",
    characterRealName: "Stephen Strange",
    characterTagline: "Doctor Strange · Sanctum Sanctorum",
    characterBio:
      "Former neurosurgeon turned Sorcerer Supreme, Stephen Strange guards Earth from mystical and dimensional threats. His mastery of the mystic arts and the Eye of Agamotto makes him Marvel's most powerful magic user.",
    characterFacts: [
      { k: "First app.", v: "Strange Tales #110 (1963)" },
      { k: "Powers", v: "Sorcery · Time Stone · Astral projection" },
      { k: "Affiliation", v: "Avengers · Masters of the Mystic Arts" },
    ],
    buzzNote:
      "Doctor Strange's multiverse storyline keeps his cards highly relevant. His Platinum is a standout in the Mint set's foil treatment.",
  },
  {
    cardNumber: "#114",
    characterName: "Ant-Man",
    characterRealName: "Scott Lang",
    characterTagline: "Ant-Man · San Francisco",
    characterBio:
      "Former thief Scott Lang became the second Ant-Man after stealing Hank Pym's suit to save his daughter. His ability to shrink to insect size while maintaining full strength — and grow to giant scale — makes him one of Marvel's most versatile heroes.",
    characterFacts: [
      { k: "First app.", v: "Marvel Premiere #47 (1979)" },
      { k: "Powers", v: "Size manipulation · Pym Particles · Insect communication" },
      { k: "Affiliation", v: "Avengers · Ant-Man Family" },
    ],
    buzzNote:
      "Ant-Man's role in the Quantum Realm and Kang storyline keeps his cards relevant. His Platinum is a fun pull with strong secondary market demand.",
  },
  {
    cardNumber: "#115",
    characterName: "Hawkeye",
    characterRealName: "Clint Barton",
    characterTagline: "Hawkeye · Avengers Compound",
    characterBio:
      "The world's greatest marksman and the only Avenger without superhuman powers, Clint Barton proves that heart and skill can stand alongside gods and super-soldiers. His Disney+ series introduced Kate Bishop and cemented his legacy.",
    characterFacts: [
      { k: "First app.", v: "Tales of Suspense #57 (1964)" },
      { k: "Powers", v: "Master archer · Trick arrows · Peak human athlete" },
      { k: "Affiliation", v: "Avengers · S.H.I.E.L.D." },
    ],
    buzzNote:
      "Hawkeye cards are undervalued by many collectors — making his Platinum a smart sleeper pick in the Mint set.",
  },
  {
    cardNumber: "#116",
    characterName: "Vision",
    characterRealName: "Vision",
    characterTagline: "Vision · Westview / Avengers",
    characterBio:
      "Created by Ultron but choosing heroism, Vision is a synthezoid with the Mind Stone at his core. His love story with Wanda and his philosophical questions about consciousness make him one of Marvel's most unique characters.",
    characterFacts: [
      { k: "First app.", v: "Avengers #57 (1968)" },
      { k: "Powers", v: "Density manipulation · Solar energy blasts · Flight" },
      { k: "Affiliation", v: "Avengers · WandaVision" },
    ],
    buzzNote:
      "Vision's return in the MCU has reignited collector interest. His Platinum parallel is one of the more visually striking cards in the set.",
  },
  {
    cardNumber: "#117",
    characterName: "Gamora",
    characterRealName: "Gamora Zen Whoberi Ben Titan",
    characterTagline: "Gamora · Guardians of the Galaxy",
    characterBio:
      "Adopted daughter of Thanos and the deadliest woman in the galaxy, Gamora turned against her father to fight for good. Her arc across the Guardians trilogy is one of Marvel's most emotionally complex stories.",
    characterFacts: [
      { k: "First app.", v: "Strange Tales #180 (1975)" },
      { k: "Powers", v: "Enhanced strength · Master swordswoman · Accelerated healing" },
      { k: "Affiliation", v: "Guardians of the Galaxy" },
    ],
    buzzNote:
      "Gamora's Platinum card is a strong pull for Guardians fans. Her complex MCU arc makes her one of the most narratively rich characters in the set.",
  },
  {
    cardNumber: "#118",
    characterName: "Star-Lord",
    characterRealName: "Peter Quill",
    characterTagline: "Star-Lord · Guardians of the Galaxy",
    characterBio:
      "Half-human, half-Celestial, Peter Quill grew up as a space pirate before becoming the heart of the Guardians of the Galaxy. His mixtapes, his heart, and his humor make him one of the MCU's most beloved characters.",
    characterFacts: [
      { k: "First app.", v: "Marvel Preview #4 (1976)" },
      { k: "Powers", v: "Celestial heritage · Element guns · Jet boots" },
      { k: "Affiliation", v: "Guardians of the Galaxy" },
    ],
    buzzNote:
      "With Guardians Vol. 3 wrapping the team's MCU arc, Star-Lord's Platinum is a nostalgic pull that resonates with fans of the trilogy.",
  },
  {
    cardNumber: "#119",
    characterName: "Thanos",
    characterRealName: "Thanos",
    characterTagline: "Thanos · Titan",
    characterBio:
      "The Mad Titan who wielded the Infinity Gauntlet and erased half of all life in the universe. Thanos is the most consequential villain in Marvel history — his actions defined an entire era of storytelling.",
    characterFacts: [
      { k: "First app.", v: "Invincible Iron Man #55 (1973)" },
      { k: "Powers", v: "Infinity Gauntlet · Godlike strength · Genius tactician" },
      { k: "Affiliation", v: "Black Order · Infinity Watch" },
    ],
    buzzNote:
      "Thanos cards are perennial top performers. His Platinum parallel is one of the most sought-after villain cards in the entire Mint set.",
  },
  {
    cardNumber: "#120",
    characterName: "Deadpool",
    characterRealName: "Wade Wilson",
    characterTagline: "Deadpool · Weapon X",
    characterBio:
      "The Merc with a Mouth and Marvel's most self-aware anti-hero, Wade Wilson's healing factor, dual katanas, and fourth-wall-breaking humor make him one of the most unique characters in comics. His MCU debut alongside Wolverine was a cultural moment.",
    characterFacts: [
      { k: "First app.", v: "New Mutants #98 (1991)" },
      { k: "Powers", v: "Healing factor · Master combatant · Fourth-wall awareness" },
      { k: "Affiliation", v: "X-Force · Avengers (briefly)" },
    ],
    buzzNote:
      "Deadpool & Wolverine made Deadpool an MCU mainstay. His Platinum #120 is the final card in the set and one of the most popular pulls.",
  },
];

// ── Set Labels ──────────────────────────────────────────────────────────────
export const SET_LABELS: Record<SetKey, string> = {
  mint: "2025 Topps Marvel Mint",
  comic_book_heroes: "2025 Topps Marvel Comic Book Heroes",
  marvel_studios: "2025 Topps Marvel Studios",
};

const SET_ORDER: SetKey[] = ["mint", "comic_book_heroes", "marvel_studios"];

// ── Rotation Engine ─────────────────────────────────────────────────────────
// Epoch: June 28, 2026 (Day 0 = Spider-Man / Mint)
const EPOCH_DATE = "2026-06-28";

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + "T00:00:00Z");
  const b = new Date(dateB + "T00:00:00Z");
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/**
 * Calculate which character and set to show on a given date.
 * The set cycles through [mint, comic_book_heroes, marvel_studios] but
 * NEVER repeats the same set on consecutive days.
 */
export function getRotationForDate(dateISO: string): DayRotation {
  const dayIndex = daysBetween(EPOCH_DATE, dateISO);
  const characterIndex = ((dayIndex % PLATINUM_CHARACTERS.length) + PLATINUM_CHARACTERS.length) % PLATINUM_CHARACTERS.length;
  const character = PLATINUM_CHARACTERS[characterIndex];

  // Set rotation: cycle through sets but never same set two days in a row
  // Simple rule: setIndex = dayIndex % 3, but if it equals previous day's set, advance by 1
  const rawSetIndex = ((dayIndex % 3) + 3) % 3;
  const prevRawSetIndex = (((dayIndex - 1) % 3) + 3) % 3;
  let setIndex = rawSetIndex;
  if (setIndex === prevRawSetIndex) {
    setIndex = (setIndex + 1) % 3;
  }

  const setKey = SET_ORDER[setIndex];
  const setLabel = SET_LABELS[setKey];

  // Format date label
  const dateObj = new Date(dateISO + "T00:00:00Z");
  const dateLabel = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return {
    characterIndex,
    character,
    setKey,
    setLabel,
    cardNumber: character.cardNumber,
    dateISO,
    dateLabel,
  };
}

/**
 * Get today's rotation (Central Time date).
 */
export function getTodayRotation(): DayRotation {
  const now = new Date();
  // Use Central Time (UTC-5/UTC-6)
  const ctOffset = -6 * 60; // CDT = UTC-5, CST = UTC-6; use -6 as conservative
  const ctMs = now.getTime() + (now.getTimezoneOffset() + ctOffset) * 60_000;
  const ctDate = new Date(ctMs);
  const dateISO = ctDate.toISOString().slice(0, 10);
  return getRotationForDate(dateISO);
}
