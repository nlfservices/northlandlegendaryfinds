/**
 * One-shot seed: insert 2026 Topps Marvel Vault checklist + official hobby odds.
 * Hard-lock: setId=90007 (or next unused 90008+) and slug 2026-topps-marvel-vault.
 * Inserts the set if missing, then upserts cards for THIS setId only.
 * Never writes imageUrl/backImageUrl on insert (stay null). Never overwrites a
 * non-null imageUrl. Never writes set 1, 2, 3, 4, 5, 6, 30001, 60001, 90001-90006.
 * Odds are pull odds, never prices. Parser keeps thousands commas (1:2,649).
 * Sketch artist lists with no card numbers stay in the set description only.
 * Versioned in-memory once-flag so a bump re-runs. Must start AFTER listen.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const PREFERRED_SET_ID = 90007;
const SET_SLUG = "2026-topps-marvel-vault";
const SET_NAME = "2026 Topps Marvel Vault";
const SET_SHORT_NAME = "Vault";
const SET_YEAR = 2026;

const FORBIDDEN_SET_IDS = [
  1, 2, 3, 4, 5, 6, 30001, 60001, 90001, 90002, 90003, 90004, 90005, 90006,
] as const;

/** Bump when the official Vault checklist/odds change so the seed re-runs. */
const SEED_VERSION = "vault-2026-official-hobby-odds-v1";

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

const VO_TYPE = "VAULT ORIGINALS";
const VO_PARALLELS = oddsLine([
  ["Black", "1:42"],
  ["Red", "1:84"],
  ["Gold", "1:419"],
]);

const VR_TYPE = "VAULT RELICS";
const VR_PARALLELS = oddsLine([
  ["Base", "1:19"],
  ["Black", "1:50"],
  ["Red", "1:99"],
  ["Gold", "1:497"],
]);

const MD_TYPE = "MARVEL DIAMONDS";
const MD_PARALLELS = oddsLine([
  ["Base", "1:2"],
  ["Black", "1:10"],
  ["Red", "1:19"],
  ["Gold", "1:92"],
]);

const TG_TYPE = "TRUE GREATNESS";
const TG_PARALLELS = oddsLine([
  ["Black", "1:26"],
  ["Red", "1:53"],
  ["Gold", "1:257"],
]);

const VA_TYPE = "VAULT ARMORY";
const VA_PARALLELS = oddsLine([
  ["Black", "1:419"],
  ["Red", "1:332"],
  ["Gold", "1:1,325"],
]);

const FTS_TYPE = "FROM THE SET";
const FTS_PARALLELS = oddsLine([
  ["Black", "1:84"],
  ["Red", "1:166"],
  ["Gold", "1:795"],
]);

const INK_TYPE = "INK-616 AUTOGRAPHS";
const INK_PARALLELS = oddsLine([
  ["Base", "1:7"],
  ["Black", "1:30"],
  ["Red", "1:60"],
  ["Gold", "1:306"],
]);

const LIG_TYPE = "LACED IN GOLD";
const LIG_PARALLELS = oddsLine([
  ["Base", "1:29"],
  ["Black", "1:71"],
  ["Red", "1:145"],
  ["Gold", "1:663"],
]);

const DUOS_TYPE = "MARVEL DUOS AUTOGRAPHS";
const DUOS_PARALLELS = oddsLine([
  ["Base", "1:22"],
  ["Black", "1:55"],
  ["Red", "1:109"],
  ["Gold", "1:530"],
]);

const TRIPLES_TYPE = "MARVEL TRIPLES AUTOGRAPHS";
const TRIPLES_PARALLELS = oddsLine([
  ["Base", "1:47"],
  ["Black", "1:116"],
  ["Red", "1:234"],
  ["Gold", "1:1,135"],
]);

const AL_TYPE = "ASGARD LITERATURE";
const AL_PARALLELS = oddsLine([
  ["Base", "1:163"],
  ["Black", "1:398"],
  ["Red", "1:795"],
  ["Gold", "1:3,973"],
]);

const IA_TYPE = "IMMORTAL AUTOGRAPHS";
const IA_PARALLELS = oddsLine([
  ["Base", "1:7"],
  ["Rose Gold", "1:15"],
  ["Black", "1:30"],
  ["Red", "1:60"],
  ["Superfractor", "1:306"],
]);

const AR_TYPE = "MARVEL AUTOGRAPH RELICS";
const AR_PARALLELS = oddsLine([
  ["Base", "1:19"],
  ["Black", "1:91"],
  ["Red", "1:163"],
  ["Gold", "1:795"],
]);

const DR_TYPE = "MARVEL DUAL AUTOGRAPH RELICS";
const DR_PARALLELS = oddsLine([
  ["Base", "1:163"],
  ["Black", "1:398"],
  ["Red", "1:530"],
  ["Gold", "1:2,649"],
]);

const TR_TYPE = "MARVEL TRIPLE AUTOGRAPH RELICS";
const TR_PARALLELS = oddsLine([
  ["Red", "1:1,589"],
  ["Gold", "1:7,945"],
]);

const V_TYPE = "THE VAULT AUTOGRAPH RELIC BOOK";
const V_PARALLELS = oddsLine([
  ["Base", "1:2,649"],
]);

const DA_TYPE = "MARVEL DIAMONDS AUTOGRAPH EDITION";
const DA_PARALLELS = oddsLine([
  ["Base", "1:13"],
  ["Black", "1:32"],
  ["Red", "1:63"],
  ["Gold", "1:318"],
]);

const TGA_TYPE = "TRUE GREATNESS AUTOGRAPH EDITION";
const TGA_PARALLELS = oddsLine([
  ["Base", "1:56"],
  ["Black", "1:140"],
  ["Red", "1:284"],
  ["Gold", "1:1,325"],
]);

const VAA_TYPE = "VAULT ARMORY AUTOGRAPHS";
const VAA_PARALLELS = oddsLine([
  ["Black", "1:274"],
  ["Red", "1:398"],
  ["Gold", "1:1,987"],
]);

const FTSA_TYPE = "FROM THE SET AUTOGRAPHS";
const FTSA_PARALLELS = oddsLine([
  ["Base", "1:17"],
  ["Black", "1:55"],
  ["Red", "1:109"],
  ["Gold", "1:530"],
]);

const SET_DESCRIPTION =
  "2026 Topps Marvel Vault hobby (two packs + box topper). Pack 1: Marvel Diamonds 1:2, Vault Relics 1:19, True Greatness Black 1:26, Premiere Sketches 1:12, Golden Sketches 1:35. Pack 2: Ink-616 autos 1:7, Immortal autos 1:7, Diamonds autos 1:13. Box topper: Vault Originals Black 1:42, Over-Sized Premiere Sketches 1:46. Odds only, never prices.";

type SeedCard = {
  cardNumber: string;
  characterName: string;
  cardType: string;
  parallels: string;
  description: string | null;
};

function card(
  cardNumber: string,
  characterName: string,
  cardType: string,
  parallels: string,
  description: string | null = null
): SeedCard {
  return { cardNumber, characterName, cardType, parallels, description };
}

const CARDS: SeedCard[] = [
  // VAULT ORIGINALS (20)
  card("VO-01", "Black Cat", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-02", "Black Panther", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-03", "Black Widow", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-04", "Captain America", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-05", "Carnage", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-06", "Phoenix", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-07", "Ghost-Spider", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-08", "Hulk", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-09", "Iron Man", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-10", "Jeff the Land Shark", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-11", "Magik", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-12", "Mary Jane", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-13", "Moon Knight", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-14", "Rogue", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-15", "Scarlet Witch", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-16", "She-Hulk", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-17", "Spider-Man", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-18", "Thor", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-19", "Venom", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),
  card("VO-20", "Wolverine", VO_TYPE, VO_PARALLELS, "Artwork by Ariel Diaz"),

  // VAULT RELICS (17)
  card("VR-01", "Captain America", VR_TYPE, VR_PARALLELS, "Aircraft Cockpit"),
  card("VR-02", "Falcon", VR_TYPE, VR_PARALLELS, "Aircraft Cockpit"),
  card("VR-03", "President Thaddeus Ross", VR_TYPE, VR_PARALLELS, "Presidential Podium"),
  card("VR-04", "Ironheart", VR_TYPE, VR_PARALLELS, "Plymouth Barracuda"),
  card("VR-05", "Shuri", VR_TYPE, VR_PARALLELS, "Plymouth Barracuda"),
  card("VR-06", "Mantis", VR_TYPE, VR_PARALLELS, "Candy Cane"),
  card("VR-07", "Drax", VR_TYPE, VR_PARALLELS, "Elf Candy Cane"),
  card("VR-08", "Star-Lord", VR_TYPE, VR_PARALLELS, "Candy Cane"),
  card("VR-09", "Ant-Man", VR_TYPE, VR_PARALLELS, "Stark Tower Penthouse Sofa"),
  card("VR-10", "Iron Man", VR_TYPE, VR_PARALLELS, "Stark Tower Penthouse Sofa"),
  card("VR-11", "Thor", VR_TYPE, VR_PARALLELS, "Stark Tower Penthouse Sofa"),
  card("VR-12", "Black Widow", VR_TYPE, VR_PARALLELS, "Stark Tower Penthouse Sofa"),
  card("VR-13", "Hulk", VR_TYPE, VR_PARALLELS, "Stark Tower Penthouse Sofa"),
  card("VR-14", "Hawkeye", VR_TYPE, VR_PARALLELS, "Stark Tower Penthouse Sofa"),
  card("VR-15", "Loki", VR_TYPE, VR_PARALLELS, "Stark Tower Penthouse Sofa"),
  card("VR-16", "Captain America", VR_TYPE, VR_PARALLELS, "Stark Tower Penthouse Sofa"),
  card("VR-17", "Pepper Potts", VR_TYPE, VR_PARALLELS, "Stark Tower Penthouse Sofa"),

  // MARVEL DIAMONDS (90)
  card("MD-01", "Yelena Belova", MD_TYPE, MD_PARALLELS),
  card("MD-02", "Pietro Maximoff", MD_TYPE, MD_PARALLELS),
  card("MD-03", "Queen Ramonda", MD_TYPE, MD_PARALLELS),
  card("MD-04", "Odin", MD_TYPE, MD_PARALLELS),
  card("MD-05", "The Mandarin", MD_TYPE, MD_PARALLELS),
  card("MD-06", "Doctor Strange", MD_TYPE, MD_PARALLELS),
  card("MD-07", "Wong", MD_TYPE, MD_PARALLELS),
  card("MD-08", "Rocket", MD_TYPE, MD_PARALLELS),
  card("MD-09", "Captain Marvel", MD_TYPE, MD_PARALLELS),
  card("MD-10", "Hela", MD_TYPE, MD_PARALLELS),
  card("MD-11", "Mordo", MD_TYPE, MD_PARALLELS),
  card("MD-12", "Captain America", MD_TYPE, MD_PARALLELS),
  card("MD-13", "Thor", MD_TYPE, MD_PARALLELS),
  card("MD-14", "Star-Lord", MD_TYPE, MD_PARALLELS),
  card("MD-15", "The High Evolutionary", MD_TYPE, MD_PARALLELS),
  card("MD-16", "Phil Coulson", MD_TYPE, MD_PARALLELS),
  card("MD-17", "Maria Hill", MD_TYPE, MD_PARALLELS),
  card("MD-18", "Drax", MD_TYPE, MD_PARALLELS),
  card("MD-19", "Red Guardian", MD_TYPE, MD_PARALLELS),
  card("MD-20", "Korath", MD_TYPE, MD_PARALLELS),
  card("MD-21", "War Machine", MD_TYPE, MD_PARALLELS),
  card("MD-22", "Ayesha", MD_TYPE, MD_PARALLELS),
  card("MD-23", "Wanda Maximoff", MD_TYPE, MD_PARALLELS),
  card("MD-24", "G'iah", MD_TYPE, MD_PARALLELS),
  card("MD-25", "Ghost", MD_TYPE, MD_PARALLELS),
  card("MD-26", "Zuri", MD_TYPE, MD_PARALLELS),
  card("MD-27", "Nova Prime", MD_TYPE, MD_PARALLELS),
  card("MD-28", "Pepper Potts", MD_TYPE, MD_PARALLELS),
  card("MD-29", "Kate Bishop", MD_TYPE, MD_PARALLELS),
  card("MD-30", "Peggy Carter", MD_TYPE, MD_PARALLELS),
  card("MD-31", "Heimdall", MD_TYPE, MD_PARALLELS),
  card("MD-32", "Ultron", MD_TYPE, MD_PARALLELS),
  card("MD-33", "Erik Killmonger", MD_TYPE, MD_PARALLELS),
  card("MD-34", "The Grandmaster", MD_TYPE, MD_PARALLELS),
  card("MD-35", "Hawkeye", MD_TYPE, MD_PARALLELS),
  card("MD-36", "Happy Hogan", MD_TYPE, MD_PARALLELS),
  card("MD-37", "Thanos", MD_TYPE, MD_PARALLELS),
  card("MD-38", "Yon-Rogg", MD_TYPE, MD_PARALLELS),
  card("MD-39", "Nebula", MD_TYPE, MD_PARALLELS),
  card("MD-40", "Ego", MD_TYPE, MD_PARALLELS),
  card("MD-41", "Ronan", MD_TYPE, MD_PARALLELS),
  card("MD-42", "Christine Everhart", MD_TYPE, MD_PARALLELS),
  card("MD-43", "Shuri", MD_TYPE, MD_PARALLELS),
  card("MD-44", "Laura Barton", MD_TYPE, MD_PARALLELS),
  card("MD-45", "Cosmo", MD_TYPE, MD_PARALLELS),
  card("MD-46", "Hulk", MD_TYPE, MD_PARALLELS),
  card("MD-47", "Frigga", MD_TYPE, MD_PARALLELS),
  card("MD-48", "X-23", MD_TYPE, MD_PARALLELS),
  card("MD-49", "Yondu", MD_TYPE, MD_PARALLELS),
  card("MD-50", "Janet Van Dyne", MD_TYPE, MD_PARALLELS),
  card("MD-51", "Whiplash", MD_TYPE, MD_PARALLELS),
  card("MD-52", "The Mighty Thor", MD_TYPE, MD_PARALLELS),
  card("MD-53", "Mr. Knight", MD_TYPE, MD_PARALLELS),
  card("MD-54", "Mobius", MD_TYPE, MD_PARALLELS),
  card("MD-55", "Vision", MD_TYPE, MD_PARALLELS),
  card("MD-56", "Ant-Man", MD_TYPE, MD_PARALLELS),
  card("MD-57", "Eitri", MD_TYPE, MD_PARALLELS),
  card("MD-58", "Mantis", MD_TYPE, MD_PARALLELS),
  card("MD-59", "Dr. Christine Palmer", MD_TYPE, MD_PARALLELS),
  card("MD-60", "Ikaris", MD_TYPE, MD_PARALLELS),
  card("MD-61", "Iron Man", MD_TYPE, MD_PARALLELS),
  card("MD-62", "Ajak", MD_TYPE, MD_PARALLELS),
  card("MD-63", "Justin Hammer", MD_TYPE, MD_PARALLELS),
  card("MD-64", "Nick Fury", MD_TYPE, MD_PARALLELS),
  card("MD-65", "Black Widow", MD_TYPE, MD_PARALLELS),
  card("MD-66", "Winter Soldier", MD_TYPE, MD_PARALLELS),
  card("MD-67", "Shang-Chi", MD_TYPE, MD_PARALLELS),
  card("MD-68", "Sylvie", MD_TYPE, MD_PARALLELS),
  card("MD-69", "Dr. Abraham Erskine", MD_TYPE, MD_PARALLELS),
  card("MD-70", "Dr. Erik Selvig", MD_TYPE, MD_PARALLELS),
  card("MD-71", "She-Hulk", MD_TYPE, MD_PARALLELS),
  card("MD-72", "Loki", MD_TYPE, MD_PARALLELS),
  card("MD-73", "Spider-Man", MD_TYPE, MD_PARALLELS),
  card("MD-74", "The Collector", MD_TYPE, MD_PARALLELS),
  card("MD-75", "Groot", MD_TYPE, MD_PARALLELS),
  card("MD-76", "Gamora", MD_TYPE, MD_PARALLELS),
  card("MD-77", "Hope Van Dyne", MD_TYPE, MD_PARALLELS),
  card("MD-78", "Dr. Bill Foster", MD_TYPE, MD_PARALLELS),
  card("MD-79", "Daredevil", MD_TYPE, MD_PARALLELS),
  card("MD-80", "Mister Fantastic", MD_TYPE, MD_PARALLELS),
  card("MD-81", "Invisible Woman", MD_TYPE, MD_PARALLELS),
  card("MD-82", "Human Torch", MD_TYPE, MD_PARALLELS),
  card("MD-83", "The Thing", MD_TYPE, MD_PARALLELS),
  card("MD-84", "Silver Surfer", MD_TYPE, MD_PARALLELS),
  card("MD-85", "Falcon", MD_TYPE, MD_PARALLELS),
  card("MD-86", "Ms. Marvel", MD_TYPE, MD_PARALLELS),
  card("MD-87", "Monica Rambeau", MD_TYPE, MD_PARALLELS),
  card("MD-88", "King Laufey", MD_TYPE, MD_PARALLELS),
  card("MD-89", "John F. Walker", MD_TYPE, MD_PARALLELS),
  card("MD-90", "Falcon", MD_TYPE, MD_PARALLELS),

  // TRUE GREATNESS (32)
  card("TG-1", "Iron Man", TG_TYPE, TG_PARALLELS),
  card("TG-2", "Spider-Man", TG_TYPE, TG_PARALLELS),
  card("TG-3", "Captain America", TG_TYPE, TG_PARALLELS),
  card("TG-4", "Falcon", TG_TYPE, TG_PARALLELS),
  card("TG-5", "Thanos", TG_TYPE, TG_PARALLELS),
  card("TG-6", "Doctor Strange", TG_TYPE, TG_PARALLELS),
  card("TG-7", "Ant-Man", TG_TYPE, TG_PARALLELS),
  card("TG-8", "Thor", TG_TYPE, TG_PARALLELS),
  card("TG-9", "Valkyrie", TG_TYPE, TG_PARALLELS),
  card("TG-10", "Hulk", TG_TYPE, TG_PARALLELS),
  card("TG-11", "Loki", TG_TYPE, TG_PARALLELS),
  card("TG-12", "Odin", TG_TYPE, TG_PARALLELS),
  card("TG-13", "Star-Lord", TG_TYPE, TG_PARALLELS),
  card("TG-14", "Rocket", TG_TYPE, TG_PARALLELS),
  card("TG-15", "Groot", TG_TYPE, TG_PARALLELS),
  card("TG-16", "Gamora", TG_TYPE, TG_PARALLELS),
  card("TG-17", "Black Widow", TG_TYPE, TG_PARALLELS),
  card("TG-18", "Hawkeye", TG_TYPE, TG_PARALLELS),
  card("TG-19", "Nick Fury", TG_TYPE, TG_PARALLELS),
  card("TG-20", "Wanda Maximoff", TG_TYPE, TG_PARALLELS),
  card("TG-21", "Vision", TG_TYPE, TG_PARALLELS),
  card("TG-22", "Bucky Barnes", TG_TYPE, TG_PARALLELS),
  card("TG-23", "Shuri", TG_TYPE, TG_PARALLELS),
  card("TG-24", "Captain Marvel", TG_TYPE, TG_PARALLELS),
  card("TG-25", "Wong", TG_TYPE, TG_PARALLELS),
  card("TG-26", "M'Baku", TG_TYPE, TG_PARALLELS),
  card("TG-27", "Zemo", TG_TYPE, TG_PARALLELS),
  card("TG-28", "Erik Killmonger", TG_TYPE, TG_PARALLELS),
  card("TG-29", "Agatha Harkness", TG_TYPE, TG_PARALLELS),
  card("TG-30", "Moon Knight", TG_TYPE, TG_PARALLELS),
  card("TG-31", "Shang-Chi", TG_TYPE, TG_PARALLELS),
  card("TG-32", "Drax", TG_TYPE, TG_PARALLELS),

  // VAULT ARMORY (6)
  card("VA-01", "Captain America", VA_TYPE, VA_PARALLELS, "Stunt Captain America's Shield"),
  card("VA-02", "Star-Lord", VA_TYPE, VA_PARALLELS, "Star-Lord's Blaster"),
  card("VA-04", "Thor", VA_TYPE, VA_PARALLELS, "Stunt Stormbreaker"),
  card("VA-07", "Gamora", VA_TYPE, VA_PARALLELS, "Gamora's Sword"),
  card("VA-08", "Valkyrie", VA_TYPE, VA_PARALLELS, "Valkyrie's Sword"),
  card("VA-10", "Hawkeye", VA_TYPE, VA_PARALLELS, "Ronin's Sword"),

  // FROM THE SET (10)
  card("FTS-AH", "Agatha Harkness", FTS_TYPE, FTS_PARALLELS, "Spirit Board Set"),
  card("FTS-BM", "Billy Maximoff", FTS_TYPE, FTS_PARALLELS, "Denim Jacket"),
  card("FTS-CL", "Classic Loki", FTS_TYPE, FTS_PARALLELS, "Loki's Palace Throne"),
  card("FTS-IH", "Ironheart", FTS_TYPE, FTS_PARALLELS, "Plymouth Barracuda"),
  card("FTS-LO", "Loki", FTS_TYPE, FTS_PARALLELS, "Loki's Palace Throne"),
  card("FTS-PL", "President Loki", FTS_TYPE, FTS_PARALLELS, "Loki's Palace Throne"),
  card("FTS-RV", "Rio Vidal", FTS_TYPE, FTS_PARALLELS, "The Secrets of the Tarot Book"),
  card("FTS-SH", "Shuri", FTS_TYPE, FTS_PARALLELS, "Plymouth Barracuda"),
  card("FTS-SY", "Sylvie", FTS_TYPE, FTS_PARALLELS, "Loki's Palace Throne"),
  card("FTS-TH", "The Hood", FTS_TYPE, FTS_PARALLELS, "Plymouth Barracuda"),

  // INK-616 AUTOGRAPHS (28)
  card("INK-AB", "Angela Bassett as Queen Ramonda", INK_TYPE, INK_PARALLELS),
  card("INK-BL", "Brie Larson as Captain Marvel", INK_TYPE, INK_PARALLELS),
  card("INK-CB", "Cate Blanchett as Hela", INK_TYPE, INK_PARALLELS),
  card("INK-CE", "Chris Evans as Captain America", INK_TYPE, INK_PARALLELS),
  card("INK-CG", "Clark Gregg as Phil Coulson", INK_TYPE, INK_PARALLELS),
  card("INK-CI", "Chukwudi Iwuji as The High Evolutionary", INK_TYPE, INK_PARALLELS),
  card("INK-EC", "Emilia Clarke as G'iah", INK_TYPE, INK_PARALLELS),
  card("INK-ED", "Elizabeth Debicki as Ayesha", INK_TYPE, INK_PARALLELS),
  card("INK-EO", "Elizabeth Olsen as Wanda Maximoff", INK_TYPE, INK_PARALLELS),
  card("INK-FP", "Florence Pugh as Yelena Belova", INK_TYPE, INK_PARALLELS),
  card("INK-GC", "Glenn Close as Nova Prime", INK_TYPE, INK_PARALLELS),
  card("INK-GP", "Gwyneth Paltrow as Pepper Potts", INK_TYPE, INK_PARALLELS),
  card("INK-HA", "Hayley Atwell as Peggy Carter", INK_TYPE, INK_PARALLELS),
  card("INK-HS", "Hailee Steinfeld as Kate Bishop", INK_TYPE, INK_PARALLELS),
  card("INK-JB", "Josh Brolin as Thanos", INK_TYPE, INK_PARALLELS),
  card("INK-JL", "Jude Law as Yon-Rogg", INK_TYPE, INK_PARALLELS),
  card("INK-JR", "Jeremy Renner as Hawkeye", INK_TYPE, INK_PARALLELS),
  card("INK-KD", "Kat Dennings as Darcy Lewis", INK_TYPE, INK_PARALLELS),
  card("INK-KG", "Karen Gillan as Nebula", INK_TYPE, INK_PARALLELS),
  card("INK-KH", "Kathryn Hahn as Agatha Harkness", INK_TYPE, INK_PARALLELS),
  card("INK-LP", "Lee Pace as Ronan", INK_TYPE, INK_PARALLELS),
  card("INK-LW", "Letitia Wright as Shuri", INK_TYPE, INK_PARALLELS),
  card("INK-PB", "Paul Bettany as Vision", INK_TYPE, INK_PARALLELS),
  card("INK-PK", "Pom Klementieff as Mantis", INK_TYPE, INK_PARALLELS),
  card("INK-RM", "Michael Rooker as Yondu", INK_TYPE, INK_PARALLELS),
  card("INK-SL", "Simu Liu as Shang-Chi", INK_TYPE, INK_PARALLELS),
  card("INK-SS", "Sebastian Stan as Bucky Barnes", INK_TYPE, INK_PARALLELS),
  card("INK-TH", "Tom Hiddleston as Loki", INK_TYPE, INK_PARALLELS),

  // LACED IN GOLD (12)
  card("LIG-AM", "Anthony Mackie as Falcon", LIG_TYPE, LIG_PARALLELS),
  card("LIG-BL", "Brie Larson as Captain Marvel", LIG_TYPE, LIG_PARALLELS),
  card("LIG-CE", "Chris Evans as Captain America", LIG_TYPE, LIG_PARALLELS),
  card("LIG-CT", "Cate Blanchett as Hela", LIG_TYPE, LIG_PARALLELS),
  card("LIG-EMB", "Ebon Moss-Bachrach as The Thing", LIG_TYPE, LIG_PARALLELS),
  card("LIG-EO", "Elizabeth Olsen as Wanda Maximoff", LIG_TYPE, LIG_PARALLELS),
  card("LIG-GP", "Gwyneth Paltrow as Pepper Potts", LIG_TYPE, LIG_PARALLELS),
  card("LIG-JB", "Josh Brolin as Thanos", LIG_TYPE, LIG_PARALLELS),
  card("LIG-JLD", "Julia Louis-Dreyfus as Valentina Allegra de Fontaine", LIG_TYPE, LIG_PARALLELS),
  card("LIG-KH", "Kathryn Hahn as Agatha Harkness", LIG_TYPE, LIG_PARALLELS),
  card("LIG-PB", "Paul Bettany as Vision", LIG_TYPE, LIG_PARALLELS),
  card("LIG-SS", "Sebastian Stan as Bucky Barnes", LIG_TYPE, LIG_PARALLELS),

  // MARVEL DUOS AUTOGRAPHS (15)
  card("MD-AD", "Anthony Mackie / Danny Ramirez", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-AM", "Michael B. Jordan / Andy Serkis", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-AS", "Anthony Mackie / Sebastian Stan", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-BS", "Brie Larson / Samuel L. Jackson", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-CC", "Cobie Smulders / Clark Gregg", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-DK", "Kenneth Choi / Dominic Cooper", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-EK", "Kathryn Hahn / Elizabeth Olsen", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-EP", "Elizabeth Olsen / Paul Bettany", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-JD", "David Harbour / Julia Louis-Dreyfus", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-JH", "Jeremy Renner / Hailee Steinfeld", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-PE", "Paul Rudd / Evangeline Lilly", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-PV", "Pedro Pascal / Vanessa Kirby", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-TR", "Tom Hiddleston / Richard E. Grant", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-TS", "Tom Hiddleston / Sophia Di Martino", DUOS_TYPE, DUOS_PARALLELS),
  card("MD-WE", "Elizabeth Debicki / Will Poulter", DUOS_TYPE, DUOS_PARALLELS),

  // MARVEL TRIPLES AUTOGRAPHS (7)
  card("MT-CSA", "Anthony Mackie / Chris Evans / Sebastian Stan", TRIPLES_TYPE, TRIPLES_PARALLELS),
  card("MT-EPK", "Kat Dennings / Paul Bettany / Elizabeth Olsen", TRIPLES_TYPE, TRIPLES_PARALLELS),
  card("MT-FMA", "Forest Whitaker / Angela Bassett / Michael B. Jordan", TRIPLES_TYPE, TRIPLES_PARALLELS),
  card("MT-HDK", "Kenneth Choi / Dominic Cooper / Hayley Atwell", TRIPLES_TYPE, TRIPLES_PARALLELS),
  card("MT-SCC", "Clark Gregg / Cobie Smulders / Samuel L. Jackson", TRIPLES_TYPE, TRIPLES_PARALLELS),
  card("MT-SWJ", "Wyatt Russell / Julia Louis-Dreyfus / Sebastian Stan", TRIPLES_TYPE, TRIPLES_PARALLELS),
  card("MT-TOS", "Sophia Di Martino / Owen Wilson / Tom Hiddleston", TRIPLES_TYPE, TRIPLES_PARALLELS),

  // ASGARD LITERATURE (2)
  card("AL-ACTT", "Cate Blanchett / Taika Waititi / Tessa Thompson / Anthony Hopkins", AL_TYPE, AL_PARALLELS),
  card("AL-OLHK", "Christopher Eccleston / Stellen Skarsgård / Kat Dennings / Natalie Portman", AL_TYPE, AL_PARALLELS),

  // IMMORTAL AUTOGRAPHS (28)
  card("IA-AH", "Anthony Hopkins as Odin", IA_TYPE, IA_PARALLELS),
  card("IA-AS", "Anthony Hopkins as Odin", IA_TYPE, IA_PARALLELS),
  card("IA-AM", "Anthony Mackie as Captain America", IA_TYPE, IA_PARALLELS),
  card("IA-BL", "Brie Larson as Captain Marvel", IA_TYPE, IA_PARALLELS),
  card("IA-BN", "Brie Larson as Captain Marvel", IA_TYPE, IA_PARALLELS),
  card("IA-CB", "Cate Blanchett as Hela", IA_TYPE, IA_PARALLELS),
  card("IA-CT", "Cate Blanchett as Hela", IA_TYPE, IA_PARALLELS),
  card("IA-CC", "Charlie Cox as Daredevil", IA_TYPE, IA_PARALLELS),
  card("IA-CHT", "Charlize Theron as Clea", IA_TYPE, IA_PARALLELS),
  card("IA-CL", "Chris Pratt as Star-Lord", IA_TYPE, IA_PARALLELS),
  card("IA-CP", "Chris Pratt as Star-Lord", IA_TYPE, IA_PARALLELS),
  card("IA-EL", "Elizabeth Olsen as Scarlet Witch", IA_TYPE, IA_PARALLELS),
  card("IA-EO", "Elizabeth Olsen as Wanda Maximoff", IA_TYPE, IA_PARALLELS),
  card("IA-HS", "Hailee Steinfeld as Kate Bishop", IA_TYPE, IA_PARALLELS),
  card("IA-HJ", "Hugh Jackman as Wolverine", IA_TYPE, IA_PARALLELS),
  card("IA-HU", "Hugh Jackman as Wolverine", IA_TYPE, IA_PARALLELS),
  card("IA-JE", "Jeremy Renner as Hawkeye", IA_TYPE, IA_PARALLELS),
  card("IA-JR", "Jeremy Renner as Hawkeye", IA_TYPE, IA_PARALLELS),
  card("IA-JB", "Josh Brolin as Thanos", IA_TYPE, IA_PARALLELS),
  card("IA-JO", "Josh Brolin as Thanos", IA_TYPE, IA_PARALLELS),
  card("IA-RE", "Ryan Reynolds as Deadpool", IA_TYPE, IA_PARALLELS),
  card("IA-RS", "Ryan Reynolds as Deadpool", IA_TYPE, IA_PARALLELS),
  card("IA-SL", "Samuel L Jackson as Nick Fury", IA_TYPE, IA_PARALLELS),
  card("IA-SA", "Samuel L. Jackson as Nick Fury", IA_TYPE, IA_PARALLELS),
  card("IA-SM", "Simu Liu as Shang-Chi", IA_TYPE, IA_PARALLELS),
  card("IA-TM", "Tatiana Maslany as She-Hulk", IA_TYPE, IA_PARALLELS),
  card("IA-TH", "Tom Hiddleston as Loki", IA_TYPE, IA_PARALLELS),
  card("IA-TL", "Tom Hiddleston as Loki", IA_TYPE, IA_PARALLELS),

  // MARVEL AUTOGRAPH RELICS (10)
  card("AR-AN", "Anthony Mackie as Captain America", AR_TYPE, AR_PARALLELS, "Aircraft Cockpit"),
  card("AR-CE", "Chris Evans as Captain America", AR_TYPE, AR_PARALLELS, "Stark Tower Penthouse Sofa"),
  card("AR-CT", "Chris Pratt as Star-Lord", AR_TYPE, AR_PARALLELS, "Candy Cane"),
  card("AR-DR", "Danny Ramirez as Falcon", AR_TYPE, AR_PARALLELS, "Aircraft Cockpit"),
  card("AR-GP", "Gwyneth Paltrow as Pepper Potts", AR_TYPE, AR_PARALLELS, "Stark Tower Penthouse Sofa"),
  card("AR-HF", "Harrison Ford as President Thaddeus Ross", AR_TYPE, AR_PARALLELS, "Presidential Podium"),
  card("AR-JE", "Jeremy Renner as Hawkeye", AR_TYPE, AR_PARALLELS, "Stark Tower Penthouse Sofa"),
  card("AR-PK", "Pom Klementieff as Mantis", AR_TYPE, AR_PARALLELS, "Candy Cane"),
  card("AR-PR", "Paul Rudd as Ant-Man", AR_TYPE, AR_PARALLELS, "Stark Tower Penthouse Sofa"),
  card("AR-TH", "Tom Hiddleston as Loki", AR_TYPE, AR_PARALLELS, "Stark Tower Penthouse Sofa"),

  // MARVEL DUAL AUTOGRAPH RELICS (3)
  card("DR-CR", "Harrison Ford / Anthony Mackie", DR_TYPE, DR_PARALLELS, "Presidential Podium / Aircraft Cockpit"),
  card("DR-LD", "Dominique Thorne / Letitia Wright", DR_TYPE, DR_PARALLELS, "Plymouth Barracuda"),
  card("DR-MR", "Danny Ramirez / Anthony Mackie", DR_TYPE, DR_PARALLELS, "Aircraft Cockpit"),

  // MARVEL TRIPLE AUTOGRAPH RELICS (1)
  card("TR-CPC", "Chris Evans / Harrison Ford / Anthony Mackie", TR_TYPE, TR_PARALLELS),

  // THE VAULT AUTOGRAPH RELIC BOOK (3)
  card("V-CE", "Chris Evans as Captain America", V_TYPE, V_PARALLELS),
  card("V-EMB", "Ebon Moss-Bachrach as Ben Grimm", V_TYPE, V_PARALLELS),
  card("V-VK", "Vanessa Kirby as Sue Storm", V_TYPE, V_PARALLELS),

  // MARVEL DIAMONDS AUTOGRAPH EDITION (27)
  card("DA-BL", "Brie Larson as Captain Marvel", DA_TYPE, DA_PARALLELS),
  card("DA-CB", "Cate Blanchett as Hela", DA_TYPE, DA_PARALLELS),
  card("DA-CE", "Chris Evans as Captain America", DA_TYPE, DA_PARALLELS),
  card("DA-CG", "Clark Gregg as Phil Coulson", DA_TYPE, DA_PARALLELS),
  card("DA-EC", "Emilia Clarke as G'iah", DA_TYPE, DA_PARALLELS),
  card("DA-EM", "Ebon Moss-Bachrach as The Thing", DA_TYPE, DA_PARALLELS),
  card("DA-EO", "Elizabeth Olsen as Wanda Maximoff", DA_TYPE, DA_PARALLELS),
  card("DA-FP", "Florence Pugh as Yelena Belova", DA_TYPE, DA_PARALLELS),
  card("DA-FW", "Forest Whitaker as Zuri", DA_TYPE, DA_PARALLELS),
  card("DA-GP", "Gwyneth Paltrow as Pepper Potts", DA_TYPE, DA_PARALLELS),
  card("DA-HA", "Hayley Atwell as Peggy Carter", DA_TYPE, DA_PARALLELS),
  card("DA-HS", "Hailee Steinfeld as Kate Bishop", DA_TYPE, DA_PARALLELS),
  card("DA-JB", "Josh Brolin as Thanos", DA_TYPE, DA_PARALLELS),
  card("DA-JL", "Jude Law as Yon-Rogg", DA_TYPE, DA_PARALLELS),
  card("DA-JR", "Jeremy Renner as Hawkeye", DA_TYPE, DA_PARALLELS),
  card("DA-KG", "Karen Gillan as Nebula", DA_TYPE, DA_PARALLELS),
  card("DA-LP", "Lee Pace as Ronan", DA_TYPE, DA_PARALLELS),
  card("DA-LW", "Letitia Wright as Shuri", DA_TYPE, DA_PARALLELS),
  card("DA-PK", "Pom Klementieff as Mantis", DA_TYPE, DA_PARALLELS),
  card("DA-PY", "Paul Bettany as Vision", DA_TYPE, DA_PARALLELS),
  card("DA-SD", "Sophia Di Martino as Sylvie", DA_TYPE, DA_PARALLELS),
  card("DA-SL", "Simu Liu as Shang-Chi", DA_TYPE, DA_PARALLELS),
  card("DA-SN", "Sebastian Stan as Bucky Barnes", DA_TYPE, DA_PARALLELS),
  card("DA-TH", "Tom Hiddleston as Loki", DA_TYPE, DA_PARALLELS),
  card("DA-TM", "Tatiana Maslany as She-Hulk", DA_TYPE, DA_PARALLELS),
  card("DA-TP", "Teyonah Parris as Monica Rambeau", DA_TYPE, DA_PARALLELS),
  card("DA-VK", "Vanessa Kirby as Invisible Woman", DA_TYPE, DA_PARALLELS),

  // TRUE GREATNESS AUTOGRAPH EDITION (6)
  card("TGA-CE", "Chris Evans as Captain America", TGA_TYPE, TGA_PARALLELS),
  card("TGA-EO", "Elizabeth Olsen as Wanda Maximoff", TGA_TYPE, TGA_PARALLELS),
  card("TGA-JB", "Josh Brolin as Thanos", TGA_TYPE, TGA_PARALLELS),
  card("TGA-JR", "Jeremy Renner as Hawkeye", TGA_TYPE, TGA_PARALLELS),
  card("TGA-PB", "Paul Bettany as Vision", TGA_TYPE, TGA_PARALLELS),
  card("TGA-TT", "Tessa Thompson as Valkyrie", TGA_TYPE, TGA_PARALLELS),

  // VAULT ARMORY AUTOGRAPHS (4)
  card("VAA-CE", "Chris Evans as Captain America", VAA_TYPE, VAA_PARALLELS, "Stunt Captain America's Shield"),
  card("VAA-CP", "Chris Pratt as Star-Lord", VAA_TYPE, VAA_PARALLELS, "Star-Lord's Blaster"),
  card("VAA-JR", "Jeremy Renner as Hawkeye", VAA_TYPE, VAA_PARALLELS, "Ronin's Sword"),
  card("VAA-TT", "Tessa Thompson as Valkyrie", VAA_TYPE, VAA_PARALLELS, "Valkyrie's Sword"),

  // FROM THE SET AUTOGRAPHS (15)
  card("FTSA-AA", "Ali Ahn as Alice Wu-Gulliver", FTSA_TYPE, FTSA_PARALLELS, "Séance Décor"),
  card("FTSA-AE", "Alden Ehrenreich as Ezekiel Stane", FTSA_TYPE, FTSA_PARALLELS, "Plymouth Barracuda"),
  card("FTSA-AR", "Anthony Ramos as The Hood", FTSA_TYPE, FTSA_PARALLELS, "Plymouth Barracuda"),
  card("FTSA-DJ", "Debra Jo Rupp as Mrs. Hart", FTSA_TYPE, FTSA_PARALLELS, "Spirit Board Set"),
  card("FTSA-DT", "Dominique Thorne as Ironheart", FTSA_TYPE, FTSA_PARALLELS, "Plymouth Barracuda"),
  card("FTSA-HS", "Tom Hiddleston as President Loki", FTSA_TYPE, FTSA_PARALLELS, "Loki's Palace Throne"),
  card("FTSA-JL", "Joe Locke as Billy Maximoff", FTSA_TYPE, FTSA_PARALLELS, "Denim Jacket"),
  card("FTSA-KH", "Kathryn Hahn as Agatha Harkness", FTSA_TYPE, FTSA_PARALLELS, "Spirit Board Set"),
  card("FTSA-LR", "Lyric Ross as N.A.T.A.L.I.E.", FTSA_TYPE, FTSA_PARALLELS, "Plymouth Barracuda"),
  card("FTSA-LW", "Letitia Wright as Shuri", FTSA_TYPE, FTSA_PARALLELS, "Plymouth Barracuda"),
  card("FTSA-PL", "Patti LuPone as Lilia Calderu", FTSA_TYPE, FTSA_PARALLELS, "Séance Décor"),
  card("FTSA-RG", "Richard E. Grant as Classic Loki", FTSA_TYPE, FTSA_PARALLELS, "Loki's Palace Throne"),
  card("FTSA-SD", "Sophia Di Martino as Sylvie", FTSA_TYPE, FTSA_PARALLELS, "Loki's Palace Throne"),
  card("FTSA-SZ", "Sasheer Zamata as Jennifer Kale", FTSA_TYPE, FTSA_PARALLELS, "Séance Décor"),
  card("FTSA-TH", "Tom Hiddleston as Loki", FTSA_TYPE, FTSA_PARALLELS, "Loki's Palace Throne"),
];

let startedVersion: string | null = null;

function isForbidden(setId: number): boolean {
  return (FORBIDDEN_SET_IDS as readonly number[]).includes(setId);
}

function uniqueCardNumbersOrThrow(): void {
  const seen = new Set<string>();
  for (const row of CARDS) {
    if (seen.has(row.cardNumber)) {
      throw new Error(`[vault2026Seed] duplicate cardNumber ${row.cardNumber}`);
    }
    seen.add(row.cardNumber);
  }
}

async function resolveTargetSetId(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>
): Promise<number | null> {
  const rows = await db
    .select({ id: marvelSets.id, slug: marvelSets.slug })
    .from(marvelSets);

  const bySlug = rows.find((row) => row.slug === SET_SLUG);
  if (bySlug) {
    if (isForbidden(bySlug.id)) {
      console.error(
        `[vault2026Seed] refuse: slug ${SET_SLUG} already on forbidden setId=${bySlug.id}`
      );
      return null;
    }
    return bySlug.id;
  }

  const taken = new Set(rows.map((row) => row.id));
  if (!taken.has(PREFERRED_SET_ID) && !isForbidden(PREFERRED_SET_ID)) {
    return PREFERRED_SET_ID;
  }

  for (let id = 90008; id < 90100; id++) {
    if (!taken.has(id) && !isForbidden(id)) return id;
  }
  console.error("[vault2026Seed] refuse: no unused 90007+ set id");
  return null;
}

async function seedSet(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  setId: number
): Promise<string> {
  if (isForbidden(setId)) return "refuse: forbidden set";

  const existing = await db
    .select({
      id: marvelSets.id,
      slug: marvelSets.slug,
      name: marvelSets.name,
      shortName: marvelSets.shortName,
      releaseYear: marvelSets.releaseYear,
      totalCards: marvelSets.totalCards,
      description: marvelSets.description,
      imageUrl: marvelSets.imageUrl,
    })
    .from(marvelSets)
    .where(eq(marvelSets.id, setId));

  const totalCards = CARDS.length;

  if (!existing.length) {
    await db.insert(marvelSets).values({
      id: setId,
      name: SET_NAME,
      shortName: SET_SHORT_NAME,
      slug: SET_SLUG,
      releaseYear: SET_YEAR,
      totalCards,
      description: SET_DESCRIPTION,
      imageUrl: null,
    });
    return `inserted set id=${setId} slug=${SET_SLUG} totalCards=${totalCards}`;
  }

  const row = existing[0];
  if (isForbidden(row.id)) return "refuse: forbidden set";
  if (row.slug !== SET_SLUG) {
    return `refuse: setId ${setId} already used by slug ${row.slug}`;
  }

  const needsUpdate =
    row.name !== SET_NAME ||
    row.shortName !== SET_SHORT_NAME ||
    row.releaseYear !== SET_YEAR ||
    row.totalCards !== totalCards ||
    row.description !== SET_DESCRIPTION;

  if (!needsUpdate) return "skip: set already current";

  await db
    .update(marvelSets)
    .set({
      name: SET_NAME,
      shortName: SET_SHORT_NAME,
      releaseYear: SET_YEAR,
      totalCards,
      description: SET_DESCRIPTION,
    })
    .where(and(eq(marvelSets.id, setId), eq(marvelSets.slug, SET_SLUG)));
  return `updated set id=${setId} totalCards=${totalCards}`;
}

async function seedCards(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  setId: number
): Promise<string> {
  if (isForbidden(setId)) return "refuse: forbidden set";

  const existing = await db
    .select({
      id: marvelCards.id,
      setId: marvelCards.setId,
      cardNumber: marvelCards.cardNumber,
      characterName: marvelCards.characterName,
      cardType: marvelCards.cardType,
      parallels: marvelCards.parallels,
      description: marvelCards.description,
      sortOrder: marvelCards.sortOrder,
      imageUrl: marvelCards.imageUrl,
    })
    .from(marvelCards)
    .where(eq(marvelCards.setId, setId));

  const byNumber = new Map(existing.map((row) => [row.cardNumber, row]));
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const pendingInsert: Array<{
    setId: number;
    cardNumber: string;
    characterName: string;
    cardType: string;
    parallels: string;
    description: string | null;
    sortOrder: number;
    imageUrl: null;
    backImageUrl: null;
    rarity: null;
    sourceId: null;
  }> = [];

  CARDS.forEach((spec, index) => {
    const sortOrder = index + 1;
    const row = byNumber.get(spec.cardNumber);
    if (!row) {
      pendingInsert.push({
        setId,
        cardNumber: spec.cardNumber,
        characterName: spec.characterName,
        cardType: spec.cardType,
        parallels: spec.parallels,
        description: spec.description,
        sortOrder,
        imageUrl: null,
        backImageUrl: null,
        rarity: null,
        sourceId: null,
      });
      return;
    }
    if (isForbidden(row.setId)) {
      skipped += 1;
      return;
    }
    const same =
      row.characterName === spec.characterName &&
      row.cardType === spec.cardType &&
      row.parallels === spec.parallels &&
      (row.description ?? null) === spec.description &&
      row.sortOrder === sortOrder;
    if (same) {
      skipped += 1;
      return;
    }
  });

  for (let i = 0; i < pendingInsert.length; i += 50) {
    const batch = pendingInsert.slice(i, i + 50);
    await db.insert(marvelCards).values(batch);
    inserted += batch.length;
  }

  for (let index = 0; index < CARDS.length; index++) {
    const spec = CARDS[index];
    const sortOrder = index + 1;
    const row = byNumber.get(spec.cardNumber);
    if (!row) continue;
    if (isForbidden(row.setId)) continue;
    const same =
      row.characterName === spec.characterName &&
      row.cardType === spec.cardType &&
      row.parallels === spec.parallels &&
      (row.description ?? null) === spec.description &&
      row.sortOrder === sortOrder;
    if (same) continue;

    await db
      .update(marvelCards)
      .set({
        characterName: spec.characterName,
        cardType: spec.cardType,
        parallels: spec.parallels,
        description: spec.description,
        sortOrder,
      })
      .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, setId)));
    updated += 1;
  }

  const after = await db
    .select({ cardNumber: marvelCards.cardNumber, total: marvelCards.id })
    .from(marvelCards)
    .where(eq(marvelCards.setId, setId));
  await db
    .update(marvelSets)
    .set({ totalCards: after.length })
    .where(and(eq(marvelSets.id, setId), eq(marvelSets.slug, SET_SLUG)));

  return `inserted ${inserted} updated ${updated} skipped ${skipped} total ${after.length}`;
}

async function seedVault2026(): Promise<void> {
  uniqueCardNumbersOrThrow();
  const db = await getDb();
  if (!db) {
    console.error("[vault2026Seed] skip: database unavailable");
    return;
  }

  const setId = await resolveTargetSetId(db);
  if (setId == null) return;
  if (isForbidden(setId)) {
    console.error(`[vault2026Seed] refuse: forbidden setId=${setId}`);
    return;
  }

  console.log(
    `[vault2026Seed] ${SEED_VERSION} starting setId=${setId} slug=${SET_SLUG} cards=${CARDS.length} (photos stay empty)`
  );

  try {
    const setResult = await seedSet(db, setId);
    console.log(`[vault2026Seed] set: ${setResult}`);
    if (setResult.startsWith("refuse")) return;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[vault2026Seed] set error: ${message}`);
    return;
  }

  try {
    const cards = await seedCards(db, setId);
    console.log(`[vault2026Seed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[vault2026Seed] cards error: ${message}`);
  }

  console.log(`[vault2026Seed] done version=${SEED_VERSION} setId=${setId}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startVault2026Seed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[vault2026Seed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedVault2026().catch((err) => {
      console.error("[vault2026Seed] fatal", err);
    });
  });
}
