/**
 * Market Intel - Supporting Page 4
 * "Why Fanatics Is Changing Everything for Marvel Cards"
 */

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ChevronRight, Globe, Shield, BarChart3, Zap, Layers, TrendingUp } from "lucide-react";
import SEO, { breadcrumbJsonLd, faqJsonLd } from "@/components/SEO";

const FAQ_DATA = [
  {
    question: "What is Fanatics and why do they matter for trading cards?",
    answer: "Fanatics is a global sports and entertainment platform valued at over $10 billion in its collectibles division. They acquired Topps in January 2022 and have consolidated major sports and entertainment trading card licenses, including Marvel, under one infrastructure.",
  },
  {
    question: "How much did Fanatics pay for Topps?",
    answer: "Fanatics acquired Topps for approximately $500 million in January 2022. This acquisition brought Topps' heritage and manufacturing capabilities under Fanatics' technology and distribution infrastructure.",
  },
  {
    question: "Will Fanatics change how Marvel cards are sold?",
    answer: "Yes. Fanatics brings direct-to-consumer distribution, data-driven product development, and multi-channel retail capabilities that expand how and where Marvel cards reach collectors. This includes hobby shops, mass retail, Topps.com, and the broader Fanatics platform.",
  },
  {
    question: "Is Fanatics good for the trading card hobby?",
    answer: "Fanatics brings infrastructure advantages including broader distribution, data-driven product development, and coordinated licensing across major IPs. The impact on the hobby will depend on how these capabilities are deployed over time. The scale of investment suggests a long-term commitment to growing the category.",
  },
];

const TIMELINE = [
  { year: "2022", event: "Fanatics acquires Topps for ~$500M", detail: "Heritage brand meets modern infrastructure" },
  { year: "2023", event: "Fanatics consolidates major sports licenses", detail: "NFL, NBA, MLB trading card rights secured" },
  { year: "2024", event: "Disney/Marvel deal expanded globally", detail: "September 2024 announcement formalizes Marvel rights" },
  { year: "2025", event: "Full global Topps Marvel launch", detail: "8+ product lines across multiple tiers" },
];

export default function MarketIntelFanatics() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Why Fanatics Is Changing Everything for Marvel Trading Cards"
        description="Fanatics acquired Topps for $500M and secured global Marvel rights. Understand the infrastructure, licensing, and distribution advantages reshaping the market."
        path="/market-intel/why-fanatics-trading-cards"
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Market Intel", url: "/market-intel" },
            { name: "Why Fanatics", url: "/market-intel/why-fanatics-trading-cards" },
          ]),
          faqJsonLd(FAQ_DATA),
        ]}
      />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[400px] flex items-center overflow-hidden space-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="absolute top-10 left-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container relative z-10 py-16">
          <div className="max-w-4xl">
            <Link href="/market-intel" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Market Intel
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full mb-6 ml-4">
              <Globe className="w-4 h-4 text-secondary" />
              <span className="text-secondary text-sm font-bold tracking-wide" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                INFRASTRUCTURE ANALYSIS
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] mb-6">
              WHY <span className="text-secondary">FANATICS</span> IS CHANGING{" "}
              <br className="hidden sm:block" />
              <span className="text-primary">EVERYTHING</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              Licensing control, DTC distribution, data advantage, vertical integration — the infrastructure
              story behind the Topps Marvel era.
            </p>
          </div>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The story of Topps Marvel is not just about trading cards. It is about infrastructure — the
              systems, relationships, and capabilities that determine how products reach consumers, how
              markets are developed, and how intellectual properties are monetized at scale.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In January 2022, Fanatics acquired Topps for approximately $500 million. This was not a
              financial play to extract value from a legacy brand. It was a strategic acquisition designed
              to bring one of the most recognized names in trading cards into a modern, vertically
              integrated platform.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOUR PILLARS ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-4 text-secondary">
            THE FOUR INFRASTRUCTURE PILLARS
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-4xl" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            Fanatics brings four structural advantages to the Topps Marvel ecosystem that fundamentally
            change the competitive landscape.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "Licensing Control",
                desc: "Fanatics has consolidated the most valuable trading card licenses in sports and entertainment under one roof. NFL, NBA, MLB, and now Disney properties including Marvel, Pixar, and Star Wars. This is not just about having licenses — it is about the ability to coordinate product strategy across the most valuable IPs in global entertainment. When Fanatics plans a Marvel Chrome release, they can coordinate timing, distribution, and marketing with their sports card releases to maximize market impact without cannibalizing their own products.",
                icon: Shield,
                accent: "text-secondary",
                glow: "glow-teal",
              },
              {
                num: "02",
                title: "Direct-to-Consumer Distribution",
                desc: "Fanatics operates one of the largest direct-to-consumer platforms in sports and entertainment. This means Marvel cards are not limited to hobby shops and specialty retailers — they can reach millions of engaged consumers who already interact with the Fanatics ecosystem for sports merchandise, tickets, and collectibles. This distribution advantage is structural. It cannot be replicated quickly by competitors who lack the platform, the consumer relationships, and the data infrastructure.",
                icon: Globe,
                accent: "text-primary",
                glow: "glow-green",
              },
              {
                num: "03",
                title: "Data-Driven Product Development",
                desc: "Traditional card manufacturers made product decisions based on industry experience and limited market feedback. Fanatics has real-time consumer data from millions of transactions across its platform. This data informs which characters drive the most engagement, which price points optimize conversion, which product formats generate the most repeat purchases, and which marketing channels deliver the highest return. Data-driven product development means Topps Marvel products can be refined and optimized in ways that were not previously possible.",
                icon: BarChart3,
                accent: "text-accent",
                glow: "glow-gold",
              },
              {
                num: "04",
                title: "Vertical Integration",
                desc: "From licensing to manufacturing to distribution to consumer engagement — Fanatics controls the full value chain. This vertical integration reduces friction at every stage: faster time to market, more consistent quality control, coordinated marketing, and the ability to respond to market signals in real time. When a Marvel movie generates cultural momentum, the infrastructure exists to capitalize on that momentum with product releases that align with consumer demand.",
                icon: Layers,
                accent: "text-secondary",
                glow: "glow-purple",
              },
            ].map((item, i) => (
              <div key={i} className={`bg-background p-6 rounded-lg border border-border ${item.glow}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-muted-foreground/30">{item.num}</span>
                  <div className={`w-10 h-10 bg-muted rounded-full flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${item.accent}`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-center">
            THE <span className="text-primary">FANATICS TIMELINE</span>
          </h2>
          <div className="space-y-6">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="shrink-0 w-16 text-right">
                  <span className="text-2xl font-bold text-primary">{item.year}</span>
                </div>
                <div className="relative pt-1">
                  <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                  {i < TIMELINE.length - 1 && (
                    <div className="absolute left-1.5 top-4 bottom-0 w-px bg-border h-12" />
                  )}
                </div>
                <div className="pb-6">
                  <h3 className="text-lg font-bold mb-1">{item.event}</h3>
                  <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== THE DISNEY FACTOR ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-accent">
            THE DISNEY FACTOR
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Disney's decision to expand its trading card agreement with Topps and Fanatics was not made
              lightly. Disney Consumer Products evaluates licensing partners based on their ability to
              protect brand integrity, reach consumers at scale, and grow categories over time.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The expanded agreement covers not just Marvel, but also Disney and Pixar properties — signaling
              confidence in Fanatics' ability to manage multiple premium IPs simultaneously. This is
              significant because it means the infrastructure being built for Marvel cards also serves Disney
              and Pixar products, creating economies of scale that benefit the entire ecosystem.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              For collectors, the Disney relationship provides an additional layer of confidence. Disney's
              track record of protecting and growing its intellectual properties suggests a long-term
              commitment to the trading card category — not a short-term licensing experiment.
            </p>
          </div>
        </div>
      </section>

      {/* ===== WHAT THIS MEANS ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-primary">
            WHAT THIS MEANS FOR COLLECTORS
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Fanatics infrastructure advantage translates into several practical implications for
              collectors:
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "Product Consistency",
                  desc: "Coordinated product development means more consistent quality, better-planned release schedules, and products that build on each other rather than competing for attention.",
                },
                {
                  title: "Broader Availability",
                  desc: "Multi-channel distribution means more collectors can access products through their preferred channels — whether that is hobby shops, retail stores, or direct online purchase.",
                },
                {
                  title: "Market Development",
                  desc: "Fanatics' investment in growing the trading card category benefits all participants. A larger, more active market creates more liquidity, more price discovery, and more collecting opportunities.",
                },
                {
                  title: "Long-Term Commitment",
                  desc: "The scale of Fanatics' investment — $500M for Topps, plus ongoing infrastructure development — signals a long-term commitment to the category, not a short-term play.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-card p-5 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
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
              STAY <span className="text-primary">INFORMED</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              The Fanatics era is just beginning. Stay ahead of new releases and market developments.
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
              <Link href="/market-intel/marvel-vs-pokemon-cards">
                <div className="group bg-card p-4 rounded-lg border border-border hover:border-primary/40 transition-all">
                  <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>Previous</p>
                  <p className="font-bold group-hover:text-primary transition-colors">← Marvel vs Pokémon Cards</p>
                </div>
              </Link>
              <Link href="/market-intel/best-topps-marvel-cards">
                <div className="group bg-card p-4 rounded-lg border border-border hover:border-accent/40 transition-all">
                  <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>Next</p>
                  <p className="font-bold group-hover:text-accent transition-colors">Best Topps Marvel Cards to Watch →</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
