/**
 * Homepage - Fan-First, Collector-Friendly
 * Design: Lead with fan experience → collector education → community → THEN repacks
 * Character images: Doctor Doom, Iron Man, Spider-Man, Fantastic Four, Black Panther
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { ShoppingCart, Shield, Star, TrendingUp, Package, ArrowRight, Zap, BookOpen, Clock, Eye, Radio, HelpCircle, Search, Box, Gift, Sparkles, Compass, Users, Heart, Gamepad2, Play, MapPin, Lightbulb, Crown, Award, ChevronDown, ChevronUp } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { getProductLines, getComingSoonProducts, products, getFeaturedProduct } from "@/lib/products";
import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import ProductCard from "@/components/ProductCard";
import SEO, { organizationJsonLd, websiteJsonLd, localBusinessJsonLd } from "@/components/SEO";
import DoomsdaySection from "@/components/DoomsdaySection";
import MCUCountdown from "@/components/MCUCountdown";
import MarvelousTop5 from "@/components/MarvelousTop5";
import DoomsdayTicker from "@/components/DoomsdayTicker";
import { trpc } from "@/lib/trpc";


const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hero-collector-banner-VbjWsKXzVgGZ6irJXkBrQz.webp";
const NLF_PACK = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-nlf-variant-2CkMPP3CsZhFkFXpzSuZkV.webp";
const TRUST_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/trust-section-bg-kwnjuLkybJ2rqpCpEwiChw.webp";

// Character card images
const DOOM_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-card-LTiPEJkmSfYjTgipmotMso.webp";
const IRON_MAN_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/armored-hero-card-SdisyrpGhXuzM9QzK4oy8L.webp";
const SPIDER_MAN_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/web-hero-card-nnb4jySYxm85VCLBiavLYC.webp";
const FF_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fantastic-four-card-hj632KBGq5hHBqFr24T7Bg.webp";
const BLACK_PANTHER_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/black-panther-card-8p85njMmcGx6FSvhe3Txjb.webp";

// Legacy Legends card images
const LEGACY_HOPKINS_ODIN = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hopkins-odin-5PmHir8t54fyriEVpZF3Tj.webp";
const LEGACY_MCKELLEN_MAGNETO = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mckellen-magneto-N8g4KBYRkiGLYhftfknYBc.webp";
const LEGACY_STEWART_PROFX = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/stewart-professor-x-QoEpAmXirvvLiCbPvb8gyG.webp";
const LEGACY_BLACK_PANTHER = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/black-panther-card-HTGdTwE7FjM5GKsJFH6VNw.webp";
const LEGACY_RDJ_IRON_MAN = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/rdj-iron-man-legacy-QegKWDGfdcUe8NRevdJ5GF.webp";

// Legacy Legends data — expansion-ready array
const LEGACY_LEGENDS = [
  {
    id: "boseman",
    actorName: "Chadwick Boseman",
    characterName: "Black Panther",
    badge: "No Autograph Exists",
    badgeColor: "from-purple-500 to-purple-700",
    badgeTextColor: "text-purple-100",
    borderColor: "border-purple-500/40",
    glowColor: "shadow-purple-500/30",
    accentColor: "text-purple-400",
    image: LEGACY_BLACK_PANTHER,
    note: "Academy Award nominee. Howard University graduate. Brought Black Panther to life and inspired a generation — his 'Wakanda Forever' became a global symbol of strength. Passed away in 2020 at 43 after a private battle with cancer. No autograph card will ever exist.",
  },
  {
    id: "hopkins",
    actorName: "Anthony Hopkins",
    characterName: "Odin",
    badge: "Debut Auto",
    badgeColor: "from-amber-500 to-yellow-600",
    badgeTextColor: "text-amber-950",
    borderColor: "border-amber-500/40",
    glowColor: "shadow-amber-500/30",
    accentColor: "text-amber-400",
    image: LEGACY_HOPKINS_ODIN,
    note: "Academy Award winner for The Silence of the Lambs and The Father. Knighted by Queen Elizabeth II. From Hannibal Lecter to the All-Father of Asgard — at 88, Sir Anthony Hopkins is one of the greatest actors who ever lived. His first-ever Marvel autograph card.",
  },
  {
    id: "mckellen",
    actorName: "Ian McKellen",
    characterName: "Magneto",
    badge: "Debut Auto",
    badgeColor: "from-red-500 to-red-700",
    badgeTextColor: "text-red-100",
    borderColor: "border-red-500/40",
    glowColor: "shadow-red-500/30",
    accentColor: "text-red-400",
    image: LEGACY_MCKELLEN_MAGNETO,
    note: "Six-time Olivier Award winner. Knighted for services to the performing arts. Defined Gandalf and Magneto for an entire generation. Sir Ian McKellen has been a titan of stage and screen for over 60 years — and a fearless advocate for equality. His first-ever Marvel autograph card.",
  },
  {
    id: "stewart",
    actorName: "Patrick Stewart",
    characterName: "Professor X",
    badge: "Debut Auto",
    badgeColor: "from-blue-500 to-cyan-600",
    badgeTextColor: "text-blue-100",
    borderColor: "border-blue-500/40",
    glowColor: "shadow-blue-500/30",
    accentColor: "text-blue-400",
    image: LEGACY_STEWART_PROFX,
    note: "Legendary Royal Shakespeare Company actor. Knighted in 2010. Made Captain Picard and Professor X two of the most iconic characters in pop culture history. Sir Patrick Stewart brings gravitas to everything he touches — from Star Trek to the X-Men. His first-ever Marvel autograph card.",
  },
  {
    id: "downey",
    actorName: "Robert Downey Jr.",
    characterName: "Iron Man / Doctor Doom",
    badge: "The Godfather",
    badgeColor: "from-red-500 to-amber-600",
    badgeTextColor: "text-red-100",
    borderColor: "border-red-500/40",
    glowColor: "shadow-red-500/30",
    accentColor: "text-red-400",
    image: LEGACY_RDJ_IRON_MAN,
    note: "Academy Award winner for Oppenheimer. Launched the entire MCU as Tony Stark in 2008 and defined a generation of superhero cinema across 11 films. His 'I am Iron Man' became the most iconic line in Marvel history. Now returning as Doctor Doom in Avengers: Doomsday — the only actor to play both the MCU's greatest hero and its greatest villain.",
  },
];


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

// Latest MCU News section — auto-populated from published articles
function LatestMCUNews() {
  const { data: articles = [], isLoading } = trpc.articles.list.useQuery({ limit: 3 });

  if (isLoading || articles.length === 0) return null;

  function formatDate(timestamp: number | null): string {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const CATEGORY_COLORS: Record<string, string> = {
    movie_news: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    show_news: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    casting: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    card_market: "bg-primary/20 text-primary border-primary/30",
    release_dates: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    rumors: "bg-red-500/20 text-red-400 border-red-500/30",
    analysis: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };

  const CATEGORY_LABELS: Record<string, string> = {
    movie_news: "Movies",
    show_news: "Shows",
    casting: "Casting",
    card_market: "Card Market",
    release_dates: "Releases",
    rumors: "Rumors",
    analysis: "Analysis",
  };

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Dark red/crimson background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950 via-red-950/95 to-red-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-800/15 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/15 border border-red-500/30 rounded-full mb-4">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-bold tracking-wide">BREAKING NEWS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            LATEST <span className="text-red-400">MCU NEWS</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Stay up to date with the biggest stories from the Marvel Cinematic Universe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {articles.map((article: any) => (
            <Link key={article.id} href={`/mcu-news/${article.slug}`}>
              <div className="group relative bg-card/80 backdrop-blur-sm border border-red-500/20 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 h-full">
                {/* Image */}
                {article.featuredImageUrl && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={article.featuredImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${CATEGORY_COLORS[article.category] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                        {CATEGORY_LABELS[article.category] || article.category}
                      </span>
                    </div>
                  </div>
                )}
                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(article.publishedAt)}
                    </span>
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read More <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/mcu-news">
            <Button size="lg" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold">
              View All MCU News
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const { addItem } = useCart();
  const productLines = getProductLines();
  const variantSeries = productLines.find(l => l.id === "variant-series");
  const gambitProduct = getFeaturedProduct();
  const comingSoonLines = productLines.filter(l => !l.available);


  return (
    <div className="min-h-screen">
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
                <span className="text-white">LOVE MARVEL?</span>
                <br />
                <span className="text-primary">START HERE.</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-lg mb-8 leading-relaxed">
                Whether you grew up reading comics, watched every movie with your kids, or can't wait for Avengers: Doomsday — <strong className="text-white">you're in the right place.</strong>
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

      {/* ===== 4. NEW TO COLLECTING? — BEGINNER WELCOME ===== */}
      <section id="new-to-collecting" className="relative py-16 lg:py-20 overflow-hidden">
        {/* Deep Green Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-950 via-green-950/95 to-green-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-800/15 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full mb-4">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold tracking-wide">WELCOME</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              NEW TO <span className="text-primary">COLLECTING?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              You don't need to be an expert. If you love Marvel, you already belong here. Trading cards are just another way to connect with the characters and stories you care about — and we'll help you get started.
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

      {/* ===== 4b. COLLECTOR'S JOURNEY — REWRITTEN FOR FANS ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        {/* Deep Black Background */}
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container relative z-10">
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

      {/* ===== 5. MCU COUNTDOWN — DOOMSDAY & SPIDER-MAN ===== */}
      <MCUCountdown />

      {/* ===== 5b. DOOMSDAY — CHARACTER INTEL HUB ===== */}
      <DoomsdaySection />

      {/* ===== 5c. LATEST MCU NEWS — AUTO-POPULATED ===== */}
      <LatestMCUNews />

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

          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm mb-4">Want to be first to know when new fandoms drop?</p>
            <NewsletterSignup variant="sidebar" source="homepage-fandom-roadmap" headline="Get Notified" subtext="Be the first to know when new fandoms launch" />
          </div>
        </div>
      </section>

      {/* ===== WHATNOT SECTION MOVED TO POSITION 3 ===== */}

      {/* ===== 10. WHAT IS A REPACK? — SIMPLIFIED FOR BEGINNERS ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        {/* Deep Black Background */}
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container relative z-10">
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
      <section className="relative py-16 lg:py-20 overflow-hidden">
        {/* Deep Purple Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-purple-950/95 to-purple-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-800/15 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="container relative z-10">
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
                    <span
                      className="text-sm font-bold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1.5 cursor-pointer"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = '/checklist/nlf-marvel-52-singles'; }}
                    >
                      <Eye className="w-4 h-4" /> See the Full Checklist
                    </span>
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
            <Link href="/checklists">
              <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                View Cosmic Hits
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 12. TRUST / WHY NLF ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        {/* Rich Gold/Amber Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950 via-amber-950/95 to-amber-950" />
        <div className="absolute inset-0">
          <img src={TRUST_BG} alt="" className="w-full h-full object-cover opacity-15" loading="lazy" decoding="async" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-800/15 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
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
        <section className="relative py-16 lg:py-20 overflow-hidden">
          {/* Deep Black Background */}
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="container relative z-10">
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

      {/* ===== 14. JOIN OUR COMMUNITY ===== */}
      <section className="relative py-14 lg:py-18 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-background to-background" />
        <div className="container relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              JOIN THE <span className="text-blue-400">COMMUNITY</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay connected with fellow collectors. Get breaking MCU news, live stream alerts, and exclusive drops.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61575227498498"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 group-hover:scale-110 transition-all">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">Facebook</h3>
              <p className="text-sm text-muted-foreground">Like our page for daily MCU news & card market updates</p>
              <span className="inline-block mt-3 text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">Like Page &rarr;</span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/northlandlegendaryfinds"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/10 transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 group-hover:scale-110 transition-all">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-pink-400 transition-colors">Instagram</h3>
              <p className="text-sm text-muted-foreground">Follow for card reveals, grading results & behind the scenes</p>
              <span className="inline-block mt-3 text-sm font-bold text-pink-400 group-hover:text-pink-300 transition-colors">Follow Us &rarr;</span>
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/NorthlandFinds"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-gray-400/40 hover:shadow-lg hover:shadow-gray-400/10 transition-all"
            >
              <div className="w-16 h-16 bg-black border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-white/10 group-hover:scale-110 transition-all">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-white transition-colors">X (Twitter)</h3>
              <p className="text-sm text-muted-foreground">Breaking news, hot takes & collector community threads</p>
              <span className="inline-block mt-3 text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Follow Us &rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* ===== 15. NEWSLETTER ===== */}
      <NewsletterSignup variant="section" source="homepage-inline" />
    </div>
  );
}
