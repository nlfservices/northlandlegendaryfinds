/**
 * Shop Page — Whatnot-Exclusive Infinity Series Showcase
 * No purchase buttons — all packs ripped live on Whatnot
 * Features: Infinity Series 1 (completed), Series 2 & 3 (coming soon)
 */

import { useState } from "react";
import { Gem, Radio, Gift, Eye, Sparkles, Shield, Award, Flame, ChevronDown, ChevronUp, ListChecks, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO, { breadcrumbJsonLd, organizationJsonLd } from "@/components/SEO";

const WHATNOT_INVITE = "https://whatnot.com/invite/northlandfinds";
const WHATNOT_PROFILE = "https://www.whatnot.com/user/northlandfinds";
const HERO_IMAGE = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/infinity-series-hero-KjCaTtkrnY7XPqTemut8rw.webp";

const SERIES_DATA = [
  {
    id: 1,
    name: "Infinity Series 1",
    status: "complete" as const,
    cardCount: 165,
    gradedCount: 56,
    oneOfOneCount: 5,
    parallels: ["Encased /100", "Encased /75", "Encased /50", "Orange Foil /25", "Gold Foil /50", "Silver Foil /99", "Black Foil /10", "Black Refractor /10", "Red Foil /5", "Red Refractor /5", "Platinum Refractor /25", "Sketch Cards 1/1", "Printing Plates 1/1"],
    graders: ["AGS", "CGC", "PSA"],
    description: "Our flagship set — 165 premium Marvel cards across Topps Marvel Mint Encased, The Collector, and graded slabs. Includes 5 printing plate 1/1s, sketch cards, numbered parallels down to 1/1, and professionally graded slabs from AGS, CGC, and PSA.",
    checklistUrl: "/nlf-infinity-series-1",
    color: "from-purple-600 to-indigo-600",
    badge: "COMPLETE",
    badgeColor: "bg-green-500 text-black",
  },
  {
    id: 2,
    name: "Infinity Series 2",
    status: "comingSoon" as const,
    cardCount: null,
    gradedCount: null,
    oneOfOneCount: null,
    parallels: ["TBA"],
    graders: ["TBA"],
    description: "Coming soon. Series 2 expands the Infinity universe with new Marvel characters, new parallels, and bigger hits. Follow on Whatnot for live reveals as we build the set.",
    checklistUrl: null,
    color: "from-cyan-600 to-blue-600",
    badge: "COMING SOON",
    badgeColor: "bg-cyan-500 text-black",
  },
  {
    id: 3,
    name: "Infinity Series 3",
    status: "comingSoon" as const,
    cardCount: null,
    gradedCount: null,
    oneOfOneCount: null,
    parallels: ["TBA"],
    graders: ["TBA"],
    description: "Coming soon. The third chapter of the Infinity saga — more details as we source the most premium Marvel cards for this set.",
    checklistUrl: null,
    color: "from-amber-600 to-orange-600",
    badge: "COMING SOON",
    badgeColor: "bg-amber-500 text-black",
  },
];

export default function Shop() {
  const [expandedSeries, setExpandedSeries] = useState<number | null>(1);

  return (
    <div className="min-h-screen">
      <SEO
        title="Infinity Series — Premium Marvel Card Repacks | Ripped Live on Whatnot"
        description="The NLF Infinity Series: premium Marvel trading card repacks ripped exclusively live on Whatnot. Graded slabs, numbered parallels, and 1/1 printing plates. Coming soon."
        path="/shop"
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Shop", url: "/shop" }]),
          organizationJsonLd(),
        ]}
      />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[480px] lg:min-h-[560px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full">
                <Radio className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-primary text-sm font-bold tracking-wide">RIPPED LIVE ON WHATNOT — EVERY PACK, EVERY TIME</span>
              </div>
              <div className="inline-flex items-center px-3 py-1.5 bg-card/80 border border-primary/20 rounded-full">
                <span className="text-primary text-xs font-bold tracking-widest uppercase">Coming soon</span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.9] mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              <span className="text-primary">INFINITY</span> SERIES
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl">
              Premium Marvel trading card repacks for collectors who want transparency, quality, and a live rip. No mystery. No gimmicks. Cards opened on camera.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02]">
                  <Gift className="w-5 h-5 mr-2" />
                  Get $15 Free Whatnot Credit
                </Button>
              </a>
              <a href={WHATNOT_PROFILE} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold transition-all hover:scale-[1.02]">
                  <Radio className="w-5 h-5 mr-2" />
                  Follow for Show Alerts
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-14 border-b border-border">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10" style={{ fontFamily: "'Anton', sans-serif" }}>
            HOW <span className="text-primary">IT WORKS</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                <ListChecks className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Full Checklist Published</h3>
              <p className="text-muted-foreground text-sm">Every card is listed publicly before the show. You know exactly what you're chasing.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                <Radio className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Ripped Live on Whatnot</h3>
              <p className="text-muted-foreground text-sm">Every pack is opened on camera. No pre-rips. No cherry-picking.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Graded & Authenticated</h3>
              <p className="text-muted-foreground text-sm">Premium slabs from AGS, CGC, and PSA. Raw numbered cards in magnetic holders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERIES ===== */}
      <section className="py-14">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              THE <span className="text-primary">SERIES</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Curated Marvel collections. Series 1 is complete. Series 2 & 3 are coming soon.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {SERIES_DATA.map((series) => (
              <div
                key={series.id}
                className={`relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 ${
                  expandedSeries === series.id ? "shadow-lg border-primary/25" : "hover:border-primary/30"
                }`}
              >
                <button
                  onClick={() => setExpandedSeries(expandedSeries === series.id ? null : series.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${series.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <span className="text-white font-bold text-xl">{series.id}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                        <h3 className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                          {series.name}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${series.badgeColor}`}>
                          {series.badge}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {series.status === "complete"
                          ? `${series.cardCount} cards • ${series.gradedCount} graded slabs • ${series.oneOfOneCount} 1/1s`
                          : "Coming soon — follow for reveals"}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {expandedSeries === series.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expandedSeries === series.id && (
                  <div className="px-5 sm:px-6 pb-6 border-t border-border pt-5">
                    <p className="text-muted-foreground mb-6">{series.description}</p>

                    {series.status === "complete" && (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-primary">{series.cardCount}</div>
                            <div className="text-xs text-muted-foreground">Total Cards</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-purple-400">{series.gradedCount}</div>
                            <div className="text-xs text-muted-foreground">Graded Slabs</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-amber-400">{series.oneOfOneCount}</div>
                            <div className="text-xs text-muted-foreground">1/1 Cards</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-cyan-400">13</div>
                            <div className="text-xs text-muted-foreground">Parallel Tiers</div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Parallel Tiers</h4>
                          <div className="flex flex-wrap gap-2">
                            {series.parallels.map((p) => (
                              <span key={p} className="px-3 py-1 bg-muted/50 border border-border rounded-full text-xs font-medium text-foreground">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Grading Companies</h4>
                          <div className="flex gap-3">
                            {series.graders.map((g) => (
                              <span key={g} className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-sm font-bold text-primary">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>

                        {series.checklistUrl && (
                          <Link href={series.checklistUrl}>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                              <Eye className="w-4 h-4 mr-2" />
                              View Full Checklist ({series.cardCount} Cards)
                            </Button>
                          </Link>
                        )}
                      </>
                    )}

                    {series.status === "comingSoon" && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 sm:p-8 text-center">
                        <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                        <p className="text-xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                          Coming soon
                        </p>
                        <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
                          This Marvel series is being assembled. Follow on Whatnot for live reveals.
                        </p>
                        <a href={WHATNOT_PROFILE} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                            <Radio className="w-4 h-4 mr-2" />
                            Follow for Updates
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BREAK RUNS (quiet link — header left alone) ===== */}
      <section className="pb-14">
        <div className="container">
          <Link href="/breaks" className="mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-2xl border border-border bg-card/80 px-5 py-5 transition-colors hover:border-primary/40 sm:px-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Whatnot only</p>
              <h3 className="mt-1 text-xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                BREAK RUNS
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Odds, packs left, checklist. Spots on Whatnot — not here.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 flex-shrink-0 text-primary" />
          </Link>
        </div>
      </section>

      {/* ===== COMING SOON CTA ===== */}
      <section className="py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />

        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-5">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide">WHATNOT EXCLUSIVE</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              COMING <span className="text-primary">SOON</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              The Infinity Series launches live on Whatnot. Every pack ripped on camera. Every Marvel card revealed in real time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] w-full sm:w-auto">
                  <Gift className="w-5 h-5 mr-2" />
                  Get $15 Free Credit + Follow
                </Button>
              </a>
              <Link href="/nlf-infinity-series-1">
                <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold transition-all hover:scale-[1.02] w-full sm:w-auto">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Checklist (165 Cards)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST ===== */}
      <section className="py-14 border-t border-border">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-5 text-center">
              <Shield className="w-7 h-7 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">100% Live Rips</h3>
              <p className="text-sm text-muted-foreground">Every pack opened on camera.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-center">
              <ListChecks className="w-7 h-7 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">Published Checklists</h3>
              <p className="text-sm text-muted-foreground">Full card list before every show.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-center">
              <Award className="w-7 h-7 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">Graded Cards</h3>
              <p className="text-sm text-muted-foreground">AGS, CGC, and PSA slabs in every series.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-center">
              <Gem className="w-7 h-7 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">Premium Only</h3>
              <p className="text-sm text-muted-foreground">Numbered parallels, refractors, and 1/1s.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
