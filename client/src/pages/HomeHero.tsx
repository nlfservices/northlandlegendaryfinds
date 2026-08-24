import { Sparkles, Users, ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO, { organizationJsonLd, websiteJsonLd, localBusinessJsonLd } from "@/components/SEO";
import DoomsdayTicker from "@/components/DoomsdayTicker";
import {
  HERO_BG,
  DOOM_CARD,
  IRON_MAN_CARD,
  SPIDER_MAN_CARD,
  FF_CARD,
  BLACK_PANTHER_CARD,
} from "./homeShared";

export default function HomeHero() {
  return (
    <>
      {/* Sticky Doomsday Countdown Ticker */}
      <DoomsdayTicker />

      <SEO
        path="/"
        title="Northland Legendary Finds | Marvel Trading Card Collector Hub"
        description="Your home for Marvel fans and trading card collectors. Explore characters, track Avengers: Doomsday news, browse 1,709+ cards, and discover the hobby — whether you're brand new or a lifelong collector."
        noSuffix
        jsonLd={[organizationJsonLd(), websiteJsonLd(), localBusinessJsonLd()]}
      />

      {/* ===== 1. HERO — FAN-FIRST ===== */}
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[720px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover object-top" loading="eager" decoding="async" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Fan-First Messaging */}
            <div className="py-12 lg:py-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-bold tracking-wide">FOR FANS & COLLECTORS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] mb-4 sm:mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-white">LOVE MARVEL?</span>
                <br />
                <span className="text-primary">START HERE.</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-lg mb-8 leading-relaxed">
                Whether you grew up reading comics, watched every movie with your kids, or can't wait for Avengers: Doomsday - you're in the right place.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/characters">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 shadow-lg shadow-primary/20">
                    <Users className="w-5 h-5 mr-2" />
                    Discover Your Heroes
                  </Button>
                </Link>
                <a href="#new-to-collecting">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold text-lg px-8 py-6">
                    New to Collecting?
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Right: Floating Character Cards */}
            <div className="hidden lg:flex justify-center items-center relative h-[500px]">
              {/* Doctor Doom - center, largest */}
              <div className="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-green-500/15 rounded-2xl blur-2xl group-hover:bg-green-500/25 transition-all" />
                  <img
                    src={DOOM_CARD}
                    alt="Doctor Doom trading card"
                    className="relative w-48 xl:w-56 rounded-xl shadow-2xl shadow-green-500/20 hover:scale-105 transition-transform duration-500 rotate-[-2deg]"
                    loading="eager"
                  />
                </div>
              </div>
              {/* Iron Man - top left */}
              <div className="absolute z-20 top-4 left-4 xl:left-0">
                <img
                  src={IRON_MAN_CARD}
                  alt="Iron Man trading card"
                  className="w-32 xl:w-36 rounded-lg shadow-xl shadow-red-500/15 hover:scale-105 transition-transform duration-500 rotate-[-8deg] opacity-90 hover:opacity-100"
                  loading="eager"
                />
              </div>
              {/* Spider-Man - top right */}
              <div className="absolute z-20 top-8 right-4 xl:right-0">
                <img
                  src={SPIDER_MAN_CARD}
                  alt="Spider-Man trading card"
                  className="w-32 xl:w-36 rounded-lg shadow-xl shadow-blue-500/15 hover:scale-105 transition-transform duration-500 rotate-[6deg] opacity-90 hover:opacity-100"
                  loading="eager"
                />
              </div>
              {/* Fantastic Four - bottom left */}
              <div className="absolute z-10 bottom-8 left-8 xl:left-4">
                <img
                  src={FF_CARD}
                  alt="Fantastic Four trading card"
                  className="w-28 xl:w-32 rounded-lg shadow-xl shadow-blue-400/15 hover:scale-105 transition-transform duration-500 rotate-[5deg] opacity-80 hover:opacity-100"
                  loading="lazy"
                />
              </div>
              {/* Black Panther - bottom right */}
              <div className="absolute z-10 bottom-4 right-8 xl:right-4">
                <img
                  src={BLACK_PANTHER_CARD}
                  alt="Black Panther trading card"
                  className="w-28 xl:w-32 rounded-lg shadow-xl shadow-purple-500/15 hover:scale-105 transition-transform duration-500 rotate-[-4deg] opacity-80 hover:opacity-100"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. STATS BAR — SIMPLIFIED FOR NEWCOMERS ===== */}
      <section className="bg-card border-y border-border">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            <Link href="/characters">
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform" style={{ fontFamily: "'Anton', sans-serif" }}>200+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 group-hover:text-primary transition-colors">Marvel Characters</div>
              </div>
            </Link>
            <Link href="/cards">
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-cyan-400 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Anton', sans-serif" }}>1,709+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 group-hover:text-cyan-400 transition-colors">Cards to Explore</div>
              </div>
            </Link>
            <Link href="/cards">
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-amber-400 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Anton', sans-serif" }}>6</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 group-hover:text-amber-400 transition-colors">Card Sets</div>
              </div>
            </Link>
            <Link href="/the-collector">
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Anton', sans-serif" }}>FREE</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 group-hover:text-purple-400 transition-colors">Guides & Articles</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 3. STREAM WITH US ON WHATNOT — HIGH IMPACT BANNER ===== */}
      <section className="relative py-10 sm:py-14 lg:py-16 overflow-hidden">
        {/* Intense purple/red gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-purple-800 to-red-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/30 via-transparent to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          {/* Animated pulse rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-purple-400/10 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-red-400/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-center">
            {/* Left: Big bold text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/25 border border-red-400/40 rounded-full mb-4 animate-pulse">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                <span className="text-red-300 text-sm font-bold tracking-widest uppercase">Live on Whatnot</span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.85] mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-white">STREAM</span>
                <br />
                <span className="text-white">WITH </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-red-300">US</span>
              </h2>

              <p className="text-lg sm:text-xl text-purple-100/80 max-w-md mx-auto lg:mx-0 mb-6 leading-relaxed">
                Watch packs get ripped live, chat with other fans, and win giveaways. It's <strong className="text-white">free to watch</strong> — just follow and you'll get notified.
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <a href="https://whatnot.com/invite/northlandfinds" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-100 font-bold text-lg px-8 py-6 shadow-xl shadow-purple-500/30">
                    <Radio className="w-5 h-5 mr-2" />
                    Follow on Whatnot
                  </Button>
                </a>
                <Link href="/whatnot">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-6">
                    Learn More <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Center: QR Code */}
            <div className="hidden lg:flex flex-col items-center">
              <div className="bg-white rounded-2xl p-4 shadow-2xl shadow-purple-500/30 hover:scale-105 transition-transform duration-300">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-whatnot-qr_a49cbbc8.jpg"
                  alt="Scan to follow us on Whatnot"
                  className="w-44 h-44"
                />
              </div>
              <p className="text-sm text-purple-200/70 text-center mt-3 font-medium">Scan to Follow</p>
            </div>

            {/* Right: Feature cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 text-center hover:bg-white/15 transition-colors group">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Anton', sans-serif" }}>FREE</div>
                <p className="text-xs sm:text-sm text-purple-200/70">To Watch</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 text-center hover:bg-white/15 transition-colors group">
                <div className="text-3xl sm:text-4xl font-bold text-red-300 mb-1 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Anton', sans-serif" }}>LIVE</div>
                <p className="text-xs sm:text-sm text-purple-200/70">Real-Time Reveals</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 text-center hover:bg-white/15 transition-colors group">
                <div className="text-3xl sm:text-4xl font-bold text-purple-300 mb-1 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Anton', sans-serif" }}>CHAT</div>
                <p className="text-xs sm:text-sm text-purple-200/70">With Other Fans</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 text-center hover:bg-white/15 transition-colors group">
                <div className="text-3xl sm:text-4xl font-bold text-amber-300 mb-1 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Anton', sans-serif" }}>WIN</div>
                <p className="text-xs sm:text-sm text-purple-200/70">Giveaways & Deals</p>
              </div>
            </div>

            {/* Mobile QR Code */}
            <div className="flex lg:hidden justify-center col-span-full mt-2">
              <div className="bg-white rounded-xl p-3 shadow-lg shadow-purple-500/20">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-whatnot-qr_a49cbbc8.jpg"
                  alt="Scan to follow us on Whatnot"
                  className="w-32 h-32"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
