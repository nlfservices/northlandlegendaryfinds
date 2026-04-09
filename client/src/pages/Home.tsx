/**
 * Homepage - Fan-First, Collector-Friendly
 * Design: Lead with fan experience → collector education → community → THEN repacks
 * Character images: Doctor Doom, Iron Man, Spider-Man, Fantastic Four, Black Panther
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { ShoppingCart, Shield, Star, TrendingUp, Package, ArrowRight, Zap, BookOpen, Clock, Eye, Radio, HelpCircle, Search, Box, Gift, Sparkles, Compass, Users, Heart, Gamepad2, Play, MapPin, Lightbulb } from "lucide-react";
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
        description="Your home for Marvel and Star Wars fans and trading card collectors. Explore characters, track Avengers: Doomsday news, browse 1,709+ cards, and discover the hobby — whether you're brand new or a lifelong collector."
        noSuffix
        jsonLd={[organizationJsonLd(), websiteJsonLd(), localBusinessJsonLd()]}
      />

      {/* ===== 1. HERO — FAN-FIRST ===== */}
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[720px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" loading="eager" decoding="async" fetchPriority="high" />
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
                <span className="text-white">LOVE MARVEL</span>
                <br />
                <span className="text-white">OR STAR WARS?</span>
                <br />
                <span className="text-primary">START HERE.</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-lg mb-8 leading-relaxed">
                Whether you grew up reading comics, watched every movie with your kids, or just saw Avengers: Doomsday and want to know more — <strong className="text-white">you're in the right place.</strong>
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

      {/* ===== 3. NEW TO COLLECTING? — BEGINNER WELCOME ===== */}
      <section id="new-to-collecting" className="py-16 lg:py-20 overflow-hidden">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full mb-4">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold tracking-wide">WELCOME</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              NEW TO <span className="text-primary">COLLECTING?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              You don't need to be an expert. If you love Marvel or Star Wars, you already belong here. Trading cards are just another way to connect with the characters and stories you care about — and we'll help you get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Step 1: Pick Your Fandom */}
            <div className="bg-card/80 border border-border rounded-xl p-8 text-center hover:border-primary/30 transition-all group">
              <div className="w-16 h-16 bg-primary/15 border-2 border-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                PICK YOUR <span className="text-primary">FANDOM</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Are you an Iron Man fan? A Spider-Man loyalist? Love the Fantastic Four? Start by exploring the characters you already know and love — we have profiles, backstories, and every card they appear on.
              </p>
              <Link href="/characters">
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                  Explore Characters <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Step 2: Learn the Basics */}
            <div className="bg-card/80 border border-border rounded-xl p-8 text-center hover:border-cyan-500/30 transition-all group">
              <div className="w-16 h-16 bg-cyan-500/15 border-2 border-cyan-500/40 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                LEARN THE <span className="text-cyan-400">BASICS</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                What's a base card? What makes a card rare? How do card sets work? Our blog breaks it all down in plain language — no confusing hobby jargon, just clear answers for curious fans.
              </p>
              <Link href="/the-collector">
                <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-bold">
                  Read The Collector <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Step 3: Browse the Cards */}
            <div className="bg-card/80 border border-border rounded-xl p-8 text-center hover:border-amber-500/30 transition-all group">
              <div className="w-16 h-16 bg-amber-500/15 border-2 border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                BROWSE THE <span className="text-amber-400">CARDS</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                See what's out there. We've cataloged every card from the 2025 Topps Marvel sets — over 1,700 cards you can search by character, set, or rarity. It's like window shopping, but for trading cards.
              </p>
              <Link href="/cards">
                <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 font-bold">
                  Card Database <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. COLLECTOR'S JOURNEY — REWRITTEN FOR FANS ===== */}
      <section className="py-16 lg:py-20 bg-card/30 border-y border-border overflow-hidden">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-4">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide">WHY PEOPLE COLLECT</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              IT STARTS WITH <span className="text-primary">A STORY</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Nobody wakes up one day and says "I'm going to collect trading cards." It starts with something else — a movie, a comic, a character that stuck with you. Here's how most people find their way here.
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
                    alt="Iron Man trading card"
                    className="relative w-56 sm:w-64 rounded-xl shadow-2xl shadow-red-500/20 rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                  <span className="text-red-400">"I GREW UP</span> ON THIS"
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Maybe you read Iron Man comics as a kid. Maybe you watched the MCU movies with your family. Maybe your child just discovered Spider-Man and now you're both hooked. That connection to the characters is where it all begins — and trading cards are a way to hold onto it.
                </p>
                <Link href="/characters">
                  <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold">
                    Meet the Characters <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Row 2: Text Left, Image Right — Fantastic Four */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                  <span className="text-blue-400">"WE DO THIS</span> TOGETHER"
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The best part isn't the cards themselves — it's opening packs with your kids, arguing about who's the strongest Avenger with your friends, or going to a card show and meeting people who love the same stuff you do. Collecting is social, and it's way more fun with other people.
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
                    alt="Fantastic Four trading card"
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
                    alt="Black Panther trading card"
                    className="relative w-56 sm:w-64 rounded-xl shadow-2xl shadow-purple-500/20 rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                  <span className="text-purple-400">"I WANT TO</span> LEARN MORE"
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Once you start, you'll want to know more — which cards are rare, what different sets exist, which ones feature your favorite characters. We built free tools to help: a searchable card database, market price tracking, and articles that explain everything in plain English. No gatekeeping here.
                </p>
                <Link href="/cards">
                  <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 font-bold">
                    Explore Card Database <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. DOOMSDAY — CHARACTER INTEL HUB ===== */}
      <DoomsdaySection />

      {/* ===== 6. MARVELOUS TOP 5 ===== */}
      <MarvelousTop5 />

      {/* ===== 7. EXPLORE OUR COLLECTION — Spider-Man CTA ===== */}
      <section className="py-16 lg:py-20">
        <div className="container">
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

      {/* ===== 8. YOUR FANDOM, YOUR WAY — EXPANSION ROADMAP ===== */}
      <section className="py-16 lg:py-20 bg-card/30 border-y border-border relative overflow-hidden">
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
              We're starting with Marvel and Star Wars — but this is just the beginning. NLF is building a home for fans and collectors across every universe you love. Stay tuned and stay informed.
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

      {/* ===== 9. WATCH US LIVE ON WHATNOT — COMMUNITY ===== */}
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
              <span className="text-red-400 text-sm font-bold tracking-wide">JOIN THE COMMUNITY</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              WATCH US <span className="text-purple-400">LIVE</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join our live streams on Whatnot — watch packs get opened in real time, chat with other fans, and see every card as it's revealed. It's like watching a show, but you might win something.
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
                      <span className="text-purple-400">LIVE</span> STREAMS
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      We open packs live on Whatnot so you can watch every card get revealed in real time. It's free to watch — follow us and you'll get notified when we go live.
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
                <div className="text-3xl font-bold text-purple-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>FREE</div>
                <p className="text-xs text-muted-foreground">To Watch</p>
              </div>
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 text-center hover:border-red-500/30 transition-colors">
                <div className="text-3xl font-bold text-red-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>LIVE</div>
                <p className="text-xs text-muted-foreground">Real-Time Reveals</p>
              </div>
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 text-center hover:border-primary/30 transition-colors">
                <div className="text-3xl font-bold text-primary mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>CHAT</div>
                <p className="text-xs text-muted-foreground">With Other Fans</p>
              </div>
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 text-center hover:border-amber-500/30 transition-colors">
                <div className="text-3xl font-bold text-amber-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>WIN</div>
                <p className="text-xs text-muted-foreground">Giveaways & Deals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 10. WHAT IS A REPACK? — SIMPLIFIED FOR BEGINNERS ===== */}
      <section className="py-16 lg:py-20 bg-card/30 border-y border-border">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full mb-4">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold tracking-wide">GOOD QUESTION</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHAT IS A <span className="text-primary">REPACK</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Think of it like a curated gift box of trading cards. Instead of buying a random pack from the store, you get a hand-picked selection that's been put together by someone who actually knows the cards. Every NLF repack includes a mix of common cards and rare ones — and we publish the full list of what could be inside so there are no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card/80 border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Hand-Picked Cards</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every pack is assembled by hand — not randomly generated. We choose cards that make the experience fun and worth your money.
              </p>
            </div>
            <div className="bg-card/80 border border-border rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Rare Cards Included</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every pack includes special cards — limited editions, rare versions, or professionally graded cards that have been verified by experts.
              </p>
            </div>
            <div className="bg-card/80 border border-border rounded-xl p-6 text-center hover:border-cyan-500/30 transition-colors">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">No Surprises</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We publish a full checklist for every pack so you can see exactly what's possible before you buy. Complete transparency — always.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 11. PRODUCT PYRAMID — REPACKS (SECONDARY) ===== */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold">READY TO START COLLECTING?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              OUR <span className="text-primary">PACKS</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              When you're ready to start your collection, these hand-built packs are a great way to jump in
            </p>
          </div>

          {/* Pyramid Tier 1: Gambit's Deck — Featured at Top */}
          {gambitProduct && (
            <div className="max-w-xl mx-auto mb-8">
              <div className="text-center mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">Featured — See Every Card Before You Buy</span>
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
                        52 single-card packs themed after Gambit's playing cards. The full checklist is published — you can see every possible card before you buy.
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                        <span className="text-2xl font-bold text-fuchsia-400" style={{ fontFamily: "'Anton', sans-serif" }}>${gambitProduct.price}</span>
                        <span className="text-sm text-muted-foreground">52 packs</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-fuchsia-500/20 px-6 py-3 flex items-center justify-between bg-fuchsia-500/5">
                    <Link href="/checklist/nlf-marvel-52-singles">
                      <span className="text-sm font-bold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1.5 cursor-pointer">
                        <Eye className="w-4 h-4" /> See the Full Checklist
                      </span>
                    </Link>
                    <span className="text-sm font-bold text-primary flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      View Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Pyramid Tier 2: VARIANT SERIES Products Below */}
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

      {/* ===== 12. TRUST / WHY NLF ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-card/30 border-y border-border">
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
              What makes Northland Legendary Finds different
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">100% Real Cards</h3>
              <p className="text-sm text-muted-foreground">
                Every card comes from official Topps releases. No fakes, no knockoffs — guaranteed authentic.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-cyan-500/30 transition-colors">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Free Resources</h3>
              <p className="text-sm text-muted-foreground">
                Card database, character profiles, market prices, and beginner guides — all free, no account needed.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Full Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Every pack has a published checklist. You can see what's possible before you spend a dollar.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-purple-500/30 transition-colors">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Built by Fans</h3>
              <p className="text-sm text-muted-foreground">
                We're collectors and fans ourselves. This isn't a corporation — it's a passion project built for people like us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 13. COMING SOON PRODUCT LINES ===== */}
      {comingSoonLines.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-cyan-400">COMING</span> SOON
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                More packs on the way. Sign up to be the first to know when they drop.
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

      {/* ===== 14. NEWSLETTER ===== */}
      <NewsletterSignup variant="section" source="homepage-inline" />
    </div>
  );
}
