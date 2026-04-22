/**
 * MCU Spotlight - Actor of the Day / Character Spotlight
 * 3 rotating round-robin templates (A → B → C → A → B → C)
 * Cross-references actors → characters → trading cards with chase card sections
 * Orange placeholder images with numbered labels and dimensions
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Star, Film, CreditCard, Sparkles, ChevronRight, Calendar,
  ArrowRight, Zap, Crown, Users, Eye, ExternalLink, Clapperboard,
  Trophy, Flame, TrendingUp, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

// ── Types ──────────────────────────────────────────────────────────────────
interface SpotlightEntry {
  id: number;
  actorName: string;
  characterName: string;
  cardName: string; // How the character appears on trading cards
  realName?: string; // Character's real name (e.g., "Matt Murdock")
  seriesOrMovie: string;
  releaseDate?: string;
  bio: string; // Short actor/character description
  mcuDebut?: string; // First MCU appearance
  upcomingAppearances: string[]; // Upcoming movies/shows
  chaseCards: ChaseCard[];
  /** Images — orange placeholders with dimensions shown until replaced */
  image1Url: string; // Actor/character hero image
  image2Url: string; // Scene or action shot
  image3Url: string; // Card showcase image
  characterSlug?: string; // Links to /characters/:slug
  articleSlug?: string; // Links to /mcu-news/:slug
  templateIndex: number; // 0, 1, or 2 for round-robin
}

interface ChaseCard {
  cardName: string;
  setName: string;
  cardNumber: string;
  parallel?: string;
  estimatedValue?: string;
  imageUrl?: string;
  cardSlug?: string; // Links to /cards/:setSlug/:cardNumber
}

// ── Placeholder Image Component ────────────────────────────────────────────
function PlaceholderImage({
  number,
  width,
  height,
  className = "",
}: {
  number: 1 | 2 | 3;
  width: string;
  height: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center bg-orange-500 border-2 border-orange-400 rounded-lg overflow-hidden ${className}`}
    >
      <div className="text-center p-4">
        <div className="text-5xl font-black text-white/90 mb-2">{number}</div>
        <div className="text-sm font-bold text-white/80 tracking-wide uppercase">
          Placeholder {number}
        </div>
        <div className="text-xs text-white/60 mt-1 font-mono">
          {width} × {height}
        </div>
      </div>
      {/* Corner dimension labels */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-white/50 bg-black/30 px-1.5 py-0.5 rounded">
        {width}w
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-white/50 bg-black/30 px-1.5 py-0.5 rounded">
        {height}h
      </div>
    </div>
  );
}

// Renders an image or a placeholder if the URL contains "placeholder"
function SpotlightImage({
  url,
  number,
  width,
  height,
  alt,
  className = "",
}: {
  url: string;
  number: 1 | 2 | 3;
  width: string;
  height: string;
  alt: string;
  className?: string;
}) {
  const isPlaceholder = !url || url.includes("placeholder");
  if (isPlaceholder) {
    return <PlaceholderImage number={number} width={width} height={height} className={className} />;
  }
  return (
    <img
      src={url}
      alt={alt}
      className={`object-cover rounded-lg ${className}`}
      loading="lazy"
    />
  );
}

// ── Static Spotlight Data (seeded, will be replaced by DB later) ──────────
const SPOTLIGHT_ENTRIES: SpotlightEntry[] = [
  {
    id: 1,
    actorName: "Charlie Cox",
    characterName: "Daredevil",
    cardName: "DAREDEVIL",
    realName: "Matt Murdock",
    seriesOrMovie: "Daredevil: Born Again Season 2",
    releaseDate: "March 24, 2026",
    bio: "Charlie Cox has redefined the Man Without Fear across Netflix and Disney+. His portrayal of blind attorney Matt Murdock — who fights crime as Daredevil in Hell's Kitchen — has become one of the most acclaimed performances in the MCU. Born Again Season 2 continues the story with 9 episodes of gritty, street-level action.",
    mcuDebut: "Daredevil (Netflix, 2015)",
    upcomingAppearances: [
      "Daredevil: Born Again Season 2 (Airing Now)",
      "Spider-Man: Brand New Day (July 31, 2026)",
      "Avengers: Doomsday (December 18, 2026)",
    ],
    chaseCards: [
      { cardName: "DAREDEVIL", setName: "2025 Topps Chrome", cardNumber: "42", parallel: "Gold Refractor /50", estimatedValue: "$45-75", cardSlug: "2025-topps-chrome/42" },
      { cardName: "DAREDEVIL", setName: "2025 Topps Sapphire", cardNumber: "42", parallel: "Blue Refractor", estimatedValue: "$25-40", cardSlug: "2025-topps-sapphire/42" },
      { cardName: "DAREDEVIL", setName: "2025 Topps Mint", cardNumber: "42", parallel: "Green Foil", estimatedValue: "$15-25" },
    ],
    image1Url: "placeholder",
    image2Url: "placeholder",
    image3Url: "placeholder",
    characterSlug: "daredevil",
    articleSlug: undefined,
    templateIndex: 0,
  },
  {
    id: 2,
    actorName: "Robert Downey Jr.",
    characterName: "Doctor Doom",
    cardName: "DOCTOR DOOM",
    realName: "Victor Von Doom",
    seriesOrMovie: "Avengers: Doomsday",
    releaseDate: "December 18, 2026",
    bio: "Robert Downey Jr. shocked the world at San Diego Comic-Con when he was revealed as Doctor Doom — not returning as Tony Stark, but as the MCU's most terrifying new villain. The Russo Brothers are directing, and early CinemaCon footage shows Doom stopping Stormbreaker with his bare hand. This is the most anticipated MCU casting since the original Iron Man.",
    mcuDebut: "Iron Man (2008) as Tony Stark",
    upcomingAppearances: [
      "Avengers: Doomsday (December 18, 2026)",
      "Avengers: Secret Wars (December 17, 2027)",
    ],
    chaseCards: [
      { cardName: "DOCTOR DOOM", setName: "2025 Topps Chrome", cardNumber: "1", parallel: "Superfractor 1/1", estimatedValue: "$500+", cardSlug: "2025-topps-chrome/1" },
      { cardName: "DOCTOR DOOM", setName: "2025 Topps Chrome", cardNumber: "1", parallel: "Gold Refractor /50", estimatedValue: "$75-150", cardSlug: "2025-topps-chrome/1" },
      { cardName: "DOCTOR DOOM", setName: "2025 Topps Sapphire", cardNumber: "1", parallel: "Red Refractor /5", estimatedValue: "$200-350" },
    ],
    image1Url: "placeholder",
    image2Url: "placeholder",
    image3Url: "placeholder",
    characterSlug: "doctor-doom",
    articleSlug: "doctor-doom-stops-stormbreaker-6-jaw-dropping-doomsday-trailer-moments",
    templateIndex: 1,
  },
  {
    id: 3,
    actorName: "Tom Holland",
    characterName: "Spider-Man",
    cardName: "SPIDER-MAN",
    realName: "Peter Parker",
    seriesOrMovie: "Spider-Man: Brand New Day",
    releaseDate: "July 31, 2026",
    bio: "Tom Holland returns as Peter Parker in Brand New Day, set four years after No Way Home erased him from everyone's memory. Now a full-time Spider-Man with no civilian life, Peter faces a physical evolution that threatens his very existence. Directed by Destin Daniel Cretton (Shang-Chi), the film also features Jon Bernthal's Punisher, Mark Ruffalo's Hulk, and the return of Zendaya and Jacob Batalon.",
    mcuDebut: "Captain America: Civil War (2016)",
    upcomingAppearances: [
      "Spider-Man: Brand New Day (July 31, 2026)",
      "Avengers: Doomsday (December 18, 2026)",
      "Avengers: Secret Wars (December 17, 2027)",
    ],
    chaseCards: [
      { cardName: "SPIDER-MAN", setName: "2025 Topps Chrome", cardNumber: "50", parallel: "Superfractor 1/1", estimatedValue: "$400+", cardSlug: "2025-topps-chrome/50" },
      { cardName: "SPIDER-MAN", setName: "2025 Topps Chrome", cardNumber: "50", parallel: "Gold Refractor /50", estimatedValue: "$60-100", cardSlug: "2025-topps-chrome/50" },
      { cardName: "SPIDER-MAN", setName: "2025 Topps Sapphire", cardNumber: "50", parallel: "Blue Refractor", estimatedValue: "$30-50" },
    ],
    image1Url: "placeholder",
    image2Url: "placeholder",
    image3Url: "placeholder",
    characterSlug: "spider-man",
    articleSlug: undefined,
    templateIndex: 2,
  },
];

// ── Template A: Actor Left, Character/Card Info Right, Chase Below ─────────
function TemplateA({ entry }: { entry: SpotlightEntry }) {
  return (
    <div className="space-y-8">
      {/* Hero Section: Actor left, Info right */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: Actor Image */}
        <div className="space-y-4">
          <SpotlightImage
            url={entry.image1Url}
            number={1}
            width="600"
            height="750"
            alt={`${entry.actorName} as ${entry.characterName}`}
            className="w-full aspect-[4/5]"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clapperboard className="w-4 h-4" />
            <span>MCU Debut: {entry.mcuDebut || "TBA"}</span>
          </div>
        </div>

        {/* Right: Character Info */}
        <div className="space-y-6">
          <div>
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">
              <Star className="w-3 h-3 mr-1" /> TODAY'S SPOTLIGHT
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
              {entry.actorName}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl text-primary font-bold">as</span>
              <span className="text-2xl font-bold text-foreground">
                {entry.characterName}
              </span>
              {entry.realName && (
                <span className="text-muted-foreground text-lg">
                  ({entry.realName})
                </span>
              )}
            </div>
          </div>

          {/* Card Name Cross-Reference */}
          <div className="bg-card/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">
                Card Name
              </span>
            </div>
            <p className="text-2xl font-black text-foreground tracking-wide">
              {entry.cardName}
            </p>
            {entry.characterSlug && (
              <Link
                href={`/characters/${entry.characterSlug}`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
              >
                View all {entry.cardName} cards <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {/* Bio */}
          <p className="text-muted-foreground leading-relaxed">{entry.bio}</p>

          {/* Series/Movie Badge */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Film className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase">
                Featured In
              </span>
            </div>
            <p className="text-lg font-bold text-foreground">{entry.seriesOrMovie}</p>
            {entry.releaseDate && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" /> {entry.releaseDate}
              </p>
            )}
          </div>

          {/* Upcoming Appearances */}
          {entry.upcomingAppearances.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Upcoming MCU Appearances
              </h3>
              <div className="space-y-2">
                {entry.upcomingAppearances.map((app, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-foreground bg-card/30 border border-border/50 rounded-md px-3 py-2"
                  >
                    <Zap className="w-3 h-3 text-primary shrink-0" />
                    {app}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Shot */}
          <SpotlightImage
            url={entry.image2Url}
            number={2}
            width="600"
            height="340"
            alt={`${entry.characterName} action scene`}
            className="w-full aspect-[16/9]"
          />
        </div>
      </div>

      {/* Chase Cards Section */}
      <ChaseCardsSection entry={entry} />
    </div>
  );
}

// ── Template B: Full-Width Hero Banner, Bio Below, Chase Grid ──────────────
function TemplateB({ entry }: { entry: SpotlightEntry }) {
  return (
    <div className="space-y-8">
      {/* Full-Width Hero Banner */}
      <div className="relative">
        <SpotlightImage
          url={entry.image1Url}
          number={1}
          width="1200"
          height="500"
          alt={`${entry.actorName} as ${entry.characterName}`}
          className="w-full aspect-[12/5]"
        />
        {/* Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6 sm:p-8">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3">
            <Crown className="w-3 h-3 mr-1" /> MCU SPOTLIGHT
          </Badge>
          <h2 className="text-4xl sm:text-6xl font-black text-foreground leading-tight">
            {entry.characterName}
          </h2>
          <p className="text-xl text-muted-foreground mt-1">
            Portrayed by <span className="text-foreground font-bold">{entry.actorName}</span>
            {entry.realName && <> &middot; {entry.realName}</>}
          </p>
        </div>
      </div>

      {/* Two-Column: Bio + Card Info */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2/3: Bio + Appearances */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Name Cross-Reference */}
          <div className="flex items-center gap-4 bg-card/50 border border-border rounded-lg p-4">
            <CreditCard className="w-8 h-8 text-primary shrink-0" />
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Trading Card Name
              </span>
              <p className="text-2xl font-black text-foreground">{entry.cardName}</p>
            </div>
            {entry.characterSlug && (
              <Link
                href={`/characters/${entry.characterSlug}`}
                className="ml-auto text-primary hover:text-primary/80"
              >
                <ExternalLink className="w-5 h-5" />
              </Link>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed text-lg">{entry.bio}</p>

          {/* Featured Series */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <Film className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-amber-400 uppercase">Now Featuring</span>
            </div>
            <p className="text-xl font-bold text-foreground">{entry.seriesOrMovie}</p>
            {entry.releaseDate && (
              <p className="text-sm text-muted-foreground mt-1">
                <Calendar className="w-3 h-3 inline mr-1" />{entry.releaseDate}
              </p>
            )}
          </div>

          {/* Upcoming */}
          {entry.upcomingAppearances.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Where You'll See Them Next
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {entry.upcomingAppearances.map((app, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm bg-card/30 border border-border/50 rounded-md px-3 py-2.5"
                  >
                    <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-foreground">{app}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1/3: Scene Image + MCU Debut */}
        <div className="space-y-4">
          <SpotlightImage
            url={entry.image2Url}
            number={2}
            width="400"
            height="500"
            alt={`${entry.characterName} scene`}
            className="w-full aspect-[4/5]"
          />
          <div className="bg-card/50 border border-border rounded-lg p-4 text-center">
            <Clapperboard className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <span className="text-xs font-bold text-muted-foreground uppercase">MCU Debut</span>
            <p className="text-sm font-bold text-foreground mt-1">{entry.mcuDebut || "TBA"}</p>
          </div>
        </div>
      </div>

      {/* Chase Cards Section */}
      <ChaseCardsSection entry={entry} variant="grid" />
    </div>
  );
}

// ── Template C: Split Diagonal, Cards Prominent, Actor/Series Info ─────────
function TemplateC({ entry }: { entry: SpotlightEntry }) {
  return (
    <div className="space-y-8">
      {/* Split Header: Image Left + Info Right with diagonal energy */}
      <div className="relative bg-gradient-to-br from-card via-card/50 to-background border border-border rounded-xl overflow-hidden">
        <div className="grid lg:grid-cols-5 gap-0">
          {/* Left 2/5: Image */}
          <div className="lg:col-span-2 relative">
            <SpotlightImage
              url={entry.image1Url}
              number={1}
              width="480"
              height="600"
              alt={`${entry.actorName} as ${entry.characterName}`}
              className="w-full aspect-[4/5] lg:rounded-none rounded-t-xl lg:rounded-l-xl"
            />
            {/* Diagonal overlay on desktop */}
            <div className="hidden lg:block absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-card to-transparent" />
          </div>

          {/* Right 3/5: Info */}
          <div className="lg:col-span-3 p-6 sm:p-8 flex flex-col justify-center space-y-5">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 w-fit">
              <Eye className="w-3 h-3 mr-1" /> CHARACTER SPOTLIGHT
            </Badge>

            <div>
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
                {entry.actorName} is
              </p>
              <h2 className="text-5xl sm:text-6xl font-black text-foreground leading-none mt-1">
                {entry.characterName}
              </h2>
              {entry.realName && (
                <p className="text-lg text-muted-foreground mt-1">
                  A.K.A. {entry.realName}
                </p>
              )}
            </div>

            {/* Card Name — Prominent */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Find on Cards As
                </span>
                <p className="text-xl font-black text-foreground">{entry.cardName}</p>
              </div>
              {entry.characterSlug && (
                <Link
                  href={`/characters/${entry.characterSlug}`}
                  className="ml-auto"
                >
                  <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                    View Cards <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{entry.bio}</p>

            {/* Series Badge */}
            <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 rounded-lg px-4 py-3">
              <Film className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <p className="font-bold text-foreground">{entry.seriesOrMovie}</p>
                {entry.releaseDate && (
                  <p className="text-xs text-muted-foreground">{entry.releaseDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Scene Image + Upcoming Appearances side by side */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SpotlightImage
          url={entry.image2Url}
          number={2}
          width="600"
          height="400"
          alt={`${entry.characterName} scene`}
          className="w-full aspect-[3/2]"
        />
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4" /> MCU Timeline
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm bg-card/30 border border-border/50 rounded-md px-3 py-2.5">
              <Clapperboard className="w-3 h-3 text-purple-400 shrink-0" />
              <span className="text-muted-foreground">Debut:</span>
              <span className="text-foreground font-medium">{entry.mcuDebut || "TBA"}</span>
            </div>
            {entry.upcomingAppearances.map((app, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm bg-card/30 border border-border/50 rounded-md px-3 py-2.5"
              >
                <Zap className="w-3 h-3 text-purple-400 shrink-0" />
                <span className="text-foreground">{app}</span>
              </div>
            ))}
          </div>
          {entry.articleSlug && (
            <Link href={`/mcu-news/${entry.articleSlug}`}>
              <Button variant="outline" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 mt-2">
                Read Full Article <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Chase Cards — Card-Prominent Layout */}
      <ChaseCardsSection entry={entry} variant="prominent" />
    </div>
  );
}

// ── Chase Cards Section (shared across templates) ──────────────────────────
function ChaseCardsSection({
  entry,
  variant = "list",
}: {
  entry: SpotlightEntry;
  variant?: "list" | "grid" | "prominent";
}) {
  if (entry.chaseCards.length === 0) return null;

  return (
    <div className="bg-gradient-to-b from-card/80 to-card/30 border border-border rounded-xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-black text-foreground">
            Chase Cards for {entry.cardName}
          </h3>
          <p className="text-sm text-muted-foreground">
            The hottest cards to hunt for this character
          </p>
        </div>
      </div>

      {/* Card Showcase Image */}
      <div className="mb-6">
        <SpotlightImage
          url={entry.image3Url}
          number={3}
          width="1100"
          height="300"
          alt={`${entry.cardName} chase cards showcase`}
          className="w-full aspect-[11/3]"
        />
      </div>

      {variant === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entry.chaseCards.map((card, i) => (
            <ChaseCardItem key={i} card={card} index={i} />
          ))}
        </div>
      ) : variant === "prominent" ? (
        <div className="space-y-3">
          {entry.chaseCards.map((card, i) => (
            <ChaseCardItemWide key={i} card={card} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {entry.chaseCards.map((card, i) => (
            <ChaseCardItem key={i} card={card} index={i} />
          ))}
        </div>
      )}

      {entry.characterSlug && (
        <div className="mt-6 text-center">
          <Link href={`/characters/${entry.characterSlug}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              View All {entry.cardName} Cards in Database
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function ChaseCardItem({ card, index }: { card: ChaseCard; index: number }) {
  const tierColors = [
    "border-amber-500/40 bg-amber-500/5",
    "border-primary/40 bg-primary/5",
    "border-purple-500/40 bg-purple-500/5",
  ];
  const tierIcons = [
    <Flame className="w-4 h-4 text-amber-400" />,
    <TrendingUp className="w-4 h-4 text-primary" />,
    <Sparkles className="w-4 h-4 text-purple-400" />,
  ];

  const content = (
    <div
      className={`border rounded-lg p-4 ${tierColors[index % 3]} hover:scale-[1.02] transition-transform cursor-pointer`}
    >
      <div className="flex items-center gap-2 mb-2">
        {tierIcons[index % 3]}
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {card.setName}
        </span>
      </div>
      <p className="font-bold text-foreground">{card.cardName} #{card.cardNumber}</p>
      {card.parallel && (
        <p className="text-sm text-primary font-medium mt-1">{card.parallel}</p>
      )}
      {card.estimatedValue && (
        <p className="text-sm text-muted-foreground mt-2">
          Est. Value: <span className="text-foreground font-bold">{card.estimatedValue}</span>
        </p>
      )}
    </div>
  );

  if (card.cardSlug) {
    return <Link href={`/cards/${card.cardSlug}`}>{content}</Link>;
  }
  return content;
}

function ChaseCardItemWide({ card, index }: { card: ChaseCard; index: number }) {
  const tierColors = [
    "border-l-amber-500 bg-amber-500/5",
    "border-l-primary bg-primary/5",
    "border-l-purple-500 bg-purple-500/5",
  ];

  const content = (
    <div
      className={`border border-border rounded-lg p-4 border-l-4 ${tierColors[index % 3]} hover:bg-card/50 transition-colors cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-foreground">
            {card.cardName} #{card.cardNumber}
          </p>
          <p className="text-sm text-muted-foreground">{card.setName}</p>
          {card.parallel && (
            <p className="text-sm text-primary font-medium mt-0.5">{card.parallel}</p>
          )}
        </div>
        {card.estimatedValue && (
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Est. Value</span>
            <p className="text-lg font-black text-foreground">{card.estimatedValue}</p>
          </div>
        )}
      </div>
    </div>
  );

  if (card.cardSlug) {
    return <Link href={`/cards/${card.cardSlug}`}>{content}</Link>;
  }
  return content;
}

// ── Main Page Component ────────────────────────────────────────────────────
export default function MCUSpotlight() {
  // For now, rotate through static entries. Later this will be DB-driven.
  const [currentIndex, setCurrentIndex] = useState(0);
  const entry = SPOTLIGHT_ENTRIES[currentIndex];
  const templateIndex = entry.templateIndex % 3;

  // Determine which template to render
  const renderTemplate = () => {
    switch (templateIndex) {
      case 0:
        return <TemplateA entry={entry} />;
      case 1:
        return <TemplateB entry={entry} />;
      case 2:
        return <TemplateC entry={entry} />;
      default:
        return <TemplateA entry={entry} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="MCU Spotlight — Actor of the Day"
        description="Daily MCU actor and character spotlights with trading card cross-references, chase card picks, and upcoming appearance schedules. Your collector's guide to the Marvel Cinematic Universe."
        path="/mcu-spotlight"
        type="article"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "MCU Spotlight", url: "/mcu-spotlight" },
        ])}
      />

      {/* Page Header */}
      <section className="border-b border-border bg-gradient-to-b from-card/50 to-background">
        <div className="container py-8 sm:py-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">MCU Spotlight</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  DAILY FEATURE
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground">
                MCU Spotlight
              </h1>
              <p className="text-muted-foreground mt-1 max-w-xl">
                Actor of the Day — cross-referenced with their Marvel trading cards.
                Every spotlight features chase cards to hunt and upcoming MCU appearances.
              </p>
            </div>

            {/* Spotlight Selector */}
            <div className="flex gap-2">
              {SPOTLIGHT_ENTRIES.map((e, i) => (
                <button
                  key={e.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    i === currentIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {e.characterName}
                </button>
              ))}
            </div>
          </div>

          {/* Template indicator */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Template:</span>
            {["A", "B", "C"].map((t, i) => (
              <span
                key={t}
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                  i === templateIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight Content */}
      <section className="container py-8 sm:py-12">
        {renderTemplate()}
      </section>

      {/* All Spotlights Preview */}
      <section className="border-t border-border bg-card/30">
        <div className="container py-8 sm:py-12">
          <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            All Spotlights
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPOTLIGHT_ENTRIES.map((e, i) => (
              <button
                key={e.id}
                onClick={() => {
                  setCurrentIndex(i);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`text-left border rounded-xl p-5 transition-all hover:scale-[1.02] ${
                  i === currentIndex
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card/50 hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-black">
                    {["A", "B", "C"][e.templateIndex % 3]}
                  </span>
                  <div>
                    <p className="font-bold text-foreground">{e.characterName}</p>
                    <p className="text-xs text-muted-foreground">{e.actorName}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{e.seriesOrMovie}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                  <CreditCard className="w-3 h-3" />
                  <span>{e.chaseCards.length} chase cards</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
