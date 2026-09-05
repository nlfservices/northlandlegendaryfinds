import { mediaUrl } from "../lib/mediaUrl";
/**
 * Trending Cards — "Marvel Cards to Collect Right Now"
 * Designed as both a site page and Facebook ad landing page.
 * Sections: Hero hook, trending characters, movie-driven picks,
 * beginner tips, and CTAs to shop/database/Whatnot.
 */

import { TrendingUp, Film, Star, Flame, ArrowRight, Zap, Target, BookOpen, ShoppingCart, Tv, Crown, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import SEO from "@/components/SEO";

// ===== CARD IMAGES =====
const DOOM_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-148_Doctor_Doom_52f7a61b.webp";
const SPIDER_MAN_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-101_Spider-Man_318857c1.webp";
const WOLVERINE_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-103_Wolverine_1cc49682.webp";
const GAMBIT_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-105_Gambit_4c11ff4d.webp";
const CAPTAIN_AMERICA_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_185_captain_america-koKKBbDfbETQNRvGxiM3Nh.webp";
const IRON_MAN_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/armored-hero-card-SdisyrpGhXuzM9QzK4oy8L.webp";
const MAGNETO_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_169_magneto-5NA8vtyhi9Bfkd6qG3pBzv.webp";
const FANTASTIC_FOUR_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-089_Mister_Fantastic_faeb8ea2.webp";
const THOR_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-119_Thor_56a124bc.webp";
const BLACK_PANTHER_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/black-panther-card-8p85njMmcGx6FSvhe3Txjb.webp";

const HERO_BG = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hero-collector-banner-VbjWsKXzVgGZ6irJXkBrQz.webp";

// ===== TRENDING DATA =====
interface TrendingCard {
  name: string;
  character: string;
  set: string;
  cardNumber: string;
  image: string;
  heatLevel: "BLAZING" | "HOT" | "RISING";
  reason: string;
  movieTie: string;
  slug: string;
  characterSlug: string;
}

const TRENDING_CARDS: TrendingCard[] = [
  {
    name: "Doctor Doom #148",
    character: "Doctor Doom",
    set: "2025 Topps Chrome",
    cardNumber: "148",
    image: DOOM_CARD,
    heatLevel: "BLAZING",
    reason: "Robert Downey Jr.'s return as Doctor Doom has sent this card into orbit. As the main villain of Avengers: Doomsday, demand is only going to increase as December gets closer.",
    movieTie: "Avengers: Doomsday (Dec 2026)",
    slug: "2025-topps-chrome/148",
    characterSlug: "doctor-doom",
  },
  {
    name: "Spider-Man #101",
    character: "Spider-Man",
    set: "2025 Topps Chrome",
    cardNumber: "101",
    image: SPIDER_MAN_CARD,
    heatLevel: "BLAZING",
    reason: "The Brand New Day trailer just dropped and the hype is massive. Tom Holland's fourth solo film hits theaters July 31 — Spider-Man cards are surging across the board.",
    movieTie: "Spider-Man: Brand New Day (Jul 2026)",
    slug: "2025-topps-chrome/101",
    characterSlug: "spider-man",
  },
  {
    name: "Wolverine #103",
    character: "Wolverine",
    set: "2025 Topps Chrome",
    cardNumber: "103",
    image: WOLVERINE_CARD,
    heatLevel: "HOT",
    reason: "Hugh Jackman is rumored to appear in Avengers: Doomsday. After Deadpool & Wolverine's massive box office, Wolverine cards remain one of the most sought-after in the hobby.",
    movieTie: "Avengers: Doomsday (Dec 2026)",
    slug: "2025-topps-chrome/103",
    characterSlug: "wolverine",
  },
  {
    name: "Gambit #105",
    character: "Gambit",
    set: "2025 Topps Chrome",
    cardNumber: "105",
    image: GAMBIT_CARD,
    heatLevel: "HOT",
    reason: "Channing Tatum's Gambit is confirmed for Doomsday with a more serious role. After his breakout in Deadpool & Wolverine, collectors are stacking Gambit cards before the next price spike.",
    movieTie: "Avengers: Doomsday (Dec 2026)",
    slug: "2025-topps-chrome/105",
    characterSlug: "gambit",
  },
  {
    name: "Captain America #185",
    character: "Captain America",
    set: "2025 Topps Chrome",
    cardNumber: "185",
    image: CAPTAIN_AMERICA_CARD,
    heatLevel: "RISING",
    reason: "Anthony Mackie's Sam Wilson is leading the Avengers in Doomsday. After Brave New World established him as the new Cap, his cards are steadily climbing.",
    movieTie: "Avengers: Doomsday (Dec 2026)",
    slug: "2025-topps-chrome/185",
    characterSlug: "captain-america",
  },
  {
    name: "Magneto #169",
    character: "Magneto",
    set: "2025 Topps Chrome",
    cardNumber: "169",
    image: MAGNETO_CARD,
    heatLevel: "RISING",
    reason: "Ian McKellen returns as Magneto in Doomsday and has revealed his character will destroy New Jersey in the film. X-Men nostalgia is driving serious collector interest.",
    movieTie: "Avengers: Doomsday (Dec 2026)",
    slug: "2025-topps-chrome/169",
    characterSlug: "magneto",
  },
];

const MOVIE_PICKS = [
  {
    movie: "Avengers: Doomsday",
    date: "December 18, 2026",
    dateUtc: "2026-12-18T00:00:00Z",
    icon: Flame,
    color: "green",
    description: "The biggest MCU event ever. Every character in this film will see card value increases as we get closer to release. Focus on Doctor Doom, the Fantastic Four, and X-Men cards.",
    topPicks: ["Doctor Doom #148", "Mister Fantastic #089", "Gambit #105", "Thor #119", "Magneto #169"],
    image: DOOM_CARD,
  },
  {
    movie: "Spider-Man: Brand New Day",
    date: "July 31, 2026",
    dateUtc: "2026-07-31T00:00:00Z",
    icon: Zap,
    color: "blue",
    description: "Tom Holland's fourth solo outing bridges Thunderbolts* and Doomsday. Spider-Man is always the most collected character in Marvel — and a new movie means a new wave of demand.",
    topPicks: ["Spider-Man #101", "Spider-Man Variants", "Venom cards", "Green Goblin cards"],
    image: SPIDER_MAN_CARD,
  },
];

const BEGINNER_TIPS = [
  {
    icon: Target,
    title: "Collect What You Love",
    description: "The best investment is a card you actually want to own. Start with your favorite characters — if you love Iron Man, collect Iron Man. Passion keeps you in the hobby when markets fluctuate.",
  },
  {
    icon: Crown,
    title: "Parallels & Numbered Cards",
    description: "Base cards are common. Parallels (refractors, gold, numbered /25 or /10) are where the real value lives. The lower the print run, the more valuable the card. A /1 is the holy grail.",
  },
  {
    icon: Shield,
    title: "Graded vs. Raw",
    description: "A PSA 10 or CGC 9.8 graded card can be worth 5-10x more than the same card ungraded. If you pull something special, consider getting it professionally graded.",
  },
  {
    icon: Film,
    title: "Follow the Movies",
    description: "Marvel card values are heavily tied to movie announcements. When a character gets a movie or show, their cards spike. Buy before the hype — sell into the excitement.",
  },
  {
    icon: BookOpen,
    title: "Know Your Sets",
    description: "2025 Topps Chrome is the flagship set. Comic Book Heroes and Mint offer different aesthetics. Sapphire is premium. Each set has different rarity tiers and chase cards.",
  },
  {
    icon: Sparkles,
    title: "First Appearances Matter",
    description: "A character's first card in a major set (like their Chrome debut) tends to hold value better than reprints. Look for debut cards of characters entering the MCU for the first time.",
  },
];

function HeatBadge({ level }: { level: "BLAZING" | "HOT" | "RISING" }) {
  const styles = {
    BLAZING: "bg-red-500/20 text-red-400 border-red-500/30",
    HOT: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    RISING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full border ${styles[level]}`}>
      <Flame className="w-3 h-3" />
      {level}
    </span>
  );
}

function MovieCountdownMini({ dateUtc }: { dateUtc: string }) {
  const { days, isLaunched } = useLaunchCountdown(dateUtc);
  if (isLaunched) return <span className="text-primary font-bold text-sm">NOW IN THEATERS</span>;
  return (
    <span className="text-sm text-muted-foreground">
      <strong className="text-white">{days}</strong> days away
    </span>
  );
}

export default function TrendingCards() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Marvel Cards to Collect Right Now — Trending Picks for 2026"
        description="Discover the hottest Marvel trading cards to collect in 2026. Movie-driven picks for Avengers: Doomsday and Spider-Man: Brand New Day, beginner tips, and expert recommendations."
        path="/trending"
        type="article"
      />

      {/* ===== HERO — LANDING PAGE HOOK ===== */}
      <section className="relative min-h-[500px] lg:min-h-[550px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 py-16 lg:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/15 border border-red-500/30 rounded-full mb-6">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-bold tracking-wide">UPDATED APRIL 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
              MARVEL CARDS TO{" "}
              <span className="text-primary">COLLECT</span>{" "}
              RIGHT NOW
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Two massive Marvel movies are coming in 2026. Here are the cards smart collectors are picking up <strong className="text-white">before the hype hits.</strong>
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#trending-cards">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold">
                  <Flame className="w-5 h-5 mr-2" />
                  See What's Trending
                </Button>
              </a>
              <Link href="/cards">
                <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                  Browse All 1,709+ Cards
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRENDING CARDS — THE MAIN LIST ===== */}
      <section id="trending-cards" className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide">HOTTEST PICKS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              TOP <span className="text-primary">TRENDING</span> CARDS
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              These are the cards generating the most buzz right now — driven by upcoming movies, trailer drops, and casting announcements.
            </p>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {TRENDING_CARDS.map((card, i) => (
              <div
                key={card.cardNumber}
                className="group relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                <div className={`grid grid-cols-1 ${i % 2 === 0 ? "md:grid-cols-[200px_1fr]" : "md:grid-cols-[1fr_200px]"} gap-0 items-center`}>
                  {/* Card Image */}
                  <div className={`relative p-6 flex justify-center ${i % 2 !== 0 ? "md:order-2" : ""}`}>
                    <div className="relative">
                      <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-xl group-hover:bg-primary/10 transition-all" />
                      <img
                        src={mediaUrl(card.image)}
                        alt={card.name}
                        className="relative w-36 sm:w-40 rounded-lg shadow-xl group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    {/* Rank badge */}
                    <div className="absolute top-3 left-3 w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center font-bold text-sm" style={{ fontFamily: "'Anton', sans-serif" }}>
                      {i + 1}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className={`p-6 ${i % 2 !== 0 ? "md:order-1" : ""}`}>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <HeatBadge level={card.heatLevel} />
                      <span className="text-xs text-muted-foreground">{card.set}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>
                      {card.character}
                    </h3>
                    <p className="text-sm text-primary/80 mb-3 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5" />
                      {card.movieTie}
                    </p>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {card.reason}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Link href={`/trending/${card.characterSlug}`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-black font-bold">
                          All {card.character} Cards
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                      <Link href={`/cards/${card.slug}`}>
                        <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                          View This Card
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MOVIE-DRIVEN COLLECTING ===== */}
      <section className="py-16 lg:py-20 bg-card/30">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full mb-4">
              <Film className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold tracking-wide">MOVIE CALENDAR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              COLLECT <span className="text-amber-400">BEFORE</span> THE MOVIES DROP
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Card values spike when movies release. Smart collectors buy early — here's what's coming and what to grab now.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {MOVIE_PICKS.map((movie) => {
              const Icon = movie.icon;
              const borderColor = movie.color === "green" ? "border-green-500/30 hover:border-green-500/50" : "border-blue-500/30 hover:border-blue-500/50";
              const accentColor = movie.color === "green" ? "text-green-400" : "text-blue-400";
              const bgGlow = movie.color === "green" ? "bg-green-500/5" : "bg-blue-500/5";

              return (
                <div key={movie.movie} className={`relative bg-card/60 backdrop-blur-sm border ${borderColor} rounded-2xl p-6 sm:p-8 overflow-hidden transition-all duration-300`}>
                  <div className={`absolute -top-16 -right-16 w-48 h-48 ${bgGlow} rounded-full blur-3xl`} />

                  <div className="relative z-10">
                    {/* Header with image */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 ${bgGlow} border ${borderColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${accentColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                          <span className={accentColor}>{movie.movie.split(":")[0]}:</span>{" "}
                          {movie.movie.split(":")[1]}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-muted-foreground">{movie.date}</span>
                          <span className="text-muted-foreground/30">|</span>
                          <MovieCountdownMini dateUtc={movie.dateUtc} />
                        </div>
                      </div>
                    </div>

                    {/* Card image */}
                    <div className="flex justify-center my-6">
                      <img
                        src={mediaUrl(movie.image)}
                        alt={movie.movie}
                        className="w-32 sm:w-36 rounded-lg shadow-xl"
                        loading="lazy"
                      />
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {movie.description}
                    </p>

                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-bold">Top Picks:</p>
                      <div className="flex flex-wrap gap-2">
                        {movie.topPicks.map((pick) => (
                          <span key={pick} className={`text-xs px-2.5 py-1 rounded-full border ${borderColor} ${accentColor} bg-black/30`}>
                            {pick}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHY THESE CARDS? — BEGINNER TIPS ===== */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/15 border border-purple-500/30 rounded-full mb-4">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-bold tracking-wide">COLLECTOR TIPS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHAT MAKES A CARD <span className="text-purple-400">VALUABLE?</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              New to collecting? Here's what experienced collectors look for — and how you can start smart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {BEGINNER_TIPS.map((tip) => {
              const Icon = tip.icon;
              return (
                <div key={tip.title} className="bg-card/40 border border-border/50 rounded-xl p-6 hover:border-purple-500/30 transition-all group">
                  <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                    {tip.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED CARDS GALLERY ===== */}
      <section className="py-16 lg:py-20 bg-card/30 overflow-hidden">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              MORE CARDS <span className="text-primary">WORTH WATCHING</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Beyond the top 6, these characters are generating buzz heading into the biggest MCU year ever.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { name: "Iron Man", image: IRON_MAN_CARD, reason: "MCU legacy icon" },
              { name: "Thor", image: THOR_CARD, reason: "Confirmed for Doomsday" },
              { name: "Mister Fantastic", image: FANTASTIC_FOUR_CARD, reason: "F4 debut year" },
              { name: "Black Panther", image: BLACK_PANTHER_CARD, reason: "Chadwick Boseman legacy" },
            ].map((card) => (
              <div key={card.name} className="group relative bg-card/50 border border-border/40 rounded-xl p-4 text-center hover:border-primary/30 transition-all">
                <div className="relative mb-3">
                  <img
                    src={mediaUrl(card.image)}
                    alt={card.name}
                    className="w-28 sm:w-32 mx-auto rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <h4 className="font-bold text-sm" style={{ fontFamily: "'Anton', sans-serif" }}>{card.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{card.reason}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/cards">
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                Explore All 1,709+ Cards
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA — SHOP & WHATNOT ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-background to-green-900/30" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              READY TO <span className="text-primary">START COLLECTING?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Every NLF repack includes guaranteed graded cards and hits. Watch us rip packs live on Whatnot, or grab a repack and open it yourself.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold w-full sm:w-auto">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Shop Repacks
                </Button>
              </Link>
              <Link href="/whatnot">
                <Button size="lg" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold w-full sm:w-auto">
                  <Tv className="w-5 h-5 mr-2" />
                  Watch Live on Whatnot
                </Button>
              </Link>
              <Link href="/characters">
                <Button size="lg" variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 font-bold w-full sm:w-auto">
                  <Star className="w-5 h-5 mr-2" />
                  Explore Characters
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground/60">
              Free shipping on all orders &middot; Every repack includes guaranteed hits &middot; Full checklists published
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


