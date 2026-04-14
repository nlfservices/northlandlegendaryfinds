/**
 * Characters Index Page - Marvel Characters Hub
 * Sections: Doctor Doom Hero → Top 10 MCU → Team Rosters → Full Database
 * SEO-optimized with character card images, search, and alphabetical filtering
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Search, Users, ChevronRight, Layers, ArrowLeft, ArrowRight,
  Crown, Star, Shield, Swords, Zap, Flame, Skull
} from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const ALPHABET = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const PAGE_SIZE = 60;
const PLACEHOLDER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/character-placeholder-v2-CY48bnu9TGVPXs9qZJnG7S.webp";

// Static image overrides for characters without trading cards in the database
const CHARACTER_IMAGE_OVERRIDES: Record<string, string> = {
  "KANG": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/kang-character-3ikm66jFTWEESTn5mpNv6X.webp",
  "RED SKULL": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/red-skull-character-WZAUMsSGJp4nqcvHpwhX5L.webp",
};

function characterNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Featured Characters Data ──────────────────────────────────────────────
const TOP_10_MCU: { rank: number; name: string; tagline: string }[] = [
  { rank: 1, name: "DOCTOR DOOM", tagline: "The new face of the MCU. Robert Downey Jr. returns." },
  { rank: 2, name: "IRON MAN", tagline: "The one who started it all. Genius, billionaire, legend." },
  { rank: 3, name: "SPIDER-MAN", tagline: "Your friendly neighborhood wall-crawler." },
  { rank: 4, name: "CAPTAIN AMERICA", tagline: "The shield. The symbol. The soldier." },
  { rank: 5, name: "THOR", tagline: "God of Thunder. Worthy of Mjolnir." },
  { rank: 6, name: "WOLVERINE", tagline: "Adamantium claws. Unbreakable will." },
  { rank: 7, name: "THANOS", tagline: "The Mad Titan. Inevitable." },
  { rank: 8, name: "SCARLET WITCH", tagline: "Reality is whatever she wants it to be." },
  { rank: 9, name: "BLACK PANTHER", tagline: "Wakanda Forever." },
  { rank: 10, name: "DOCTOR STRANGE", tagline: "Sorcerer Supreme. Master of the Mystic Arts." },
];

interface TeamDef {
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
  members: string[];
}

const TEAMS: TeamDef[] = [
  {
    name: "Avengers",
    subtitle: "Earth's Mightiest Heroes",
    icon: <Shield className="w-5 h-5" />,
    accentColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    members: [
      "IRON MAN", "CAPTAIN AMERICA", "THOR", "HULK", "BLACK WIDOW",
      "HAWKEYE", "SCARLET WITCH", "VISION", "FALCON", "ANT-MAN",
      "CAPTAIN MARVEL", "SHE-HULK", "BLACK PANTHER", "DOCTOR STRANGE",
      "SPIDER-MAN", "WAR MACHINE",
    ],
  },
  {
    name: "X-Men",
    subtitle: "Mutants United",
    icon: <Zap className="w-5 h-5" />,
    accentColor: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    members: [
      "WOLVERINE", "STORM", "CYCLOPS", "JEAN GREY", "NIGHTCRAWLER",
      "COLOSSUS", "GAMBIT", "ANGEL", "BEAST", "ROGUE",
      "ICEMAN", "MAGNETO", "PSYLOCKE", "EMMA FROST",
    ],
  },
  {
    name: "Guardians of the Galaxy",
    subtitle: "A Bunch of A-Holes",
    icon: <Star className="w-5 h-5" />,
    accentColor: "text-orange-400",
    borderColor: "border-orange-500/30",
    members: [
      "STAR-LORD", "DRAX", "GAMORA", "GROOT", "ROCKET RACCOON",
      "MANTIS", "NEBULA", "ADAM WARLOCK",
    ],
  },
  {
    name: "Fantastic Four",
    subtitle: "Marvel's First Family",
    icon: <Flame className="w-5 h-5" />,
    accentColor: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    members: [
      "MISTER FANTASTIC", "INVISIBLE WOMAN", "HUMAN TORCH", "THE THING",
      "SILVER SURFER", "FRANKLIN RICHARDS",
    ],
  },
  {
    name: "Villains",
    subtitle: "Secret Wars Is Coming",
    icon: <Skull className="w-5 h-5" />,
    accentColor: "text-red-400",
    borderColor: "border-red-500/30",
    members: [
      "DOCTOR DOOM", "THANOS", "GALACTUS", "GREEN GOBLIN", "VENOM",
      "MAGNETO", "LOKI", "ULTRON", "KANG", "RED SKULL",
      "KINGPIN", "CARNAGE",
    ],
  },
  {
    name: "Thunderbolts*",
    subtitle: "Marvel's Anti-Heroes",
    icon: <Zap className="w-5 h-5" />,
    accentColor: "text-violet-400",
    borderColor: "border-violet-500/30",
    members: [
      "BUCKY BARNES", "YELENA BELOVA", "GHOST", "TASKMASTER",
      "RED GUARDIAN", "VALENTINA ALLEGRA DE FONTAINE",
    ],
  },
  {
    name: "Sinister Six",
    subtitle: "Spider-Man's Greatest Foes",
    icon: <Skull className="w-5 h-5" />,
    accentColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    members: [
      "GREEN GOBLIN", "DOCTOR OCTOPUS", "VULTURE", "ELECTRO",
      "SANDMAN", "MYSTERIO", "KRAVEN THE HUNTER", "RHINO", "SCORPION",
    ],
  },
  {
    name: "Young Avengers",
    subtitle: "The Next Generation",
    icon: <Star className="w-5 h-5" />,
    accentColor: "text-pink-400",
    borderColor: "border-pink-500/30",
    members: [
      "KATE BISHOP", "AMERICA CHAVEZ", "MS. MARVEL",
      "CASSIE LANG", "PATRIOT",
    ],
  },
];

// Collect ALL featured character names for the image query
const ALL_FEATURED_NAMES = Array.from(new Set([
  ...TOP_10_MCU.map(c => c.name),
  ...TEAMS.flatMap(t => t.members),
]));

// ── Character Card Component ──────────────────────────────────────────────
function CharacterCard({
  name,
  imageUrl,
  cardCount,
  subtitle,
  rank,
  size = "normal",
}: {
  name: string;
  imageUrl?: string;
  cardCount?: number;
  subtitle?: string;
  rank?: number;
  size?: "normal" | "large" | "hero";
}) {
  const slug = characterNameToSlug(name);
  const img = imageUrl || PLACEHOLDER_IMG;

  if (size === "hero") {
    return (
      <Link href={`/characters/${slug}`} className="block group">
        <div className="relative rounded-2xl overflow-hidden border-2 border-primary/40 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500">
          <div className="aspect-[3/4] relative">
            <img src={img} alt={name} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-primary-foreground font-bold text-sm px-3 py-1">
                <Crown className="w-4 h-4 mr-1" />
                #1 MCU
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                {name}
              </h3>
              {subtitle && (
                <p className="text-gray-300 text-lg">{subtitle}</p>
              )}
              {cardCount !== undefined && (
                <div className="flex items-center gap-1 mt-3 text-sm text-gray-400">
                  <Layers className="w-4 h-4" />
                  <span>{cardCount} cards in our database</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (size === "large") {
    return (
      <Link href={`/characters/${slug}`} className="block group">
        <div className="relative rounded-xl overflow-hidden border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10">
          <div className="aspect-[3/4] relative">
            <img src={img} alt={name} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            {rank !== undefined && (
              <div className="absolute top-3 left-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg">
                  {rank}
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
                {name}
              </h3>
              {subtitle && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{subtitle}</p>
              )}
              {cardCount !== undefined && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Layers className="w-3 h-3" />
                  <span>{cardCount} cards</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Normal size — compact card for grid
  return (
    <Link href={`/characters/${slug}`} className="block group">
      <div className="relative rounded-lg overflow-hidden border border-border/50 bg-card hover:border-primary/50 transition-all duration-300">
        <div className="aspect-[3/4] relative">
          <img src={img} alt={name} className="w-full h-full object-cover object-top" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
              {name}
            </h3>
            {cardCount !== undefined && (
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400">
                <Layers className="w-2.5 h-2.5" />
                <span>{cardCount} cards</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function Characters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [letterFilter, setLetterFilter] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // Fetch all characters for the database section
  const { data, isLoading } = trpc.public.marvel.allCharacters.useQuery(
    { limit: 2000, offset: 0 }
  );

  // Fetch images for featured characters
  const { data: featuredImages } = trpc.public.marvel.featuredCharacterImages.useQuery(
    { names: ALL_FEATURED_NAMES }
  );

  // Build a cardCount lookup from the full character list
  const cardCountMap = useMemo(() => {
    if (!data?.characters) return {};
    const map: Record<string, number> = {};
    for (const c of data.characters) {
      map[c.characterName.toUpperCase()] = c.cardCount;
    }
    return map;
  }, [data?.characters]);

  // Helper to get image for a character (check overrides first, then DB images, then placeholder)
  const getImg = (name: string) => CHARACTER_IMAGE_OVERRIDES[name] || featuredImages?.[name] || PLACEHOLDER_IMG;
  const getCount = (name: string) => cardCountMap[name.toUpperCase()] ?? 0;

  // Filter logic for the full database
  const filtered = useMemo(() => {
    if (!data?.characters) return [];
    let chars = data.characters;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      chars = chars.filter((c: any) => c.characterName.toLowerCase().includes(q));
    }

    if (letterFilter) {
      if (letterFilter === "#") {
        chars = chars.filter((c: any) => /^[^a-zA-Z]/.test(c.characterName));
      } else {
        chars = chars.filter((c: any) =>
          c.characterName.toUpperCase().startsWith(letterFilter)
        );
      }
    }

    return chars;
  }, [data?.characters, searchQuery, letterFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Marvel Characters - Complete Trading Card Character Database"
        description="Browse 880+ Marvel characters with detailed histories, powers, and trading card appearances. Featuring Doctor Doom, the Top 10 MCU characters, Avengers, X-Men, Guardians of the Galaxy, and more."
        path="/characters"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Characters", url: "/characters" },
        ])}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO: Doctor Doom Featured
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative border-b border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-background to-background" />
        <div className="container max-w-6xl relative py-10 lg:py-16">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Characters</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text */}
            <div>
              <Badge className="bg-primary/15 text-primary border-primary/30 mb-4 text-xs font-bold tracking-wider">
                <Crown className="w-3.5 h-3.5 mr-1" />
                AVENGERS: DOOMSDAY & SECRET WARS
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[0.95] mb-4">
                <span className="text-primary">MARVEL</span>
                <br />
                CHARACTERS
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-lg">
                {data?.total ?? "880+"} characters across every trading card set we carry.
                From Doctor Doom's rise to the Avengers assembling for Secret Wars — 
                explore the heroes, villains, and teams that define the Marvel Universe.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#top-10">
                  <Button variant="default" size="lg">
                    <Star className="w-4 h-4 mr-2" />
                    Top 10 MCU
                  </Button>
                </a>
                <a href="#teams">
                  <Button variant="outline" size="lg">
                    <Users className="w-4 h-4 mr-2" />
                    Browse Teams
                  </Button>
                </a>
                <a href="#database">
                  <Button variant="outline" size="lg">
                    <Search className="w-4 h-4 mr-2" />
                    Full Database
                  </Button>
                </a>
              </div>
            </div>

            {/* Right: Doctor Doom Hero Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm">
                <CharacterCard
                  name="DOCTOR DOOM"
                  imageUrl={getImg("DOCTOR DOOM")}
                  cardCount={getCount("DOCTOR DOOM")}
                  subtitle="The new face of the MCU. Robert Downey Jr. returns as Victor Von Doom."
                  size="hero"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — TOP 10 MCU CHARACTERS
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="top-10" className="py-16 lg:py-20">
        <div className="container max-w-6xl">
          <div className="text-center mb-10">
            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 mb-4 text-xs font-bold tracking-wider">
              <Crown className="w-3.5 h-3.5 mr-1" />
              NLF RANKINGS
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              TOP 10 MCU CHARACTERS
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our picks for the most impactful characters heading into Avengers: Doomsday and Secret Wars.
            </p>
          </div>

          {/* Top 3 — Large cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            {TOP_10_MCU.slice(0, 3).map((char) => (
              <CharacterCard
                key={char.name}
                name={char.name}
                imageUrl={getImg(char.name)}
                cardCount={getCount(char.name)}
                subtitle={char.tagline}
                rank={char.rank}
                size="large"
              />
            ))}
          </div>

          {/* 4-10 — Smaller grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {TOP_10_MCU.slice(3).map((char) => (
              <CharacterCard
                key={char.name}
                name={char.name}
                imageUrl={getImg(char.name)}
                cardCount={getCount(char.name)}
                rank={char.rank}
                size="large"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — TEAMS: Avengers Doomsday & Secret Wars
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="teams" className="py-16 lg:py-20 bg-card/30 border-y border-border/50">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="bg-red-500/15 text-red-400 border-red-500/30 mb-4 text-xs font-bold tracking-wider">
              <Swords className="w-3.5 h-3.5 mr-1" />
              ASSEMBLE
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              AVENGERS: DOOMSDAY &<br className="hidden sm:block" /> SECRET WARS
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The teams and factions heading into the biggest crossover event in Marvel history.
            </p>
          </div>

          <div className="space-y-16">
            {TEAMS.map((team) => (
              <div key={team.name}>
                {/* Team Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg bg-card border ${team.borderColor} flex items-center justify-center ${team.accentColor}`}>
                    {team.icon}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${team.accentColor}`}>
                      {team.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{team.subtitle}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline" className={`${team.borderColor} ${team.accentColor} text-xs`}>
                      {team.members.length} members
                    </Badge>
                  </div>
                </div>

                {/* Team Members Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {team.members.map((member) => (
                    <CharacterCard
                      key={`${team.name}-${member}`}
                      name={member}
                      imageUrl={getImg(member)}
                      cardCount={getCount(member)}
                      size="normal"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — FULL CHARACTER DATABASE
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="database" className="py-16 lg:py-20">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                FULL CHARACTER DATABASE
              </h2>
              <p className="text-muted-foreground">
                {data?.total ?? "..."} characters across all trading card sets
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Alphabet Filter */}
          <div className="border border-border/50 bg-card/30 rounded-lg mb-6 overflow-x-auto">
            <div className="flex gap-1 p-2 min-w-max">
              <Button
                variant={letterFilter === null ? "default" : "ghost"}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => { setLetterFilter(null); setPage(0); }}
              >
                All
              </Button>
              {ALPHABET.map((letter) => (
                <Button
                  key={letter}
                  variant={letterFilter === letter ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0 text-xs"
                  onClick={() => { setLetterFilter(letter); setPage(0); }}
                >
                  {letter}
                </Button>
              ))}
            </div>
          </div>

          {/* Characters Grid */}
          {isLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {Array.from({ length: 24 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Characters Found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? `No results for "${searchQuery}"` : "No characters match this filter."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {paged.map((char: any) => (
                  <CharacterCard
                    key={char.characterName}
                    name={char.characterName}
                    imageUrl={featuredImages?.[char.characterName]}
                    cardCount={char.cardCount}
                    size="normal"
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages} ({filtered.length} characters)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
