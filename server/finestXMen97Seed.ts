/**
 * One-shot seed: insert 2025 Topps Finest X-Men '97 checklist + official hobby odds.
 * Hard-lock: setId=90008 and slug 2025-topps-finest-x-men-97.
 * Inserts the set if missing, then upserts cards for THIS setId only.
 * Never writes imageUrl/backImageUrl on insert (stay null). Never overwrites a
 * non-null imageUrl. Never writes set 1, 2, 3, 4, 5, 6, 30001, 60001, 90001-90007.
 * Odds are pull odds, never prices. Parser keeps thousands commas (1:8,094).
 * Sketch artist lists with no card numbers stay in the set description only.
 * Versioned in-memory once-flag so a bump re-runs. Must start AFTER listen.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards, marvelSets } from "../drizzle/schema";

const SET_ID = 90008;
const SET_SLUG = "2025-topps-finest-x-men-97";
const SET_NAME = "2025 Topps Finest X-Men \u201997";
const SET_SHORT_NAME = "Finest X-Men \u201997";
const SET_YEAR = 2025;

const FORBIDDEN_SET_IDS = [
  1, 2, 3, 4, 5, 6, 30001, 60001, 90001, 90002, 90003, 90004, 90005, 90006, 90007,
] as const;

/** Bump when the official Finest X-Men '97 checklist/odds change so the seed re-runs. */
const SEED_VERSION = "finest-xmen-97-2025-official-hobby-odds-v1";

function oddsLine(parts: Array<[string, string]>): string {
  return parts.map(([name, odds]) => `${name} \u00B7 ${odds}`).join(", ");
}

const COMMON_TYPE = "BASE CARDS COMMON";
const COMMON_PARALLELS = oddsLine([
  ["Common", "1:1"],
  ["Refractor", "1:6"],
  ["Laser Refractor", "1:41"],
  ["X-Fractor", "1:84"],
  ["Gold Refractor", "1:162"],
  ["Orange Refractor", "1:324"],
  ["Red Refractor", "1:1,619"],
  ["SuperFractor", "1:8,094"],
]);

const UNCOMMON_TYPE = "BASE CARDS UNCOMMON";
const UNCOMMON_PARALLELS = oddsLine([
  ["Uncommon", "1:2"],
  ["Refractor", "1:46"],
  ["Laser Refractor", "1:82"],
  ["X-Fractor", "1:167"],
  ["Gold Refractor", "1:324"],
  ["Orange Refractor", "1:648"],
  ["Red Refractor", "1:3,238"],
  ["SuperFractor", "1:16,188"],
]);

const RARE_TYPE = "BASE CARDS RARE";
const RARE_PARALLELS = oddsLine([
  ["Rare", "1:6"],
  ["Refractor", "1:135"],
  ["Laser Refractor", "1:136"],
  ["X-Fractor", "1:279"],
  ["Gold Refractor", "1:540"],
  ["Orange Refractor", "1:1,080"],
  ["Red Refractor", "1:5,396"],
  ["SuperFractor", "1:26,980"],
]);

const UNCANNY_TYPE = "UNCANNY SHORT PRINT";
const UNCANNY_PARALLELS = oddsLine([
  ["Base", "1:6"],
  ["Refractor", "1:135"],
  ["Laser Refractor", "1:204"],
  ["X-Fractor", "1:418"],
  ["Gold Refractor", "1:810"],
  ["Orange Refractor", "1:1,619"],
  ["Red Refractor", "1:8,094"],
  ["SuperFractor", "1:40,470"],
]);

const FSP_TYPE = "FINEST 97 SHORT PRINT";
const FSP_PARALLELS = oddsLine([
  ["X-Fractor", "1:422"],
  ["Superfractor", "1:31,131"],
]);

const PO_TYPE = "PREVIOUSLY ON X-MEN";
const PO_PARALLELS = oddsLine([
  ["Base", "1:3"],
  ["Laser Refractor", "1:102"],
  ["X-Fractor", "1:209"],
  ["Gold", "1:405"],
  ["Orange", "1:810"],
  ["Red", "1:4,047"],
  ["Superfractor", "1:20,235"],
]);

const GH_TYPE = "GREATEST HITS";
const GH_PARALLELS = oddsLine([
  ["Base", "1:3"],
  ["Laser Refractor", "1:102"],
  ["X-Fractor", "1:209"],
  ["Gold Refractor", "1:405"],
  ["Orange Refractor", "1:810"],
  ["Red Refractor", "1:4,047"],
  ["Superfractor", "1:20,235"],
]);

const RI_TYPE = "REMEMBER IT";
const RI_PARALLELS = oddsLine([
  ["Base", "1:6"],
  ["Laser Refractor", "1:204"],
  ["X-Fractor", "1:418"],
  ["Superfractor", "1:40,470"],
]);

const SS_TYPE = "SENTINELS\u2019 SCAN";
const SS_PARALLELS = oddsLine([
  ["Base", "1:48"],
  ["X-Fractor", "1:209"],
  ["Gold Refractor", "1:405"],
  ["Orange Refractor", "1:810"],
  ["Red Refractor", "1:4,047"],
  ["SuperFractor", "1:20,235"],
]);

const CA_TYPE = "CHILDREN OF THE ATOM";
const CA_PARALLELS = oddsLine([
  ["Base", "1:194"],
  ["Superfractor", "1:20,235"],
]);

const OMEGA_TYPE = "OMEGA LEVEL";
const OMEGA_PARALLELS = oddsLine([
  ["Base", "1:482"],
  ["Superfractor", "1:134,898"],
]);

const DNN_TYPE = "DA NANANA NAAAA";
const DNN_PARALLELS = oddsLine([
  ["Base", "1:756"],
  ["Mini Diamonds Refractor", "1:900"],
  ["Mojo Refractor", "1:1,799"],
  ["Wave Refractor", "1:8,994"],
  ["Superfractor", "1:44,966"],
]);

const VA_TYPE = "VOICE ACTOR AUTOGRAPHS";
const VA_PARALLELS = oddsLine([
  ["Base", "1:76"],
  ["X-Fractor", "1:378"],
  ["Gold Refractor", "1:732"],
  ["Orange Refractor", "1:1,463"],
  ["Red Refractor", "1:7,232"],
  ["Superfractor", "1:35,503"],
]);

const SET_DESCRIPTION =
  "2025 Topps Finest X-Men \u201997 (Common / Uncommon / Rare / Uncanny SP) with official hobby odds (Common Refractor 1:6, X-Fractor 1:84, SuperFractor 1:8,094). Inserts include Previously on X-Men, Greatest Hits, Remember It, Sentinels\u2019 Scan, Children of the Atom, Omega Level, DA NANANA NAAAA, voice actor autographs. X-Men \u201997 Sketch Cards 1:698 (Chris Meeks, Cisco Rivera, Takkun, Jason Sobol, Keith Farnum, Marlo Agunos, Matt Stewart, Michael Munshaw, Rich \"RAM\" Molinelli, Darrin Pepe, Duke, Eric Lehtonen, Jason Christner, Aaron Roberts Art, Roy Cover, Charlie Cody, Gary Shipman, Jason Crosby, Matthew Sutton, Michael Mastermaker, Mohammad Jilani, Rich Hennemann, Ryan Finley, Tim Shinn). Odds only, never prices. No photos yet.";

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
  // BASE CARDS COMMON (1-50)
  card("1", "Professor X", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("2", "Jean Grey", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("3", "Marrow", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("4", "Jubilee", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("5", "Beast", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("6", "Titan", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("7", "Banshee", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("8", "Aurora", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("9", "Northstar", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("10", "Darkstar", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("11", "Gladiator", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("12", "Exodus", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("13", "Araki", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("14", "Manta", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("15", "Strong Guy", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("16", "Morph", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("17", "Puck", COMMON_TYPE, COMMON_PARALLELS, "Ultimates"),
  card("18", "Mary Jane Watson", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("19", "Peter Parker", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("20", "Cipher", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("21", "Callisto", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("22", "Tommy", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("23", "Flash Thompson", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("24", "Roberto Da Costa", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("25", "Leech", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("26", "Glob Herman", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("27", "Trish Tilby", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("28", "Dazzler", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("29", "Sunder", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("30", "Boom Boom", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("31", "Val Cooper", COMMON_TYPE, COMMON_PARALLELS, "Rise"),
  card("32", "Gambit", COMMON_TYPE, COMMON_PARALLELS, "Masters"),
  card("33", "Sebastian Shaw", COMMON_TYPE, COMMON_PARALLELS, "Masters"),
  card("34", "Princess-Majestrix Lilandra Neramani", COMMON_TYPE, COMMON_PARALLELS, "Masters"),
  card("35", "Mojo", COMMON_TYPE, COMMON_PARALLELS, "Masters"),
  card("36", "Mother Askani", COMMON_TYPE, COMMON_PARALLELS, "Masters"),
  card("37", "Vulcan", COMMON_TYPE, COMMON_PARALLELS, "Masters"),
  card("38", "President Kelly", COMMON_TYPE, COMMON_PARALLELS, "Masters"),
  card("39", "Rogue", COMMON_TYPE, COMMON_PARALLELS, "Masters"),
  card("40", "Wolverine", COMMON_TYPE, COMMON_PARALLELS, "Masters"),
  card("41", "Cyclops", COMMON_TYPE, COMMON_PARALLELS, "Masters"),
  card("42", "Moira MacTaggert", COMMON_TYPE, COMMON_PARALLELS, "Masters"),
  card("43", "Master Mold", COMMON_TYPE, COMMON_PARALLELS, "Masters"),
  card("44", "Carl Denti", COMMON_TYPE, COMMON_PARALLELS, "Destroyers"),
  card("45", "Sentinel", COMMON_TYPE, COMMON_PARALLELS, "Destroyers"),
  card("46", "Henry Gyrich", COMMON_TYPE, COMMON_PARALLELS, "Destroyers"),
  card("47", "Blob", COMMON_TYPE, COMMON_PARALLELS, "Destroyers"),
  card("48", "Sauron", COMMON_TYPE, COMMON_PARALLELS, "Destroyers"),
  card("49", "Adversary", COMMON_TYPE, COMMON_PARALLELS, "Destroyers"),
  card("50", "Bastion", COMMON_TYPE, COMMON_PARALLELS, "Destroyers"),

  // BASE CARDS UNCOMMON (51-75)
  card("51", "Black Panther", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Ultimates"),
  card("52", "Spider-Man", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Ultimates"),
  card("53", "Daredevil", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Ultimates"),
  card("54", "Bishop", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Ultimates"),
  card("55", "Captain America", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Ultimates"),
  card("56", "Psylocke", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Ultimates"),
  card("57", "Iron Man", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Ultimates"),
  card("58", "Beast", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Ultimates"),
  card("59", "Cloak", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Ultimates"),
  card("60", "Dagger", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Ultimates"),
  card("61", "Archangel", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Ultimates"),
  card("62", "Spiral", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Rise"),
  card("63", "Jubilee", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Rise"),
  card("64", "Magneto", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Masters"),
  card("65", "Abscissa", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Masters"),
  card("66", "Forge", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Masters"),
  card("67", "Emma Frost", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Masters"),
  card("68", "Ronan The Accuser", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Destroyers"),
  card("69", "Deathbird", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Destroyers"),
  card("70", "Goblin Queen", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Destroyers"),
  card("71", "Crimson Dynamo", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Destroyers"),
  card("72", "X-Cutioner", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Destroyers"),
  card("73", "Silver Samurai", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Destroyers"),
  card("74", "Bastion", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Destroyers"),
  card("75", "Starbolt", UNCOMMON_TYPE, UNCOMMON_PARALLELS, "Destroyers"),

  // BASE CARDS RARE (76-90)
  card("76", "Rogue", RARE_TYPE, RARE_PARALLELS, "Ultimates"),
  card("77", "Nightcrawler", RARE_TYPE, RARE_PARALLELS, "Ultimates"),
  card("78", "Cyclops", RARE_TYPE, RARE_PARALLELS, "Ultimates"),
  card("79", "Wolverine", RARE_TYPE, RARE_PARALLELS, "Ultimates"),
  card("80", "Cable", RARE_TYPE, RARE_PARALLELS, "Ultimates"),
  card("81", "Gambit", RARE_TYPE, RARE_PARALLELS, "Ultimates"),
  card("82", "Sunspot", RARE_TYPE, RARE_PARALLELS, "Rise"),
  card("83", "Jean Grey", RARE_TYPE, RARE_PARALLELS, "Masters"),
  card("84", "Professor X", RARE_TYPE, RARE_PARALLELS, "Masters"),
  card("85", "Storm", RARE_TYPE, RARE_PARALLELS, "Masters"),
  card("86", "Magneto", RARE_TYPE, RARE_PARALLELS, "Masters"),
  card("87", "Dark Phoenix", RARE_TYPE, RARE_PARALLELS, "Destroyers"),
  card("88", "Apocalypse", RARE_TYPE, RARE_PARALLELS, "Destroyers"),
  card("89", "Mister Sinister", RARE_TYPE, RARE_PARALLELS, "Destroyers"),
  card("90", "Bastion Nimrod", RARE_TYPE, RARE_PARALLELS, "Destroyers"),

  // UNCANNY SHORT PRINT (91-100)
  card("91", "Storm", UNCANNY_TYPE, UNCANNY_PARALLELS, "Uncanny"),
  card("92", "Gambit", UNCANNY_TYPE, UNCANNY_PARALLELS, "Uncanny"),
  card("93", "Rogue", UNCANNY_TYPE, UNCANNY_PARALLELS, "Uncanny"),
  card("94", "Wolverine", UNCANNY_TYPE, UNCANNY_PARALLELS, "Uncanny"),
  card("95", "Cyclops", UNCANNY_TYPE, UNCANNY_PARALLELS, "Uncanny"),
  card("96", "Jean Grey", UNCANNY_TYPE, UNCANNY_PARALLELS, "Uncanny"),
  card("97", "Beast", UNCANNY_TYPE, UNCANNY_PARALLELS, "Uncanny"),
  card("98", "Magneto", UNCANNY_TYPE, UNCANNY_PARALLELS, "Uncanny"),
  card("99", "Cable", UNCANNY_TYPE, UNCANNY_PARALLELS, "Uncanny"),
  card("100", "Professor X", UNCANNY_TYPE, UNCANNY_PARALLELS, "Uncanny"),

  // FINEST 97 SHORT PRINT (FSP-1..FSP-13) — X-Fractor/Superfractor only, no invented base
  card("FSP-1", "Cyclops", FSP_TYPE, FSP_PARALLELS),
  card("FSP-2", "Jean Grey", FSP_TYPE, FSP_PARALLELS),
  card("FSP-3", "Storm", FSP_TYPE, FSP_PARALLELS),
  card("FSP-4", "Bishop", FSP_TYPE, FSP_PARALLELS),
  card("FSP-5", "Sunspot", FSP_TYPE, FSP_PARALLELS),
  card("FSP-6", "Jubilee", FSP_TYPE, FSP_PARALLELS),
  card("FSP-7", "Morph", FSP_TYPE, FSP_PARALLELS),
  card("FSP-8", "Wolverine", FSP_TYPE, FSP_PARALLELS),
  card("FSP-9", "Beast", FSP_TYPE, FSP_PARALLELS),
  card("FSP-10", "Mister Sinister", FSP_TYPE, FSP_PARALLELS),
  card("FSP-11", "Magneto", FSP_TYPE, FSP_PARALLELS),
  card("FSP-12", "Gambit", FSP_TYPE, FSP_PARALLELS),
  card("FSP-13", "Rogue", FSP_TYPE, FSP_PARALLELS),

  // PREVIOUSLY ON X-MEN (checklist has no PO-14 or PO-21..24)
  card("PO-1", "Magneto", PO_TYPE, PO_PARALLELS),
  card("PO-2", "Cyclops", PO_TYPE, PO_PARALLELS),
  card("PO-3", "Wolverine", PO_TYPE, PO_PARALLELS),
  card("PO-4", "Jubilee", PO_TYPE, PO_PARALLELS),
  card("PO-5", "Morph", PO_TYPE, PO_PARALLELS),
  card("PO-6", "Storm", PO_TYPE, PO_PARALLELS),
  card("PO-7", "Jean Grey", PO_TYPE, PO_PARALLELS),
  card("PO-8", "Rogue", PO_TYPE, PO_PARALLELS),
  card("PO-9", "Sunspot", PO_TYPE, PO_PARALLELS),
  card("PO-10", "Cable", PO_TYPE, PO_PARALLELS),
  card("PO-11", "Mojo", PO_TYPE, PO_PARALLELS),
  card("PO-12", "Beast", PO_TYPE, PO_PARALLELS),
  card("PO-13", "Bastion", PO_TYPE, PO_PARALLELS),
  card("PO-15", "X-Cutioner", PO_TYPE, PO_PARALLELS),
  card("PO-16", "Mister Sinister", PO_TYPE, PO_PARALLELS),
  card("PO-17", "Goblin Queen", PO_TYPE, PO_PARALLELS),
  card("PO-18", "Forge", PO_TYPE, PO_PARALLELS),
  card("PO-19", "Nightcrawler", PO_TYPE, PO_PARALLELS),
  card("PO-20", "Professor X", PO_TYPE, PO_PARALLELS),
  card("PO-25", "Gambit", PO_TYPE, PO_PARALLELS),

  // GREATEST HITS (GH-1..GH-20)
  card("GH-1", "\"Scary Enough For You, Bub?\"", GH_TYPE, GH_PARALLELS),
  card("GH-2", "Jubilation Celebration", GH_TYPE, GH_PARALLELS),
  card("GH-3", "Explosive Teamwork", GH_TYPE, GH_PARALLELS),
  card("GH-4", "Magnetic Makeover", GH_TYPE, GH_PARALLELS),
  card("GH-5", "Jean Doe", GH_TYPE, GH_PARALLELS),
  card("GH-6", "A Birthday To Remember", GH_TYPE, GH_PARALLELS),
  card("GH-7", "A Genoshan Welcome", GH_TYPE, GH_PARALLELS),
  card("GH-8", "\"You Survived\"", GH_TYPE, GH_PARALLELS),
  card("GH-9", "Farewell Mon Ami", GH_TYPE, GH_PARALLELS),
  card("GH-10", "Storm Rides The Lightning", GH_TYPE, GH_PARALLELS),
  card("GH-11", "The Professor Schools The Shi'ar", GH_TYPE, GH_PARALLELS),
  card("GH-12", "Rogue And Captain America At Odds", GH_TYPE, GH_PARALLELS),
  card("GH-13", "Bolivar Goes Prime", GH_TYPE, GH_PARALLELS),
  card("GH-14", "\"You Don\u2019t Screw With The Summers\"", GH_TYPE, GH_PARALLELS),
  card("GH-15", "Nein Reasons Why", GH_TYPE, GH_PARALLELS),
  card("GH-16", "\"To Me, My X-Men\"", GH_TYPE, GH_PARALLELS),
  card("GH-17", "Charles Was Wrong", GH_TYPE, GH_PARALLELS),
  card("GH-18", "A Sinister Strike", GH_TYPE, GH_PARALLELS),
  card("GH-19", "Meeting Of The Minds", GH_TYPE, GH_PARALLELS),
  card("GH-20", "\"His Name Was Gambit, Remember It\"", GH_TYPE, GH_PARALLELS),

  // REMEMBER IT (RI-1..RI-10)
  card("RI-1", "Cyclops", RI_TYPE, RI_PARALLELS),
  card("RI-2", "Jean Grey", RI_TYPE, RI_PARALLELS),
  card("RI-3", "Storm", RI_TYPE, RI_PARALLELS),
  card("RI-4", "Wolverine", RI_TYPE, RI_PARALLELS),
  card("RI-5", "Rogue", RI_TYPE, RI_PARALLELS),
  card("RI-6", "The Beast", RI_TYPE, RI_PARALLELS),
  card("RI-7", "Gambit", RI_TYPE, RI_PARALLELS),
  card("RI-8", "Jubilee", RI_TYPE, RI_PARALLELS),
  card("RI-9", "Magneto", RI_TYPE, RI_PARALLELS),
  card("RI-10", "The Sentinels", RI_TYPE, RI_PARALLELS),

  // SENTINELS' SCAN (SS-1..SS-20)
  card("SS-1", "Magneto", SS_TYPE, SS_PARALLELS),
  card("SS-2", "Storm", SS_TYPE, SS_PARALLELS),
  card("SS-3", "Cyclops", SS_TYPE, SS_PARALLELS),
  card("SS-4", "Bishop", SS_TYPE, SS_PARALLELS),
  card("SS-5", "Jubilee", SS_TYPE, SS_PARALLELS),
  card("SS-6", "Rogue", SS_TYPE, SS_PARALLELS),
  card("SS-7", "Gambit", SS_TYPE, SS_PARALLELS),
  card("SS-8", "Wolverine", SS_TYPE, SS_PARALLELS),
  card("SS-9", "Jean Grey", SS_TYPE, SS_PARALLELS),
  card("SS-10", "Beast", SS_TYPE, SS_PARALLELS),
  card("SS-11", "Sunspot", SS_TYPE, SS_PARALLELS),
  card("SS-12", "Morph", SS_TYPE, SS_PARALLELS),
  card("SS-13", "Nightcrawler", SS_TYPE, SS_PARALLELS),
  card("SS-14", "Forge", SS_TYPE, SS_PARALLELS),
  card("SS-15", "Callisto", SS_TYPE, SS_PARALLELS),
  card("SS-16", "Cable", SS_TYPE, SS_PARALLELS),
  card("SS-17", "Emma Frost", SS_TYPE, SS_PARALLELS),
  card("SS-18", "Sebastian Shaw", SS_TYPE, SS_PARALLELS),
  card("SS-19", "Leech", SS_TYPE, SS_PARALLELS),
  card("SS-20", "Glob", SS_TYPE, SS_PARALLELS),

  // CHILDREN OF THE ATOM (CA-1..CA-20) — do not mix CA-GB into this group
  card("CA-1", "Cyclops", CA_TYPE, CA_PARALLELS),
  card("CA-2", "Jean Grey", CA_TYPE, CA_PARALLELS),
  card("CA-3", "Abscissa", CA_TYPE, CA_PARALLELS),
  card("CA-4", "Forge", CA_TYPE, CA_PARALLELS),
  card("CA-5", "Wolverine", CA_TYPE, CA_PARALLELS),
  card("CA-6", "Gambit", CA_TYPE, CA_PARALLELS),
  card("CA-7", "Rogue", CA_TYPE, CA_PARALLELS),
  card("CA-8", "Mister Sinister", CA_TYPE, CA_PARALLELS),
  card("CA-9", "Magneto", CA_TYPE, CA_PARALLELS),
  card("CA-10", "Sunspot", CA_TYPE, CA_PARALLELS),
  card("CA-11", "Morph", CA_TYPE, CA_PARALLELS),
  card("CA-12", "Beast", CA_TYPE, CA_PARALLELS),
  card("CA-13", "Storm", CA_TYPE, CA_PARALLELS),
  card("CA-14", "Professor X", CA_TYPE, CA_PARALLELS),
  card("CA-15", "Cable", CA_TYPE, CA_PARALLELS),
  card("CA-16", "Bishop", CA_TYPE, CA_PARALLELS),
  card("CA-17", "Bastion Nimrod", CA_TYPE, CA_PARALLELS),
  card("CA-18", "Goblin Queen", CA_TYPE, CA_PARALLELS),
  card("CA-19", "Nightcrawler", CA_TYPE, CA_PARALLELS),
  card("CA-20", "Jubilee", CA_TYPE, CA_PARALLELS),

  // OMEGA LEVEL (O-1..O-3)
  card("O-1", "Storm", OMEGA_TYPE, OMEGA_PARALLELS),
  card("O-2", "Magneto", OMEGA_TYPE, OMEGA_PARALLELS),
  card("O-3", "Jean Grey", OMEGA_TYPE, OMEGA_PARALLELS),

  // DA NANANA NAAAA (DNN-1..DNN-9) — checklist has no character names; do not invent titles
  card("DNN-1", "DNN-1", DNN_TYPE, DNN_PARALLELS),
  card("DNN-2", "DNN-2", DNN_TYPE, DNN_PARALLELS),
  card("DNN-3", "DNN-3", DNN_TYPE, DNN_PARALLELS),
  card("DNN-4", "DNN-4", DNN_TYPE, DNN_PARALLELS),
  card("DNN-5", "DNN-5", DNN_TYPE, DNN_PARALLELS),
  card("DNN-6", "DNN-6", DNN_TYPE, DNN_PARALLELS),
  card("DNN-7", "DNN-7", DNN_TYPE, DNN_PARALLELS),
  card("DNN-8", "DNN-8", DNN_TYPE, DNN_PARALLELS),
  card("DNN-9", "DNN-9", DNN_TYPE, DNN_PARALLELS),

  // VOICE ACTOR AUTOGRAPHS
  card("CA-GB", "George Buza", VA_TYPE, VA_PARALLELS),
  card("VA-CB", "Chris Britton", VA_TYPE, VA_PARALLELS),
  card("VA-CD", "Cal Dodd", VA_TYPE, VA_PARALLELS),
  card("VA-EB", "Eric Bauza", VA_TYPE, VA_PARALLELS),
  card("VA-GA", "Gui Agustini", VA_TYPE, VA_PARALLELS),
  card("VA-IR", "Isaac Robinson-Smith", VA_TYPE, VA_PARALLELS),
  card("VA-LB", "Lawrence Bayne", VA_TYPE, VA_PARALLELS),
  card("VA-LZ", "Lenore Zann", VA_TYPE, VA_PARALLELS),
  card("VA-MW", "Matthew Waterson", VA_TYPE, VA_PARALLELS),
  card("VA-RC", "Ray Chase", VA_TYPE, VA_PARALLELS),
  card("VA-RM", "Ross Marquand", VA_TYPE, VA_PARALLELS),
];

let startedVersion: string | null = null;

function isForbidden(setId: number): boolean {
  return setId !== SET_ID || (FORBIDDEN_SET_IDS as readonly number[]).includes(setId);
}

function uniqueCardNumbersOrThrow(): void {
  const seen = new Set<string>();
  for (const row of CARDS) {
    if (seen.has(row.cardNumber)) {
      throw new Error(`[finestXMen97Seed] duplicate cardNumber ${row.cardNumber}`);
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
    if (bySlug.id !== SET_ID || isForbidden(bySlug.id)) {
      console.error(
        `[finestXMen97Seed] refuse: slug ${SET_SLUG} already on setId=${bySlug.id}`
      );
      return null;
    }
    return SET_ID;
  }

  const taken = rows.find((row) => row.id === SET_ID);
  if (taken) {
    console.error(
      `[finestXMen97Seed] refuse: setId ${SET_ID} already used by slug ${taken.slug}`
    );
    return null;
  }
  if (isForbidden(SET_ID)) {
    console.error(`[finestXMen97Seed] refuse: forbidden setId=${SET_ID}`);
    return null;
  }
  return SET_ID;
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

async function seedFinestXMen97(): Promise<void> {
  uniqueCardNumbersOrThrow();
  const db = await getDb();
  if (!db) {
    console.error("[finestXMen97Seed] skip: database unavailable");
    return;
  }

  const setId = await resolveTargetSetId(db);
  if (setId == null) return;
  if (isForbidden(setId)) {
    console.error(`[finestXMen97Seed] refuse: forbidden setId=${setId}`);
    return;
  }

  console.log(
    `[finestXMen97Seed] ${SEED_VERSION} starting setId=${setId} slug=${SET_SLUG} cards=${CARDS.length} (photos stay empty)`
  );

  try {
    const setResult = await seedSet(db, setId);
    console.log(`[finestXMen97Seed] set: ${setResult}`);
    if (setResult.startsWith("refuse")) return;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[finestXMen97Seed] set error: ${message}`);
    return;
  }

  try {
    const cards = await seedCards(db, setId);
    console.log(`[finestXMen97Seed] cards: ${cards}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[finestXMen97Seed] cards error: ${message}`);
  }

  console.log(`[finestXMen97Seed] done version=${SEED_VERSION} setId=${setId}`);
}

/** Fire-and-forget. Safe to call more than once; only the first call per SEED_VERSION runs. */
export function startFinestXMen97Seed(): void {
  if (startedVersion === SEED_VERSION) {
    console.log(`[finestXMen97Seed] already started this process (${SEED_VERSION})`);
    return;
  }
  startedVersion = SEED_VERSION;
  setImmediate(() => {
    void seedFinestXMen97().catch((err) => {
      console.error("[finestXMen97Seed] fatal", err);
    });
  });
}
