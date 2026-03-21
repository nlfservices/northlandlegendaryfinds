/**
 * Public Checklists Page - Premium trust-building showcase
 * The HIGHLIGHT feature of the site - builds trust through transparency
 * Features: Cinematic hero with floating cards, chase card showcase, 
 * tier breakdowns, card image gallery, trust comparison, how it works
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  ListChecks, ArrowRight, Package, Zap, Radio,
  CheckCircle2, Circle, Loader2, TrendingUp, Eye,
  Shield, ShieldCheck, Lock, Sparkles, Star, Crown,
  XCircle, Check, ChevronRight, Gem, Target, BookOpen
} from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";
import CommunityVoting from "@/components/CommunityVoting";
import { useState, useEffect, useRef, useMemo } from "react";

// ===== CHASE CARD DATA (top cards from the database) =====
const CHASE_CARDS = [
  { name: "Spider-Man", parallel: "Superfractor 1/1", value: "$500+", tier: "chase", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-101_Spider-Man_318857c1.webp" },
  { name: "Wolverine", parallel: "Gold Auto /5", value: "$400+", tier: "chase", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-103_Wolverine_1cc49682.webp" },
  { name: "Iron Man", parallel: "Minted Metal Auto /10", value: "$350+", tier: "chase", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-001_Iron_Man_80cf3e9d.webp" },
  { name: "Deadpool", parallel: "Red Refractor Auto /25", value: "$300+", tier: "chase", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CBH-047_Loki_d7ab417b.webp" },
  { name: "Venom", parallel: "Black Refractor /50", value: "$300+", tier: "chase", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-149_Venom_45603aab.webp" },
  { name: "Captain America", parallel: "Patriot Refractor /25", value: "$250-$400", tier: "chase", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_185_captain_america-koKKBbDfbETQNRvGxiM3Nh.webp" },
];

// Gallery card images from the database
const GALLERY_CARDS = [
  { name: "Thor", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-119_Thor_56a124bc.webp" },
  { name: "Black Panther", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-136_Black_Panther_118340ab.webp" },
  { name: "Hulk", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-128_Hulk_dba525fc.webp" },
  { name: "Magneto", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_169_magneto-5NA8vtyhi9Bfkd6qG3pBzv.webp" },
  { name: "Scarlet Witch", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_170_scarlet_witch-Wpi5Qa4Bh9KzeuZaBKAUHD.webp" },
  { name: "Doctor Strange", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doctor-strange_e4ce5886.png" },
  { name: "Loki", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CBH-047_Loki_d7ab417b.webp" },
  { name: "Spider-Man (Alt)", image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CBH-022_Spider-Man_cf5da69b.webp" },
];

const HERO_CARDS = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-101_Spider-Man_318857c1.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-001_Iron_Man_80cf3e9d.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-103_Wolverine_1cc49682.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-149_Venom_45603aab.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_185_captain_america-koKKBbDfbETQNRvGxiM3Nh.webp",
];

export default function Checklists() {
  const { data: products, isLoading } = trpc.public.products.list.useQuery();
  const [animatedStats, setAnimatedStats] = useState({ cards: 0, products: 0, transparency: 0 });

  // Animate stats on mount
  useEffect(() => {
    const totalCards = 650;
    const totalProducts = products?.length || 3;
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedStats({
        cards: Math.round(totalCards * eased),
        products: Math.round(totalProducts * eased),
        transparency: Math.round(100 * eased),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [products]);

  const categoryColors: Record<string, string> = {
    marvel: "from-red-600 to-red-800",
    starwars: "from-cyan-600 to-blue-800",
    sports: "from-green-600 to-green-800",
    pokemon: "from-yellow-600 to-amber-800",
    other: "from-purple-600 to-purple-800",
  };

  const categoryLabels: Record<string, string> = {
    marvel: "Marvel",
    starwars: "Star Wars",
    sports: "Sports",
    pokemon: "Pokemon",
    other: "Other",
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Card Set Checklists — Full Transparency"
        description="Every card in every repack — published with images before a single pack is opened. 650+ cards across 3 products. See exactly what you could pull. No other repack brand shows you this."
        path="/checklists"
        jsonLd={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Checklists", url: "/checklists" }])}
      />

      {/* ===== CINEMATIC HERO SECTION ===== */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        {/* Dark gradient background with subtle texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
        
        {/* Animated floating card images */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {HERO_CARDS.map((img, i) => (
            <div
              key={i}
              className="absolute opacity-15 hover:opacity-25 transition-opacity duration-700"
              style={{
                left: `${10 + i * 18}%`,
                top: `${15 + (i % 3) * 20}%`,
                transform: `rotate(${-15 + i * 8}deg) scale(${0.6 + (i % 3) * 0.15})`,
                animation: `float-card ${6 + i * 0.8}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <img src={img} alt="" className="w-32 lg:w-44 rounded-lg shadow-2xl" loading="lazy" />
            </div>
          ))}
          {/* Radial glow behind center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/30 rounded-full mb-8 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wider">INDUSTRY-LEADING TRANSPARENCY</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
              EVERY CARD.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-amber-400">
                EVERY PACK.
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl text-muted-foreground font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                Published before a single pack is opened.
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              We're the only repack brand that shows you <strong className="text-foreground">actual card images</strong> alongside 
              every checklist. No hidden cards. No mystery inventory. Just complete, verifiable transparency.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#products" className="inline-flex">
                <Button size="lg" className="text-lg px-8 py-6 gap-2 bg-primary hover:bg-primary/90">
                  <Eye className="w-5 h-5" />
                  View Checklists
                </Button>
              </a>
              <Link href="/transparency">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 gap-2 border-white/20 hover:bg-white/5">
                  <Shield className="w-5 h-5" />
                  Our Promise
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ===== ANIMATED STATS BAR ===== */}
      <section className="relative bg-card border-y border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="container relative py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>
                {animatedStats.cards}+
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Cards Listed</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-cyan-400" style={{ fontFamily: "'Anton', sans-serif" }}>
                {animatedStats.products}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Active Products</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-amber-400" style={{ fontFamily: "'Anton', sans-serif" }}>
                {animatedStats.transparency}%
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Published Checklists</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-emerald-400" style={{ fontFamily: "'Anton', sans-serif" }}>
                1,982
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Card Images in Database</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CHASE CARD SHOWCASE ===== */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
        <div className="container relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold tracking-wider">TOP CHASE CARDS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              THE CARDS <span className="text-primary">EVERYONE WANTS</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              These are the crown jewels of our repacks. Every single one is listed on the checklist — 
              with actual images — before packs go live.
            </p>
          </div>

          {/* Chase cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {CHASE_CARDS.map((card, i) => (
              <div key={i} className="group relative">
                <div className="relative aspect-[2.5/3.5] rounded-xl overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/10 group-hover:border-primary/50 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  {/* Card info */}
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <div className="text-xs text-amber-400 font-bold mb-0.5">{card.value}</div>
                    <div className="text-sm font-bold text-white leading-tight">{card.name}</div>
                    <div className="text-[10px] text-white/60 mt-0.5">{card.parallel}</div>
                  </div>
                  {/* Chase badge */}
                  <div className="absolute top-2 right-2">
                    <div className="px-1.5 py-0.5 bg-amber-500/90 rounded text-[9px] font-bold text-black uppercase">
                      Chase
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 inline mr-1 text-amber-400" />
              These are real cards from our inventory — not stock photos. Every card shown is in a pack.
            </p>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT CHECKLISTS ===== */}
      <section id="products" className="py-16 lg:py-24 bg-card/50 scroll-mt-20">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full mb-4">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wider">FULL CHECKLISTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              CHOOSE YOUR <span className="text-primary">PRODUCT</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Every product has a complete checklist published before packs go live. 
              Click any product to see every card, tier breakdown, and pull tracking.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-20">
              <ListChecks className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Checklists Coming Soon</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Product checklists will be published here before launch. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <ProductChecklistCard key={product.id} product={product} categoryColors={categoryColors} categoryLabels={categoryLabels} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CARD IMAGE GALLERY (Scrolling Showcase) ===== */}
      <section className="py-16 lg:py-24 overflow-hidden">
        <div className="container mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4">
              <Gem className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-bold tracking-wider">ACTUAL CARD IMAGES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              SEE WHAT'S <span className="text-cyan-400">IN THE PACKS</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We photograph every card in our inventory. No stock photos, no generic images — 
              these are the actual cards you could pull.
            </p>
          </div>
        </div>

        {/* Infinite scroll gallery */}
        <div className="relative">
          <div className="flex gap-6 animate-scroll-left">
            {[...GALLERY_CARDS, ...GALLERY_CARDS, ...GALLERY_CARDS].map((card, i) => (
              <div key={i} className="shrink-0 w-48 lg:w-56">
                <div className="relative aspect-[2.5/3.5] rounded-xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105">
                  <img src={card.image} alt={card.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="text-sm font-bold text-white">{card.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ===== NLF vs THE INDUSTRY (Trust Comparison) ===== */}
      <section className="py-16 lg:py-24 bg-card/50">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-4">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-bold tracking-wider">TRUST COMPARISON</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              NLF vs <span className="text-primary">THE INDUSTRY</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Most repack sellers show you a text list at best. Here's what we do differently.
            </p>
          </div>

          {/* Comparison table */}
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-3 bg-zinc-900">
              <div className="p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Feature</div>
              <div className="p-4 text-sm font-bold text-center">
                <span className="text-primary">NLF</span>
              </div>
              <div className="p-4 text-sm font-bold text-center text-muted-foreground">Others</div>
            </div>
            {[
              { feature: "Published checklist before packs open", nlf: true, others: "sometimes" },
              { feature: "Actual card images on checklist", nlf: true, others: false },
              { feature: "Tier breakdown (Chase / Hit / Base)", nlf: true, others: false },
              { feature: "Real-time pull tracking", nlf: true, others: false },
              { feature: "Card condition listed", nlf: true, others: "sometimes" },
              { feature: "Finalization statement", nlf: true, others: false },
              { feature: "1,982+ card image database", nlf: true, others: false },
              { feature: "Whatnot-compliant MSRP display", nlf: true, others: "sometimes" },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-background' : 'bg-card'} border-t border-border`}>
                <div className="p-4 text-sm font-medium">{row.feature}</div>
                <div className="p-4 flex justify-center">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="p-4 flex justify-center">
                  {row.others === true ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : row.others === "sometimes" ? (
                    <span className="text-xs text-amber-400 font-medium">Sometimes</span>
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400/60" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              HOW OUR <span className="text-primary">CHECKLISTS WORK</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <BookOpen className="w-8 h-8" />,
                title: "We Publish Everything",
                desc: "Before a single pack is opened, the complete checklist goes live — every card, every tier, every image. Nothing is hidden.",
                color: "text-primary",
                bg: "bg-primary/10",
                border: "border-primary/30",
              },
              {
                step: "02",
                icon: <Eye className="w-8 h-8" />,
                title: "You Verify It",
                desc: "Browse the checklist, see actual card images, check tier breakdowns. Know exactly what's possible before you buy a pack.",
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
                border: "border-cyan-500/30",
              },
              {
                step: "03",
                icon: <Zap className="w-8 h-8" />,
                title: "Track Live Pulls",
                desc: "During Whatnot streams, watch pulls update in real-time. See what's been pulled and what's still available in the remaining packs.",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/30",
              },
            ].map((item, i) => (
              <div key={i} className={`relative rounded-2xl border ${item.border} p-8 ${item.bg} backdrop-blur-sm`}>
                <div className={`text-6xl font-bold ${item.color} opacity-20 absolute top-4 right-6`} style={{ fontFamily: "'Anton', sans-serif" }}>
                  {item.step}
                </div>
                <div className={`w-14 h-14 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center mb-6 ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY TRANSPARENCY MATTERS ===== */}
      <section className="py-16 lg:py-24 bg-card/50">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHY WE PUBLISH <span className="text-primary">CHECKLISTS</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-primary/20">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-3">Full Transparency</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every card is listed before you buy. Know exactly what's possible in every pack. 
                We believe you deserve to see what you're paying for.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-cyan-500/20">
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-3">Live Tracking</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track pack openings live during Whatnot streams. See what's still available 
                in real-time so you can make informed decisions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-amber-500/20">
                <TrendingUp className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="font-bold text-lg mb-3">Proven Value</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track the actual value of pulls across all shows. Our repacks deliver real value — 
                and the checklists prove it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY VOTING — SHAPE THE NEXT DROP ===== */}
      <CommunityVoting />

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
        <div className="container relative max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
            READY TO SEE <span className="text-primary">EVERY CARD?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Pick a product above and browse the complete checklist. Or visit our Whatnot page 
            to see when the next live stream drops.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products">
              <Button size="lg" className="gap-2 px-8">
                <ListChecks className="w-5 h-5" />
                Browse Checklists
              </Button>
            </a>
            <Link href="/whatnot">
              <Button size="lg" variant="outline" className="gap-2 px-8 border-white/20">
                <Radio className="w-5 h-5" />
                Whatnot Schedule
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes float-card {
          0% { transform: translateY(0) rotate(var(--rotation, -10deg)); }
          100% { transform: translateY(-20px) rotate(calc(var(--rotation, -10deg) + 3deg)); }
        }
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

function ProductChecklistCard({ product, categoryColors, categoryLabels }: {
  product: any;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
}) {
  const { data: stats } = trpc.public.products.stats.useQuery({ id: product.id });

  const progressPercent = stats?.totalPacks ? Math.round(((stats.totalPacks - (stats.packsRemaining ?? stats.totalPacks)) / stats.totalPacks) * 100) : 0;

  // Tier distribution from stats or estimates
  const tierData = useMemo(() => {
    const total = stats?.totalChecklist || 0;
    // These are approximate based on our data analysis
    if (product.name?.includes("500")) return { chase: 50, hit: 147, base: 303, total };
    if (product.name?.includes("100")) return { chase: 50, hit: 50, base: 0, total };
    if (product.name?.includes("50")) return { chase: 50, hit: 0, base: 0, total };
    return { chase: Math.round(total * 0.1), hit: Math.round(total * 0.3), base: Math.round(total * 0.6), total };
  }, [stats, product]);

  return (
    <Link href={`/checklist/${product.slug}`}>
      <Card className="group hover:border-primary/40 transition-all duration-500 cursor-pointer overflow-hidden h-full hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
        {/* Category Banner */}
        <div className={`h-1.5 bg-gradient-to-r ${categoryColors[product.category] || categoryColors.other}`} />
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {categoryLabels[product.category] || product.category}
                </Badge>
                {product.isWhatnotExclusive && (
                  <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                    <Radio className="w-3 h-3 mr-1" /> Whatnot
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{product.name}</h3>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground mb-5 line-clamp-2">{product.description}</p>
          )}

          {/* Tier Breakdown Visual */}
          <div className="mb-5">
            <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden bg-muted">
              {tierData.chase > 0 && (
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-l-full"
                  style={{ width: `${(tierData.chase / (tierData.total || 1)) * 100}%` }}
                  title={`Chase: ${tierData.chase}`}
                />
              )}
              {tierData.hit > 0 && (
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                  style={{ width: `${(tierData.hit / (tierData.total || 1)) * 100}%` }}
                  title={`Hit: ${tierData.hit}`}
                />
              )}
              {tierData.base > 0 && (
                <div
                  className="h-full bg-gradient-to-r from-zinc-500 to-zinc-400 rounded-r-full"
                  style={{ width: `${(tierData.base / (tierData.total || 1)) * 100}%` }}
                  title={`Base: ${tierData.base}`}
                />
              )}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
              {tierData.chase > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Chase ({tierData.chase})
                </span>
              )}
              {tierData.hit > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Hit ({tierData.hit})
                </span>
              )}
              {tierData.base > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-zinc-400" /> Base ({tierData.base})
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Cards</span>
              <span className="font-bold">{stats?.totalChecklist || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Packs Remaining</span>
              <span className="font-bold text-primary">{stats?.packsRemaining || product.packsRemaining} / {stats?.totalPacks || product.totalPacks}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {progressPercent}% opened
            </div>
          </div>

          {/* View CTA */}
          <div className="mt-5 pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
              <Eye className="w-4 h-4" />
              View Full Checklist
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
