/**
 * NLF Rewards — Loyalty Program Landing Page
 *
 * Purpose: Showcase the NLF Rewards tier system, drive early signups,
 * and capture leads into GHL CRM with "loyalty-member" tag.
 *
 * This page is built but NOT linked in navigation — hidden until launch.
 * Accessible directly via /rewards for preview/testing.
 *
 * Features:
 * - Hero section with "Coming Soon" teaser
 * - 4-tier system visual (Collector → Silver → Gold → Legendary)
 * - How to earn points breakdown
 * - VIP early signup form with GHL dual-capture
 * - FAQ section
 * - SEO meta tags
 */

import { useState, useRef, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star, Crown, Zap, Trophy, Gift, ShoppingCart, Users,
  Mail, ArrowRight, CheckCircle2, Loader2, Sparkles,
  Heart, Package, Truck, Clock, Shield, ChevronDown,
  ChevronUp, DollarSign
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import SEO, { breadcrumbJsonLd, faqJsonLd } from "@/components/SEO";

// ============================================================
// CONSTANTS
// ============================================================

const NLF_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/rwZcaJaSCFxygqjF.png";
const HERO_BG = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hero-banner-jniBj55ukeiEDpJxc2aLgB.webp";

const GHL_FORM_URL = "https://api.leadconnectorhq.com/widget/form/5SL68SbkAFgq85FPiJw6";
const GHL_FORM_ID = "5SL68SbkAFgq85FPiJw6";
const GHL_LOCATION_ID = "KFJlOhDocOFLVA5rLqVh";

const TIER_ICONS = {
  collector: <Star className="w-8 h-8" />,
  silver: <Shield className="w-8 h-8" />,
  gold: <Crown className="w-8 h-8" />,
  legendary: <Zap className="w-8 h-8" />,
};

const TIER_GRADIENTS = {
  collector: "from-gray-600 to-gray-400",
  silver: "from-slate-400 to-slate-200",
  gold: "from-yellow-500 to-amber-300",
  legendary: "from-purple-600 via-violet-500 to-purple-400",
};

const TIER_BORDER_COLORS = {
  collector: "border-gray-500/40",
  silver: "border-slate-300/40",
  gold: "border-yellow-500/40",
  legendary: "border-purple-500/60",
};

const TIER_GLOW = {
  collector: "",
  silver: "shadow-[0_0_15px_rgba(148,163,184,0.15)]",
  gold: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
  legendary: "shadow-[0_0_30px_rgba(139,92,246,0.3)]",
};

// ============================================================
// EARN POINTS DATA
// ============================================================

const EARN_METHODS = [
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    title: "Make a Purchase",
    description: "Earn 10 points for every $1 you spend on repacks, graded cards, and more.",
    points: "10 pts / $1",
    color: "text-primary",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Refer a Friend",
    description: "Share your referral code. When a friend joins, you both earn bonus points.",
    points: "+100 pts",
    color: "text-secondary",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Join the Newsletter",
    description: "Subscribe to our newsletter for exclusive drops, tips, and bonus points.",
    points: "+50 pts",
    color: "text-accent",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Follow Us on Social",
    description: "Follow NLF on Instagram, Facebook, or YouTube for social media points.",
    points: "+25 pts",
    color: "text-purple-400",
  },
  {
    icon: <Gift className="w-6 h-6" />,
    title: "Birthday Bonus",
    description: "Tell us your birthday and receive a special points bonus every year.",
    points: "+200 pts",
    color: "text-pink-400",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Sign Up Bonus",
    description: "Get an instant welcome bonus just for joining the NLF Rewards program.",
    points: "+50 pts",
    color: "text-yellow-400",
  },
];

// ============================================================
// FAQ DATA
// ============================================================

const FAQ_ITEMS = [
  {
    question: "When does the NLF Rewards program launch?",
    answer:
      "We're putting the finishing touches on the program now. Sign up for the VIP early access list to be the first to know when it goes live — and to lock in your welcome bonus.",
  },
  {
    question: "How do I earn points?",
    answer:
      "You earn points by making purchases (10 pts per $1), referring friends (+100 pts), subscribing to our newsletter (+50 pts), following us on social media (+25 pts each), and on your birthday (+200 pts). Higher tiers earn multiplied points on purchases.",
  },
  {
    question: "What are the tier levels?",
    answer:
      "There are four tiers: Collector (starting tier), Silver (500 lifetime pts), Gold (2,000 lifetime pts), and Legendary (5,000 lifetime pts). Each tier unlocks better perks like higher point multipliers, free shipping, exclusive drawings, and early access to drops.",
  },
  {
    question: "Do my points expire?",
    answer:
      "Points remain active as long as your account has activity within a 12-month period. Any purchase, referral, or social engagement resets the clock.",
  },
  {
    question: "What can I redeem points for?",
    answer:
      "Rewards include discount codes, free shipping, exclusive repacks only available to loyalty members, bonus drawing entries, early access to new products, and NLF merchandise. Higher tiers unlock premium rewards.",
  },
  {
    question: "Can I earn points on Whatnot purchases?",
    answer:
      "We're working on integrating Whatnot purchase tracking. For now, points are earned through our website store, referrals, and engagement activities. Stay tuned for Whatnot integration updates.",
  },
  {
    question: "What happens if I sign up early?",
    answer:
      "Early VIP signups receive their welcome bonus as soon as the program launches, plus exclusive early access to the first wave of redeemable rewards before they're available to everyone else.",
  },
];

// ============================================================
// COMPONENT
// ============================================================

export default function Rewards() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch tier info from backend
  const { data: tierData } = trpc.loyalty.getTierInfo.useQuery();

  const enrollMutation = trpc.loyalty.enroll.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      if (data.isExisting) {
        toast.success("You're already on the VIP list! We'll notify you at launch.");
      } else {
        toast.success("Welcome to the VIP list! You've earned 50 bonus points.");
      }
      // Fire Facebook Pixel Lead event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: "Loyalty VIP Signup",
          content_category: "loyalty-program",
        });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  /**
   * GHL hidden iframe dual-capture (same pattern as NewsletterSignup)
   */
  const submitToGHLIframe = (emailVal: string, firstNameVal: string) => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const tempForm = document.createElement("form");
      tempForm.method = "POST";
      tempForm.action = GHL_FORM_URL;
      tempForm.target = "ghl-loyalty-iframe";
      tempForm.style.display = "none";

      const emailInput = document.createElement("input");
      emailInput.type = "hidden";
      emailInput.name = "email";
      emailInput.value = emailVal;
      tempForm.appendChild(emailInput);

      if (firstNameVal) {
        const nameInput = document.createElement("input");
        nameInput.type = "hidden";
        nameInput.name = "first_name";
        nameInput.value = firstNameVal;
        tempForm.appendChild(nameInput);
      }

      const formIdInput = document.createElement("input");
      formIdInput.type = "hidden";
      formIdInput.name = "formId";
      formIdInput.value = GHL_FORM_ID;
      tempForm.appendChild(formIdInput);

      const locationInput = document.createElement("input");
      locationInput.type = "hidden";
      locationInput.name = "locationId";
      locationInput.value = GHL_LOCATION_ID;
      tempForm.appendChild(locationInput);

      document.body.appendChild(tempForm);
      tempForm.submit();

      setTimeout(() => {
        document.body.removeChild(tempForm);
      }, 2000);
    } catch (err) {
      console.warn("[Loyalty] GHL iframe submit failed:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || enrollMutation.isPending) return;

    // 1. tRPC mutation (primary)
    enrollMutation.mutate({
      email: email.trim(),
      firstName: firstName.trim() || undefined,
      birthday: birthday.trim() || undefined,
    });

    // 2. GHL hidden iframe (backup)
    submitToGHLIframe(email.trim(), firstName.trim());
  };

  const tiers = useMemo(() => {
    if (tierData?.tiers) return tierData.tiers;
    // Fallback static data
    return [
      { id: "collector" as const, name: "Collector", minPoints: 0, color: "#6B7280", perks: ["Earn 10 points per $1 spent", "Birthday bonus points", "Access to members-only drawings", "Early notifications on new drops"] },
      { id: "silver" as const, name: "Silver", minPoints: 500, color: "#9CA3AF", perks: ["Everything in Collector tier", "1.25x points multiplier", "Free shipping on orders over $150", "Exclusive Silver-tier monthly drawing", "Early access to new products (12hr head start)"] },
      { id: "gold" as const, name: "Gold", minPoints: 2000, color: "#F59E0B", perks: ["Everything in Silver tier", "1.5x points multiplier", "Free shipping on orders over $99", "Exclusive Gold-tier monthly drawing", "Early access to new products (24hr head start)", "Priority customer support"] },
      { id: "legendary" as const, name: "Legendary", minPoints: 5000, color: "#8B5CF6", perks: ["Everything in Gold tier", "2x points multiplier", "Free shipping on ALL orders", "Exclusive Legendary-tier monthly drawing", "48hr early access to ALL drops", "Annual exclusive repack (free)", "Direct line to NLF team", "Name on the Legendary Wall of Fame"] },
    ];
  }, [tierData]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="NLF Rewards — Loyalty Program"
        description="Join the NLF Rewards program and earn points on every purchase. Unlock exclusive tiers, free shipping, early access to drops, members-only drawings, and more."
        path="/rewards"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "NLF Rewards", url: "/rewards" },
          ]),
          faqJsonLd(FAQ_ITEMS),
        ]}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 py-16 lg:py-24">
          <div className="max-w-3xl">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/15 border border-purple-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-bold tracking-wide uppercase">
                Coming Soon
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] mb-6">
              <span className="text-foreground">NLF</span>{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Rewards
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-4">
              Earn points on every purchase. Climb the ranks. Unlock exclusive perks, free shipping,
              early access to drops, and members-only drawings.
            </p>

            <p className="text-base text-purple-300/80 mb-8">
              Sign up now for the VIP early access list and lock in your{" "}
              <span className="text-primary font-semibold">50 bonus points</span> at launch.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6"
                onClick={() => {
                  document.getElementById("signup-section")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Gift className="w-5 h-5 mr-2" />
                Join the VIP List
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500/40 text-purple-300 hover:bg-purple-500/10 font-semibold text-lg px-8 py-6"
                onClick={() => {
                  document.getElementById("tiers-section")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Trophy className="w-5 h-5 mr-2" />
                View Tier Perks
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUICK STATS BAR ===== */}
      <section className="relative z-10 -mt-8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: "Tiers to Climb", value: "4", icon: <Trophy className="w-5 h-5 text-yellow-400" /> },
              { label: "Ways to Earn", value: "6+", icon: <Sparkles className="w-5 h-5 text-primary" /> },
              { label: "Points per $1", value: "10", icon: <DollarSign className="w-5 h-5 text-secondary" /> },
              { label: "Signup Bonus", value: "50 pts", icon: <Gift className="w-5 h-5 text-purple-400" /> },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-4 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {stat.icon}
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                </div>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIER SYSTEM ===== */}
      <section id="tiers-section" className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center mb-12 lg:mb-16">
            <Badge variant="outline" className="border-purple-500/40 text-purple-300 mb-4">
              TIER SYSTEM
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Four Tiers. Endless Rewards.
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every purchase and engagement earns you lifetime points. As your points grow,
              you unlock higher tiers with increasingly powerful perks.
            </p>
          </div>

          {/* Tier Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => {
              const tierId = tier.id as keyof typeof TIER_ICONS;
              return (
                <Card
                  key={tier.id}
                  className={`relative overflow-hidden bg-card/60 backdrop-blur-sm border ${TIER_BORDER_COLORS[tierId]} ${TIER_GLOW[tierId]} transition-all duration-300 hover:scale-[1.02]`}
                >
                  {/* Tier header gradient */}
                  <div className={`h-2 bg-gradient-to-r ${TIER_GRADIENTS[tierId]}`} />

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${TIER_GRADIENTS[tierId]} text-white`}>
                        {TIER_ICONS[tierId]}
                      </div>
                      {index === 3 && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          ULTIMATE
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {tier.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {tier.minPoints === 0
                        ? "Starting Tier"
                        : `${tier.minPoints.toLocaleString()} lifetime points`}
                    </p>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tier progression visual */}
          <div className="hidden lg:flex items-center justify-center mt-12 gap-0">
            {tiers.map((tier, index) => {
              const tierId = tier.id as keyof typeof TIER_GRADIENTS;
              return (
                <div key={tier.id} className="flex items-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${TIER_GRADIENTS[tierId]} flex items-center justify-center text-white shadow-lg`}>
                    {TIER_ICONS[tierId]}
                  </div>
                  {index < tiers.length - 1 && (
                    <div className="w-24 h-0.5 bg-gradient-to-r from-border to-border/30 mx-2 relative">
                      <ArrowRight className="w-4 h-4 text-muted-foreground absolute -top-1.5 right-0" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW TO EARN POINTS ===== */}
      <section className="py-20 lg:py-28 bg-card/30">
        <div className="container">
          <div className="text-center mb-12 lg:mb-16">
            <Badge variant="outline" className="border-primary/40 text-primary mb-4">
              EARN POINTS
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Six Ways to Stack Points
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Points aren't just for purchases. Engage with the NLF community and watch your balance grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EARN_METHODS.map((method, index) => (
              <Card
                key={index}
                className="bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-muted/50 ${method.color} group-hover:scale-110 transition-transform`}>
                      {method.icon}
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold">
                      {method.points}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Points multiplier callout */}
          <div className="mt-12 bg-gradient-to-r from-purple-500/10 via-primary/10 to-accent/10 border border-purple-500/20 rounded-2xl p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="p-4 rounded-2xl bg-purple-500/20">
                <Zap className="w-10 h-10 text-purple-400" />
              </div>
              <div className="text-center lg:text-left flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Tier Multipliers Supercharge Your Earnings
                </h3>
                <p className="text-muted-foreground">
                  Silver members earn <span className="text-secondary font-semibold">1.25x</span> points on purchases.
                  Gold earns <span className="text-yellow-400 font-semibold">1.5x</span>.
                  Legendary members earn a massive <span className="text-purple-400 font-semibold">2x</span> on every dollar spent.
                  The higher you climb, the faster you earn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REWARDS PREVIEW ===== */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center mb-12 lg:mb-16">
            <Badge variant="outline" className="border-accent/40 text-accent mb-4">
              REDEEM REWARDS
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Spend Points on What Matters
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From discount codes to exclusive repacks you can't buy anywhere else — your points unlock real value.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: "Discount Codes",
                description: "Redeem points for percentage-off or dollar-off codes on your next order.",
                tier: "All Tiers",
                tierColor: "text-gray-400",
              },
              {
                icon: <Truck className="w-8 h-8" />,
                title: "Free Shipping",
                description: "Skip the shipping cost entirely. Higher tiers get lower thresholds automatically.",
                tier: "Silver+",
                tierColor: "text-slate-300",
              },
              {
                icon: <Package className="w-8 h-8" />,
                title: "Exclusive Repacks",
                description: "Members-only repack products with premium card selections not available in the shop.",
                tier: "Gold+",
                tierColor: "text-yellow-400",
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Bonus Drawing Entries",
                description: "Stack extra entries into monthly giveaway drawings for graded slabs and rare cards.",
                tier: "All Tiers",
                tierColor: "text-gray-400",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Early Access Passes",
                description: "Get first dibs on new product drops before they hit the public store.",
                tier: "Silver+",
                tierColor: "text-slate-300",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "NLF Merch & Swag",
                description: "Exclusive NLF-branded merchandise, stickers, and collector accessories.",
                tier: "Legendary",
                tierColor: "text-purple-400",
              },
            ].map((reward, index) => (
              <Card
                key={index}
                className="bg-card/60 backdrop-blur-sm border border-border/50 hover:border-accent/30 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-accent/10 text-accent">
                      {reward.icon}
                    </div>
                    <Badge variant="outline" className={`${reward.tierColor} border-current/30`}>
                      {reward.tier}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{reward.title}</h3>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VIP SIGNUP FORM ===== */}
      <section id="signup-section" className="py-20 lg:py-28 bg-card/30">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="outline" className="border-primary/40 text-primary mb-4">
                EARLY ACCESS
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Join the VIP Early Access List
              </h2>
              <p className="text-muted-foreground text-lg">
                Be the first to know when NLF Rewards launches. Early signups get their{" "}
                <span className="text-primary font-semibold">50 welcome bonus points</span>{" "}
                credited instantly at launch.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-12 bg-card/60 rounded-2xl border border-primary/30">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">You're on the List!</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We'll notify you the moment NLF Rewards goes live. Your 50 bonus points are locked in.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/shop">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Browse the Shop
                    </Button>
                  </Link>
                  <Link href="/the-collector">
                    <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                      Read The Collector Blog
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card/60 rounded-2xl border border-border/50 p-6 lg:p-8">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="loyalty-first-name" className="block text-sm font-medium text-foreground mb-1.5">
                      First Name
                    </label>
                    <input
                      id="loyalty-first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your first name"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="loyalty-birthday" className="block text-sm font-medium text-foreground mb-1.5">
                      Birthday <span className="text-muted-foreground">(MM/DD)</span>
                    </label>
                    <input
                      id="loyalty-birthday"
                      type="text"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      placeholder="03/15"
                      maxLength={5}
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="loyalty-email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="loyalty-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!email.trim() || enrollMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
                >
                  {enrollMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing Up...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 mr-2" />
                      Join the VIP List — Earn 50 Bonus Points
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  No spam, ever. We'll only email you about the rewards launch and exclusive drops.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="border-secondary/40 text-secondary mb-4">
                FAQ
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="bg-card/60 border border-border/50 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/20 transition-colors"
                  >
                    <span className="text-foreground font-medium pr-4">{item.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-5 pb-5">
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-purple-500/10 via-primary/10 to-accent/10 border-t border-b border-purple-500/20">
        <div className="container text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join the VIP list today and be the first to unlock rewards when the program launches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8"
              onClick={() => {
                document.getElementById("signup-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Gift className="w-5 h-5 mr-2" />
              Join the VIP List
            </Button>
            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-muted font-semibold text-lg px-8"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shop Repacks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hidden GHL iframe for dual-capture */}
      <iframe
        ref={iframeRef}
        name="ghl-loyalty-iframe"
        title="GHL Loyalty Form"
        style={{ display: "none", width: 0, height: 0 }}
        tabIndex={-1}
      />
    </div>
  );
}

