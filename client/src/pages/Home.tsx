/**
 * Homepage - Collector-First Identity
 * Design: Hero with character cards, collector resources first, commerce second
 * Character images: Doctor Doom, Iron Man, Spider-Man, Fantastic Four, Black Panther
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { ShoppingCart, Shield, Star, TrendingUp, Package, ArrowRight, Zap, BookOpen, Clock, Eye, Radio, HelpCircle, Search, Box, Gift, Sparkles, Compass, Users, Heart, Gamepad2 } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { getProductLines, getComingSoonProducts, products, getFeaturedProduct } from "@/lib/products";
import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import ProductCard from "@/components/ProductCard";
import SEO, { organizationJsonLd, websiteJsonLd, localBusinessJsonLd } from "@/components/SEO";
import DoomsdaySection from "@/components/DoomsdaySection";
import MarvelousTop5 from "@/components/MarvelousTop5";


const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hero-collector-banner-VbjWsKXzVgGZ6irJXkBrQz.webp";
const NLF_PACK = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-nlf-variant-2CkMPP3CsZhFkFXpzSuZkV.webp";
const TRUST_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/trust-section-bg-kwnjuLkybJ2rqpCpEwiChw.webp";

// Character card images
const DOOM_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-card-LTiPEJkmSfYjTgipmotMso.webp";
const IRON_MAN_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/armored-hero-card-SdisyrpGhXuzM9QzK4oy8L.webp";
const SPIDER_MAN_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/web-hero-card-nnb4jySYxm85VCLBiavLYC.webp";
const FF_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fantastic-four-card-hj632KBGq5hHBqFr24T7Bg.webp";
const BLACK_PANTHER_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/black-panther-card-8p85njMmcGx6FSvhe3Txjb.webp";


export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const { addItem } = useCart();
  const productLines = getProductLines();
  const variantSeries = productLines.find(l => l.id === "variant-series");
  const gambitProduct = getFeaturedProduct();
  const comingSoonLines = productLines.filter(l => !l.available);


  return (
    <div className="min-h-screen">
      <SEO
        path="/"
        title="Northland Legendary Finds | Marvel & Star Wars Trading Card Collector Hub"
        description="Your home for Marvel and Star Wars trading card collecting. Browse 1,709+ cards, track Avengers: Doomsday intel, explore market analysis, and discover premium hand-curated repacks. Built by collectors, for collectors."
        noSuffix
        jsonLd={[organizationJsonLd(), websiteJsonLd(), localBusinessJsonLd()]}
      />

      {/* ===== HERO SECTION — COLLECTOR-FIRST ===== */}
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[720px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" loading="eager" decoding="async" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Collector-First Messaging */}
            <div className="py-12 lg:py-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-bold tracking-wide">BUILT BY COLLECTORS, FOR COLLECTORS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] mb-4 sm:mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-white">REMEMBER</span>
                <br />
                <span className="text-white">YOUR FIRST</span>
                <br />
                <span className="text-primary">HERO?</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-lg mb-8 leading-relaxed">
                Whether it was reading comics as a kid, watching the movies with your family, or pulling your first chase card — that feeling never goes away. <strong className="text-white">We're here to keep it alive.</strong>
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/cards">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 shadow-lg shadow-primary/20">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Explore Card Database
                  </Button>
                </Link>
                <Link href="/characters">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold text-lg px-8 py-6">
                    Meet the Characters
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
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
                    alt="Doctor Doom holographic trading card"
                    className="relative w-48 xl:w-56 rounded-xl shadow-2xl shadow-green-500/20 hover:scale-105 transition-transform duration-500 rotate-[-2deg]"
                    loading="eager"
                  />
                </div>
              </div>
              {/* Iron Man - top left */}
              <div className="absolute z-20 top-4 left-4 xl:left-0">
                <img
                  src={IRON_MAN_CARD}
                  alt="Iron Man holographic trading card"
                  className="w-32 xl:w-36 rounded-lg shadow-xl shadow-red-500/15 hover:scale-105 transition-transform duration-500 rotate-[-8deg] opacity-90 hover:opacity-100"
                  loading="eager"
                />
              </div>
              {/* Spider-Man - top right */}
              <div className="absolute z-20 top-8 right-4 xl:right-0">
                <img
                  src={SPIDER_MAN_CARD}
                  alt="Spider-Man holographic trading card"
                  className="w-32 xl:w-36 rounded-lg shadow-xl shadow-blue-500/15 hover:scale-105 transition-transform duration-500 rotate-[6deg] opacity-90 hover:opacity-100"
                  loading="eager"
                />
              </div>
              {/* Fantastic Four - bottom left */}
              <div className="absolute z-10 bottom-8 left-8 xl:left-4">
                <img
                  src={FF_CARD}
                  alt="Fantastic Four holographic trading card"
                  className="w-28 xl:w-32 rounded-lg shadow-xl shadow-blue-400/15 hover:scale-105 transition-transform duration-500 rotate-[5deg] opacity-80 hover:opacity-100"
                  loading="lazy"
                />
              </div>
              {/* Black Panther - bottom right */}
              <div className="absolute z-10 bottom-4 right-8 xl:right-4">
                <img
                  src={BLACK_PANTHER_CARD}
                  alt="Black Panther holographic trading card"
                  className="w-28 xl:w-32 rounded-lg shadow-xl shadow-purple-500/15 hover:scale-105 transition-transform duration-500 rotate-[-4deg] opacity-80 hover:opacity-100"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR — COLLECTOR RESOURCES ===== */}
      <section className="bg-card border-y border-border">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            <Link href="/cards">
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform" style={{ fontFamily: "'Anton', sans-serif" }}>1,709+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 group-hover:text-primary transition-colors">Cards in Database</div>
              </div>
            </Link>
            <Link href="/cards">
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-cyan-400 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Anton', sans-serif" }}>6</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 group-hover:text-cyan-400 transition-colors">Topps Marvel Sets</div>
              </div>
            </Link>
            <Link href="/characters">
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-amber-400 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Anton', sans-serif" }}>200+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 group-hover:text-amber-400 transition-colors">Characters</div>
              </div>
            </Link>
            <Link href="/market-intel">
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Anton', sans-serif" }}>INTEL</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 group-hover:text-purple-400 transition-colors">Market Analysis</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== DOOMSDAY — CHARACTER INTEL HUB ===== */}
      <DoomsdaySection />

      {/* ===== MARVELOUS TOP 5 ===== */}
      <MarvelousTop5 />

      {/* ===== COLLECTOR'S JOURNEY — CHARACTER CARDS + NOSTALGIA ===== */}
      <section className="py-16 lg:py-20 overflow-hidden">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-4">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide">THE COLLECTOR'S JOURNEY</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              EVERY COLLECTOR HAS <span className="text-primary">A STORY</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Maybe it started with a comic book from a garage sale. Maybe it was watching the Avengers with your kids for the first time. Whatever sparked it — that's why we're here.
            </p>
          </div>

          {/* Alternating image-text layout with character cards */}
          <div className="space-y-16 max-w-6xl mx-auto">
            {/* Row 1: Image Left, Text Right — Iron Man */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-6 bg-red-500/10 rounded-3xl blur-2xl group-hover:bg-red-500/15 transition-all" />
                  <img
                    src={IRON_MAN_CARD}
                    alt="Iron Man holographic trading card"
                    className="relative w-56 sm:w-64 rounded-xl shadow-2xl shadow-red-500/20 rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                  THE <span className="text-red-400">CHILDHOOD</span> SPARK
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Remember flipping through comic books at the store, imagining you were swinging through the city or flying in a suit of armor? That wonder doesn't fade — it evolves. Now you're chasing numbered parallels and graded slabs, but the feeling is the same.
                </p>
                <Link href="/the-collector">
                  <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold">
                    Read The Collector Blog <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Row 2: Text Left, Image Right — Fantastic Four */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                  SHARE IT WITH <span className="text-blue-400">YOUR PEOPLE</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The best part of collecting isn't just the cards — it's the moments. Ripping packs with your kids, debating who's the strongest Avenger with your friends, or watching a live break and losing your mind when the chase card drops. Collecting is better together.
                </p>
                <Link href="/card-shows">
                  <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-bold">
                    Find Card Shows Near You <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center order-1 lg:order-2">
                <div className="relative group">
                  <div className="absolute -inset-6 bg-blue-500/10 rounded-3xl blur-2xl group-hover:bg-blue-500/15 transition-all" />
                  <img
                    src={FF_CARD}
                    alt="Fantastic Four holographic trading card"
                    className="relative w-56 sm:w-64 rounded-xl shadow-2xl shadow-blue-500/20 rotate-[3deg] group-hover:rotate-0 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Image Left, Text Right — Black Panther */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-6 bg-purple-500/10 rounded-3xl blur-2xl group-hover:bg-purple-500/15 transition-all" />
                  <img
                    src={BLACK_PANTHER_CARD}
                    alt="Black Panther holographic trading card"
                    className="relative w-56 sm:w-64 rounded-xl shadow-2xl shadow-purple-500/20 rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                  KNOW YOUR <span className="text-purple-400">COLLECTION</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We built the tools we wished existed when we started collecting. A complete card database with every 2025 Topps Marvel set. Market analysis so you know what your cards are worth. Character deep-dives so you understand the stories behind the art. This is your collector's toolkit.
                </p>
                <Link href="/cards">
                  <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 font-bold">
                    Browse Card Database <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== YOUR FANDOM, YOUR WAY — EXPANSION ROADMAP ===== */}
      <section className="py-16 lg:py-20 bg-card/30 border-y border-border relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/15 border border-cyan-500/30 rounded-full mb-4">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-bold tracking-wide">THE ROADMAP</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              YOUR FANDOM, <span className="text-primary">YOUR WAY</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              We're starting with Marvel and Star Wars — but this is just the beginning. NLF is building a home for collectors across every fandom you love. Stay tuned and stay informed.
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
                <p className="text-xs text-primary font-bold">Collecting Now</p>
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
                <p className="text-xs text-amber-400 font-bold">June 2026</p>
              </div>
            </div>

            {/* Disney — Future */}
            <div className="group">
              <div className="bg-card/60 border border-border rounded-xl p-5 text-center hover:border-blue-500/30 transition-all duration-300 opacity-80 hover:opacity-100">
                <div className="text-4xl mb-3">🏰</div>
                <h3 className="font-bold text-sm mb-1">Disney</h3>
                <p className="text-xs text-muted-foreground">Coming 2027</p>
              </div>
            </div>

            {/* WWE — Future */}
            <div className="group">
              <div className="bg-card/60 border border-border rounded-xl p-5 text-center hover:border-red-500/30 transition-all duration-300 opacity-80 hover:opacity-100">
                <div className="text-4xl mb-3">🤼</div>
                <h3 className="font-bold text-sm mb-1">WWE</h3>
                <p className="text-xs text-muted-foreground">Coming Soon</p>
              </div>
            </div>

            {/* UFC — Future */}
            <div className="group">
              <div className="bg-card/60 border border-border rounded-xl p-5 text-center hover:border-orange-500/30 transition-all duration-300 opacity-80 hover:opacity-100">
                <div className="text-4xl mb-3">🥊</div>
                <h3 className="font-bold text-sm mb-1">UFC</h3>
                <p className="text-xs text-muted-foreground">Coming Soon</p>
              </div>
            </div>

            {/* Boxing — Future */}
            <div className="group">
              <div className="bg-card/60 border border-border rounded-xl p-5 text-center hover:border-yellow-500/30 transition-all duration-300 opacity-80 hover:opacity-100">
                <div className="text-4xl mb-3">🥇</div>
                <h3 className="font-bold text-sm mb-1">Boxing</h3>
                <p className="text-xs text-muted-foreground">Coming Soon</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm mb-4">Want to be first to know when new fandoms drop?</p>
            <NewsletterSignup variant="sidebar" source="homepage-fandom-roadmap" headline="Get Notified" subtext="Be the first to know when new fandoms launch" />
          </div>
        </div>
      </section>

      {/* ===== EXPLORE OUR COLLECTION — Card Database CTA with Spider-Man ===== */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            {/* Left: Spider-Man Card */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-8 bg-blue-500/10 rounded-3xl blur-3xl group-hover:bg-blue-500/15 transition-all" />
                <img
                  src={SPIDER_MAN_CARD}
                  alt="Spider-Man holographic trading card"
                  className="relative w-56 sm:w-72 rounded-xl shadow-2xl shadow-blue-500/20 rotate-[2deg] group-hover:rotate-0 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
            {/* Right: CTA */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                EXPLORE THE <span className="text-primary">COLLECTION</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Browse every 2025 Topps Marvel card set — Chrome, Comic Book Heroes, Mint, Sapphire, Studios, and Studios Sapphire. 1,709 cards across 6 sets, all searchable, all with detailed info. Know exactly what you're collecting.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/cards">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Card Database
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
                    Market Intel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT IS A REPACK? ===== */}
      <section className="py-16 lg:py-20 bg-card/30 border-y border-border">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full mb-4">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold tracking-wide">NEW TO REPACKS?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHAT IS A <span className="text-primary">REPACK</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              A repack is a curated pack of trading cards hand-assembled by collectors, for collectors. Instead of buying sealed hobby boxes at retail prices, you get a carefully built pack featuring numbered parallels, inserts, and graded slabs mixed in with quality base cards. Every card in every NLF pack is from authentic 2025 Topps Marvel releases — and every pack has a published checklist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card/80 border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
              <div className="text-4xl mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-primary">$$$</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Curated Packs</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every pack is hand-built with intention — not randomly assembled. We select each card to create a collecting experience you can trust.
              </p>
            </div>
            <div className="bg-card/80 border border-border rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors">
              <div className="text-4xl mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-amber-400">✓</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Premium Cards Included</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every NLF pack includes premium cards — numbered parallels, inserts, or graded slabs. Check the checklist to see exactly what's possible.
              </p>
            </div>
            <div className="bg-card/80 border border-border rounded-xl p-6 text-center hover:border-cyan-500/30 transition-colors">
              <div className="text-4xl mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-cyan-400">📋</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Full Transparency</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every pack has a published checklist so you know exactly what's possible. We track every pull in real-time — no hidden cards, no surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              HOW IT <span className="text-primary">WORKS</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              From browsing to unboxing in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <div className="relative text-center">
              <div className="w-16 h-16 bg-primary/15 border-2 border-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground" style={{ fontFamily: "'Anton', sans-serif" }}>1</div>
              <h3 className="font-bold text-lg mb-2">Browse</h3>
              <p className="text-sm text-muted-foreground">Explore our product lines and check the full checklists to see what you could pull.</p>
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-cyan-500/15 border-2 border-cyan-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Box className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ fontFamily: "'Anton', sans-serif" }}>2</div>
              <h3 className="font-bold text-lg mb-2">Pick Your Pack</h3>
              <p className="text-sm text-muted-foreground">Choose from 100-pack or 500-pack series — each with different hit tiers and price points.</p>
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-amber-500/15 border-2 border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-amber-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ fontFamily: "'Anton', sans-serif" }}>3</div>
              <h3 className="font-bold text-lg mb-2">Unbox</h3>
              <p className="text-sm text-muted-foreground">Receive your pack and rip it open. Every card is from authentic 2025 Topps Marvel sets.</p>
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-purple-500/15 border-2 border-purple-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ fontFamily: "'Anton', sans-serif" }}>4</div>
              <h3 className="font-bold text-lg mb-2">Collect</h3>
              <p className="text-sm text-muted-foreground">Add to your collection, trade with the community, or grade your best pulls. The hobby is yours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT PYRAMID — GAMBIT ON TOP, VARIANT SERIES BELOW ===== */}
      <section className="py-16 lg:py-20 bg-card/30 border-y border-border">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold">OUR REPACK LINEUP</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              PREMIUM <span className="text-primary">REPACKS</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hand-built Marvel trading card packs with guaranteed hits and full transparency
            </p>
          </div>

          {/* Pyramid Tier 1: Gambit's Deck — Featured at Top */}
          {gambitProduct && (
            <div className="max-w-xl mx-auto mb-8">
              <div className="text-center mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">Featured — Pre-Revealed Checklist</span>
              </div>
              <Link href={`/product/${gambitProduct.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl border-2 border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-950/40 via-card to-purple-950/40 hover:border-fuchsia-400/60 transition-all duration-300 shadow-lg shadow-fuchsia-500/10 hover:shadow-fuchsia-500/20">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-500" />
                  <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative shrink-0">
                      <div className="absolute -inset-4 bg-fuchsia-500/15 rounded-full blur-2xl" />
                      <img
                        src={gambitProduct.image}
                        alt={gambitProduct.name}
                        className="relative w-40 h-40 sm:w-48 sm:h-48 object-contain drop-shadow-[0_0_20px_rgba(217,70,239,0.3)] group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-fuchsia-500/15 border border-fuchsia-500/30 rounded-full text-xs font-bold text-fuchsia-400 mb-3">
                        <Clock className="w-3 h-3" /> DROPPING MAY 22
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                        {gambitProduct.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        52 single-card packs themed after Gambit's playing cards. The only NLF set with a pre-revealed checklist.
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                        <span className="text-2xl font-bold text-fuchsia-400" style={{ fontFamily: "'Anton', sans-serif" }}>${gambitProduct.price}</span>
                        <span className="text-sm text-muted-foreground">52 packs</span>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <span className="px-2 py-1 text-xs rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold">ACES — Chase</span>
                        <span className="px-2 py-1 text-xs rounded bg-purple-500/15 border border-purple-500/30 text-purple-400 font-bold">FACE — Hits</span>
                        <span className="px-2 py-1 text-xs rounded bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold">NUMBER — Base</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-fuchsia-500/20 px-6 py-3 flex items-center justify-between bg-fuchsia-500/5">
                    <Link href="/checklist/nlf-marvel-52-singles">
                      <span className="text-sm font-bold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1.5 cursor-pointer">
                        <Eye className="w-4 h-4" /> Preview Full Checklist
                      </span>
                    </Link>
                    <span className="text-sm font-bold text-primary flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      View Product <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Pyramid Tier 2: Two Variant Series Products Below */}
          {variantSeries && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Launching April 27th</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {variantSeries.products.map((product) => (
                  <ProductCard key={product.id} product={product} featured />
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/shop">
              <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TRUST / WHY NLF ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={TRUST_BG} alt="" className="w-full h-full object-cover opacity-30" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-background/90" />
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHY <span className="text-primary">NLF</span>?
            </h2>
            <p className="text-muted-foreground text-lg">
              What sets Northland Legendary Finds apart from the rest
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">100% Authentic</h3>
              <p className="text-sm text-muted-foreground">
                Every card is verified authentic from official Topps releases. No counterfeits, ever.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-cyan-500/30 transition-colors">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Quality Throughout</h3>
              <p className="text-sm text-muted-foreground">
                Every card is hand-selected from premium Topps sets. No random filler — just cards worth collecting.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">No Filler</h3>
              <p className="text-sm text-muted-foreground">
                No junk cards, no random commons. Every card in every pack is from authentic 2025 Topps Marvel releases.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-purple-500/30 transition-colors">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Chase Cards</h3>
              <p className="text-sm text-muted-foreground">
                Numbered parallels, autographs, and AGS/CGC/PSA graded slabs — all listed on the checklist so you know what's possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMING SOON PRODUCT LINES ===== */}
      {comingSoonLines.length > 0 && (
        <section className="py-16 lg:py-20 bg-card/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-cyan-400">COMING</span> SOON
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                More product lines on the horizon. Sign up for notifications to be the first to know.
              </p>
            </div>

            <div className="space-y-12">
              {comingSoonLines.map((line) => (
                <div key={line.id}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                      {line.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">{line.tagline}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Show unique products (deduplicate 100/500 — just show one card per name) */}
                    {line.products
                      .filter((p, i, arr) => arr.findIndex(x => x.name === p.name) === i)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== WATCH US LIVE ON WHATNOT ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-red-900/10" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-red-500/8 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/15 border border-red-500/30 rounded-full mb-4">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-red-400 text-sm font-bold tracking-wide">LIVE ON WHATNOT</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              WATCH US <span className="text-purple-400">LIVE</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join our live streams on Whatnot — watch packs get ripped in real time, see every pull as it happens
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            {/* Left: QR Code + CTA */}
            <div className="flex flex-col items-center lg:items-start gap-6">
              <div className="bg-card/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 text-center lg:text-left w-full">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* QR Code */}
                  <div className="shrink-0">
                    <div className="bg-white rounded-xl p-3 shadow-lg shadow-purple-500/10">
                      <img
                        src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/whatnot-qr-1_5cdbb693.png"
                        alt="Scan to follow us on Whatnot"
                        className="w-36 h-36 sm:w-40 sm:h-40"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">Scan to follow on Whatnot</p>
                  </div>
                  {/* Text */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                      <span className="text-purple-400">500-PACK</span> SERIES
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Our exclusive Whatnot series drops 50 packs per live show. Every pull tracked in real-time on our checklist. Limited to 500 packs total — once they're gone, they're gone.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a href="https://www.whatnot.com/user/northlandfinds" target="_blank" rel="noopener noreferrer">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                          <Radio className="w-4 h-4 mr-2" />
                          Follow on Whatnot
                        </Button>
                      </a>
                      <Link href="/whatnot">
                        <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 font-bold">
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live Stream Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 text-center hover:border-purple-500/30 transition-colors">
                <div className="text-3xl font-bold text-purple-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>50</div>
                <p className="text-xs text-muted-foreground">Packs Per Show</p>
              </div>
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 text-center hover:border-red-500/30 transition-colors">
                <div className="text-3xl font-bold text-red-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>LIVE</div>
                <p className="text-xs text-muted-foreground">Real-Time Pulls</p>
              </div>
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 text-center hover:border-primary/30 transition-colors">
                <div className="text-3xl font-bold text-primary mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>500</div>
                <p className="text-xs text-muted-foreground">Total Packs</p>
              </div>
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 text-center hover:border-amber-500/30 transition-colors">
                <div className="text-3xl font-bold text-amber-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>10</div>
                <p className="text-xs text-muted-foreground">Shows Per Series</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER — INLINE EMAIL CAPTURE ===== */}
      <NewsletterSignup variant="section" source="homepage-inline" />
    </div>
  );
}
