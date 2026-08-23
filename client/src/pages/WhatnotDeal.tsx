/**
 * Whatnot Referral Landing Page â€” Facebook Ads Funnel (CRO Optimized)
 * 
 * Purpose: Convert cold Facebook ad traffic into:
 * 1. Whatnot signups via referral link ($15 credit for them, $5 for NLF)
 * 2. Email/lead captures for future marketing
 * 3. Repack shop visitors
 * 
 * CRO Optimizations:
 * - Standalone page (no main nav/footer) â€” logo-only minimal header
 * - No email popup (suppressed in EmailCapturePopup)
 * - All CTAs consolidated to "Get My $15 Credit"
 * - Social proof trust bar below hero
 * - Condensed sections for mobile scrolling
 * - Sticky mobile CTA at bottom of screen
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
const WHATNOT_STORE = "https://whatnot.com/invite/northlandfinds";

// Product images from CDN
const IMAGES = {
  cosmicDrop: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-nlf-variant-2CkMPP3CsZhFkFXpzSuZkV.webp",
  chromeEdition: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-100-pack-LsACR5odDHrd8r7na6iEeJ.webp",
  gambitDeck: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/gambit-deck-52-singles-agMj46W47777xcjTUjBw5L.webp",
  nlfLogo: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/rwZcaJaSCFxygqjF.png",
  heroBg: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hero-banner-jniBj55ukeiEDpJxc2aLgB.webp",
  whatnotQr: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-whatnot-qr_a49cbbc8.jpg",
};

export default function WhatnotDeal() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: () => {
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

  // Show sticky CTA after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Get $15 Off Your First Live Marvel Card Break Purchase"
        description="Sign up for Whatnot through Northland Legendary Finds and get $15 credit towards your first purchase at our live Marvel trading card breaks, repacks, and graded slab auctions."
        path="/free-credit"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "$15 Credit Offer", url: "/free-credit" },
        ])}
      />

      {/* ===== MINIMAL HEADER (Logo Only) ===== */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src={"https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/site-assets/NLF-Logo-MainLogo.png"}
              alt="NLF"
              className="h-12 w-12 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-primary font-bold text-lg tracking-wider leading-tight" style={{ fontFamily: "'Anton', sans-serif" }}>
                NORTHLAND
              </span>
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase -mt-0.5">
                Legendary Finds
              </span>
            </div>
          </Link>
          <a
            href={WHATNOT_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatnotClick}
          >
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold hidden sm:flex">
              <Gift className="w-4 h-4 mr-1.5" />
              Get $15 Credit
            </Button>
          </a>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[480px] sm:min-h-[550px] lg:min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.heroBg} alt="" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="py-8 lg:py-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/15 border border-yellow-500/40 rounded-full mb-5 animate-pulse">
                <Gift className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-bold tracking-wide">LIMITED TIME OFFER</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.9] mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-yellow-400">$15 OFF</span>
                <br />
                <span className="text-white">YOUR FIRST</span>
                <br />
                <span className="text-primary">LIVE PURCHASE</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-lg mb-6 leading-relaxed">
                Sign up on Whatnot through our link and get <span className="text-yellow-400 font-bold">$15 in credit</span> applied 
                automatically at checkout on your first purchase. Use it at our live Marvel card breaks â€” graded slabs, numbered parallels, chase cards.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <a
                  href={WHATNOT_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatnotClick}
                >
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-6 w-full sm:w-auto shadow-lg shadow-yellow-500/20">
                    <Gift className="w-5 h-5 mr-2" />
                    Get My $15 Credit
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary" />
                  No Minimum Spend
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Auto-Applied at Checkout
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  30-Second Signup
                </span>
              </div>
            </div>

            {/* Right: Product showcase */}
            <div className="hidden lg:flex flex-col items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-8 bg-yellow-500/10 rounded-full blur-3xl" />
                <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl" />
                <div className="absolute -top-4 -right-4 z-20 bg-yellow-500 text-black font-black text-2xl rounded-full w-20 h-20 flex items-center justify-center shadow-lg shadow-yellow-500/30 border-4 border-yellow-300" style={{ fontFamily: "'Anton', sans-serif" }}>
                  $15
                </div>
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

      {/* ===== SOCIAL PROOF TRUST BAR ===== */}
      <section className="py-5 bg-card border-y border-border">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {/* Star rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-medium">5-Star Rated</span>
            </div>
            {/* Collector count */}
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground font-medium">Join <span className="text-foreground font-bold">1,700+</span> Collectors</span>
            </div>
            {/* Cards */}
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-muted-foreground font-medium"><span className="text-foreground font-bold">100%</span> Published Checklists</span>
            </div>
            {/* Live */}
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-400" />
              <span className="text-sm text-muted-foreground font-medium">Every Pack Opened <span className="text-foreground font-bold">LIVE</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS (Condensed) ===== */}
      <section id="how-it-works" className="py-12 lg:py-16">
        <div className="container max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
              HOW TO GET YOUR <span className="text-yellow-400">$15 CREDIT</span>
            </h2>
            <p className="text-muted-foreground">Less than a minute. Sign up, get credit, start shopping.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative text-center group">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
                <span className="text-3xl font-bold text-yellow-400" style={{ fontFamily: "'Anton', sans-serif" }}>1</span>
              </div>
              <h3 className="text-lg font-bold mb-1">Sign Up via Our Link</h3>
              <p className="text-sm text-muted-foreground">Click our referral link and create your free Whatnot account. Takes 30 seconds.</p>
              <div className="hidden md:block absolute top-8 -right-3 text-muted-foreground/30">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            <div className="relative text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <span className="text-3xl font-bold text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>2</span>
              </div>
              <h3 className="text-lg font-bold mb-1">$15 Credit Added</h3>
              <p className="text-sm text-muted-foreground">$15 is added to your account automatically. You'll also auto-follow our page.</p>
              <div className="hidden md:block absolute top-8 -right-3 text-muted-foreground/30">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                <span className="text-3xl font-bold text-purple-400" style={{ fontFamily: "'Anton', sans-serif" }}>3</span>
              </div>
              <h3 className="text-lg font-bold mb-1">Use It on Your First Buy</h3>
              <p className="text-sm text-muted-foreground">Credit applies at checkout on your first purchase. No minimum spend!</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={handleWhatnotClick}>
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-10 py-6 shadow-lg shadow-yellow-500/20">
                <Gift className="w-5 h-5 mr-2" />
                Get My $15 Credit
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU'LL FIND (Updated) ===== */}
      <section className="py-12 lg:py-16 bg-card border-y border-border">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHAT YOU'LL FIND ON <span className="text-purple-400">OUR SHOWS</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Singles, box breaks, case breaks, and combo shows where we do a little bit of everything â€” plus giveaways for our entire community, not just buyers.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Singles Shows */}
            <Card className="border-primary/20 overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-purple-500/5 flex items-center justify-center p-6">
                <img src={IMAGES.cosmicDrop} alt="Singles Shows" className="w-full h-full object-contain" loading="lazy" />
              </div>
              <CardContent className="pt-4 pb-5">
                <Badge className="bg-primary/10 text-primary border-primary/30 mb-2">SINGLES</Badge>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>SINGLES SHOWS</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />Hand-picked individual cards</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />Graded slabs (CGC & AGS)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />Numbered parallels (/199 to /1)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Box & Case Breaks */}
            <Card className="border-red-500/20 overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-red-500/5 to-purple-500/5 flex items-center justify-center p-6">
                <img src={IMAGES.gambitDeck} alt="Box & Case Breaks" className="w-full h-full object-contain" loading="lazy" />
              </div>
              <CardContent className="pt-4 pb-5">
                <Badge className="bg-red-500/10 text-red-400 border-red-500/30 mb-2">LIVE BREAKS</Badge>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>BOX & CASE BREAKS</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />Every pack ripped live on camera</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />Full box & case break options</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />Real-time chat & reactions</li>
                </ul>
              </CardContent>
            </Card>

            {/* Combo Shows */}
            <Card className="border-purple-500/20 overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-500/5 to-primary/5 flex items-center justify-center p-6">
                <img src={IMAGES.chromeEdition} alt="Combo Shows" className="w-full h-full object-contain" loading="lazy" />
              </div>
              <CardContent className="pt-4 pb-5">
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 mb-2">COMBO</Badge>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>COMBO SHOWS</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />A little bit of everything</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />Singles, breaks & repacks</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />Something for every collector</li>
                </ul>
              </CardContent>
            </Card>

            {/* Giveaways & Community */}
            <Card className="border-yellow-500/20 overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-yellow-500/5 to-primary/5 flex items-center justify-center relative p-6">
                <div className="absolute top-3 right-3">
                  <Badge className="bg-yellow-500 text-black font-bold border-0 animate-pulse">GIVEAWAY</Badge>
                </div>
                <Trophy className="w-24 h-24 text-yellow-400/60" />
              </div>
              <CardContent className="pt-4 pb-5">
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 mb-2">GIVEAWAYS</Badge>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>GIVEAWAYS & COMMUNITY</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />Giveaways for ALL fans, not just buyers</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />Rewards for our loyal community</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />Helping new streamers level up</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-10">
            <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={handleWhatnotClick}>
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-10 py-6 shadow-lg shadow-yellow-500/20">
                <Gift className="w-5 h-5 mr-2" />
                Get My $15 Credit
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ===== WHY WHATNOT? (Condensed to 2x3 grid) ===== */}
      <section className="py-12 lg:py-16">
        <div className="container max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHY <span className="text-purple-400">WHATNOT</span>?
            </h2>
            <p className="text-muted-foreground">The #1 live shopping platform for collectibles.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Eye, title: "See Everything Live", desc: "Every card opened on camera. No hidden packs.", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              { icon: Shield, title: "Buyer Protection", desc: "Full buyer protection on every purchase.", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
              { icon: Users, title: "Collector Community", desc: "Chat with fellow collectors during shows.", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
              { icon: Package, title: "Fast Shipping", desc: "Cards ship right after the show.", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
              { icon: DollarSign, title: "Great Deals", desc: "Auction format + your $15 credit towards first purchase.", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
              { icon: Sparkles, title: "Exclusive Drops", desc: "Rare cards only on live shows.", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
            ].map((item, i) => (
              <Card key={i} className={`${item.border}`}>
                <CardContent className="pt-5 pb-4">
                  <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center mb-3 border ${item.border}`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LEAD CAPTURE + CTA ===== */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-card via-purple-900/10 to-card border-y border-border">
        <div className="container max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                STAY IN THE <span className="text-primary">LOOP</span>
              </h2>
              <p className="text-muted-foreground mb-5">
                Get notified about upcoming shows, exclusive drawings, and new drops. No spam â€” only the good stuff.
              </p>

              {submitted ? (
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-primary mb-2">You're In!</h3>
                  <p className="text-muted-foreground mb-4">We'll keep you posted on upcoming shows.</p>
                  <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={handleWhatnotClick}>
                    <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
                      <Gift className="w-4 h-4 mr-2" />
                      Get My $15 Credit
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="First Name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="email"
                    placeholder="Your email address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
                    disabled={subscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Signing Up...</>
                    ) : (
                      <><Zap className="w-5 h-5 mr-2" />Get Show Alerts & Updates</>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">No spam, ever. Unsubscribe anytime.</p>
                </form>
              )}
            </div>

            {/* Right: Whatnot CTA card */}
            <div className="bg-gradient-to-br from-purple-900/30 via-card to-yellow-900/10 border border-purple-500/20 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-yellow-500/15 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-500/30">
                <Gift className="w-10 h-10 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                DON'T FORGET YOUR <span className="text-yellow-400">$15</span>
              </h3>
              <p className="text-muted-foreground mb-5">
                Sign up through our link â€” $15 credit applied automatically at checkout on your first purchase.
              </p>
              <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={handleWhatnotClick}>
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-6 w-full shadow-lg shadow-yellow-500/20">
                  <Gift className="w-5 h-5 mr-2" />
                  Get My $15 Credit
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>

              <div className="mt-5 flex flex-col items-center">
                <div className="bg-white rounded-xl p-3 shadow-lg shadow-purple-500/20">
                  <img src={IMAGES.whatnotQr} alt="Scan to join Whatnot" className="w-24 h-24" loading="lazy" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Or scan to join on your phone</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ (Condensed) ===== */}
      <section className="py-12 lg:py-16">
        <div className="container max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ fontFamily: "'Anton', sans-serif" }}>
            COMMON <span className="text-primary">QUESTIONS</span>
          </h2>

          <div className="space-y-3">
            {[
              { q: "How does the $15 credit work?", a: "Sign up through our referral link and Whatnot adds $15 to your account. It's applied automatically at checkout on your first purchase â€” no code needed, no minimum spend." },
              { q: "What is Whatnot?", a: "The #1 live shopping app for collectibles. Sellers open packs on camera, buyers bid or buy in real-time." },
              { q: "What kind of cards do you sell?", a: "Marvel trading cards â€” Topps Chrome, Comic Book Heroes, Marvel Mint, Sapphire Edition. Numbered parallels, graded slabs, chase inserts." },
              { q: "Does the $15 credit expire?", a: "Yes, the credit is valid for 90 days after signup. Use it on your first purchase at any of our live shows within that window." },
              { q: "Can I also buy from your website?", a: "Yes! We sell repacks directly at NorthlandLegendaryFinds.com with full checklists and a 1,700+ card database." },
            ].map((faq, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="pt-4 pb-3">
                  <h3 className="font-bold mb-1">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-background via-yellow-900/5 to-background">
        <div className="container max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
            <span className="text-yellow-400">$15 CREDIT</span>
            <br />
            <span className="text-white">IS WAITING FOR YOU</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            Join the NLF community on Whatnot. Get $15 towards your first purchase and start collecting.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={handleWhatnotClick}>
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xl px-10 py-7 shadow-lg shadow-yellow-500/20 w-full sm:w-auto">
                <Gift className="w-6 h-6 mr-2" />
                Get My $15 Credit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>

          <p className="text-sm text-muted-foreground mt-5">
            Already on Whatnot?{" "}
            <a href={WHATNOT_STORE} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">
              Follow us directly
            </a>
            {" Â· "}
            <Link href="/shop" className="text-primary hover:text-primary/80 underline">
              Shop repacks on our site
            </Link>
          </p>
        </div>
      </section>

      {/* ===== MINIMAL FOOTER ===== */}
      <footer className="py-6 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Northland Legendary Finds. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Main Site</Link>
          </div>
        </div>
      </footer>

      {/* ===== STICKY MOBILE CTA ===== */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 p-3 bg-background/95 backdrop-blur-md border-t border-border transition-transform duration-300 lg:hidden ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <a href={WHATNOT_INVITE} target="_blank" rel="noopener noreferrer" onClick={handleWhatnotClick} className="block">
          <Button size="lg" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg py-5 shadow-lg shadow-yellow-500/20">
            <Gift className="w-5 h-5 mr-2" />
            Get My $15 Credit
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </a>
      </div>
    </div>
  );
}

