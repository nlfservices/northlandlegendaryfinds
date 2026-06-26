/**
 * Subscriber Hub — Premium gated content for subscribers
 * Features: Giveaway signup form (public), early access repacks, exclusive checklists
 * Non-subscribers see giveaway form + blurred preview with upgrade CTA
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { toast } from "sonner";
import {
  Crown,
  Lock,
  Clock,
  Tag,
  ListChecks,
  Bell,
  Shield,
  Gift,
  ChevronRight,
  Star,
  Sparkles,
  Eye,
  Calendar,
  Package,
  ArrowRight,
  Zap,
  CheckCircle,
  Trophy,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";

// ─── Icon map for benefits ───
const iconMap: Record<string, React.ElementType> = {
  clock: Clock,
  tag: Tag,
  list: ListChecks,
  bell: Bell,
  shield: Shield,
  gift: Gift,
};

export default function SubscriberHub() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const isSubscriber = user?.role === "subscriber" || user?.role === "admin";

  const { data: hubData, isLoading: hubLoading } = trpc.subscriber.hubOverview.useQuery();
  const { data: earlyAccess } = trpc.subscriber.earlyAccessProducts.useQuery(undefined, {
    enabled: isSubscriber,
  });
  const { data: checklists } = trpc.subscriber.exclusiveChecklists.useQuery(undefined, {
    enabled: isSubscriber,
  });
  const { data: benefitsData } = trpc.subscriber.benefits.useQuery();

  const isLoading = authLoading || hubLoading;

  // ─── Giveaway Form State ───
  const [giveawayForm, setGiveawayForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "sms" as "sms" | "email" | "both",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: (data) => {
      setFormSubmitted(true);
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Subscriber Hub | Northland Legendary Finds"
        description="Exclusive subscriber content — early access to repacks, exclusive checklists with estimated values, subscriber-only pricing, and priority drop alerts."
      />

      {/* ===== FAMILY STORY SECTION (PUBLIC) ===== */}
      {!isSubscriber && (
        <section className="relative py-16 sm:py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.10_0.03_285)] via-background to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,oklch(0.20_0.10_145/0.15),transparent_60%)]" />

          <div className="container relative z-10">
            {/* Intro text */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-primary text-sm font-bold tracking-wide uppercase mb-4">Who We Are</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
                <span className="text-foreground">Not a Big Company.</span><br />
                <span className="bg-gradient-to-r from-primary via-[oklch(0.65_0.18_145)] to-[oklch(0.55_0.20_195)] bg-clip-text text-transparent">
                  Just a Family.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A father, his 8-year-old son, and an eye-rolling wife who somehow puts up with boxes of Marvel cards in the living room. We're not backed by investors or running some corporate operation — we're a Minnesota family that loves Marvel, loves collecting, and wanted to build something real.
              </p>
            </div>

            {/* Photo grid - asymmetric layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 max-w-5xl mx-auto mb-12">
              {/* Large hero photo - family together */}
              <div className="md:col-span-7 relative rounded-2xl overflow-hidden aspect-[4/3] group">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/3ofUs-StarWarsStarCruiser_8441a617.jpg"
                  alt="The whole family — Star Wars Star Cruiser adventure"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">The whole crew</p>
                </div>
              </div>

              {/* Right column - stacked */}
              <div className="md:col-span-5 flex flex-col gap-4 sm:gap-6">
                {/* Father & son card ripping */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/LandonReadyToRip_398dd41e.png"
                    alt="Landon ready to rip some packs"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">Landon ready to rip</p>
                  </div>
                </div>
                {/* Card show / convention */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/MNSportsCardShow_6e7594b5.jpg"
                    alt="At the Minnesota Sports Card Show"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">Card show days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Second row - text + photos */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 max-w-5xl mx-auto mb-12">
              {/* Left column - more photos */}
              <div className="md:col-span-5 flex flex-col gap-4 sm:gap-6">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/ToySwapFun!_fd3c1d78.jpg"
                    alt="Toy swap fun at conventions"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">Toy swap fun</p>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Landon&Thor_b859091f.jpg"
                    alt="Landon meeting Thor"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">Meeting Thor!</p>
                  </div>
                </div>
              </div>

              {/* Right column - story text */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <div className="bg-[oklch(0.13_0.03_285)] border border-border/50 rounded-2xl p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    This Started at the Kitchen Table
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      My son Landon is obsessed with Marvel. Spider-Man, Doctor Doom, the X-Men — he knows every character, every storyline. One night we were ripping packs together and he said, <span className="text-foreground italic">"Dad, we should do this for other people too."</span>
                    </p>
                    <p>
                      That's how Northland Legendary Finds started. Not a business plan. Not a pitch deck. Just a kid who wanted to share the excitement of pulling a sick card with other fans.
                    </p>
                    <p>
                      My wife Kaya? She rolls her eyes every time a new shipment shows up. But she's the one who keeps us organized, keeps us honest, and occasionally reminds us that dinner exists.
                    </p>
                    <p className="text-foreground font-medium">
                      We built this community for collectors like us — people who love the hunt, love the characters, and don't need some corporate middleman telling them what to collect.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/about">
                      <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Read Our Full Story
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row - cards showcase */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
              <div className="relative rounded-xl overflow-hidden aspect-square group">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/MNSportsstore4_3c2e5a50.webp"
                  alt="Father and son at the card shop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-square group">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Landon&I-Hayride_a8eeed98.webp"
                  alt="Landon and Dad on a hayride"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-square group">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Landon-Assemble3_5789b932.jpg"
                  alt="Landon with Avengers Assemble"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== GIVEAWAY SIGNUP SECTION (PUBLIC - NO LOGIN REQUIRED) ===== */}
      {!isSubscriber && (
        <section className="relative py-16 sm:py-20 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.12_0.05_145)] via-background to-[oklch(0.10_0.04_285)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,oklch(0.25_0.15_145/0.25),transparent_50%)]" />

          <div className="container relative z-10">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-primary text-sm font-bold tracking-wide">MONTHLY GIVEAWAYS</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                  <span className="text-foreground">Win </span>
                  <span className="bg-gradient-to-r from-primary via-[oklch(0.65_0.18_145)] to-[oklch(0.55_0.20_195)] bg-clip-text text-transparent">
                    Graded Slabs
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  We're giving away graded cards, sealed packs, and gift cards every month leading up to Avengers: Doomsday. Sign up below to enter.
                </p>
              </div>

              {/* Form */}
              {formSubmitted ? (
                <div className="bg-[oklch(0.15_0.04_145)] border border-primary/30 rounded-2xl p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">You're In!</h2>
                  <p className="text-muted-foreground text-lg mb-2">
                    Winners are contacted by SMS. Good luck!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    While you wait, check out our latest <a href="/mcu-news" className="text-primary hover:underline">MCU News</a> and <a href="/characters" className="text-primary hover:underline">Character Guides</a>.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!giveawayForm.email) {
                      toast.error("Please enter your email address.");
                      return;
                    }
                    subscribeMutation.mutate({
                      email: giveawayForm.email,
                      firstName: giveawayForm.firstName || undefined,
                      lastName: giveawayForm.lastName || undefined,
                      phone: giveawayForm.phone || undefined,
                      preferredContact: giveawayForm.preferredContact,
                      source: "giveaway-signup",
                    });
                  }}
                  className="bg-[oklch(0.13_0.03_285)] border border-border/50 rounded-2xl p-6 sm:p-8 space-y-5"
                >
                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">First Name</label>
                      <input
                        type="text"
                        placeholder="Your first name"
                        value={giveawayForm.firstName}
                        onChange={(e) => setGiveawayForm(f => ({ ...f, firstName: e.target.value }))}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">Last Name</label>
                      <input
                        type="text"
                        placeholder="Your last name"
                        value={giveawayForm.lastName}
                        onChange={(e) => setGiveawayForm(f => ({ ...f, lastName: e.target.value }))}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={giveawayForm.email}
                      onChange={(e) => setGiveawayForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                      Phone Number
                      <span className="text-xs text-primary ml-2">— Winners are contacted by SMS</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={giveawayForm.phone}
                      onChange={(e) => setGiveawayForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      What's the best way to reach you?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setGiveawayForm(f => ({ ...f, preferredContact: "sms" }))}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                          giveawayForm.preferredContact === "sms"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-xs font-medium">SMS</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setGiveawayForm(f => ({ ...f, preferredContact: "email" }))}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                          giveawayForm.preferredContact === "email"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <Mail className="w-5 h-5" />
                        <span className="text-xs font-medium">Email</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setGiveawayForm(f => ({ ...f, preferredContact: "both" }))}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                          giveawayForm.preferredContact === "both"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <Phone className="w-5 h-5" />
                        <span className="text-xs font-medium">Both</span>
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={subscribeMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
                  >
                    {subscribeMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                        Entering...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        Enter Giveaway
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground/70 text-center">
                    By signing up, you agree to receive occasional updates about giveaways and Marvel card news. Unsubscribe anytime. We never share your info.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== HERO SECTION ===== */}
      <section className="relative py-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.20_0.08_285)] via-background to-[oklch(0.15_0.06_195)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.30_0.15_285/0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.25_0.12_145/0.2),transparent_60%)]" />

        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[oklch(0.75_0.15_85/0.15)] border border-[oklch(0.75_0.15_85/0.3)] rounded-full mb-6">
              <Crown className="w-4 h-4 text-[oklch(0.75_0.15_85)]" />
              <span className="text-[oklch(0.75_0.15_85)] text-sm font-bold tracking-wide">SUBSCRIBER EXCLUSIVE</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
              <span className="text-[oklch(0.75_0.15_85)]">THE </span>
              <span className="bg-gradient-to-r from-primary via-[oklch(0.65_0.18_195)] to-[oklch(0.55_0.20_285)] bg-clip-text text-transparent">
                VAULT
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isSubscriber
                ? "Welcome back. Your exclusive content is ready — early access drops, detailed checklists, and subscriber-only pricing await."
                : "Unlock early access to repack drops, exclusive checklists with estimated values, subscriber-only pricing, and priority notifications."}
            </p>

            {!isSubscriber && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Link href="/subscribe">
                    <Button size="lg" className="bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold text-lg px-8">
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade to Subscriber
                    </Button>
                  </Link>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button size="lg" className="bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold text-lg px-8">
                      <Crown className="w-5 h-5 mr-2" />
                      Sign In to Subscribe
                    </Button>
                  </a>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-black text-primary">{hubData?.earlyAccessCount ?? "—"}</div>
                <div className="text-sm text-muted-foreground mt-1">Early Access Drops</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[oklch(0.65_0.18_195)]">{hubData?.exclusiveChecklistCount ?? "—"}</div>
                <div className="text-sm text-muted-foreground mt-1">Exclusive Checklists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[oklch(0.75_0.15_85)]">$20</div>
                <div className="text-sm text-muted-foreground mt-1">Saved Per Drop</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[oklch(0.55_0.20_285)]">48hr</div>
                <div className="text-sm text-muted-foreground mt-1">Early Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EARLY ACCESS REPACKS ===== */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-6 h-6 text-[oklch(0.75_0.15_85)]" />
            <h2 className="text-3xl font-black">Early Access Drops</h2>
            {!isSubscriber && <Lock className="w-5 h-5 text-muted-foreground" />}
          </div>

          {isSubscriber && earlyAccess ? (
            <div className="grid md:grid-cols-2 gap-6">
              {earlyAccess.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-card border border-border/50 rounded-xl overflow-hidden hover:border-[oklch(0.75_0.15_85/0.5)] transition-all duration-300"
                >
                  {/* Subscriber badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-[oklch(0.75_0.15_85)] text-black font-bold">
                      <Crown className="w-3 h-3 mr-1" />
                      SUBSCRIBER EXCLUSIVE
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row">
                    {/* Product image */}
                    <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-[oklch(0.20_0.05_285)] to-[oklch(0.15_0.03_195)]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product details */}
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{product.subtitle}</p>

                      {/* Pricing */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-black text-primary">${product.subscriberPrice}</span>
                        <span className="text-lg text-muted-foreground line-through">${product.price}</span>
                        <Badge variant="outline" className="border-primary text-primary">
                          Save ${product.savings}
                        </Badge>
                      </div>

                      {/* Launch dates */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-[oklch(0.75_0.15_85)]" />
                          <span className="text-[oklch(0.75_0.15_85)] font-semibold">
                            Subscriber Access: {new Date(product.subscriberLaunchDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Public Launch: {new Date(product.publicLaunchDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-1.5">
                        {product.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button className="mt-4 bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold">
                        <Bell className="w-4 h-4 mr-2" />
                        Notify Me When Live
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Non-subscriber: blurred preview */
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-6 blur-sm pointer-events-none select-none">
                {(hubData?.earlyAccessPreview ?? []).map((product) => (
                  <div
                    key={product.id}
                    className="bg-card border border-border/50 rounded-xl overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-[oklch(0.20_0.05_285)] to-[oklch(0.15_0.03_195)]">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-6">
                        <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.subtitle}</p>
                        <div className="mt-4 space-y-2">
                          <div className="h-4 bg-muted/50 rounded w-3/4" />
                          <div className="h-4 bg-muted/50 rounded w-1/2" />
                          <div className="h-4 bg-muted/50 rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overlay CTA */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card/95 backdrop-blur-sm border border-[oklch(0.75_0.15_85/0.3)] rounded-2xl p-8 text-center max-w-md shadow-2xl">
                  <Lock className="w-12 h-12 text-[oklch(0.75_0.15_85)] mx-auto mb-4" />
                  <h3 className="text-2xl font-black mb-2">Subscriber Only</h3>
                  <p className="text-muted-foreground mb-6">
                    Get 48-hour early access to every repack drop with exclusive subscriber pricing. Save $20 per purchase.
                  </p>
                  {isAuthenticated ? (
                    <Link href="/subscribe">
                      <Button size="lg" className="bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold">
                        <Crown className="w-5 h-5 mr-2" />
                        Upgrade Now
                      </Button>
                    </Link>
                  ) : (
                    <a href={getLoginUrl()}>
                      <Button size="lg" className="bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold">
                        Sign In to Subscribe
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== EXCLUSIVE CHECKLISTS ===== */}
      <section className="py-16 border-t border-border/50 bg-[oklch(0.14_0.03_285)]">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <ListChecks className="w-6 h-6 text-[oklch(0.65_0.18_195)]" />
            <h2 className="text-3xl font-black">Exclusive Checklists</h2>
            {!isSubscriber && <Lock className="w-5 h-5 text-muted-foreground" />}
          </div>

          {isSubscriber && checklists ? (
            <div className="grid md:grid-cols-2 gap-6">
              {checklists.map((checklist) => (
                <div
                  key={checklist.id}
                  className="group bg-card border border-border/50 rounded-xl p-6 hover:border-[oklch(0.65_0.18_195/0.5)] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {checklist.isNew && (
                        <Badge className="bg-primary text-primary-foreground mb-2">
                          <Sparkles className="w-3 h-3 mr-1" />
                          NEW
                        </Badge>
                      )}
                      <h3 className="text-lg font-bold">{checklist.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[oklch(0.65_0.18_195)]">{checklist.cardCount}</div>
                      <div className="text-xs text-muted-foreground">cards</div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{checklist.description}</p>

                  {/* Tier breakdown */}
                  <div className="space-y-2 mb-4">
                    {checklist.tiers.map((tier, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: [
                                "oklch(0.75 0.20 145)",
                                "oklch(0.65 0.18 195)",
                                "oklch(0.55 0.20 285)",
                                "oklch(0.75 0.15 85)",
                                "oklch(0.65 0.15 30)",
                              ][i % 5],
                            }}
                          />
                          <span className="text-foreground">{tier.name}</span>
                        </div>
                        <span className="text-muted-foreground">{tier.count} cards</span>
                      </div>
                    ))}
                  </div>

                  {/* Value and hit ratio */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <div>
                      <div className="text-xs text-muted-foreground">Est. Value Range</div>
                      <div className="text-sm font-bold text-[oklch(0.75_0.15_85)]">{checklist.estimatedValueRange}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Hit Ratio</div>
                      <div className="text-sm font-bold text-primary">{checklist.hitRatio}</div>
                    </div>
                  </div>

                  {/* Release date */}
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Release: {new Date(checklist.releaseDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Non-subscriber: blurred preview */
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-6 blur-sm pointer-events-none select-none">
                {(hubData?.checklistPreview ?? []).map((checklist) => (
                  <div key={checklist.id} className="bg-card border border-border/50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        {checklist.isNew && (
                          <Badge className="bg-primary text-primary-foreground mb-2">NEW</Badge>
                        )}
                        <h3 className="text-lg font-bold">{checklist.title}</h3>
                      </div>
                      <div className="text-2xl font-black text-[oklch(0.65_0.18_195)]">{checklist.cardCount}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted/50 rounded w-full" />
                      <div className="h-3 bg-muted/50 rounded w-4/5" />
                      <div className="h-3 bg-muted/50 rounded w-3/5" />
                      <div className="h-3 bg-muted/50 rounded w-4/5" />
                      <div className="h-3 bg-muted/50 rounded w-2/5" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card/95 backdrop-blur-sm border border-[oklch(0.65_0.18_195/0.3)] rounded-2xl p-8 text-center max-w-md shadow-2xl">
                  <Eye className="w-12 h-12 text-[oklch(0.65_0.18_195)] mx-auto mb-4" />
                  <h3 className="text-2xl font-black mb-2">Exclusive Checklists</h3>
                  <p className="text-muted-foreground mb-6">
                    Get full card-by-card breakdowns with estimated values, hit ratios, and tier details before anyone else.
                  </p>
                  {isAuthenticated ? (
                    <Link href="/subscribe">
                      <Button size="lg" className="bg-[oklch(0.65_0.18_195)] hover:bg-[oklch(0.60_0.18_195)] text-black font-bold">
                        <Crown className="w-5 h-5 mr-2" />
                        Upgrade Now
                      </Button>
                    </Link>
                  ) : (
                    <a href={getLoginUrl()}>
                      <Button size="lg" className="bg-[oklch(0.65_0.18_195)] hover:bg-[oklch(0.60_0.18_195)] text-black font-bold">
                        Sign In to Subscribe
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== SUBSCRIBER BENEFITS ===== */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4">Why Subscribe?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join the inner circle of Marvel card collectors. Here's what you unlock.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(benefitsData?.benefits ?? []).map((benefit, i) => {
              const Icon = iconMap[benefit.icon] || Star;
              return (
                <div
                  key={i}
                  className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          {!isSubscriber && (
            <div className="mt-12 text-center">
              <div className="inline-block bg-gradient-to-r from-[oklch(0.75_0.15_85/0.1)] via-[oklch(0.55_0.20_285/0.1)] to-[oklch(0.65_0.18_195/0.1)] border border-[oklch(0.75_0.15_85/0.3)] rounded-2xl p-8 max-w-lg">
                <Crown className="w-10 h-10 text-[oklch(0.75_0.15_85)] mx-auto mb-4" />
                <h3 className="text-2xl font-black mb-2">Ready to Join?</h3>
                <p className="text-muted-foreground mb-6">
                  Unlock everything above — early access, exclusive checklists, subscriber pricing, and more.
                </p>
                {isAuthenticated ? (
                  <Link href="/subscribe">
                    <Button size="lg" className="bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold text-lg px-8">
                      <Crown className="w-5 h-5 mr-2" />
                      Become a Subscriber
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button size="lg" className="bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold text-lg px-8">
                      Sign In to Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
