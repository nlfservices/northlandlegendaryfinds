/**
 * Homepage - E-commerce storefront
 * Design: Hero with pack image, Card Showcase, product lines, trust elements
 */

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { ShoppingCart, Shield, Star, TrendingUp, Package, ArrowRight, Zap, BookOpen, Clock, Eye, Radio, HelpCircle, Search, Box, Gift, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { getProductLines, getComingSoonProducts, products, getFeaturedProduct } from "@/lib/products";
import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import ProductCard from "@/components/ProductCard";
import SEO, { organizationJsonLd, websiteJsonLd, localBusinessJsonLd } from "@/components/SEO";
import DoomsdaySection from "@/components/DoomsdaySection";
import MarvelousTop5 from "@/components/MarvelousTop5";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hero-banner-jniBj55ukeiEDpJxc2aLgB.webp";
const NLF_PACK = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-nlf-variant-2CkMPP3CsZhFkFXpzSuZkV.webp";
const TRUST_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/trust-section-bg-kwnjuLkybJ2rqpCpEwiChw.webp";


export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const { addItem } = useCart();
  const productLines = getProductLines();
  const variantSeries = productLines.find(l => l.id === "variant-series");
  const gambitProduct = getFeaturedProduct();
  const comingSoonLines = productLines.filter(l => !l.available);

  // Inline email capture state
  const [subEmail, setSubEmail] = useState("");
  const [subFirstName, setSubFirstName] = useState("");
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const subscribeMutation = trpc.subscribe.submit.useMutation({
    onSuccess: (data) => {
      setSubscribeSuccess(true);
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  return (
    <div className="min-h-screen">
      <SEO
        path="/"
        noSuffix
        jsonLd={[organizationJsonLd(), websiteJsonLd(), localBusinessJsonLd()]}
      />
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[450px] sm:min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" loading="eager" decoding="async" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div className="py-12 lg:py-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-bold tracking-wide">LAUNCHING APRIL 27, 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] mb-4 sm:mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-white">UNBOX THE</span>
                <br />
                <span className="text-primary">LEGENDARY</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-lg mb-8 leading-relaxed">
                Premium <strong className="text-primary">Marvel</strong> trading card repacks built different — hand-curated, fully transparent, and packed with quality. Every card counts.
              </p>

              {/* Launch countdown banner */}
              <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-xl px-5 py-3 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-primary font-bold text-sm uppercase tracking-wider">Available Sunday, April 27th at 7:00 PM CT</span>
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
                  loading="eager"
                  decoding="async"
                  width={384}
                  height={384}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
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

      {/* ===== WHAT IS A REPACK? ===== */}
      <section className="py-16 lg:py-20">
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
      <section className="py-16 lg:py-20 bg-card/30 border-y border-border">
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

      {/* ===== DOOMSDAY — CHARACTER INTEL HUB ===== */}
      <DoomsdaySection />

      {/* ===== MARVELOUS TOP 5 ===== */}
      <MarvelousTop5 />

      {/* ===== PRODUCT PYRAMID — GAMBIT ON TOP, VARIANT SERIES BELOW ===== */}
      <section className="py-16 lg:py-20">
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

      {/* ===== NEWSLETTER — INLINE EMAIL CAPTURE ===== */}
      <section className="py-16 lg:py-20 bg-card border-y border-border">
        <div className="container max-w-2xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            JOIN THE <span className="text-primary">LEGEND</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-2">
            Be the first to know about new drops, exclusive offers, and collector tips
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Sign up and get <strong className="text-primary">10% off</strong> your first order
          </p>

          {subscribeSuccess ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 className="w-12 h-12 text-primary" />
              <p className="text-lg font-bold text-primary">You're in!</p>
              <p className="text-muted-foreground">Check your email for your 10% discount code.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!subEmail.trim()) return;
                subscribeMutation.mutate({
                  email: subEmail.trim(),
                  firstName: subFirstName.trim() || undefined,
                  source: "homepage-inline",
                });
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            >
              <input
                type="text"
                placeholder="First name (optional)"
                value={subFirstName}
                onChange={(e) => setSubFirstName(e.target.value)}
                className="flex-shrink-0 w-full sm:w-36 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <Button
                type="submit"
                size="lg"
                disabled={subscribeMutation.isPending}
                className="bg-primary hover:bg-primary/90 font-bold text-lg px-8 py-3 shadow-lg shadow-primary/20"
              >
                {subscribeMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}
          <p className="text-xs text-muted-foreground mt-4">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
