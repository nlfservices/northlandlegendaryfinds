/**
 * Seed script: Creates a Whatnot-exclusive Marvel product with 500 checklist items
 * Tiers: Top Hits (50 chase cards), Middle of Pack (150 hit cards), Low Floor (300 base cards)
 */
import { drizzle } from "drizzle-orm/mysql2";
import { repackProducts, checklistItems } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// ===== MARVEL CHARACTER/CARD DATA =====

const CHASE_CHARACTERS = [
  // Top-tier Marvel characters with premium parallels
  { name: "Spider-Man", set: "2024 Topps Chrome Marvel", parallel: "Superfractor 1/1", value: "$500+" },
  { name: "Wolverine", set: "2024 Topps Chrome Marvel", parallel: "Superfractor 1/1", value: "$400+" },
  { name: "Iron Man", set: "2024 Topps Chrome Marvel", parallel: "Superfractor 1/1", value: "$350+" },
  { name: "Deadpool", set: "2024 Topps Chrome Marvel", parallel: "Superfractor 1/1", value: "$300+" },
  { name: "Venom", set: "2024 Topps Chrome Marvel", parallel: "Superfractor 1/1", value: "$300+" },
  { name: "Captain America", set: "2024 Topps Chrome Marvel", parallel: "Gold Auto /5", value: "$250-$400" },
  { name: "Thor", set: "2024 Topps Chrome Marvel", parallel: "Gold Auto /5", value: "$200-$350" },
  { name: "Black Panther", set: "2024 Topps Chrome Marvel", parallel: "Gold Auto /5", value: "$200-$300" },
  { name: "Doctor Strange", set: "2024 Topps Chrome Marvel", parallel: "Gold Auto /5", value: "$150-$300" },
  { name: "Hulk", set: "2024 Topps Chrome Marvel", parallel: "Gold Auto /5", value: "$150-$250" },
  { name: "Spider-Man", set: "2024 Marvel Mint", parallel: "Minted Metal Auto /10", value: "$200-$400" },
  { name: "Wolverine", set: "2024 Marvel Mint", parallel: "Minted Metal Auto /10", value: "$200-$350" },
  { name: "Magneto", set: "2024 Marvel Mint", parallel: "Minted Metal Auto /10", value: "$150-$300" },
  { name: "Storm", set: "2024 Marvel Mint", parallel: "Minted Metal Auto /10", value: "$150-$250" },
  { name: "Gambit", set: "2024 Marvel Mint", parallel: "Minted Metal Auto /10", value: "$150-$250" },
  { name: "Spider-Gwen", set: "2024 Topps Chrome Marvel", parallel: "Red Refractor Auto /25", value: "$100-$250" },
  { name: "Miles Morales", set: "2024 Topps Chrome Marvel", parallel: "Red Refractor Auto /25", value: "$100-$250" },
  { name: "Scarlet Witch", set: "2024 Topps Chrome Marvel", parallel: "Red Refractor Auto /25", value: "$100-$200" },
  { name: "Loki", set: "2024 Topps Chrome Marvel", parallel: "Red Refractor Auto /25", value: "$100-$200" },
  { name: "Thanos", set: "2024 Topps Chrome Marvel", parallel: "Red Refractor Auto /25", value: "$100-$200" },
  { name: "Jean Grey", set: "2024 Marvel Mint", parallel: "Gold Minted /15", value: "$100-$200" },
  { name: "Cyclops", set: "2024 Marvel Mint", parallel: "Gold Minted /15", value: "$100-$200" },
  { name: "Nightcrawler", set: "2024 Marvel Mint", parallel: "Gold Minted /15", value: "$100-$175" },
  { name: "Rogue", set: "2024 Marvel Mint", parallel: "Gold Minted /15", value: "$100-$175" },
  { name: "Psylocke", set: "2024 Marvel Mint", parallel: "Gold Minted /15", value: "$100-$175" },
  { name: "Spider-Man", set: "2023 Topps Chrome Marvel", parallel: "Superfractor 1/1", value: "$400+" },
  { name: "Wolverine", set: "2023 Topps Chrome Marvel", parallel: "Superfractor 1/1", value: "$350+" },
  { name: "Carnage", set: "2024 Topps Chrome Marvel", parallel: "Gold Refractor Auto /10", value: "$150-$250" },
  { name: "Ghost Rider", set: "2024 Topps Chrome Marvel", parallel: "Gold Refractor Auto /10", value: "$125-$200" },
  { name: "Punisher", set: "2024 Topps Chrome Marvel", parallel: "Gold Refractor Auto /10", value: "$125-$200" },
  { name: "Silver Surfer", set: "2024 Marvel Mint", parallel: "Minted Metal 1/1", value: "$300+" },
  { name: "Galactus", set: "2024 Marvel Mint", parallel: "Minted Metal 1/1", value: "$250+" },
  { name: "Doctor Doom", set: "2024 Topps Chrome Marvel", parallel: "Superfractor 1/1", value: "$250+" },
  { name: "Kingpin", set: "2024 Topps Chrome Marvel", parallel: "Gold Auto /5", value: "$150-$250" },
  { name: "Green Goblin", set: "2024 Topps Chrome Marvel", parallel: "Gold Auto /5", value: "$150-$250" },
  { name: "Mysterio", set: "2024 Topps Chrome Marvel", parallel: "Red Refractor Auto /25", value: "$100-$175" },
  { name: "Elektra", set: "2024 Marvel Mint", parallel: "Minted Metal Auto /10", value: "$100-$175" },
  { name: "Moon Knight", set: "2024 Topps Chrome Marvel", parallel: "Gold Refractor Auto /10", value: "$125-$225" },
  { name: "Blade", set: "2024 Topps Chrome Marvel", parallel: "Gold Refractor Auto /10", value: "$100-$200" },
  { name: "Daredevil", set: "2024 Topps Chrome Marvel", parallel: "Red Refractor Auto /25", value: "$100-$200" },
  { name: "Kate Bishop", set: "2024 Topps Chrome Marvel", parallel: "Gold Auto /5", value: "$125-$225" },
  { name: "America Chavez", set: "2024 Marvel Mint", parallel: "Gold Minted Auto /15", value: "$100-$175" },
  { name: "Shang-Chi", set: "2024 Topps Chrome Marvel", parallel: "Red Refractor Auto /25", value: "$100-$175" },
  { name: "Namor", set: "2024 Marvel Mint", parallel: "Minted Metal Auto /10", value: "$100-$200" },
  { name: "Black Widow", set: "2024 Topps Chrome Marvel", parallel: "Gold Refractor Auto /10", value: "$125-$200" },
  { name: "Hawkeye", set: "2024 Topps Chrome Marvel", parallel: "Gold Auto /5", value: "$100-$175" },
  { name: "Ant-Man", set: "2024 Marvel Mint", parallel: "Gold Minted Auto /15", value: "$100-$150" },
  { name: "Wasp", set: "2024 Marvel Mint", parallel: "Gold Minted Auto /15", value: "$100-$150" },
  { name: "Vision", set: "2024 Topps Chrome Marvel", parallel: "Red Refractor Auto /25", value: "$100-$175" },
  { name: "War Machine", set: "2024 Topps Chrome Marvel", parallel: "Gold Refractor Auto /10", value: "$100-$175" },
];

const HIT_CHARACTERS = [
  // Mid-tier cards — numbered parallels, refractors, inserts
  { name: "Spider-Man", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Spider-Man", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Spider-Man", set: "2024 Topps Chrome Marvel", parallel: "Orange Refractor /75" },
  { name: "Wolverine", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Wolverine", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Wolverine", set: "2024 Topps Chrome Marvel", parallel: "Orange Refractor /75" },
  { name: "Iron Man", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Iron Man", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Deadpool", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Deadpool", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Venom", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Venom", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Captain America", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Captain America", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Thor", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Thor", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Black Panther", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Black Panther", set: "2024 Topps Chrome Marvel", parallel: "Orange Refractor /75" },
  { name: "Doctor Strange", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Doctor Strange", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Hulk", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Hulk", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Scarlet Witch", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Scarlet Witch", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Loki", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Loki", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Thanos", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Thanos", set: "2024 Topps Chrome Marvel", parallel: "Orange Refractor /75" },
  { name: "Miles Morales", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Miles Morales", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Spider-Gwen", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Spider-Gwen", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Jean Grey", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Jean Grey", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Cyclops", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Cyclops", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Storm", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Storm", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Gambit", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Gambit", set: "2024 Topps Chrome Marvel", parallel: "Orange Refractor /75" },
  { name: "Rogue", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Rogue", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Nightcrawler", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Nightcrawler", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Psylocke", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Magneto", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Magneto", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Carnage", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Carnage", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Ghost Rider", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Ghost Rider", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Punisher", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Moon Knight", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Moon Knight", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Blade", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Daredevil", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Daredevil", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Elektra", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Kate Bishop", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Kate Bishop", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Shang-Chi", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Namor", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Black Widow", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Black Widow", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Hawkeye", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Vision", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "War Machine", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Ant-Man", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Wasp", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Doctor Doom", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Doctor Doom", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Kingpin", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Green Goblin", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Green Goblin", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Mysterio", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Silver Surfer", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Silver Surfer", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Galactus", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Spider-Man", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Wolverine", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Iron Man", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Deadpool", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Venom", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Captain America", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Thor", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Black Panther", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Doctor Strange", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Hulk", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Scarlet Witch", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Loki", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Thanos", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Miles Morales", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Spider-Gwen", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Jean Grey", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Cyclops", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Storm", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Gambit", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Rogue", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Magneto", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Carnage", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Ghost Rider", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Moon Knight", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Blade", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Daredevil", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Doctor Doom", set: "2024 Marvel Mint", parallel: "Silver Minted /50" },
  { name: "Spider-Man", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Spider-Man", set: "2023 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Wolverine", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Wolverine", set: "2023 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Iron Man", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Deadpool", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Venom", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Captain America", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Thor", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Black Panther", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Hulk", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Scarlet Witch", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Loki", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Thanos", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Miles Morales", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Spider-Gwen", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Jean Grey", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Magneto", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Nightcrawler", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Psylocke", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Punisher", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Silver Surfer", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Galactus", set: "2023 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "America Chavez", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Shang-Chi", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Namor", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Falcon", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Winter Soldier", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "She-Hulk", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Ms. Marvel", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Groot", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Rocket Raccoon", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Star-Lord", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Gamora", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Drax", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Nebula", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Mantis", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Adam Warlock", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Kang the Conqueror", set: "2024 Topps Chrome Marvel", parallel: "Green Refractor /99" },
  { name: "Ultron", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Taskmaster", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
  { name: "Bullseye", set: "2024 Topps Chrome Marvel", parallel: "Blue Refractor /150" },
];

// Base tier characters — refractors, base parallels, inserts
const BASE_CHARACTERS = [
  "Spider-Man", "Wolverine", "Iron Man", "Deadpool", "Venom",
  "Captain America", "Thor", "Black Panther", "Doctor Strange", "Hulk",
  "Scarlet Witch", "Loki", "Thanos", "Miles Morales", "Spider-Gwen",
  "Jean Grey", "Cyclops", "Storm", "Gambit", "Rogue",
  "Nightcrawler", "Psylocke", "Magneto", "Carnage", "Ghost Rider",
  "Punisher", "Moon Knight", "Blade", "Daredevil", "Elektra",
  "Kate Bishop", "America Chavez", "Shang-Chi", "Namor", "Black Widow",
  "Hawkeye", "Ant-Man", "Wasp", "Vision", "War Machine",
  "Doctor Doom", "Kingpin", "Green Goblin", "Mysterio", "Silver Surfer",
  "Galactus", "Falcon", "Winter Soldier", "She-Hulk", "Ms. Marvel",
  "Groot", "Rocket Raccoon", "Star-Lord", "Gamora", "Drax",
  "Nebula", "Mantis", "Adam Warlock", "Kang the Conqueror", "Ultron",
  "Taskmaster", "Bullseye", "Morbius", "Kraven the Hunter", "Rhino",
  "Sandman", "Vulture", "Shocker", "Scorpion", "Hobgoblin",
  "Lizard", "Doc Ock", "Abomination", "Red Skull", "Baron Zemo",
  "Crossbones", "Hela", "Surtur", "Dormammu", "Mephisto",
  "Absorbing Man", "Balder", "Beta Ray Bill", "Bishop", "Cable",
  "Cannonball", "Colossus", "Dazzler", "Domino", "Emma Frost",
  "Fantomex", "Forge", "Havok", "Iceman", "Jubilee",
  "Kitty Pryde", "Legion", "Longshot", "Magik", "Mimic",
  "Multiple Man", "Mystique", "Polaris", "Professor X", "Sabretooth",
  "Sentry", "Sunspot", "Thunderbird", "Warpath", "X-23",
];

const BASE_SETS = [
  "2024 Topps Chrome Marvel",
  "2024 Marvel Mint",
  "2023 Topps Chrome Marvel",
  "2024 Topps Marvel Cosmic",
];

const BASE_PARALLELS = [
  "Base", "Base", "Base", // weighted toward base
  "Refractor", "Refractor",
  "Pink Refractor /199",
  "Purple Refractor /250",
  "Wave Refractor",
  "Prism Refractor",
  "X-Fractor",
  "Speckle Refractor",
  "Camo Refractor",
];

const BASE_VALUES = [
  "$1-$5", "$1-$5", "$1-$5", "$2-$8", "$3-$10",
  "$5-$15", "$5-$15", "$5-$20", "$8-$25", "$10-$30",
  "$3-$10", "$5-$15",
];

async function seed() {
  console.log("🚀 Starting Whatnot Marvel 500-Pack checklist seed...");

  // 1. Create the Whatnot-exclusive product
  console.log("📦 Creating Whatnot-exclusive product...");
  
  // Check if product already exists
  const existing = await db.select().from(repackProducts).where(eq(repackProducts.slug, "nlf-marvel-500-whatnot"));
  
  let productId;
  if (existing.length > 0) {
    productId = existing[0].id;
    console.log(`  Product already exists with ID ${productId}, clearing old checklist items...`);
    await db.delete(checklistItems).where(eq(checklistItems.productId, productId));
  } else {
    const result = await db.insert(repackProducts).values({
      name: "NLF Marvel 500-Pack Series",
      slug: "nlf-marvel-500-whatnot",
      description: "The ultimate Whatnot-exclusive Marvel trading card repack series. 500 total packs, 50 per live show. Every pack hand-curated with premium cards from Topps Chrome Marvel, Marvel Mint, and more. Featuring chase Superfractors, Gold Autos, and numbered parallels.",
      price: 10000, // $100
      totalPacks: 500,
      packsRemaining: 500,
      category: "marvel",
      status: "active",
      isWhatnotExclusive: true,
      whatnotSeriesName: "500 Pack Series",
      packsPerShow: 50,
      sortOrder: 1,
    });
    productId = result[0].insertId;
    console.log(`  Created product with ID ${productId}`);
  }

  // 2. Build all 500 checklist items
  console.log("📋 Building 500 checklist items...");
  
  const allItems = [];
  let sortOrder = 1;

  // CHASE TIER: 50 cards (Top Hits)
  console.log("  🏆 Adding 50 Top Hits (chase tier)...");
  for (const card of CHASE_CHARACTERS) {
    const year = card.set.substring(0, 4);
    allItems.push({
      productId,
      cardName: card.name,
      cardSet: card.set,
      cardYear: year,
      cardNumber: `CH-${sortOrder.toString().padStart(3, "0")}`,
      parallel: card.parallel,
      tier: "chase",
      estimatedValue: card.value,
      isPulled: false,
      sortOrder: sortOrder,
    });
    sortOrder++;
  }

  // HIT TIER: 150 cards (Middle of the Pack)
  console.log("  ⚡ Adding 150 Middle of Pack (hit tier)...");
  for (const card of HIT_CHARACTERS) {
    const year = card.set.substring(0, 4);
    const value = card.parallel.includes("/50") ? "$25-$75" :
                  card.parallel.includes("/75") ? "$20-$60" :
                  card.parallel.includes("/99") ? "$15-$50" :
                  "$10-$35";
    allItems.push({
      productId,
      cardName: card.name,
      cardSet: card.set,
      cardYear: year,
      cardNumber: `HT-${sortOrder.toString().padStart(3, "0")}`,
      parallel: card.parallel,
      tier: "hit",
      estimatedValue: value,
      isPulled: false,
      sortOrder: sortOrder,
    });
    sortOrder++;
  }

  // BASE TIER: 300 cards (Low Floor)
  console.log("  📦 Adding 300 Low Floor (base tier)...");
  let baseIndex = 0;
  while (allItems.length < 500) {
    const charName = BASE_CHARACTERS[baseIndex % BASE_CHARACTERS.length];
    const set = BASE_SETS[Math.floor(baseIndex / BASE_CHARACTERS.length) % BASE_SETS.length];
    const parallel = BASE_PARALLELS[baseIndex % BASE_PARALLELS.length];
    const value = BASE_VALUES[baseIndex % BASE_VALUES.length];
    const year = set.substring(0, 4);

    allItems.push({
      productId,
      cardName: charName,
      cardSet: set,
      cardYear: year,
      cardNumber: `BF-${sortOrder.toString().padStart(3, "0")}`,
      parallel: parallel,
      tier: "base",
      estimatedValue: value,
      isPulled: false,
      sortOrder: sortOrder,
    });
    sortOrder++;
    baseIndex++;
  }

  // 3. Insert in batches of 50
  console.log(`📥 Inserting ${allItems.length} checklist items in batches...`);
  const BATCH_SIZE = 50;
  for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
    const batch = allItems.slice(i, i + BATCH_SIZE);
    await db.insert(checklistItems).values(batch);
    console.log(`  Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allItems.length / BATCH_SIZE)}`);
  }

  console.log(`\n✅ Done! Created ${allItems.length} checklist items:`);
  console.log(`   🏆 Top Hits (Chase): ${allItems.filter(i => i.tier === "chase").length}`);
  console.log(`   ⚡ Middle of Pack (Hit): ${allItems.filter(i => i.tier === "hit").length}`);
  console.log(`   📦 Low Floor (Base): ${allItems.filter(i => i.tier === "base").length}`);

  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
