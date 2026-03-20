/**
 * Market Intel - Supporting Page 5
 * "Best Topps Marvel Cards to Watch in 2025"
 */

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ChevronRight, TrendingUp, Star, Zap, Target, Layers } from "lucide-react";
import SEO, { breadcrumbJsonLd, faqJsonLd } from "@/components/SEO";

const FAQ_DATA = [
  {
    question: "What are the best Topps Marvel cards to collect in 2025?",
    answer: "The 2025 lineup includes Marvel Studios Chrome (first MCU Topps product), Chrome Marvel Comics (616 Day launch), Mint Marvel, Sapphire Edition, and character-specific releases like Chrome Deadpool. The 'best' depends on your collecting goals — MCU fans may prioritize Studios Chrome, while comic purists may focus on Chrome Marvel Comics.",
  },
  {
    question: "What Topps Marvel cards are most valuable?",
    answer: "Value in the Topps Marvel ecosystem follows the structured scarcity model: low-numbered parallels (/10, /5, /1), autographs, and superfractors command the highest prices. First-year products from 2025 may carry additional significance as the earliest global Topps Marvel releases.",
  },
  {
    question: "When does 2025 Topps Marvel Chrome come out?",
    answer: "The 2025 Topps Marvel product calendar includes multiple releases throughout the year. Chrome Marvel Comics launches on June 16, 2025 (Marvel 616 Day). Marvel Studios Chrome and other products have staggered release dates throughout 2025.",
  },
  {
    question: "Are 2025 Topps Marvel cards worth buying?",
    answer: "2025 Topps Marvel products represent the first year of full-scale global production under the Fanatics infrastructure. Whether they are 'worth buying' depends on your collecting goals, budget, and assessment of the market trajectory. The early-timeline positioning is a structural factor worth considering.",
  },
];

const PRODUCTS = [
  {
    name: "Topps Marvel Studios Chrome",
    focus: "MCU Characters",
    release: "2025",
    significance: "The first-ever MCU-focused Topps trading card product. Features characters from across the Marvel Cinematic Universe with Chrome technology.",
    watchFor: "First MCU Topps cards ever produced. Key character cards (Iron Man, Spider-Man, Wolverine) in low-numbered parallels.",
    tier: "flagship",
  },
  {
    name: "Topps Chrome Marvel Comics",
    focus: "616 Comic Characters",
    release: "June 16, 2025",
    significance: "Launching on Marvel 616 Day — a deliberate alignment with Marvel Comics' primary universe designation. Features classic and modern comic characters.",
    watchFor: "616 Day launch date adds cultural significance. Classic character cards in Chrome finish with full parallel rainbow.",
    tier: "flagship",
  },
  {
    name: "Topps Mint Marvel",
    focus: "Premium Coin Design",
    release: "2025",
    significance: "A unique product format that brings Topps' established Mint brand to Marvel. Cards feature a distinctive coin-inspired metallic aesthetic.",
    watchFor: "Unique aesthetic differentiates from Chrome products. Premium positioning with distinct collector appeal.",
    tier: "premium",
  },
  {
    name: "Topps Marvel Sapphire Edition",
    focus: "Premium Parallels",
    release: "2025",
    significance: "Sapphire is an established premium brand in the Topps ecosystem. The Marvel Sapphire Edition brings this premium tier to Marvel characters.",
    watchFor: "Sapphire brand carries existing collector recognition. Limited production creates natural scarcity.",
    tier: "premium",
  },
  {
    name: "Topps Comic Book Heroes 1975 Anniversary",
    focus: "Heritage Celebration",
    release: "2025",
    significance: "Celebrates 50 years of Marvel trading cards with a heritage-focused design. Connects the modern Topps era to the broader history of Marvel collectibles.",
    watchFor: "Anniversary significance adds cultural weight. Heritage designs appeal to long-term collectors.",
    tier: "heritage",
  },
  {
    name: "Topps Infinity MCU Phase 1",
    focus: "MCU Retrospective",
    release: "2025",
    significance: "Covers the foundational films of the Marvel Cinematic Universe — the origin stories that launched a $30B+ franchise.",
    watchFor: "Phase 1 characters (Iron Man, Captain America, Thor) in their original MCU appearances. Nostalgia-driven demand.",
    tier: "heritage",
  },
  {
    name: "Topps Chrome Deadpool",
    focus: "Character-Specific",
    release: "2025",
    significance: "A single-character Chrome release — indicating Topps' willingness to build character-specific product lines within the Marvel ecosystem.",
    watchFor: "Character-specific releases signal product line depth. Deadpool's cultural relevance drives broad appeal.",
    tier: "character",
  },
  {
    name: "2025 Topps Marvel The Collector",
    focus: "Comprehensive Set",
    release: "February 2026",
    significance: "Positioned as the flagship collector set — a comprehensive product designed for serious collectors who want depth and completeness.",
    watchFor: "Flagship positioning suggests premium content. Comprehensive character coverage across Marvel properties.",
    tier: "flagship",
  },
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
        title="Best Topps Marvel Cards to Watch in 2025 | Complete Product Guide"
        description="Your guide to the 2025 Topps Marvel product lineup. Every set, every tier, every release date — and what informed collectors are watching."
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
                PRODUCT GUIDE
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] mb-6">
              BEST <span className="text-accent">TOPPS MARVEL</span> CARDS{" "}
              <br className="hidden sm:block" />
              TO WATCH IN <span className="text-primary">2025</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              Your guide to the complete 2025 product lineup — sets, parallels, and what informed
              collectors are watching.
            </p>
          </div>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The 2025 Topps Marvel product lineup represents the most comprehensive trading card release
              calendar in Marvel history. With 8+ distinct product lines spanning MCU content, comic
              characters, character-specific releases, heritage celebrations, and premium tiers, collectors
              have more options — and more decisions to make — than ever before.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This guide breaks down each product in the 2025 lineup, explains its significance within the
              broader ecosystem, and identifies what informed collectors are watching. This is not investment
              advice — it is market context designed to help you make more informed collecting decisions.
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
                desc: "Core products designed for broad appeal with full parallel rainbows and comprehensive character coverage.",
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
                desc: "Products that connect to Marvel's collecting history and celebrate milestones.",
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

      {/* ===== PRODUCT BREAKDOWN ===== */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-10 text-center">
            THE COMPLETE <span className="text-primary">2025 LINEUP</span>
          </h2>

          <div className="space-y-6">
            {PRODUCTS.map((product, i) => (
              <div key={i} className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition-colors">
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getTierColor(product.tier)}`} style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                      {getTierLabel(product.tier)}
                    </span>
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

      {/* ===== PARALLEL STRUCTURE ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-4 text-secondary">
            UNDERSTANDING THE PARALLEL STRUCTURE
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-4xl" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            Topps Marvel products follow the established parallel model from sports cards. Understanding
            this structure helps collectors identify targets and evaluate relative scarcity.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Parallel Type</th>
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Numbered To</th>
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider hidden md:table-cell" style={{ fontFamily: "'Anton', sans-serif" }}>Relative Scarcity</th>
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider hidden lg:table-cell" style={{ fontFamily: "'Anton', sans-serif" }}>Collector Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Base", "Unnumbered", "Common", "Foundation of every set — complete set building"],
                  ["Refractor", "Unnumbered", "Uncommon", "Chrome finish variant — the classic parallel"],
                  ["Numbered /99", "/99", "Limited", "First tier of defined scarcity"],
                  ["Numbered /50", "/50", "Scarce", "Mid-tier parallel with strong collector demand"],
                  ["Numbered /25", "/25", "Rare", "Significant scarcity — highly sought after"],
                  ["Numbered /10", "/10", "Very Rare", "Single-digit print run — premium tier"],
                  ["Numbered /5", "/5", "Ultra Rare", "Extremely limited — major chase cards"],
                  ["Superfractor /1", "1/1", "Unique", "One-of-one — the ultimate chase in any set"],
                  ["Autograph", "Varies", "Varies", "On-card or sticker autos — character-dependent value"],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground text-sm">{row[0]}</td>
                    <td className="px-4 py-3 text-primary text-sm font-medium">{row[1]}</td>
                    <td className="px-4 py-3 text-muted-foreground text-sm hidden md:table-cell">{row[2]}</td>
                    <td className="px-4 py-3 text-muted-foreground text-sm hidden lg:table-cell">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== COLLECTING STRATEGIES ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-primary">
            COLLECTING STRATEGIES TO CONSIDER
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With multiple products releasing throughout 2025, collectors benefit from having a strategy
              rather than trying to chase everything. Here are some approaches informed collectors are
              considering:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Character Focus",
                  desc: "Pick your favorite Marvel characters and collect them across all 2025 products. This creates a comprehensive character collection that spans the entire first-year lineup.",
                },
                {
                  title: "Product Focus",
                  desc: "Choose one or two products that align with your budget and collecting style, and go deep — completing base sets, chasing parallels, and building comprehensive holdings.",
                },
                {
                  title: "Parallel Rainbow",
                  desc: "Select specific cards and chase every parallel version from base to superfractor. The structured scarcity model makes this a clear, defined collecting goal.",
                },
                {
                  title: "First-Year Breadth",
                  desc: "Collect across all 2025 products at a moderate level, prioritizing the historical significance of first-year releases across the entire Topps Marvel ecosystem.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-card p-5 rounded-lg border border-border">
                  <h3 className="text-lg font-bold mb-2 text-primary">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-center">
            FREQUENTLY ASKED <span className="text-primary">QUESTIONS</span>
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <details key={i} className="group bg-background rounded-lg border border-border overflow-hidden">
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
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-3">
              READY TO <span className="text-primary">COLLECT</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              Explore our curated Topps Marvel repacks — built with strong floor, loaded middle, and healthy ceiling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 font-bold text-lg px-10 py-6">
                  Browse Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/cards">
                <Button size="lg" variant="outline" className="font-bold text-lg px-10 py-6 border-primary/30 text-primary hover:bg-primary/10">
                  Card Database
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t border-border pt-10">
            <p className="text-sm text-muted-foreground mb-4 text-center uppercase tracking-wider font-bold">Continue Reading</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/market-intel/why-fanatics-trading-cards">
                <div className="group bg-card p-4 rounded-lg border border-border hover:border-secondary/40 transition-all">
                  <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>Previous</p>
                  <p className="font-bold group-hover:text-secondary transition-colors">← Why Fanatics Is Changing Everything</p>
                </div>
              </Link>
              <Link href="/market-intel">
                <div className="group bg-card p-4 rounded-lg border border-border hover:border-primary/40 transition-all">
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
