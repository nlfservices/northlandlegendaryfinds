/**
 * Whatnot Referral Landing Page — Facebook Ads Funnel
 * 
 * Purpose: Convert cold Facebook ad traffic into:
 * 1. Whatnot signups via referral link ($15 credit for them, $5 for NLF)
 * 2. Email/lead captures for future marketing
 * 3. Repack shop visitors
 * 
 * URL: /free-credit
 * Referral link: https://whatnot.com/invite/northlandfinds
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Gift, ArrowRight, ExternalLink, Zap, Users, Radio,
  ShoppingCart, CheckCircle2, Loader2, Star, Shield,
  Package, Eye, DollarSign, Clock, Sparkles, Trophy,
  ChevronDown
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const WHATNOT_INVITE = "https://whatnot.com/invite/northlandfinds";
const WHATNOT_STORE = "https://www.whatnot.com/user/northlandfinds";

// Product images from CDN
const IMAGES = {
  cosmicDrop: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-nlf-variant-2CkMPP3CsZhFkFXpzSuZkV.webp",
  chromeEdition: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-100-pack-LsACR5odDHrd8r7na6iEeJ.webp",
  gambitDeck: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/gambit-deck-52-singles-agMj46W47777xcjTUjBw5L.webp",
  nlfLogo: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/rwZcaJaSCFxygqjF.png",
  heroBg: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hero-banner-jniBj55ukeiEDpJxc2aLgB.webp",
  whatnotQr: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/whatnot-qr-1_5cdbb693.png",
};

export default function WhatnotDeal() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      localStorage.setItem("nlf_email_submitted", "true");
      localStorage.setItem("nlf_popup_closed", "permanent");
      toast.success("You're in! Check your inbox for updates.");
      // Fire FB Pixel Lead event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: "Whatnot Referral Landing Page",
          content_category: "email_signup",
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribeMutation.isPending) return;
    subscribeMutation.mutate({
      email: email.trim(),
      firstName: firstName.trim() || undefined,
      source: "whatnot-referral-landing",
    });
  };

  const handleWhatnotClick = () => {
    // Fire FB Pixel custom event for Whatnot referral click
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("trackCustom", "WhatnotReferralClick", {
        content_name: "Whatnot Invite Link",
        referral_url: WHATNOT_INVITE,
      });
    }
  };

  // Fire FB Pixel ViewContent on page load
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "ViewContent", {
        content_name: "Whatnot Referral Landing Page",
        content_category: "referral_funnel",
      });
    }
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Get $15 FREE to Shop Live Marvel Card Breaks"
        description="Sign up for Whatnot through Northland Legendary Finds and get $15 FREE credit to shop live Marvel trading card breaks, exclusive repacks, and graded slab auctions."
        path="/free-credit"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Free $15 Credit", url: "/free-credit" },
        ])}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[650px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={IMAGES.heroBg} alt="" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text */}
            <div className="py-8 lg:py-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/15 border border-yellow-500/40 rounded-full mb-6 animate-pulse">
                <Gift className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-bold tracking-wide">LIMITED TIME OFFER</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.9] mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-yellow-400">$15 FREE</span>
                <br />
                <span className="text-white">TO SHOP LIVE</span>
                <br />
                <span className="text-primary">CARD BREAKS</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-lg mb-6 leading-relaxed">
                Join Whatnot through our link and get <span className="text-yellow-400 font-bold">$15 free credit</span> to 
                shop our live Marvel trading card breaks. Graded slabs, numbered parallels, chase cards — all live on camera.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <a
                  href={WHATNOT_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatnotClick}
                >
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-6 w-full sm:w-auto shadow-lg shadow-yellow-500/20">
                    <Gift className="w-5 h-5 mr-2" />
                    Claim Your $15 Credit
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 w-full sm:w-auto">
                    How It Works
                    <ChevronDown className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary" />
                  100% Free
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  No Catch
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  Takes 30 Seconds
                </span>
              </div>
            </div>

            {/* Right: Product showcase / visual */}
            <div className="hidden lg:flex flex-col items-center justify-center">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-8 bg-yellow-500/10 rounded-full blur-3xl" />
                <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl" />
                
                {/* $15 badge */}
                <div className="absolute -top-4 -right-4 z-20 bg-yellow-500 text-black font-black text-2xl rounded-full w-20 h-20 flex items-center justify-center shadow-lg shadow-yellow-500/30 border-4 border-yellow-300" style={{ fontFamily: "'Anton', sans-serif" }}>
                  $15
                </div>

                {/* Product image stack */}
                <div className="relative z-10">
                  <img
                    src={IMAGES.cosmicDrop}
                    alt="NLF Marvel Trading Card Repack"
                    className="w-80 h-80 object-contain drop-shadow-2xl"
                    loading="eager"
                  />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Use your $15 credit on any of our live shows
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-16 lg:py-20 bg-card border-y border-border">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-4 text-sm px-4 py-1">
              SIMPLE 3-STEP PROCESS
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              HOW TO GET YOUR <span className="text-yellow-400">$15 FREE</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              It takes less than a minute. Sign up, get your credit, and start shopping live card breaks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-yellow-500/30 group-hover:border-yellow-500/60 transition-colors">
                <span className="text-4xl font-bold text-yellow-400" style={{ fontFamily: "'Anton', sans-serif" }}>1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Sign Up on Whatnot</h3>
              <p className="text-muted-foreground">
                Click our referral link and create a free Whatnot account. It takes 30 seconds — just an email and password.
              </p>
              {/* Connector arrow (hidden on mobile) */}
              <div className="hidden md:block absolute top-10 -right-4 text-muted-foreground/30">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-primary/30 group-hover:border-primary/60 transition-colors">
                <span className="text-4xl font-bold text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get $15 Credit Instantly</h3>
              <p className="text-muted-foreground">
                Your $15 credit is automatically added to your account. No code needed — it's ready to spend on our shows.
              </p>
              <div className="hidden md:block absolute top-10 -right-4 text-muted-foreground/30">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-purple-500/30 group-hover:border-purple-500/60 transition-colors">
                <span className="text-4xl font-bold text-purple-400" style={{ fontFamily: "'Anton', sans-serif" }}>3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Shop Our Live Shows</h3>
              <p className="text-muted-foreground">
                Follow Northland Legendary Finds on Whatnot and join our next live Marvel card break. Use your credit on any item!
              </p>
            </div>
          </div>

          {/* CTA after steps */}
          <div className="text-center mt-12">
            <a
              href={WHATNOT_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatnotClick}
            >
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-10 py-6 shadow-lg shadow-yellow-500/20">
                <Gift className="w-5 h-5 mr-2" />
                Get Your $15 Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU'LL FIND ON OUR SHOWS ===== */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHAT YOU'LL FIND ON <span className="text-purple-400">OUR SHOWS</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Live Marvel trading card breaks with real cards, real pulls, and real excitement. Here's what's up for grabs.
            </p>
          </div>

          {/* Alternating layout: image left/right with text */}
          <div className="space-y-16">
            {/* Item 1: Image Left, Text Right */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={IMAGES.cosmicDrop}
                  alt="NLF Variant Series Cosmic Drop - 500 Marvel Trading Card Repacks"
                  className="relative w-full max-w-md mx-auto object-contain rounded-xl"
                  loading="lazy"
                />
              </div>
              <div>
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 mb-3">LIVE STREAM EXCLUSIVE</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                  PREMIUM MARVEL <span className="text-primary">REPACKS</span>
                </h3>
                <p className="text-muted-foreground text-lg mb-4">
                  Our flagship repack series features hand-curated packs from 2025 Topps Chrome Marvel, Comic Book Heroes, 
                  Marvel Mint, and more. Every pack has a published checklist — you know exactly what you could pull.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Numbered parallels (/199, /99, /50, /25, /10, /5, /1)",
                    "CGC & AGS graded slabs (9.0 to 10.0)",
                    "Chase inserts and rare variants",
                    "Full published checklists for every series",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/shop">
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Browse Our Repacks
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Item 2: Text Left, Image Right */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Badge className="bg-red-500/10 text-red-400 border-red-500/30 mb-3">LIVE ON CAMERA</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                  LIVE CARD <span className="text-red-400">BREAKS</span>
                </h3>
                <p className="text-muted-foreground text-lg mb-4">
                  Every pack is opened live on camera so you see exactly what you're getting. No pre-opened packs, 
                  no mystery — just real-time excitement as cards are revealed. Chat with other collectors, 
                  react to big pulls, and be part of the community.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Every pack opened live — nothing pre-opened",
                    "Real-time chat with fellow collectors",
                    "Instant shipping after the show",
                    "Pull tracker updated live during streams",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/whatnot">
                  <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <Radio className="w-4 h-4 mr-2" />
                    See Our Whatnot Shows
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="order-1 lg:order-2 relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={IMAGES.gambitDeck}
                  alt="Gambit's Deck - 52 Single Card Marvel Packs"
                  className="relative w-full max-w-md mx-auto object-contain rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Item 3: Image Left, Text Right */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={IMAGES.chromeEdition}
                  alt="NLF Chrome Edition - 100 Marvel Trading Card Repacks"
                  className="relative w-full max-w-md mx-auto object-contain rounded-xl"
                  loading="lazy"
                />
              </div>
              <div>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 mb-3">EXCLUSIVE DRAWINGS</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                  DRAWINGS & <span className="text-yellow-400">EXCLUSIVE EVENTS</span>
                </h3>
                <p className="text-muted-foreground text-lg mb-4">
                  Join us for future drawings and exclusive events! Our Whatnot shows feature giveaways, 
                  special promotions, and subscriber-only events. The more you participate, the more chances 
                  you have to win exclusive cards and prizes.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Regular giveaways during live shows",
                    "Exclusive subscriber-only events and drops",
                    "Special promotions and flash sales",
                    "Community drawings with premium prizes",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={WHATNOT_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatnotClick}
                >
                  <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
                    <Gift className="w-4 h-4 mr-2" />
                    Join Now — Get $15 Free
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF / STATS ===== */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>1,700+</div>
              <p className="text-sm text-muted-foreground">Cards in Database</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>500+</div>
              <p className="text-sm text-muted-foreground">Packs Per Series</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>100%</div>
              <p className="text-sm text-muted-foreground">Published Checklists</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-red-400 mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>LIVE</div>
              <p className="text-sm text-muted-foreground">Every Pack Opened</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY WHATNOT? ===== */}
      <section className="py-16 lg:py-20">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHY <span className="text-purple-400">WHATNOT</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whatnot is the #1 live shopping platform for collectibles. Here's why collectors love it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                title: "See Everything Live",
                description: "Every card is opened on camera. No hidden packs, no pre-pulls. What you see is what you get.",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20",
              },
              {
                icon: Shield,
                title: "Buyer Protection",
                description: "Whatnot offers full buyer protection on every purchase. Your money is safe, guaranteed.",
                color: "text-green-400",
                bg: "bg-green-500/10",
                border: "border-green-500/20",
              },
              {
                icon: Users,
                title: "Collector Community",
                description: "Chat with fellow collectors during shows. Share reactions, talk cards, and make friends in the hobby.",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                border: "border-purple-500/20",
              },
              {
                icon: Package,
                title: "Fast Shipping",
                description: "Cards ship right after the show. We package everything carefully so your cards arrive safe.",
                color: "text-orange-400",
                bg: "bg-orange-500/10",
                border: "border-orange-500/20",
              },
              {
                icon: DollarSign,
                title: "Great Deals",
                description: "Live auction format means you set the price. Plus your $15 credit makes everything even cheaper.",
                color: "text-yellow-400",
                bg: "bg-yellow-500/10",
                border: "border-yellow-500/20",
              },
              {
                icon: Sparkles,
                title: "Exclusive Drops",
                description: "Some of our best repacks and rarest cards are only available on Whatnot live shows — not on the website.",
                color: "text-pink-400",
                bg: "bg-pink-500/10",
                border: "border-pink-500/20",
              },
            ].map((item, i) => (
              <Card key={i} className={`${item.border} hover:border-opacity-60 transition-colors`}>
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4 border ${item.border}`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LEAD CAPTURE + CTA ===== */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-card via-purple-900/10 to-card border-y border-border">
        <div className="container max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left: Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                STAY IN THE <span className="text-primary">LOOP</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Get notified about upcoming shows, exclusive drawings, new product drops, and special events. 
                We'll never spam you — only the good stuff.
              </p>

              {submitted ? (
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-primary mb-2">You're In!</h3>
                  <p className="text-muted-foreground mb-4">
                    We'll keep you posted on upcoming shows and events.
                  </p>
                  <a
                    href={WHATNOT_INVITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatnotClick}
                  >
                    <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
                      <Gift className="w-4 h-4 mr-2" />
                      Now Claim Your $15 Credit
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First Name (optional)"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your email address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
                    disabled={subscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Signing Up...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Get Show Alerts & Updates
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>

            {/* Right: Whatnot CTA card */}
            <div className="bg-gradient-to-br from-purple-900/30 via-card to-yellow-900/10 border border-purple-500/20 rounded-2xl p-8 text-center">
              <div className="mb-4">
                <div className="w-20 h-20 bg-yellow-500/15 rounded-full flex items-center justify-center mx-auto border-2 border-yellow-500/30">
                  <Gift className="w-10 h-10 text-yellow-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                DON'T FORGET YOUR <span className="text-yellow-400">$15</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                Sign up for Whatnot through our link and your $15 credit is applied instantly. 
                Use it on your very first purchase.
              </p>
              <a
                href={WHATNOT_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatnotClick}
              >
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-6 w-full shadow-lg shadow-yellow-500/20">
                  <Gift className="w-5 h-5 mr-2" />
                  Claim $15 Free Credit
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>

              {/* QR Code for mobile users */}
              <div className="mt-6 flex flex-col items-center">
                <div className="bg-white rounded-xl p-3 shadow-lg shadow-purple-500/20">
                  <img
                    src={IMAGES.whatnotQr}
                    alt="Scan to join Whatnot and get $15 free"
                    className="w-28 h-28"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Or scan to join on your phone</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-16 lg:py-20">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              COMMON <span className="text-primary">QUESTIONS</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is the $15 credit really free?",
                a: "Yes, 100% free. When you sign up for Whatnot through our referral link, Whatnot gives you $15 credit to spend on our shows. There's no catch — it's Whatnot's way of welcoming new users.",
              },
              {
                q: "What is Whatnot?",
                a: "Whatnot is the #1 live shopping app for collectibles. Think of it like a live auction — sellers open packs on camera, and buyers bid or buy in real-time. It's the most exciting way to collect cards.",
              },
              {
                q: "What kind of cards do you sell?",
                a: "We specialize in Marvel trading cards — 2025 Topps Chrome Marvel, Comic Book Heroes, Marvel Mint, Sapphire Edition, and more. Our repacks include numbered parallels, graded slabs (CGC, AGS), chase inserts, and base cards.",
              },
              {
                q: "How do I use the $15 credit?",
                a: "Just sign up through our link and the credit is automatically added to your Whatnot account. Then follow Northland Legendary Finds on Whatnot and join our next live show. The credit applies to your first purchase.",
              },
              {
                q: "Can I also buy from your website?",
                a: "Absolutely! We sell repacks directly on NorthlandLegendaryFinds.com too. Our website has full checklists, a card database with 1,700+ cards, and direct checkout. The Whatnot shows are just one way to shop with us.",
              },
              {
                q: "When are your live shows?",
                a: "We announce shows on our Whatnot page and through our email list. Sign up above to get notified about upcoming shows, drawings, and exclusive events.",
              },
            ].map((faq, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="pt-5 pb-4">
                  <h3 className="font-bold text-lg mb-2 text-foreground">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-background via-yellow-900/5 to-background">
        <div className="container max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/15 border border-yellow-500/40 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-bold">DON'T MISS OUT</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
            <span className="text-yellow-400">$15 FREE</span>
            <br />
            <span className="text-white">IS WAITING FOR YOU</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
            Join the Northland Legendary Finds community on Whatnot. Get your free credit, 
            join our live shows, and start collecting.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WHATNOT_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatnotClick}
            >
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xl px-10 py-7 shadow-lg shadow-yellow-500/20 w-full sm:w-auto">
                <Gift className="w-6 h-6 mr-2" />
                Claim Your $15 Credit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold text-xl px-10 py-7 w-full sm:w-auto">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shop Repacks
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Already on Whatnot?{" "}
            <a
              href={WHATNOT_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Follow us directly
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
