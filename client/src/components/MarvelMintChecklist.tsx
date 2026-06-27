/**
 * Marvel Mint Checklist & Odds Component
 * Full parallel breakdown and pull rates for 2025 Topps Marvel Mint
 * Data sourced from official Topps odds sheets
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Trophy, Target, Sparkles, Crown, Flame, 
  Pen, Scissors, Star, Zap
} from "lucide-react";

// ==================== ODDS DATA ====================

interface OddsRow {
  parallel: string;
  numbered?: string;
  ecomm: string;
  sdcc: string;
}

const BRONZE_ODDS: OddsRow[] = [
  { parallel: "Base Bronze", ecomm: "1:1", sdcc: "1:1" },
  { parallel: "Green Mint Foil", ecomm: "1:5", sdcc: "1:5" },
  { parallel: "Gold Foil", ecomm: "1:8", sdcc: "1:8" },
  { parallel: "Orange Foil", ecomm: "1:15", sdcc: "1:15" },
  { parallel: "Black Foil", ecomm: "1:36", sdcc: "1:36" },
  { parallel: "Red Foil", ecomm: "1:72", sdcc: "1:72" },
  { parallel: "Printing Plates (C/M/Y/K)", numbered: "/1 each", ecomm: "1:91", sdcc: "1:92" },
  { parallel: "Foilfractor", ecomm: "1:368", sdcc: "1:368" },
];

const SILVER_ODDS: OddsRow[] = [
  { parallel: "Base Silver", ecomm: "1:1", sdcc: "1:1" },
  { parallel: "Green Mint Foil", ecomm: "1:10", sdcc: "1:10" },
  { parallel: "Gold Foil", ecomm: "1:15", sdcc: "1:15" },
  { parallel: "Orange Foil", ecomm: "1:29", sdcc: "1:29" },
  { parallel: "Black Foil", ecomm: "1:72", sdcc: "1:72" },
  { parallel: "Red Foil", ecomm: "1:146", sdcc: "1:146" },
  { parallel: "Printing Plates (C/M/Y/K)", numbered: "/1 each", ecomm: "1:181", sdcc: "1:195" },
  { parallel: "Foilfractor", ecomm: "1:785", sdcc: "1:785" },
];

const GOLD_ODDS: OddsRow[] = [
  { parallel: "Base Gold", ecomm: "1:1", sdcc: "1:1" },
  { parallel: "Green Mint Foil", ecomm: "1:10", sdcc: "1:10" },
  { parallel: "Gold Foil", ecomm: "1:15", sdcc: "1:15" },
  { parallel: "Orange Foil", ecomm: "1:29", sdcc: "1:29" },
  { parallel: "Black Foil", ecomm: "1:72", sdcc: "1:72" },
  { parallel: "Red Foil", ecomm: "1:146", sdcc: "1:146" },
  { parallel: "Printing Plates (C/M/Y/K)", numbered: "/1 each", ecomm: "1:181", sdcc: "1:195" },
  { parallel: "Foilfractor", ecomm: "1:785", sdcc: "1:785" },
];

const PLATINUM_ODDS: OddsRow[] = [
  { parallel: "Base Platinum", ecomm: "1:10", sdcc: "1:10" },
  { parallel: "Black Shimmer Foil", ecomm: "1:83", sdcc: "1:9" },
  { parallel: "Foilfractor", ecomm: "1:225", sdcc: "1:223" },
  { parallel: "Printing Plates (C/M/Y/K)", numbered: "/1 each", ecomm: "1:36", sdcc: "1:36" },
  { parallel: "Black & Yellow Electric Dots Foil", ecomm: "1:180", sdcc: "1:180" },
  { parallel: "Red Foil", ecomm: "1:1,016", sdcc: "1:1,016" },
];

const CHROME_PLATINUM_ODDS: OddsRow[] = [
  { parallel: "Chrome Variation", ecomm: "1:90", sdcc: "1:90" },
  { parallel: "Black Refractor", numbered: "/10", ecomm: "1:180", sdcc: "1:180" },
  { parallel: "Red Refractor", numbered: "/5", ecomm: "1:1,016", sdcc: "1:1,016" },
  { parallel: "Superfractor", numbered: "/1", ecomm: "—", sdcc: "—" },
];

const CHROME_BRONZE_ODDS: OddsRow[] = [
  { parallel: "Chrome Variation", ecomm: "1:4", sdcc: "1:4" },
  { parallel: "Black Refractor", numbered: "/10", ecomm: "1:36", sdcc: "1:36" },
  { parallel: "Red Refractor", numbered: "/5", ecomm: "1:72", sdcc: "1:72" },
  { parallel: "Superfractor", numbered: "/1", ecomm: "1:368", sdcc: "1:368" },
];

const CHROME_SILVER_ODDS: OddsRow[] = [
  { parallel: "Chrome Variation", ecomm: "1:10", sdcc: "1:10" },
  { parallel: "Black Refractor", numbered: "/10", ecomm: "1:72", sdcc: "1:72" },
  { parallel: "Red Refractor", numbered: "/5", ecomm: "1:146", sdcc: "1:146" },
  { parallel: "Superfractor", numbered: "/1", ecomm: "1:785", sdcc: "1:785" },
];

const CHROME_GOLD_ODDS: OddsRow[] = [
  { parallel: "Chrome Variation", ecomm: "1:15", sdcc: "1:15" },
  { parallel: "Black Refractor", numbered: "/10", ecomm: "1:72", sdcc: "1:72" },
  { parallel: "Red Refractor", numbered: "/5", ecomm: "1:146", sdcc: "1:146" },
  { parallel: "Superfractor", numbered: "/1", ecomm: "1:785", sdcc: "1:785" },
];

const INSERTS_ODDS: OddsRow[] = [
  { parallel: "Gambit's Deck Chrome Playing Cards", ecomm: "1:4", sdcc: "1:4" },
  { parallel: "Gambit's Deck Superfractor", numbered: "/1", ecomm: "1:360", sdcc: "1:360" },
  { parallel: "Dr. Doom Comic Cuts", ecomm: "1:61", sdcc: "1:63" },
  { parallel: "Sketch Cards", ecomm: "1:26", sdcc: "1:27" },
  { parallel: "Chrome Autographs", ecomm: "1:24", sdcc: "1:24" },
  { parallel: "Chrome Auto Black Refractor", ecomm: "1:119", sdcc: "1:119" },
  { parallel: "Chrome Auto Red Refractor", ecomm: "1:240", sdcc: "1:240" },
  { parallel: "Chrome Auto Superfractor", numbered: "/1", ecomm: "1:1,439", sdcc: "1:1,439" },
  { parallel: "Cut Signature (Stan Lee)", ecomm: "1:15,701", sdcc: "—" },
];

const SDCC_EXCLUSIVE_ODDS: OddsRow[] = [
  { parallel: "SDCC Doctor Doom Chrome", ecomm: "—", sdcc: "1:17" },
  { parallel: "Black Lava Refractor", ecomm: "—", sdcc: "1:156" },
  { parallel: "Doom Green Lava Refractor", ecomm: "—", sdcc: "1:312" },
  { parallel: "Superfractor", numbered: "/1", ecomm: "—", sdcc: "1:1,560" },
];

// ==================== CHECKLIST DATA ====================

const BASE_BRONZE = [
  "Hercules", "Exodus", "Ultron", "Killmonger", "Cosmo the Spacedog",
  "Red Hulk", "Nova", "Starfox", "Madame Web", "Kate Bishop",
  "Odin", "Electro", "Ms. Marvel", "Ikaris", "Kingpin",
  "Emma Frost", "Ronan the Accuser", "Phantom Rider", "Hank Pym", "Bishop",
  "The Collector", "Iron Patriot", "Werewolf", "Kitty Pryde", "Black Knight",
  "M.O.D.O.K.", "Gladiator", "Cable", "Ironheart", "Cloak",
  "Dagger", "Drax", "Wonder Man", "Union Jack", "Agent Hill",
  "Sentry", "Heimdall", "Void", "Medusa", "Howard the Duck",
  "Ego", "Scorpion", "J. Jonah Jameson", "Angel", "Squirrel Girl",
  "The Prowler", "Muse", "America Chavez", "Mysterio", "Dracula"
];

const BASE_SILVER = [
  "Beast", "Quicksilver", "War Machine", "Agent Carter", "Ghost",
  "Black Cat", "Okoye", "Nightcrawler", "Monica Rambeau", "Winter Soldier",
  "Valkyrie", "Silver Surfer", "Mantis", "Pepper Potts", "Iron Fist",
  "Colossus", "Black Bolt", "Groot", "Green Goblin", "Iceman",
  "Ancient One", "She-Hulk", "Namor", "Silver Sable", "Doctor Octopus"
];

const BASE_GOLD = [
  "Nick Fury", "Thanos", "Moon Knight", "Ant-Man", "Loki",
  "Captain Marvel", "Mayor Luke Cage", "Ghost Rider", "Miles Morales", "Star-Lord",
  "Galactus", "Cyclops", "Wasp", "Captain America", "The Thing",
  "Ghost-Spider", "Scarlet Witch", "Gamora", "Hawkeye", "Elektra",
  "Mighty Thor", "Jean Grey", "Human Torch", "Rocket Raccoon", "Vision"
];

const BASE_PLATINUM = [
  "Spider-Man", "Wolverine", "Iron Man", "Captain America", "Thor",
  "Mister Fantastic", "Doctor Doom", "Rogue", "Hulk", "Doctor Strange",
  "Blade", "Storm", "Black Widow", "Venom", "Magneto",
  "Daredevil", "Professor X", "Invisible Woman", "Gambit", "Black Panther"
];

const AUTOGRAPH_SIGNERS = [
  "Jason Aaron", "Mark Bagley", "Mark Brooks", "Joshua Cassara", "Donny Cates",
  "Jonathan Hickman", "Adam Kubert", "Andy Kubert", "Craig Kyle", "Steve McNiven",
  "Frank Miller", "Ryan Ottley", "Ryan Stegman", "Zeb Wells", "Chris Yost"
];

const GAMBITS_DECK: Record<string, { rank: string; character: string }[]> = {
  Clubs: [
    { rank: "A", character: "Wolverine" }, { rank: "K", character: "Doctor Doom" },
    { rank: "Q", character: "Storm" }, { rank: "J", character: "Beast" },
    { rank: "10", character: "Thor" }, { rank: "9", character: "Hulk" },
    { rank: "8", character: "Loki" }, { rank: "7", character: "Venom" },
    { rank: "6", character: "War Machine" }, { rank: "5", character: "Kitty Pryde" },
    { rank: "4", character: "Invisible Woman" }, { rank: "3", character: "Quicksilver" },
    { rank: "2", character: "Jubilee" },
  ],
  Diamonds: [
    { rank: "A", character: "Magneto" }, { rank: "K", character: "Cyclops" },
    { rank: "Q", character: "Emma Frost" }, { rank: "J", character: "Cable" },
    { rank: "10", character: "Black Widow" }, { rank: "9", character: "Blade" },
    { rank: "8", character: "Scarlet Witch" }, { rank: "7", character: "Vision" },
    { rank: "6", character: "Psylocke" }, { rank: "5", character: "Iceman" },
    { rank: "4", character: "The Thing" }, { rank: "3", character: "Legion" },
    { rank: "2", character: "X-23" },
  ],
  Hearts: [
    { rank: "A", character: "Spider-Man" }, { rank: "K", character: "Professor X" },
    { rank: "Q", character: "Rogue" }, { rank: "J", character: "Bishop" },
    { rank: "10", character: "Iron Man" }, { rank: "9", character: "Doctor Strange" },
    { rank: "8", character: "Thanos" }, { rank: "7", character: "Ant-Man" },
    { rank: "6", character: "Phoenix" }, { rank: "5", character: "Angel" },
    { rank: "4", character: "Human Torch" }, { rank: "3", character: "Ghost Rider" },
    { rank: "2", character: "Sabretooth" },
  ],
  Spades: [
    { rank: "A", character: "Gambit" }, { rank: "K", character: "Black Panther" },
    { rank: "Q", character: "Jean Grey" }, { rank: "J", character: "Mystique" },
    { rank: "10", character: "Captain America" }, { rank: "9", character: "Silver Surfer" },
    { rank: "8", character: "Daredevil" }, { rank: "7", character: "Apocalypse" },
    { rank: "6", character: "Juggernaut" }, { rank: "5", character: "Colossus" },
    { rank: "4", character: "Mister Fantastic" }, { rank: "3", character: "Nightcrawler" },
    { rank: "2", character: "Captain Marvel" },
  ],
};

const SUIT_SYMBOLS: Record<string, string> = { Clubs: "\u2663", Diamonds: "\u2666", Hearts: "\u2665", Spades: "\u2660" };
const SUIT_COLORS: Record<string, string> = { Clubs: "text-emerald-400", Diamonds: "text-blue-400", Hearts: "text-red-400", Spades: "text-purple-400" };

// ==================== COMPONENTS ====================

function OddsTable({ rows, title, icon: Icon, accentColor }: { 
  rows: OddsRow[]; 
  title: string; 
  icon: React.ElementType;
  accentColor: string;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card/50">
      <div className={`px-4 py-3 border-b border-border bg-gradient-to-r ${accentColor}`}>
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="text-left p-3 font-semibold">Parallel</th>
              <th className="text-center p-3 font-semibold w-20">Numbered</th>
              <th className="text-center p-3 font-semibold w-24">Ecomm</th>
              <th className="text-center p-3 font-semibold w-24">SDCC</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className={`border-b border-border/30 ${idx % 2 === 0 ? '' : 'bg-muted/5'} hover:bg-muted/15 transition-colors`}>
                <td className="p-3 font-medium">{row.parallel}</td>
                <td className="p-3 text-center">
                  {row.numbered ? (
                    <Badge variant="outline" className="text-[10px] px-1.5">{row.numbered}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-3 text-center font-mono text-xs">{row.ecomm}</td>
                <td className="p-3 text-center font-mono text-xs">{row.sdcc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChecklistSection({ title, cards, startNum, accentColor, icon: Icon }: {
  title: string;
  cards: string[];
  startNum: number;
  accentColor: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card/50">
      <div className={`px-4 py-3 border-b border-border bg-gradient-to-r ${accentColor}`}>
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
          <Badge variant="secondary" className="text-[10px]">{cards.length} cards</Badge>
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
        {cards.map((name, idx) => (
          <div key={idx} className={`flex items-center gap-3 px-4 py-2 border-b border-border/20 hover:bg-muted/10 transition-colors`}>
            <span className="text-xs font-mono text-muted-foreground w-8 shrink-0">#{startNum + idx}</span>
            <span className="text-sm font-medium">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GambitsDeckSection() {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card/50">
      <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-purple-900/30 to-transparent">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Gambit's Deck — Double Sided Chrome Playing Cards
          <Badge variant="secondary" className="text-[10px]">52 cards</Badge>
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {Object.entries(GAMBITS_DECK).map(([suit, cards]) => (
          <div key={suit} className="rounded-lg border border-border/50 overflow-hidden">
            <div className="px-3 py-2 bg-muted/30 border-b border-border/30 flex items-center gap-2">
              <span className={`text-lg ${SUIT_COLORS[suit]}`}>{SUIT_SYMBOLS[suit]}</span>
              <span className="font-bold text-sm">{suit}</span>
            </div>
            <div className="divide-y divide-border/20">
              {cards.map((card) => (
                <div key={card.rank} className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/10">
                  <span className={`font-mono font-bold text-xs w-6 ${SUIT_COLORS[suit]}`}>{card.rank}</span>
                  <span className="text-sm">{card.character}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== MAIN EXPORT ====================

export default function MarvelMintChecklist() {
  const [oddsTab, setOddsTab] = useState("base");

  return (
    <div className="space-y-8">
      {/* Set Overview Banner */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-purple-900/10 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/15 border border-primary/30 shrink-0">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold">2025 Topps Marvel Mint</h2>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 text-[10px]">MOST HUNTED</Badge>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              Released exclusively at <strong>San Diego Comic-Con (SDCC) 2025</strong>, this is widely considered the best Marvel trading card set of 2025. 
              Featuring 120 base cards across four tiers (Bronze, Silver, Gold, Platinum), 52 Gambit's Deck chrome playing cards, 
              SDCC-exclusive Doctor Doom variants, Chrome Autographs from 15 legendary artists, and the ultra-rare Stan Lee Cut Signature.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border">
                <Star className="w-3 h-3 text-amber-400" /> 120 Base Cards (4 Tiers)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border">
                <Sparkles className="w-3 h-3 text-purple-400" /> 52 Gambit's Deck
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border">
                <Pen className="w-3 h-3 text-blue-400" /> 15 Chrome Autograph Signers
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border">
                <Scissors className="w-3 h-3 text-red-400" /> Stan Lee Cut Signature
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border">
                <Crown className="w-3 h-3 text-emerald-400" /> SDCC 2025 Exclusive
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="odds" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="odds" className="gap-1.5">
            <Target className="w-3.5 h-3.5" /> Pull Rates & Odds
          </TabsTrigger>
          <TabsTrigger value="checklist" className="gap-1.5">
            <Star className="w-3.5 h-3.5" /> Full Checklist
          </TabsTrigger>
          <TabsTrigger value="autographs" className="gap-1.5">
            <Pen className="w-3.5 h-3.5" /> Autographs & Hits
          </TabsTrigger>
        </TabsList>

        {/* ODDS TAB */}
        <TabsContent value="odds" className="mt-6 space-y-6">
          <div className="text-sm text-muted-foreground mb-4">
            <p>All odds are per pack (4 cards per pack, 8 packs per box). Two configurations available: <strong>Ecomm</strong> (online retail) and <strong>SDCC Exclusive</strong> (Comic-Con only).</p>
          </div>

          {/* Sub-tabs for odds categories */}
          <Tabs value={oddsTab} onValueChange={setOddsTab}>
            <TabsList className="flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="base" className="text-xs">Base Foils</TabsTrigger>
              <TabsTrigger value="chrome" className="text-xs">Chrome Variations</TabsTrigger>
              <TabsTrigger value="inserts" className="text-xs">Inserts & Hits</TabsTrigger>
              <TabsTrigger value="sdcc" className="text-xs">SDCC Exclusives</TabsTrigger>
            </TabsList>

            <TabsContent value="base" className="mt-4 space-y-4">
              <OddsTable rows={BRONZE_ODDS} title="Bronze Tier (Cards #1-50)" icon={Flame} accentColor="from-orange-900/30 to-transparent" />
              <OddsTable rows={SILVER_ODDS} title="Silver Tier (Cards #51-75)" icon={Star} accentColor="from-slate-700/30 to-transparent" />
              <OddsTable rows={GOLD_ODDS} title="Gold Tier (Cards #76-100)" icon={Crown} accentColor="from-yellow-900/30 to-transparent" />
              <OddsTable rows={PLATINUM_ODDS} title="Platinum Tier (Cards #101-120)" icon={Zap} accentColor="from-zinc-600/30 to-transparent" />
            </TabsContent>

            <TabsContent value="chrome" className="mt-4 space-y-4">
              <div className="text-sm text-muted-foreground mb-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                <strong>Chrome Variations</strong> are separate chromium versions of the base cards — the most sought-after parallels in the set. 
                The Platinum Chrome Black Refractor /10 is the crown jewel at 1:180 odds.
              </div>
              <OddsTable rows={CHROME_PLATINUM_ODDS} title="Chrome Platinum (Cards #101-120)" icon={Zap} accentColor="from-zinc-600/30 to-transparent" />
              <OddsTable rows={CHROME_GOLD_ODDS} title="Chrome Gold (Cards #76-100)" icon={Crown} accentColor="from-yellow-900/30 to-transparent" />
              <OddsTable rows={CHROME_SILVER_ODDS} title="Chrome Silver (Cards #51-75)" icon={Star} accentColor="from-slate-700/30 to-transparent" />
              <OddsTable rows={CHROME_BRONZE_ODDS} title="Chrome Bronze (Cards #1-50)" icon={Flame} accentColor="from-orange-900/30 to-transparent" />
            </TabsContent>

            <TabsContent value="inserts" className="mt-4 space-y-4">
              <OddsTable rows={INSERTS_ODDS} title="Inserts, Autographs & Premium Hits" icon={Sparkles} accentColor="from-purple-900/30 to-transparent" />
            </TabsContent>

            <TabsContent value="sdcc" className="mt-4 space-y-4">
              <div className="text-sm text-muted-foreground mb-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                <strong>SDCC Exclusive</strong> — These Doctor Doom chrome cards are only available in the San Diego Comic-Con exclusive boxes. 
                The Superfractor /1 is the ultimate chase card of the entire set.
              </div>
              <OddsTable rows={SDCC_EXCLUSIVE_ODDS} title="SDCC Exclusive Doctor Doom Chrome" icon={Crown} accentColor="from-red-900/30 to-transparent" />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* CHECKLIST TAB */}
        <TabsContent value="checklist" className="mt-6 space-y-6">
          <ChecklistSection title="Bronze Tier (Cards #1-50)" cards={BASE_BRONZE} startNum={1} accentColor="from-orange-900/30 to-transparent" icon={Flame} />
          <ChecklistSection title="Silver Tier (Cards #51-75)" cards={BASE_SILVER} startNum={51} accentColor="from-slate-700/30 to-transparent" icon={Star} />
          <ChecklistSection title="Gold Tier (Cards #76-100)" cards={BASE_GOLD} startNum={76} accentColor="from-yellow-900/30 to-transparent" icon={Crown} />
          <ChecklistSection title="Platinum Tier (Cards #101-120)" cards={BASE_PLATINUM} startNum={101} accentColor="from-zinc-600/30 to-transparent" icon={Zap} />
          <GambitsDeckSection />
        </TabsContent>

        {/* AUTOGRAPHS TAB */}
        <TabsContent value="checklist" className="mt-6 space-y-6">
          {/* This is intentionally under "autographs" value below */}
        </TabsContent>
        <TabsContent value="autographs" className="mt-6 space-y-6">
          <div className="rounded-xl border border-border overflow-hidden bg-card/50">
            <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-blue-900/30 to-transparent">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Pen className="w-4 h-4 text-blue-400" />
                Chrome Autograph Signers
                <Badge variant="secondary" className="text-[10px]">{AUTOGRAPH_SIGNERS.length} signers</Badge>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
              {AUTOGRAPH_SIGNERS.map((name) => (
                <div key={name} className="flex items-center gap-3 px-4 py-2.5 border-b border-border/20 hover:bg-muted/10 transition-colors">
                  <Pen className="w-3 h-3 text-blue-400 shrink-0" />
                  <span className="text-sm font-medium">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card/50">
            <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-red-900/30 to-transparent">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Scissors className="w-3.5 h-3.5 text-red-400" />
                Premium Hits
              </h3>
            </div>
            <div className="divide-y divide-border/20">
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/10">
                <div>
                  <p className="font-medium text-sm">Stan Lee Cut Signature</p>
                  <p className="text-xs text-muted-foreground">The ultimate chase — authentic Stan Lee autograph cut</p>
                </div>
                <Badge variant="outline" className="text-[10px] text-red-400 border-red-400/30">1:15,701</Badge>
              </div>
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/10">
                <div>
                  <p className="font-medium text-sm">Dr. Doom Comic Cuts</p>
                  <p className="text-xs text-muted-foreground">Authentic comic book panel cut cards</p>
                </div>
                <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-400/30">1:61</Badge>
              </div>
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/10">
                <div>
                  <p className="font-medium text-sm">Sketch Cards</p>
                  <p className="text-xs text-muted-foreground">One-of-one hand-drawn original art</p>
                </div>
                <Badge variant="outline" className="text-[10px] text-purple-400 border-purple-400/30">1:26</Badge>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
