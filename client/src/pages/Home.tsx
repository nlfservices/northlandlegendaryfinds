/**
 * Homepage - E-commerce storefront
 * Design: Hero with pack image, Card Showcase, product lines, trust elements
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { ShoppingCart, Shield, Star, TrendingUp, Package, ArrowRight, Zap, BookOpen, Clock, Eye } from "lucide-react";
import CardShowcase, { type ShowcaseCard } from "@/components/CardShowcase";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { getProductLines, getComingSoonProducts, products } from "@/lib/products";
import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import ProductCard from "@/components/ProductCard";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hero-banner-jniBj55ukeiEDpJxc2aLgB.webp";
const NLF_PACK = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-nlf-variant-2CkMPP3CsZhFkFXpzSuZkV.webp";
const TRUST_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/trust-section-bg-kwnjuLkybJ2rqpCpEwiChw.webp";

// ===== SHOWCASE CARDS =====
const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    id: "hulk-black-refractor",
    rawFront: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk-raw-front_44893b76.jpg",
    rawBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk-raw-back_5cb01b4c.jpg",
    gradedFront: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk-graded-front_aab29f02.jpg",
    gradedBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk-graded-back_d2fb1b7c.jpg",
    cardName: "HULK",
    setName: "2025 Topps Marvel Mint",
    serialNumber: "#109 · Black Refractor /10",
    grade: "10",
    gradeLabel: "GEM MINT",
    gradingCompany: "CGC",
  },
];

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const { addItem } = useCart();
  const productLines = getProductLines();
  const variantSeries = productLines.find(l => l.id === "variant-series");
  const comingSoonLines = productLines.filter(l => !l.available);

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div className="py-12 lg:py-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-bold tracking-wide">LAUNCHING MARCH 13, 2026</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-white">UNBOX THE</span>
                <br />
                <span className="text-primary">LEGENDARY</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-lg mb-8 leading-relaxed">
                Premium <strong className="text-primary">Marvel</strong> trading card repacks built different — strong floor, loaded middle, healthy ceiling. Every pack delivers.
              </p>

              {/* Launch countdown banner */}
              <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-xl px-5 py-3 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-primary font-bold text-sm uppercase tracking-wider">Available Friday, March 13th at 7:00 PM CT</span>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 shadow-lg shadow-primary/20">
                    <Eye className="w-5 h-5 mr-2" />
                    Preview Products
                  </Button>
                </Link>
                <Link href="/checklists">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold text-lg px-8 py-6">
                    View Checklists
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Pack Image */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-8 bg-primary/10 rounded-full blur-3xl" />
                <img
                  src={NLF_PACK}
                  alt="NLF Repack"
                  className="relative w-80 xl:w-96 drop-shadow-[0_0_40px_rgba(0,255,65,0.2)] hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-card border-y border-border">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>6</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Product Lines</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400" style={{ fontFamily: "'Anton', sans-serif" }}>100%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Authentic Topps</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400" style={{ fontFamily: "'Anton', sans-serif" }}>NO FILLER</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Every Card Counts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400" style={{ fontFamily: "'Anton', sans-serif" }}>FREE</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Shipping Over $199</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CARD SHOWCASE - THE HIGHLIGHT ===== */}
      <CardShowcase
        cards={SHOWCASE_CARDS}
        autoPlayInterval={6000}
      />

      {/* ===== THE VARIANT SERIES — LAUNCH EXCLUSIVE ===== */}
      {variantSeries && (
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full mb-4">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-bold">LAUNCHING FRIDAY, MARCH 13TH</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                THE <span className="text-primary">VARIANT</span> SERIES
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {variantSeries.tagline}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {variantSeries.products.map((product) => (
                <ProductCard key={product.id} product={product} featured />
              ))}
            </div>

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
      )}

      {/* ===== TRUST / WHY NLF ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={TRUST_BG} alt="" className="w-full h-full object-cover opacity-30" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <h3 className="font-bold text-lg mb-2">Better Middle</h3>
              <p className="text-sm text-muted-foreground">
                Where competitors stuff filler, we load quality. Your average pack beats their best day.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Strong Floor</h3>
              <p className="text-sm text-muted-foreground">
                No junk filler, no worthless base cards. Every single pack delivers real, collectible value.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-purple-500/30 transition-colors">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Healthy Ceiling</h3>
              <p className="text-sm text-muted-foreground">
                Real chase cards worth real money — numbered parallels, autos, and graded slabs in the mix.
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

      {/* ===== EXPLORE OUR COLLECTION ===== */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              EXPLORE OUR <span className="text-primary">COLLECTION</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Dive into the complete card database — browse every 2025 Topps Marvel set
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
            <Link href="/cards">
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 via-card to-purple-500/10 border border-border hover:border-primary/50 transition-all duration-300 p-8 cursor-pointer hover:shadow-lg hover:shadow-primary/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">Card Database</h3>
                    <p className="text-sm text-muted-foreground">1,709 cards across 6 sets</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Browse every 2025 Topps Marvel card set — Chrome, Comic Book Heroes, Mint, Sapphire, Studios, and Studios Sapphire. Know exactly what you could pull from our repacks.
                </p>
                <div className="flex items-center gap-2 mt-4 text-primary text-sm font-bold">
                  Browse Sets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            JOIN THE <span className="text-primary">LEGEND</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Be the first to know about new drops, exclusive offers, and collector tips
          </p>
          <Link href="/subscribe">
            <Button size="lg" className="bg-primary hover:bg-primary/90 font-bold text-lg px-10 py-6">
              Sign Up for Early Access
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
