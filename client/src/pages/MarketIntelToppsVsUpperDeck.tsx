/**
 * Market Intel - Supporting Page 2
 * "Topps vs Upper Deck Marvel: Past vs Future"
 */

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ChevronRight, Shield, Layers, Zap } from "lucide-react";
import SEO, { breadcrumbJsonLd, faqJsonLd } from "@/components/SEO";

const FAQ_DATA = [
  {
    question: "Will Topps replace Upper Deck for Marvel cards?",
    answer: "Topps, under Fanatics, secured global Marvel trading card rights through an expanded agreement with Disney Consumer Products in September 2024. Topps is now the primary producer of new Marvel trading card products. Upper Deck's historical Marvel releases remain valued collectibles in the secondary market.",
  },
  {
    question: "Are Upper Deck Marvel cards still valuable?",
    answer: "Yes. Upper Deck Marvel cards — particularly iconic sets like Marvel Masterpieces and key insert cards — retain their value based on collector demand, scarcity, and historical significance. The producer transition does not diminish the value of existing collections.",
  },
  {
    question: "Why did Marvel cards move from Upper Deck to Topps?",
    answer: "The transition reflects an evolution in licensing strategy. Disney Consumer Products expanded its agreement with Topps (owned by Fanatics) to include global Marvel rights, leveraging Fanatics' infrastructure for distribution, data-driven product development, and direct-to-consumer capabilities.",
  },
  {
    question: "Does Northland Legendary Finds sell Upper Deck Marvel cards?",
    answer: "No. We focus exclusively on Topps Marvel products as a forward-looking market positioning decision. We respect Upper Deck's contributions to the category and recognize the value of their products in the collector market.",
  },
];

export default function MarketIntelToppsVsUpperDeck() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Topps vs Upper Deck Marvel Cards: Understanding the Market Transition"
        description="Upper Deck built the Marvel card category. Topps and Fanatics are scaling its future. Understand the transition and what it means for collectors."
        path="/market-intel/topps-vs-upper-deck-marvel"
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Market Intel", url: "/market-intel" },
            { name: "Topps vs Upper Deck", url: "/market-intel/topps-vs-upper-deck-marvel" },
          ]),
          faqJsonLd(FAQ_DATA),
        ]}
      />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[400px] flex items-center overflow-hidden space-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

        <div className="container relative z-10 py-16">
          <div className="max-w-4xl">
            <Link href="/market-intel" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Market Intel
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/30 rounded-full mb-6 ml-4">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-bold tracking-wide" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                MARKET TRANSITION
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] mb-6">
              TOPPS VS UPPER DECK:{" "}
              <br className="hidden sm:block" />
              THE <span className="text-accent">FOUNDATION</span> AND THE <span className="text-primary">FUTURE</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              Respecting the legacy while understanding the structural forces reshaping the Marvel trading card market.
            </p>
          </div>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <p className="text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            The Marvel trading card market did not begin in 2024. It was built over decades by producers
            who recognized the collectible potential of Marvel's characters and stories. Upper Deck, in
            particular, played a foundational role in establishing Marvel cards as a legitimate and valued
            collectible category. Understanding that foundation — and the structural forces now reshaping
            the market — is essential for any collector evaluating where to focus their attention going forward.
          </p>
        </div>
      </section>

      {/* ===== THE UPPER DECK FOUNDATION ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-accent">
            THE UPPER DECK FOUNDATION
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Upper Deck's contributions to the Marvel card space are substantial and well-documented. Sets
              like Marvel Masterpieces, Fleer Ultra Spider-Man, Marvel Annual, and numerous other releases
              built the vocabulary of Marvel card collecting — establishing concepts like chase cards, insert
              sets, and artist-driven premium releases that defined the category for generations of collectors.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              For many collectors, Upper Deck Marvel cards represent their introduction to the hobby. The
              artwork, the set designs, and the collecting experience created by these products established
              emotional connections that persist to this day. That history is part of the permanent record
              of this hobby, and it deserves recognition.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Upper Deck demonstrated that Marvel characters could anchor a serious collectible card market —
              not just as novelty items, but as products with genuine collector demand, secondary market
              value, and long-term appeal.
            </p>
          </div>
        </div>
      </section>

      {/* ===== LICENSING LANDSCAPE ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-secondary">
            THE LICENSING LANDSCAPE SHIFTS
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Licensing agreements in the trading card industry are not permanent. They evolve as business
              relationships change, as parent companies reassess their strategies, and as new infrastructure
              creates new possibilities.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In September 2024, Topps announced a major expansion of its existing agreement with Disney
              Consumer Products to include global Disney, Pixar, and Marvel trading card rights. This
              announcement formalized a transition that had been building since Fanatics acquired Topps in
              January 2022.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The key context: this was not a hostile takeover of a license. It was a strategic realignment
              driven by Disney's assessment of which partner could best serve the long-term growth of Marvel
              as a collectible property. Fanatics' infrastructure — its licensing relationships, distribution
              capabilities, data systems, and direct-to-consumer platform — represented a different model for
              scaling Marvel cards than what had existed before.
            </p>
          </div>
        </div>
      </section>

      {/* ===== WHAT CHANGES ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-4 text-primary">
            WHAT CHANGES UNDER TOPPS AND FANATICS
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-4xl" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            The transition represents a structural shift in how Marvel trading cards are produced,
            distributed, and marketed.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Dimension</th>
                  <th className="px-4 py-3 text-sm font-bold text-accent uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Previous Model</th>
                  <th className="px-4 py-3 text-sm font-bold text-primary uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Topps/Fanatics Model</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Distribution", "Primarily hobby shops and specialty retailers", "Multi-channel: hobby, retail, DTC, digital"],
                  ["Licensing Scope", "Marvel cards as standalone category", "Marvel integrated into Disney/Pixar/Star Wars ecosystem"],
                  ["Consumer Data", "Limited direct consumer insight", "Real-time data from Fanatics platform"],
                  ["Product Cadence", "Periodic releases", "Coordinated multi-product annual roadmap"],
                  ["Market Reach", "Primarily established collectors", "Established + new audiences via DTC"],
                  ["Infrastructure", "Traditional card manufacturer", "Vertically integrated sports/entertainment platform"],
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

      {/* ===== WHAT STAYS THE SAME ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-secondary">
            WHAT STAYS THE SAME
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "The Characters",
                desc: "Spider-Man, Wolverine, Iron Man, Captain America — the intellectual property that drives collector demand is unchanged. The emotional connections transcend any individual card producer.",
                icon: Zap,
              },
              {
                title: "The Collecting Experience",
                desc: "Opening packs, chasing parallels, completing sets, finding autographs — the core mechanics of the hobby remain intact under Topps.",
                icon: Layers,
              },
              {
                title: "The Secondary Market",
                desc: "Card values are determined by collector demand, scarcity, condition, and cultural relevance — not by which company produced them.",
                icon: Shield,
              },
              {
                title: "The Community",
                desc: "Collectors who built their collections around Upper Deck products are the same collectors evaluating Topps products today. The knowledge and passion carry forward.",
                icon: Zap,
              },
            ].map((item, i) => (
              <div key={i} className="bg-card p-6 rounded-lg border border-border glow-teal">
                <div className="w-10 h-10 bg-secondary/15 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR POSITION ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-primary">
            OUR POSITION
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Northland Legendary Finds has made the strategic decision to focus exclusively on Topps Marvel
              products. This decision is based on our assessment of where the market infrastructure is
              heading — not on a judgment of what came before.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We respect Upper Deck's role in building the Marvel card category. We recognize the value and
              significance of Upper Deck Marvel products in collector portfolios. And we have chosen to align
              our business with the Topps and Fanatics ecosystem because we believe it represents the
              strongest foundation for the next phase of Marvel card collecting.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This is a forward-looking decision. The hobby is large enough for collectors to value products
              from every era, and the history of Marvel cards is richer because of every producer who
              contributed to it.
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
              STAY <span className="text-primary">INFORMED</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              The Marvel card market is evolving. Stay informed about new Topps Marvel releases and market analysis.
            </p>
            <Link href="/subscribe">
              <Button size="lg" className="bg-primary hover:bg-primary/90 font-bold text-lg px-10 py-6">
                Get Notified for Drops
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="border-t border-border pt-10">
            <p className="text-sm text-muted-foreground mb-4 text-center uppercase tracking-wider font-bold">Continue Reading</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/market-intel/2024-vs-2025-topps-marvel">
                <div className="group bg-background p-4 rounded-lg border border-border hover:border-secondary/40 transition-all">
                  <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>Previous</p>
                  <p className="font-bold group-hover:text-secondary transition-colors">← 2024 vs 2025 Topps Marvel</p>
                </div>
              </Link>
              <Link href="/market-intel/marvel-vs-pokemon-cards">
                <div className="group bg-background p-4 rounded-lg border border-border hover:border-primary/40 transition-all">
                  <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>Next</p>
                  <p className="font-bold group-hover:text-primary transition-colors">Marvel vs Pokémon Cards →</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
