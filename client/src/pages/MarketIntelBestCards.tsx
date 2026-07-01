/**
 * Market Intel - Field Guide Landing Page
 * "Best Topps Marvel Cards to Watch in 2025-2026" with verified odds data
 */

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ChevronRight, TrendingUp, Star, Zap, Target, Layers, Package, Sparkles } from "lucide-react";
import SEO, { breadcrumbJsonLd, faqJsonLd } from "@/components/SEO";

const FAQ_DATA = [
  {
    question: "What are the best Topps Marvel cards to collect in 2025-2026?",
    answer: "The top sets include 2025 Topps Marvel Mint (the king of the lineup), 2025 Topps Marvel Studios Chrome (the MCU Grail with 200 base cards and DEBUT medallions), 2026 Topps Chrome Marvel (just released July 1, 2026 with 200 base, 17 insert sets, and 15+ DEBUT characters), and 2026 Topps Finest Fantastic Four. The 'best' depends on your collecting goals — MCU fans prioritize Studios Chrome, comic purists love Comic Book Heroes, and chase-card hunters target Chrome for the deep parallel rainbow.",
  },
  {
    question: "What are the pull odds for 2026 Topps Chrome Marvel?",
    answer: "In Hobby boxes: Refractors are 1:2, Storm's Lightning 1:3, Spider-Web Refractor 1:19, Gold Refractor 1:148, Black Refractor 1:738, Red Refractor 1:1,475, and Superfractor 1:7,356. Value boxes have exclusive RayWave parallels (1:4 base), and Mega boxes have exclusive X-Fractors (1:4 base). Insert sets like Fanfare, Future Stars, and Marvel Icons are all 1:6 in Hobby.",
  },
  {
    question: "What Topps Marvel cards are most valuable?",
    answer: "Value follows structured scarcity: Superfractors (1/1), Red parallels (/5), Black parallels (/10), and autographs command the highest prices. In 2026 Chrome Marvel, the Cordially Invited Autographs (Kevin Feige, Aaron Judge) and Authentic Comic Book Artist Autographs (Frank Miller, Bill Sienkiewicz) are the top chase hits. Stan Lee & Steve Ditko relics and actual 1960s-90s comic page excerpts are also premium pulls.",
  },
  {
    question: "What's the difference between Hobby, Value, and Mega boxes?",
    answer: "Hobby boxes offer the deepest parallel rainbow including exclusive Storm's Lightning and Clawed Chrome parallels, plus Marvel Logofractors. Value boxes have exclusive RayWave Refractors in 7 colors. Mega boxes have exclusive X-Fractors in 7 colors. Each box type has unique parallels you can't get elsewhere, so serious collectors buy across all three formats.",
  },
];

const PRODUCTS = [
  {
    name: "2025 Topps Marvel Mint",
    focus: "Premium Coin Design",
    release: "2025",
    significance: "The undisputed king of the 2025 lineup. Mint brings Topps' established premium brand to Marvel with a distinctive coin-inspired metallic aesthetic. The Gambit Chrome Deck insert set alone has produced $2,000+ sales for Ace cards.",
    watchFor: "Gambit Chrome Deck Aces (1/1 potential), character-specific coin cards in low parallels, and the unique aesthetic that differentiates from all other Chrome products.",
    tier: "flagship",
  },
  {
    name: "2026 Topps Chrome Marvel",
    focus: "200-Card Base + 17 Inserts",
    release: "July 1, 2026",
    significance: "Just released — the most loaded Chrome Marvel product ever. 200-card base split into Characters I and II, with 15+ DEBUT cards (first-ever Topps appearances). Features 17 insert sets, celebrity autographs (Kevin Feige!), Stan Lee relics, and actual comic page excerpts from the 1960s-90s.",
    watchFor: "DEBUT characters (Dark Gwenpool, Doomasaur, Infernal Hulk), Cordially Invited Autographs (Feige, Aaron Judge), Frank Miller/Bill Sienkiewicz artist autos, Comic Excerpts Spider-Man relics, Quad Autographs (Doom/Surfer/Galactus/Namor).",
    tier: "flagship",
  },
  {
    name: "2025 Topps Marvel Studios Chrome",
    focus: "MCU Characters",
    release: "2025",
    significance: "The MCU Grail. The first-ever MCU-focused Topps trading card product with a 200-card base set arranged by MCU phase. Features DEBUT medallions marking each character's first-ever trading card. Deep parallel rainbow from unnumbered refractors down through /99 Snap Variations, /50, /25, /10, /5, and 1/1 SuperFractors.",
    watchFor: "DEBUT medallion cards, Reflections insert pairings (Iron Man/Doctor Doom R-5, Captain America/The Winter Soldier R-4), Avengers Shadowbox premium chase cards, key character cards in low-numbered parallels.",
    tier: "flagship",
  },
  {
    name: "2026 Topps Finest Fantastic Four",
    focus: "Team-Specific Premium",
    release: "2026",
    significance: "A rising star in the lineup — team-specific Finest product with premium aesthetics. Triple Autographs are the newest premium chase cards setting early market prices.",
    watchFor: "Triple Autographs (early sales setting the market), team-specific parallels, and premium Finest finish quality.",
    tier: "premium",
  },
  {
    name: "2024 Topps Chrome Marvel",
    focus: "The Foundation",
    release: "2024",
    significance: "The original Chrome Marvel product that established the parallel rainbow structure. Still the foundation of the Topps Marvel ecosystem and the benchmark all other sets are measured against.",
    watchFor: "Key character Superfractors, established secondary market with clear price history, and the baseline for understanding Chrome Marvel parallel values.",
    tier: "flagship",
  },
  {
    name: "2025 Topps Comic Book Heroes",
    focus: "Heritage / 1975 Anniversary",
    release: "2025",
    significance: "The sleeper set of 2025. While it flew under the radar at release, CBH has serious historical significance — it features many Topps rookie cards from the original comic book art era. The art reproduction quality is excellent and the checklist digs deep into Marvel's publishing history.",
    watchFor: "First-time Topps appearances of classic characters in comic book form, low entry price making it an undervalued gem, and long-term appreciation potential as collectors discover the rookie card significance.",
    tier: "heritage",
  },
  {
    name: "2025 Topps Brooklyn Collection Marvel",
    focus: "Ultra-Premium",
    release: "2025",
    significance: "The ultra-premium tier with high price point and limited production. Designed for collectors who want exclusivity and premium materials above all else.",
    watchFor: "Limited production numbers, premium on-card autographs, and ultra-premium parallel finishes.",
    tier: "premium",
  },
  {
    name: "2025 Topps Finest X-Men '97",
    focus: "Nostalgia / Animated Series",
    release: "2025",
    significance: "Character-specific release tied to the Disney+ animated series revival. Appeals to nostalgia collectors who grew up with the original X-Men animated series.",
    watchFor: "Nostalgia-driven demand from the animated series fanbase, character-specific parallels for classic X-Men roster.",
    tier: "character",
  },
];

// Verified 2026 Chrome Marvel odds data
const HOBBY_PARALLELS = [
  { name: "Refractor", odds: "1:2", color: "text-emerald-400" },
  { name: "Storm's Lightning", odds: "1:3", color: "text-blue-400", exclusive: true },
  { name: "Spider-Web Refractor", odds: "1:19", color: "text-red-400" },
  { name: "Pink Refractor", odds: "1:30", color: "text-pink-400" },
  { name: "Aqua Refractor", odds: "1:38", color: "text-cyan-400" },
  { name: "Blue Refractor", odds: "1:50", color: "text-blue-500" },
  { name: "Marvel Logofractor", odds: "1:57", color: "text-purple-400", exclusive: true },
  { name: "Hulk Green Lazer", odds: "1:75", color: "text-green-500" },
  { name: "Dazzler's Silver Rhythm", odds: "1:93", color: "text-gray-300" },
  { name: "Purple Shimmer", odds: "1:99", color: "text-purple-500" },
  { name: "Spider-Web Red/Blue", odds: "1:119", color: "text-red-500" },
  { name: "Gold Refractor", odds: "1:148", color: "text-yellow-400" },
  { name: "Gold Wave Refractor", odds: "1:148", color: "text-yellow-500" },
  { name: "Captain America's Star", odds: "1:180", color: "text-blue-300" },
  { name: "Human Torch", odds: "1:190", color: "text-orange-400" },
  { name: "Orange Refractor", odds: "1:295", color: "text-orange-500" },
  { name: "Black Refractor", odds: "1:738", color: "text-gray-400" },
  { name: "Red Refractor", odds: "1:1,475", color: "text-red-600" },
  { name: "Superfractor", odds: "1:7,356", color: "text-yellow-300" },
];

const CLAWED_CHROME = [
  { name: "Base Clawed Chrome", odds: "1:174", color: "text-gray-300" },
  { name: "Black Wolverine Adamantium", odds: "1:347", color: "text-gray-400" },
  { name: "Red Wolverine Adamantium", odds: "1:694", color: "text-red-500" },
  { name: "Clawed Chrome Superfractor", odds: "1:3,467", color: "text-yellow-300" },
];

const VALUE_BOX_PARALLELS = [
  { name: "RayWave Refractor", odds: "1:4", color: "text-cyan-400" },
  { name: "Green RayWave", odds: "1:155", color: "text-green-400" },
  { name: "Purple RayWave", odds: "1:204", color: "text-purple-400" },
  { name: "Gold RayWave", odds: "1:306", color: "text-yellow-400" },
  { name: "Orange RayWave", odds: "1:611", color: "text-orange-400" },
  { name: "Black RayWave", odds: "1:1,527", color: "text-gray-400" },
  { name: "Red RayWave", odds: "1:3,055", color: "text-red-500" },
];

const MEGA_BOX_PARALLELS = [
  { name: "X-Fractor", odds: "1:4", color: "text-blue-400" },
  { name: "Green X-Fractor", odds: "1:46", color: "text-green-400" },
  { name: "Purple X-Fractor", odds: "1:61", color: "text-purple-400" },
  { name: "Gold X-Fractor", odds: "1:91", color: "text-yellow-400" },
  { name: "Orange X-Fractor", odds: "1:181", color: "text-orange-400" },
  { name: "Black X-Fractor", odds: "1:451", color: "text-gray-400" },
  { name: "Red X-Fractor", odds: "1:901", color: "text-red-500" },
];

const INSERT_ODDS = [
  { name: "Fanfare", cards: 50, odds: "1:6" },
  { name: "Future Stars", cards: 20, odds: "1:6" },
  { name: "Marvel Icons", cards: 20, odds: "1:6" },
  { name: "Meanwhile...", cards: 20, odds: "1:6" },
  { name: "One World Under Doom", cards: 20, odds: "1:6" },
  { name: "The Beyond", cards: 20, odds: "1:6" },
  { name: "60 Years of Black Panther", cards: 10, odds: "Varies" },
  { name: "65 Fantastic Years", cards: 10, odds: "Varies" },
  { name: "Varied Visage AOA", cards: 11, odds: "Varies" },
  { name: "Classic Comic Book Covers", cards: 10, odds: "Varies" },
  { name: "Cordially Invited", cards: 5, odds: "Varies" },
  { name: "Golden Anniversaries", cards: 10, odds: "Varies" },
  { name: "Astonishing", cards: 10, odds: "Varies" },
  { name: "X-Force 35th Anniversary", cards: 10, odds: "Varies" },
  { name: "The One and Only", cards: 5, odds: "Varies" },
  { name: "Topps Patrimony", cards: 5, odds: "Varies" },
  { name: "Topps Originals", cards: 10, odds: "Varies" },
  { name: "Marvel Reflections", cards: 5, odds: "Varies" },
];

function getTierColor(tier: string) {
  switch (tier) {
    case "flagship": return "text-primary border-primary/30";
    case "premium": return "text-accent border-accent/30";
    case "heritage": return "text-secondary border-secondary/30";
    case "character": return "text-primary border-primary/30";
    default: return "text-muted-foreground border-border";
  }
}

function getTierLabel(tier: string) {
  switch (tier) {
    case "flagship": return "FLAGSHIP";
    case "premium": return "PREMIUM";
    case "heritage": return "HERITAGE";
    case "character": return "CHARACTER";
    default: return "";
  }
}

export default function MarketIntelBestCards() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Best Topps Marvel Cards to Watch 2025-2026 | Complete Product & Odds Guide"
        description="Your guide to the 2025-2026 Topps Marvel product lineup with verified pull odds. Every set ranked, every parallel mapped, every box type compared — real data for informed collectors."
        path="/market-intel/best-topps-marvel-cards"
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Market Intel", url: "/market-intel" },
            { name: "Best Cards to Watch", url: "/market-intel/best-topps-marvel-cards" },
          ]),
          faqJsonLd(FAQ_DATA),
        ]}
      />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[400px] flex items-center overflow-hidden space-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

        <div className="container relative z-10 py-16">
          <div className="max-w-4xl">
            <Link href="/market-intel" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Market Intel
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/30 rounded-full mb-6 ml-4">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-bold tracking-wide" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                FIELD GUIDE — VERIFIED ODDS
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] mb-6">
              BEST <span className="text-accent">TOPPS MARVEL</span> CARDS{" "}
              <br className="hidden sm:block" />
              TO WATCH IN <span className="text-primary">2025–2026</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              Every set ranked, every parallel mapped, every box type compared — with verified pull odds
              from official Topps odds sheets. Real data for informed collectors.
            </p>
          </div>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The 2025–2026 Topps Marvel product lineup is the most comprehensive trading card release
              calendar in Marvel history. With 8+ distinct product lines spanning MCU content, comic
              characters, character-specific releases, heritage celebrations, and premium tiers, collectors
              have more options — and more decisions to make — than ever before.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This field guide breaks down each product ranked from best to weakest, maps the complete
              parallel rainbow with verified pull odds from official Topps odds sheets, and compares what
              you get across Hobby, Value, and Mega box formats. No guesswork — just data.
            </p>
          </div>
        </div>
      </section>

      {/* ===== UNDERSTANDING THE TIERS ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-8 text-primary">
            UNDERSTANDING THE PRODUCT TIERS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                tier: "Flagship",
                desc: "Core products with full parallel rainbows, comprehensive character coverage, and the deepest chase card pools.",
                icon: Star,
                accent: "text-primary",
                glow: "glow-green",
              },
              {
                tier: "Premium",
                desc: "Higher-end products with limited production, premium materials, and elevated aesthetics.",
                icon: Zap,
                accent: "text-accent",
                glow: "glow-gold",
              },
              {
                tier: "Heritage",
                desc: "Products that connect to Marvel's collecting history and celebrate milestones. Often undervalued sleepers.",
                icon: Layers,
                accent: "text-secondary",
                glow: "glow-teal",
              },
              {
                tier: "Character",
                desc: "Single-character or themed releases that go deep on specific Marvel properties.",
                icon: Target,
                accent: "text-primary",
                glow: "glow-purple",
              },
            ].map((item, i) => (
              <div key={i} className={`bg-background p-5 rounded-lg border border-border ${item.glow}`}>
                <div className={`w-9 h-9 bg-muted rounded-full flex items-center justify-center mb-3`}>
                  <item.icon className={`w-4 h-4 ${item.accent}`} />
                </div>
                <h3 className="text-base font-bold mb-2">{item.tier}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCT RANKINGS ===== */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-4 text-center">
            THE COMPLETE <span className="text-primary">2025–2026 LINEUP</span>
          </h2>
          <p className="text-center text-muted-foreground mb-10" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            Ranked from strongest to weakest based on checklist depth, parallel rainbow, hit quality, and collector demand.
          </p>

          <div className="space-y-6">
            {PRODUCTS.map((product, i) => (
              <div key={i} className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition-colors">
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-primary">#{i + 1}</span>
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getTierColor(product.tier)}`} style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                      {getTierLabel(product.tier)}
                    </span>
                    {product.name.includes("2026 Topps Chrome") && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                        NEW — JUST RELEASED
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>Focus</p>
                      <p className="text-sm text-foreground">{product.focus}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>Release</p>
                      <p className="text-sm text-foreground">{product.release}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>Tier</p>
                      <p className="text-sm text-foreground capitalize">{product.tier}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-3" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                    {product.significance}
                  </p>

                  <div className="bg-background p-3 rounded border border-border">
                    <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>What to Watch</p>
                    <p className="text-sm text-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                      {product.watchFor}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VERIFIED ODDS: HOBBY BOX ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-4xl font-bold text-primary">
              VERIFIED PULL ODDS
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-4xl" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            Real odds from the official 2026 Topps Chrome Marvel odds sheet. These are per-pack odds for Hobby boxes
            unless otherwise noted.
          </p>

          {/* Hobby Parallels */}
          <h3 className="text-2xl font-bold mb-4 text-foreground">Hobby Box — Base Parallels</h3>
          <div className="overflow-x-auto rounded-lg border border-border mb-8">
            <table className="w-full text-left" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Parallel</th>
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Odds (per pack)</th>
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider hidden md:table-cell" style={{ fontFamily: "'Anton', sans-serif" }}>Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {HOBBY_PARALLELS.map((p, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className={`px-4 py-2.5 font-medium text-sm ${p.color}`}>
                      {p.name}
                      {p.exclusive && <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded">HOBBY ONLY</span>}
                    </td>
                    <td className="px-4 py-2.5 text-foreground text-sm font-mono font-bold">{p.odds}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs hidden md:table-cell">
                      {p.name === "Superfractor" ? "1/1 — The ultimate chase" :
                       p.name === "Red Refractor" ? "/5 numbered" :
                       p.name === "Black Refractor" ? "/10 numbered" :
                       p.name === "Orange Refractor" ? "/25 numbered" :
                       p.name === "Gold Refractor" ? "/50 numbered" :
                       p.name === "Purple Shimmer" ? "/99 numbered" :
                       p.name.includes("Wave") ? "Wave variation of same color" :
                       ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clawed Chrome */}
          <h3 className="text-2xl font-bold mb-4 text-foreground">Hobby Exclusive — Clawed Chrome (Wolverine)</h3>
          <div className="overflow-x-auto rounded-lg border border-border mb-8">
            <table className="w-full text-left" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Parallel</th>
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Odds (per pack)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CLAWED_CHROME.map((p, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className={`px-4 py-2.5 font-medium text-sm ${p.color}`}>{p.name}</td>
                    <td className="px-4 py-2.5 text-foreground text-sm font-mono font-bold">{p.odds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== BOX TYPE COMPARISON ===== */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-4 text-secondary">
            BOX TYPE COMPARISON
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-4xl" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            Each box format has exclusive parallels you can't get anywhere else. Here's what's unique to each.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Value Box */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-4 bg-cyan-500/10 border-b border-border">
                <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Value Box Exclusive — RayWave
                </h3>
              </div>
              <div className="p-4">
                <table className="w-full text-left" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                  <tbody className="divide-y divide-border">
                    {VALUE_BOX_PARALLELS.map((p, i) => (
                      <tr key={i} className="hover:bg-muted/20 transition-colors">
                        <td className={`py-2 font-medium text-sm ${p.color}`}>{p.name}</td>
                        <td className="py-2 text-foreground text-sm font-mono font-bold text-right">{p.odds}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mega Box */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-4 bg-blue-500/10 border-b border-border">
                <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Mega Box Exclusive — X-Fractor
                </h3>
              </div>
              <div className="p-4">
                <table className="w-full text-left" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                  <tbody className="divide-y divide-border">
                    {MEGA_BOX_PARALLELS.map((p, i) => (
                      <tr key={i} className="hover:bg-muted/20 transition-colors">
                        <td className={`py-2 font-medium text-sm ${p.color}`}>{p.name}</td>
                        <td className="py-2 text-foreground text-sm font-mono font-bold text-right">{p.odds}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick comparison callout */}
          <div className="mt-6 bg-background p-5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <span className="text-primary font-bold">Key takeaway:</span> Hobby boxes offer the deepest rainbow (19+ parallels including Storm's Lightning and Clawed Chrome exclusives). Value boxes give you RayWave exclusives at better base odds (1:4). Mega boxes give you X-Fractor exclusives with the most accessible colored parallels (Green at 1:46 vs Value Green at 1:155). Serious collectors buy across all three formats to complete the full parallel spectrum.
            </p>
          </div>
        </div>
      </section>

      {/* ===== INSERT SET ODDS ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-4 text-accent">
            INSERT SETS — VERIFIED ODDS
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-4xl" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            2026 Chrome Marvel features 17 insert sets — the most ever in a single Topps Marvel product.
            Here are the verified Hobby box pull rates.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Insert Set</th>
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider text-center" style={{ fontFamily: "'Anton', sans-serif" }}>Cards</th>
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Odds (Hobby)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {INSERT_ODDS.map((ins, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-sm text-foreground">{ins.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-sm text-center">{ins.cards}</td>
                    <td className="px-4 py-2.5 text-sm font-mono font-bold">
                      <span className={ins.odds === "1:6" ? "text-primary" : "text-muted-foreground"}>
                        {ins.odds}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            The six main inserts (Fanfare, Future Stars, Marvel Icons, Meanwhile, One World Under Doom, The Beyond) are all 1:6 — meaning you'll average about one insert per pack. The premium/short-print inserts have variable odds not disclosed on the standard odds sheet.
          </p>
        </div>
      </section>

      {/* ===== HITS & RELICS ===== */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-8 text-primary">
            PREMIUM HITS & RELICS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Autographs */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-bold mb-4 text-accent">Autographs</h3>
              <ul className="space-y-2 text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Marvel Facsimile Autographs (15 subjects) — Single, Dual, Triple, and QUAD versions</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Cordially Invited Autographs — Kevin Feige, Aaron Judge, Pete Alonso, Patton Oswalt, Steve Aoki, Seth Meyers</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Varied Visage Autographs — 11 subjects, all illustrated by Bella Rachlin</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Authentic Comic Book Artist Autographs — 40+ artists including Bill Sienkiewicz, Frank Miller, Jim Cheung, Todd McFarlane</li>
              </ul>
            </div>

            {/* Relics */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-bold mb-4 text-secondary">Relics & Sketch Cards</h3>
              <ul className="space-y-2 text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span> Stan Lee & Steve Ditko Relics (AC-01, AC-02) — actual memorabilia pieces</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span> Comic Excerpts Spider-Man — 12 cards with actual comic pages from 1985–1993 embedded</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span> Artist Originals by Kevin Eastman and Adi Granov</li>
                <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span> 100+ sketch card artists in the set</li>
              </ul>
            </div>
          </div>

          {/* Quad Auto callout */}
          <div className="bg-background p-5 rounded-lg border border-accent/30">
            <p className="text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <span className="text-accent font-bold">Chase Card Spotlight:</span> The Quad Autographs feature two legendary groupings — <span className="text-foreground font-medium">Doctor Doom / Silver Surfer / Galactus / Namor</span> and <span className="text-foreground font-medium">Venom / Doctor Octopus / Green Goblin / Spider-Man</span>. These are the rarest autograph cards in the set and will command premium prices on the secondary market.
            </p>
          </div>
        </div>
      </section>

      {/* ===== COLLECTING STRATEGIES ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-primary">
            COLLECTING STRATEGIES
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With multiple products releasing throughout 2025–2026, collectors benefit from having a strategy
              rather than trying to chase everything. Here are approaches informed collectors are using:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Character Focus",
                  desc: "Pick your favorite Marvel characters and collect them across all products. This creates a comprehensive character collection spanning the entire multi-year lineup. DEBUT cards are especially valuable for character-focused collectors.",
                },
                {
                  title: "Box Format Arbitrage",
                  desc: "Buy Value boxes for RayWave exclusives and Mega boxes for X-Fractors — these exclusive parallels can't be found in Hobby, creating natural scarcity that Hobby-only collectors miss.",
                },
                {
                  title: "Parallel Rainbow",
                  desc: "Select specific cards and chase every parallel version from base Refractor (1:2) to Superfractor (1:7,356). The structured scarcity model makes this a clear, defined collecting goal with known odds.",
                },
                {
                  title: "Insert Set Completion",
                  desc: "Target the 1:6 insert sets (Fanfare, Future Stars, Marvel Icons, Meanwhile, One World Under Doom, The Beyond) — at one per pack average, these are completable without breaking the bank.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-background p-5 rounded-lg border border-border">
                  <h3 className="text-lg font-bold mb-2 text-primary">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-center">
            FREQUENTLY ASKED <span className="text-primary">QUESTIONS</span>
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <details key={i} className="group bg-card rounded-lg border border-border overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted/20 transition-colors">
                  <span className="font-bold text-foreground pr-4" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>{faq.question}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA + NAVIGATION ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-3">
              EXPLORE THE <span className="text-primary">COLLECTION</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              Browse our full card database with every set, every parallel, and every character — searchable and filterable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cards">
                <Button size="lg" className="bg-primary hover:bg-primary/90 font-bold text-lg px-10 py-6">
                  Card Database
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/battleworld">
                <Button size="lg" variant="outline" className="font-bold text-lg px-10 py-6 border-primary/30 text-primary hover:bg-primary/10">
                  Battleworld
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t border-border pt-10">
            <p className="text-sm text-muted-foreground mb-4 text-center uppercase tracking-wider font-bold">Continue Reading</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/market-intel/why-fanatics-trading-cards">
                <div className="group bg-background p-4 rounded-lg border border-border hover:border-secondary/40 transition-all">
                  <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>Previous</p>
                  <p className="font-bold group-hover:text-secondary transition-colors">← Why Fanatics Is Changing Everything</p>
                </div>
              </Link>
              <Link href="/market-intel">
                <div className="group bg-background p-4 rounded-lg border border-border hover:border-primary/40 transition-all">
                  <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>Hub</p>
                  <p className="font-bold group-hover:text-primary transition-colors">← Back to Market Intel</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
