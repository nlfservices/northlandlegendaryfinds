/**
 * Market Intel - Supporting Page 1
 * "2024 vs 2025 Topps Marvel Explained"
 */

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ChevronRight, Calendar, Globe, TrendingUp } from "lucide-react";
import SEO, { breadcrumbJsonLd, faqJsonLd } from "@/components/SEO";

const FAQ_DATA = [
  {
    question: "Did Topps make Marvel cards in 2024?",
    answer: "Yes. Topps UK released Marvel Chrome 2024 on August 30, 2024, and a Sapphire Edition in October 2024. Both were available exclusively through the UK Topps Launches platform.",
  },
  {
    question: "Was 2024 Topps Marvel only available overseas?",
    answer: "Yes. The 2024 Topps Marvel Chrome releases were limited to the UK market through the Topps UK Launches platform. There was no US retail distribution or global availability.",
  },
  {
    question: "Is 2025 the real start of Topps Marvel?",
    answer: "2025 is the first year of full-scale, global Topps Marvel product releases. With 8+ product lines covering MCU, Comics, character-specific, and premium tiers, 2025 represents the true beginning of the Topps Marvel era at global scale.",
  },
  {
    question: "Are 2024 Topps Marvel UK cards valuable?",
    answer: "The 2024 UK releases are historically significant as the first-ever Topps Marvel Chrome products. Their limited availability and early-timeline positioning give them a unique place in the Topps Marvel catalog.",
  },
  {
    question: "What Topps Marvel sets are coming in 2025?",
    answer: "The 2025 lineup includes Marvel Studios Chrome, Chrome Marvel Comics, Mint Marvel, Sapphire Edition, Comic Book Heroes 1975 Anniversary, Infinity MCU Phase 1, Chrome Deadpool, and Marvel The Collector, among others.",
  },
];

const TIMELINE = [
  { date: "January 2022", event: "Fanatics acquires Topps for ~$500M", type: "milestone" },
  { date: "August 30, 2024", event: "Topps UK releases Marvel Chrome 2024 (UK-only)", type: "preview" },
  { date: "September 12, 2024", event: "Topps/Fanatics expand Disney deal to include global Marvel rights", type: "milestone" },
  { date: "October 2024", event: "Topps UK releases Marvel Chrome 2024 Sapphire Edition", type: "preview" },
  { date: "2025", event: "Full global launch: 8+ Topps Marvel product lines", type: "launch" },
  { date: "June 16, 2025", event: "Marvel 616 Day — Chrome Marvel Comics launch event", type: "launch" },
  { date: "February 2026", event: "2025 Topps Marvel The Collector release", type: "launch" },
];

export default function MarketIntel2024vs2025() {
  return (
    <div className="min-h-screen">
      <SEO
        title="2024 vs 2025 Topps Marvel Cards: What Changed and Why It Matters"
        description="2024 Topps Marvel was a limited UK preview. 2025 is the true global launch. Understand the timeline, the products, and why this distinction matters for collectors."
        path="/market-intel/2024-vs-2025-topps-marvel"
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Market Intel", url: "/market-intel" },
            { name: "2024 vs 2025", url: "/market-intel/2024-vs-2025-topps-marvel" },
          ]),
          faqJsonLd(FAQ_DATA),
        ]}
      />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[400px] flex items-center overflow-hidden space-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container relative z-10 py-16">
          <div className="max-w-4xl">
            <Link href="/market-intel" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Market Intel
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full mb-6 ml-4">
              <Calendar className="w-4 h-4 text-secondary" />
              <span className="text-secondary text-sm font-bold tracking-wide" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                TIMELINE ANALYSIS
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] mb-6">
              <span className="text-secondary">2024</span> VS <span className="text-primary">2025</span>{" "}
              TOPPS MARVEL
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              The Preview Phase and the Real Launch — understanding this distinction is essential for
              anyone evaluating the Topps Marvel market.
            </p>
          </div>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <p className="text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            One of the most common questions in the Marvel trading card community is straightforward: did
            Topps release Marvel cards in 2024? The answer is yes — but with critical context that changes
            how collectors should think about the timeline. Understanding the distinction between 2024 and
            2025 is essential for anyone evaluating the Topps Marvel market, whether you are collecting,
            investing, or simply tracking the evolution of the hobby.
          </p>
        </div>
      </section>

      {/* ===== WHAT HAPPENED IN 2024 ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-secondary">
            WHAT HAPPENED IN 2024
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              On August 30, 2024, Topps UK released Marvel Chrome 2024 through the Topps UK Launches
              platform. This was the first-ever Marvel Chrome product produced by Topps. A Sapphire Edition
              followed in October 2024, also through the UK platform.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              These releases were significant for what they represented — the beginning of Topps' Marvel
              card production — but they were limited in several important ways:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Geographic Restriction",
                  desc: "Both products were available exclusively through the UK Topps Launches platform. No US retail distribution, no hobby shop allocation, no global availability.",
                  icon: Globe,
                },
                {
                  title: "Limited Awareness",
                  desc: "Confined to a single regional platform, the majority of the global collecting community was either unaware of them or unable to participate.",
                  icon: Calendar,
                },
                {
                  title: "Preview-Scale Production",
                  desc: "These functioned as proof-of-concept releases — demonstrating capability while broader infrastructure was still being finalized.",
                  icon: TrendingUp,
                },
              ].map((item, i) => (
                <div key={i} className="bg-background p-5 rounded-lg border border-border">
                  <div className="w-9 h-9 bg-secondary/15 rounded-full flex items-center justify-center mb-3">
                    <item.icon className="w-4 h-4 text-secondary" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              For collectors who recognized the moment and secured 2024 UK products, these represent the
              earliest Topps Marvel Chrome cards in existence. Their historical significance as "first
              editions" in the Topps Marvel era is notable.
            </p>
          </div>
        </div>
      </section>

      {/* ===== WHAT CHANGED FOR 2025 ===== */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold mb-4 text-primary">
            WHAT CHANGED FOR 2025
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-4xl" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            The September 12, 2024 announcement changed everything. Topps officially expanded its agreement
            with Disney Consumer Products to include global Disney, Pixar, and Marvel trading card rights.
            This was not a regional deal or a limited license — it was a comprehensive global agreement.
          </p>

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>Dimension</th>
                  <th className="px-4 py-3 text-sm font-bold text-secondary uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>2024 (UK Preview)</th>
                  <th className="px-4 py-3 text-sm font-bold text-primary uppercase tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>2025 (Global Launch)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Products", "1 base product", "8+ distinct product lines"],
                  ["Premium Variants", "1 (Sapphire Edition)", "Multiple (Sapphire, Mint, Chrome)"],
                  ["Distribution", "UK-only", "Global (US retail, hobby, DTC)"],
                  ["Channels", "Single platform", "Multi-channel (GameStop, hobby, Topps.com, Fanatics)"],
                  ["IP Coverage", "Comics characters only", "MCU + Comics + Character-specific + Heritage"],
                  ["US Retail", "None", "Full rollout"],
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

      {/* ===== WHY THIS MATTERS ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-accent">
            WHY THIS DISTINCTION MATTERS
          </h2>
          <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Understanding the 2024-to-2025 transition matters for three reasons:
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "Market Timing",
                  desc: "Collectors who understand that 2025 represents the true beginning of the global Topps Marvel era can make more informed decisions about which products to prioritize and how to evaluate the market trajectory.",
                },
                {
                  title: "Historical Context",
                  desc: "The 2024 UK releases have a specific place in the timeline — they are the earliest Topps Marvel Chrome products, produced before the global license was fully activated. This context affects how collectors value and categorize these products.",
                },
                {
                  title: "Forward Trajectory",
                  desc: "The expansion from 2 products in 2024 to 8+ in 2025 signals the pace and ambition of the Topps Marvel rollout. This is not a slow, tentative entry — it is a full-scale launch backed by Fanatics infrastructure and Disney licensing.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-background p-5 rounded-lg border border-border">
                  <h3 className="text-lg font-bold mb-2 text-accent">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-center">
            THE <span className="text-primary">LICENSING TIMELINE</span>
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={i} className={`relative flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`}>
                    <div className={`inline-block bg-card p-4 rounded-lg border border-border ${item.type === "milestone" ? "glow-purple" : item.type === "preview" ? "glow-teal" : "glow-green"}`}>
                      <p className="text-sm font-bold text-primary mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>{item.date}</p>
                      <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>{item.event}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1.5 mt-2 z-10 ring-4 ring-background" />

                  {/* Mobile view */}
                  <div className="ml-10 md:hidden">
                    <div className={`bg-card p-4 rounded-lg border border-border ${item.type === "milestone" ? "glow-purple" : item.type === "preview" ? "glow-teal" : "glow-green"}`}>
                      <p className="text-sm font-bold text-primary mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>{item.date}</p>
                      <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>{item.event}</p>
                    </div>
                  </div>

                  <div className="flex-1 hidden md:block" />
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
              The Topps Marvel timeline is still being written. Stay ahead of new releases and market developments.
            </p>
            <Link href="/subscribe">
              <Button size="lg" className="bg-primary hover:bg-primary/90 font-bold text-lg px-10 py-6">
                Get Notified for Drops
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Related pages */}
          <div className="border-t border-border pt-10">
            <p className="text-sm text-muted-foreground mb-4 text-center uppercase tracking-wider font-bold">Continue Reading</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/market-intel/topps-vs-upper-deck-marvel">
                <div className="group bg-card p-4 rounded-lg border border-border hover:border-primary/40 transition-all">
                  <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>Next</p>
                  <p className="font-bold group-hover:text-primary transition-colors">Topps vs Upper Deck Marvel →</p>
                </div>
              </Link>
              <Link href="/market-intel/why-fanatics-trading-cards">
                <div className="group bg-card p-4 rounded-lg border border-border hover:border-secondary/40 transition-all">
                  <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}>Related</p>
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
