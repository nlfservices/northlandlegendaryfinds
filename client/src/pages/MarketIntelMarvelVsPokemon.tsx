/**
 * Market Intel - Supporting Page 3
 * "Marvel vs Pokémon Cards: Two Models in an Expanding Hobby"
 */

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ChevronRight, BarChart3, Layers, Target } from "lucide-react";
import SEO, { breadcrumbJsonLd, faqJsonLd } from "@/components/SEO";

const FAQ_DATA = [
  {
    question: "Are Marvel cards better than Pokémon cards?",
    answer: "Neither is objectively 'better.' They serve different collector preferences. Pokémon operates at massive scale with broad accessibility, while Topps Marvel uses structured scarcity with numbered parallels and defined rarity tiers. The right choice depends on what you value as a collector.",
  },
  {
    question: "Will Marvel cards ever be as big as Pokémon?",
    answer: "The Pokémon TCG has a 29-year head start and a built-in gameplay ecosystem. Marvel cards under Topps are in their first year of global production. Comparing current market size is less useful than evaluating trajectory and structural advantages. Both categories can grow simultaneously.",
  },
  {
    question: "Should I collect Marvel or Pokémon cards?",
    answer: "Many collectors participate in both markets. The hobby is large enough to support multiple ecosystems. Consider your personal connection to the IP, your preference for scale vs. scarcity models, and your collecting goals when deciding where to focus.",
  },
  {
    question: "Are Marvel cards a good investment compared to Pokémon?",
    answer: "Investment outcomes depend on specific products, timing, and market conditions. Marvel cards under Topps are in an early-stage growth phase with potential first-mover advantages. Pokémon cards have an established market with proven long-term value. Both carry risks and opportunities.",
  },
];

export default function MarketIntelMarvelVsPokemon() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Marvel vs Pokémon Cards: Two Models in an Expanding Hobby"
        description="Pokémon dominates through scale. Topps Marvel is building through structured scarcity. Understand both models and what they mean for collectors in 2025."
        path="/market-intel/marvel-vs-pokemon-cards"
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Market Intel", url: "/market-intel" },
            { name: "Marvel vs Pokémon", url: "/market-intel/marvel-vs-pokemon-cards" },
          ]),
          faqJsonLd(FAQ_DATA),
        ]}
      />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[400px] flex items-center overflow-hidden space-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

        <div className="container relative z-10 py-16">
          <div className="max-w-4xl">
            <Link href="/market-intel" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Market Intel
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full mb-6 ml-4">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                MARKET COMPARISON
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] mb-6">
              <span className="text-primary">MARVEL</span> VS <span className="text-accent">POKÉMON</span>{" "}
              CARDS
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              Two models in an expanding hobby — scale vs structured scarcity and what it means for collectors.
            </p>
          </div>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The trading card hobby is large enough to support multiple successful ecosystems operating
              under fundamentally different models. Understanding these models — rather than declaring one
              "better" than the other — is the mark of an informed collector.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Pokémon and Marvel represent two of the most powerful intellectual properties in global
              entertainment. Both have passionate collector communities. Both generate significant secondary
              market activity. And both are positioned for continued growth. But they operate under different
              structural models that create different collecting experiences, different market dynamics, and
              different opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* ===== THE POKÉMON MODEL ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-accent">
            THE POKÉMON MODEL: SCALE AND ACCESSIBILITY
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Pokémon Trading Card Game is one of the most successful consumer products in history. In
              the fiscal year ending March 2025, The Pokémon Company produced approximately 10.2 billion
              cards — part of a cumulative total exceeding 75 billion cards since 1996.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This scale is not accidental. It is the result of a deliberate strategy built around
              accessibility, gameplay integration, and broad demographic appeal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Gameplay Integration",
                  desc: "Pokémon cards serve dual purposes — they are both collectibles and functional game pieces. This creates a floor of utility-driven demand that pure collectible cards do not have.",
                  icon: Layers,
                },
                {
                  title: "Massive Scale",
                  desc: "10+ billion cards per year creates a liquid, accessible market where new collectors can enter at virtually any price point.",
                  icon: BarChart3,
                },
                {
                  title: "Broad Demographics",
                  desc: "The Pokémon ecosystem spans video games, anime, mobile apps, and merchandise — each channel feeding demand back into the card market.",
                  icon: Target,
                },
              ].map((item, i) => (
                <div key={i} className="bg-background p-5 rounded-lg border border-border">
                  <div className="w-9 h-9 bg-accent/15 rounded-full flex items-center justify-center mb-3">
                    <item.icon className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE TOPPS MARVEL MODEL ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-primary">
            THE TOPPS MARVEL MODEL: STRUCTURED SCARCITY
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The 2025 Topps Marvel lineup follows a fundamentally different approach. Products feature base
              cards, refractors, numbered parallels (/99, /50, /25, /10, /5, /1), autographs, and premium
              inserts. This structure creates defined scarcity within each release, giving collectors clear
              targets and established rarity hierarchies.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This is the same model that has driven the sports card market for decades — and it creates a
              different kind of collecting experience:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Defined Rarity",
                  desc: "When a card is numbered /25, there are exactly 25 copies. This creates transparent scarcity that collectors can evaluate and price accordingly.",
                  icon: Target,
                },
                {
                  title: "Parallel Chase",
                  desc: "Multiple versions of the same card at different rarity levels create a natural collecting hierarchy — from base cards to one-of-one superfractors.",
                  icon: Layers,
                },
                {
                  title: "Premium Tiers",
                  desc: "Products like Sapphire Edition and Mint create distinct price points and collecting experiences within the same ecosystem.",
                  icon: BarChart3,
                },
              ].map((item, i) => (
                <div key={i} className="bg-card p-5 rounded-lg border border-border glow-green">
                  <div className="w-9 h-9 bg-primary/15 rounded-full flex items-center justify-center mb-3">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-8 text-center">
            STRUCTURAL <span className="text-primary">COMPARISON</span>
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Dimension</th>
                  <th className="px-4 py-3 text-sm font-bold text-accent uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Pokémon TCG</th>
                  <th className="px-4 py-3 text-sm font-bold text-primary uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Topps Marvel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Primary Model", "Collectible + playable game", "Pure collectible with structured scarcity"],
                  ["Annual Production", "~10 billion cards", "Targeted production across 8+ product lines"],
                  ["Scarcity Model", "Pull rates and print runs", "Numbered parallels (/99, /50, /25, /10, /5, /1)"],
                  ["Market Maturity", "29 years established", "Year 1 of global production"],
                  ["IP Ecosystem", "Games, anime, apps, merchandise", "MCU films, Disney+, theme parks, comics"],
                  ["Price Entry Point", "~$4-5 per pack", "Varies by product tier"],
                  ["Demographics", "All ages, gameplay-driven", "Collector-focused, multi-generational"],
                  ["Distribution", "Mass retail + hobby", "Hobby, retail, DTC via Fanatics"],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground text-sm">{row[0]}</td>
                    <td className="px-4 py-3 text-muted-foreground text-sm">{row[1]}</td>
                    <td className="px-4 py-3 text-primary text-sm font-medium">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== NOT COMPETING ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-secondary">
            DIFFERENT MODELS, NOT COMPETING ONES
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The framing of "Marvel vs Pokémon" as a competition misses the structural reality of the
              trading card hobby. These are different products serving different collector preferences within
              a market that is large enough to support both.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Many collectors participate in both markets. A collector who enjoys the gameplay and community
              aspects of Pokémon may also appreciate the structured scarcity and character-driven collecting
              of Topps Marvel. These are not mutually exclusive activities.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The more useful question is not "which is better?" but rather "which model aligns with my
              collecting preferences, and where do I see the most interesting opportunities?"
            </p>
          </div>
        </div>
      </section>

      {/* ===== EARLY STAGE ADVANTAGE ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-primary">
            THE EARLY-STAGE FACTOR
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              One structural difference that informed collectors should consider: Pokémon cards have 29 years
              of market history, established pricing benchmarks, and a mature secondary market. Topps Marvel
              is in its first year of global production.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Early-stage markets have characteristics that mature markets do not — including the potential
              for first-mover advantages, less established pricing, and the possibility that today's products
              become tomorrow's foundational releases. This is not a guarantee of value appreciation, but it
              is a structural reality that distinguishes the current Topps Marvel market from the current
              Pokémon market.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The 2025 Topps Marvel products are, by definition, the first global releases in this ecosystem.
              Whether that early-timeline positioning translates into long-term collector value depends on
              many factors — but the historical parallel to other early-era collectibles is worth noting.
            </p>
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
              EXPLORE THE <span className="text-primary">TOPPS MARVEL</span> ECOSYSTEM
            </h2>
            <p className="text-muted-foreground text-lg mb-8" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              Ready to see what the 2025 lineup looks like? Explore the products and find what fits your collecting style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subscribe">
                <Button size="lg" className="bg-primary hover:bg-primary/90 font-bold text-lg px-10 py-6">
                  Get Notified for Drops
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/shop">
                <Button size="lg" variant="outline" className="font-bold text-lg px-10 py-6 border-primary/30 text-primary hover:bg-primary/10">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t border-border pt-10">
            <p className="text-sm text-muted-foreground mb-4 text-center uppercase tracking-wider font-bold">Continue Reading</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/market-intel/topps-vs-upper-deck-marvel">
                <div className="group bg-background p-4 rounded-lg border border-border hover:border-accent/40 transition-all">
                  <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>Previous</p>
                  <p className="font-bold group-hover:text-accent transition-colors">← Topps vs Upper Deck Marvel</p>
                </div>
              </Link>
              <Link href="/market-intel/why-fanatics-trading-cards">
                <div className="group bg-background p-4 rounded-lg border border-border hover:border-secondary/40 transition-all">
                  <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>Next</p>
                  <p className="font-bold group-hover:text-secondary transition-colors">Why Fanatics Is Changing Everything →</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
