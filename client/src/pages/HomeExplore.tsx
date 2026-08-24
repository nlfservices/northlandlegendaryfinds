import { useState } from "react";
import { ArrowRight, Search, Users, TrendingUp, Compass, Award, ChevronDown, ChevronUp, Crown } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import MarvelousTop5 from "@/components/MarvelousTop5";
import {
  SPIDER_MAN_CARD,
  LEGACY_LEGENDS,
} from "./homeShared";

// Legacy Legend Card with Read More toggle
function LegacyLegendCard({ legend }: { legend: typeof LEGACY_LEGENDS[number] }) {
  const [expanded, setExpanded] = useState(false);
  const NOTE_PREVIEW_LENGTH = 100;
  const isLong = legend.note.length > NOTE_PREVIEW_LENGTH;
  const displayNote = expanded || !isLong ? legend.note : legend.note.slice(0, NOTE_PREVIEW_LENGTH).trimEnd() + "...";

  return (
    <div className="group relative">
      {/* Spotlight glow effect */}
      <div className={`absolute -inset-3 bg-gradient-to-b ${legend.badgeColor} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />

      <div className={`relative bg-card/80 backdrop-blur-sm border-2 ${legend.borderColor} rounded-2xl overflow-hidden hover:border-opacity-80 transition-all duration-500 group-hover:shadow-2xl ${legend.glowColor}`}>
        {/* Badge */}
        <div className="absolute top-3 right-3 z-20">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r ${legend.badgeColor} ${legend.badgeTextColor} text-xs font-bold rounded-full shadow-lg`}>
            <Award className="w-3 h-3" />
            {legend.badge}
          </span>
        </div>

        {/* Card Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={legend.image}
            alt={`${legend.actorName} as ${legend.characterName} - Legacy Legend trading card`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent" />
        </div>

        {/* Card Info */}
        <div className="p-4">
          <h3 className={`text-lg font-bold ${legend.accentColor} mb-0.5`} style={{ fontFamily: "'Anton', sans-serif" }}>
            {legend.actorName}
          </h3>
          <p className="text-sm text-muted-foreground font-medium mb-2">
            as <span className="text-foreground">{legend.characterName}</span>
          </p>
          <p className="text-xs text-muted-foreground/80 leading-relaxed">
            {displayNote}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className={`inline-flex items-center gap-1 mt-2 text-xs font-semibold ${legend.accentColor} hover:underline transition-colors cursor-pointer`}
            >
              {expanded ? (
                <><ChevronUp className="w-3 h-3" /> Read less</>
              ) : (
                <><ChevronDown className="w-3 h-3" /> Read more</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomeExplore() {
  return (
    <>
      {/* ===== 6. MARVELOUS TOP 5 ===== */}
      <MarvelousTop5 />

      {/* ===== 7. EXPLORE OUR COLLECTION — Spider-Man CTA ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        {/* Deep Purple Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-purple-950/95 to-purple-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-800/15 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            {/* Left: Spider-Man Card */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-8 bg-blue-500/10 rounded-3xl blur-3xl group-hover:bg-blue-500/15 transition-all" />
                <img
                  src={SPIDER_MAN_CARD}
                  alt="Spider-Man trading card"
                  className="relative w-56 sm:w-72 rounded-xl shadow-2xl shadow-blue-500/20 rotate-[2deg] group-hover:rotate-0 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
            {/* Right: CTA */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                SEE WHAT'S <span className="text-primary">OUT THERE</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We've cataloged every card from the 2025 Topps Marvel sets — Chrome, Comic Book Heroes, Mint, Sapphire, Studios, and more. Search by your favorite character, browse by set, or just scroll and see what catches your eye. It's completely free.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/cards">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                    <Search className="w-5 h-5 mr-2" />
                    Search Cards
                  </Button>
                </Link>
                <Link href="/characters">
                  <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                    <Users className="w-5 h-5 mr-2" />
                    Characters
                  </Button>
                </Link>
                <Link href="/market-intel">
                  <Button size="lg" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-bold">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Market Prices
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 8. LEGACY LEGENDS — ACTOR-FOCUSED PREMIUM SECTION ===== */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Rich Gold/Amber Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950 via-amber-950/95 to-amber-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-800/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full mb-5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold tracking-widest uppercase">Premium Collection</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">LEGACY</span>{" "}
              <span className="text-foreground">LEGENDS</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Where character meets immortality. These actors didn't just play heroes — they <em>became</em> them. Their debut autograph cards in the 2025 Topps Marvel Studios set represent some of the most significant pulls in the hobby.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6 max-w-7xl mx-auto">
            {LEGACY_LEGENDS.map((legend) => (
              <LegacyLegendCard key={legend.id} legend={legend} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground text-sm mb-4">
              More Legacy Legends coming soon — as new debut autos are confirmed in upcoming sets.
            </p>
            <Link href="/cards">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 font-bold">
                <Search className="w-4 h-4 mr-2" />
                Explore the Full Card Database
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 9. YOUR FANDOM, YOUR WAY — EXPANSION ROADMAP ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        {/* NLF Green Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-950 via-green-950/95 to-green-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-800/15 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/15 border border-cyan-500/30 rounded-full mb-4">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-bold tracking-wide">WHERE WE'RE HEADED</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              YOUR FANDOM, <span className="text-primary">YOUR WAY</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              We're starting with Marvel — but this is just the beginning. NLF is building a home for fans and collectors across every universe you love. Stay tuned and stay informed.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {/* Marvel — Active */}
            <div className="relative group">
              <div className="bg-card border-2 border-primary/50 rounded-xl p-5 text-center hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="absolute -top-2 -right-2">
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">LIVE</span>
                </div>
                <div className="text-4xl mb-3">🦸</div>
                <h3 className="font-bold text-sm mb-1">Marvel</h3>
                <p className="text-xs text-primary font-bold">Explore Now</p>
              </div>
            </div>

            {/* Star Wars — Coming Soon */}
            <div className="relative group">
              <div className="bg-card border border-amber-500/30 rounded-xl p-5 text-center hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
                <div className="absolute -top-2 -right-2">
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SOON</span>
                </div>
                <div className="text-4xl mb-3">⚔️</div>
                <h3 className="font-bold text-sm mb-1">Star Wars</h3>
                <p className="text-xs text-amber-400 font-bold">Fall 2026</p>
              </div>
            </div>

            {/* Disney — Future */}
            <div className="group">
              <div className="bg-card/60 border border-border rounded-xl p-5 text-center hover:border-blue-500/30 transition-all duration-300 opacity-80 hover:opacity-100">
                <div className="text-4xl mb-3">🏰</div>
                <h3 className="font-bold text-sm mb-1">Disney</h3>
                <p className="text-xs text-muted-foreground">Fall 2026</p>
              </div>
            </div>

            {/* WWE — Future */}
            <div className="group">
              <div className="bg-card/60 border border-border rounded-xl p-5 text-center hover:border-red-500/30 transition-all duration-300 opacity-80 hover:opacity-100">
                <div className="text-4xl mb-3">🤼</div>
                <h3 className="font-bold text-sm mb-1">WWE</h3>
                <p className="text-xs text-muted-foreground">Fall 2026</p>
              </div>
            </div>

            {/* UFC — Future */}
            <div className="group">
              <div className="bg-card/60 border border-border rounded-xl p-5 text-center hover:border-orange-500/30 transition-all duration-300 opacity-80 hover:opacity-100">
                <div className="text-4xl mb-3">🥊</div>
                <h3 className="font-bold text-sm mb-1">UFC</h3>
                <p className="text-xs text-muted-foreground">Summer 2026</p>
              </div>
            </div>

            {/* Boxing — Future */}
            <div className="group">
              <div className="bg-card/60 border border-border rounded-xl p-5 text-center hover:border-yellow-500/30 transition-all duration-300 opacity-80 hover:opacity-100">
                <div className="text-4xl mb-3">🥇</div>
                <h3 className="font-bold text-sm mb-1">Boxing</h3>
                <p className="text-xs text-muted-foreground">Fall 2026</p>
              </div>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm mb-4">Want to be first to know when new fandoms drop?</p>
            <NewsletterSignup variant="sidebar" source="homepage-fandom-roadmap" headline="Get Notified" subtext="Be the first to know when new fandoms launch" />
          </div>
        </div>
      </section>
    </>
  );
}
