/**
 * Market Intel - Pillar Page
 * "Future of Marvel Trading Cards: Why Topps and Fanatics Are Leading the Next Era"
 * SEO authority hub linking to all 5 supporting pages
 */

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Calendar,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import SEO, { breadcrumbJsonLd, faqJsonLd } from "@/components/SEO";

const SUPPORTING_PAGES = [
  {
    title: "2024 vs 2025 Topps Marvel Explained",
    description: "From a limited UK preview to a full global launch — understand the timeline and why this distinction matters.",
    href: "/market-intel/2024-vs-2025-topps-marvel",
    icon: Calendar,
    accent: "text-secondary",
    glow: "glow-teal",
  },
  {
    title: "Topps vs Upper Deck Marvel",
    description: "Respecting the foundation while understanding the structural forces reshaping the market.",
    href: "/market-intel/topps-vs-upper-deck-marvel",
    icon: Shield,
    accent: "text-accent",
    glow: "glow-gold",
  },
  {
    title: "Marvel vs Pokémon Cards",
    description: "Two models in an expanding hobby — scale vs structured scarcity and what it means for collectors.",
    href: "/market-intel/marvel-vs-pokemon-cards",
    icon: BarChart3,
    accent: "text-primary",
    glow: "glow-green",
  },
  {
    title: "Why Fanatics Is Changing Everything",
    description: "Licensing control, DTC distribution, data advantage, vertical integration — the infrastructure story.",
    href: "/market-intel/why-fanatics-trading-cards",
    icon: Globe,
    accent: "text-secondary",
    glow: "glow-teal",
  },
  {
    title: "Best Topps Marvel Cards to Watch",
    description: "Your guide to the 2025 product lineup — sets, parallels, and what informed collectors are watching.",
    href: "/market-intel/best-topps-marvel-cards",
    icon: TrendingUp,
    accent: "text-accent",
    glow: "glow-gold",
  },
];

const FAQ_DATA = [
  {
    question: "Did Topps release Marvel cards in 2024?",
    answer: "Yes. Topps UK released Marvel Chrome 2024 on August 30, 2024, followed by a Sapphire Edition in October 2024. Both were limited to the UK Topps Launches platform and were not widely available globally. These releases are best understood as a preview phase before the full 2025 global launch.",
  },
  {
    question: "Is 2025 the real start of Topps Marvel?",
    answer: "2025 represents the first year of full-scale, global Topps Marvel product releases. With multiple product lines spanning MCU, Marvel Comics, character-specific sets, and premium tiers, 2025 is when the Topps Marvel ecosystem truly began operating at scale.",
  },
  {
    question: "Why is Fanatics important for Marvel cards?",
    answer: "Fanatics acquired Topps in 2022 and brings licensing control, direct-to-consumer distribution, data-driven product development, and vertical integration to the Marvel card space. This infrastructure advantage positions Topps Marvel products for a level of market reach and product sophistication that was not previously possible.",
  },
  {
    question: "Will Topps replace Upper Deck for Marvel cards?",
    answer: "Topps, under Fanatics, secured global Marvel trading card rights through an expanded agreement with Disney Consumer Products announced in September 2024. The market is transitioning, and Topps is now the primary producer of new Marvel trading card products going forward.",
  },
  {
    question: "Are Marvel cards a growing category?",
    answer: "The Marvel trading card category is in an early-stage growth phase under Topps. With multiple 2025 product lines, expanding distribution through Fanatics, and Marvel's ongoing cultural relevance through the MCU and Disney+, the category is positioned for sustained growth.",
  },
  {
    question: "Why does Northland Legendary Finds focus on Topps Marvel?",
    answer: "We focus on Topps Marvel because we believe the Fanatics infrastructure, Disney IP power, and Topps heritage represent the strongest long-term foundation in the Marvel card space. This is a strategic positioning decision based on market analysis, not a commentary on other producers.",
  },
];

const PRODUCT_TABLE = [
  { product: "Topps Marvel Studios Chrome", focus: "MCU Characters", window: "2025", note: "First-ever MCU Topps product" },
  { product: "Topps Chrome Marvel Comics", focus: "Comic Characters", window: "June 16, 2025", note: "616 Day launch" },
  { product: "Topps Mint Marvel", focus: "Premium Coin Design", window: "2025", note: "Unique coin-feel aesthetic" },
  { product: "Topps Marvel Sapphire Edition", focus: "Premium Parallels", window: "2025", note: "Established premium brand" },
  { product: "Topps Marvel 1975 Anniversary", focus: "Heritage", window: "2025", note: "50-year celebration" },
  { product: "Topps Infinity MCU Phase 1", focus: "MCU Retrospective", window: "2025", note: "Origin stories" },
  { product: "Topps Chrome Deadpool", focus: "Character-Specific", window: "2025", note: "Single-character release" },
  { product: "Topps Marvel The Collector", focus: "Comprehensive Set", window: "Feb 2026", note: "Flagship collector set" },
];

export default function MarketIntel() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Future of Marvel Trading Cards | Topps, Fanatics & the New Era"
        description="The Marvel trading card market is entering a new era. Explore how Topps, Fanatics, and Disney are reshaping the future of Marvel collectibles in 2025 and beyond."
        path="/market-intel"
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Market Intel", url: "/market-intel" },
          ]),
          faqJsonLd(FAQ_DATA),
        ]}
      />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center overflow-hidden space-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container relative z-10 py-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                MARKET INTEL
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] mb-6">
              <span className="text-primary">2024</span> WAS THE PREVIEW.{" "}
              <br className="hidden sm:block" />
              <span className="text-primary">2025</span> IS THE REAL LAUNCH.
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              How Topps, Fanatics, and Disney are converging to create the most significant
              shift in Marvel card collecting history.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/market-intel/2024-vs-2025-topps-marvel">
                <Button size="lg" className="bg-primary hover:bg-primary/90 font-bold text-lg px-8 py-6">
                  Start Reading
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/market-intel/best-topps-marvel-cards">
                <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 border-primary/30 text-primary hover:bg-primary/10">
                  Best Cards to Watch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INTRO THESIS ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            The trading card hobby moves in cycles. New licenses shift hands. New infrastructure reshapes
            distribution. New cultural moments drive demand. In September 2024, Topps officially expanded
            its agreement with Disney Consumer Products to include global Marvel trading card rights — a
            deal that positions the Topps and Fanatics ecosystem at the center of the next era of Marvel
            collectibles.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            This page is your guide to understanding what happened, what's happening now, and where the
            market is heading.
          </p>
        </div>
      </section>

      {/* ===== THE 2024 PREVIEW ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-secondary">
            THE 2024 PREVIEW PHASE
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              On August 30, 2024, Topps UK quietly released Marvel Chrome 2024 — the first-ever Marvel
              Chrome trading card product. Available exclusively through the Topps UK Launches platform,
              this release was limited in scope, distribution, and availability. A Sapphire Edition followed
              in October 2024, also through the UK platform.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              These were not full-scale global launches. They were proof-of-concept releases — a preview
              of what Topps could do with the Marvel license before the infrastructure was fully in place
              for worldwide distribution.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              For collectors who recognized the significance, these 2024 UK releases represent the earliest
              Topps Marvel Chrome products ever produced. For the broader market, they were largely
              invisible — available only to those actively monitoring the UK Topps Launches platform.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/market-intel/2024-vs-2025-topps-marvel" className="inline-flex items-center gap-2 text-primary font-bold hover:underline" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              Read the full 2024 vs 2025 breakdown <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== THE 2025 GLOBAL LAUNCH ===== */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-4 text-primary">
            THE 2025 GLOBAL LAUNCH
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-4xl" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            2025 marks the true beginning of the Topps Marvel era on a global scale. This is not a single
            product launch — this is an entire product ecosystem being built from the ground up.
          </p>

          {/* Product table */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-sm font-bold text-primary uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Product</th>
                  <th className="px-4 py-3 text-sm font-bold text-primary uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Focus</th>
                  <th className="px-4 py-3 text-sm font-bold text-primary uppercase tracking-wider hidden md:table-cell" style={{ fontFamily: "'Anton', sans-serif" }}>Release</th>
                  <th className="px-4 py-3 text-sm font-bold text-primary uppercase tracking-wider hidden lg:table-cell" style={{ fontFamily: "'Anton', sans-serif" }}>Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PRODUCT_TABLE.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground text-sm">{row.product}</td>
                    <td className="px-4 py-3 text-muted-foreground text-sm">{row.focus}</td>
                    <td className="px-4 py-3 text-muted-foreground text-sm hidden md:table-cell">{row.window}</td>
                    <td className="px-4 py-3 text-muted-foreground text-sm hidden lg:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== FANATICS INFRASTRUCTURE ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-4 text-secondary">
            THE FANATICS INFRASTRUCTURE ADVANTAGE
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            In January 2022, Fanatics acquired Topps for approximately $500 million, bringing one of the
            most recognized names in trading cards under the umbrella of a company valued at over $10
            billion in its collectibles division alone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Licensing Control",
                desc: "Consolidated licenses across NFL, NBA, MLB, and Disney properties including Marvel, Pixar, and Star Wars. Coordinated product strategy across the most valuable IPs in entertainment.",
                icon: Shield,
                glow: "glow-purple",
              },
              {
                title: "Distribution Scale",
                desc: "One of the largest direct-to-consumer platforms in sports and entertainment. Marvel cards reach millions of engaged consumers beyond traditional hobby shop networks.",
                icon: Globe,
                glow: "glow-teal",
              },
              {
                title: "Data-Driven Development",
                desc: "Real-time consumer data informs production decisions, pricing strategy, and product design in ways that traditional card manufacturers never had access to.",
                icon: BarChart3,
                glow: "glow-green",
              },
              {
                title: "Vertical Integration",
                desc: "From licensing to manufacturing to distribution to consumer engagement — Fanatics controls the full value chain, reducing friction and increasing speed to market.",
                icon: Zap,
                glow: "glow-gold",
              },
            ].map((item, i) => (
              <div key={i} className={`bg-background p-6 rounded-lg border border-border ${item.glow}`}>
                <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/market-intel/why-fanatics-trading-cards" className="inline-flex items-center gap-2 text-secondary font-bold hover:underline" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              Deep dive into the Fanatics effect <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== RESPECTING THE FOUNDATION ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-accent">
            RESPECTING THE FOUNDATION
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Upper Deck built the Marvel trading card category. Sets like Marvel Masterpieces, Fleer Ultra,
              and decades of consistent releases established Marvel cards as a legitimate collectible category.
              That history matters, and serious collectors recognize the role Upper Deck played in building
              the foundation that exists today.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The transition to Topps under Fanatics is not a commentary on quality or legacy. It is a
              reflection of how licensing agreements evolve and how infrastructure advantages reshape
              industries over time. Upper Deck's contributions to the Marvel card space are part of the
              permanent record of this hobby.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Northland Legendary Finds has made the strategic decision to focus exclusively on Topps Marvel
              products. This is a forward-looking positioning choice based on where we see the market
              heading — not a judgment on what came before.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/market-intel/topps-vs-upper-deck-marvel" className="inline-flex items-center gap-2 text-accent font-bold hover:underline" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              Read the full Topps vs Upper Deck analysis <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== MARVEL CULTURAL ENGINE ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-primary">
            MARVEL'S CULTURAL ENGINE
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Marvel operates in cycles. Periods of massive global attention — driven by interconnected
              storytelling events — create surges in cultural relevance that extend into every consumer
              category, including collectibles. The Marvel Cinematic Universe has generated over $30 billion
              in global box office revenue across its history.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Disney+ has expanded the storytelling surface area to include series that develop characters
              and narratives between theatrical releases. When Marvel enters a major crossover cycle, the
              cultural attention reaches toy collectors, card collectors, memorabilia buyers, and casual
              fans simultaneously.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The key insight for collectors: Marvel's cultural relevance is not static. It operates in
              waves, and the infrastructure now exists — through Topps and Fanatics — to produce trading
              card products that align with those waves in real time.
            </p>
          </div>
        </div>
      </section>

      {/* ===== MULTI-GENERATIONAL ADVANTAGE ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-secondary">
            THE MULTI-GENERATIONAL ADVANTAGE
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Marvel characters are recognized across generations in a way that few intellectual properties
              can match. A grandparent who read Marvel comics in the 1960s, a parent who grew up with the
              MCU films, and a child watching Marvel content on Disney+ all share a common vocabulary of
              characters and stories.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This multi-generational recognition creates a unique dynamic in the collectibles market.
              Demand is not driven by a single demographic cohort — it is reinforced across age groups,
              each engaging with the same characters through different media. Disney's ecosystem amplifies
              this effect through theme parks, merchandise, streaming content, theatrical releases, and
              publishing.
            </p>
          </div>
        </div>
      </section>

      {/* ===== MARKET DYNAMICS ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-primary">
            SCALE VS. STRUCTURE
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The trading card hobby is large enough to support multiple successful ecosystems operating
              under different models. The Pokémon Trading Card Game produced approximately 10.2 billion
              cards in the fiscal year ending March 2025 — part of a cumulative total exceeding 75 billion
              cards since 1996. This scale creates a vibrant, liquid market with broad participation.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The 2025 Topps Marvel lineup follows a different approach — products feature base cards,
              refractors, numbered parallels (/99, /50, /25, /10, /5, /1), autographs, and premium inserts.
              This structure creates defined scarcity within each release, giving collectors clear targets
              and established rarity hierarchies.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              These are not competing philosophies — they are different approaches to serving different
              collector preferences. The emergence of Topps Marvel as a structured, premium category gives
              collectors who prefer that model a new option within the Marvel intellectual property.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/market-intel/marvel-vs-pokemon-cards" className="inline-flex items-center gap-2 text-primary font-bold hover:underline" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              Explore the full Marvel vs Pokémon comparison <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SUPPORTING PAGES HUB ===== */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-4 text-center">
            EXPLORE THE <span className="text-primary">FULL ANALYSIS</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-10 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            Dive deeper into each dimension of the Marvel trading card market.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUPPORTING_PAGES.map((page, i) => (
              <Link key={i} href={page.href}>
                <div className={`group bg-card p-6 rounded-lg border border-border hover:border-primary/40 transition-all h-full ${page.glow}`}>
                  <div className={`w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-4`}>
                    <page.icon className={`w-5 h-5 ${page.accent}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{page.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                    {page.description}
                  </p>
                  <div className="flex items-center gap-1 text-primary text-sm font-bold" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                    Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHERE WE STAND ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-primary">
            WHERE WE STAND
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Northland Legendary Finds is built around the Topps Marvel ecosystem. We believe the
              convergence of Fanatics infrastructure, Disney intellectual property, and Topps heritage
              represents the most significant structural opportunity in the Marvel trading card space.
            </p>
            <div className="bg-background p-6 rounded-lg border border-primary/20">
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>We carry and support Topps Marvel products exclusively</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>We do not sell or promote Upper Deck Marvel products</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>We view this as a forward-looking market decision aligned with where the industry is heading</span>
                </li>
              </ul>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This is not about what happened yesterday. It is about what is being built today and where
              it leads tomorrow.
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

      {/* ===== CTA ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-3">
            STAY <span className="text-primary">INFORMED</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            The Marvel trading card market is entering a new era. Sign up for updates on new Topps Marvel
            releases, market analysis, and product drops.
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
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
