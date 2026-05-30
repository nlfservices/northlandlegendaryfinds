/**
 * Shop Page — Whatnot-Exclusive Infinity Series Showcase
 * No purchase buttons — all packs ripped live on Whatnot
 * Features: Infinity Series 1 (completed), Series 2 & 3 (building)
 * Launch: June 7th, 2026
 */

import { useState, useEffect } from "react";
import { Gem, Radio, Gift, Eye, Sparkles, Shield, Award, Flame, ChevronDown, ChevronUp, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO, { breadcrumbJsonLd, organizationJsonLd } from "@/components/SEO";

// Constants
const WHATNOT_INVITE = "https://whatnot.com/invite/northlandfinds";
const WHATNOT_PROFILE = "https://www.whatnot.com/user/northlandfinds";
const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/infinity-series-hero-KjCaTtkrnY7XPqTemut8rw.webp";

// Launch date: June 7, 2026 at 7:00 PM CDT (UTC-5)
const LAUNCH_DATE = new Date("2026-06-07T19:00:00-05:00").getTime();

// Countdown hook
function useCountdown(targetMs: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);
  if (targetMs <= now) return null;
  const diff = targetMs - now;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

// Series data
const SERIES_DATA = [
  {
    id: 1,
    name: "Infinity Series 1",
    status: "complete" as const,
    cardCount: 85,
    gradedCount: 43,
    oneOfOneCount: 5,
    parallels: ["Bronze /100", "Silver /75", "Gold /50", "Platinum Refractor /99", "Gold Refractors /50-75", "Orange Refractor /50", "Printing Plates 1/1", "Gambit's Deck Insert /99"],
    graders: ["AGS", "CGC", "BGS"],
    description: "Our flagship set — 85 premium Topps Marvel Mint cards across 13 parallel tiers. Raw numbered cards in magnetic holders, plus professionally graded slabs from AGS, CGC, and BGS. Includes 5 Printing Plate 1/1s and exclusive Gambit's Deck inserts.",
    checklistUrl: "/nlf-series-1",
    color: "from-purple-600 to-indigo-600",
    glowColor: "purple",
    badge: "COMPLETE",
    badgeColor: "bg-green-500 text-black",
  },
  {
    id: 2,
    name: "Infinity Series 2",
    status: "building" as const,
    cardCount: null,
    gradedCount: null,
    oneOfOneCount: null,
    parallels: ["TBA"],
    graders: ["TBA"],
    description: "Currently being assembled. Series 2 will expand the Infinity universe with new characters, new parallels, and even bigger hits. Follow us for reveals as we build this set live.",
    checklistUrl: null,
    color: "from-cyan-600 to-blue-600",
    glowColor: "cyan",
    badge: "BUILDING NOW",
    badgeColor: "bg-cyan-500 text-black",
  },
  {
    id: 3,
    name: "Infinity Series 3",
    status: "building" as const,
    cardCount: null,
    gradedCount: null,
    oneOfOneCount: null,
    parallels: ["TBA"],
    graders: ["TBA"],
    description: "The third chapter of the Infinity saga. More details coming soon as we source the most premium cards for this set.",
    checklistUrl: null,
    color: "from-amber-600 to-orange-600",
    glowColor: "amber",
    badge: "COMING SOON",
    badgeColor: "bg-amber-500 text-black",
  },
];

export default function Shop() {
  const countdown = useCountdown(LAUNCH_DATE);
  const [expandedSeries, setExpandedSeries] = useState<number | null>(1);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen">
      <SEO
        title="Infinity Series — Premium Marvel Card Repacks | Ripped Live on Whatnot"
        description="The NLF Infinity Series: premium Marvel trading card repacks ripped exclusively live on Whatnot. 85+ cards per series, graded slabs, numbered parallels, and 1/1 printing plates. First show June 7th, 2026."
        path="/shop"
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Shop", url: "/shop" }]),
          organizationJsonLd(),
        ]}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 py-16 lg:py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
              <Radio className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-primary text-sm font-bold tracking-wide">RIPPED LIVE ON WHATNOT — EVERY PACK, EVERY TIME</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.9] mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              <span className="text-primary">INFINITY</span> SERIES
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Premium Marvel trading card repacks built for collectors who want transparency, quality, and the thrill of a live rip. No mystery. No gimmicks. Just incredible cards opened on camera.
            </p>

            {/* Countdown */}
            {countdown && (
              <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wider font-bold">First Live Show — June 7th</p>
                <div className="flex gap-3">
                  {[
                    { label: "DAYS", value: countdown.days },
                    { label: "HRS", value: countdown.hours },
                    { label: "MIN", value: countdown.minutes },
                    { label: "SEC", value: countdown.seconds },
                  ].map((unit) => (
                    <div key={unit.label} className="bg-card/80 backdrop-blur border border-primary/20 rounded-lg px-4 py-3 text-center min-w-[70px]">
                      <div className="text-3xl font-bold text-primary font-mono tabular-nums">{pad(unit.value)}</div>
                      <div className="text-[10px] text-muted-foreground font-bold tracking-wider">{unit.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
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
      <section className="py-16 border-b border-border">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: "'Anton', sans-serif" }}>
            HOW <span className="text-primary">IT WORKS</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                <ListChecks className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Full Checklist Published</h3>
              <p className="text-muted-foreground text-sm">Every card in the series is listed publicly before the show. You know exactly what you're chasing.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                <Radio className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Ripped Live on Whatnot</h3>
              <p className="text-muted-foreground text-sm">Every single pack is opened on camera during our live shows. No pre-rips. No cherry-picking. 100% transparent.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Graded & Authenticated</h3>
              <p className="text-muted-foreground text-sm">Premium slabs from AGS, CGC, and BGS. Raw numbered cards in BCW magnetic holders. Quality you can trust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERIES SHOWCASE ===== */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              THE <span className="text-primary">SERIES</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each Infinity Series is a curated collection of premium Marvel cards. Series 1 is complete and ready to rip. Series 2 & 3 are currently being built.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {SERIES_DATA.map((series) => (
              <div
                key={series.id}
                className={`relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 ${
                  expandedSeries === series.id ? "shadow-lg" : "hover:border-primary/30"
                }`}
              >
                {/* Series Header — always visible */}
                <button
                  onClick={() => setExpandedSeries(expandedSeries === series.id ? null : series.id)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Series number orb */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${series.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <span className="text-white font-bold text-xl">{series.id}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                          {series.name}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${series.badgeColor}`}>
                          {series.badge}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {series.status === "complete"
                          ? `${series.cardCount} cards • ${series.gradedCount} graded slabs • ${series.oneOfOneCount} 1/1s`
                          : "Details coming soon — follow for reveals"}
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

                {/* Expanded content */}
                {expandedSeries === series.id && (
                  <div className="px-6 pb-6 border-t border-border pt-6">
                    <p className="text-muted-foreground mb-6">{series.description}</p>

                    {series.status === "complete" && (
                      <>
                        {/* Stats grid */}
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

                        {/* Parallels */}
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

                        {/* Graders */}
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

                        {/* CTA */}
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

                    {series.status === "building" && (
                      <div className="bg-muted/30 border border-dashed border-border rounded-xl p-8 text-center">
                        <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground font-medium mb-4">
                          This series is currently being assembled. Follow us on Whatnot for live reveals as we build it.
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

      {/* ===== JUNE 7TH LAUNCH CTA ===== */}
      <section className="py-16 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />

        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide">FIRST SHOW</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              JUNE <span className="text-primary">7TH</span>, 2026
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              The Infinity Series launches live on Whatnot. Every pack ripped on camera. Every card revealed in real time. Don't miss the first drop.
            </p>

            {/* Countdown (if before launch) */}
            {countdown && (
              <div className="flex justify-center gap-3 mb-8">
                {[
                  { label: "DAYS", value: countdown.days },
                  { label: "HRS", value: countdown.hours },
                  { label: "MIN", value: countdown.minutes },
                  { label: "SEC", value: countdown.seconds },
                ].map((unit) => (
                  <div key={unit.label} className="bg-card border border-primary/20 rounded-lg px-4 py-3 text-center min-w-[70px]">
                    <div className="text-2xl font-bold text-primary font-mono tabular-nums">{pad(unit.value)}</div>
                    <div className="text-[10px] text-muted-foreground font-bold tracking-wider">{unit.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] w-full sm:w-auto">
                  <Gift className="w-5 h-5 mr-2" />
                  Get $15 Free Credit + Follow
                </Button>
              </a>
              <Link href="/nlf-series-1">
                <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold transition-all hover:scale-[1.02] w-full sm:w-auto">
                  <Eye className="w-5 h-5 mr-2" />
                  Preview Series 1 Checklist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST / WHY NLF ===== */}
      <section className="py-16 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">100% Live Rips</h3>
              <p className="text-sm text-muted-foreground">Every pack opened on camera. No pre-rips. No cherry-picking.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <ListChecks className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">Published Checklists</h3>
              <p className="text-sm text-muted-foreground">Full card list published before every show. Total transparency.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Award className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">Graded Cards</h3>
              <p className="text-sm text-muted-foreground">Professional slabs from AGS, CGC, and BGS included in every series.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Gem className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">Premium Only</h3>
              <p className="text-sm text-muted-foreground">Numbered parallels, refractors, and 1/1 printing plates. No filler.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
